import Guid from "../../../../common/model/Guid";
import IEventMessage from "../../../../framework/abstraction/IEventMessage";
import GlobalLogger from "../../../../framework/logger/GlobalLogger";
import EventGenerator from "../../helper/EventGenerator";
import EventCommand from "../../model/EventCommand";
import { DocumentEventControllerService } from "../../service/DocumentEventControllerService"
import IMainEventControllerService from "./abstraction/IMainEventControllerService";

export default class MainEventControllerService extends DocumentEventControllerService<IEventMessage, EventTarget | null> implements IMainEventControllerService
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

        window.addEventListener(EventCommand.MessageToMain, this.receiveCustomEvent);
    }

    protected override receive(message: IEventMessage, sender: EventTarget | null): void 
    {
        switch(message.Event)
        {
            case EventCommand.Ping:

                GlobalLogger.log('receive on main', message.Data, sender);

                break;
        }
    }

    public override send(message: IEventMessage): void
    {
        const command = EventGenerator.generateCustomEvent(EventCommand.MessageToContent, message);
        window.dispatchEvent(command);
    }
}