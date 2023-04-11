import Guid from "../model/Guid";

export default class KeyGenerator
{
    public static get(value: string): number
    {
        return value.split('') //id to chars
                    .map(value => value.charCodeAt(0)) // char to number
                    .reduce((sum, num) => sum + num, 0); // sum of all numbers
    }

    public static new(): number
    {
        return KeyGenerator.get(Guid.new());
    }
}