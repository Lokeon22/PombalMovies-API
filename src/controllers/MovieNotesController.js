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

    // Map criado para renderizar varias tags como uma array [ ] name é a tag
    const tagsInsert = name.map((name) => {
      return {
        note_id: movienotes_id,
        user_id,
        name,
      };
    });

    await knex("movieTags").insert(tagsInsert);

    res.json({ status: "Nota criada" });
  }

  async show(req, res) {
    const { id } = req.params;

    const note = await knex("movieNotes").where({ id }).first();
    const tags = await knex("movieTags").where({ note_id: id }).orderBy("name");

    return res.json({
      ...note,
      tags,
    });
  }

  async index(req, res) {
    const { title, name } = req.query;
    const user_id = req.user.id;

    let notes;

    if (name) {
      const filterNames = name.split(",").map((tag) => tag.trim());

      notes = await knex("movieTags")
        .select(["movieNotes.id", "movieNotes.title", "movieNotes.user_id"])
        .where("movieNotes.user_id", user_id)
        .whereLike("movieNotes.title", `%${title}%`)
        .whereIn("name", filterNames)
        .innerJoin("movieNotes", "movieNotes.id", "movieTags.note_id")
        .orderBy("notes.title");
    } else {
      notes = await knex("movieNotes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }
    //Abaixo está sendo feito o filtro para retornar a tag relacionada ao titulo
    const movieTags = await knex("movieTags").where({ user_id });
    const movieNotesTags = notes.map((note) => {
      const noteTags = movieTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
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
