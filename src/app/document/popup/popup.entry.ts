import { EventCommandType } from "../../../common/model/EventCommandType";
import Guid from "../../../common/model/Guid";
import { IEventMessage } from "../../../framework/abstraction/IEventMessage";
import Startup from "../../../framework/entry/Startup";
import { IConfiguration } from "../../../framework/entry/abstraction/IConfiguration";
import NodeRenderManager from "./manager/NodeRenderManager";
import PageManager from "./manager/PageManager";
import PopupEventControllerService from "./service/PopupEventControllerService";

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
        this.serviceHub.register(PopupEventControllerService);

        const pageManager = new PageManager();
        pageManager.initialize();

        const renderManager = new NodeRenderManager(config, pageManager);
        renderManager.initialize();


        //TODO Initialize Services, Managers and etc.

        this.serviceHub.initialize();
    }
}

new PopupStartup().start(config);