module.exports = function buildPath(...paths) {

    return paths
        .filter(Boolean)
        .join('/')
        .replace(/\/+/g, '/');

};