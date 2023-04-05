export default interface IEventController<TData, TSender>
{
    send(value: TData): void;

    receive(value: TData, sender: TSender): void;

    add(key: number, callback: ((event: TData) => void)): void;

    remove(key: number, callback: ((event: TData) => void)): void;
}