const { envNumber, envString } = require('./Environement')

const config = {
    server: {
        host: envString('HTTP_HOST', 'localhost'),
        port: envNumber('HTTP_PORT', '5500'),
    },
    mysql: {
        host: envString('DB_HOST', 'localhost'),
        port: envNumber('DB_PORT', 3306),
        user: envString('DB_USER', 'root'),
        password: envString('DB_PASSWORD', ''),
        database: envString('DB_DATABASE', 'EventUp_db'),
    },
    sms: {
        username: envString('SMS_API_Username', ''),
        password: envString('SMS_API_Password', ''),
    },
    jwtSecretKey: envString('JWT_SECRET_KEY', 'tRTZ3aBkwVlELzkyOWzlR6Gbhcp5zgCXYbNmY6LcNTWqUazrf2'),
    mail: {
        user: envString('EMAIL_ADDRESS', ''),
        pass: envString('EMAIL_PASSWORD', ''),
    }
}

module.exports = { config }