const { Router } = require("express");

const usersRouter = require("./users.routes");
const noutesRouter = require("./notes.routes");
const nametagsRouter = require("./nametags.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/notes", noutesRouter);
routes.use("/genre", nametagsRouter);
routes.use("/sessions", sessionsRouter);

module.exports = routes;
