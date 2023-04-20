export default interface IService
{
    readonly key: number;

    isWork: boolean;
    
    initialize(): void | Promise<void>;
}