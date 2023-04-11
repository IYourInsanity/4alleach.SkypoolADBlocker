import EventCallback from "../../../../common/custom/EventCallback";
import IService from "../../../../framework/service/abstraction/IService";

export default interface ITabStateService extends IService
{
    getActiveTabId(): number;

    installMainScript(tabId: number, frameId: number): void;

    installContentScript(tabId: number, frameId: number): void

    OnTabCreated: EventCallback<number>;

    OnTabSwitched: EventCallback<{TabId: number, PreviousTabId: number, IsValid: boolean }>;

    OnTabRemoved: EventCallback<number>;

    OnTabCommited: EventCallback<number>;
}