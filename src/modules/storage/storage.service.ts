export abstract class StorageService {
    abstract upload(file: Buffer, meta:{key:string,mimetype:string}): Promise<string>
    abstract get(key: string): Promise<string>
    abstract remove(key: string): Promise<boolean>
    abstract signImageUrl(key:string):string;
}