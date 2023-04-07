import Guid from "../../../common/model/Guid";
import GlobalLogger from "../../../framework/logger/GlobalLogger";
import Service from "../../../framework/service/Service";
import ExtendedDocument from "../../document/global/ExtendedDocument";
import IMainScriptInstallService from "./abstraction/IMainScriptInstallService";

export default class MainScriptInstallService extends Service implements IMainScriptInstallService
{
    public static key: string = Guid.new();
    
    private readonly maxAttempt: number;
    
    constructor()
    {
        super(MainScriptInstallService.key);

        this.maxAttempt = 5;

        this.install = this.install.bind(this);
        this.installInternal = this.installInternal.bind(this);
    }

    public initialize(): void 
    {
        if(this.isWork === true) return;

        this.isWork = true;
    }

    public async install(tabId: number, frameId: number): Promise<boolean>
    {
        const $this = this;
        const result = await new Promise<boolean>(installResolve => 
        {
            $this.installInternal(installResolve, 0, tabId, frameId);
        });

        if(result === false) return false;

        return new Promise<boolean>(setupFrameIdResolve => 
        {
            $this.installFrame(tabId, frameId);

            setupFrameIdResolve(true);
        });
    }

    private installInternal(installResolve: (value: boolean) => void, attempt: number, tabId: number, frameId: number): void
    {
        const $this = this;
        setTimeout(async () => 
        {
            let isInstalled: boolean = false;

            if(attempt === $this.maxAttempt)
            {
                installResolve(false);
                return;
            }

            isInstalled = await new Promise<boolean>(installResolve => 
            {
                chrome.scripting.executeScript(
                    {
                        target: 
                        {
                            tabId: tabId,
                            frameIds: [frameId]
                        },
                        world: 'MAIN',
                        files: 
                        [
                            './src/main.js'
                        ]
                    })
                    .catch(reason => 
                        {
                            GlobalLogger.error('Exception while try install main script', reason); 
                            installResolve(false);
                        })
                    .then(() =>
                        {
                            installResolve(true);
                        });
            });

            if(isInstalled === true)
            {
                installResolve(true);
            }
            else
            {
                $this.installInternal(installResolve, ++attempt, tabId, frameId);
            }
            
        }, 100);
    }

    private installFrame(tabId: number, frameId: number): void
    {
        const document_installFrame = function(frameId: number): void
        {
            (document as ExtendedDocument).API.installFrame(frameId);
        }

        chrome.scripting.executeScript({
            target: {
                tabId: tabId,
                frameIds: [frameId]
            },
            world: 'MAIN',
            func: document_installFrame,
            args: [frameId]
        })
        .catch(reason => 
            { 
                GlobalLogger.error('Exception while try Setup frame ID', reason); 
            });
    }
}