export default interface ExtendedDocumentAPI
{
    installFrame: (frameId: number) => void;
    
    getFrameIdAsync: () => Promise<number>;
}