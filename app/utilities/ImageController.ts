import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    GetObjectCommandInput,
    S3ClientConfig,
    paginateListObjectsV2,
    ListObjectsV2CommandInput,
    S3PaginationConfiguration,
    S3ServiceException,
    NoSuchKey,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import S3Image from "../types/S3Image";

export default class ImageController {
    private region: string;
    private bucketName: string;
    private s3Client: S3Client;

    constructor() {
        try {
            this.checkEnvVariables();
        } catch (error) {
            console.log(`Error: ${error}`);
        }
        this.region = process.env.AWS_REGION!;
        this.bucketName = process.env.AWS_BUCKET_NAME!;
        const config: S3ClientConfig = {
            region: this.region,
            credentials: {
            accessKeyId: process.env.AWS_ACCESSKEYID!,
            secretAccessKey: process.env.AWS_SECRETACCESSKEY!,
            },
        };
        this.s3Client = new S3Client(config);
    }

    private checkEnvVariables(): void {
        if (
            !(typeof process.env.AWS_REGION === "string") ||
            process.env.AWS_REGION === ""
        ) {
            throw new Error("Not a valid AWS region");
        }

        if (
            !(typeof process.env.AWS_BUCKET_NAME === "string") ||
            process.env.AWS_BUCKET_NAME === ""
        ) {
            throw new Error("Not a valid AWS bucket name");
        }

        if (
            !(typeof process.env.AWS_ACCESSKEYID === "string") ||
            process.env.AWS_ACCESSKEYID === ""
        ) {
            throw new Error("Not a valid AWS access key ID");
        }

        if (
            !(typeof process.env.AWS_SECRETACCESSKEY === "string") ||
            process.env.AWS_SECRETACCESSKEY === ""
        ) {
            throw new Error("Not a valid AWS secret access key");
        }
    }

    public async getFileList(pageSize: string) {
        const paginationConf: S3PaginationConfiguration = {
            client: this.s3Client,
            pageSize: Number.parseInt(pageSize),
        };

        const input: ListObjectsV2CommandInput = {
            Bucket: this.bucketName,
        };

        const images = [];

        try {
            const paginator = paginateListObjectsV2(paginationConf, input);
            for await (const page of paginator) {
                const pageImages = await Promise.all(
                    page.Contents?.map(async (o) => await this.generateImageData(o)) || []
                );
                images.push(...pageImages);
                // images.push(page.Contents?.map(async (o) => this.generateImageData(o)));
            }
            console.log("images",images);
            return images;
        } catch (error) {
            if (error instanceof S3ServiceException) {
                console.log(error.message);
            }
        }
    }


    public async getFile(key: string) {
        const input: GetObjectCommandInput = {
            Bucket: this.bucketName,
            Key: key,
        };

        const command = new GetObjectCommand(input);

        try {
            const reponse = await this.s3Client.send(command);
            const imageBytes = reponse.Body?.transformToByteArray();
            return imageBytes;
        } catch (error) {
            if (error instanceof NoSuchKey) {
                console.log(`Error while accessing item ${key} from bucket ${this.bucketName}`);
            }
        }
    }

    private async generateImageData(o: any): Promise<S3Image>{
        try {
            
            const input: GetObjectCommandInput = {
                Bucket: this.bucketName,
                Key: o.Key,
            };
            const command = new GetObjectCommand(input);
            const signedUrl = await getSignedUrl(this.s3Client,command, { expiresIn: 3600 });
            const newImage: S3Image = {
                key: o.Key!,
                // url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${o.Key}`,
                url: signedUrl,
                size: o.Size!,
                lastModified: o.LastModified!
            }
            return newImage;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async uploadFile() {}
}
