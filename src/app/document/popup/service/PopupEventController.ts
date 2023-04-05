import Guid from "../../../../common/model/Guid";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import CECommand from "../../model/CECommand";
import DocumentEventController from "../../service/DocumentEventController";

export default class PopupEventController extends DocumentEventController
{
    public static key: string = Guid.new();

    constructor()
    {
        super(PopupEventController.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;
        
        window.addEventListener(CECommand.MessageToPopup, this.receiveInternal);
    }

    public override receive(value: { Type: string; Data: any; }, sender: EventTarget | null): void 
    {
        GlobalLogger.log('receive on popup', value, sender);
    }
}