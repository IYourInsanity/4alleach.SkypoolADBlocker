import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import NodeHandlerService from "./NodeADAnalyzerService";
import INodeHandlerService from "./abstraction/INodeADAnalyzerService";

export default class MutationObserverService extends Service
{
    public static key: string = Guid.new();

    private observer: MutationObserver;
    private handlerService: INodeHandlerService;

    constructor(serviceHub: IServiceHub)
    {
        super(MutationObserverService.key, serviceHub);

        this.nodeMutation = this.nodeMutation.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.handlerService = this.serviceHub.get<INodeHandlerService>(NodeHandlerService);

        this.observer = new MutationObserver(this.nodeMutation);
        this.observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });

        this.handlerService.handle(document.documentElement);
    }

    private nodeMutation(records: MutationRecord[]): void
    {
        const length = records.length;
        for (let i = 0; i < length; i++) 
        {
            const record = records[i];
            
            this.handlerService.handle(record.target);
        }
    }
}