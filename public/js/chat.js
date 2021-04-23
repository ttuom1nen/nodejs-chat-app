(function () {
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
  const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

  // Options
  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const autoscroll = () => {
    // New message element
    const newMessage = messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = messages.offsetHeight;

    // Height of messages container
    const containerHeight = messages.scrollHeight;

    // How far the user has scrolled
    const scrollOffset = messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
      messages.scrollTop = messages.scrollHeight;
    }
  };

  socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format("HH:mm:ss"),
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
  });

  socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationMessageTemplate, {
      username: message.username,
      url: message.url,
      createdAt: moment(message.createdAt).format("HH:mm:ss"),
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
  });

  socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
      room,
      users,
    });
    document.querySelector("#sidebar").innerHTML = html;
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

  socket.emit("join", { username, room }, (error) => {
    if (error) {
      alert(error);
      location.href = "/";
    }
  });
})();
