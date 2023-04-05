import IService from "./IService";

export default interface IServiceHub extends IService
{
    register<TService extends IService>(option: new() => TService): void;

    register<TService extends IService>(option: new(serviceHub: IServiceHub) => TService): void;

    get<TService extends IService>(option: Function): TService | null;
}