import KeyGenerator from "../../../common/helper/KeyGenerator";
import Service from "../../../framework/service/Service";
import ICollectorDataService from "./abstraction/ICollectorDataService";

export default class CollectorDataService extends Service implements ICollectorDataService
{
    public static key: number = KeyGenerator.new();

    private stash:{[key: number]: any[]};

    constructor()
    {
        super(CollectorDataService.key);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;

        this.stash = {};

        this.isWork = true;
    }

    public set(tabId: number, data: any): void 
    {
        if(this.stash[tabId] === undefined)
        {
            this.stash[tabId] = [];
        }

        this.stash[tabId].push(data);
    }

    public get(tabId: number): any[] 
    {
        return this.stash[tabId];
    }
}