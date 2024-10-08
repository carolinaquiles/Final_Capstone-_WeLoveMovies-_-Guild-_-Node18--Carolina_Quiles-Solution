if (process.env.USER) require("dotenv").config();
const express = require("express");
const cors = require("cors")

const app = express();

const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");
const methodNotAllowed = require("./errors/methodNotAllowed");

// TODO: Add your code here

// Enable CORS to allow requests from the frontend
app.use(cors()); 

app.use(express.json());

// Route handlers
app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

// Method Not Allowed handler for unsupported methods
app.all("/movies", methodNotAllowed);
app.all("/reviews", methodNotAllowed);
app.all("/theaters", methodNotAllowed);


// Not found handler
app.use((req, res, next) => {
  next({ status: 404, message: `Not found: ${req.originalUrl}` });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
