export interface StorageNode 
{
    Id: string;

    Value: Node;

    Parent: Node;

    IsBlocked?: boolean;
}