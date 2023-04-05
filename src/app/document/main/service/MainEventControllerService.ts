import Guid from "../../../../common/model/Guid";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import CECommandGenerator from "../../helper/CECommandGenerator";
import CECommand from "../../model/CECommand";
import DocumentEventControllerService from "../../service/DocumentEventControllerService";

export default class MainEventControllerService extends DocumentEventControllerService
{
    public static key: string = Guid.new();

    constructor()
    {
        super(MainEventControllerService.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        window.addEventListener(CECommand.MessageToMain, this.receiveCustomEvent);
    }

    protected override receive(value: { Type: string; Data: any; }, sender: EventTarget | null): void 
    {
        switch(value.Type)
        {
            case CECommand.Ping:

                GlobalLogger.log('receive on main', value, sender);

                break;
        }
    }

    public override send(value: { Type: string; Data: any; }): void
    {
        const command = CECommandGenerator.generateCustomEvent(CECommand.MessageToContent, value.Type, value.Data);
        window.dispatchEvent(command);
    }
}