const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const STATIC_PATH = path.join(__dirname, "../public");

// Set static directory to serve
app.use(express.static(STATIC_PATH));

io.on("connection", () => {
  console.log("New WebSocket connection");
});

app.get("", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
