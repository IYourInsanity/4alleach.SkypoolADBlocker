import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import IWindowEventControllerService from "./abstraction/IWindowEventControllerService";
import ExtendedDocument from "../../global/ExtendedDocument";
import UniqueIDGenerator from "../../../../framework/helper/UniqueIDGenerator";

export default class WindowEventControllerService extends Service implements IWindowEventControllerService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 0;

    private extendedDocument: ExtendedDocument;

    constructor(serviceHub: IServiceHub)
    {
        super(WindowEventControllerService.key, serviceHub);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;
        
        this.extendedDocument = document as ExtendedDocument;

        this.isWork = true;
    }

    public async reset(): Promise<void>
    {
        this.isWork = false;
    }
}