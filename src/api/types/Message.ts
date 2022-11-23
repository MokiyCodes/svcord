import type {
  APIMessage, Snowflake
} from '../api';
import { EventEmitter } from 'events';

const Messages: Record<Snowflake, Message> = {};
export const ResolveMessage = (APIMessage: Partial<APIMessage> | Snowflake) => {
  if (typeof APIMessage !== 'object')
    return Messages[APIMessage];
  if (!Messages[APIMessage.id])
    Messages[APIMessage.id] = new Message(APIMessage as APIMessage);
  Messages[APIMessage.id]._Update(APIMessage);
  return Messages[APIMessage.id];
};
export default ResolveMessage;

type MessageEvents = {
  /** On message deletion */
  'Deleted': ()=>void;
  /** On message edit */
  'Edited': (oldContent:string, newContent:string)=>void
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
  contentHistory: string[];
  /** Whether the message has been deleted or not */
  deleted: boolean;
  /** Date this message was sent at */
  sentAt: Date;
  /** Internal Method used to mark the message as deleted */
  _MarkAsDeleted() {
    this.deleted = true;
    this.emit('Deleted');
  }
  /** Internal Method used to update the message when necessary */
  _Update(NewAPIMessage: Partial<APIMessage>) {
    if (NewAPIMessage.content !== this.content)
      this.emit('Edited', this.content, NewAPIMessage.content);
    for (const k in NewAPIMessage)
      if (Object.prototype.hasOwnProperty.call(NewAPIMessage, k)) {
        const v = NewAPIMessage[k];
        this._APIMessage[k] = v;
      }
  }
  constructor(APIMessage: APIMessage) {
    super();
    this._APIMessage = APIMessage;
    this.sentAt = new Date(APIMessage.timestamp);
    this.on('Edited', (old:string, current:string) =>{
      this.content = current;
      this.contentHistory.push(old);
    });
  }
}
