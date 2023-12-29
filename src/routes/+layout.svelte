<script lang="ts">
	import '../app.css';
	import {page} from '$app/stores'
	import {focusedText, related} from './searchStores'
	import {afterNavigate} from '$app/navigation'
	import SearchEntry from './SearchEntry.svelte'
	import {modalStore} from './modalStore'
	import MobileModalNav from './MobileModalNav.svelte'
	export let data;
	const closeSidebar = () => {
		related.set(null)
		focusedText.set(null)
	}
	afterNavigate(() =>{
		closeSidebar();
		modalStore.set(false);
	})
	$:console.log($related, $focusedText);
	$: relatedContent = $related?.filter((el) => el.content?.trim()!==$focusedText?.trim());

</script>

<button class='absolute top-3 left-3 px-1 border border-black bg-red-400' on:click={()=>(modalStore.set(!$modalStore))}>
menu
</button>
<div class="h-full flex">
	<!-- desktop menu -->
	<div class='hidden md:block p-2 pt-10 overflow-y-auto basis-1/5'>
		{#each data.posts as post}
			<a class="block px-1 transition-colors" class:bg-red-400={$page.params.pathName===post} href={'/' + post}>{post.replace('posts/','')}</a>
		{/each}
	</div>
	<!-- mobile menu -->
	{#if $modalStore}
	<MobileModalNav posts={data.posts}/>
	{/if}
	<div class='flex-grow overflow-y-auto py-10'>
	<slot />
	</div>
	{#if $focusedText!==null}
	<!-- desktop search results -->
	<div class='hidden md:flex flex-col p-2 pt-10 basis-1/5 w-1/5 h-full '>
		<h1 class='text-red-700'>related <button class='float-right hover:underline' on:click={closeSidebar}>[X]</button></h1>
		<div class='overflow-y-auto  w-full'>
		{#each relatedContent as entry}
			<SearchEntry {entry} />
		{/each}
		{#if relatedContent.length === 0}
		<div>no related content. </div>
		{/if}
		</div>
	</div>
	<!-- mobile search results -->
	<div class='md:hidden absolute flex flex-col h-2/5 bottom-0 left-0 w-full bg-white border-t border-t-black '>
		<h1 class='text-red-700 px-2 border-b border-b-black'>related <button class='float-right hover:underline' on:click={closeSidebar}>[X]</button></h1>
		<div class='overflow-y-auto  w-full px-2'>
			{#each relatedContent as entry}
				<SearchEntry {entry} />
			{/each}
			{#if relatedContent.length === 0}
			<div>no related content. </div>
			{/if}
		</div>
	</div>
	{/if}
</div>
