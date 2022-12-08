import type { GATEWAY_OPCODE } from './opcodes';

export type Digit = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'
/** ISO8601 timestamp */
export type ISO8601 = `${number}-${number}-${number}${string}` | `${number}-W${number}` | `${number}-${number}`;
export type Snowflake = string;
/** Attachments */
export type APIAttachment = {
  /** Attachment ID */
  id: Snowflake,
  /** Attachment Filename */
  filename: string,
  /** Attachment Description (max 1024 chars) */
  description?: string,
  /** Attachment's MIME Type */
  content_type?: string,
  /** Size in Bytes */
  size: number,
  /** Source URL of a File */
  url: string,
  /** Proxied URL of a File */
  proxy_url: string,
  /** Height of file (if image) */
  height?: number | null,
  /** Width of file (if image) */
  width?: number | null,
  /** whether this attachment is ephemeral | Ephemeral attachments will automatically be removed after a set period of time. Ephemeral attachments on messages are guaranteed to be available as long as the message itself exists. */
  ephemeral?: boolean
};
/** Reactions */
export type APIReaction = {
  /** Amount of this reaction */
  count: number,
  /** Is the current user reacting? */
  me: boolean,
  /** Emoji info */
  emoji: Partial<APIEmoji>,
}
/** Voice State */
export type APIVoiceState = {
  channel_id: string,
  deaf: boolean,
  mute: boolean,
  request_to_speak_timestamp: APIUnknown | null,
  self_deaf: boolean,
  self_mute: boolean,
  self_video: boolean,
  session_id: string,
  suppress: boolean,
  user_id: string
}
/** Connected Accounts */
export type APIConnectedAccount = {
  visibility: 0 | 1,
  verified: boolean,
  type: string,
  friend_sync: boolean,
  id: `${number}`,
  metadata_visibility: 0 | 1;
  name: string,
  two_way_sync: boolean,
  revoked: boolean,
  show_activity: boolean,
}
/** Join Requests */
export type APIJoinRequest = {
  application_status: 'STARTED',
  created_at: ISO8601,
  guild_id: Snowflake,
  id: Snowflake,
  last_seen: ISO8601 | null,
  rejection_reason: string | null,
  user_id: Snowflake,
}
/** Guild Feature List */
export enum GuildFeatures {
  THREADS_ENABLED = 'THREADS_ENABLED',
  NEWS = 'NEWS',
  COMMUNITY_EXP_LARGE_GATED = 'COMMUNITY_EXP_LARGE_GATED',
  ANIMATED_ICON = 'ANIMATED_ICON',
  APPLICATION_COMMAND_PERMISSIONS_V2 = 'APPLICATION_COMMAND_PERMISSIONS_V2',
  NEW_THREAD_PERMISSIONS = 'NEW_THREAD_PERMISSIONS',
  INVITE_SPLASH = 'INVITE_SPLASH',
  THREE_DAY_THREAD_ARCHIVE = 'THREE_DAY_THREAD_ARCHIVE',
  COMMUNITY = 'COMMUNITY',
  WELCOME_SCREEN_ENABLED = 'WELCOME_SCREEN_ENABLED',
}
/** Guild MFA Level */
export enum GuildMFALevel {
  NONE = 0,
  /** TODO: ADD THESE */
}
/** Guild Verification Level */
export enum GuildVerification {
  NONE = 0,
  EMAIL = 1,
  /** TODO */
}
/** Booster Tiers (TODO) */
export enum BoostTier {
  NONE = 0,
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
}
/** Guild */
export type APIGuild = {
  application_command_counts: Record<`${number}`, number>,
  channels: APIChannel[],
  data_mode: 'full',
  emojis: APIEmoji[],
  guild_scheduled_events: APIUnknown[],
  id: Snowflake,
  joined_at: ISO8601,
  large: boolean,
  lazy: boolean,
  member_count: number,
  premium_subscription_count: number,
  properties: {
    afk_channel_id: Snowflake | null,
    afk_timeout: number | null,
    application_id: Snowflake | null,
    banner: APIUnknown,
    default_message_notifications: number,
    description: APIUnknown,
    discovery_splash: APIUnknown,
    explicit_content_filter: number,
    features: GuildFeatures[],
    hub_type: APIUnknown,
    icon: string,
    id: Snowflake,
    max_members: number,
    max_stage_video_channel_users: number,
    max_video_channel_users: number,
    mfa_level: GuildMFALevel,
    name: string,
    owner_id?: Snowflake,
    preferred_locale?: string,
    premium_progress_bar_enabled: boolean,
    premium_tier: BoostTier,
    public_updates_channel_id?: Snowflake,
    rules_channel_id?: Snowflake,
    safety_alerts_channel_id?: Snowflake,
    splash?: APIUnknown,
    system_channel_flags?: APIUnknown,
    system_channel_id?: Snowflake,
    vanity_url_code: string | null,
    verification_level: GuildVerification
  },
  roles: APIRole[],
  stage_instance: APIUnknown[],
  stickers: APISticker[],
  threads: APIUnknown[],
  version: number,
}
/**
 * @deprecated Unknown or unspecified type
 */
