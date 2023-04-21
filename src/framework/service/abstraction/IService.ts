export default interface IService
{
    readonly key: number;

    isWork: boolean;
    
    initialize(): Promise<void>;

    reset(): Promise<void>;
}