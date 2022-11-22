import { GATEWAY_OPCODE as OPCODE } from './opcodes';
import { EventEmitter } from 'events';
import type {
  GatewayEvents, IDispatchEvent
} from './api';

export interface GatewayWebsocket {
  on<U extends keyof GatewayEvents>(
    event: U, listener: GatewayEvents[U]
  ): this;

  emit<U extends keyof GatewayEvents>(
    event: U, ...args: Parameters<GatewayEvents[U]>
  ): boolean;
}
export class GatewayWebsocket extends EventEmitter {
  socket: WebSocket;
  token: string;
  reloadOnFail = true;
  send(opcode: OPCODE, data: Record<any, any>) {
    this.socket.send(JSON.stringify({
      'op': opcode,
      'd': data
    }));
  }
  close(){
    if (this.socket.readyState !== this.socket.CLOSED)
      this.socket.close();
  }
  newSocket() {
    this.socket = new WebSocket('wss://gateway.discord.gg/?encoding=json&v=9');
    const socket = this.socket;
    let currentS = 0;
    let inter: number;
    socket.addEventListener('message', ({ data })=>{
      const raw: {
        t?: any,
        s: any,
        op: number,
        d: any
      } = JSON.parse(data);
      currentS = raw.s ?? currentS + 1;
      switch (raw.op) {
      case OPCODE.HELLO:
        this.send(OPCODE.IDENTIFY, {
          'token': this.token,
          'capabilities': 4093,
          'properties': {
            'os': '',
            'browser': '',
            'device': '',
            'system_locale': 'en-US',
            'browser_user_agent': navigator.userAgent,
            'browser_version': '',
            'os_version': '',
            'referrer': '',
            'referring_domain': '',
            'referrer_current': '',
            'referring_domain_current': '',
            'release_channel': 'stable',
            'client_build_number': 160179,
            'client_event_source': null
          },
          'presence': {
            'status': 'online',
            'since': 0,
            'activities': [],
            'afk': false
          },
          'compress': false,
          'client_state': {
            'guild_versions': {},
            'highest_last_message_id': '0',
            'read_state_version': 0,
            'user_guild_settings_version': -1,
            'user_settings_version': -1,
            'private_channels_version': '0',
            'api_code_version': 0
          }
        });
        inter = setInterval(()=>this.send(OPCODE.HEARTBEAT, currentS as unknown), raw.d.heartbeat_interval);
        this.emit('HELLO', raw);
        break;
      case OPCODE.DISPATCH:
        this.emit('DISPATCH', raw as IDispatchEvent);
        break;
      case OPCODE.RECONNECT:
        this.close();
        if (this.reloadOnFail)
          location.reload();
        break;
      }
    });
    socket.addEventListener('close', ()=>clearInterval(inter));
  }
  constructor(token:string){
    if (!token)
      throw new Error('no token');
    super();
    this.token = token;
    this.newSocket();
  }
}
export const GATEWAY_OPCODE = OPCODE;
export const NewSocket = (token:string)=>activeSocket = new GatewayWebsocket(token);
export let activeSocket: GatewayWebsocket; // = new WebSocket('wss://gateway.discord.gg/?encoding=json&v=9');
export default activeSocket;
