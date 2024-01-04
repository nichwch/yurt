import { Command } from 'commander';
import {
	POST_DIR,
	createDBFile,
	dbPath,
	deleteIndicesForFiles
} from '../yurtify-utils/createDBFileFunction.mjs';
import { restoreFromFile } from '@orama/plugin-data-persistence/server';
import { getAllEligibleFiles } from '../yurtify-utils/getFiles.mjs';
import fs from 'fs/promises';
import { splitText } from '../yurtify-utils/splitText.mjs';
import { queryDB } from '../yurtify-utils/queryDB.mjs';
import pLimit from 'p-limit';
import { convertPathNameToIndexName } from '../yurtify-utils/convertPathNameToIndexName.mjs';
import { createDateFile } from '../yurtify-utils/createDateFileFunction.mjs';
import { createTagFile } from '../yurtify-utils/createTagFileFunction.mjs';

const program = new Command();
export const INDEXED_FILES = 'indexedfiles.config.json';
console.log('HERE?');

program.option('--existingDB');

program.parse();

const options = program.opts();
console.log('OPTIONS', options);
const existingDB = options.existingDB ? true : false;
console.log(existingDB);

if (!existingDB) {
	console.log('no existing DB, will reindex');
	await createDBFile();
}

const db = await restoreFromFile('binary', dbPath);

async function processSegment(segment, resultsObj) {
	console.log('processing segment ', segment);
	if (segment.trim().length < 0) return;
	const mostSimilarSegments = await queryDB(db, segment, 0.8, 20);
	console.log('most similar:', mostSimilarSegments.hits);
	resultsObj[segment] = mostSimilarSegments.hits.map((hit) => ({
		content: hit.document.content,
		parent: hit.document.parent,
		score: hit.score
	}));
	// let's try a flat design first.
}

async function processFile(filePath) {
	console.log('processing file ', filePath);
	const fileContents = await fs.readFile(filePath, 'utf8');
	const segments = splitText(fileContents);
	const promises = [];
	const resultsObj = {};
	for (let segment of segments) {
		promises.push(processSegment(segment, resultsObj));
	}
	await Promise.all(promises);
	const json = JSON.stringify(resultsObj);

	const pathNameWithoutDot = convertPathNameToIndexName(filePath);
	console.log('pathname', filePath, pathNameWithoutDot);
	fs.writeFile(`./post-index/${pathNameWithoutDot}.json`, json, 'utf8');
}

let previouslyIndexed;
try {
	const rawPreviouslyIndexed = await fs.readFile(INDEXED_FILES, 'utf-8');
	previouslyIndexed = JSON.parse(rawPreviouslyIndexed);
} catch (e) {
	previouslyIndexed = [];
}
const allFiles = getAllEligibleFiles(POST_DIR);
const allFilesSet = new Set(allFiles);
const deletedFiles = previouslyIndexed.filter((file) => !allFilesSet.has(file));

console.log('deleted', deletedFiles);
await deleteIndicesForFiles(deletedFiles);
// delete existing entries for all eligible
const limit = pLimit(5);
await createDateFile();
await createTagFile();
await Promise.all(allFiles.map((file) => limit(() => processFile(file))));
await fs.writeFile(INDEXED_FILES, JSON.stringify(allFiles), 'utf-8');

// console.log(resultObj);
