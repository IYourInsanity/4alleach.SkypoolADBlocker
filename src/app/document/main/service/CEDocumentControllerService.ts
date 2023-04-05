import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import CEDocument from "../../global/CEDocument";
import CECommand from "../../model/CECommand";
import IDocumentEventControllerService from "../../service/abstraction/IDocumentEventControllerService";
import MainEventControllerService from "./MainEventControllerService";
import ICEDocumentControllerService from "./abstraction/ICEDocumentControllerService";

export default class CEDocumentControllerService extends Service implements ICEDocumentControllerService
{
    public static readonly key: string = Guid.new();

    private CEDocument: CEDocument;
    private eventService: IDocumentEventControllerService;

    constructor(serviceHub: IServiceHub)
    {
        super(CEDocumentControllerService.key, serviceHub);

        this.installFrame = this.installFrame.bind(this);
        this.uninstallFrame = this.uninstallFrame.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.CEDocument = document as CEDocument;
        this.CEDocument.API = 
        {
            installFrame: this.installFrame,
            uninstallFrame: this.uninstallFrame
        };

        this.eventService = this.serviceHub.get<IDocumentEventControllerService>(MainEventControllerService);
    }

    private installFrame(frameId: number): void
    {
        this.CEDocument.FrameId = frameId;
        this.eventService.send({ Type: CECommand.MainScriptInstalled, Data: { } });
    }

    private uninstallFrame(): void
    {
        this.eventService.send({ Type: CECommand.MainScriptUninstalled, Data: { } });
    }
}