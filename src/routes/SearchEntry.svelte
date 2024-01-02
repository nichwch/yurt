<script lang="ts">
	export let entry;
</script>

<div class="py-2 w-full">
	<div class="text-sm">
		<a class="underline" href={'/' + entry.parent + '?search=' + entry.content}
			>{entry.parent.split('/').pop()}
		</a>
		<span class="text-red-700">[{Math.floor(entry.score * 100)}% similar]</span>
	</div>

	<div class="w-full break-words whitespace-pre-wrap">
		{entry.content}
	</div>
</div>
