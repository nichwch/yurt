<script lang="ts">
	import { page } from '$app/stores';
</script>

{#key $page.params.pathName}
	{#key $page.url.search}
		<slot />
	{/key}
{/key}
