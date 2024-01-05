import { getAllEligibleFiles } from '$lib/getAllEligibleFiles';
import { DATE_FILE_NAME, TAG_FILE_NAME, NOW_FILE_NAME } from '../lib';
import type { LayoutServerLoad } from './$types';
import fs from 'fs/promises';

export const prerender = true;

export const load = (async () => {
	const allFiles = getAllEligibleFiles('./posts');
	// sort files by their creation date
	const dateFile = await fs.readFile(DATE_FILE_NAME, 'utf-8');
	const dateIndex = JSON.parse(dateFile);

	const tagFile = await fs.readFile(TAG_FILE_NAME, 'utf-8');
	const tagIndex = JSON.parse(tagFile);

	const nowPage = await fs.readFile(NOW_FILE_NAME, 'utf-8');

	allFiles.sort((a: string, b: string) => {
		return new Date(dateIndex[b]).getTime() - new Date(dateIndex[a]).getTime();
	});

	return {
		posts: allFiles,
		tagIndex,
		nowPage
	};
}) satisfies LayoutServerLoad;
