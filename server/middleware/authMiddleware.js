const { logger } = require('../_core/Logger');
const AuthRepository = require('../repository/AuthRepository');

const authMiddleware = async (req, res, next) => {
	try {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
			throw logger.error('Missing or wrong Authorization request header');
		}

		const accessToken = authorizationHeader
			.replace(/Bearer/gi, '')
			.replace(/ /g, '');

		let credentials = {};

		try {
			credentials = await AuthRepository.verify(accessToken);
		} catch (error) {
			if (error.name === 'TokenExpiredError') {
				credentials = await AuthRepository.decode(accessToken);
				logger.warn(`TokenExpiredError: userId ${credentials.id}`);
			} else {
				logger.error(error.message)
			}
		}
		console.log(credentials);
		

		req.auth = {
			id: credentials.id,
			name: credentials.name,
			roleId: credentials.roleId,
			artifacts: { accessToken },
		};

		next();
	} catch (error) {
		logger.error(`Token: ${error.message}`)
	}
};

module.exports = { authMiddleware };
