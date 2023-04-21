import EventCallback from "../../../../common/custom/EventCallback";
import Guid from "../../../../common/model/Guid";
import UniqueIDGenerator from "../../../../framework/helper/UniqueIDGenerator";
import Service from "../../../../framework/service/Service";
import { StorageNode } from "../model/StorageNode";
import INodeStorageService from "./abstraction/INodeStorageService";

export default class NodeStorageService extends Service implements INodeStorageService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 0;

    private stash: { [key: string]: StorageNode };

    public onSaved: EventCallback<string>;

    constructor()
    {
        super(NodeStorageService.key);

        this.save = this.save.bind(this);
        this.get = this.get.bind(this);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;

        this.stash = {};
        this.onSaved = new EventCallback<string>();

        this.isWork = true;
    }

    public async reset(): Promise<void>
    {
        this.isWork = false;
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