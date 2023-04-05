import { ResponseInfo } from "./ResponseInfo";

export interface PortInfo
{
    readonly port: chrome.runtime.Port;

    readonly response: { [key: string]: ResponseInfo };
}