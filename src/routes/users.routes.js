const { Router } = require("express");
const UserController = require("../controllers/UserController");
const AvatarController = require("../controllers/AvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const uploadConfig = require("../configs/upload");
const multer = require("multer");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const userController = new UserController();
const avatarController = new AvatarController();

usersRoutes.post("/", userController.create);
usersRoutes.put("/", ensureAuthenticated, userController.update);
usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  avatarController.update
); //Conecta na rota avatar, passa pelo middle, faz o upload da imagem, leva pra pasta e cadastra no banco

module.exports = usersRoutes;
