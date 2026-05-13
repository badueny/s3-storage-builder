class DriverInterface {

    async upload() {
        throw new Error('upload() not implemented');
    }

    async put() {
        throw new Error('put() not implemented');
    }

    async get() {
        throw new Error('get() not implemented');
    }

    async delete() {
        throw new Error('delete() not implemented');
    }

    async exists() {
        throw new Error('exists() not implemented');
    }

    url() {
        throw new Error('url() not implemented');
    }

    async temporaryUrl() {
        throw new Error('temporaryUrl() not implemented');
    }

}

module.exports = DriverInterface;
