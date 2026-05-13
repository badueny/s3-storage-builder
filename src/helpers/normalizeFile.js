const fs = require('fs');

module.exports = function normalizeFile(file) {

    if (Buffer.isBuffer(file)) {

        return {
            body: file,
            filename: 'file.bin',
            size: file.length
        };

    }

    if (typeof file === 'string') {

        return {
            body: fs.createReadStream(file),
            filename: file.split('/').pop()
        };

    }

    if (file.buffer) {

        return {
            body: file.buffer,
            filename: file.originalname,
            mime: file.mimetype,
            size: file.size
        };

    }

    if (file.stream) {

        return {
            body: file.stream,
            filename: file.originalname || 'stream.bin',
            mime: file.mimetype
        };

    }

    return file;

};