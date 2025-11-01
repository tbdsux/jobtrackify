import { env } from '$env/dynamic/private';
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
	region: env.B2_REGION,
	endpoint: env.B2_S3_ENDPOINT,
	credentials: {
		accessKeyId: env.B2_APPLICATION_KEY_ID,
		secretAccessKey: env.B2_APPLICATION_KEY
	}
});
