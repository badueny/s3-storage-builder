const crypto = require('crypto');
const path = require('path');

module.exports = function randomName(filename = '') {

    const ext = path.extname(filename);

    return crypto.randomUUID() + ext;

};