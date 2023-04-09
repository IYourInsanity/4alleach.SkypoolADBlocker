import Guid from "../../../../common/model/Guid";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import NodeStorageService from "./NodeStorageService";
import INodeADBlockerService from "./abstraction/INodeADBlockerService";
import INodeStorageService from "./abstraction/INodeStorageService";

export default class NodeADBlockerService extends Service implements INodeADBlockerService
{
    public static key: string = Guid.new();

    private storageService: INodeStorageService;

    constructor(serviceHub: IServiceHub)
    {
        super(NodeADBlockerService.key, serviceHub);

        this.onSaved = this.onSaved.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.storageService = this.serviceHub.get<INodeStorageService>(NodeStorageService);
        this.storageService.onSaved.addListener(this.onSaved);
    }

    private onSaved(key: string): void
    {
        const node = this.storageService.get(key);
        const parent = node.Value.parentNode;
        
        if(parent !== null)
        {
            parent.removeChild(node.Value);
            node.IsBlocked = true;
        }

        GlobalLogger.log('[Blocked]', node.Value);
    }
}