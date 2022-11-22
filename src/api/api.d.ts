import type { GATEWAY_OPCODE } from './opcodes';

/** ISO8601 timestamp */
export type ISO8601 = `${number}-${number}-${number}${string}` | `${number}-W${number}` | `${number}-${number}`;
export type Snowflake = string;
/**
 * @deprecated Unknown or unspecified type
 */
export type API_Unknown = any;
/** https://discord.com/developers/docs/resources/user#user-object */
export type API_User = API_Unknown;
export type API_Member = {
  user?: API_User,
  nick?: string,
  /** the member's {@link https://discord.com/developers/docs/reference#image-formatting guild avatar hash} */
  avatar?: string,
  /** array of {@link https://discord.com/developers/docs/topics/permissions#role-object role} object ids */
  roles: Snowflake[],
  /** when the user joined the guild */
  joined_at: ISO8601,
  /** when the user started boosting thet guild */
  premium_since?: ISO8601,
}
export type API_Role = API_Unknown;
export type API_Embed = API_Unknown;
export type API_Channel = API_Unknown
/** {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-structure docs} */
export type API_Activity = {
  /** Activity's name */
  name: string,
  /** {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types Activity Type} */
  type: number,
  /** Stream URL, validated if type=1 */
  url?: string,
  /** Unix timestamp (ms) of when the activity was added to the ser's session */
  created_at: number,
  // TODO: INCOMPLETE, FINISH THIS
};
export type API_Component = API_Unknown;
/** {@link https://discord.com/developers/docs/topics/gateway-events#client-status-object docs} */
export type API_ClientStatus = {
  /** User's status set for an active desktop (Windows, Linux, Mac) application session */
  desktop?: string,
  /** User's status set for an active mobile (iOS, Android) application session */
  mobile?: string,
  /** User's status set for an active web (browser, bot account) application session */
  web?: string,
}
/** {@link https://discord.com/developers/docs/resources/sticker#sticker-item-object docs} */
export type API_Sticker = {
  /** {@link https://discord.com/developers/docs/reference#image-formatting id of the sticker} */
  id: Snowflake,
  /** name of the sticker */
  name: string,
  /** {@link https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types type of sticker format} */
  format_type: integer,
};
/** {@link https://discord.com/developers/docs/resources/emoji docs} */
export type API_Emoji = {
  id?: Snowflake,
  /** Can only be null in reaction emoji objects */
  name?: string,
  /** array of role object ids - roles allowed to use this emoji */
  roles?: Snowflake[]
  /** user who created */
  user?: API_User,
  /** whether this emoji must be wrapped in :s */
  require_colons?: boolean,
  /* whether this emoji is managed */
  managed?: boolean,
  /** whether this emoji is animated */
  animated?: boolean,
  /** whether this emoji can be used, may be false due to loss of server boosts */
  available: boolean,
};
/** {@see https://discord.com/developers/docs/resources/channel#message-object docs} */
export type API_Message = {
  /** id of the message */
  id: Snowflake,
  /** id of the channel */
  channel_id: Snowflake,
  /** sender, may not be complet or avaialble at all */
  author?: Partial<API_User>,
  /** content of the message, empty if bot embed */
  content: string,
  /** when this message was sent, ISO8601 timestamp */
  timestamp: ISO8601,
  /** when this message was edited (or null if never) - ISO8601 timestamp */
  edited_timestamp?: ISO8601,
  /** tts? */
  tts: boolean,
  /** mentions @everyone */
  mentions_everyone: boolean,
  /** users specifically mentioned */
  mentions: API_User[]
  /** roles specifiically mentioned */
  mention_roles: API_Role[],
  /**
   * Channels specifically mentioned in this message
   * Not all channel mentions in a message will appear in mention_channels. Only textual channels that are visible to everyone in a lurkable guild will ever be included. Only crossposted messages (via Channel Following) currently include mention_channels at all. If no mentions in the message meet these requirements, this field will not be sent.
   */
  mention_channels: API_Channel[],
  // TODO: INCOMPLETE, FINISH THIS
  /** pinned? */
  pinned: boolean,
  /** which webhook id if any */
  webhook_id?: Snowflake,
  /** https://discord.com/developers/docs/resources/channel#message-object-message-types */
  type: number;
  /** https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure */
  activity?: API_Unknown,
  // TODO: INCOMPLETE, FINISH THIS
  /** available if a thread was started from this message */
  thread?: API_Channel,
  /** list of components, if any */
  components?: API_Component[],
  /** stickers, if any */
  sticker_items?: API_Sticker[],
  /** A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with total_message_sent on parent thread */
  position?: number
} & Record<string, API_Unknown>
/** {@link https://discord.com/developers/docs/topics/gateway-events#message-create docs} */
export type IDispatchEvent = (
// ////////////// PRESENCE EVENT ////////////// //
{
  /** event type */
  t: 'PRESENCE_UPDATE'
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#presence-update docs} */
  d: {
    /** User who's presence is being updated */
    user: API_User,
    /** Guild ID */
    guild_id: Snowflake,
    /** Status */
    status: 'idle' | 'dnd' | 'online' | 'offline',
    /** activity list */
    activities: API_Activity[],
    /** User's platform-dependent status */
    client_status: API_ClientStatus
  }
} |
// ////////////// MESSAGE EVENTS ////////////// //
{
  /** event type */
  t: 'MESSAGE_CREATE',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-create docs} */
  d: API_Message & {
    /** ID of the guild the message was sent in - unless it is an ephemeral message */
    guild_id?: Snowflake,
    /** Member properties for this message's author. Missing for ephemeral messages and messages from webhooks */
    member?: Partial<API_Member>,
    /** Users specifically mentioned in the message - array of user objects, with an additional partial member field */
    mentions: API_Unknown,
  }
} | {
  /** event type */
  t: 'MESSAGE_UPDATE',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-update docs} - Unlike creates, message updates may contain only a subset of the full message object payload (but will always contain an ID and channel_id). */
  d: Partial<API_Message> & {
    /** ID of the guild the message was sent in - unless it is an ephemeral message */
    guild_id?: Snowflake,
    /** Member properties for this message's author. Missing for ephemeral messages and messages from webhooks */
    member?: Partial<API_Member>,
    /** Users specifically mentioned in the message - array of user objects, with an additional partial member field */
    mentions: API_Unknown,
  }
} | {
  /** event type */
  t: 'MESSAGE_DELETE',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-delete docs} */
  d: {
    id: Snowflake,
    channel_id: Snowflake,
    guild_id?: Snowflake
  }
} | {
  /** event type */
  t: 'MESSAGE_DELETE_BULK'
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-delete-bulk docs} */
  d: {
    ids: Snowflake[],
    channel_id: Snowflake,
    guild_id?: Snowflake
  }
} | {
  /** event type */
  t: 'MESSAGE_REACTION_ADD',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-add docs} */
  d: {
    user_id: Snowflake,
    channel_id: Snowflake,
    message_id: Snowflake,
    guild_id?: Snowflake,
    member?: API_Member,
    /** Emoji used to react - {@link https://discord.com/developers/docs/resources/emoji#emoji-object-standard-emoji-example example} */
    emoji: Partial<API_Emoji>
  }
} | {
  /** event type */
  t: 'MESSAGE_REACTION_REMOVE',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove docs} */
  d: {
    user_id: Snowflake,
    channel_id: Snowflake,
    message_id: Snowflake,
    guild_id?: Snowflake,
    /** Emoji used to react - {@link https://discord.com/developers/docs/resources/emoji#emoji-object-standard-emoji-example example} */
    emoji: Partial<API_Emoji>
  }
} | {
  /** event type */
  t: 'MESSAGE_REACTION_REMOVE_ALL',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-all docs} */
  d: {
    channel_id: Snowflake,
    message_id: Snowflake,
    guild_id?: Snowflake,
  }
} | {
  /** event type */
  t: 'MESSAGE_REACTION_REMOVE_EMOJI',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-emoji docs} */
  d: {
    channel_id: Snowflake,
    message_id: Snowflake,
    guild_id?: Snowflake,
    emoji: Partial<API_Emoji>
  }
}) & {
  /** opcode, always 0 for dispatch */
  op: GATEWAY_OPCODE.DISPATCH
  /** something i still dont understand after reading the docs, only mentioned when reversing */
  s: `${number}`,
}
export type IHelloEvent = {
  /** opcode, always 10 for hello */
  op: GATEWAY_OPCODE.HELLO,
  d: {
    /** Interval (in milliseconds) an app should heartbeat with - Heartbeats are handled for you by default */
    heartbeat_interval: number
  }
}

export interface GatewayEvents {
  /** An event was dispatched. */
  'DISPATCH': (data: IDispatchEvent) => void;
  /** Fired periodically by the client to keep the connection alive. */
  'HEARTBEAT': (data: any) => void;
  /** You should attempt to reconnect and resume immediately. */
  'RECONNECT': () => void;
  /** The session has been invalidated. You should reconnect and identify/resume accordingly. */
  'INVALIDSESSION': () => void;
  /** Sent immediately after connecting, contains the heartbeat_interval to use. */
  'HELLO': (data: IHelloEvent) => void;
  /** Sent in response to receiving a heartbeat to acknowledge that it has been received. */
  'HEARTBEATACK': () => void;
}
