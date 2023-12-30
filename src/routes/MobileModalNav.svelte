<script lang="ts">
	import { modalStore } from './sidebarStores';
	import { page } from '$app/stores';
	import TagFilter from './TagFilter.svelte';
	export let posts: string[];
	export let tags: string[];
</script>

<button
	on:click={() => modalStore.set(false)}
	class="md:hidden z-40 absolute top-0 left-0 bg-slate-500 opacity-50 w-full h-full"
/>
<div
	class="md:hidden z-50 absolute p-2 pt-10 left-[12.5%] top-[10%] overflow-y-auto w-4/5 h-5/6 bg-white border border-black"
>
	<div class="absolute top-3 left-2"><TagFilter {tags} /></div>

	{#each posts as post}
		<a
			class="block px-1 transition-colors mb-2"
			class:bg-red-400={$page.params.pathName === post}
			href={'/' + post}>{post.replace('posts/', '')}</a
		>
	{/each}
</div>
