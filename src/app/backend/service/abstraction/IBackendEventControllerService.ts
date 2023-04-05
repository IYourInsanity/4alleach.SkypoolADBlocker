import IService from "../../../../framework/service/abstraction/IService";

export default interface IBackendEventControllerService extends IService
{
    send(value: {Type: string, Data: any}): void;

    receive(value: {Type: string, Data: any}, sender: chrome.runtime.MessageSender): void;

    add(key: number, callback: ((event: {Type: string, Data: any}, sender: chrome.runtime.MessageSender) => void)): void;

    remove(key: number, callback: ((event: {Type: string, Data: any}, sender: chrome.runtime.MessageSender) => void)): void;
}