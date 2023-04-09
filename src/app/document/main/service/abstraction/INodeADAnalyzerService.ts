import IService from "../../../../../framework/service/abstraction/IService";

export default interface INodeADAnalyzerService extends IService
{
    handle(node: Node): void;
}