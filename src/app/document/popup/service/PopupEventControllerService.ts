import Guid from "../../../../common/model/Guid";
import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import EventCommand from "../../../../common/model/EventCommand";
import { DocumentEventControllerService } from "../../service/DocumentEventControllerService";

export default class PopupEventControllerService extends DocumentEventControllerService<IEventMessage, chrome.runtime.Port>
{
    public static key: string = Guid.new();

    constructor()
    {
        super(PopupEventControllerService.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;
        
        window.addEventListener(EventCommand.MessageToPopup, this.receiveCustomEvent);
    }

    protected override receive(message: IEventMessage, sender: chrome.runtime.Port): void 
    {
        GlobalLogger.log('receive on popup', message, sender);
    }
}