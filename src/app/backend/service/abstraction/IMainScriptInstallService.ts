import IService from "../../../../framework/service/abstraction/IService";

export default interface IMainScriptInstallService extends IService
{
    install(tabId: number, frameId: number): Promise<boolean>;
}