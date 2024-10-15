const { logger } = require("../../_core/Logger");
const EventRepository = require("../../repository/EventRepository");
const storage = require("../../middleware/fileUpload");
const multer = require("multer");

const upload = multer({ storage: storage }).fields([
    { name: 'cover', maxCount: 1 },
    { name: 'eventImages', maxCount: 10 }
]);

const addEventController = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                logger.error(`Failed to upload files: ${err.message}`);
                return res.status(500).json({ err: 'File upload failed' });
            }

            // Traiter l'image de couverture
            const coverPath = req.files['cover'] ? req.files['cover'][0].destination + '/' + req.files['cover'][0].filename : null;

            const results = await EventRepository.addEvent(req.body, coverPath);

            if (results.affectedRows > 0 && req.files['eventImages']) {
                // Traiter les images de l'événement
                const imagePaths = req.files['eventImages'].map((file) => file.destination + '/' + file.filename);
                await Promise.all(imagePaths.map(filePath => EventRepository.addImage(results.insertId, filePath)));
            }

            res.status(200).json({ msg: "Event added successfully", success: true });
        });
    } catch (error) {
        logger.error(`Failed to add event: ${error.message}`);
        res.status(500).json({ err: error.message });
    }
};

module.exports = addEventController;
