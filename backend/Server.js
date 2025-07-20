require('dotenv').config(); 
const express = require("express");
const app = express();
const db = require("./db");
const cors = require('cors');


const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World Krish");
});

app.use(cors());


const userRoutes = require("./routes/UserRoute");
const notesRoutes = require("./routes/notesRoute");

app.use("/user", userRoutes);
app.use("/notes", notesRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
