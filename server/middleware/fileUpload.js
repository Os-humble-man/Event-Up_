const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const dir = `${process.env.UPLOAD_PATH}/uploads`;
            const subDir = `${dir}/event_${file.fieldname}`;

            await fs.mkdir(dir, { recursive: true });
            await fs.mkdir(subDir, { recursive: true });

            cb(null, subDir);
        } catch (error) {
            cb(new Error(`Failed to create directory: ${error.message}`));
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fullFileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
        cb(null, fullFileName);
    },
});

module.exports = storage;
