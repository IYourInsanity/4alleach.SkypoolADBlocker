export interface ResponseInfo
{
    readonly resolve: (value: { Type: string; Data: any; }) => void;

    readonly timeoutId: any;
}