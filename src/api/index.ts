import * as Gateway from './gateway';

export class Client {
  gateway: Gateway.GatewayWebsocket;
  token: string;
  constructor(token:string) {
    this.token = token;
    this.gateway = Gateway.NewSocket(token);
  }
}
export const login = (token: string)=>active = new Client(token);
export let active: Client;
export default active;
