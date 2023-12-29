<script lang='ts'>
import {modalStore} from './modalStore';
import {page} from '$app/stores'
export let posts;
</script>

	<button
    on:click={() => modalStore.set(false)}
    class=" z-40 absolute top-0 left-0 bg-slate-500 opacity-50 w-full h-full"
  />
  <div class=' z-50 absolute p-2  pt-10 left-[12.5%] top-[10%] overflow-y-auto w-3/4 h-4/5 bg-white border border-black'>
	{#each posts as post}
		<a class="block px-1 transition-colors" class:bg-red-400={$page.params.pathName===post} href={'/' + post}>{post.replace('posts/','')}</a>
	{/each}
	</div>