import Service from "../../../framework/service/Service";
import IServiceHub from "../../../framework/service/abstraction/IServiceHub";
import { FrameInfo, FrameState } from "../model/tab/FrameInfo";
import { TabInfo, TabState } from "../model/tab/TabInfo";
import MainScriptInstallService from "./MainScriptInstallService";
import UrlService from "./UrlService";
import IMainScriptInstallService from "./abstraction/IMainScriptInstallService";
import ITabStateService from "./abstraction/ITabStateService";
import IUrlService from "./abstraction/IUrlService";
import EventCallback from "../../../common/custom/EventCallback";
import UniqueIDGenerator from "../../../framework/helper/UniqueIDGenerator";
import { ActiveTabInfo } from "../model/tab/ActiveTabInfo";

export default class TabStateService extends Service implements ITabStateService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 1;

    private readonly tabs: { [key: number]: TabInfo };

    private urlService: IUrlService;
    private installService: IMainScriptInstallService;

    private activeTabInfo: ActiveTabInfo;

    public OnTabCreated: EventCallback<number>;

    public OnTabSwitched: EventCallback<{ TabId: number; PreviousTabId: number; IsValid: boolean; }>;

    public OnTabRemoved: EventCallback<number>;

    public OnTabCommited: EventCallback<number>;

    constructor(serviceHub: IServiceHub)
    {
        super(TabStateService.key, serviceHub);

        this.tabs = {};

        this.getActiveTabInfo = this.getActiveTabInfo.bind(this);

        this.onCreated = this.onCreated.bind(this);
        this.onUpdated = this.onUpdated.bind(this);
        this.onRemoved = this.onRemoved.bind(this);
        this.onSwitched = this.onSwitched.bind(this);

        this.onCommited = this.onCommited.bind(this);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;
 
        this.OnTabCreated = new EventCallback();
        this.OnTabSwitched = new EventCallback();
        this.OnTabRemoved = new EventCallback();
        this.OnTabCommited = new EventCallback();

        this.installService = await this.serviceHub.getAsync(MainScriptInstallService);
        this.urlService = await this.serviceHub.getAsync(UrlService);
        
        chrome.tabs.onActivated.addListener(this.onSwitched);
        chrome.tabs.onCreated.addListener(this.onCreated); 
        chrome.tabs.onUpdated.addListener(this.onUpdated);
        chrome.tabs.onRemoved.addListener(this.onRemoved);

        chrome.webNavigation.onCommitted.addListener(this.onCommited);

        this.isWork = true;
    }

    public getActiveTabInfo(): ActiveTabInfo 
    {
        return this.activeTabInfo;
    }

    public installContentScript(tabId: number, frameId: number): void
    {
        const frameInfo = this.tabs[tabId].Frames[frameId];

        frameInfo.ContentScriptInstalled = true;
        frameInfo.State = FrameState.Loaded;
    }

    public installMainScript(tabId: number, frameId: number): void 
    {
        const frameInfo = this.tabs[tabId].Frames[frameId];

        frameInfo.MainScriptInstalled = true;
        frameInfo.State = FrameState.Loaded;
    }

    //#region Chrome Events

    private onCreated(tab: chrome.tabs.Tab): void
    {
        const tabId = tab.id!;

        this.tabs[tabId] = TabStateService.createTabInfo();
        this.OnTabCreated.raise(tabId);
    }

    private onUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab)
    {
        if(this.tabs[tabId] === undefined)
        {
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

        const url = changeInfo.url;
        if(this.urlService.validate(url) === true)
        {
            this.activeTabInfo = {
                TabId: tabId,
                Url: this.urlService.getClear(url!)
            };
        }
    }

    private onRemoved(tabId: number, removeInfo: chrome.tabs.TabRemoveInfo): void
    {
        if(this.tabs[tabId] !== undefined)
        {
            delete this.tabs[tabId];
        }

        this.OnTabRemoved.raise(tabId);
    }

    private async onSwitched(info: chrome.tabs.TabActiveInfo): Promise<void>
    {
        const previousTabId = this.activeTabInfo?.TabId;
        const currentTabId = info.tabId;

        const tab = await chrome.tabs.get(currentTabId);
        const url = tab.url!;

        const isValid = this.urlService.validate(url);

        if(isValid === true)
        {
            this.activeTabInfo = {
                TabId: info.tabId,
                Url: this.urlService.getClear(url)
            };
        }

        this.OnTabSwitched.raise({ TabId: currentTabId, PreviousTabId: previousTabId, IsValid: isValid });
    }

    private async onCommited(details: chrome.webNavigation.WebNavigationFramedCallbackDetails, filters?: chrome.webNavigation.WebNavigationFramedCallbackDetails | undefined): Promise<void>
    {
        const tabId = details.tabId;
        const frameId = details.frameId;

        if(frameId !== 0)
        {
            return;
        }

        const url = details.url;

        if(this.urlService.validate(url) === false)
        {
            return;
        }

        if(this.tabs[tabId].Frames[frameId] !== undefined)
        {
            return;
        }

        this.tabs[tabId].Frames[frameId] = TabStateService.createFrameInfo();

        if(await this.installService.install(tabId, frameId) === false)
        {
            return;
        }

        this.OnTabCommited.raise(tabId);
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