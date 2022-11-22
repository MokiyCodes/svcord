<script lang="ts">
  import Counter from '../lib/Counter.svelte';
  import Link from '../lib/Link.svelte';
</script>

<p>
  <button on:click={()=>{
    // @ts-ignore
    window.debugapi(prompt('put ur token here'));
  }}>login</button>
</p>