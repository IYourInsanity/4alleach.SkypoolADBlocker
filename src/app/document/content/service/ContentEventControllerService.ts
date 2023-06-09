import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import { EventCommandType } from "../../../../common/model/EventCommandType";
import ContentMessageHandlerService from "./ContentMessageHandlerService";
import IContentEventControllerService from "./abstraction/IContentEventControllerService";
import { BackendEventControllerService } from "../../service/BackendEventControllerService";
import UniqueIDGenerator from "../../../../framework/helper/UniqueIDGenerator";

export default class ContentEventControllerService extends BackendEventControllerService<IEventMessage, EventTarget | chrome.runtime.Port | null> implements IContentEventControllerService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 0;
    
    constructor()
    {
        super(ContentEventControllerService.key);

        this.receiveCustomEvent = this.receiveCustomEvent.bind(this);
    }

    public override async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;

        window.addEventListener(EventCommandType.MessageToContent, this.receiveCustomEvent);

        this.isWork = true;
    }

    public override async reset(): Promise<void> 
    {
        window.removeEventListener(EventCommandType.MessageToContent, this.receiveCustomEvent);

        this.isWork = false;
    }

    protected override receive(message: IEventMessage, sender: EventTarget | chrome.runtime.Port | null): void 
    {
        if(message === undefined) return;
        
        this.listeners[ContentMessageHandlerService.key]?.forEach(listener => 
        {
            try
            {
                listener(message, sender);
            }
            catch (exception)
            {
                GlobalLogger.error(`Error while receive event from ${ContentMessageHandlerService.key}`, exception);
            }
        });
    }
}