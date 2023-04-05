import Guid from "../../../../common/model/Guid";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import CECommandGenerator from "../../helper/CECommandGenerator";
import CECommand from "../../model/CECommand";
import DocumentEventController from "../../service/DocumentEventController";

export default class MainEventController extends DocumentEventController
{
    public static key: string = Guid.new();

    constructor()
    {
        super(MainEventController.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        window.addEventListener(CECommand.MessageToMain, this.receiveInternal);
    }

    public override receive(value: { Type: string; Data: any; }, sender: EventTarget | null): void 
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