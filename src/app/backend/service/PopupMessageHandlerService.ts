import KeyGenerator from "../../../common/helper/KeyGenerator";
import { EventCommandType } from "../../../common/model/EventCommandType";
import { IEventMessage } from "../../../framework/abstraction/IEventMessage";
import Service from "../../../framework/service/Service";
import IServiceHub from "../../../framework/service/abstraction/IServiceHub";
import IPopupMessageHandlerService from "./abstraction/IPopupMessageHandlerService";

export default class PopupMessageHandlerService extends Service implements IPopupMessageHandlerService
{
    public static key: number = KeyGenerator.new();

    constructor(serviceHub: IServiceHub)
    {
        super(PopupMessageHandlerService.key, serviceHub);

        this.receive = this.receive.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;


        
        this.isWork = true;
    }

    public receive(message: IEventMessage, sender: chrome.runtime.MessageSender): void
    {
        if(message.Direct !== EventCommandType.MessageFromPopup)
        {
            return;
        }

        switch(message.Event)
        {
            case EventCommandType.NodeIsBlocked:

                
                
                break;
        }
    }
}