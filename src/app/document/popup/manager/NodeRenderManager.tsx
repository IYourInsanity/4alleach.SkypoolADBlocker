import { IConfiguration } from "../../../../framework/entry/abstraction/IConfiguration";
import { createRoot, Root } from "react-dom/client";
import IManager from "../../../../framework/manager/abstraction/IManager";
import PageManager from "./PageManager";

export default class NodeRenderManager implements IManager
{
    private readonly key: string;
    private readonly pageManager: PageManager;

    private container: HTMLDivElement;
    private root: Root;

    public isInitialized: boolean;

    constructor(config: IConfiguration, pageManager: PageManager)
    {
        this.key = config.key;
        this.pageManager = pageManager;
        this.isInitialized = false;

        this.initialize = this.initialize.bind(this);
    }

    public initialize(): void
    {
        if(this.isInitialized === true)
        {
            return;
        }

        this.isInitialized = true;
        this.container = document.createElement('div');

        document.body.appendChild(this.container);

        this.root = createRoot(this.container, { identifierPrefix: this.key });

        //TODO:Rework it
        const defaultPage = this.pageManager.getPages()[0].get();

        this.root.render(defaultPage);
    }
}