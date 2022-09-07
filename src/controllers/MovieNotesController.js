const knex = require("../database/knex");

class MovieNotesController {
  async create(req, res) {
    const { title, description, rating, name } = req.body;
    const user_id = req.user.id;

    const movienotes_id = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id,
    });

    await knex("movieTags").insert({
      name,
      user_id,
      note_id: movienotes_id,
    });

    res.json({ status: "Nota criada" });
  }

  async show(req, res) {
    const { id } = req.params;

    const showNotes = await knex("movieNotes").where({ id }).first();
    const tags = await knex("movieTags").where({ note_id: id }).orderBy("name");

    res.json({
      ...showNotes,
      tags,
    });
  }

  async index(req, res) {
    const { title } = req.query;
    const user_id = req.user.id;

    const index = await knex("movieNotes")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title");
    //Abaixo está sendo feito o filtro para retornar a tag relacionada ao titulo
    const movieTags = await knex("movieTags").where({ user_id });
    const movieNotesTags = index.map((note) => {
      const noteTags = movieTags.filter((tag) => tag.note_id === note.id);

      return {
        ...index,
        tags: noteTags,
      };
    });

    return res.json(movieNotesTags);
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("movieNotes").where({ id }).delete();
    await knex("movieTags").where({ note_id: id }).delete();

    res.json({ status: "Nota deletada com sucesso" });
  }
}

module.exports = MovieNotesController;
