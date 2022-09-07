const knex = require("../database/knex");

class MovieTagNameController {
  async index(req, res) {
    const user_id = req.user.id;

    const nameTag = await knex("movieTags").where({ user_id }).groupBy("name");

    res.json(nameTag);
  }
}

module.exports = MovieTagNameController;
