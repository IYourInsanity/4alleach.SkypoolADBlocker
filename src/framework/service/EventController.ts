import GlobalLogger from "../logger/GlobalLogger";
import Service from "./Service";
import IEventController from "./abstraction/IEventController";

export abstract class EventController<TData, TSender> extends Service implements IEventController<TData, TSender>
{
    protected readonly listeners: { [key: number]: ((event: TData, sender: TSender) => void)[] };

    constructor(key: string)
    {
        super(key);

        this.listeners = [];

        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);

        this.initialize = this.initialize.bind(this);
        this.receive = this.receive.bind(this);
    }

    public add(key: number, callback: ((event: TData, sender: TSender) => void)): void 
    {
        let listener = this.listeners[key];

        if(listener === undefined)
        {
            this.listeners[key] = [];
            listener = this.listeners[key];
        }

        if(listener.indexOf(callback) > -1)
        {
            return;
        }

        listener.push(callback);
    }

    public remove(key: number, callback: ((event: TData, sender: TSender) => void)): void 
    {
        const listener = this.listeners[key];

        if(listener === undefined)
        {
            return;
        }

        const index = listener.indexOf(callback);

        if(index === -1)
        {
            GlobalLogger.error('Can`t remove listener because, it already removed');
            return;
        }

        if(listener.length === 0)
        {
            delete this.listeners[key];
            return;
        }     
        
        listener.splice(index, 1);
    }

    public initialize(): void 
    {
        throw new Error("Method not implemented.");
    }

    public send(value: TData): void
    {
        throw new Error("Method not implemented.");
    }

    public receive(value: TData, sender: TSender): void
    {
        throw new Error("Method not implemented.");
    }
}