import { IEventMessage } from "../../../../framework/abstraction/IEventMessage";

export interface ResponseInfo
{
    readonly resolve: (value: IEventMessage) => void;

    readonly timeoutId: any;
}