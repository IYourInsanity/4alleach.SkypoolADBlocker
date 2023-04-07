import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import IWindowEventControllerService from "./abstraction/IWindowEventControllerService";
import ExtendedDocument from "../../global/ExtendedDocument";

export default class WindowEventControllerService extends Service implements IWindowEventControllerService
{
    public static readonly key: string = Guid.new();

    private extendedDocument: ExtendedDocument;

    constructor(serviceHub: IServiceHub)
    {
        super(WindowEventControllerService.key, serviceHub);

        this.befounload = this.befounload.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.extendedDocument = document as ExtendedDocument;

        //window.addEventListener('beforunload', this.befounload, true);
    }

    private befounload(event: Event): void
    {
        this.extendedDocument.API.uninstallFrame();
    }
}