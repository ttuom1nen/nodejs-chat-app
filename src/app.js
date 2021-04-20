const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const STATIC_PATH = path.join(__dirname, "../public");

// Set static directory to serve
app.use(express.static(STATIC_PATH));

// socket is an object that contains information about the connection
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("message", generateMessage("Welcome to the chat!"));
  socket.broadcast.emit("message", "A new user has joined");

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.emit("message", generateMessage(message));
    callback();
  });

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    io.emit(
      "locationMessage",
      `http://google.com/maps?q=${latitude},${longitude}`
    );

    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left!"));
  });
});

app.get("", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
