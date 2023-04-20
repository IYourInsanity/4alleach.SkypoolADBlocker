import { PopupData } from "../../../../common/model/PopupData";
import UniqueIDGenerator from "../../../../framework/helper/UniqueIDGenerator";
import Service from "../../../../framework/service/Service";
import IPopupPageRenderService from "../abstraction/IPopupPageRenderService";
import NodeRenderManager from "../manager/NodeRenderManager";

export default class PopupPageRenderService extends Service implements IPopupPageRenderService
{
    public static key: UniqueID = UniqueIDGenerator.new();
    public static priority: ServicePriority = 0;

    private renderManager: NodeRenderManager;

    constructor()
    {
        super(PopupPageRenderService.key);

        this.updateData = this.updateData.bind(this);
    }

    public override async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;

        this.renderManager = new NodeRenderManager();
        this.renderManager.initialize();
        this.renderManager.render();

        this.isWork = true;
    }

    public updateData(data: PopupData): void 
    {
        if(data === undefined)
        {
            return;
        }

        this.renderManager.update(data);
    }
}