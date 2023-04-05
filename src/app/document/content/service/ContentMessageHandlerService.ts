import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import CECommandGenerator from "../../helper/CECommandGenerator";
import CECommand from "../../model/CECommand";
import ContentEventControllerService from "./ContentEventControllerService";
import IDocumentEventControllerService from "../../service/abstraction/IDocumentEventControllerService";
import IContentMessageHandlerService from "./abstraction/IContentMessageHandlerService";

export default class ContentMessageHandlerService extends Service implements IContentMessageHandlerService
{
    public static readonly key: string = Guid.new();
    public static readonly hash: number = ContentMessageHandlerService.GetHashCode(ContentMessageHandlerService.key);

    private eventController: IDocumentEventControllerService;

    constructor(serviceHub: IServiceHub)
    {
        super(ContentMessageHandlerService.key, serviceHub);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        this.eventController = this.serviceHub.get<IDocumentEventControllerService>(ContentEventControllerService);
        this.eventController.add(ContentMessageHandlerService.hash, this.receive);
    }
    
    private receive(value: { Type: string; Data: any; }, sender: EventTarget | null): void
    {
        switch(value.Type)
        {
            case CECommand.MainScriptInstalled:
            case CECommand.MainScriptUninstalled:

                const command = CECommandGenerator.generate(CECommand.MessageToBackend, value.Type, value.Data);
                chrome.runtime.sendMessage(command);
                
                break;
        }
    }
}