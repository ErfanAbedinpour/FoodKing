import { DynamicModule, Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { S3Storage } from "./s3-storage.service";
import { Directory } from "./enum/directory.enum";

@Module({ })
export class StorageModule{
    static register(options:{directory:Directory}):DynamicModule{
        return {
            module:StorageModule,
            providers:[
                {
                    provide:StorageService,
                    useClass:S3Storage
                },
                {
                    provide:"storedDirectory",
                    useValue:options.directory
                }
            ],
            exports:[StorageService]
        }
    }
}