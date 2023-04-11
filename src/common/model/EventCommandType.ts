export enum EventCommandType
{
    Empty = "ce-command-message-to-empty",
    Disconnected = "ce-command-message-to-disconnected",
    CancelByTimeout = "ce-command-message-to-cancel-by-timeout",
    CancelByToken = "ce-command-message-to-cancel-by-token",

    MessageToPopup = "ce-command-message-to-popup",
    MessageFromPopup = "ce-command-message-from-popup",

    MessageToBackend = "ce-command-message-to-backend",
    MessageToContent = "ce-command-message-to-content",
    MessageToMain = "ce-command-message-to-main",


    MainScriptInstalled = "ce-command-main-script-installed",
    ContentScriptInstalled = "ce-command-content-script-installed",

    GetTabInformationForPopup = "ce-command-get-tab-information-for-popup",

    NodeIsBlocked = "ce-command-node-is-blocked"
}