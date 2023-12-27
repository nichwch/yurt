import { getAllEligibleFiles } from '$lib/getAllEligibleFiles';
import type { LayoutServerLoad } from './$types';

export const prerender = true;
export const load = (async () => {
    const allFiles = getAllEligibleFiles('./posts');
    console.log(allFiles)
    return {
        posts:allFiles
    };
}) satisfies LayoutServerLoad;