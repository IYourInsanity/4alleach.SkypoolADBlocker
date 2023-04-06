import { EventController } from "../../../framework/service/EventController";

export abstract class DocumentEventControllerService<TData, TSender> extends EventController<TData, TSender>
{
    constructor(key: string)
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