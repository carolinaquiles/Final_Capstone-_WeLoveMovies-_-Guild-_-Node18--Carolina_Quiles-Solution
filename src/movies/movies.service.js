const Knex = require("../db/connection");

async function list(is_showing) {
  return Knex("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movieId) {
  // TODO: Add your code here
  return Knex("movies")
    .select("*")
    .where({ movie_id: movieId })
    .first();
}

async function listByMovie(movieId) {
  return Knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then((reviews) =>
      reviews.map((review) => ({
        ...review,
        critic: {
          critic_id: review.critic_id,
          preferred_name: review.preferred_name,
          surname: review.surname,
          organization_name: review.organization_name,
        },
      }))
    );
}

async function listTheaterByMovie(movieId) {
  return Knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*")
    .where({ "mt.movie_id": movieId });
}


module.exports = {
  list,
  read,
  listByMovie,
  listTheaterByMovie,
};
