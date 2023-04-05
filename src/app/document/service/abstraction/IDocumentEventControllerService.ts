import IService from "../../../../framework/service/abstraction/IService";

export default interface IDocumentEventControllerService extends IService
{
    receiveCustomEvent(event: CustomEvent | Event): void;

    send(value: {Type: string, Data: any}): void;

    add(key: number, callback: ((event: {Type: string, Data: any}, sender: EventTarget | null) => void)): void;

    remove(key: number, callback: ((event: {Type: string, Data: any}, sender: EventTarget | null) => void)): void;
}