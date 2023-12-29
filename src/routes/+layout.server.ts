import { getAllEligibleFiles } from '$lib/getAllEligibleFiles';
import type { LayoutServerLoad } from './$types';
import fs from 'fs/promises';

export const prerender = true;
const DATE_FILE_NAME = '.datefile.json';
export const load = (async () => {
	const allFiles = getAllEligibleFiles('./posts');
	// sort files by their creation date
	const dateFile = await fs.readFile(DATE_FILE_NAME, 'utf-8');
	const dateIndex = JSON.parse(dateFile);

	allFiles.sort((a: string, b: string) => {
		return new Date(dateIndex[b]).getTime() - new Date(dateIndex[a]).getTime();
	});

	return {
		posts: allFiles
	};
}) satisfies LayoutServerLoad;
