const { logger } = require('../../_core/Logger');
const AuthRepository = require('../../repository/AuthRepository');
const UserRepository = require('../../repository/UserRepository');
const HttpStatus = require('../../utils/HttpStatus');

const loginController = async (req, res) => {
    console.log(req.auth);
    
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const result = await UserRepository.login(username, password);
        
        if (result) {
            const payload = {
                id: result.id,
                name: result.name,
            };
            const accessToken = await AuthRepository.generate(payload);
            return res.status(HttpStatus.OK).json({ accessToken });
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        logger.error(`Login error: ${err.message}`);
        return res.status(500).json({ message: 'An error occurred during login ', error: err.message });
    }
};

module.exports = loginController;
