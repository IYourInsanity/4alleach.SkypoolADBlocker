import IService from "../../../../framework/service/abstraction/IService";

export default interface IUrlService extends IService
{
    validate(value: string): boolean;
}