const { logger } = require("../../_core/Logger")
const EventRepository = require("../../repository/EventRepository")

const getEventController = async (req, res) => {
    

    try {
        const result = await EventRepository.getEvents();
        // res.status(HttpStatus.CREATED).json(tickets)
        res.status(200).json({ msg: "Event added successfully", result })
    } catch (error) {
        logger.error(`Failed to get event event list: ${error.message}`)
        // res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ err: error.message })
    }
}

module.exports = getEventController