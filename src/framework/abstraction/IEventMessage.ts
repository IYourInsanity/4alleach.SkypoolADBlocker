import Guid from "../../common/model/Guid";

export interface IEventMessage
{
   readonly MessageId: string;

   readonly Event: string;

   readonly Data: any;
}

export class EventMessage implements IEventMessage
{
   readonly MessageId: string;

   readonly Event: string;

   readonly Data: any;
   
   constructor(messageId: string, event: string, data: any)
   {
      this.MessageId = messageId;
      this.Event = event;
      this.Data = data;
   }

   public static Empty: IEventMessage = new EventMessage(Guid.empty, 'Empty', {});

   public static Disconnected(messageId: string, data: any): IEventMessage
   {
      return new EventMessage(messageId, 'Disconnected', data);
   }

   public static Cancel(messageId: string): IEventMessage
   {
      return new EventMessage(messageId, 'Cancel', {});
   }

   public static CancelByToken(messageId: string): IEventMessage
   {
      return new EventMessage(messageId, 'CancelByToken', {});
   }
}