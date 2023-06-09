import IService from "./abstraction/IService";
import IServiceHub from "./abstraction/IServiceHub";

export default abstract class Service implements IService
{
    public readonly key: number;

    protected readonly serviceHub: IServiceHub;

    public isWork: boolean;

    constructor(key: number, serviceHub?: IServiceHub)
    {
        this.key = key;

        if(serviceHub !== undefined)
        {
            this.serviceHub = serviceHub;
        }

        this.isWork = false;

        this.initialize = this.initialize.bind(this);
        this.reset = this.reset.bind(this);
    }

    public abstract initialize(): Promise<void>;

    public abstract reset(): Promise<void>;
}