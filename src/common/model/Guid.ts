export default class Guid
{
    public static empty: string = '00000000-0000-0000-0000-000000000000';

    public static new(): string
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
        {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    }
}