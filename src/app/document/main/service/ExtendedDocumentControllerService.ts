import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import ExtendedDocument from "../../global/ExtendedDocument";
import EventGenerator from "../../../../common/helper/EventGenerator";
import { EventCommandType } from "../../../../common/model/EventCommandType";
import MainEventControllerService from "./MainEventControllerService";
import IExtendedDocumentControllerService from "./abstraction/IExtendedDocumentControllerService";
import IMainEventControllerService from "./abstraction/IMainEventControllerService";
import WaitHelper from "../../../../common/helper/WaitHelper";
import UniqueIDGenerator from "../../../../framework/helper/UniqueIDGenerator";

export default class ExtendedDocumentControllerService extends Service implements IExtendedDocumentControllerService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 0;

    private extendedDocument: ExtendedDocument;

    constructor(serviceHub: IServiceHub)
    {
        super(ExtendedDocumentControllerService.key, serviceHub);

        this.installFrame = this.installFrame.bind(this);

        this.getFrameIdAsync = this.getFrameIdAsync.bind(this);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.extendedDocument = document as ExtendedDocument;
        this.extendedDocument.API = 
        {
            installFrame: this.installFrame,
            getFrameIdAsync: this.getFrameIdAsync
        };
    }

    private async installFrame(frameId: number): Promise<void>
    {
        this.extendedDocument.FrameId = frameId;
        
        const message = EventGenerator.generateEventMessage(EventCommandType.MainScriptInstalled, { });
        const service = await this.serviceHub.getAsync<IMainEventControllerService>(MainEventControllerService);

        service.send(message);
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