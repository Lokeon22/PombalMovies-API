const { Router } = require("express");

const MovieTagNameController = require("../controllers/MovieTagNameController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const nametagsRouter = Router();

const movietagnameController = new MovieTagNameController();

nametagsRouter.get("/", ensureAuthenticated, movietagnameController.index);

module.exports = nametagsRouter;
