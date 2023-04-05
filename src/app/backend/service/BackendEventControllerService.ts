import Guid from "../../../common/model/Guid";
import GlobalLogger from "../../../framework/logger/GlobalLogger";
import { EventController } from "../../../framework/service/EventController";
import CECommand from "../../document/model/CECommand";
import IBackendEventControllerService from "./abstraction/IBackendEventControllerService";

export default class BackendEventControllerService 
extends EventController<{Type: string, Data: any}, chrome.runtime.MessageSender> 
implements IBackendEventControllerService
{
    public static key: string = Guid.new();

    constructor()
    {
        super(BackendEventControllerService.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;

        this.isWork = true;

        chrome.runtime.onMessage.addListener(this.receive);
    }
    
    public override receive(value: { Type: string; Data: any; }, sender: chrome.runtime.MessageSender): void 
    {
        if(value === undefined || value.Type === CECommand.MessageToBackend) return;

        const key = sender.tab!.id!;
        const message = value.Data;

        GlobalLogger.debug('Receive', message);

        this.listeners[key]?.forEach(listener => 
        {
            try
            { 
                listener(message, sender);
            }
            catch (exception)
            {
                GlobalLogger.error(`Error while receive event from ${key}`, exception);
            }
        });
    }
}