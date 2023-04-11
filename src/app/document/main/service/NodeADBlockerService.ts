import EventGenerator from "../../../../common/helper/EventGenerator";
import KeyGenerator from "../../../../common/helper/KeyGenerator";
import { EventCommandType } from "../../../../common/model/EventCommandType";
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
    public static key: number = KeyGenerator.new();

    private storageService: INodeStorageService;
    private eventService: IMainEventControllerService;

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

        this.eventService = this.serviceHub.get<IMainEventControllerService>(MainEventControllerService);
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

        const command = EventGenerator.generateEventMessage(EventCommandType.NodeIsBlocked, { Tag: node.Value.nodeName });
        this.eventService.send(command);
    }
}