import Guid from "../../../../common/model/Guid";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import CECommand from "../../model/CECommand";
import DocumentEventControllerService from "../../service/DocumentEventControllerService";
import ContentMessageHandlerService from "./ContentMessageHandlerService";

export default class ContentEventControllerService extends DocumentEventControllerService
{
    public static key: string = Guid.new();

    private port: chrome.runtime.Port;

    constructor()
    {
        super(ContentEventControllerService.key);

        this.receiveBackendEvent = this.receiveBackendEvent.bind(this);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;

        this.isWork = true;

        this.port = chrome.runtime.connect({ name: Guid.new() });
        this.port.onMessage.addListener(this.receiveBackendEvent);

        window.addEventListener(CECommand.MessageToContent, this.receiveCustomEvent);
    }

    protected override receive(value: { Type: string; Data: any; }, sender: EventTarget | null): void 
    {
        if(value === undefined) return;
        
        this.listeners[ContentMessageHandlerService.hash]?.forEach(listener => 
        {
            try
            {
                listener(value, sender);
            }
            catch (exception)
            {
                GlobalLogger.error(`Error while receive event from ${ContentMessageHandlerService.key}`, exception);
            }
        });
    }

    private receiveBackendEvent(value: { MessageId: string, Type: string; Data: any; }): void
    {
        if(value === undefined) return;

        //TODO: Implement logic

        this.port.postMessage(value);
    }
}