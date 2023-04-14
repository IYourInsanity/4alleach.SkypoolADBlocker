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

   readonly Direct?: EventCommandType;

   readonly Event: EventCommandType;

   readonly Data: any;
   
   private constructor(messageId: string, event: EventCommandType, data: any, direct?: EventCommandType)
   {
      this.MessageId = messageId;
      this.Event = event;
      this.Data = data;
      this.Direct = direct;
   }

   public static Empty: IEventMessage = new EventMessage(Guid.empty, EventCommandType.Empty, {}, EventCommandType.Empty);

   public static new(event: EventCommandType, data: any, direct?: EventCommandType): IEventMessage
   {
      return EventMessage.create(Guid.new(), event, data, direct);
   }

   public static create(messageId: string, event: EventCommandType, data: any, direct?: EventCommandType): IEventMessage
   {
      return new EventMessage(messageId, event, data, direct);
   }
}