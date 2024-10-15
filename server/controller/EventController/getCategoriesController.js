const { logger } = require("../../_core/Logger")
const EventRepository = require("../../repository/EventRepository")

const getCategoriesController = async (req, res) => {
    // console.log(req);
    
    try {

        const result = await EventRepository.getCategory()
        res.status(200).json({ msg: "Event added successfully", result })
    } catch (error) {
        logger.error(`Failed to add event : ${error.message}`)
        // res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err: error.message })
    }
}

module.exports = getCategoriesController