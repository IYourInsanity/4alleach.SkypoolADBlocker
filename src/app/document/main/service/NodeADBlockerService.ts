import { EventCommandType } from "../../../../common/model/EventCommandType";
import { EventMessage } from "../../../../framework/abstraction/IEventMessage";
import UniqueIDGenerator from "../../../../framework/helper/UniqueIDGenerator";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import MainEventControllerService from "./MainEventControllerService";
import NodeStorageService from "./NodeStorageService";
import IMainEventControllerService from "./abstraction/IMainEventControllerService";
import INodeADBlockerService from "./abstraction/INodeADBlockerService";
import INodeStorageService from "./abstraction/INodeStorageService";

export default class NodeADBlockerService extends Service implements INodeADBlockerService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 1;

    private storageService: INodeStorageService;
    private eventService: IMainEventControllerService;

    constructor(serviceHub: IServiceHub)
    {
        super(NodeADBlockerService.key, serviceHub);

        this.onSaved = this.onSaved.bind(this);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;

        this.eventService = await this.serviceHub.getAsync(MainEventControllerService);
        this.storageService = await this.serviceHub.getAsync(NodeStorageService);
        this.storageService.onSaved.addListener(this.onSaved);

        this.isWork = true;
    }

    public async reset(): Promise<void>
    {
        this.storageService?.onSaved?.removeListener(this.onSaved);

        this.isWork = false;
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

        GlobalLogger.debug('[Blocked]', node.Value);

        const message = EventMessage.new(EventCommandType.NodeIsBlocked, { Tag: node.Value.nodeName }, EventCommandType.MessageToBackend);

        this.eventService.send(message);
    }
}