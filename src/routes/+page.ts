import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	const nowPage = data.nowPage;
	if (nowPage && nowPage.length > 0) throw redirect(302, nowPage);
	return {};
}) satisfies PageLoad;
