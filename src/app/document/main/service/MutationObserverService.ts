import UniqueIDGenerator from "../../../../framework/helper/UniqueIDGenerator";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import NodeADAnalyzerService from "./NodeADAnalyzerService";
import INodeADAnalyzerService from "./abstraction/INodeADAnalyzerService";

export default class MutationObserverService extends Service
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 2;

    private observer: MutationObserver;
    private analyzeService: INodeADAnalyzerService;

    constructor(serviceHub: IServiceHub)
    {
        super(MutationObserverService.key, serviceHub);

        this.nodeMutation = this.nodeMutation.bind(this);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;
        
        this.analyzeService = await this.serviceHub.getAsync(NodeADAnalyzerService);

        this.observer = new MutationObserver(this.nodeMutation);
        this.observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });

        this.isWork = true;
    }

    public async reset(): Promise<void>
    {
        this.observer?.disconnect();

        this.isWork = false;
    }

    private nodeMutation(records: MutationRecord[]): void
    {
        const length = records.length;
        for (let i = 0; i < length; i++) 
        {
            const record = records[i];
            
            this.analyzeService.handle(record.target);
        }
    }
}