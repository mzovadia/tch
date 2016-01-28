exports.server = {
    port: process.env.PORT || 8080
};

var env = exports.env = process.env.NODE_ENV || 'development';

exports.rootUrl = env == 'development' ? 'http://dev.tch.usdigitalpartners.net' : 'http://www.thechristhospital.com';
exports.usingLESS = false;
