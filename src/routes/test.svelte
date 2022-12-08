<script lang="ts">
  import { fly } from "svelte/transition";
  import type { Client } from "../api";
  import * as ClientAPI from "../api";
  import { ChannelType, type Snowflake } from "../api/apitypes";
  import type { Channel } from "../api/types/Channel";
  import type { Message } from "../api/types/Message";
  import { ResolveUser, type User } from "../api/types/User";
  import * as showdown from "showdown";
  import * as htmlEscaper from "html-escaper";
  const converter = new showdown.Converter({
    simpleLineBreaks: true,
    simplifiedAutoLink: true,
    emoji: true,
    excludeTrailingPunctuationFromURLs: true,
    tasklists: false,
  });

  let token: string = localStorage.getItem("token");
  let client: Client =
    (typeof window !== "undefined" ? (window as any).Client.active : null) ??
    ClientAPI.active;
  let connected: boolean;
  let users: User[] = [];
  let dmChannels: Channel[] = [];
  let cur: Channel;
  let connectedTo: Snowflake[] = [];
  let _cmpTargetMsg: Message | undefined;
  let showMsgArea: boolean = false;
  const getCallback = (channel: Channel) => async () => {
    cur = undefined;
    showMsgArea = true;
    await channel.fetchMessages();
    _cmpTargetMsg = undefined;
    cur = channel;
    setTimeout(() => {
      const msgArea = document.querySelector(".messageArea");
      msgArea.scrollTop = msgArea.scrollHeight;
    }, 50);
    if (!connectedTo.includes(cur.id)) {
      connectedTo.push(cur.id);
      cur.on("MessageCreate", () => {
        if (cur.id === channel.id) cur = channel;
        setTimeout(() => {
          const msgArea = document.querySelector(".messageArea");
          msgArea.scrollTop = msgArea.scrollHeight;
        }, 50);
      });
    }
  };
  (async () => {
    for (const idx in dmChannels) {
      if (Object.prototype.hasOwnProperty.call(dmChannels, idx)) {
        const channel = dmChannels[idx];
        await channel.fetchMessages();
      }
    }
  })();
  const doClientStuff = () => {
    client.on("ReadySupplemental", () => {
      connected = true;
    });
    client.on("UserDM", (message, channels, user) => {
      users = [user, ...users.filter((v) => v.id !== user.id)];
      dmChannels = [
        channels,
        ...dmChannels.filter((v) => v.id !== channels.id),
      ];
    });
    client.on("Ready", readyFunc);
  };
  const readyFunc = () => {
    dmChannels = Object.keys(client.channelCache)
      .map((v) => client.channelCache[v])
      .filter(
        (v) => v.type === ChannelType.DM || v.type === ChannelType.GROUP_DM
      );
    console.log(
      dmChannels.map((v) => {
        return v._APIChannel.recipient_ids.map((v) => ResolveUser(v, client));
      })
    );
  };
  const cmp = (msg: Message) => {
    const cmpResult = msg.user?.id === _cmpTargetMsg?.user?.id;
    _cmpTargetMsg = msg;
    return cmpResult;
  };
  if (token && !client) {
    console.log(
      "%cDO NOT RUN UNTRUSTED CODE HERE!\nAnything entered here can access the token you entered & cause serious damage to your Discord account.",
      "color: #f00; font-size:3em;"
    );
    client = ClientAPI.login(token);
    doClientStuff();
  } else if (token) {
    connected = true;
    doClientStuff();
    readyFunc();
  }
  const getChannelName = (channel: Channel) =>
    channel.name ||
    channel._APIChannel.recipient_ids
      .map((v) => ResolveUser(v, client)?.name)
      .join(",") ||
    "Unknown Name";
  let searchQuery: string = "";

  const showdownParse = (text: string) => converter.makeHtml(text);

  const searchChanged = () => {
    const CSQ = document.querySelector("#ChannelSearchQuery");
    if (!CSQ) return (searchQuery = "");
    // @ts-ignore
    searchQuery = CSQ.value;
  };
  setInterval(searchChanged, 500);

  const sendHandler = (message: string) => {
    if (!message) return;
    cur.send(htmlEscaper.escape(message).replaceAll("\\n", "\n"));
  };
</script>

