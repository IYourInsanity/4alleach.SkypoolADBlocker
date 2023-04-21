import UniqueIDGenerator from "../../../framework/helper/UniqueIDGenerator";
import Service from "../../../framework/service/Service";
import IUrlService from "./abstraction/IUrlService";

export default class UrlService extends Service implements IUrlService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 0;

    private exceptUrls: string[];

    constructor()
    {
        super(UrlService.key);

        this.validate = this.validate.bind(this);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;

        this.exceptUrls = ['chrome://', 'chrome-://', 'edge://', 'edge-://', 'data:', 'devtools://', 'about:blank', 'chrome-extension://', 'chrome-untrusted://'];

        this.isWork = true;
    }

    public async reset(): Promise<void>
    {
        this.isWork = false;
    }

    public validate(value: string | undefined): boolean
    {
        if(typeof value !== 'string')
        {
            return false;
        }

        if(this.exceptUrls.some(u => value.startsWith(u)) === true)
        {
            return false;
        }

        return true;
    }

    public getClear(value: string): string 
    {
        if(value === '') return value;

        return new URL(value).host;
    }

}