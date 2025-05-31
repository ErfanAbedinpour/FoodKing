import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { S3Storage } from "./s3-storage.service";

@Module({
    providers:[
        {
            provide:StorageService,
            useClass:S3Storage
        }
    ],
    exports:[StorageService]
})
export class StorageModule{}