import Guid from "../../../../common/model/Guid";
import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import { EventCommandType } from "../../../../common/model/EventCommandType";
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
        
        window.addEventListener(EventCommandType.MessageToPopup, this.receiveCustomEvent);
    }

    protected override receive(message: IEventMessage, sender: chrome.runtime.Port): void 
    {
        GlobalLogger.log('receive on popup', message, sender);
    }
}