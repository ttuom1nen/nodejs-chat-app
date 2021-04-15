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

let count = 0;

// socket is an object that contains information about the connection
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("countUpdated", count);

  socket.on("increment", () => {
    count++;
    // Emit to all connections
    io.emit("countUpdated", count);
  });
});

app.get("", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
