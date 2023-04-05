import Guid from "../../../common/model/Guid";
import GlobalLogger from "../../../framework/logger/GlobalLogger";
import Service from "../../../framework/service/Service";
import IServiceHub from "../../../framework/service/abstraction/IServiceHub";
import CECommand from "../../document/model/CECommand";
import { FrameInfo, FrameState } from "../model/Tab/FrameInfo";
import { TabInfo, TabState } from "../model/Tab/TabInfo";
import BackendEventControllerService from "./BackendEventControllerService";
import MainScriptInstallService from "./MainScriptInstallService";
import UrlService from "./UrlService";

export default class TabStateService extends Service
{
    public static key: string = Guid.new();

    private readonly tabs: { [key: number]: TabInfo };

    private eventController: BackendEventControllerService;

    constructor(serviceHub: IServiceHub)
    {
        super(TabStateService.key, serviceHub);

        this.tabs = {};

        this.receive = this.receive.bind(this);

        this.onCreated = this.onCreated.bind(this);
        this.onUpdated = this.onUpdated.bind(this);
        this.onRemoved = this.onRemoved.bind(this);

        this.onCommited = this.onCommited.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;

        this.isWork = true;

        this.eventController = this.serviceHub?.get<BackendEventControllerService>(BackendEventControllerService)!;
        
        chrome.tabs.onCreated.addListener(this.onCreated);
        chrome.tabs.onUpdated.addListener(this.onUpdated);
        chrome.tabs.onRemoved.addListener(this.onRemoved);

        chrome.webNavigation.onCommitted.addListener(this.onCommited);
    }

    private receive(event: { Type: string, Data: any }, sender: chrome.runtime.MessageSender): void
    {
        const tabId = sender.tab!.id!;
        const frameId = sender.frameId!;

        switch(event.Type)
        {
            case CECommand.MainScriptInstalled:

                const frameInfo = this.tabs[tabId].Frames[frameId];

                frameInfo.MainScriptInstalled = true;
                frameInfo.State = FrameState.Loaded;

                GlobalLogger.log('CECommand.MainScriptInstalled', this.tabs, sender);

                break;
            case CECommand.MainScriptUninstalled:

                delete this.tabs[tabId].Frames[frameId];

                GlobalLogger.log('CECommand.MainScriptUninstalled', this.tabs, sender);

                break;
        }
    }

    //#region Chrome Events

    private onCreated(tab: chrome.tabs.Tab): void
    {
        const tabId = tab.id!;

        this.tabs[tabId] = TabStateService.createTabInfo();
        this.eventController.add(tabId, this.receive);
    }

    private onUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab)
    {
        if(this.tabs[tabId] === undefined)
        {
            this.eventController.add(tabId, this.receive);
            this.tabs[tabId] = TabStateService.createTabInfo();
        }

        if(changeInfo.status === 'loading')
        {
            if(this.tabs[tabId].State === TabState.Loaded)
            {
                this.tabs[tabId] = TabStateService.createTabInfo();
            }

            this.tabs[tabId].State = TabState.Loading;
        }

        if(changeInfo.status === 'complete')
        {
            this.tabs[tabId].State = TabState.Loaded;
        }
    }

    private onRemoved(tabId: number, removeInfo: chrome.tabs.TabRemoveInfo): void
    {
        if(this.tabs[tabId] !== undefined)
        {
            delete this.tabs[tabId];
            this.eventController.remove(tabId, this.receive);
        }
    }

    private async onCommited(details: chrome.webNavigation.WebNavigationFramedCallbackDetails, filters?: chrome.webNavigation.WebNavigationFramedCallbackDetails | undefined): Promise<void>
    {
        const urlService = this.serviceHub?.get<UrlService>(UrlService)!;
        const url = details.url;

        if(urlService.validate(url) === false)
        {
            return;
        }

        const tabId = details.tabId;
        const frameId = details.frameId;

        if(this.tabs[tabId].Frames[frameId] !== undefined)
        {
            return;
        }

        this.tabs[tabId].Frames[frameId] = TabStateService.createFrameInfo();

        const installerService = this.serviceHub?.get<MainScriptInstallService>(MainScriptInstallService)!;

        if(await installerService.install(tabId, frameId) === false)
        {
            return;
        }
    }

    //#endregion

    private static createTabInfo(): TabInfo
    {
        return {
            State: TabState.Created,
            Frames: {}
        };
    }

    private static createFrameInfo(): FrameInfo
    {
        return {
            State: FrameState.Commited,
            MainScriptInstalled: false
        };
    }
}