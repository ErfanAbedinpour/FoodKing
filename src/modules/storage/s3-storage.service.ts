import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, ListBucketsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { StorageService } from "./storage.service";
import {  Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { Directory } from "./enum/directory.enum";
import { ErrorMessage } from "../../ErrorMessages/Error.enum";

@Injectable()
export class S3Storage implements StorageService,OnModuleInit{
    private readonly logger =new Logger(S3Storage.name)
    private s3Client:S3Client
    private bucketName = process.env.S3_BUCKET;
    async onModuleInit() {
        try {
            // Test the S3 connection by listing buckets
            const command = new ListBucketsCommand({});
            await this.s3Client.send(command);
            this.logger.log('Successfully connected to S3');
        } catch (error) {
            this.logger.error('Failed to connect to S3', error);
        }
    }

    constructor(@Inject("storedDirectory") private  readonly directory:Directory){
        this.s3Client = new S3Client({
            endpoint:`https://${process.env.S3_END_POINT}`,
            forcePathStyle:true,
            credentials:{
                accessKeyId:process.env.S3_ACCESS_KEY,
                secretAccessKey:process.env.S3_SECRET_KEY
            },
            region:"ir"
        })

    }

    async get(key: string): Promise<string> {
        try {
            await this.s3Client.send(new HeadObjectCommand({
                Bucket:this.bucketName,
                Key:key
            }))
            return this.signImageUrl(key);
        } catch (error) {
            this.logger.error(`file not found`, error);
            throw new NotFoundException(ErrorMessage.FILE_NOT_FOUND)
        }
    }

    private createKey(name:string){
        return `${this.directory}/${name}`
    }

    async remove(key: string): Promise<boolean> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            
            await this.s3Client.send(command);
            this.logger.log(`Successfully deleted file with key ${key}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete file with key ${key}`, error);
            throw new InternalServerErrorException()
        }
    }


    async upload(file: Buffer, meta:{key:string,mimetype:string}): Promise<string> {
        const name = this.createKey(meta.key);
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: name,
                Body: file,
                ContentType: meta.mimetype,
            });
            
            await this.s3Client.send(command);
            this.logger.log(`Successfully uploaded file with key ${name}`);
            return name; 
        } catch (error) {
            this.logger.error('Failed to upload file', error);
            throw new InternalServerErrorException()
        }
    }


    signImageUrl(key: string): string {
        return `https://${process.env.S3_END_POINT}/${this.bucketName}/${key}`;
    }
}