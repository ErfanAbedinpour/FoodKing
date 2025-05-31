import { StorageService } from "./storage.service";

export class S3Storage implements StorageService{
    async get(): Promise<string> {
        return ""
    }

    async remove(): Promise<boolean> {
        return  true; 
    }


    async upload(): Promise<string> {
        return ""
    }
}