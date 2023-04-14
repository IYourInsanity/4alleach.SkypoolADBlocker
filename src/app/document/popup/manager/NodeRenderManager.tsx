import { createRoot, Root } from "react-dom/client";
import IManager from "../../../../framework/manager/abstraction/IManager";
import Guid from "../../../../common/model/Guid";
import { BlockedData } from "../page/model/BlockedData";
import { Page } from "../page/Page";

export default class NodeRenderManager implements IManager
{
    private container: HTMLDivElement;
    private root: Root;
    private page: Page;

    private model: BlockedData;

    public isInitialized: boolean;

    constructor()
    {
        this.initialize = this.initialize.bind(this);
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
    }

    public initialize(): void
    {
        if(this.isInitialized === true)
        {
            return;
        }

        this.isInitialized = true;

        this.model = new BlockedData();
        this.container = document.createElement('div');

        document.body.appendChild(this.container);

        this.root = createRoot(this.container, { identifierPrefix: Guid.new() }); 
    }

    public render(): void
    {
        this.page = new Page(this.model);
        this.root.render(this.page.render());
    }

    public update(data: any[]): void
    {
        this.page.update(data.length);
    }

}