import {Command} from 'commander'
import { POST_DIR, createDBFile, dbPath } from './yurtify-utils/createDBFileFunction.mjs';
import { restoreFromFile } from '@orama/plugin-data-persistence/server';
import { getAllEligibleFiles } from './yurtify-utils/getAllEligibleFiles.mjs';
import fs from 'fs/promises'
import { splitText } from './yurtify-utils/splitText.mjs';
import { queryDB } from './yurtify-utils/queryDB.mjs';
import pLimit from 'p-limit'
const program = new Command();
console.log("HERE?")

program
  .option('--existingDB')

program.parse();

const options = program.opts();
console.log("OPTIONS",options)
const existingDB = options.existingDB ? true : false;
console.log(existingDB);

if(!existingDB){
  console.log('no existing DB, will reindex')
  await createDBFile();
}



const db = await restoreFromFile("binary", dbPath);

async function processSegment (segment, resultsObj){
  console.log('processing segment ', segment);
  if(segment.trim().length < 0) return;
  const mostSimilarSegments = await queryDB(db, segment, 0.85, 10);
  console.log('most similar:', mostSimilarSegments.hits);
  resultsObj[segment] = mostSimilarSegments.hits.map((hit) => ({
    content:hit.document.content,
    parent:hit.document.parent,
    score:hit.score
  }))
  // let's try a flat design first.
}

async function processFile (filePath) {
  console.log('processing file ',filePath)
  const fileContents = await fs.readFile(filePath, 'utf8');
  const segments = splitText(fileContents);
  const promises = [];
  const resultsObj = {};
  for(let segment of segments){
    promises.push(processSegment(segment,resultsObj));
  }
  await Promise.all(promises);
  const json = JSON.stringify(resultsObj);

  const pathNameWithoutDot = filePath.split('.')?.[0].replaceAll('/','--');
  console.log('pathname',filePath, pathNameWithoutDot)
  fs.writeFile(`.${pathNameWithoutDot}/.json`, json, 'utf8');
}


const allFiles = getAllEligibleFiles(POST_DIR);
const limit = pLimit(5);
await Promise.all( allFiles.map((file) => (limit(() => processFile(file)))))

// console.log(resultObj);
