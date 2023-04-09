import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import ExtendedDocument from "../../global/ExtendedDocument";
import EventGenerator from "../../../../common/helper/EventGenerator";
import { EventCommandType } from "../../../../common/model/EventCommandType";
import MainEventControllerService from "./MainEventControllerService";
import IExtendedDocumentControllerService from "./abstraction/IExtendedDocumentControllerService";
import IMainEventControllerService from "./abstraction/IMainEventControllerService";
import WaitHelper from "../../../../common/helper/WaitHelper";

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

        this.getFrameIdAsync = this.getFrameIdAsync.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.extendedDocument = document as ExtendedDocument;
        this.extendedDocument.API = 
        {
            installFrame: this.installFrame,
            uninstallFrame: this.uninstallFrame,
            getFrameIdAsync: this.getFrameIdAsync
        };

        this.eventService = this.serviceHub.get<IMainEventControllerService>(MainEventControllerService);
    }

    private installFrame(frameId: number): void
    {
        this.extendedDocument.FrameId = frameId;
        const message = EventGenerator.generateEventMessage(EventCommandType.MainScriptInstalled, { });
        this.eventService.send(message);
    }

    private uninstallFrame(): void
    {
        const message = EventGenerator.generateEventMessage(EventCommandType.MainScriptUninstalled, { });
        this.eventService.send(message);
    }

    private async getFrameIdAsync(): Promise<number>
    {
        const $this = this;
        return new Promise(async resolve => 
        {
            const frameId = $this.extendedDocument.FrameId;

            if(frameId !== undefined)
            {
                resolve(frameId);
                return;
            }

            while($this.extendedDocument.FrameId === undefined)
            { 
                await WaitHelper.wait(100);
            }

            resolve($this.extendedDocument.FrameId);
        });
    }
    
}