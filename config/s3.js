import "dotenv/config";
import aws from "aws-sdk";

const region = process.env.S3_REGION;
const bucketName = process.env.S3_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
})

const s3 = new aws.S3({signatureVersion: "v4"});

async function generateImageURL() {
    let date = new Date();
    const imageName = `${date.getTime()}.jpeg`;

    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 300, // 300 seconds
        ContentType: "image/jpeg"
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return uploadURL;
}


async function generateUserImageURL() {

    const key = `user_images/${Date.now()}.jpg`; // Genera un nombre único para la imagen
    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: 300, // La URL expira en 5 minutos
        ContentType: 'image/jpeg'
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return uploadURL;
}

export { generateImageURL, generateUserImageURL};