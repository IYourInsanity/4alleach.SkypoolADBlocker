import Guid from "../../../common/model/Guid";
import { IEventMessage } from "../../../framework/abstraction/IEventMessage";
import { DocumentEventControllerService } from "./DocumentEventControllerService";

export abstract class BackendEventControllerService<TData extends IEventMessage, TSender> extends DocumentEventControllerService<TData, TSender>
{
    protected portKey: string;
    protected port: chrome.runtime.Port;

    constructor(key: number)
    {
        super(key);

        this.receiveBackendEvent = this.receiveBackendEvent.bind(this);

        this.portKey = Guid.new();
        this.port = chrome.runtime.connect({ name: this.portKey });
        this.port.onMessage.addListener(this.receiveBackendEvent);
    }

    protected receiveBackendEvent(message: TData, port: chrome.runtime.Port): void
    {
        if(message === undefined) return;

        this.receive(message, <TSender>port);
    }

    public override send(value: TData): void 
    {
        chrome.runtime.sendMessage(value);
    }
}