import IService from "./abstraction/IService";
import IServiceHub from "./abstraction/IServiceHub";

export default abstract class Service implements IService
{
    public readonly key: string;

    protected readonly serviceHub: IServiceHub;

    protected isWork: boolean;

    constructor(key: string, serviceHub?: IServiceHub)
    {
        this.key = key;

        if(serviceHub !== undefined)
        {
            this.serviceHub = serviceHub;
        }

        this.isWork = false;

        this.initialize = this.initialize.bind(this);
    }

    public abstract initialize(): void;

    protected static GetHashCode(value: string): number
    {
        let hash = 0;

        for (var i = 0; i < value.length; i++) 
        {
            let code = value.charCodeAt(i);
            hash = ((hash<<5)-hash)+code;
            hash = hash & hash;
        }
        
        return hash;
    }
}