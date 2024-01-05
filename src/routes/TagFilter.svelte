<script lang="ts">
	import { page } from '$app/stores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { focusedTag, showingTagFilters } from './sidebarStores';
	export let tags: string[];

	const hideFiltersOnClick = (event: MouseEvent) => {
		let element = event.target as HTMLElement;
		let found = false;

		while (element) {
			if (element.className.includes('filterMenu')) {
				found = true;
				break;
			}
			element = element.parentElement as HTMLElement;
		}
		console.log(found, element);
		if (!found) {
			console.log('setting to false');
			showingTagFilters.set(false);
		}
	};
	onMount(() => {
		window.addEventListener('click', hideFiltersOnClick);
		return () => {
			window.removeEventListener('click', hideFiltersOnClick);
		};
	});

	$: console.log('showing filters?', $showingTagFilters);
</script>

<div>
	<button
		class="px-1 bg-red-400 hover:bg-red-500 transition-colors border border-black shadow filterMenu"
		on:click={() => {
			console.log('working');
			showingTagFilters.set(!$showingTagFilters);
		}}
		>{#if $showingTagFilters}
			hide tags
		{:else}
			{#if $focusedTag}
				tagged: {$focusedTag}
			{:else}
				show tags
			{/if}
		{/if}</button
	>
	<a
		class="inline-block px-1 bg-blue-300 hover:bg-blue-400 transition-colors border border-black shadow"
		href="/">now</a
	>
</div>

{#if $showingTagFilters}
	<div class="border border-black bg-white shadow p-2 w-56 filterMenu">
		{#each tags as tag}
			<button
				on:click={() => {
					if ($focusedTag !== tag) focusedTag.set(tag);
					else focusedTag.set(null);
					showingTagFilters.set(false);
				}}
				class:bg-red-400={$focusedTag === tag}
				class="px-1 mr-2 mb-1 border border-black bg-red-100 hover:bg-red-400 transition-colors"
				>{tag}</button
			>
		{/each}
	</div>
{/if}
