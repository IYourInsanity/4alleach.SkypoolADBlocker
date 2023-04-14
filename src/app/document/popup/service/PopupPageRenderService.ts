import KeyGenerator from "../../../../common/helper/KeyGenerator";
import Service from "../../../../framework/service/Service";
import IPopupPageRenderService from "../abstraction/IPopupPageRenderService";
import NodeRenderManager from "../manager/NodeRenderManager";

export default class PopupPageRenderService extends Service implements IPopupPageRenderService
{
    public static key: number = KeyGenerator.new();

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

    public updateData(data: any[]): void 
    {
        if(data === undefined)
        {
            return;
        }

        this.renderManager.update(data);
    }
}