import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import CEDocument from "../../global/CEDocument";
import CECommand from "../../model/CECommand";
import MainEventController from "./MainEventController";

export default class CEDocumentControllerService extends Service
{
    public static readonly key: string = Guid.new();

    private CEDocument: CEDocument;
    private controller: MainEventController;

    constructor(serviceHub: IServiceHub)
    {
        super(CEDocumentControllerService.key, serviceHub);

        this.setupFramId = this.setupFramId.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.CEDocument = document as CEDocument;
        this.CEDocument.API = 
        {
            setupFrameId: this.setupFramId
        };

        this.controller = this.serviceHub?.get<MainEventController>(MainEventController)!;
    }

    private setupFramId(frameId: number): void
    {
        this.CEDocument.FrameId = frameId;
        this.controller.send({ Type: CECommand.MainScriptInstalled, Data: { FrameId: frameId } });
    }

}