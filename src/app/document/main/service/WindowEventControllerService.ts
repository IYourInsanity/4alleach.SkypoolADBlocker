import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import CEDocument from "../../global/CEDocument";
import IWindowEventControllerService from "./abstraction/IWindowEventControllerService";

export default class WindowEventControllerService extends Service implements IWindowEventControllerService
{
    public static readonly key: string = Guid.new();

    private CEDocument: CEDocument;

    constructor(serviceHub: IServiceHub)
    {
        super(WindowEventControllerService.key, serviceHub);

        this.befounload = this.befounload.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.CEDocument = document as CEDocument;

        //window.addEventListener('beforunload', this.befounload, true);
    }

    private befounload(event: Event): void
    {
        this.CEDocument.API.uninstallFrame();
    }
}