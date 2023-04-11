import { IEventMessage } from "../../abstraction/IEventMessage";

export default interface IEventController<TData extends IEventMessage, TSender extends any>
{
    send(value: TData): void;

    add(key: number, callback: ((event: TData) => void), sender: TSender): void;

    remove(key: number, callback: ((event: TData) => void), sender: TSender): void;
}