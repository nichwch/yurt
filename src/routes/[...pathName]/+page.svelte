<script lang="ts">
    import type { PageData } from './$types';
   import {splitText} from '$lib/splitText' 
    export let data: PageData;
    const segments = splitText(data.pageContent)
    const pageIndex = data.pageIndex;
</script>
<div>
{#each segments as segment}
<div on:click={() => {
    console.log(pageIndex[segment])
}}>{segment}</div>
{/each}
</div>