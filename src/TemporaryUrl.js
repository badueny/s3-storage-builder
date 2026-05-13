const {
    GetObjectCommand
} = require('@aws-sdk/client-s3');

const {
    getSignedUrl
} = require('@aws-sdk/s3-request-presigner');

module.exports = async function temporaryUrl(
    client,
    bucket,
    path,
    expires = 3600
) {

    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: path
    });

    return await getSignedUrl(
        client,
        command,
        {
            expiresIn: expires
        }
    );

};