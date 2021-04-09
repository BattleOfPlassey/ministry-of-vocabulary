
require('dotenv');

module.exports = {
    jwtSecret: process.env.JWTSECRET,
    mongodburi: process.env.mongodburi
};