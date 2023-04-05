import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import CECommandGenerator from "../../helper/CECommandGenerator";
import CECommand from "../../model/CECommand";
import ContentEventController from "./ContentEventController";

export default class ContentMessageHandlerService extends Service
{
    public static readonly key: string = Guid.new();
    public static readonly hash: number = ContentMessageHandlerService.GetHashCode(ContentMessageHandlerService.key);

    constructor(serviceHub: IServiceHub)
    {
        super(ContentMessageHandlerService.key, serviceHub);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        const controller = this.serviceHub?.get<ContentEventController>(ContentEventController)!;

        controller.add(ContentMessageHandlerService.hash, this.receive);
    }
    
    private receive(value: { Type: string; Data: any; }): void
    {
        switch(value.Type)
        {
            case CECommand.MainScriptInstalled:

                const command = CECommandGenerator.generate(CECommand.MessageToBackend, value.Type, value.Data);
                chrome.runtime.sendMessage(command);

                break;
        }
    }
}