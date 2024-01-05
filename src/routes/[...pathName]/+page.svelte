<script lang="ts">
	import type { PageData } from './$types';
	import SvelteMarkdown from 'svelte-markdown';
	import { splitText } from '$lib/splitText';
	import { focusedText, related } from '../searchStores';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import { AGE_YOU_STOPPED_BEING_CRINGE, CRINGE_MESSAGE } from '../../lib';
	export let data: PageData;
	const segments = splitText(data.pageContent);
	const pageIndex = data.pageIndex;
	const birthday = new Date(data.birthday);
	const publishDate = new Date(data.postCreationDate);
	const ageAtPublishInMS = new Date(publishDate.getTime() - birthday.getTime());
	const ageAtPublish = Math.abs(ageAtPublishInMS.getUTCFullYear() - 1970);

	const scrollToAndSelectBlock = async () => {
		const searchedText = $page.url.searchParams?.get('search');
		if (!searchedText) return;
		const indexOfText = segments
			// need to trim because db entries are trimmed
			.map((row) => {
				return row.trim();
			})
			?.indexOf(searchedText);
		if (indexOfText === undefined || indexOfText === null) return;
		/*
    In Overlay.svelte, each block has its id as `editor-block-${indexOfText}`
    We tick to wait for update to trickle down to Overlay

    NB:This function has to be in this component because we want to run it after fetching the file 
    from the electron API.   
    */
		await tick();
		const blockToScrollAndHighlight = document.getElementById(`editor-block-${indexOfText}`);
		const selection = window.getSelection();
		const range = document.createRange();
		// @ts-ignore
		range.selectNodeContents(blockToScrollAndHighlight);
		selection?.removeAllRanges();
		selection?.addRange(range);
		blockToScrollAndHighlight?.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
	};

	afterNavigate(scrollToAndSelectBlock);

	$: postName = $page.params.pathName.split('/').pop()?.split('.')?.[0];
	$: postTags = data.tagIndex?.[$page.params.pathName] || [];
	$: console.log({ data, ageAtPublish, ageAtPublishInMS });
</script>

<title>{postName}</title>
<div class="md:w-[26rem] lg:w-[36rem] mx-auto md:p-0 px-5">
	<div class="mb-5 px-1">
		<h1 class="text-lg font-semibold">{postName}</h1>
		<div class="mb-2">
			<i class="mr-3">{publishDate.toDateString()} </i>
			{#each postTags as tag}
				<span class="mx-1 mb-1 px-1 border border-black bg-red-200">{tag}</span>
			{/each}
		</div>
		{#if ageAtPublish < AGE_YOU_STOPPED_BEING_CRINGE}
			<div class="p-2 border border-red-800 bg-red-200 text-sm text-red-800">
				{CRINGE_MESSAGE}
			</div>
		{/if}
	</div>

	{#each segments as segment, index}
		{#if segment.trim().length > 0}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			{#if segment.trim().startsWith('//')}
				<div
					role="article"
					id="editor-block-{index}"
					class="text-left text-green-800 block p-1 break-words whitespace-pre-wrap"
				>
					<SvelteMarkdown source={segment} isInline />
				</div>
			{:else if segment.trim() === '~'}
				<div class="text-gray-300">~</div>
			{:else}
				<div
					role="article"
					id="editor-block-{index}"
					class="text-left block p-1 break-words md:hover:bg-red-100 transition-colors whitespace-pre-wrap"
					class:bg-red-100={$focusedText?.trim() === segment?.trim()}
					class:border={$focusedText?.trim() === segment?.trim()}
					class:border-red-500={$focusedText?.trim() === segment?.trim()}
					on:click={() => {
						focusedText.set(segment);
						related.set(pageIndex[segment]);
					}}
				>
					<SvelteMarkdown source={segment} isInline />
				</div>
			{/if}
		{:else}
			<br />
		{/if}
	{/each}
</div>

<style>
	div :global(h1) {
		font-size: theme('fontSize.xl');
	}

	div :global(a) {
		color: theme('colors.blue.500');
		text-decoration: underline;
	}
	div :global(a:visited) {
		color: theme('colors.purple.500');
	}
</style>
