import { API_URL } from "./modules/constants.js";
import { languages } from "../data/messenger.js";

const socket = io("https://helpukraineapp.netlify.app:5510");
const messageContainer = document.querySelector(".messages-container");
const messageForm = document.querySelector(".send-container");
const messageInput = document.querySelector(".chat-send");
const userNameEl = document.querySelector("#user-name");
const userImageEl = document.querySelector(".img-profile");

socket.on("chat-message", (data) => {
  appendMessage(`${data.message}`);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`${message}`, "owner");
  socket.emit("send-chat-message", message);
  messageInput.value = "";
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

function appendMessage(message, type) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("single-message");

  if (type == "owner") {
    messageElement.id = "chat-owner";
  }
  const textElement = document.createElement("p");
  textElement.classList.add("chat-p");
  textElement.innerText = message;
  messageElement.append(textElement);

  messageContainer.append(messageElement);
}

const activeUserName = document.querySelector("#user-name");

const getData = async () => {
  try {
    const userData = await (
      await fetch(API_URL + "/images/" + localStorage.getItem("user"))
    ).json();

    const data = await (
      await fetch(API_URL + `/users/${localStorage.getItem("user")}`)
    ).json();

    userNameEl.textContent = data.name_surname;
    userImageEl.src = userData.img;
  } catch (error) {
    console.log(error);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  getData();
});

const elements = document.querySelectorAll("[lang]");

const changeLanguage = (lang) => {
  let entry = "";
  let i = 0;
  switch (lang) {
    case "lt":
      entry = languages.lt;
      break;
    case "en":
      entry = languages.en;
      break;
    case "ua":
      entry = languages.ua;
      break;
  }

  for (const [key, value] of Object.entries(entry)) {
    let el = elements[i];
    if (el.tagName.toLowerCase() == "input") {
      if (el.type == "submit") {
        el.value = value;
        i++;
      } else {
        el.placeholder = value;
        i++;
      }
    } else if (el.tagName.toLowerCase() == "textarea") {
      el.placeholder = value;
      i++;
    } else {
      el.textContent = value;
      i++;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let storageLang = localStorage.getItem("languageSet");
  if (storageLang) {
    changeLanguage(storageLang);
  } else {
    changeLanguage("lt");
  }
});
