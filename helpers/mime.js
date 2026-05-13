const mime = require('mime-types');

module.exports = function detectMime(filename) {

    return mime.lookup(filename) || 'application/octet-stream';

};
