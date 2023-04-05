export default class CECommandGenerator
{
    public static generateCustomEvent(direct: string, type: string, value: any): CustomEvent
    {
        return new CustomEvent(direct, 
            { 
                detail: 
                {
                    Type: type,
                    Data: value
                }
            });
    }

    public static generate(direct: string, type: string, value: any): any
    {
        return { 
            Direct: direct,
            Data: 
            { 
                Type: type, 
                Data: value 
            }
        }
    }
}