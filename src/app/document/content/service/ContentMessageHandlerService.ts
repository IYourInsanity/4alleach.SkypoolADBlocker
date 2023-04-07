import Guid from "../../../../common/model/Guid";
import IEventMessage from "../../../../framework/abstraction/IEventMessage";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import EventCommand from "../../../../common/model/EventCommand";
import ContentEventControllerService from "./ContentEventControllerService";
import IContentEventControllerService from "./abstraction/IContentEventControllerService";
import IContentMessageHandlerService from "./abstraction/IContentMessageHandlerService";

export default class ContentMessageHandlerService extends Service implements IContentMessageHandlerService
{
    public static readonly key: string = Guid.new();
    public static readonly hash: number = ContentMessageHandlerService.GetHashCode(ContentMessageHandlerService.key);

    private eventController: IContentEventControllerService;

    constructor(serviceHub: IServiceHub)
    {
        super(ContentMessageHandlerService.key, serviceHub);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.eventController = this.serviceHub.get<IContentEventControllerService>(ContentEventControllerService);
        this.eventController.add(ContentMessageHandlerService.hash, this.receive);
    }
    
    private receive(message: IEventMessage, sender: EventTarget | chrome.runtime.Port | null): void
    {
        switch(message.Event)
        {
            case EventCommand.MainScriptInstalled:
            case EventCommand.MainScriptUninstalled:

                chrome.runtime.sendMessage(message);
                
                break;
        }
    }
}