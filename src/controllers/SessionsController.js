const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("Email não existe");
    }

    const verifiPassword = await compare(password, user.password);

    if (!verifiPassword) {
      throw new AppError("Email e/ou senha incorreta");
    }

    // parte do token para autenticação
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    res.send({ user, token });
  }
}

module.exports = SessionsController;
