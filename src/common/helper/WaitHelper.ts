export default class WaitHelper
{
    public static wait(timeout: number): Promise<void>
    {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    public static execInPromise(callback: () => void): Promise<void>
    {
        return new Promise(resolve => 
            {
                try
                {
                    callback();
                }
                catch { }
                finally
                {
                    resolve();
                }
            });
    }
}