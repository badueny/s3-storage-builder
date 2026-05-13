const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
    ListBucketsCommand
} = require('@aws-sdk/client-s3');

const DriverInterface =
    require('../contracts/DriverInterface');

const multipartUpload =
    require('../services/MultipartUpload');

const temporaryUrl =
    require('../services/TemporaryUrl');

const normalizeFile =
    require('../helpers/normalizeFile');

const randomName =
    require('../helpers/randomName');

const detectMime =
    require('../helpers/mime');

const buildPath =
    require('../helpers/path');

class S3Driver extends DriverInterface {

    constructor(config = {}) {

        super();

        this.config = config;

        this.client = new S3Client({

            endpoint: config.endpoint,

            region:
                config.region || 'us-east-1',

            forcePathStyle:
                config.forcePathStyle === true ||
                config.forcePathStyle === 'true',

            credentials: {
                accessKeyId:
                    config.accessKeyId,

                secretAccessKey:
                    config.secretAccessKey
            }

        });

    }

    bucket() {

        return this.config.bucket;

    }

    async upload(file, options = {}) {

        file = normalizeFile(file);

        let filename =
            options.filename || file.filename;

        if (options.randomName) {
            filename = randomName(filename);
        }

        const fullpath = buildPath(
            options.folder,
            filename
        );

        const mime =
            options.mime ||
            file.mime ||
            detectMime(filename);

        await multipartUpload(
            this.client,
            {
                Bucket: this.bucket(),
                Key: fullpath,
                Body: file.body,
                ContentType: mime
            }
        );

        return {
            disk: options.disk,
            driver: 's3',
            bucket: this.bucket(),
            path: fullpath,
            filename,
            mime,
            url: this.url(fullpath)
        };

    }

    async put(path, content, mime = null) {

        mime = mime || detectMime(path);

        const command = new PutObjectCommand({

            Bucket: this.bucket(),

            Key: path,

            Body: content,

            ContentType: mime

        });

        return await this.client.send(command);

    }

    async get(path) {

        const command = new GetObjectCommand({

            Bucket: this.bucket(),

            Key: path

        });

        return await this.client.send(command);

    }

    async delete(path) {

        const command = new DeleteObjectCommand({

            Bucket: this.bucket(),

            Key: path

        });

        return await this.client.send(command);

    }

    async exists(path) {

        try {

            const command = new HeadObjectCommand({

                Bucket: this.bucket(),

                Key: path

            });

            await this.client.send(command);

            return true;

        } catch (err) {

            return false;

        }

    }

    url(path) {

        const cleanPath =
            String(path)
                .replace(/^\/+/, '');

        if (this.config.url) {

            return `${this.config.url}/${cleanPath}`;

        }

        return `${this.config.endpoint}/${this.bucket()}/${cleanPath}`;

    }

    async temporaryUrl(
        path,
        expires = 3600
    ) {

        return await temporaryUrl(

            this.client,

            this.bucket(),

            path,

            expires

        );

    }

    async healthCheck() {

        try {

            await this.client.send(
                new ListBucketsCommand({})
            );

            return true;

        } catch (err) {

            console.error(err);

            return false;

        }

    }

}

module.exports = S3Driver;

