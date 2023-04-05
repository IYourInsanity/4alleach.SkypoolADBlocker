import { EventController } from "../../../framework/service/EventController";

export default abstract class DocumentEventController extends EventController<{Type: string, Data: any}, EventTarget | null>
{
    constructor(key: string)
    {
        super(key);

        this.receiveInternal = this.receiveInternal.bind(this);
    }
    
    protected receiveInternal(event: CustomEvent | Event): void 
    {
        if(event instanceof CustomEvent)
        {
            this.receive({Type: event.detail.Type, Data: event.detail.Data}, event.target);
        }
    }
}