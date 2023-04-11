import KeyGenerator from "../../../common/helper/KeyGenerator";
import WaitHelper from "../../../common/helper/WaitHelper";
import Service from "../../../framework/service/Service";
import IServiceHub from "../../../framework/service/abstraction/IServiceHub";
import ExtendedDocument from "../../document/global/ExtendedDocument";
import ExecuteJavaScriptService from "./ExecuteJavaScriptService";
import IExecuteJavaScriptService from "./abstraction/IExecuteJavaScriptService";
import IMainScriptInstallService from "./abstraction/IMainScriptInstallService";

export default class MainScriptInstallService extends Service implements IMainScriptInstallService
{
    public static key: number = KeyGenerator.new();
    
    private scriptService: IExecuteJavaScriptService;

    private mainScriptFileName: string;

    private maxAttempt: number;
    
    constructor(serviceHub: IServiceHub)
    {
        super(MainScriptInstallService.key, serviceHub);

        this.install = this.install.bind(this);
        this.installInternal = this.installInternal.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;

        this.scriptService = this.serviceHub.get(ExecuteJavaScriptService);
        this.maxAttempt = 5;
        this.mainScriptFileName = './src/main.js';

        this.isWork = true;
    }

    public async install(tabId: number, frameId: number): Promise<boolean>
    {
        const $this = this;
        return await new Promise<boolean>(installResolve => 
        {
            $this.installInternal(installResolve, 0, tabId, frameId);
        });
    }

    private async installInternal(installResolve: (value: boolean) => void, attempt: number, tabId: number, frameId: number): Promise<void>
    {
        const $this = this;

        const document_installationCheck = function(): boolean
        {
            //TODO: Rework it
            while((document as ExtendedDocument) === undefined) { }

            return true;
        }

        const document_installFrame = function(frameId: number): void
        {
            (document as ExtendedDocument).API.installFrame(frameId);
        }

        if(attempt === $this.maxAttempt)
        {
            installResolve(false);
            return;
        }

        const isInstalled = await $this.scriptService.executeFileAsync(tabId, frameId, $this.mainScriptFileName);

        if(isInstalled === undefined)
        {
            await WaitHelper.wait(100);
            $this.installInternal(installResolve, ++attempt, tabId, frameId);
            return;
        }

        const isExist = await $this.scriptService.executeScriptAsync(tabId, frameId, document_installationCheck);

        if(isExist === false)
        {
            installResolve(false);
        }

        await $this.scriptService.executeScriptWithArgsAsync(tabId, frameId, [frameId], document_installFrame);
    }
}