<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  // imported routes
  import index from './routes/index.svelte';
  import other from './routes/other.svelte';
  import Apistats from './routes/apistats.svelte';

  // get base route
  import { baseRoute } from './BaseRoute';

  // route list - include leading /
  const Routes: Record<string, any> = {
    '/apistats': Apistats,
    '/other': other,
    '/': index, // index should be last!
  };

  // routing + whatnot
  export let url = '';
</script>

<Router {url}>
  <nav>
    <!-- optionally put a navbar here -->
  </nav>
  <div>
    {#each Object.entries(Routes) as [path, Page]}
      <Route path={`${baseRoute}${path}`}><Page /></Route>
      <Route path={`${path}`}><Page /></Route>
    {/each}
  </div>
</Router>