{#if !connected}
  <div class="noconnection">
    {#if !token}
      <p>
        <button
          on:click={() => {
            console.log(
              "%cDO NOT RUN UNTRUSTED CODE HERE!\nAnything entered here can access the token you entered & cause serious damage to your Discord account.",
              "color: #f00; font-size:3em;"
            );
            let _token = prompt(
              "put your token here - bot tokens *should* work just fine",
              localStorage.getItem("token") ?? ""
            );
            localStorage.setItem("token", _token);
            token = _token;
            client = ClientAPI.login(token);
            doClientStuff();
          }}>login</button
        >
        <br />
        <br />
        If you're not a developer, I'd suggest you leave this page.
      </p>
    {:else}
      <p
        style="position:fixed;top:50vh;left:50vw;transform:translate(-50%,-50%);"
        in:fly={{ y: -50, duration: 2000 }}
        out:fly={{ y: 50, duration: 2000 }}
      >
        Connecting...
      </p>
    {/if}
  </div>
{:else}
  <div
    class="client"
    data-client-id={client.user.id}
    data-client-name={client.user.name}
    in:fly={{ y: -50, duration: 2000 }}
    out:fly={{ y: 50, duration: 2000 }}
  >
    <div class="users">
      <input
        type="text"
        name="ChannelSearchQuery"
        id="ChannelSearchQuery"
        placeholder="Search"
        on:keypress={searchChanged}
        class="inputbox"
        style="top:0"
      />
      <div hidden={searchQuery.length === 0}>
        {#each dmChannels as channel}
          <div
            class="channel"
            data-id={channel.id}
            on:click={getCallback(channel)}
            on:keypress={getCallback(channel)}
            hidden={!getChannelName(channel)
              .toLowerCase()
              .includes(searchQuery.trim().toLowerCase())}
          >
            <p>
              {getChannelName(channel)}
            </p>
          </div>
        {/each}
      </div>
    </div>
    {#if cur || showMsgArea}
      <div class="messageArea">
        {#if cur}
          {#each cur.messages as msg}
            <div
              class={`message ${cmp(msg) ? "sameUser" : "newUser"}`}
              data-content={msg.content}
              data-embeds={msg.embeds.length}
              data-author-id={msg.user?.id}
              in:fly={{ y: 50, duration: 500 }}
            >
              <div class="msgPfp msgBlock">
                <img
                  src="https://cdn.discordapp.com/avatars/{msg.user.id}/{msg
                    .user._APIUser.avatar}"
                  alt="avatar"
                />
              </div>
              <div class="msgCnt msgBlock">
                <h2>{msg.user.tag}</h2>
                {#if msg.content}
                  <!-- @ts-ignore -->
                  {@html showdownParse(msg.content)}
                {/if}
                {#each msg.embeds as embed}
                  <div
                    class="embed"
                    data-type={embed.type}
                    style={"--embed-colour:" +
                      (embed.color?.toString(16) ?? "1a1a1a")}
                  >
                    {#if embed.title}
                      {#if embed.url}
                        <a href={embed.url} target="_blank" rel="noreferrer">
                          <h2>{embed.title}</h2>
                        </a>
                      {:else}
                        <h2>{embed.title}</h2>
                      {/if}
                    {/if}
                    {#if embed.description}
                      <p class="description">
                        {embed.description}
                      </p>
                    {/if}
                    {#if embed.thumbnail}
                      <img
                        src={embed.thumbnail.proxy_url}
                        alt="Embedded"
                        style={`max-width:${embed.thumbnail.width}px;max-height:${embed.thumbnail.height}px;width:calc(70vw - 16px);border-radius:8px`}
                      />
                    {/if}
                    {(() => {
                      console.log(embed);
                      return "";
                    })()}
                  </div>
                {/each}
              </div>
            </div>
          {/each}
          <input
            type="text"
            name="text"
            id="message"
            placeholder="Input Text"
            style="bottom:0; --margin-left: -8px"
            class="inputbox noborderright"
            on:keypress={(event) => {
              const m = document.querySelector("#message");
              if (event.key === "Enter") {
                // @ts-ignore
                if (event.shiftKey) return (m.value = m.value + "\\n");
                // @ts-ignore
                sendHandler(m?.value);
                // @ts-ignore
                m.value = "";
              }
            }}
          />
        {/if}
      </div>
    {:else}
      <div class="blankMessageArea">
        <p>No channel lol</p>
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .client {
    width: 100vw;
    text-align: left;
    display: flex;
    .inputbox {
      position: sticky;
      left: 0;
      background: #24273aaa;
      border: none;
      width: 100%;
      height: 3em;
      overflow-x: hidden;
      backdrop-filter: blur(16px);
      margin-left: var(--margin-left, 0);
      border-left: 0 solid #fff;
      transition: 0.1s;
      &:focus {
        outline: none;
      }
      &:not(.noborderright):focus {
        border-left: 2px solid #fff;
        margin-left: calc(var(--margin-left) - 2px);
      }
    }
    .users {
      text-align: center;
      width: 15vw;
      min-width: 192px;
      max-width: 25vw;
      height: 100vh;
      resize: horizontal;
      background: #181926;
      color: #b7bdf8;
      overflow-y: auto;
      scroll-behavior: smooth;
      overflow-x: hidden;
      & > div {
        background: #1e2030;
        padding: 1px 0;
        margin-bottom: 0.5em;
        cursor: pointer;
      }
    }
    .messageArea,
    .blankMessageArea {
      height: 100vh;
      width: 100%;
      text-align: left;
      background: #24273a;
      color: #cad3f5;
      padding-left: 8px;
      overflow-y: auto;
      scroll-behavior: smooth;
    }
    .messageArea .message {
      max-width: 100%;
      display: flex;
      &:last-child {
        margin-bottom: 4px;
      }
      &.newUser {
        margin-top: 0.5em;
      }
      &:not(.newUser) {
        h2 {
          display: none;
        }
        .msgPfp {
          opacity: 0;
          img {
            height: 0;
          }
        }
      }
      h2 {
        $size: 17px;
        margin: 0 0;
        font-size: $size;
        max-height: #{$size + 4px};
      }
      p {
        margin: 0 0;
      }
      .msgBlock {
        display: inline-block;
        max-width: 90vw;
      }
      .msgPfp {
        img {
          border-radius: 100% 100%;
          height: 32px;
          width: 32px;
        }
      }
      .msgBlock:last-child {
        padding-left: 8px;
      }
      .embed {
        padding: 8px 8px;
        border-radius: 8px;
        background: #181926;
        width: max-content;
        max-width: 70vw;
      }
    }
  }
  .noconnection {
    text-align: center;
  }
</style>
