import IService from "../../../../framework/service/abstraction/IService";

export default interface IPopupPageRenderService extends IService
{
    updateData(data: any[]): void;
}