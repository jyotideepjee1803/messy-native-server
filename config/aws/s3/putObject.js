const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./bucket-credentials");

exports.putObject = async(fileBuffer, fileName, mimetype) =>{
    try{
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName,
            Body: fileBuffer,
            ContentType: mimetype,
        }

        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);

        if(data.$metadata.httpStatusCode !== 200){
            return;
        }
        let url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
        return {url, key:params.Key};
    }catch(err){
        console.error(err);
    }
}