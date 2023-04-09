import Guid from "../model/Guid";
import { IEventMessage } from "../../framework/abstraction/IEventMessage";
import { EventCommandType } from "../model/EventCommandType";

export default class EventGenerator
{
    public static generateCustomEvent(direct: EventCommandType, message: IEventMessage): CustomEvent
    {
        return new CustomEvent(direct, 
            { 
                detail: 
                {
                    Message: message
                }
            });
    }

    public static generateEventMessage(event: EventCommandType, value: any): IEventMessage
    {
        return {
            MessageId: Guid.new(),
            Event: event,
            Data: value
        }
    }
}