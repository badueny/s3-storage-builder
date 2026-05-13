



### config on .env root
```env
STORAGE_DISK=minio

MINIO_ENDPOINT=http://127.0.0.1:9000
MINIO_REGION=us-east-1
MINIO_BUCKET=uploads
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_FORCE_PATH_STYLE=true
MINIO_URL=http://127.0.0.1:9000/uploads

AWS_BUCKET=prod-files
MINIO_BUCKET=local-files
```


###config App
```js
require('dotenv').config();

module.exports = {

    default: process.env.STORAGE_DISK || 'minio',

    disks: {

        minio: {

            driver: 's3',

            endpoint: process.env.MINIO_ENDPOINT,

            region: process.env.MINIO_REGION,

            bucket: process.env.MINIO_BUCKET,

            accessKeyId: process.env.MINIO_ACCESS_KEY,

            secretAccessKey: process.env.MINIO_SECRET_KEY,

            forcePathStyle:
                process.env.MINIO_FORCE_PATH_STYLE === 'true',

            url: process.env.MINIO_URL

        }

    }

};
```

---

### call dari app
```js
const Storage = require('storage-builder');
const S3Driver = require('storage-builder-s3');

const storageConfig = require('./config/storage');

Storage.extend('s3', S3Driver);

Storage.config(storageConfig);
```

---

### Pemakaian
```js
await Storage
    .disk('minio')
    .folder('wisata')
    .randomName()
    .upload(req.file);
```

### feedback URL
```js
url:
    process.env.MINIO_URL ||
    `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}`
```