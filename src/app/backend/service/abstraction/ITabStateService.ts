import IService from "../../../../framework/service/abstraction/IService";

export default interface ITabStateService extends IService
{
    getActiveTabId(): number;
}