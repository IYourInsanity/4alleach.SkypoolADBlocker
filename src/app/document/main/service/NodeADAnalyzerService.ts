import KeyGenerator from "../../../../common/helper/KeyGenerator";
import WaitHelper from "../../../../common/helper/WaitHelper";
import Guid from "../../../../common/model/Guid";
import Service from "../../../../framework/service/Service";
import IServiceHub from "../../../../framework/service/abstraction/IServiceHub";
import NodeStorageService from "./NodeStorageService";
import INodeADAnalyzerService from "./abstraction/INodeADAnalyzerService";
import INodeStorageService from "./abstraction/INodeStorageService";

export default class NodeADAnalyzerService extends Service implements INodeADAnalyzerService
{
    private static validFilter = ['uploads', 'base64'];

    private static attrfilter = ['banner', 'adfox', 'reklama', 'adw', 'adv', 'adn', 'ads', 'yandex_rtb', 'cdn'];

    private static scriptParentFilter = ['banner'];
    private static scriptSrcFilter = ['metrika', 'an.yandex', 'google-analytics', 'googletag', 'hotjar', 'adsbygoogle', 'bugsnag', 'sentry'];
    
    private static linkFilter = ['adfox', 'ads'];

    private static attrToCheck = ['id', 'class', 'alt', 'src', 'data', 'data-name'];
    
    public static key: number = KeyGenerator.new();

    private storageService: INodeStorageService;

    private potentialADNode: {[key: string]: Node};

    constructor(serviceHub: IServiceHub)
    {
        super(NodeADAnalyzerService.key, serviceHub);

        this.potentialADNode = {};

        this.handle = this.handle.bind(this);
        this.handleInternal = this.handleInternal.bind(this);

        this.validateAttributes = this.validateAttributes.bind(this);
        this.validateIframe = this.validateIframe.bind(this);
        this.validateScript = this.validateScript.bind(this);
        this.validateLink = this.validateLink.bind(this);

        this.handleIframe = this.handleIframe.bind(this);
    }

    public async initialize(): Promise<void> 
    {
        if(this.isWork === true) return;

        this.storageService = await this.serviceHub.getAsync(NodeStorageService);

        this.isWork = true;
    }

    public handle(node: Node): void
    {
        if(node === undefined)
        {
            return;
        }

        WaitHelper.execInPromise(() => this.handleInternal(node));
    }

    private handleInternal(node: Node): void
    {
        if(node === undefined)
        {
            return;
        }

        if(node instanceof HTMLIFrameElement)
        {
            WaitHelper.execInPromise(() => this.validateIframe(node));
            return;
        }

        if(node instanceof HTMLScriptElement)
        {
            WaitHelper.execInPromise(() => this.validateScript(node));
            return;
        }

        if(node instanceof HTMLLinkElement)
        {
            WaitHelper.execInPromise(() => this.validateLink(node));
            return;
        }

        if(node instanceof HTMLElement &&
           node instanceof HTMLBodyElement === false && 
           node instanceof HTMLHeadElement === false)
        {
            const isValid = this.validateAttributes(node);

            if(isValid === true)
            {
                this.storageService.save(node);
                return;
            }
        }

        const childNodes = node.childNodes;
        const length = childNodes.length;

        for (let i = 0; i < length; i++) 
        {
            const childNode = childNodes[i];
            
            WaitHelper.execInPromise(() => 
            {
                this.handleInternal(childNode);
            });
        }
    }

    private validateIframe(node: HTMLIFrameElement): void
    {
        if(this.validateAttributes(node) === false)
        {
            const key = Guid.new();
            this.potentialADNode[key] = node;

            const contentDocument = node.contentDocument;

            if(contentDocument !== null)
            {
                try
                {
                    this.handleIframe(contentDocument.documentElement, key);
                }
                catch (exception)
                {
                    //TODO: OperationCanceledException
                }
            }

            delete this.potentialADNode[key];
        }
        else
        {
            this.storageService.save(node);
        }
    }

    private handleIframe(node: Node, key: string): void
    {
        if(node === undefined)
        {
            return;
        }

        if(node instanceof HTMLIFrameElement)
        {
            WaitHelper.execInPromise(() => this.validateIframe(node));
            return;
        }

        if(node instanceof HTMLScriptElement)
        {
            WaitHelper.execInPromise(() => this.validateScript(node));
            return;
        }

        if(node instanceof HTMLLinkElement)
        {
            WaitHelper.execInPromise(() => this.validateLink(node));
            return;
        }

        if(node instanceof HTMLElement)
        {
            const isValid = this.validateAttributes(node);

            if(isValid === true)
            {
                const frame = this.potentialADNode[key];
                this.storageService.save(frame);
                
                //TODO: OperationCanceledException
                throw new Error();
            }
        }

        const childNodes = node.childNodes;
        const length = childNodes.length;

        for (let i = 0; i < length; i++) 
        {
            const childNode = childNodes[i];

            WaitHelper.execInPromise(() => 
            {
                this.handleIframe(childNode, key);
            });
        }
    }

    private validateScript(node: HTMLScriptElement): void
    {
        const parent = node.parentNode;

        if(parent === undefined || parent === null ||
          (parent instanceof HTMLBodyElement === true || 
           parent instanceof HTMLHeadElement === true))
        {
            return;
        }

        const text = node.text;
        const src = node.src;

        const parentFilter = NodeADAnalyzerService.scriptParentFilter;

        if(parentFilter.some(item => text.includes(item)))
        {
            this.storageService.save(parent);
        }

        const srcFilter = NodeADAnalyzerService.scriptSrcFilter;

        if(srcFilter.some(item => src.includes(item) || text.includes(item)))
        {
            this.storageService.save(node);
        }
    }

    private validateLink(node: HTMLLinkElement): void
    {
        const filter = NodeADAnalyzerService.linkFilter;
        const href = node.href;

        if(filter.some(item => href.includes(item)))
        {
            this.storageService.save(node);
        }
    }

    private validateAttributes(element: HTMLElement): boolean
    {
        const attrToCheck = NodeADAnalyzerService.attrToCheck;
        const attrfilter = NodeADAnalyzerService.attrfilter;
        const validFilter = NodeADAnalyzerService.validFilter;
        
        const attributes = element.attributes;

        if(attributes === undefined)
        {
            return false;
        }

        const length = attributes.length;
        
        for (let i = 0; i < length; i++) 
        {
            const attr = attributes[i];
            const attrName = attr.nodeName;
            const value = attr.value;

            if(validFilter.some(item => value.includes(item)))
            {
                continue;
            }

            if(attrToCheck.some(item => attrName === item) &&
               attrfilter.some(item => value.includes(item)))
            {
                return true;
            }
        }

        return false;
    }
}