import KeyGenerator from "../../../common/helper/KeyGenerator";
import { EventCommandType } from "../../../common/model/EventCommandType";
import { IEventMessage } from "../../../framework/abstraction/IEventMessage";
import GlobalLogger from "../../../framework/logger/GlobalLogger";
import Service from "../../../framework/service/Service";
import IServiceHub from "../../../framework/service/abstraction/IServiceHub";
import BackendEventControllerService from "./BackendEventControllerService";
import IBackendEventControllerService from "./abstraction/IBackendEventControllerService";
import IPopupMessageHandlerService from "./abstraction/IPopupMessageHandlerService";

export default class PopupMessageHandlerService extends Service implements IPopupMessageHandlerService
{
    public static key: number = KeyGenerator.new();

    private extensionKey: number;
    private eventControllerService: IBackendEventControllerService;

    constructor(serviceHub: IServiceHub)
    {
        super(PopupMessageHandlerService.key, serviceHub);

        this.receive = this.receive.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;

        this.eventControllerService = this.serviceHub.get(BackendEventControllerService);
        this.extensionKey = this.eventControllerService.extensionKey;
        this.eventControllerService.add(this.extensionKey, this.receive);
        
        this.isWork = true;
    }

    public receive(message: IEventMessage, sender: chrome.runtime.MessageSender): void
    {
        if(message.Direct !== EventCommandType.MessageToPopup)
        {
            return;
        }

        GlobalLogger.log('PopupMessageHandlerService', message, sender);

        switch(message.Event)
        {
            case EventCommandType.NodeIsBlocked:

                
                
                break;

            case EventCommandType.GetTabInformationForPopup:

                this.eventControllerService.sendToExtension(message);

                break;
        }
    }
}