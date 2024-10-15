const { Router } = require("express");
// const { authMiddleware } = require("../middleware/authMiddleware");

const loginController = require("../controller/UserController/login");

const userRoutes = Router();
userRoutes.post("/user/login", loginController);

module.exports = { userRoutes };