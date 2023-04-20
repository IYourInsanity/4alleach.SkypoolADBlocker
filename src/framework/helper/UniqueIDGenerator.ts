export default class UniqueIDGenerator
{
    public static new(): UniqueID
    {
        const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
        {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });

        return UniqueIDGenerator.get(guid);
    }

    public static get(value: string): number
    {
        return value.split('')
                    .map(value => value.charCodeAt(0))
                    .reduce((sum, num) => sum + num, 0);
    }
}