const { Upload } = require('@aws-sdk/lib-storage');

module.exports = async function multipartUpload(
    client,
    params
) {

    const upload = new Upload({
        client,
        params
    });

    return await upload.done();

};
