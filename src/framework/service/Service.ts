import IService from "./abstraction/IService";
import IServiceHub from "./abstraction/IServiceHub";

export default abstract class Service implements IService
{
    public readonly key: number;

    protected readonly serviceHub: IServiceHub;

    protected isWork: boolean;

    constructor(key: number, serviceHub?: IServiceHub)
    {
        this.key = key;

        if(serviceHub !== undefined)
        {
            this.serviceHub = serviceHub;
        }

        this.isWork = false;

        this.initialize = this.initialize.bind(this);
    }

    public abstract initialize(): void | Promise<void>;
}