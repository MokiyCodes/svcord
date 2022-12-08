<script lang="ts">
  import Counter from "../lib/Counter.svelte";
  import Link from "../lib/Link.svelte";
</script>

<main>
  <div>
    <p>
      <button
        on:click={() => {
          console.log(
            "%cDO NOT RUN UNTRUSTED CODE HERE!\nAnything entered here can access the token you entered & cause serious damage to your Discord account.",
            "color: #f00; font-size:3em;"
          );
          let token = prompt(
            "put ur token here - bot tokens *should* work just fine",
            localStorage.getItem("token") ?? ""
          );
          localStorage.setItem("token", token);
          // @ts-ignore
          window.debugapi(token);
        }}>login</button
      >
      <br />
      <br />
      If you're not a developer, I'd suggest you leave this page.
    </p>
    <hr />
    <p>
      before someone calls this a token logger: no, it's not - you can verify
      that claim <a
        href="https://github.com/mokiyCodes/svcord/blob/main/src/main.ts"
        >here</a
      >.<br />
      this was made as a tool to figure out what discord is doing.<br />
      <small>
        It exposes a JS Global <code>evs</code>, a key-value pair with the first
        value of each event.<br />
        The Internal Client Abstraction can be accessed using
        <code>Client.active</code>
      </small>
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
