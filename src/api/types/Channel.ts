import type {
  Snowflake, APIChannel, ChannelType
} from '../apitypes';
import { EventEmitter } from 'events';
import type { Client } from '..';
import {
  ResolveMessage, type Message
} from './Message';
import proxyFetch from '../proxy_api_request';

export const Channels: Record<Snowflake, Channel> = {};
export const ResolveChannel = (APIUser: Partial<APIChannel> | Snowflake, Client: Client) => {
  if (typeof APIUser !== 'object')
    return Channels[APIUser];
  if (!Channels[APIUser.id])
    Channels[APIUser.id] = new Channel(APIUser as APIChannel, Client);
  Channels[APIUser.id]._Update(APIUser);
  return Channels[APIUser.id];
};
export default ResolveChannel;

type ChannelEvents = {
  'MessageCreate': (message:Message)=>void;
}
export interface Channel {
  on<U extends keyof ChannelEvents>(
    event: U, listener: ChannelEvents[U]
  ): this;

  emit<U extends keyof ChannelEvents>(
    event: U, ...args: Parameters<ChannelEvents[U]>
  ): boolean;
}
export class Channel extends EventEmitter {
  /** Raw API User */
  _APIChannel: APIChannel;
  /** When a user is updated */
  _Update(newData: Partial<APIChannel>){
    for (const k in newData)
      if (Object.prototype.hasOwnProperty.call(newData, k))
        this._APIChannel[k] = newData[k];
  }
  /**
   * Channel's ID
   * @readonly
   */
  public get id() : Snowflake {
    return this._APIChannel.id;
  }
  /**
   * Channel's name
   * @readonly
   */
  public get name() : string | undefined {
    return this._APIChannel.name;
  }
  /**
   * Channel Type
   * @readonly
   */
  public get type() : ChannelType {
    return this._APIChannel.type;
  }
  /** What client owns this user */
  client: Client;
  /** Messages */
  #messages: Message[] = [];
  /** Have we fetched from the API */
  #haveFetchedFromAPI = false;
  _addMessage(message:Message) {
    this.#messages.push(message);
    this.emit('MessageCreate', message);
  }
  public async send(text:string) : Promise<Message> {
    const response = await proxyFetch(`https://discord.com/api/v9/channels/${this.id}/messages`, {
      'credentials': 'omit',
      'headers': {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/json',
        'Authorization': this.client.token,
        'X-Discord-Locale': 'en-GB',
        'X-Debug-Options': 'bugReporterEnabled',
        'Alt-Used': 'discord.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-GPC': '1'
      },
      'referrer': 'https://discord.com/channels/@me/1049725586408480798',
      'body': JSON.stringify({
        'content': text, 'nonce': `${`${Date.now()}${Date.now()}`.substring(0, 16)}`, 'tts': false
      }),
      'method': 'POST',
      'mode': 'cors'
    }).then(v=>v.json());
    return ResolveMessage(response, this.client);
  }
  public get messages() : Message[] {
    return this.#messages.sort((x, y)=>x.sentAt.getTime() - y.sentAt.getTime());
  }
  public get messagesReversed() : Message[] {
    return this.messages.reverse();
  }
  public async fetchMessages() {
    if (this.#haveFetchedFromAPI)
      return this.#messages;
    const data = await this.client.getChannelMessages(this.id);
    this.#messages.push(...data.filter(v=>!this.#messages.map(v=>v.id).includes(v.id)).map(v=>ResolveMessage(v, this.client)));
    this.#haveFetchedFromAPI = true;
    return this.#messages;
  }
  constructor(APIChannel: APIChannel, Client: Client) {
    super();
    this.client = Client;
    this._APIChannel = APIChannel;
    this.client.emit('ChannelDiscovered', this);
  }
}
