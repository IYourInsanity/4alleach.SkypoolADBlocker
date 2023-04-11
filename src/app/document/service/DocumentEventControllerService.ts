import { IEventMessage } from "../../../framework/abstraction/IEventMessage";
import { EventController } from "../../../framework/service/EventController";

export abstract class DocumentEventControllerService<TData extends IEventMessage, TSender> extends EventController<TData, TSender>
{
    constructor(key: number)
    {
        super(key);

        this.receiveCustomEvent = this.receiveCustomEvent.bind(this);
    }
    
    protected receiveCustomEvent(event: CustomEvent | Event): void 
    {
        if(event instanceof CustomEvent)
        {
            this.receive(event.detail.Message, <TSender>event.target);
        }
    } 
}