import { EventCommandType } from "../../../../common/model/EventCommandType";
import { PopupData } from "../../../../common/model/PopupData";
import { EventMessage, IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import UniqueIDGenerator from "../../../../framework/helper/UniqueIDGenerator";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import IPopupEventControllerService from "../abstraction/IPopupEventControllerService";
import IPopupMessageHandlerService from "../abstraction/IPopupMessageHandlerService";
import IPopupPageRenderService from "../abstraction/IPopupPageRenderService";
import PopupEventControllerService from "./PopupEventControllerService";
import PopupPageRenderService from "./PopupPageRenderService";

export default class PopupMessageHandlerService extends Service implements IPopupMessageHandlerService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 1;

    private eventController: IPopupEventControllerService;
    private pageRenderService: IPopupPageRenderService;

    constructor(serviceHub: IServiceHub)
    {
        super(PopupMessageHandlerService.key, serviceHub);

        this.receive = this.receive.bind(this);
        this.send = this.send.bind(this);
    }

    public override async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;

        this.eventController = await this.serviceHub.getAsync(PopupEventControllerService);
        this.eventController.add(PopupMessageHandlerService.key, this.receive);

        this.pageRenderService = await this.serviceHub.getAsync(PopupPageRenderService);

        //TODO: Reworked init
        const message = EventMessage.new(EventCommandType.GetTabInformationForPopup, {}, EventCommandType.MessageToBackend);
        this.eventController.send(message);

        this.isWork = true;
    }

    public override async reset(): Promise<void>
    {
        if(this.eventController?.remove !== undefined)
        {
            this.eventController.remove(PopupMessageHandlerService.key, this.receive);
        }

        this.isWork = false;
    }

    private async receive(message: IEventMessage, sender: EventTarget | chrome.runtime.Port | null): Promise<void> 
    {
        switch(message.Event)
        {
            case EventCommandType.GetTabInformationForPopup: 

                this.pageRenderService.updateData(message.Data as PopupData);

                break;
        }
    }

    public send(message: IEventMessage): void
    {
        this.eventController.send(message);
    }
}