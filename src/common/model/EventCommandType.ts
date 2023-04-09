export enum EventCommandType
{
    Empty = "ce-command-message-to-empty",
    Disconnected = "ce-command-message-to-disconnected",
    CancelByTimeout = "ce-command-message-to-cancel-by-timeout",
    CancelByToken = "ce-command-message-to-cancel-by-token",

    MessageToPopup = "ce-command-message-to-popup",
    MessageToContent = "ce-command-message-to-content",
    MessageToMain = "ce-command-message-to-main",


    MainScriptInstalled = "ce-command-main-script-installed",
    MainScriptUninstalled = "ce-command-main-script-uninstalled"
}