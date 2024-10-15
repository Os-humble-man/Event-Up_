const jwt = require("jsonwebtoken");
const { config } = require("../_core/config");

const AuthRepository = {
    async decode(token) {
        try {
            return jwt.decode(token);
        } catch (err) {
            throw new Error(`Failed to decode token: ${err.message}`);
        }
    },

    async verify(token) {
        try {
            return jwt.verify(token, config.jwtSecretKey);
        } catch (err) {
            throw new Error(`Failed to verify token: ${err.message}`);
        }
    },

    async generate(payload) {
        try {
            const token = jwt.sign(payload, config.jwtSecretKey, { expiresIn: '1d' });
            return token;
        } catch (err) {
            throw new Error(`Failed to generate token: ${err.message}`);
        }
    }
};

module.exports = AuthRepository;
