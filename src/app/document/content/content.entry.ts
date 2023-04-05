import Guid from "../../../common/model/Guid";
import Startup from "../../../framework/entry/Startup";
import { IConfiguration } from "../../../framework/entry/abstraction/IConfiguration";
import ContentEventController from "./service/ContentEventController";
import ContentMessageHandlerService from "./service/ContentMessageHandlerService";

const config: IConfiguration = 
{
    key: `4alleach.dev.chromium.extension.content_${Guid.new()}`,
    type: 'document'
};

export default class ContentStartup extends Startup<IConfiguration>
{
    constructor()
    {
        super();
    }

    protected configure(config: IConfiguration): void 
    {
        this.serviceHub.register(ContentEventController);
        this.serviceHub.register(ContentMessageHandlerService);
        this.serviceHub.initialize();

        //TODO Initialize Services, Managers and etc.
    }

}

new ContentStartup().start(config);