import GlobalLogger from "../logger/GlobalLogger";
import ServiceHub from "../service/ServiceHub";
import IServiceHub from "../service/abstraction/IServiceHub";
import { IConfiguration } from "./abstraction/IConfiguration";

export default abstract class Startup<TConfig extends IConfiguration>
{
    protected readonly serviceHub: IServiceHub;

    constructor()
    {
        this.serviceHub = new ServiceHub();
    }

    public start(config: TConfig): void
    {
        try
        {
            this.configure(config);
        }
        catch (exception: unknown)
        {
            GlobalLogger.error(`Error while script installation. ${config.key}`, exception);
        }
    }

    protected abstract configure(config: TConfig): void;
}