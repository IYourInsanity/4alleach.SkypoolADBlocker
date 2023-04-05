import { FrameInfo } from "./FrameInfo";

export interface TabInfo
{
    State: TabState;

    Frames: { [key: number]: FrameInfo };
}

export enum TabState
{
    Created = 0,
    Loading = 1,
    Loaded = 2
}