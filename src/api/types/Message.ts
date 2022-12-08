import type {
  APIMessage, Snowflake, IDispatchEvent, APIEmoji, APIEmbed
} from '../apitypes';
import { EventEmitter } from 'events';
import type { Client } from '..';
import ResolveUser, { User } from './User';
import {
  ResolveChannel, type Channel
} from './Channel';

let imaginaryReactionObject: IDispatchEvent & {t:'MESSAGE_REACTION_ADD'};
let imaginaryReactionObject2: IDispatchEvent & {t:'MESSAGE_REACTION_REMOVE'};

const Messages: Record<Snowflake, Message> = {};
export const ResolveMessage = (APIMessage: Partial<APIMessage> | Snowflake, Client: Client) => {
  if (typeof APIMessage !== 'object')
    return Messages[APIMessage];
  if (!Messages[APIMessage.id])
    Messages[APIMessage.id] = new Message(APIMessage as APIMessage, Client);
  Messages[APIMessage.id]._Update(APIMessage);
  return Messages[APIMessage.id];
};
export default ResolveMessage;

type MessageEvents = {
  /** On message deletion */
  'Deleted': ()=>void;
  /** On message edit */
  'Edited': (oldContent:string, newContent:string)=>void,
  /** On Reaction Add */
  'ReactionAdded': (reactionData: typeof imaginaryReactionObject.d)=>void,
  /** On Reaction Remove */
  'ReactionRemoved': (reactionData: typeof imaginaryReactionObject2.d)=>void,
  /** On Reaction Update (Add, Remove, Bulk Remove, etc...) */
  'ReactionUpdated': (reactionData: {
    /** What emoji? */
    emoji: Partial<APIEmoji>,
    emojiInfo: {
      /** Amount of this reaction */
      count: number,
      /** What emoji? */
      emoji: Partial<APIEmoji>,
      /** Are we reacting to it? */
      me: boolean,
    },
    /** Amount of this reaction */
    count: number
  })=>void,
}
export interface Message {
  on<U extends keyof MessageEvents>(
    event: U, listener: MessageEvents[U]
  ): this;

  emit<U extends keyof MessageEvents>(
    event: U, ...args: Parameters<MessageEvents[U]>
  ): boolean;
}
export class Message extends EventEmitter {
  /** Raw API Message */
  _APIMessage: APIMessage;
  /** Current Content */
  content: string;
  /** List of previous contents, excludes current */
  contentHistory: string[] = [];
  /** Whether the message has been deleted or not */
  deleted: boolean;
  /** Date this message was sent at */
  sentAt: Date;
  /** What client owns this message */
  client: Client;
  /** What user sent this message */
  user: User;
  /** What channel this message was sent in */
  channel: Channel;
  /** Internal Method used to mark the message as deleted */
  _MarkAsDeleted() {
    this.deleted = true;
    this.emit('Deleted');
  }
  /** Internal Method used to update the message when necessary */
  _Update(NewAPIMessage: Partial<APIMessage>) {
    if (NewAPIMessage.content && NewAPIMessage.content !== this.content)
      this.emit('Edited', this.content, NewAPIMessage.content);
    for (const k in NewAPIMessage)
      if (Object.prototype.hasOwnProperty.call(NewAPIMessage, k)) {
        const v = NewAPIMessage[k];
        this._APIMessage[k] = v;
      }
    if (this._APIMessage.author)
      this.user = ResolveUser(this._APIMessage.author, this.client);
    if (this._APIMessage.channel_id)
      this.channel = ResolveChannel(this._APIMessage.channel_id, this.client);
  }
  /** Internal Method used to add a reacton when the Gateway tells us to */
  _AddReaction(data: typeof imaginaryReactionObject.d) {
    let existing = this._APIMessage.reactions?.filter(v=>v.emoji.id ?? v.emoji.name);
    if (!existing || !existing[0]) {
      existing = existing ?? [];
      existing[0] = {
        'count': 1,
        'emoji': data.emoji,
        'me': data.user_id === this.client.user.id,
      };
      this._APIMessage.reactions = this._APIMessage.reactions ?? [];
      this._APIMessage.reactions.push(existing[0]);
    }
    this.emit('ReactionAdded', data);
    this.emit('ReactionUpdated', {
      'emoji': existing[0].emoji,
      'count': existing[0].count,
      'emojiInfo': existing[0]
    });
  }
  /** Internal Method used to remove a reacton when the Gateway tells us to */
  _RemoveReaction(data: typeof imaginaryReactionObject2.d) {
    const existing = this._APIMessage.reactions?.filter(v=>v.emoji.id ?? v.emoji.name);
    if (!existing || !existing[0])
      return;
    this.emit('ReactionRemoved', data);
    this.emit('ReactionUpdated', {
      'emoji': existing[0].emoji,
      'count': existing[0].count,
      'emojiInfo': existing[0]
    });
  }
  /** Message ID */
  public get id() : Snowflake {
    return this._APIMessage.id;
  }
  /** Message Embeds */
  public get embeds() : APIEmbed[] {
    return this._APIMessage.embeds;
  }
  constructor(APIMessage: APIMessage, Client: Client) {
    super();
    this.client = Client;
    this._APIMessage = APIMessage;
    this.sentAt = new Date(APIMessage.timestamp);
    this.on('Edited', (old:string, current:string) =>{
      this.content = current;
      this.contentHistory.push(old);
    });
  }
}
