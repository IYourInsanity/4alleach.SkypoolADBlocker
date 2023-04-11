import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import EventGenerator from "../../../../common/helper/EventGenerator";
import { DocumentEventControllerService } from "../../service/DocumentEventControllerService"
import IMainEventControllerService from "./abstraction/IMainEventControllerService";
import { EventCommandType } from "../../../../common/model/EventCommandType";
import KeyGenerator from "../../../../common/helper/KeyGenerator";

export default class MainEventControllerService extends DocumentEventControllerService<IEventMessage, EventTarget | null> implements IMainEventControllerService
{
    public static key: number = KeyGenerator.new();

    constructor()
    {
        super(MainEventControllerService.key);
    }

    public override initialize(): void 
    {
        if(this.isWork === true) return;
        this.isWork = true;

        window.addEventListener(EventCommandType.MessageToMain, this.receiveCustomEvent);
    }

    protected override receive(message: IEventMessage, sender: EventTarget | null): void 
    {
        switch(message.Event)
        {
            /*case EventCommandType.Ping:

                GlobalLogger.log('receive on main', message.Data, sender);

                break;*/
        }
    }

    public override send(message: IEventMessage): void
    {
        const command = EventGenerator.generateCustomEvent(EventCommandType.MessageToContent, message);
        window.dispatchEvent(command);
    }
}