export default interface IEventController<TData, TSender>
{
    send(value: TData): void;

    add(key: number, callback: ((event: TData) => void), sender: TSender): void;

    remove(key: number, callback: ((event: TData) => void), sender: TSender): void;
}