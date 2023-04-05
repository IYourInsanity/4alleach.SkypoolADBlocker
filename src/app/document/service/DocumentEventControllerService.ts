import { EventController } from "../../../framework/service/EventController";
import IDocumentEventControllerService from "./abstraction/IDocumentEventControllerService";

export default abstract class DocumentEventControllerService
extends EventController<{Type: string, Data: any}, EventTarget | null> 
implements IDocumentEventControllerService
{
    constructor(key: string)
    {
        super(key);

        this.receiveCustomEvent = this.receiveCustomEvent.bind(this);
    }
    
    public receiveCustomEvent(event: CustomEvent | Event): void 
    {
        if(event instanceof CustomEvent)
        {
            this.receive({Type: event.detail.Type, Data: event.detail.Data}, event.target);
        }
    }
}