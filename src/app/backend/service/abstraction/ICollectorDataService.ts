import { BlockedNode } from "../../../../common/model/BlockedNode";
import IService from "../../../../framework/service/abstraction/IService";

export default interface ICollectorDataService extends IService
{
    set(tabId: number, data: BlockedNode): void;

    get(tabId: number): BlockedNode[];

    clear(tabId: number): void;
}