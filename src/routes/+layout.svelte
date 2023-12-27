<script lang='ts'>
    import "../app.css";
    export let data;
  </script>
<div class='flex'>
    <div>
        {#each data.posts as post}
        <a class='block' href={'/notes/'+post}>{post}</a>
        {/each}
    </div>
    <slot />
</div>