import IService from "../abstraction/IService";

export interface ServiceInfo
{
    Key: number;

    Priority: number;

    Service: IService;
}