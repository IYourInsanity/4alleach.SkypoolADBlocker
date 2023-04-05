export interface FrameInfo
{
    State: FrameState;

    MainScriptInstalled?: boolean;
}

export enum FrameState
{
    Commited = 0,
    Loaded = 1,
}



