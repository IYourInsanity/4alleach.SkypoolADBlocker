import Guid from "../../../common/model/Guid";
import Startup from "../../../framework/entry/Startup";
import { IConfiguration } from "../../../framework/entry/abstraction/IConfiguration";
import CEDocumentControllerService from "./service/CEDocumentControllerService";
import MainEventController from "./service/MainEventController";

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

        serviceHub.register(CEDocumentControllerService);
        serviceHub.register(MainEventController);  

        serviceHub.initialize();
        
        //TODO Initialize Services, Managers and etc.
    }

}

new MainStartup().start(config);