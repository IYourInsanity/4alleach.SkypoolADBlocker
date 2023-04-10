import Startup from "../../framework/entry/Startup";
import Guid from "../../common/model/Guid";
import { IConfiguration } from "../../framework/entry/abstraction/IConfiguration";
import BackendEventControllerService from "./service/BackendEventControllerService";
import TabStateService from "./service/TabStateService";
import UrlService from "./service/UrlService";
import MainScriptInstallService from "./service/MainScriptInstallService";
import ExecuteJavaScriptService from "./service/ExecuteJavaScriptService";

const config: IConfiguration = 
{
    key: `4alleach.dev.chromium.extension.backend_${Guid.new()}`,
    type: 'backend'
};

export default class BackendStartup extends Startup<IConfiguration>
{
    constructor()
    {
        super();
    }

    protected configure(config: IConfiguration): void 
    {
        const serviceHub = this.serviceHub;

        serviceHub.register(ExecuteJavaScriptService);
        
        serviceHub.register(BackendEventControllerService);
        serviceHub.register(TabStateService);
        serviceHub.register(UrlService);
        serviceHub.register(MainScriptInstallService);

        serviceHub.initialize();
        
        //TODO Initialize Services, Managers and etc.
    }

}

new BackendStartup().start(config);