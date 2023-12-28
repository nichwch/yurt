<script lang='ts'>
import {page} from '$app/stores'
</script>
{#key $page.params.pathName}
<slot />
{/key}