const multer = require("multer");
const { logger } = require("../../_core/Logger");
const storage = require("../../middleware/fileUpload");
const EventRepository = require("../../repository/EventRepository");

const addEventImageController = async (req, res) => {
    try {
        await multer({ storage: storage }).array('eventImages')(req, res, async (err) => {
            if (err)
                throw new Error(err.message)

            const id = req.body.id;
            const filePaths = req.files.map((file) => file.destination + '/' + file.filename);
            const results = await Promise.all(filePaths.map(filePath => EventRepository.addImage(id, filePath)));
            const success = results.every(result => result.status === HttpStatus.OK);


        })

    } catch (error) {
        logger.error("Error adding images : ", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

module.exports = addEventImageController;
