import { languages } from "../data/index.js";

// Variables
const moviesContainerElement = document.querySelector("#movies-container");
const buttonNeedEl = document.querySelector("#btn-need");
const buttonJoinEl = document.querySelector("#btn-help");

// Functions
buttonNeedEl.addEventListener("click", () => {
  const loggedInUserId = localStorage.getItem("user");
  if (loggedInUserId) {
    window.location.href = "";
    window.location.href = location.href.includes("pages")
      ? "./information.html"
      : "./pages/information.html";
  } else {
    window.location.href = location.href.includes("pages")
      ? "./login.html"
      : "./pages/login.html";
  }
});

buttonJoinEl.addEventListener("click", () => {
  const loggedInUserId = localStorage.getItem("user");
  if (loggedInUserId) {
    window.location.href = "";
    window.location.href = location.href.includes("pages")
      ? "./be-volunteer.html"
      : "./pages/be-volunteer.html";
  } else {
    window.location.href = location.href.includes("pages")
      ? "./login.html"
      : "./pages/login.html";
  }
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
