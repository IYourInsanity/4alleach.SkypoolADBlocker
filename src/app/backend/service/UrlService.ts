import Guid from "../../../common/model/Guid";
import Service from "../../../framework/service/Service";
import IUrlService from "./abstraction/IUrlService";

export default class UrlService extends Service implements IUrlService
{
    public static key: string = Guid.new();

    private readonly exceptUrls: string[];

    constructor()
    {
        super(UrlService.key);

        this.exceptUrls = [];

        this.initialize = this.initialize.bind(this);
        this.validate = this.validate.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;

        this.isWork = true;

        this.exceptUrls.push(...['chrome://', 'chrome-://', 'edge://', 'edge-://', 'data:', 'devtools://', 'about:blank', 'chrome-extension://', 'chrome-untrusted://']);
    }

    public validate(value: string): boolean
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

}