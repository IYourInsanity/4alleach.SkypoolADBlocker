import { PopupData } from "../../../../common/model/PopupData";
import IService from "../../../../framework/service/abstraction/IService";

export default interface IPopupPageRenderService extends IService
{
    updateData(data: PopupData): void;
}