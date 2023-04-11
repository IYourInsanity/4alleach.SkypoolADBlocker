import GlobalLogger from "../../framework/logger/GlobalLogger";

export default class EventCallback<TData extends any>
{
    private readonly listeners: ((event: TData) => void)[];

    constructor()
    {
        this.listeners = [];

        this.addListener = this.addListener.bind(this);
        this.removeListener = this.removeListener.bind(this);

        this.raise = this.raise.bind(this);
    }

    public raise(data: TData): void
    {
        this.listeners?.forEach((listener) => 
        {
            try
            {
                listener?.(data);
            }
            catch (exception)
            {
                GlobalLogger.error('Error while raising event', exception);
            }
        });
    }

    public addListener(callback: (event: TData) => void): void
    {
        const listeners = this.listeners;

        if(listeners.indexOf(callback) > -1)
        {
            return;
        }

        listeners.push(callback);
    }

    public removeListener(callback: (event: TData) => void): void
    {
        const listeners = this.listeners;

        if(listeners === undefined)
        {
            return;
        }

        const index = listeners.indexOf(callback);

        if(index === -1)
        {
            GlobalLogger.error('Can`t remove listener because, it already removed');
            return;
        }
        
        listeners.splice(index, 1);
    }
}