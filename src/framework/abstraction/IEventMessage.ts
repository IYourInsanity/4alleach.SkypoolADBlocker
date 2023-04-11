import { EventCommandType } from "../../common/model/EventCommandType";
import Guid from "../../common/model/Guid";

export interface IEventMessage
{
   readonly MessageId: string;

   readonly Direct?: EventCommandType;

   readonly Event: EventCommandType;

   readonly Data: any;
}

export class EventMessage implements IEventMessage
{
   readonly MessageId: string;

   readonly Event: EventCommandType;

   readonly Data: any;
   
   private constructor(messageId: string, event: EventCommandType, data: any)
   {
      this.MessageId = messageId;
      this.Event = event;
      this.Data = data;
   }

   public static Empty: IEventMessage = new EventMessage(Guid.empty, EventCommandType.Empty, {});

   public static create(messageId: string, event: EventCommandType, data: any): IEventMessage
   {
      return new EventMessage(messageId, event, data);
   }

}