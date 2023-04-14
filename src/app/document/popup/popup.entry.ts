import Guid from "../../../common/model/Guid";
import Startup from "../../../framework/entry/Startup";
import { IConfiguration } from "../../../framework/entry/abstraction/IConfiguration";
import PopupEventControllerService from "./service/PopupEventControllerService";
import PopupMessageHandlerService from "./service/PopupMessageHandlerService";
import PopupPageRenderService from "./service/PopupPageRenderService";

const config: IConfiguration = 
{
    key: `4alleach.dev.chromium.extension.popup_${Guid.new()}`,
    type: 'document'
};

export default class PopupStartup extends Startup<IConfiguration>
{
    constructor()
    {
        super();
    }

    protected configure(config: IConfiguration): void 
    {
        const serviceHub = this.serviceHub;

        serviceHub.register(PopupEventControllerService);
        serviceHub.register(PopupMessageHandlerService);
        serviceHub.register(PopupPageRenderService);

        //TODO Initialize Services, Managers and etc.

        serviceHub.initialize();
    }
}

new PopupStartup().start(config);