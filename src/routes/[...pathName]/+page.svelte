<script lang="ts">
    import type { PageData } from './$types';
   import {splitText} from '$lib/splitText' 
   import {focusedText, related} from '../searchStores'
    export let data: PageData;
    const segments = splitText(data.pageContent)
    const pageIndex = data.pageIndex;
</script>
<div class='w-[36rem] mx-auto'>
{#each segments as segment}
{#if segment.trim().length > 0}
<div class='p-1 break-words hover:bg-red-100 transition-colors' 
class:bg-red-100={$focusedText?.trim()===segment?.trim()}
on:click={() => {
   focusedText.set(segment);
   related.set(pageIndex[segment])
}}>{segment}</div>
{:else} 
<br/>
{/if}


{/each}
</div>