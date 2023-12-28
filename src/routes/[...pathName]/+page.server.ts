import { convertPathNameToIndexName } from '$lib/convertPathNameToIndexName';
import fs from 'fs/promises'
import type { PageServerLoad } from '../notes/[...pathName]/$types';

export const load = (async ({params}) => {
    const path = params.pathName;
    const pageContent = await fs.readFile(path, 'utf-8')
    const pageIndexPath = `./post-index/${convertPathNameToIndexName(path)}.json`
    const pageIndexRaw = await fs.readFile(pageIndexPath,'utf-8')
    const pageIndex = JSON.parse(pageIndexRaw)

    return {pageContent, pageIndex}
}) satisfies PageServerLoad;