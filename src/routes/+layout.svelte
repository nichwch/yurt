<script lang="ts">
	import '../app.css';
	import {page} from '$app/stores'
	import {focusedText, related} from './searchStores'
	import {afterNavigate} from '$app/navigation'
	export let data;
	const closeSidebar = () => {
		related.set(null)
		focusedText.set(null)
	}
	afterNavigate(closeSidebar)
	$:console.log($related, $focusedText);
</script>

<div class="h-full flex">
	<div class='p-2 pt-10 overflow-y-auto basis-1/5'>
		{#each data.posts as post}
			<a class="block px-1 transition-colors" class:bg-red-400={$page.params.pathName===post} href={'/' + post}>{post.replace('posts/','')}</a>
		{/each}
	</div>
	<div class='flex-grow overflow-y-auto py-10'>
	<slot />
	</div>
	{#if $focusedText!==null}
	<div class='p-2 pt-10 basis-1/5 h-full flex flex-col'>
		<h1 class='text-red-700'>related <button class='float-right hover:underline' on:click={closeSidebar}>[X]</button></h1>
		<div class='overflow-y-auto  w-full'>
		{#each $related.filter((el) => el.content?.trim()!==$focusedText?.trim()) as entry}
		<div class='py-2 w-full'>
			<div class='text-sm'>
				from: <a class='text-red-700 underline' href={'/'+entry.parent}>{entry.parent.split('/').pop()} </a>
			</div>

			<div class='w-full break-words'>
				{entry.content}
			</div>
		</div	>

		{/each}
		</div>
	</div>
	{/if}
</div>
