import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import { EventCommandType } from "../../../../common/model/EventCommandType";
import ContentEventControllerService from "./ContentEventControllerService";
import IContentEventControllerService from "./abstraction/IContentEventControllerService";
import IContentMessageHandlerService from "./abstraction/IContentMessageHandlerService";
import KeyGenerator from "../../../../common/helper/KeyGenerator";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";

export default class ContentMessageHandlerService extends Service implements IContentMessageHandlerService
{
    public static key: number = KeyGenerator.new();

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
    
    private receive(message: IEventMessage, sender: EventTarget | chrome.runtime.Port | null): void
    {
        switch(message.Event)
        {
            case EventCommandType.MainScriptInstalled:
            case EventCommandType.NodeIsBlocked:

                GlobalLogger.log('ContentMessageHandlerService', message);

                this.eventController.send(message);
                
                break;

            /*case 'test':

                console.log('ContentMessageHandlerService', message);

                (<chrome.runtime.Port>sender).postMessage(message);

                break;*/
        }
    }
}