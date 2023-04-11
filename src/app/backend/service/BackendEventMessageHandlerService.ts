import KeyGenerator from "../../../common/helper/KeyGenerator";
import { EventCommandType } from "../../../common/model/EventCommandType";
import { IEventMessage } from "../../../framework/abstraction/IEventMessage";
import Service from "../../../framework/service/Service";
import IServiceHub from "../../../framework/service/abstraction/IServiceHub";
import BackendPopupEventControllerService from "./PopupMessageHandlerService";
import TabStateService from "./TabStateService";
import IBackendEventControllerService from "./abstraction/IBackendEventControllerService";
import IBackendEventMessageHandlerService from "./abstraction/IBackendEventMessageHandlerService";
import IBackendPopupEventControllerService from "./abstraction/IPopupMessageHandlerService";
import ITabStateService from "./abstraction/ITabStateService";

export default class BackendEventMessageHandlerService extends Service implements IBackendEventMessageHandlerService
{
    public static key: number = KeyGenerator.new();
    
    private tabService: ITabStateService;
    private popupService: IBackendPopupEventControllerService;
    private eventController: IBackendEventControllerService;

    constructor(serviceHub: IServiceHub)
    {
        super(BackendEventMessageHandlerService.key, serviceHub);

        this.receive = this.receive.bind(this);

        this.onTabCreated = this.onTabCreated.bind(this);
        this.onTabRemoved = this.onTabRemoved.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;

        this.eventController = this.serviceHub.get(BackendEventMessageHandlerService);
        this.tabService = this.serviceHub.get(TabStateService);
        this.popupService = this.serviceHub.get(BackendPopupEventControllerService);

        this.tabService.OnTabCreated.addListener(this.onTabCreated);
        this.tabService.OnTabRemoved.addListener(this.onTabRemoved);
        
        this.isWork = true;
    }

    private receive(message: IEventMessage, sender: chrome.runtime.MessageSender): void
    {
        const tabId = sender.tab!.id!;
        const frameId = sender.frameId!;

        switch(message.Event)
        {
            case EventCommandType.MainScriptInstalled:

                this.tabService.installMainScript(tabId, frameId);

                break;

            case EventCommandType.ContentScriptInstalled:

                console.log('ContentScriptInstalled', message);

                this.tabService.installContentScript(tabId, frameId);

                break;

            case EventCommandType.NodeIsBlocked: 

                this.popupService.receive(message, sender);

                break;
        }
    }

    private onTabCreated(tabId: number): void
    {
        this.eventController.add(tabId, this.receive);
    }

    private onTabRemoved(tabId: number): void
    {
        this.eventController.remove(tabId, this.receive);
    }
}