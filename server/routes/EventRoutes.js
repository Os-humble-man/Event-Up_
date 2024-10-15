const { Router } = require("express");
const addEventController = require("../controller/EventController/AddEventController");
const getEventController = require("../controller/EventController/getEventController");
const getCategoriesController = require("../controller/EventController/getCategoriesController");

const eventRoutes = Router();


eventRoutes.post("/event/AddEvent", addEventController);

eventRoutes.get("/event/list", getEventController);
eventRoutes.get("/event/categories", getCategoriesController);

module.exports = { eventRoutes };
