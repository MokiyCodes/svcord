<script lang="ts">
  import Link from "../lib/Link.svelte";
</script>

<main>
  <div>
    <p>
      Hello World!
      <br />
      This is the file at /src/routes/index.svelte (route /) - You can look at /src/routes/test.svelte
      (/test) <Link to="/test">here</Link> for a test client, to test a "barebones"
      DM-only client.
      <br />
      <br />
      <Link to="/apistats">api stats</Link>
    </p>
  </div>
</main>

<style lang="scss">
  main {
    align-items: center;
    justify-content: center;
    display: flex;
    height: 100vh;
    width: 100vw;
    & > div {
      display: block;
      text-align: center;
    }
  }
</style>
