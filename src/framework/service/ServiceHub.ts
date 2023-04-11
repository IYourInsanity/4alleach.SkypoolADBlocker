import KeyGenerator from "../../common/helper/KeyGenerator";
import WaitHelper from "../../common/helper/WaitHelper";
import GlobalLogger from "../logger/GlobalLogger";
import IService from "./abstraction/IService";
import IServiceHub from "./abstraction/IServiceHub";
import { ServiceInfo } from "./model/ServiceInfo";

export default class ServiceHub implements IServiceHub
{
    readonly key: number;
    private readonly store: { [key: number]: ServiceInfo };

    constructor()
    {
        this.key = KeyGenerator.new();
        this.store = {};

        this.initialize = this.initialize.bind(this);
        this.register = this.register.bind(this);
        this.get = this.get.bind(this);
    }

    public initialize(): void 
    {
        const serviceInfos = Object.values(this.store)
                                   .sort((a, b) => a.Priority - b.Priority);

        const length = serviceInfos.length;

        for (let i = 0; i < length; i++) 
        {
            WaitHelper.execInPromise(serviceInfos[i].Service.initialize);
        }
    }

    public register<TService extends IService>(option: new() => TService): void 
    public register<TService extends IService>(option: new(serviceHub: IServiceHub) => TService): void 
    {
        try
        {
            const key = (option as any).key;
            this.store[key] = { Key: key, Priority: option.length, Service: new option(this) };
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
            service = <TService>this.store[key].Service;
        }
        catch(exception)
        {
            GlobalLogger.error('Error while get service', exception);
        }

        return service;
    }
}