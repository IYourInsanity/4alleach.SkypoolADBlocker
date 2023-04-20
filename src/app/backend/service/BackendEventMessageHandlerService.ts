import { EventCommandType } from "../../../common/model/EventCommandType";
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

                this.collectorDataService.set(tabId, message.Data);

                const request = EventMessage.create(message.MessageId, EventCommandType.GetTabInformationForPopup, [message.Data], EventCommandType.MessageToPopup);

                this.eventController.sendToExtension(request);
            
                break;

            case EventCommandType.GetTabInformationForPopup:

                const activeTabId = this.tabService.getActiveTabId();
                const data = this.collectorDataService.get(activeTabId);
                const response = EventMessage.create(message.MessageId, message.Event, data, EventCommandType.MessageToPopup);

                this.eventController.sendToExtension(response);

                break;
        }
    }

    private onTabCreated(tabId: number): void
    {
        this.eventController.add(tabId, this.receive);
    }

    private onTabCommited(tabId: number): void
    {
        this.eventController.add(tabId, this.receive);
    }

    private onTabRemoved(tabId: number): void
    {
        this.eventController.remove(tabId, this.receive);
    }
}