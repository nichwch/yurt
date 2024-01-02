import fs from 'fs';
import path from 'path';

export const LAST_INDEXED_DATE_FILE = 'lastindexeddate.config.txt';

export const getAllEligibleFiles = (dirPath, files = []) => {
	const entries = fs.readdirSync(dirPath);

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry);
		if (fs.statSync(fullPath).isDirectory()) {
			getAllEligibleFiles(fullPath, files);
		} else {
			files.push(fullPath);
		}
	}

	const usableFiles = files.filter((file) => {
		const extension = file.split('.').pop();
		// don't index hidden files
		if (extension?.[0] === '.') return false;
		// don't index txt or md files
		if (extension !== 'txt' && extension !== 'md') return false;
		return true;
	});

	return usableFiles;
};

export const getAllNewlyEditedFiles = (dirPath) => {
	const allFiles = getAllEligibleFiles(dirPath);

	let lastIndexedTime;
	try {
		lastIndexedTime = parseInt(fs.readFileSync(LAST_INDEXED_DATE_FILE, 'utf-8'));
	} catch (e) {
		lastIndexedTime = 0;
	}

	const filesEditedSinceLastIndex = allFiles.filter((file) => {
		const lastModifiedTime = fs.statSync(file).mtime.getTime();
		console.log(lastModifiedTime, lastIndexedTime);
		if (lastModifiedTime < lastIndexedTime) return false;
		return true;
	});
	fs.writeFileSync(LAST_INDEXED_DATE_FILE, new Date().getTime().toString(), 'utf-8');
	return filesEditedSinceLastIndex;
};
