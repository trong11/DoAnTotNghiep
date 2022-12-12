const express = require('express');
require('express-async-errors');

const userRouter = require('./routes/user');
const actorRouter = require('./routes/actor');
const movieRouter = require('./routes/MovieRoute');
const reviewRouter = require('./routes/review');
const directorRouter = require('./routes/director');
const writerRouter = require('./routes/writer');
const adminRouter = require('./routes/admin');

require('dotenv').config();
require("./db");

const morgan = require('morgan');
const {errorHandler} = require("./middleware/error");
const cors = require('cors');
const {handleNotFound} = require("./utils/helper");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.use("/api/user",userRouter);
app.use("/api/actor",actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/director", directorRouter);
app.use("/api/writer", writerRouter);
app.use("/api/admin", adminRouter);

app.use("/*", handleNotFound);
app.use (errorHandler);

app.get("/", (req, res)=> {
    res.send("<h1> Hello world </h1>");
})

app.listen(8000);