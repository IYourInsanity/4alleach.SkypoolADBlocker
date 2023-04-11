import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";
import IService from "../../../../framework/service/abstraction/IService";

export default interface IPopupMessageHandlerService extends IService
{
    receive(message: IEventMessage, sender: chrome.runtime.MessageSender): void;
}