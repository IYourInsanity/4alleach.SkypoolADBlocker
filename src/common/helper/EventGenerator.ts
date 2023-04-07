import Guid from "../model/Guid";
import IEventMessage from "../../framework/abstraction/IEventMessage";

export default class EventGenerator
{
    public static generateCustomEvent(direct: string, message: IEventMessage): CustomEvent
    {
        return new CustomEvent(direct, 
            { 
                detail: 
                {
                    Message: message
                }
            });
    }

    public static generateEventMessage(event: string, value: any): IEventMessage
    {
        return {
            MessageId: Guid.new(),
            Event: event,
            Data: value
        }
    }
}