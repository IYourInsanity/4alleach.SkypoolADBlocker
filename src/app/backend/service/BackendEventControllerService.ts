import WaitHelper from "../../../common/helper/WaitHelper";
import { EventCommandType } from "../../../common/model/EventCommandType";
import { ICancellationToken } from "../../../framework/abstraction/ICancellationToken";
import { IEventMessage, EventMessage } from "../../../framework/abstraction/IEventMessage";
import UniqueIDGenerator from "../../../framework/helper/UniqueIDGenerator";
import GlobalLogger from "../../../framework/logger/GlobalLogger";
import { EventController } from "../../../framework/service/EventController";
import { PortInfo } from "../model/connection/portInfo";
import IBackendEventControllerService from "./abstraction/IBackendEventControllerService";

export default class BackendEventControllerService extends EventController<IEventMessage, chrome.runtime.MessageSender> implements IBackendEventControllerService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 0;
    
    private readonly responseTimeout: number;

    private readonly portHub: { [key: number]: {[key: number]: PortInfo} };

    public extensionKey: number;

    constructor()
    {
        super(BackendEventControllerService.key);

        this.portHub = {};
        this.responseTimeout = 10000; // 10sec

        this.sendOneWay = this.sendOneWay.bind(this);
        this.sendAsync = this.sendAsync.bind(this);
        this.waitPortInitialization = this.waitPortInitialization.bind(this);
        
        this.onConnect = this.onConnect.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.onRemoved = this.onRemoved.bind(this);

        this.getKey = this.getKey.bind(this);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;

        chrome.runtime.onConnect.addListener(this.onConnect);
        chrome.runtime.onMessage.addListener(this.receive);
        chrome.tabs.onRemoved.addListener(this.onRemoved);

        this.extensionKey = UniqueIDGenerator.get(chrome.runtime.id);

        this.isWork = true;
    }
    
    protected override receive(message: IEventMessage, sender: chrome.runtime.MessageSender): void 
    {
        if(message === undefined) return;

        const key = this.getKey(sender);

        GlobalLogger.debug('Receive', message, this.listeners);

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

    public sendToExtension(message: IEventMessage): void
    {
        const portInfos = this.portHub[this.extensionKey];

        if(portInfos === undefined)
        {
            return;
        }

        const portInfo = portInfos[0];

        if(portInfo === undefined)
        {
            return;
        }
        
        portInfo.port.postMessage(message);
    }

    public sendOneWay(tabId: number, frameId: number, message: IEventMessage): void
    {
        this.portHub[tabId][frameId].port.postMessage(message);
    }

    public sendAsync(tabId: number, frameId: number, message: IEventMessage, token: ICancellationToken): Promise<IEventMessage>
    {
        const $this = this;

        return new Promise(async resolve => 
            {
                const result = await $this.waitPortInitialization(tabId, frameId, token);

                if(result === false)
                {
                    const cancelMessage = EventMessage.create(message.MessageId, EventCommandType.CancelByToken, { TabId: tabId, FrameId: frameId ?? 0 });
                    resolve(cancelMessage);
                }

                const timeoutId = setTimeout(() => 
                {
                    delete $this.portHub[tabId][frameId].response[message.MessageId];

                    const cancelMessage = EventMessage.create(message.MessageId, EventCommandType.CancelByTimeout, { TabId: tabId, FrameId: frameId ?? 0 });
                    resolve(cancelMessage);

                }, $this.responseTimeout);

                $this.portHub[tabId][frameId].response[message.MessageId] = { resolve: resolve, timeoutId: timeoutId };
                $this.portHub[tabId][frameId].port.postMessage(message);
            });
    }

    private getKey(sender: chrome.runtime.MessageSender): number
    {
        const key = sender?.tab?.id;

        if(key !== undefined)
        {
            return key;
        }
        else
        {
            return this.extensionKey;
        }
    }

    private onConnect(port: chrome.runtime.Port)
    {
        const sender = port.sender!;
        const tabId = this.getKey(sender);
        const frameId = sender.frameId ?? 0;

        let collection = this.portHub[tabId];

        if(collection === undefined)
        {
            this.portHub[tabId] = collection = {};
        }

        collection[frameId] = { port: port, response: { } };

        port.onMessage.addListener(this.onMessage);
        port.onDisconnect.addListener(this.onDisconnect);
    }

    private onDisconnect(port: chrome.runtime.Port): void
    {
        const sender = port.sender!;
        const tabId = this.getKey(sender);
        const frameId = sender.frameId ?? 0;

        let collection = this.portHub[tabId];

        if (collection === undefined)
        {
            return;
        }

        const portInfo = collection[frameId];

        if (portInfo === undefined)
        {
            return;
        }

        const keys = Object.keys(portInfo.response);
        const length = keys.length;

        for (let index = 0; index < length; index++) 
        {
            const key = keys[index];
            const responseInfo = portInfo.response[key];
            const timeoutId = responseInfo.timeoutId;
            const response = responseInfo.resolve;

            clearTimeout(timeoutId);

            const message = EventMessage.create(keys[index], EventCommandType.Disconnected, { TabId: tabId, FrameId: frameId ?? 0 });

            response(message);
        }

        port.onMessage.removeListener(this.onMessage);
        port.onDisconnect.removeListener(this.onDisconnect);

        delete collection[frameId];
    }

    private onMessage(message: IEventMessage, port: chrome.runtime.Port): void
    {
        const sender = port.sender!;
        const tabId = sender.tab!.id!;
        const frameId = sender.frameId!;

        const collection = this.portHub[tabId];

        if (collection === undefined)
        {
            return;
        }

        const portInfo = collection[frameId];

        if (portInfo === undefined)
        {
            return;
        }

        const responseInfo = portInfo.response[message.MessageId];

        if(responseInfo === undefined)
        {
            return;
        }

        clearTimeout(responseInfo.timeoutId);
        responseInfo.resolve(message);

        delete portInfo.response[message.MessageId];
    }

    private onRemoved(tabId: number, info: chrome.tabs.TabRemoveInfo): void
    {
        delete this.portHub[tabId];
    }
    
    private waitPortInitialization(tabId: number, frameId: number, token: ICancellationToken): Promise<boolean>
    {
        const $this = this;
        return new Promise(async resolve => 
        {
            let isInitialized = false;

            while(isInitialized === false && token.IsCanceled === false)
            {
                await WaitHelper.wait(100);

                const portInfo =  $this.portHub[tabId];

                if(portInfo === undefined)
                {
                    continue;
                }

                const frameInfo = portInfo[frameId];

                if(frameInfo === undefined)
                {
                    continue;
                }

                isInitialized = true;
            }

            resolve(isInitialized);
        });
    }
}