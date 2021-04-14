const path = require("path");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const STATIC_PATH = path.join(__dirname, "../public");

// Set static directory to serve
app.use(express.static(STATIC_PATH));

app.get("", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
