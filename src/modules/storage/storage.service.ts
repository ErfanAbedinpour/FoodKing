export abstract class StorageService{
    abstract upload():Promise<string>
    abstract get():Promise<string>
    abstract remove():Promise<boolean>
}