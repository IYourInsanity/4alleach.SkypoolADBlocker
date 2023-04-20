import EventCallback from "../../../../common/custom/EventCallback";
import IService from "../../../../framework/service/abstraction/IService";
import { ActiveTabInfo } from "../../model/tab/ActiveTabInfo";

export default interface ITabStateService extends IService
{
    getActiveTabInfo(): ActiveTabInfo;

    installMainScript(tabId: number, frameId: number): void;

    installContentScript(tabId: number, frameId: number): void

    OnTabCreated: EventCallback<number>;

    OnTabSwitched: EventCallback<{TabId: number, PreviousTabId: number, IsValid: boolean }>;

    OnTabRemoved: EventCallback<number>;

    OnTabCommited: EventCallback<number>;
}