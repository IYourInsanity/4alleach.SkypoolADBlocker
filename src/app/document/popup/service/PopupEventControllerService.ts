import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import { EventCommandType } from "../../../../common/model/EventCommandType";
import { BackendEventControllerService } from "../../service/BackendEventControllerService";
import KeyGenerator from "../../../../common/helper/KeyGenerator";
import IPopupEventControllerService from "../abstraction/IPopupEventControllerService";
import PopupMessageHandlerService from "./PopupMessageHandlerService";

export default class PopupEventControllerService extends BackendEventControllerService<IEventMessage, chrome.runtime.Port> implements IPopupEventControllerService
{
    public static key: number = KeyGenerator.new();

    constructor()
    {
        super(PopupEventControllerService.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;

        this.isWork = true;
    }

    protected override receive(message: IEventMessage, sender: chrome.runtime.Port): void 
    {
        if(message.Direct !== EventCommandType.MessageToPopup)
        {
            return;
        }
        
        this.listeners[PopupMessageHandlerService.key]?.forEach(listener => 
        {
            try
            {
                listener(message, sender);
            }
            catch (exception)
            {
                GlobalLogger.error(`Error while receive event from ${PopupMessageHandlerService.key}`, exception);
            }
        });
    }
}