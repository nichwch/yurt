import { create, insert, count, search, remove } from '@orama/orama';
import { persistToFile, restoreFromFile } from '@orama/plugin-data-persistence/server';
import fs from 'fs';
import { getAllNewlyEditedFiles } from './getFiles.mjs';
import { getHFEmbedding } from './getHFEmbedding.mjs';
import { GROUP_DELIM, splitText } from './splitText.mjs';

export const dbPath = `.dbfile.msp`;
export const POST_DIR = './posts';
let segmentCount = 0;

let db;
try {
	// build on top of previous db
	db = await restoreFromFile('binary', dbPath);
	console.log('BUILDING ON TOP OF DB FILE');
	const dbCount = await count(db);
	console.log(`db has ${dbCount} entries`);
} catch (e) {
	console.error(e);
	console.log('STARTING FRESH DB FILE');
	db = await create({
		schema: {
			parent: 'string',
			tags: 'string[]',
			embedding: 'vector[384]',
			content: 'string',
			// unix timestamp
			editDate: 'number'
		},
		id: 'oramadb'
	});
}

const processSegment = async (segment, fileName) => {
	segment = segment.trim();
	if (segment.length === 0) return;
	if (segment === GROUP_DELIM) return;
	segmentCount++;
	const thisSegment = segmentCount;
	console.log('processing segment', segmentCount);
	/** @typedef {string[]|null} tags */
	const tags =
		segment.match(/\[\[.*?\]\]/g)?.map((tag) => {
			return tag.replace('[[', '').replace(']]', '');
		}) || [];
	try {
		// console.log("attempting to get embedding");
		const embedding = await getHFEmbedding(segment);
		// console.log("got embedding", embedding);
		const entry = {
			parent: fileName,
			tags,
			embedding,
			content: segment,
			editTime: new Date().getTime()
		};
		await insert(db, entry);
		console.log(`inserted segment ${thisSegment} successfully`);
	} catch (e) {
		console.error(e);
	}
};

const indexFile = async (filePath, fileContents) => {
	// this does not need to happen synchronously before new insertions!
	// we already have the IDs to delete
	const segments = splitText(fileContents);
	console.log('indexing following contents...', segments, fileContents);
	const promises = [];
	for (let segment of segments) {
		promises.push(processSegment(segment, filePath));
	}
	await Promise.all(promises);
};

const accessAndIndexFile = async (filePath) => {
	const file = fs.readFileSync(filePath, 'utf8');
	await indexFile(filePath, file);
};

/** @param {string}  property*/
/** @param {string}  term*/
const searchDBExact = async (property, term) => {
	const results = await search(db, {
		term,
		properties: [property],
		exact: true,
		limit: 9999
	});
	// log.log("blurry results");
	// log.log(results.hits.map((res) => res.document[property]));
	// orama sometimes doesn't return exact results!! even with exact
	const trueResults = results.hits.filter((result) => {
		return result.document[property] === term;
	});
	console.log('true results', trueResults);
	return trueResults;
};

const indexDirectory = async (directory) => {
	console.log('indexing directory...');
	const { default: pLimit } = await import('p-limit');
	const allFiles = getAllNewlyEditedFiles(directory);
	// need to delete existing ones
	console.log('INDEXING THE FOLLOWING FILES:');
	console.log(allFiles);
	const promises = [];

	// delete existing indices for edited files
	const entriesInEditedFiles = [];
	for (let file of allFiles) {
		const entriesInFile = await searchDBExact('parent', file);
		entriesInEditedFiles.push(...entriesInFile);
	}
	console.log('entries in edited files', entriesInEditedFiles);
	let deletePromises = [];
	for (let entry of entriesInEditedFiles) {
		deletePromises.push(remove(db, entry.id));
	}
	await Promise.all(deletePromises);

	// then insert the new entries from the modified files
	// batch these 4 files at a time
	// doing it completely parallel crashes everything
	const limit = pLimit(5);
	for (let file of allFiles) {
		promises.push(limit(() => accessAndIndexFile(file)));
	}
	try {
		await Promise.all(promises);
	} catch (e) {
		console.error(e);
	} finally {
		if (allFiles.length > 0) {
			await persistToFile(db, 'binary', dbPath);
		}
		const dbCount = await count(db);
		console.log(`db has ${dbCount} entries`);
	}
};

export const createDBFile = async () => {
	await indexDirectory(POST_DIR);
	await persistToFile(db, 'binary', dbPath);
};
