import type {
  Snowflake, APIUser
} from '../apitypes';
import { EventEmitter } from 'events';
import type { Client } from '..';

const Users: Record<Snowflake, User> = {};
export const ResolveUser = (APIUser: Partial<APIUser> | Snowflake, Client: Client) => {
  if (typeof APIUser !== 'object')
    return Users[APIUser];
  if (!Users[APIUser.id])
    Users[APIUser.id] = new User(APIUser as APIUser, Client);
  Users[APIUser.id]._Update(APIUser);
  return Users[APIUser.id];
};
export default ResolveUser;

type UserEvents = {
  'test': ()=>void;
}
export interface User {
  on<U extends keyof UserEvents>(
    event: U, listener: UserEvents[U]
  ): this;

  emit<U extends keyof UserEvents>(
    event: U, ...args: Parameters<UserEvents[U]>
  ): boolean;
}
export class User extends EventEmitter {
  /** Raw API User */
  _APIUser: APIUser;
  /** When a user is updated */
  _Update(newData: Partial<APIUser>){
    for (const k in newData)
      if (Object.prototype.hasOwnProperty.call(newData, k))
        this._APIUser[k] = newData[k];
  }
  /**
   * User's ID
   * @readonly
   */
  public get id() : Snowflake {
    return this._APIUser.id;
  }
  /**
   * User's name
   * @readonly
   */
  public get name() : string {
    return this._APIUser.username;
  }
  /**
   * User's discriminator
   * @readonly
   */
  public get discriminator() : typeof this._APIUser.discriminator {
    return this._APIUser.discriminator;
  }
  /**
   * User's user#discriminator
   * @readonly
   */
  public get tag() : `${string}#${typeof this._APIUser.discriminator}` {
    return `${this.name}#${this.discriminator}`;
  }
  /** What client owns this user */
  client: Client;
  constructor(APIUser: APIUser, Client: Client) {
    super();
    this.client = Client;
    this._APIUser = APIUser;
    this.client.emit('UserDiscovered', this);
  }
}
