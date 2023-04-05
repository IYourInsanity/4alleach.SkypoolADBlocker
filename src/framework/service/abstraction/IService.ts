export default interface IService
{
    readonly key: string;
    
    initialize(): void;
}