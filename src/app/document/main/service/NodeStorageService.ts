import EventCallback from "../../../../common/custom/EventCallback";
import KeyGenerator from "../../../../common/helper/KeyGenerator";
import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import { StorageNode } from "../model/StorageNode";
import INodeStorageService from "./abstraction/INodeStorageService";

export default class NodeStorageService extends Service implements INodeStorageService
{
    public static key: number = KeyGenerator.new();

    private stash: { [key: string]: StorageNode };

    public onSaved: EventCallback<string>;

    constructor()
    {
        super(NodeStorageService.key);

        this.save = this.save.bind(this);
        this.get = this.get.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.stash = {};
        this.onSaved = new EventCallback<string>();
    }

    public save(node: Node): void
    {
        const key = Guid.new();
        const storageNode: StorageNode = {
            Id: key,
            Value: node,
            Parent: node.parentNode!,
            IsBlocked: false
        };

        this.stash[key] = storageNode;
        this.onSaved.raise(key);
    }

    public get(key: string): StorageNode
    {
        return this.stash[key];
    }
}