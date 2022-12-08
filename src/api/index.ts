/* eslint-disable camelcase */
import * as Gateway from './gateway';
import { EventEmitter } from 'events';
import {
  Message, ResolveMessage
} from './types/Message';
import {
  ChannelType,
  type APIChannel,
  type APIMessage,
  type APIUserSelf,
  type IDispatchEvent,
  type IReadyEvent,
  type IReadyEventData,
  type Snowflake
} from './apitypes';
import {
  ResolveUser, type User
} from './types/User';
import {
  Channels,
  ResolveChannel, type Channel
} from './types/Channel';
import proxyFetch, { setProxy } from './proxy_api_request';

export interface ClientEvents {
  /** The Websocket Connection was established successfully */
  'ConnectionEstablished': () => void;
  /** Connection Established, First message from Server */
  'Hello': () => void
  /** Client is ready, handshake completed */
  'Ready': (data: IReadyEvent) => void
  /** Supplemental Information sent after Ready */
  'ReadySupplemental': (data: IDispatchEvent & {
    t: 'READY_SUPPLEMENTAL'
  }) => void
  /** Client Disconnected - Reconnect using {@link Client.reconnect} */
  'Disconnect': () => void
  /** Message Created */
  'MessageCreate': (message: Message)=>void
  /** Message Edited */
  'MessageEdit': (message: Message)=>void,
  /** Message Deleted, only for cached messages */
  'MessageDelete': (message: Message)=>void,
  /** Message Deleted, Raw API Data, for all messages */
  'MessageDeleteRaw': (message: {
    id: string;
    channel_id: string;
    guild_id?: string;
  })=>void
  /** User Discovered */
  'UserDiscovered': (user: User)=>void,
  /** User DMs us */
  'UserDM': (message: Message, channel: Channel | undefined, user: User)=>void,
  /** Channel Discovered */
  'ChannelDiscovered': (channel: Channel) => void;
  /** Channel Created */
  'ChannelCreated': (channel: Channel) => void;
}

export interface Client {
  on<U extends keyof ClientEvents>(
    event: U, listener: ClientEvents[U]
  ): this;
  emit<U extends keyof ClientEvents>(
    event: U, ...args: Parameters<ClientEvents[U]>
  ): boolean;
};
export class Client extends EventEmitter {
  /** Internal Gateway Wrapper */
  gateway: Gateway.GatewayWebsocket;
  /** Auth Token */
  token: string;
  /** API Information */
  info: IReadyEventData;
  /** API User */
  apiuser: APIUserSelf;
  /** User */
  user: User;
  /** API Information */
  _supplementalInfo: IDispatchEvent & {
    t: 'READY_SUPPLEMENTAL'
  };
  /** CORS proxy */
  #proxy:string;
  public get proxy() : string {
    return this.#proxy;
  }
  public set proxy(v : string) {
    setProxy(v);
    this.#proxy = v;
  }
  /** Reconnect to the gateway in the case of a connection death */
  reconnect(){
    this.gateway.newSocket();
  }
  /**
   * This returns the Channel Cache
   */
  public get channelCache() : Record<Snowflake, Channel> {
    return Channels;
  }
  async getChannelMessages(channelId: Snowflake): Promise<APIMessage[]> {
    return await proxyFetch(`https://discord.com/api/v9/channels/${channelId}/messages?limit=50`, {
      'credentials': 'omit',
      'headers': {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Authorization': this.token,
        'X-Super-Properties': 'eyJvcyI6IkxpbnV4IiwiYnJvd3NlciI6IkZpcmVmb3giLCJkZXZpY2UiOiIiLCJzeXN0ZW1fbG9jYWxlIjoiZW4tVVMiLCJicm93c2VyX3VzZXJfYWdlbnQiOiJNb3ppbGxhLzUuMCAoWDExOyBMaW51eCB4ODZfNjQ7IHJ2OjEwNy4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEwNy4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTA3LjAiLCJvc192ZXJzaW9uIjoiIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjE2MzAzNSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=',
        'X-Discord-Locale': 'en-GB',
        'X-Debug-Options': 'bugReporterEnabled',
        'Alt-Used': 'discord.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-GPC': '1',
        'Origin': 'localhost:5173'
      },
      'referrer': 'https://discord.com/channels/@me',
      'method': 'GET',
      'mode': 'cors'
    }).then(v=>v.json());
  }
  /**
   * @constructor
   * @param token Auth Token
   */
  constructor(token:string) {
    super();
    this.token = token;
    this.on('Ready', (data)=>{
      this.info = data.d;
      this.apiuser = data.d.user;
      this.user = ResolveUser(this.apiuser, this);
    });
    this.on('ReadySupplemental', (data)=>{
      this._supplementalInfo = data;
    });
    this.gateway = Gateway.NewSocket(token);
    // connection events:
    this.gateway.on('WEBSOCKETCONNECT', ()=>this.emit('ConnectionEstablished'));
    this.gateway.on('HELLO', ()=>this.emit('Hello'));
    // dispatched:
    this.gateway.on('DISPATCH', (dispatchedData) => {
      console.log(dispatchedData);
      switch (dispatchedData.t) {
      case 'MESSAGE_CREATE': {
        const msg = ResolveMessage(dispatchedData.d, this);
        this.emit('MessageCreate', msg);
        if (msg.channel)
          msg.channel._addMessage(msg);
        if (msg.channel?._APIChannel?.type === ChannelType.DM || msg.channel?._APIChannel?.type === ChannelType.GROUP_DM)
          this.emit('UserDM', msg, msg.channel, msg.user);
        break;
      }
      case 'MESSAGE_UPDATE':
        this.emit('MessageEdit', ResolveMessage(dispatchedData.d, this));
        break;
      case 'MESSAGE_DELETE':{
        const m = ResolveMessage(dispatchedData.d.id, this);
        if (m){
          m._MarkAsDeleted();
          this.emit('MessageDelete', m);
        }
        this.emit('MessageDeleteRaw', dispatchedData.d);
        break;
      }
      case 'CHANNEL_CREATE':{
        this.emit('ChannelCreated', ResolveChannel(dispatchedData.d, this));
        break;
      }
      case 'READY': {
        dispatchedData.d.private_channels.forEach(channel=>ResolveChannel(channel, this));
        dispatchedData.d.guilds.forEach(guild=>guild.channels.forEach(channel=>ResolveChannel(channel, this)));
        dispatchedData.d.users.forEach(user => ResolveUser(user, this));
        this.emit('Ready', dispatchedData);
        break;
      }
      case 'READY_SUPPLEMENTAL': {
        this.emit('ReadySupplemental', dispatchedData);
        break;
      }
      case 'MESSAGE_REACTION_ADD': {
        ResolveMessage(dispatchedData.d.message_id, this)?._AddReaction(dispatchedData.d);
        break;
      }
      }
    });
    this.proxy = 'http://127.0.0.1:8080/';
  }
}
export const login = (token: string)=>active = new Client(token);
export let active: Client;
export default active;