export type APIUnknown = any;
/** https://discord.com/developers/docs/resources/user#user-object */
export type APIUser = {
  /** UserID */
  id: Snowflake,
  /** Username */
  username: string,
  /** User #0000 */
  discriminator: `${Digit}${Digit}${Digit}${Digit}`,
  /** The user's {@link https://discord.com/developers/docs/reference#image-formatting Avatar Hash} */
  avatar: string | undefined,
  /** Belongos to an OAUTH App? */
  bot?: boolean,
  /** whether the user is an Official Discord System user (part of the urgent message system) */
  system?: boolean,
  /** Public {@link https://discord.com/developers/docs/resources/user#user-object-user-flags flags} on a user's account */
};
/** {@link https://discord.com/developers/docs/resources/user#user-object-premium-types docs} */
export enum NitroType {
  /** NO nitro */
  NONE=0,
  /** Nitro Classic, RIP */
  CLASSIC=1,
  /** Nitro Classic, RIP */
  OG=1,
  /** Nitro Full */
  FULL=2,
  /** Wannabe Nitro Classic that fails so hard you might aswell pretend this isn't in the enum */
  BASIC=3,
}
/** {@link APIUser} with fields typically only revealed for OAUTH Apps & yourself */
export type APIUserSelf = APIUser & {
  /** Phone Number */
  phone?: string,
  /** 2FA Enabled? */
  mfa_enabled: boolean,
  /** Has mobile device? I think? */
  mobile?: boolean,
  /**
   * Does the user have Nitro?
   * @deprecated undocumented, likely in favour of purchased_flags
   */
  premium: boolean,
  /** what kind of nitro? */
  purchased_flags: NitroType,
  /** undocumented, unknown */
  premium_usage_flags: APIUnknown,
  /** Current Locale */
  locale: string,
  /** Email */
  email: string,
  /** {@link https://discord.com/developers/docs/resources/user#user-object-user-flags flags} on the user's acc */
  flags: number,
}

