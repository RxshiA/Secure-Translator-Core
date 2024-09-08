const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

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
