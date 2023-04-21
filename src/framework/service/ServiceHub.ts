import AsyncHelper from "../helper/AsyncHelper";
import UniqueIDGenerator from "../helper/UniqueIDGenerator";
import GlobalLogger from "../logger/GlobalLogger";
import IService from "./abstraction/IService";
import IServiceHub from "./abstraction/IServiceHub";
import { ServiceInfo } from "./model/ServiceInfo";

export default class ServiceHub implements IServiceHub
{
    private static MaxAttempt: number = 5;

    public readonly key: UniqueID;

    public isWork: boolean;

    private readonly storage: { [key: number]: ServiceInfo };
    private readonly serviceStorage: { [key: number]: new(serviceHub: IServiceHub) => IService }

    constructor()
    {
        this.key = UniqueIDGenerator.new();
        this.storage = {};
        this.serviceStorage = {};

        this.initialize = this.initialize.bind(this);
        this.register = this.register.bind(this);
        this.getAsync = this.getAsync.bind(this);
    }

    public async initialize(): Promise<void>
    {
        let shouldFullReset: boolean = false;
        let attempt = 0;
        const serviceInfos = Object.values(this.storage)
                                   .sort((a, b) => a.Priority - b.Priority);

        const length = serviceInfos.length;

        for (let i = 0; i < length; i++) 
        {
            attempt = 0;
            const service = serviceInfos[i].Service;

            while(true)
            {
                try
                {
                    await service.initialize();
                    break;
                }
                catch (exception)
                {
                    GlobalLogger.error(`Got problem with service ${service.key} initialization.`, exception);
                    await service.reset();
                    attempt++;
                }

                if(attempt === ServiceHub.MaxAttempt)
                {
                    GlobalLogger.error('Fatal error on service hub initialization side.');
                    shouldFullReset = true;
                    break;
                }
            }
        }

        if(shouldFullReset === true)
        {
            const keys = Object.keys(this.storage).map(_ => Number(_));

            for (let i = 0; i < length; i++)
            {
                const key = keys[i];
                const option = this.serviceStorage[key];
                
                this.storage[key].Service = new option(this);
            }

            this.initialize();
            return;
        }

        this.isWork = true;
    }

    public reset(): Promise<void> 
    {
        //TODO Implement on Service hub side
        throw new Error("Method not implemented.");
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

            this.storage[key] = { Key: key, Priority: priority, Service: new option(this) };
            this.serviceStorage[key] = option;
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
                    promService = <TService>this.storage[key].Service;
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