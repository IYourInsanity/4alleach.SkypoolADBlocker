import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import { EventCommandType } from "../../../../common/model/EventCommandType";
import ContentEventControllerService from "./ContentEventControllerService";
import IContentEventControllerService from "./abstraction/IContentEventControllerService";
import IContentMessageHandlerService from "./abstraction/IContentMessageHandlerService";
import KeyGenerator from "../../../../common/helper/KeyGenerator";

export default class ContentMessageHandlerService extends Service implements IContentMessageHandlerService
{
    public static readonly key: number = KeyGenerator.new();

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
        this.eventController.add(ContentMessageHandlerService.key, this.receive);
    }
    
    private receive(message: IEventMessage, sender: EventTarget | chrome.runtime.Port | null): void
    {
        switch(message.Event)
        {
            case EventCommandType.MainScriptInstalled:
            case EventCommandType.NodeIsBlocked:

                chrome.runtime.sendMessage(message);
                
                break;

            /*case 'test':

                console.log('ContentMessageHandlerService', message);

                (<chrome.runtime.Port>sender).postMessage(message);

                break;*/
        }
    }
}