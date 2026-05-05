import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const getS3Client = () => new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }
});

const BUCKET = () => process.env.S3_BUCKET_NAME || '';

// Upload a buffer to S3
export const uploadToS3 = async (key: string, body: Buffer, contentType: string): Promise<void> => {
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
        Bucket: BUCKET(),
        Key: key,
        Body: body,
        ContentType: contentType,
    }));
};

// Get a pre-signed download URL (expires in 1 hour)
export const getSignedDownloadUrl = async (key: string, expiresIn = 3600): Promise<string> => {
    const s3 = getS3Client();
    const command = new GetObjectCommand({ Bucket: BUCKET(), Key: key });
    return getSignedUrl(s3, command, { expiresIn });
};