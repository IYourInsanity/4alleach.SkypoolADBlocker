export default class AsyncHelper
{
    public static wait(timeout: number): Promise<void>
    {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
}