/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet"); 
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8070;

// Disable the X-Powered-By header
app.disable('x-powered-by');

// Define allowed origins
const allowedOrigins = ['http://localhost:3000'];
const URL = process.env.MONGODB_URL;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

mongoose.connect(URL, {
  useNewUrlParser: true,
});

app.use("/user", require("./routes/userRoutes"));
app.use("/game", require("./routes/gameRoutes"));
app.use("/translate", require("./routes/translateRoutes.js"));
app.use("/bookmark", require("./routes/bookmarkRoutes.js"));

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb Connection success!");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
