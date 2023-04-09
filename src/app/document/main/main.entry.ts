import Guid from "../../../common/model/Guid";
import Startup from "../../../framework/entry/Startup";
import { IConfiguration } from "../../../framework/entry/abstraction/IConfiguration";
import ExtendedDocumentControllerService from "./service/ExtendedDocumentControllerService";
import MainEventControllerService from "./service/MainEventControllerService";
import MutationObserverService from "./service/MutationObserverService";
import NodeADBlockerService from "./service/NodeADBlockerService";
import NodeADAnalyzerService from "./service/NodeADAnalyzerService";
import NodeStorageService from "./service/NodeStorageService";
import WindowEventControllerService from "./service/WindowEventControllerService";

const config: IConfiguration = 
{
    key: `4alleach.dev.chromium.extension.main_${Guid.new()}`,
    type: 'document'
};

export default class MainStartup extends Startup<IConfiguration>
{
    constructor()
    {
        super();
    }

    protected configure(config: IConfiguration): void 
    {
        const serviceHub = this.serviceHub;

        serviceHub.register(WindowEventControllerService);
        serviceHub.register(ExtendedDocumentControllerService);
        serviceHub.register(MainEventControllerService);
        serviceHub.register(MutationObserverService);
        serviceHub.register(NodeStorageService);
        serviceHub.register(NodeADAnalyzerService);
        serviceHub.register(NodeADBlockerService);
        
        serviceHub.initialize();
        
        //TODO Initialize Services, Managers and etc.
    }

}

new MainStartup().start(config);