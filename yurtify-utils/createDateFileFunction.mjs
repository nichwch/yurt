import { DATE_FILE_NAME } from './configFiles.mjs';
import { POST_DIR } from './createDBFileFunction.mjs';
import { getAllEligibleFiles } from './getFiles.mjs';
import fs from 'fs/promises';

export const createDateFile = async () => {
	const allFiles = getAllEligibleFiles(POST_DIR);
	let dateFileContents = {};
	try {
		const oldDateFileRaw = await fs.readFile(DATE_FILE_NAME, 'utf-8');
		dateFileContents = JSON.parse(oldDateFileRaw);
	} catch (e) {
		// console.error(e);
	}
	for (let file of allFiles) {
		/*
        if there is an existing date, leave it be
        if you really want to recreate the entire date file, 
        just delete the file and run this function again
        */

		if (dateFileContents[file]) continue;
		// otherwise, use the system creation date time
		const fileCreationDate = (await fs.stat(file)).mtime;
		dateFileContents[file] = fileCreationDate;
	}

	const json = JSON.stringify(dateFileContents, null, 2);
	await fs.writeFile(DATE_FILE_NAME, json, 'utf-8');
};
