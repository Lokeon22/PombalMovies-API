const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class AvatarController {
  async update(req, res) {
    const user_id = req.user.id;
    const avatarFilename = req.file.filename;

    const user = await knex("users").where({ id: user_id }).first();

    const diskStorage = new DiskStorage();

    if (!user) {
      throw new AppError("Usuario não existe");
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    await knex("users").update(user).where({ id: user_id });

    return res.json(user);
  }
}

module.exports = AvatarController;
