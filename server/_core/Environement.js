const dotenv = require('dotenv');
const { existsSync } = require('fs');

dotenv.config({
    path: process.env.NODE_ENV === 'production'
        ? '.env'
        : existsSync(`.env.${process.env.NODE_ENV}.local`)
            ? `.env.${process.env.NODE_ENV}.local`
            : `.env.development.local`,
});

const environments = ['development', 'production', 'test'];

const environment = (defaultValue = 'development') => {
    let env = process.env.NODE_ENV;

    if (!env) {
        env = process.env.NODE_ENV = defaultValue;
    }

    if (!environments.includes(env)) {
        throw new TypeError(`Invalid value for NODE_ENV variable. Accepted values are: ${environments.join(' | ')}.`);
    }

    return env;
};

const envString = (variable, defaultValue) => {
    const value = process.env[variable] || defaultValue;

    if (value == null) {
        throw new TypeError(`Required environment variable ${variable} is undefined and has no default`);
    }

    return value;
};

const envNumber = (variable, defaultValue) => {
    const value = Number(process.env[variable]) || defaultValue;

    if (value == null) {
        throw new TypeError(`Required environment variable ${variable} is undefined and has no default`);
    }

    return value;
};

module.exports = { environment, envString, envNumber };
