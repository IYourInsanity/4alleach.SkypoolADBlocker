import AsyncHelper from "../helper/AsyncHelper";
import UniqueIDGenerator from "../helper/UniqueIDGenerator";
import GlobalLogger from "../logger/GlobalLogger";
import IService from "./abstraction/IService";
import IServiceHub from "./abstraction/IServiceHub";
import { ServiceInfo } from "./model/ServiceInfo";

export default class ServiceHub implements IServiceHub
{
    public readonly key: UniqueID;

    public isWork: boolean;

    private readonly store: { [key: number]: ServiceInfo };

    constructor()
    {
        this.key = UniqueIDGenerator.new();
        this.store = {};

        this.initialize = this.initialize.bind(this);
        this.register = this.register.bind(this);
        this.getAsync = this.getAsync.bind(this);
    }

    public initialize(): void | Promise<void>
    {
        const serviceInfos = Object.values(this.store)
                                   .sort((a, b) => a.Priority - b.Priority);

        const length = serviceInfos.length;

        for (let i = 0; i < length; i++) 
        {
            serviceInfos[i].Service.initialize();
        }

        this.isWork = true;
    }

    public register<TService extends IService>(option: new() => TService): void 
    public register<TService extends IService>(option: new(serviceHub: IServiceHub) => TService): void 
    {
        if('key' in option === false || 'priority' in option === false)
        {
            GlobalLogger.error('Object is not a service', option);
            return;
        }

        try
        {
            const key: UniqueID = option.prototype.constructor.key;
            const priority: ServicePriority = option.prototype.constructor.priority;

            this.store[key] = { Key: key, Priority: priority, Service: new option(this) };
        }
        catch(exception)
        {
            GlobalLogger.error('Error while register service', exception);
        }
    }

    public getAsync<TService extends IService>(option: Function): Promise<TService>
    {
        let service: TService = <TService>{};

        if('key' in option === false)
        {
            GlobalLogger.error('Object is not a service', option);
            return Promise.resolve(service);
        }

        return new Promise(async resolve => 
        {
            let promService: TService | undefined = undefined;

            while(promService === undefined || promService.isWork === false)
            {
                try
                {
                    await AsyncHelper.wait(10);
                    const key: UniqueID = option.prototype.constructor.key;
                    promService = <TService>this.store[key].Service;
                }
                catch(exception)
                {
                    GlobalLogger.error('Error while get service', exception);
                }
            }
            
            resolve(promService);
        });
    }
}