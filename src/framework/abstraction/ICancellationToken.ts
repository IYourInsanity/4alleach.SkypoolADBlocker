export interface ICancellationToken
{
   IsCanceled: boolean;
}

export class CancellationToken implements ICancellationToken
{
    private timeout: number;

    IsCanceled: boolean;

    constructor()
    {
        this.IsCanceled = false;
        this.cancel = this.cancel.bind(this);
    }

    private cancel() : void
    {
        setTimeout(() => 
        {
            this.IsCanceled = true;
        }, this.timeout);
    }

    public static Create(timeout: number): ICancellationToken
    {
        const token = new CancellationToken();

        token.timeout = timeout;
        token.cancel();

        return token;
    }
}