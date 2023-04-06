import IEventMessage from "../../../../framework/abstraction/IEventMessage";
import IService from "../../../../framework/service/abstraction/IService";

export default interface IBackendEventControllerService extends IService
{
    sendOneWay(tabId: number, frameId: number, message: IEventMessage): void

    sendAsync(tabId: number, frameId: number, message: IEventMessage): Promise<IEventMessage>

    add(key: number, callback: ((message: IEventMessage, sender: chrome.runtime.MessageSender) => void)): void;

    remove(key: number, callback: ((message: IEventMessage, sender: chrome.runtime.MessageSender) => void)): void;
}