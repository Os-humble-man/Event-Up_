const DatabaseManager = require("../_core/DatabaseManager")
const { logger } = require("../_core/Logger")
const HttpStatus = require("../utils/HttpStatus")


const db = DatabaseManager.getInstance().getPool()

const UserRepository = {
    async login(username, password) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const query = `
            SELECT * FROM users WHERE username = ?
            `;
            const [rows] = await connection.query(query, [username]);            

            await connection.commit();

            if (rows.length > 0) {
                const user = rows[0];
                let passWordMatch;

                const isPasswordHashed = user.password.startsWith("$2b$");

                if (isPasswordHashed) {
                    passWordMatch = await bcrypt.compare(password, user.password);
                } else {
                    passWordMatch = user.password === password;
                }

                if (passWordMatch) {

                    // const changePasswordRequired = !isPasswordHashed || user.change_password === 1;

                    return {
                            id: user.id,
                            name: user.username,
                            // changePassword: changePasswordRequired,
                        
                    };
                } else {
                    return {
                        message: "Username/Password doesn't match",
                    };
                }
            } else {
                return {
                    message: "Username/Password doesn't match",
                };
            }
        } catch (err) {
            logger.error(`Login failed: ${err.message}`);
            await connection.rollback();
            return {
                message: `Failed to login: ${err.message}`,
            };
        } finally {
            connection.release();
        }
    }
}

module.exports = UserRepository