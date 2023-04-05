import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import CEDocument from "../../global/CEDocument";
import CECommand from "../../model/CECommand";
import MainEventController from "./MainEventController";

export default class WindowEventControllerService extends Service
{
    public static readonly key: string = Guid.new();

    private CEDocument: CEDocument;
    private controller: MainEventController;

    constructor(serviceHub: IServiceHub)
    {
        super(WindowEventControllerService.key, serviceHub);

        this.unload = this.unload.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.CEDocument = document as CEDocument;
        this.controller = this.serviceHub?.get<MainEventController>(MainEventController)!;

        window.addEventListener('unload', this.unload, { once: true });
    }

    private unload(event: Event): void
    {
        this.controller.send({ Type: CECommand.MainScriptInstalled, Data: { } });
    }
}