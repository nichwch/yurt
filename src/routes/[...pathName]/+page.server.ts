import { convertPathNameToIndexName } from '$lib/convertPathNameToIndexName';
import fs from 'fs/promises';
import type { PageServerLoad } from '../[...pathName]/$types';
import { BIRTHDAY_FILE_NAME, DATE_FILE_NAME } from '../../lib';

export const load = (async ({ params }) => {
	const path = params.pathName;
	const pageContent = await fs.readFile(path, 'utf-8');
	const pageIndexPath = `./post-index/${convertPathNameToIndexName(path)}.json`;
	const pageIndexRaw = await fs.readFile(pageIndexPath, 'utf-8');
	const pageIndex = JSON.parse(pageIndexRaw);

	const dateFile = await fs.readFile(DATE_FILE_NAME, 'utf-8');
	const dateIndex = JSON.parse(dateFile);
	const postCreationDate = dateIndex[path];

	const birthday = await fs.readFile(BIRTHDAY_FILE_NAME, 'utf-8');

	return { pageContent, pageIndex, postCreationDate, birthday };
}) satisfies PageServerLoad;
