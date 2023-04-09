export default interface ExtendedDocumentAPI
{
    installFrame: (frameId: number) => void;
    
    uninstallFrame: () => void;

    getFrameIdAsync: () => Promise<number>;
}