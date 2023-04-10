import Guid from "../../../common/model/Guid";
import GlobalLogger from "../../../framework/logger/GlobalLogger";
import Service from "../../../framework/service/Service";
import IExecuteJavaScriptService from "./abstraction/IExecuteJavaScriptService";

export default class ExecuteJavaScriptService extends Service implements IExecuteJavaScriptService
{
    public static key: string = Guid.new();

    private world: chrome.scripting.ExecutionWorld;

    constructor()
    {
        super(ExecuteJavaScriptService.key);

        this.executeFileAsync = this.executeFileAsync.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;

        this.world = 'MAIN';

        this.isWork = true;
    }

    public async executeFileAsync<TResult>(tabId: number, frameId: number, fileName: string): Promise<TResult | undefined> 
    {
        const $this = this;
        return new Promise<TResult | undefined>(resolve => 
        {
            const target = ExecuteJavaScriptService.GetInjectionTarget(tabId, [frameId]);
            chrome.scripting.executeScript<any, TResult>({ target: target, world: $this.world, files: [fileName] })
                            .catch(reason => 
                                {
                                    GlobalLogger.error(`Error while execute file ${fileName}`, reason);
                                    resolve(undefined);
                                })
                            .then(result => 
                                {
                                    if(result instanceof Array)
                                    {
                                        resolve(<TResult>result[0].result);
                                    }
                                    else
                                    {
                                        resolve(<TResult>{});
                                    }
                                });
        });
    }

    public async executeScriptAsync<TResult>(tabId: number, frameId: number, script: () => TResult): Promise<TResult | undefined> 
    {
        const $this = this;
        return new Promise<TResult | undefined>(resolve => 
        {
            const target = ExecuteJavaScriptService.GetInjectionTarget(tabId, [frameId]);
            chrome.scripting.executeScript<any, TResult>({ target: target, world: $this.world, func: script })
                            .catch(reason => 
                                {
                                    GlobalLogger.error(`Error while execute script ${script}`, reason);
                                    resolve(undefined);
                                })
                            .then(result => 
                                {
                                    if(result instanceof Array)
                                    {
                                        resolve(<TResult>result[0].result);
                                    }
                                    else
                                    {
                                        resolve(<TResult>{});
                                    }
                                });
        });
    }

    public async executeScriptWithArgsAsync<TResult>(tabId: number, frameId: number, args: any, script: (args: any) => TResult): Promise<TResult | undefined> 
    {
        const $this = this;
        return new Promise<TResult | undefined>(resolve => 
        {
            const target = ExecuteJavaScriptService.GetInjectionTarget(tabId, [frameId]);
            chrome.scripting.executeScript<any, TResult>({ target: target, world: $this.world, args: args, func: script })
                            .catch(reason => 
                                {
                                    GlobalLogger.error(`Error while execute script ${script} with args ${args}`, reason);
                                    resolve(undefined);
                                })
                            .then(result => 
                                {
                                    if(result instanceof Array)
                                    {
                                        resolve(<TResult>result[0].result);
                                    }
                                    else
                                    {
                                        resolve(<TResult>{});
                                    }
                                });
        });
    }

    private static GetInjectionTarget(tabId: number, frameIds?: number[]): chrome.scripting.InjectionTarget
    {
        if(frameIds === undefined)
        {
            return {
                tabId: tabId,
                allFrames: true
            }
        }

        return {
            tabId: tabId,
            frameIds: frameIds
        }
    }
}