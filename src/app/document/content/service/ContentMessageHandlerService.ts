import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import { EventCommandType } from "../../../../common/model/EventCommandType";
import ContentEventControllerService from "./ContentEventControllerService";
import IContentEventControllerService from "./abstraction/IContentEventControllerService";
import IContentMessageHandlerService from "./abstraction/IContentMessageHandlerService";
import UniqueIDGenerator from "../../../../framework/helper/UniqueIDGenerator";

export default class ContentMessageHandlerService extends Service implements IContentMessageHandlerService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 1;

    private eventController: IContentEventControllerService;

    constructor(serviceHub: IServiceHub)
    {
        super(ContentMessageHandlerService.key, serviceHub);

        this.receive = this.receive.bind(this);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.eventController = await this.serviceHub.getAsync(ContentEventControllerService);
        this.eventController.add(ContentMessageHandlerService.key, this.receive);
    }

    public async reset(): Promise<void> 
    {
        if(this.eventController?.remove !== undefined)
        {
            this.eventController.remove(ContentMessageHandlerService.key, this.receive);
        }
        
        this.isWork = false;
    }
    
    private receive(message: IEventMessage, sender: EventTarget | chrome.runtime.Port | null): void
    {
        switch(message.Event)
        {
            case EventCommandType.MainScriptInstalled:
            case EventCommandType.NodeIsBlocked:

                this.eventController.send(message);
                
                break;
        }
    }
}