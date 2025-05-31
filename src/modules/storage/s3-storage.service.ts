import { S3Client } from "@aws-sdk/client-s3";
import { StorageService } from "./storage.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { read } from "fs";

@Injectable()
export class S3Storage implements StorageService,OnModuleInit{
    private readonly logger =new Logger(S3Storage.name)
    private s3Client:S3Client
    private bucketName = process.env.S3_BUCKET;
    onModuleInit() {
        this.logger.log("Tryingto Connect to Storage")

        this.s3Client = new S3Client({
            endpoint:`https://${process.env.S3_END_POINT}`,
            forcePathStyle:true,
            credentials:{
                accessKeyId:process.env.S3_ACCESS_KEY,
                secretAccessKey:process.env.S3_SECRET_KEY
            },
            region:"ir"
        })

        this.logger.log("Connected successfully")
    }
//     constructor(){
//    }
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