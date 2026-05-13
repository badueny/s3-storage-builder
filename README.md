



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

#### Upload File
```js
await storage.upload(
    './example.jpg',
    {
        folder: 'images',
        randomName: true
    }
);
```
#### Upload Buffer
```js
await storage.put(
    'files/test.txt',
    Buffer.from('Hello World'),
    'text/plain'
);
```
#### Upload Sream
```js
await storage.upload(
    req.file,
    {
        folder: 'videos',
        randomName: true
    }
);
```
#### Direct Upload
```js
await Storage
    .disk('minio')
    .folder('wisata')
    .randomName()
    .upload(req.file);
```

#### Get Object
```js
const file = await storage.get(
    'images/test.jpg'
);
```
#### Delete Object
```js
await storage.delete(
    'images/test.jpg'
);
```
#### Check File Exist
```js
const exists = await storage.exists(
    'images/test.jpg'
);
```
#### Generate URL
```js
const url = storage.url(
    'images/test.jpg'
);
```
#### Temporary URL
```js
const url = await storage.temporaryUrl(
    'images/test.jpg',
    3600
);
```
#### Health Check
```js
const ok = await storage.healthCheck();
```

---
### feedback URL
```js
url:
    process.env.MINIO_URL ||
    `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}`
```

## ✅ Instalasi

```bash
npm install github:badueny/s3-storage-builder
```
atau
```bash
npm install git+https://github.com/badueny/s3-storage-builder.git
```
