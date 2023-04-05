import Guid from "../../common/model/Guid";
import GlobalLogger from "../logger/GlobalLogger";
import IService from "./abstraction/IService";
import IServiceHub from "./abstraction/IServiceHub";

export default class ServiceHub implements IServiceHub
{
    readonly key: string;
    private readonly store: { [key: string]: IService };

    constructor()
    {
        this.key = Guid.new();
        this.store = {};

        this.initialize = this.initialize.bind(this);
        this.register = this.register.bind(this);
        this.get = this.get.bind(this);
    }

    public initialize(): void 
    {
        for(let key in this.store)
        {
            this.store[key].initialize();
        }
    }

    public register<TService extends IService>(option: new() => TService): void 
    public register<TService extends IService>(option: new(serviceHub: IServiceHub) => TService): void 
    {
        try
        {
            const key = (option as any).key;
            this.store[key] = new option(this);
        }
        catch(exception)
        {
            GlobalLogger.error('Error while register service', exception);
        }
    }

    public get<TService extends IService>(option: Function): TService
    {
        let service: TService = <TService>{};

        if('key' in option === false)
        {
            GlobalLogger.error('Object is not a service', option);
            return service;
        }

        try
        {
            const key = (option as any).key;
            service = this.store[key] as TService;
        }
        catch(exception)
        {
            GlobalLogger.error('Error while get service', exception);
        }

        return service;
    }
}