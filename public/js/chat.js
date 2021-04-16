const socket = io();

const msgBox = document.querySelector("#msgbox");

const form = document
  .querySelector("#message-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const message = e.target.elements.message.value;

    socket.emit("sendMessage", message);
  });

socket.on("message", (msg) => {
  msgBox.innerText += msg;
});
