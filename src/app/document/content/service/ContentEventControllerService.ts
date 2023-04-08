import Guid from "../../../../common/model/Guid";
import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import EventCommand from "../../../../common/model/EventCommand";
import ContentMessageHandlerService from "./ContentMessageHandlerService";
import { DocumentEventControllerService } from "../../service/DocumentEventControllerService"
import IContentEventControllerService from "./abstraction/IContentEventControllerService";

export default class ContentEventControllerService extends DocumentEventControllerService<IEventMessage, EventTarget | chrome.runtime.Port | null> implements IContentEventControllerService
{
    public static key: string = Guid.new();

    private port: chrome.runtime.Port;

    constructor()
    {
        super(ContentEventControllerService.key);

        this.receiveBackendEvent = this.receiveBackendEvent.bind(this);
        this.receiveCustomEvent = this.receiveCustomEvent.bind(this);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;

        this.isWork = true;

        this.port = chrome.runtime.connect({ name: ContentEventControllerService.key });
        this.port.onMessage.addListener(this.receiveBackendEvent);

        window.addEventListener(EventCommand.MessageToContent, this.receiveCustomEvent);
    }

    protected override receive(message: IEventMessage, sender: EventTarget | chrome.runtime.Port | null): void 
    {
        if(message === undefined) return;
        
        this.listeners[ContentMessageHandlerService.hash]?.forEach(listener => 
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

    private receiveBackendEvent(message: IEventMessage, port: chrome.runtime.Port): void
    {
        if(message === undefined) return;

        console.log('receiveBackendEvent', message);

        this.receive(message, port);
    }
}