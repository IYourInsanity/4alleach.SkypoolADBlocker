import IService from "../../../../framework/service/abstraction/IService";

export default interface IExecuteJavaScriptService extends IService
{
    executeFileAsync<TResult>(tabId: number, frameId: number, fileName: string): Promise<TResult | undefined>;

    executeScriptAsync<TResult>(tabId: number, frameId: number, script: () => TResult): Promise<TResult | undefined>;

    executeScriptWithArgsAsync<TResult>(tabId: number, frameId: number, args: any, script: (args: any) => TResult): Promise<TResult | undefined>;
}