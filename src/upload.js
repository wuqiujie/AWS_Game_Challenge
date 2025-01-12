import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

async function uploadToS3WithCognito(audioBlob, fileName) {
    try {
        // Configure the S3 client with Cognito credentials
        const s3Client = new S3Client({
            region: process.env.REACT_APP_AWS_REGION,
            credentials: fromCognitoIdentityPool({
                client: new CognitoIdentityClient({
                    region: process.env.REACT_APP_AWS_REGION
                }),
                identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID
            })
        });

        // Convert blob to buffer
        const arrayBuffer = await audioBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate a unique file name using timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const uniqueFileName = `${timestamp}-${fileName}`;

        // Set up the parameters for upload
        const params = {
            Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
            Key: `melodies/${uniqueFileName}`,
            Body: buffer,
            ContentType: 'audio/wav',
            Metadata: {
                'original-filename': fileName,
                'timestamp': timestamp
            }
        };

        // Upload to S3
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);

        console.log(`Successfully uploaded ${uniqueFileName} to S3`);
        return {
            key: `melodies/${uniqueFileName}`,
            response
        };

    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
}

// {
//     "CORSRules": [
//         {
//             "AllowedHeaders": ["*"],
//             "AllowedMethods": ["PUT", "POST", "GET"],
//             "AllowedOrigins": ["http://localhost:3000", "your-production-domain"],
//             "ExposeHeaders": ["ETag"]
//         }
//     ]
// }


// {
//     "Version": "2012-10-17",
//     "Statement": [
//         {
//             "Effect": "Allow",
//             "Principal": {
//                 "Federated": "cognito-identity.amazonaws.com"
//             },
//             "Action": "s3:PutObject",
//             "Resource": "arn:aws:s3:::your-bucket-name/melodies/*",
//             "Condition": {
//                 "StringEquals": {
//                     "cognito-identity.amazonaws.com:aud": "your-identity-pool-id"
//                 }
//             }
//         }
//     ]
// }
