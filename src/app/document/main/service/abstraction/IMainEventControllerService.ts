import IEventMessage from "../../../../../framework/abstraction/IEventMessage";
import IService from "../../../../../framework/service/abstraction/IService";

export default interface IMainEventControllerService extends IService
{
    send(message: IEventMessage): void;

    add(key: number, callback: ((message: IEventMessage, sender: EventTarget | null) => void)): void;

    remove(key: number, callback: ((message: IEventMessage, sender: EventTarget | null) => void)): void;
}