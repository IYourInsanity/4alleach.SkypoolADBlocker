import EventCallback from "../../../../../common/custom/EventCallback";
import IService from "../../../../../framework/service/abstraction/IService";
import { StorageNode } from "../../model/StorageNode";

export default interface INodeStorageService extends IService
{
    save(node: Node): void;

    get(ket: string): StorageNode;

    onSaved: EventCallback<string>
}