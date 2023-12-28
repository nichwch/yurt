<script lang="ts">
	import '../app.css';
	export let data;
</script>

<div class="flex p-2">
	<div>
		{#each data.posts as post}
			<a class="block" href={'/' + post}>{post}</a>
		{/each}
	</div>
	<slot />
</div>
