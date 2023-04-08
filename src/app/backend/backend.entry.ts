import Startup from "../../framework/entry/Startup";
import Guid from "../../common/model/Guid";
import { IConfiguration } from "../../framework/entry/abstraction/IConfiguration";
import BackendEventControllerService from "./service/BackendEventControllerService";
import TabStateService from "./service/TabStateService";
import UrlService from "./service/UrlService";
import MainScriptInstallService from "./service/MainScriptInstallService";
import IBackendEventControllerService from "./service/abstraction/IBackendEventControllerService";
import ITabStateService from "./service/abstraction/ITabStateService";
import { IEventMessage } from "../../framework/abstraction/IEventMessage";
import { CancellationToken } from "../../framework/abstraction/ICancellationToken";

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

        serviceHub.register(BackendEventControllerService);
        serviceHub.register(TabStateService);
        serviceHub.register(UrlService);
        serviceHub.register(MainScriptInstallService);

        serviceHub.initialize();

        new Promise(async (resolve) => 
        {
            const state = serviceHub.get<ITabStateService>(TabStateService);
            const service = serviceHub.get<IBackendEventControllerService>(BackendEventControllerService);

            const data: IEventMessage = { MessageId: Guid.new(), Event:'test', Data: 'Hello World'};
            console.log('Send message to content and wait response', data);

            const response = await service.sendAsync(state.getActiveTabId(), 0, data, CancellationToken.Create(2000));

            console.log('Receive response from content', response);

            resolve(true);
        });
        
        //TODO Initialize Services, Managers and etc.
    }

}

new BackendStartup().start(config);