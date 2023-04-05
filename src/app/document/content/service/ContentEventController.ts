import Guid from "../../../../common/model/Guid";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import CECommand from "../../model/CECommand";
import DocumentEventController from "../../service/DocumentEventController";
import ContentMessageHandlerService from "./ContentMessageHandlerService";

export default class ContentEventController extends DocumentEventController
{
    public static key: string = Guid.new();

    constructor()
    {
        super(ContentEventController.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;

        this.isWork = true;

        window.addEventListener(CECommand.MessageToContent, this.receiveInternal);
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