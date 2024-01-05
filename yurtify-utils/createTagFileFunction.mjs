import { TAG_FILE_NAME } from './configFiles.mjs';
import { POST_DIR } from './createDBFileFunction.mjs';
import { getAllEligibleFiles } from './getFiles.mjs';
import fs from 'fs/promises';

export const createTagFile = async () => {
	const allFiles = getAllEligibleFiles(POST_DIR);
	let tagFileContents = {};
	try {
		const oldTagFileRaw = await fs.readFile(TAG_FILE_NAME, 'utf-8');
		tagFileContents = JSON.parse(oldTagFileRaw);
	} catch (e) {
		//
	}
	for (let file of allFiles) {
		/*
        Don't override existing tags
        Generate new entries for new files
        */
		if (tagFileContents[file]) continue;
		tagFileContents[file] = [];
	}

	const json = JSON.stringify(tagFileContents, null, 2);
	await fs.writeFile(TAG_FILE_NAME, json, 'utf-8');
};
