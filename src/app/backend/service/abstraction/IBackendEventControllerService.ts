import IService from "../../../../framework/service/abstraction/IService";

export default interface IBackendEventControllerService extends IService
{
    sendOneWay(tabId: number, frameId: number, value: { Type: string; Data: any; }): void

    sendAsync(tabId: number, frameId: number, value: { Type: string; Data: any; }): Promise<{ Type: string; Data: any; }>

    add(key: number, callback: ((event: {Type: string, Data: any}, sender: chrome.runtime.MessageSender) => void)): void;

    remove(key: number, callback: ((event: {Type: string, Data: any}, sender: chrome.runtime.MessageSender) => void)): void;
}