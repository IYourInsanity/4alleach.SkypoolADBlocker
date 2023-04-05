import Guid from "../../../../common/model/Guid";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import CECommand from "../../model/CECommand";
import DocumentEventControllerService from "../../service/DocumentEventControllerService";
import ContentMessageHandlerService from "./ContentMessageHandlerService";

export default class ContentEventControllerService extends DocumentEventControllerService
{
    public static key: string = Guid.new();

    constructor()
    {
        super(ContentEventControllerService.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;

        this.isWork = true;

        window.addEventListener(CECommand.MessageToContent, this.receiveCustomEvent);
    }

    public override receive(value: { Type: string; Data: any; }, sender: EventTarget | null): void 
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
}