export type APIBaseMember = {
  /** Nickname */
  nick?: string,
  /** the member's {@link https://discord.com/developers/docs/reference#image-formatting guild avatar hash} */
  avatar?: string,
  /** array of {@link https://discord.com/developers/docs/topics/permissions#role-object role} object ids */
  roles: Snowflake[],
  /** when the user joined the guild */
  joined_at: ISO8601,
  /** when the user started boosting thet guild */
  premium_since?: ISO8601,
  /** is the user deafened in vcs? */
  deaf: boolean,
  /** is the user muted in vcs? */
  mute: boolean,
  /** whether the user has not yet passed the guild's {@link https://discord.com/developers/docs/resources/guild#membership-screening-object Membership Screening} requirements */
  pending?: boolean,
  /** total permissions of the member in the channel, including overwrites, returned when in the interaction object */
  permissions?: string,
  /** when the user's {@link https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ timeout} will expire and the user will be able to communicate in the guild again, null or a time in the past if the user is not timed out */
  communications_disabled_until?: ISO8601,
}
export type APIMember = APIBaseMember & {
  /** {@link APIUser} behind this Member */
  user?: APIUser,
}
/** Permission Overwrites */
export type APIOverwrite = {
  /** role or user id */
  id: Snowflake,
  /** Either 0 (role) or 1 (member) */
  type: 0 | 1,
  /** Allow permission bit set */
  allow: string,
  /** Deny permission bit set */
  deny: string,
}
export type APIRole = APIUnknown;
/** Embed Type */
export enum EmbedType {
  Rich = 'rich',
  Image = 'image',
  Video = 'video',
  AnimatedGif = 'gifv',
  Article = 'article',
  Link = 'link',
}
/** An Embed Object */
export type APIEmbed = {
  title?: string,
  type?: string,
  description?: string,
  url?: string,
  timestamp?: ISO8601,
  color?: number,
  thumbnail?: {url:string, proxy_url:string, width: number, height: number}
};
/** Channel Type */
export enum ChannelType {
  /** Guild Text Channl */
  GUILD_TEXT = 0,
  /** DM Text/Voice Channel */
  DM = 1,
  /** Guild Voice CHannel */
  GUILD_VOICE = 2,
  /** A Group Chat */
  GROUP_DM = 3,
  /** An {@link https://support.discord.com/hc/en-us/articles/115001580171-Channel-Categories-101 organizational category} that contains up to 50 channels */
  GUILD_CATEGORY = 4,
  /** A channel that {@link https://support.discord.com/hc/en-us/articles/360032008192 users can follow & crosspost into their own server} (formerly news channels) */
  GUILD_ANNOUNCEMENT = 5,
  /** A temporary sub-channel within a {@link GUILD_ANNOUNCEMENT Announcement} channel | >=API v9  */
  ANNOUNCEMENT_THREAD =10,
  /** A temporary sub-chanel within a {@link GUILD_TEXT Guild Text} or {@link GUILD_FORUM Guild Forum} channel | >=API v9 */
  PUBLIC_THREAD = 11,
  /** The same thing as a {@link PUBLIC_THREAD Public Thread} however only visible by those invited or with the {@link Permissions.MANAGE_THREADS MANAGE_THREADS} Permission | >=API v9  */
  PRIVATE_THREAD = 12,
  /** A {@link GUILD_VOICE Voice Channel} for hosting events with an audience */
  GUILD_STAGE_VOICE = 13,
  /** The channel in a {@link https://support.discord.com/hc/en-us/articles/4406046651927-Discord-Student-Hubs-FAQ Hub} containing the listed servers */
  GUILD_DIRECTORY = 14,
  /** A Channel that can only containa {@link PUBLIC_THREAD Public} & {@link PRIVATE_THREAD Private} Threads. */
  GUILD_FORUM = 15,
}
/** {@link https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes docs} */
export enum VideoQualityMode {
  /** Discord chooses the quality for optimal performance */
  AUTO = 1,
  /** 720p */
  FULL = 2,
}
/** {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-flags docs} */
export enum ChannelFlags {
  /** 1 << 1 | this thread is pinned to the top of its parent GUILD_FORUM channel */
  PINNED = 1 << 1,
  /** 1 << 4 | whether a tag is required to be specified when creating a thread in a GUILD_FORUM channel. Tags are specified in the applied_tags field. */
  REQUIRE_TAG = 1 << 4,
}
/** {@link https://discord.com/developers/docs/resources/channel#channel-object-sort-order-types docs} */
export enum SortOrder {
  /** Sort forum posts by activity */
  LATEST_ACTIVITY = 0,
  /** Sort forum posts by creation time (from most recent to oldest) */
  CREATION_DATE = 1,
}
/** {@link https://discord.com/developers/docs/resources/channel#forum-tag-object docs} */
export type APITag = {
  id: Snowflake,
  name: string,
  moderated: boolean,
} & ({
  emoji_id: Snowflake,
} | {
  emoji_name: string,
})
/** {@link https://discord.com/developers/docs/resources/channel#default-reaction-object docs} */
export type APIDefaultReaction = {
  emoji_id?: Snowflake,
} | {
  emoji_name?: string
}
/** {@link https://discord.com/developers/docs/resources/channel#channel-object docs} */
export type APIChannel = {
  /** Channel ID */
  id: Snowflake,
  /** Channel Type */
  type: ChannelType,
  /** Guild ID */
  guild_id?: Snowflake,
  /** Where to put the cannel */
  postion?: number,
  /** explicit {@link https://discord.com/developers/docs/resources/channel#overwrite-object permission overwrites} for members & roles. */
  permission_overwrites?: APIOverwrite[],
  /** Name of the channel, max 100 chars */
  name?: string,
  /** Channel topic, the channel topic (0-4096 characters for {@link ChannelType.GUILD_FORUM Guild Forum} channels, 0-1024 characters for all others) */
  topic?: string,
  /** Is the channel NSFW (we should make an option to ignore this) */
  nsfw?: boolean,
  /** The id of the last message sent in this channel (or thread for {@link ChannelType.GUILD_FORUM Guild Forum} channels) (may not point to an existing or valid message or thread) */
  last_message_id?: Snowflake,
  /** User Limit of Voice Channels */
  user_limit?: number,
  /** timeout | amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission {@link Permissions.MANAGE_MESSAGES MANAGE_MESSAGES} or {@link Permissions.MANAGE_CHANNEL MANAGE_CHANNEL}, are unaffected */
  rate_limit_per_user: number,
  /** Recepients of a {@link ChannelType.DM DM}/{@link ChannelType.GROUP_DM Group DM} */
  recipients?: APIUser[],
  /** Recepients of a {@link ChannelType.DM DM}/{@link ChannelType.GROUP_DM Group DM} */
  recipient_ids?: Snowflake[],
  /** Icon Hash of a {@link ChannelType.GROUP_DM Group DM} */
  icon?: string,
  /** ID of the creator of the group DM or Thread. */
  owner_id?: Snowflake,
  /** application id of the group DM creator if it is bot-created */
  application_id?: Snowflake,
  /** for guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created */
  parent_id?: Snowflake,
  /** when the last pinned message was pinned. This may be null in events such as {@link Permissions.GUILD_CREATE GUILD_CREATE} when a message is not pinned. */
  last_pin_timestamp: ISO8601,
  /** {@link https://discord.com/developers/docs/resources/voice#voice-region-object voice region} id for the voice channel, automatic when set to null */
  rtc_region?: string,
  /** the camera {@link https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes video quality mode} of the voice channel, 1 when not present */
  video_quality_mode?: number,
  /** number of messages (not including the initial message or deleted messages) in a thread. For threads created before July 1, 2022, the message count is inaccurate when it's greater than 50. */
  message_count?: number,
  /** an approximate count of users in a thread, stops counting at 50 */
  member_count?: number,
  /** thread-specific fields not needed by other channels | {@link https://discord.com/developers/docs/resources/channel#thread-metadata-object docs} */
  thread_metadata?: {
    archived: boolean,
    auto_archive_duration: number,
    archive_timestamp: ISO8601,
    locked: boolean,
    invitable?: boolean,
    create_timestamp?: ISO8601
  },
  /** thread member object for the current user, if they have joined the thread, only included on certain API endpoints | {@link https://discord.com/developers/docs/resources/channel#thread-member-object docs} */
  member?: {
    id?: Snowflake,
    user_id?: Snowflake,
    join_timestamp: ISO8601,
    flags: number,
  },
  /** default duration, copied onto newly created threads, in minutes, threads will stop showing in the channel list after the specified period of inactivity, can be set to: 60, 1440, 4320, 10080 */
  default_auto_archive_duration?: number,
  /** computed permissions for the invoking user in the channel, including overwrites, only included when part of the resolved data received on a slash command interaction */
  permissions?: string,
  /** {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-flags channel flags} ({@link ChannelFlags enum}) combined as a {@link https://en.wikipedia.org/wiki/Bit_field bit field} */
  flags?: number,
  /** number of messages ever sent in a thread, it's similar to message_count on message creation, but will not decrement the number when a message is deleted */
  total_messages_sent?: number,
  /** the set of tags that can be used in a GUILD_FORUM channel */
  available_tags?: APITag[],
  /** the IDs of the set of tags that have been applied to a thread in a GUILD_FORUM channel */
  applied_tags?: Snowflake[],
  /** the emoji to show in the add reaction button on a thread in a GUILD_FORUM channel */
  default_reaction_emoji?: APIDefaultReaction,
  /** the initial rate_limit_per_user to set on newly created threads in a channel. this field is copied to the thread at creation time and does not live update. */
  default_thread_rate_limit_per_user?: number,
  /** the default sort order type used to order posts in GUILD_FORUM channels. Defaults to null, which indicates a preferred sort order hasn't been set by a channel admin */
  default_sort_order?: number,
};
/** {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types docs} */
export enum ActivityType {
  /** Playing {@link APIActivity.name} */
  GAME=0,
  /** Streaming {@link APIActivity.details} */
  STREAMING=1,
  /** Listening to {@link APIActivity.name} */
  LISTENING=2,
  /** Watching {@link APIActivity.name} */
  WATCHING=3,
  /** {@link APIActivity.emoji APIActivity.emoji?} {@link APIActivity.name} */
  CUSTOM=4,
  /** Competing in {@link APIActivity.name} */
  COMPETING=5,
}
/** {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-assets docs} */
export type APIActivityAssets = {
  /** See {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-asset-image Activity Asset Image} */
  large_image?: string,
  /** Hover Text for {@link APIActivityAssets.large_image} */
  large_text?: string,
  /** See {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-asset-image Activity Asset Image} */
  small_image?: string,
  /** Hover Text for {@link APIActivityAssets.small_image} */
  small_text?: string
}
/** {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-buttons docs} */
export type APIActivityButtons = {
  /** Text shown on the button (1-32 characters) */
  label: string,
  /** URL opened when clicking the button (1-512 characters) */
  url: string
}
/** {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-structure docs} */
export type APIActivity = {
  /** Activity's name */
  name: string,
  /** {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types Activity Type} */
  type: ActivityType,
  /** Stream URL, validated if type=1 */
  url?: string,
  /** Unix timestamp (ms) of when the activity was added to the ser's session */
  created_at: number,
  /** Start/End of the game/activity/thing | Unix Millis */
  timestamps?: {
    start?: number,
    end?: number
  },
  /** Application ID for the game */
  application_id?: Snowflake,
  /** What the player is doing */
  details?: string,
  /** User's current party status */
  state?: string,
  /** Party Object */
  party?: {
    /** ID of the party */
    id?: string,
    /** array of 2 ints; current_size, max_size */
    size?: number[]
  },
  /** Assets for the activity */
  assets?: APIActivityAssets,
  /** Secrets for Rich Presence joining and spectating */
  secrets?: {
    /** Join Secret */
    join?: string,
    /** Spectate Secret */
    spectate?: string,
    /** Match Secret */
    match?: string
  },
  /** Whether or not the activity is an instanced game session */
  instance?: boolean,
  /** Activity flags `OR`d together, describes what the payload includes */
  flags?: number,
  /** Custom buttons shown in the Rich Presence (max 2) */
  buttons?: APIActivityButtons[],
};
export type APIComponent = APIUnknown;
/** {@link https://discord.com/developers/docs/topics/gateway-events#client-status-object docs} */
export type APIClientStatus = {
  /** User's status set for an active desktop (Windows, Linux, Mac) application session */
  desktop?: string,
  /** User's status set for an active mobile (iOS, Android) application session */
  mobile?: string,
  /** User's status set for an active web (browser, bot account) application session */
  web?: string,
}
/** {@link https://discord.com/developers/docs/resources/sticker#sticker-item-object docs} */
export type APISticker = {
  /** {@link https://discord.com/developers/docs/reference#image-formatting id of the sticker} */
  id: Snowflake,
  /** name of the sticker */
  name: string,
  /** {@link https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types type of sticker format} */
  format_type: number,
};
/** {@link https://discord.com/developers/docs/resources/emoji docs} */
export type APIEmoji = {
  id?: Snowflake,
  /** Can only be null in reaction emoji objects */
  name?: string,
  /** array of role object ids - roles allowed to use this emoji */
  roles?: Snowflake[]
  /** user who created */
  user?: APIUser,
  /** whether this emoji must be wrapped in :s */
  require_colons?: boolean,
  /* whether this emoji is managed */
  managed?: boolean,
  /** whether this emoji is animated */
  animated?: boolean,
  /** whether this emoji can be used, may be false due to loss of server boosts */
  available: boolean,
};
/** {@link https://discord.com/developers/docs/resources/channel#message-object docs} */
export type APIMessage = {
  /** id of the message */
  id: Snowflake,
  /** id of the channel */
  channel_id: Snowflake,
  /** sender, may not be complet or avaialble at all */
  author?: Partial<APIUser>,
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
  mentions: APIUser[]
  /** roles specifiically mentioned */
  mention_roles: APIRole[],
  /**
   * Channels specifically mentioned in this message
   * Not all channel mentions in a message will appear in mention_channels. Only textual channels that are visible to everyone in a lurkable guild will ever be included. Only crossposted messages (via Channel Following) currently include mention_channels at all. If no mentions in the message meet these requirements, this field will not be sent.
   */
  mention_channels: APIChannel[],
  /** List of attachments */
  attachments: APIAttachment[],
  /** Embeds */
  embeds: APIEmbed[],
  /** Reactions */
  reactions?: APIReaction[],
  /** Nonce for validation */
  nonce: number | string,
  /** Is the message pinned? */
  pinned: boolean,
  /** which webhook id if any */
  webhook_id?: Snowflake,
  /** https://discord.com/developers/docs/resources/channel#message-object-message-types */
  type: number;
  /** https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure */
  activity?: APIUnknown,
  // TODO: INCOMPLETE, FINISH THIS
  /** available if a thread was started from this message */
  thread?: APIChannel,
  /** list of components, if any */
  components?: APIComponent[],
  /** stickers, if any */
  sticker_items?: APISticker[],
  /** A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with total_message_sent on parent thread */
  position?: number
} & Record<string, APIUnknown>
/** A Session, Reverse Engineered from the Ready Event */
export type APISession = {
  /** Is this the current session? */
  active?: true,
  /** List of activities */
  activities: APIActivity[]
}
export type APIBasePresence = {
  activities: APIActivity[],
  last_modified: number,
  status: string,
  client_status: APIClientStatus
}
/** A Presence */
export type APISelfPresence = {
  user_id: Snowflake,
} & APIBasePresence
/** A Presence */
export type APIPresence = {
  user: APIUser
} & APIBasePresence
/** Reverse-Engineered {@link https://discord.com/developers/docs/topics/gateway-events#ready READY} event */
export type IReadyEventData = {
  /** Internal Traceback for Discord */
  _trace: string[],
  /** Discord Analytics Token */
  ananlytics_token: string,
  /** API Code Version */
  api_code_version: number,
  /** Auth Session ID */
  auth_session_id_hash: string,
  /** Connected Accounts (under Connections) */
  connected_accounts: APIConnectedAccount[];
  /** Things the user has consented to */
  consents: {
    persionalization: {
      consented: boolean,
    },
  },
  /** Country Code */
  country_code: string,
  /** Enabled Experiemnts */
  experiments: number[][],
  /** Amount of suggested friends */
  friend_suggestion_count: number,
  /** Geographically-Ordered RTC Regions (nearest to furthest) */
  geo_ordered_rtc_regions: string[],
  /** Enabled Guild-Related Experiemnts */
  guild_experiments: (string|number|null)[][]
  /** Unfinished Join Requests for Guilds (Rules & whatnot) */
  guild_join_requests: APIJoinRequest[],
  /** List of Guilds */
  guilds: APIGuild[],
  /** You in every guild */
  merged_members: (APIBaseMember & {
    /** {@link APIUser}'s ID behind this Member */
    user_id?: Snowflake
  })[],
  private_channels: APIChannel[],
  read_state: unknown,
  relationships: unknown,
  /** URL for reconnecting to the gateway */
  resume_gateway_url: string,
  /** Session ID for reconnecting to the gateway */
  session_id: string,
  /** Session Type */
  session_type: string,
  /** Current Tutorial Step */
  tutorial: APIUnknown,
  /** Current User Object */
  user: APIUserSelf,
  /** Current User's Guild Settings. For every guild you've ever joined (i think) */
  user_guild_settings: {
    entries: APIUnknown[], // APIUserGuildSettings[],
    partial: boolean,
    version: 459,
  },
  /** Unknown wtf base64 */
  user_settings_proto: string,
  /** Every user in our DMs list & some not in our DMs list */
  users: (APIBaseMember & {
    /** {@link APIUser}'s ID behind this Member */
    user_id?: Snowflake
  })[]
}
/** Reverse-Engineered {@link https://discord.com/developers/docs/topics/gateway-events#ready READY} event */
export type IReadyEvent = {
  t: 'READY',
  d: IReadyEventData
}
/** {@link https://discord.com/developers/docs/topics/gateway-events#message-create docs} */
export type IDispatchEvent = (
// ////////////// PRESENCE EVENT ////////////// //
{
  /** event type */
  t: 'PRESENCE_UPDATE'
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#presence-update docs} */
  d: {
    /** User who's presence is being updated */
    user: APIUser,
    /** Guild ID */
    guild_id: Snowflake,
    /** Status */
    status: 'idle' | 'dnd' | 'online' | 'offline',
    /** activity list */
    activities: APIActivity[],
    /** User's platform-dependent status */
    client_status: APIClientStatus
  } & APIPresence
} |
// ////////////// MESSAGE EVENTS ////////////// //
{
  /** event type */
  t: 'MESSAGE_CREATE',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-create docs} */
  d: APIMessage & {
    /** ID of the guild the message was sent in - unless it is an ephemeral message */
    guild_id?: Snowflake,
    /** Member properties for this message's author. Missing for ephemeral messages and messages from webhooks */
    member?: Partial<APIMember>,
    /** Users specifically mentioned in the message - array of user objects, with an additional partial member field */
    mentions: APIUnknown,
  }
} | {
  /** event type */
  t: 'MESSAGE_UPDATE',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-update docs} - Unlike creates, message updates may contain only a subset of the full message object payload (but will always contain an ID and channel_id). */
  d: Partial<APIMessage> & {
    /** ID of the guild the message was sent in - unless it is an ephemeral message */
    guild_id?: Snowflake,
    /** Member properties for this message's author. Missing for ephemeral messages and messages from webhooks */
    member?: Partial<APIMember>,
    /** Users specifically mentioned in the message - array of user objects, with an additional partial member field */
    mentions: APIUnknown,
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
    member?: APIMember,
    /** Emoji used to react - {@link https://discord.com/developers/docs/resources/emoji#emoji-object-standard-emoji-example example} */
    emoji: Partial<APIEmoji>,
    /** Doing it in burst? no clue how it looks when true */
    burst: boolean,
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
    emoji: Partial<APIEmoji>
  }
} | {
  /** event type */
  t: 'MESSAGE_REACTION_REMOVE_ALL',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-all docs} */
  d: {
    burst: false,
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
    emoji: Partial<APIEmoji>
  }
} | {
  /** event type */
  t: 'CHANNEL_UPDATE',
  /** data */
  d: APIChannel
} | {
  /** event type */
  t: 'SESSIONS_REPLACE',
  /** data */
  d: APISession[]
} | {
  /** event type | Update a specific guild */
  t: 'PASSIVE_UPDATE_V1',
  /** data */
  d: {
    /** Channels, very incomplete */
    channels: {
      /** Channel ID */
      id: Snowflake,
      /** Last Pinned */
      last_pin_timestamp?: ISO8601,
      /** Last Message */
      last_message_id?: Snowflake
    },
    /** Guild to update */
    guild_id: Snowflake
  }
} | {
  /** event type */
  t: 'GUILD_UPDATE',
  /** data */
  d: APIGuild
} | {
  /** event type | this one's reversed btw */
  t: 'READY_SUPPLEMENTAL',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-emoji docs} */
  d: {
    guilds: {
      id: string,
      emedded_activities: unknown[],
      voice_states: APIVoiceState[]
    }[],
    lazy_private_channels: never[],
    /** memberswe know about; idx is guilds idx, value is list of members we know bout */
    merged_members: (APIBaseMember & {
      /** {@link APIUser}'s ID behind this Member */
      user_id?: Snowflake
    })[][]
    /** :shrug */
    merged_presences: {
      friends: APIActivity[]
    }
  }
} | {
  /** event type | this one's reversed btw */
  t: 'CHANNEL_CREATE',
  /** data - {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-emoji docs} */
  d: APIChannel,
} | IReadyEvent) & {
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

export type GatewayEvents = {
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
  /** Non-API event (internal) - Websocket Connection Established */
  'WEBSOCKETCONNECT': ()=>void;
  /** Non-API event (internal) - Websocket Connection Closed */
  'WEBSOCKETCLOSE': ()=>void;
};
