import { IEventMessage } from "../../../../../framework/abstraction/IEventMessage";
import IService from "../../../../../framework/service/abstraction/IService";

export default interface IContentEventControllerService extends IService
{
    send(message: IEventMessage): void;

    add(key: number, callback: ((message: IEventMessage, sender: EventTarget | chrome.runtime.Port | null) => void)): void;

    remove(key: number, callback: ((message: IEventMessage, sender: EventTarget | chrome.runtime.Port | null) => void)): void;
}