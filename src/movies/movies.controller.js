const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  // TODO: Add your code here
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: `Movie cannot be found.` });
}

async function read(req, res, next) {
   // TODO: Add your code here
  res.json({ data: res.locals.movie });
}

async function list(req, res, next) {
  // TODO: Add your code here
  const is_showing = req.query.is_showing === "true";
  const data = await service.list(is_showing);
  res.json({ data });
}

async function listReviewsByMovie(req, res, next) {
  const { movieId } = req.params;
  const data = await service.listByMovie(movieId);
  res.json({ data });
}

async function listTheaterByMovie(req, res, next) {
  const { movieId } = req.params;
  const data = await service.listTheaterByMovie(movieId);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  
 listReviewsByMovie: [
   asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviewsByMovie)
 ],
  
  listTheaterByMovie: [
    asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaterByMovie)
  ],
};
