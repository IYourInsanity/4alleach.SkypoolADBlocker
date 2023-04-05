class GlobalLogger 
{
    constructor()
    {
        //@ts-ignore
        chrome.ExtensionDebug = true;

        this.getMessage = this.getMessage.bind(this);
    }

    public log(title: string, ...optionalParams: any[]): void
    {
        //@ts-ignore
        if(chrome.ExtensionDebug === true)
        {
            const message = this.getMessage(title);
            console.log(message, optionalParams);
        }
    }

    public debug(title: string, ...optionalParams: any[]): void
    {
        //@ts-ignore
        if(chrome.ExtensionDebug === true)
        {
            const message = this.getMessage(title);
            console.debug(message, optionalParams);
        } 
    }

    public error(title: string, ...optionalParams: any[]): void
    {
        //@ts-ignore
        if(chrome.ExtensionDebug === true)
        {
            const message = this.getMessage(title);
            console.error(message, optionalParams);
        } 
    }
    
    private getMessage(message: string): string
    {
        return '[' + new Date(Date.now()).toUTCString() + '] ' + message;
    }
}

export default new GlobalLogger();