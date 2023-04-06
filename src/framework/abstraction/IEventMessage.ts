export default interface IEventMessage
{
   readonly MessageId: string;

   readonly Event: string;

   readonly Data: any;
}