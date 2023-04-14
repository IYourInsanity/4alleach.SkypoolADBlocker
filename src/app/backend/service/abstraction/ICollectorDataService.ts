import IService from "../../../../framework/service/abstraction/IService";

export default interface ICollectorDataService extends IService
{
    set(tabId: number, data: any): void;

    get(tabId: number): any[];
}