<script lang="ts">
	import { page } from '$app/stores';
	import { focusedTag, showingTagFilters } from './sidebarStores';
	export let tags: string[];
</script>

<div>
	<button
		class="px-1 bg-red-400 hover:bg-red-500 transition-colors border border-black"
		on:click={() => ($showingTagFilters = !$showingTagFilters)}
		>{#if $showingTagFilters}
			hide tags
		{:else}
			show tags
		{/if}</button
	>
	{#if $focusedTag !== null}
		<span class="text-red-800">posts tagged: {$focusedTag}</span>
	{/if}
</div>

{#if $showingTagFilters}
	<div class="border border-black bg-white shadow p-2 w-56">
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
