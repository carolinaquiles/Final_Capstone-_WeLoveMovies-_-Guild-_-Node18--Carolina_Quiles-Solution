const Knex = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  // TODO: Write your code here
  return Knex("reviews")
    .where({ review_id: reviewId })
    .del();
}

async function list(movie_id) {
  // TODO: Write your code here
  return Knex("reviews")
    .select("*");
}

async function read(reviewId) {
  // TODO: Write your code here
  return Knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
}

async function readCritic(critic_id) {
  return Knex("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return Knex("reviews")
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

async function listByMovie(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then((reviews) => reviews.map((review) => addCritic(review)));
}

function addCritic(review) {
  return {
    ...review,
    critic: {
      critic_id: review.critic_id,
      preferred_name: review.preferred_name,
      surname: review.surname,
      organization_name: review.organization_name,
    },
  };
}


module.exports = {
  destroy,
  list,
  read,
  update,
  listByMovie,
};
