/** https://discord.com/developers/docs/topics/opcodes-and-status-codes */
export enum GATEWAY_OPCODE {
  /**
   * @ClientAction Recieve
   * @Description An event was dispatched.
   */
  DISPATCH = 0,
  /**
   * @ClientAction Send, Recieve
   * @Description Fired periodically by the client to keep the connection alive.
   */
  HEARTBEAT = 1,
  /**
   * @ClientAction Send
   * @Description Starts a new session during the initial handshake.
   */
  IDENTIFY = 2,
  /**
   * @ClientAction Send
   * @Description Update the client's presence.
   */
  PRESENCEUPDATE = 3,
  /**
   * @ClientAction Send
   * @Description Used to join/leave or move between voice channels.
   */
  VOICESTATEUPDATE = 4,
  /**
   * @ClientAction Send
   * @Description Resume a previous session that was disconnected.
   */
  RESUME = 6,
  /**
   * @ClientAction Receive
   * @Description You should attempt to reconnect and resume immediately.
   */
  RECONNECT = 7,
  /**
   * @ClientAction Send
   * @Description Request information about offline guild members in a large guild.
   */
  REQUESTGUILDMEMBERS = 8,
  /**
   * @ClientAction Receive
   * @Description The session has been invalidated. You should reconnect and identify/resume accordingly.
   */
  INVALIDSESSION = 9,
  /**
   * @ClientAction Receive
   * @Description Sent immediately after connecting, contains the heartbeat_interval to use.
   */
  HELLO = 10,
  /**
   * @ClientAction Receive
   * @Description Sent in response to receiving a heartbeat to acknowledge that it has been received.
   */
  HEARTBEATACK = 11,
}
