import { EventCommandType } from "../../../common/model/EventCommandType";
import { PopupData } from "../../../common/model/PopupData";
import { EventMessage, IEventMessage } from "../../../framework/abstraction/IEventMessage";
import UniqueIDGenerator from "../../../framework/helper/UniqueIDGenerator";
import Service from "../../../framework/service/Service";
import IServiceHub from "../../../framework/service/abstraction/IServiceHub";
import BackendEventControllerService from "./BackendEventControllerService";
import CollectorDataService from "./CollectorDataService";
import TabStateService from "./TabStateService";
import IBackendEventControllerService from "./abstraction/IBackendEventControllerService";
import IBackendEventMessageHandlerService from "./abstraction/IBackendEventMessageHandlerService";
import ICollectorDataService from "./abstraction/ICollectorDataService";
import ITabStateService from "./abstraction/ITabStateService";

export default class BackendEventMessageHandlerService extends Service implements IBackendEventMessageHandlerService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 2;
    
    private tabService: ITabStateService;
    private eventController: IBackendEventControllerService;
    private collectorDataService: ICollectorDataService;

    constructor(serviceHub: IServiceHub)
    {
        super(BackendEventMessageHandlerService.key, serviceHub);

        this.receive = this.receive.bind(this);

        this.onTabCreated = this.onTabCreated.bind(this);
        this.onTabRemoved = this.onTabRemoved.bind(this);
        this.onTabCommited = this.onTabCommited.bind(this);

        this.sendUpdatesToPopup = this.sendUpdatesToPopup.bind(this);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;

        this.eventController = await this.serviceHub.getAsync(BackendEventControllerService);
        this.collectorDataService = await this.serviceHub.getAsync(CollectorDataService);
        this.tabService = await this.serviceHub.getAsync(TabStateService);

        this.tabService.OnTabCreated.addListener(this.onTabCreated);
        this.tabService.OnTabRemoved.addListener(this.onTabRemoved);
        this.tabService.OnTabCommited.addListener(this.onTabCommited);

        this.eventController.add(this.eventController.extensionKey, this.receive);

        this.isWork = true;
    }

    public async reset(): Promise<void>
    {
        this.tabService?.OnTabCreated?.removeListener(this.onTabCreated);
        this.tabService?.OnTabRemoved?.removeListener(this.onTabRemoved);
        this.tabService?.OnTabCommited?.removeListener(this.onTabCommited);

        if(this.eventController?.remove !== undefined)
        {
            this.eventController.remove(this.eventController.extensionKey, this.receive);
        }

        this.isWork = false;
    }

    private receive(message: IEventMessage, sender: chrome.runtime.MessageSender): void
    {
        if(message.Direct !== EventCommandType.MessageToBackend)
        {
            return;
        }

        switch(message.Event)
        {
            case EventCommandType.MainScriptInstalled:

                this.tabService.installMainScript(sender.tab!.id!, sender.frameId!);

                break;

            case EventCommandType.ContentScriptInstalled:

                this.tabService.installContentScript(sender.tab!.id!, sender.frameId!);

                break;

            case EventCommandType.NodeIsBlocked:
   
                const tabId = sender.tab!.id!;

                this.nodeIsBlocked(tabId, message);
            
                break;

            case EventCommandType.GetTabInformationForPopup:

                this.sendUpdatesToPopup();

                break;
        }
    }

    private nodeIsBlocked(tabId: number, message: IEventMessage): void
    {
        this.collectorDataService.set(tabId, message.Data);
        this.sendUpdatesToPopup();
    }

    private sendUpdatesToPopup(): void
    {
        const info = this.tabService.getActiveTabInfo();

        if(info === undefined)
        {
            return;
        }

        const data: PopupData = {
            BlockedNodes: this.collectorDataService.get(info.TabId),
            ActiveTabUrl: info.Url
        }
        
        const request = EventMessage.new(EventCommandType.GetTabInformationForPopup, data, EventCommandType.MessageToPopup);

        this.eventController.sendToExtension(request);
    }

    private onTabCreated(tabId: number): void
    {
        this.eventController.add(tabId, this.receive);
    }

    private onTabCommited(tabId: number): void
    {
        this.eventController.add(tabId, this.receive);
        this.collectorDataService.clear(tabId);
    }

    private onTabRemoved(tabId: number): void
    {
        this.eventController.remove(tabId, this.receive);
    }
}