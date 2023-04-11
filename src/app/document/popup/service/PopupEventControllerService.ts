import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import { EventCommandType } from "../../../../common/model/EventCommandType";
import { BackendEventControllerService } from "../../service/BackendEventControllerService";
import KeyGenerator from "../../../../common/helper/KeyGenerator";
import Guid from "../../../../common/model/Guid";

export default class PopupEventControllerService extends BackendEventControllerService<IEventMessage, chrome.runtime.Port>
{
    public static key: number = KeyGenerator.new();

    constructor()
    {
        super(PopupEventControllerService.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;

        window.addEventListener(EventCommandType.MessageToPopup, this.receiveCustomEvent);

        const message: IEventMessage = { MessageId: Guid.new(), Direct: EventCommandType.MessageToPopup, Event: EventCommandType.GetTabInformationForPopup, Data: {} };
        chrome.runtime.sendMessage(message);

        this.isWork = true;
    }

    protected override receive(message: IEventMessage, sender: chrome.runtime.Port): void 
    {
        if(message.Direct !== EventCommandType.MessageToPopup)
        {
            return;
        }
        
        GlobalLogger.log('receive on popup', message, sender);
    }
}