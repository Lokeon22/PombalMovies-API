const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;
    const database = await sqliteConnection();

    const checkUserEmail = await database.get(
      `SELECT * FROM users WHERE email = (?)`,
      [email]
    );

    if (checkUserEmail) {
      throw new AppError("Esse email já está sendo utilizado");
    }

    const criptoUser = await hash(req.body.password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, criptoUser]
    );

    if (!name) {
      throw new AppError("Favor insira um nome");
    }

    res.send({ status: "Conta cadastrada" });
  }

  async update(req, res) {
    const { name, email, password, oldpassword } = req.body;
    const user_id = req.user.id;
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuario não encontrado");
    }

    const verifEmailExist = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (verifEmailExist && verifEmailExist.id !== user.id) {
      throw new AppError("Email já cadastrado");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !oldpassword) {
      throw new AppError("Favor informar a senha antiga");
    }

    if (password && oldpassword) {
      const verifiPassword = await compare(oldpassword, user.password);

      if (!verifiPassword) {
        throw new AppError("Senha antiga incorreta");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      `UPDATE users SET name = (?), email = (?), password = (?), updated_at = DATETIME('NOW') WHERE id = (?)`,
      [user.name, user.email, user.password, user_id]
    );

    return res.json({ status: "Conta atualizada" });
  }
}

module.exports = UserController;
