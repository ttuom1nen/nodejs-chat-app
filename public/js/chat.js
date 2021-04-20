const socket = io();

// Elements
const form = document.querySelector("#message-form");
const formInput = form.querySelector("input");
const formButton = form.querySelector("button");
const locationButton = document.querySelector("#send-location");
const messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("HH:mm:ss"),
  });
  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url) => {
  const html = Mustache.render(locationMessageTemplate, {
    url,
  });
  messages.insertAdjacentHTML("beforeend", html);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  formButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    formButton.removeAttribute("disabled");
    formInput.value = "";
    formInput.focus();

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

  locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    socket.emit("sendLocation", { latitude, longitude }, () => {
      locationButton.removeAttribute("disabled");
      console.log("Location sent!");
    });
  });
});
