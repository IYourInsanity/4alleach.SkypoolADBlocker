import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import ExtendedDocument from "../../global/ExtendedDocument";
import EventGenerator from "../../../../common/helper/EventGenerator";
import EventCommand from "../../../../common/model/EventCommand";
import MainEventControllerService from "./MainEventControllerService";
import IExtendedDocumentControllerService from "./abstraction/IExtendedDocumentControllerService";
import IMainEventControllerService from "./abstraction/IMainEventControllerService";

export default class ExtendedDocumentControllerService extends Service implements IExtendedDocumentControllerService
{
    public static readonly key: string = Guid.new();

    private extendedDocument: ExtendedDocument;
    private eventService: IMainEventControllerService;

    constructor(serviceHub: IServiceHub)
    {
        super(ExtendedDocumentControllerService.key, serviceHub);

        this.installFrame = this.installFrame.bind(this);
        this.uninstallFrame = this.uninstallFrame.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.extendedDocument = document as ExtendedDocument;
        this.extendedDocument.API = 
        {
            installFrame: this.installFrame,
            uninstallFrame: this.uninstallFrame
        };

        this.eventService = this.serviceHub.get<IMainEventControllerService>(MainEventControllerService);
    }

    private installFrame(frameId: number): void
    {
        this.extendedDocument.FrameId = frameId;
        const message = EventGenerator.generateEventMessage(EventCommand.MainScriptInstalled, { });
        this.eventService.send(message);
    }

    private uninstallFrame(): void
    {
        const message = EventGenerator.generateEventMessage(EventCommand.MainScriptUninstalled, { });
        this.eventService.send(message);
    }
    
}