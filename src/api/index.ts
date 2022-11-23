/* eslint-disable camelcase */
import * as Gateway from './gateway';
import { EventEmitter } from 'events';
import {
  Message, ResolveMessage
} from './types/Message';

export interface ClientEvents {
  /** The Websocket Connection was established successfully */
  'ConnectionEstablished': () => void;
  /** Client is ready, handshake completed */
  'Ready': () => void
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
  /** CORS proxy */
  proxy = 'http://127.0.0.1:8080/';
  /** Reconnect to the gateway in the case of a connection death */
  reconnect(){
    this.gateway.newSocket();
  }
  /**
   * @constructor
   * @param token Auth Token
   */
  constructor(token:string) {
    super();
    this.token = token;
    this.gateway = Gateway.NewSocket(token);
    // connection events:
    this.gateway.on('WEBSOCKETCONNECT', ()=>this.emit('ConnectionEstablished'));
    this.gateway.on('HELLO', ()=>this.emit('Ready'));
    // dispatched:
    this.gateway.on('DISPATCH', (dispatchedData) => {
      switch (dispatchedData.t) {
      case 'MESSAGE_CREATE':
        this.emit('MessageCreate', ResolveMessage(dispatchedData.d));
        break;
      case 'MESSAGE_UPDATE':
        this.emit('MessageEdit', ResolveMessage(dispatchedData.d));
        break;
      case 'MESSAGE_DELETE':{
        const m = ResolveMessage(dispatchedData.d.id);
        if (m){
          m._MarkAsDeleted();
          this.emit('MessageDelete', m);
        }
        this.emit('MessageDeleteRaw', dispatchedData.d);
        break;
      }
      }
    });
  }
}
export const login = (token: string)=>active = new Client(token);
export let active: Client;
export default active;
