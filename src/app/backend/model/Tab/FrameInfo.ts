export interface FrameInfo
{
    State: FrameState;

    MainScriptInstalled?: boolean;

    ContentScriptInstalled?: boolean;
}

export enum FrameState
{
    Commited = 0,
    Loaded = 1,
}



