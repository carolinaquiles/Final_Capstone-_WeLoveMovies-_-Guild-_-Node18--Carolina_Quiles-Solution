const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
   // TODO: Write your code here
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function destroy(req, res) {
   // TODO: Write your code here
  const { review } = res.locals;
  await service.destroy(review.review_id);
  res.sendStatus(204);
}

async function list(req, res, next) {
  // TODO: Write your code here
  const { movieId } = req.params;
  const data = await service.listByMovie(movieId);
  res.json({ data });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(req, res) {
   // TODO: Write your code here
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await service.update(updatedReview);
  res.json({ data });
}

module.exports = {
  destroy: [
     noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  
//   list: [asyncErrorBoundary(list)],
  
  list: [
    hasMovieIdInPath, 
    asyncErrorBoundary(list),
  ],
  
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
