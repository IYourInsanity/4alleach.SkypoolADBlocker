import IManager from "../../../../framework/manager/abstraction/IManager";
import MainPage from "../page/MainPage";
import IPage from "../page/abstraction/IPage";

export default class PageManager implements IManager
{
    private pages: IPage[];

    public isInitialized: boolean;

    constructor()
    {
        this.isInitialized = false;
        this.pages = [];

        this.initialize = this.initialize.bind(this);
        this.getPages = this.getPages.bind(this);
    }

    public initialize() : void
    {
        if(this.isInitialized === true)
        {
            return;
        }

        this.isInitialized = true;

        this.pages.push(new MainPage());
    }

    public getPages(): IPage[]
    {
        return this.pages;
    }
}