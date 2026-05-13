const fs = require('fs');
const path = require('path');

const DriverInterface =
    require('../contracts/DriverInterface');

const normalizeFile =
    require('../helpers/normalizeFile');

const randomName =
    require('../helpers/randomName');

const detectMime =
    require('../helpers/mime');

const buildPath =
    require('../helpers/path');

class LocalDriver extends DriverInterface {

    constructor(config = {}) {

        super();

        this.config = config;

        this.root =
            config.root || './storage';

        this.baseUrl =
            config.url || '/storage';

    }

    async upload(file, options = {}) {

        file = normalizeFile(file);

        let filename =
            options.filename || file.filename;

        if (options.randomName) {
            filename = randomName(filename);
        }

        const relativePath = buildPath(
            options.folder,
            filename
        );

        const fullPath = path.join(
            this.root,
            relativePath
        );

        fs.mkdirSync(
            path.dirname(fullPath),
            {
                recursive: true
            }
        );

        if (Buffer.isBuffer(file.body)) {

            fs.writeFileSync(
                fullPath,
                file.body
            );

        } else {

            const writer =
                fs.createWriteStream(fullPath);

            file.body.pipe(writer);

            await new Promise((resolve, reject) => {

                writer.on('finish', resolve);

                writer.on('error', reject);

            });

        }

        return {
            driver: 'local',
            path: relativePath,
            filename,
            mime:
                file.mime ||
                detectMime(filename),
            url: this.url(relativePath)
        };

    }

    async put(filepath, content) {

        const fullPath = path.join(
            this.root,
            filepath
        );

        fs.mkdirSync(
            path.dirname(fullPath),
            {
                recursive: true
            }
        );

        fs.writeFileSync(fullPath, content);

        return true;

    }

    async get(filepath) {

        const fullPath = path.join(
            this.root,
            filepath
        );

        return fs.readFileSync(fullPath);

    }

    async delete(filepath) {

        const fullPath = path.join(
            this.root,
            filepath
        );

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        return true;

    }

    async exists(filepath) {

        const fullPath = path.join(
            this.root,
            filepath
        );

        return fs.existsSync(fullPath);

    }

    url(filepath) {

        return `${this.baseUrl}/${filepath}`;

    }

    async temporaryUrl(filepath) {

        return this.url(filepath);

    }

    async healthCheck() {

        return fs.existsSync(this.root);

    }

}

module.exports = LocalDriver;
