import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import IService from "../../../../framework/service/abstraction/IService";

export default interface IPopupEventControllerService extends IService
{
    send(message: IEventMessage): void;
}