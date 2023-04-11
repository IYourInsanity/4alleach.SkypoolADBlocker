import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import IWindowEventControllerService from "./abstraction/IWindowEventControllerService";
import ExtendedDocument from "../../global/ExtendedDocument";
import KeyGenerator from "../../../../common/helper/KeyGenerator";

export default class WindowEventControllerService extends Service implements IWindowEventControllerService
{
    public static readonly key: number = KeyGenerator.new();

    private extendedDocument: ExtendedDocument;

    constructor(serviceHub: IServiceHub)
    {
        super(WindowEventControllerService.key, serviceHub);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.extendedDocument = document as ExtendedDocument;
    }
}