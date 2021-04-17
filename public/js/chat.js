const socket = io();

const msgBox = document.querySelector("#msgbox");
const form = document.querySelector("#message-form");
const locationButton = document.querySelector("#send-location");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    if (error) {
      return console.log(error);
    }

    console.log("Message delivered!");
  });
});

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    socket.emit("sendLocation", { latitude, longitude }, () => {
      console.log("Location sent!");
    });
  });
});

socket.on("message", (msg) => {
  console.log(msg);
  msgBox.innerHTML = msgBox.innerHTML + "<br/>" + msg;
});
