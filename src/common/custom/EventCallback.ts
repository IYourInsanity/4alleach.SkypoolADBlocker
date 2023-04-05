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
        this.listeners.push(callback);
    }

    public removeListener(callback: (event: TData) => void): void
    {
        this.listeners?.splice(this.listeners?.indexOf(callback), 1);
    }
}