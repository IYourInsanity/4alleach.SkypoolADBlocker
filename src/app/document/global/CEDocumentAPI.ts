export default interface CEDocumentAPI
{
    installFrame: (frameId: number) => void;
    uninstallFrame: () => void;
}