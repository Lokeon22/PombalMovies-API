const { Router } = require("express");

const MovieNotesController = require("../controllers/MovieNotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const noutesRouter = Router();

const movieNotesController = new MovieNotesController();

noutesRouter.use(ensureAuthenticated);

noutesRouter.post("/", movieNotesController.create);
noutesRouter.get("/:id", movieNotesController.show);
noutesRouter.delete("/:id", movieNotesController.delete);
noutesRouter.get("/", movieNotesController.index); // Não precisa especificar pois está sendo retornado via query

module.exports = noutesRouter;
