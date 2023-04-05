import Guid from "../../../../common/model/Guid";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import CECommand from "../../model/CECommand";
import DocumentEventControllerService from "../../service/DocumentEventControllerService";

export default class PopupEventControllerService extends DocumentEventControllerService
{
    public static key: string = Guid.new();

    constructor()
    {
        super(PopupEventControllerService.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;
        
        window.addEventListener(CECommand.MessageToPopup, this.receiveCustomEvent);
    }

    public override receive(value: { Type: string; Data: any; }, sender: EventTarget | null): void 
    {
        GlobalLogger.log('receive on popup', value, sender);
    }
}