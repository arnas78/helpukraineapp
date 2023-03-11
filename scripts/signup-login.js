import { API_URL } from "./modules/constants.js";
import { languages } from "../data/login.js";

// Variables
const loginFormElement = document.querySelector("#login-form");

// Funtions
const loginUser = async (e) => {
  e.preventDefault();

  const user = {
    email: e.target.login_email.value,
    password: e.target.login_password.value,
  };

  if (!user.email || !user.password) {
    alert("Please provide needed information");
    return;
  }

  try {
    const data = await (
      await fetch(API_URL + "/users/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user),
      })
    ).json();

    if (data.message === "User found") {
      localStorage.setItem("user", data.user._id);
      localStorage.setItem("username", data.user.name_surname);
      location.href = "http://127.0.0.1:5500/index.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

const signupUser = async (e) => {
  e.preventDefault();

  const user = {
    name_surname: e.target.signup_name_surname.value,
    email: e.target.signup_email.value,
    password: e.target.signup_password.value,
  };

  if (!user.name_surname || !user.email || !user.password) {
    alert("Please provide needed information");
    return;
  }

  try {
    const data = await (
      await fetch(API_URL + "/users/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user),
      })
    ).json();

    if (data.message === "User created") {
      localStorage.setItem("user", data.user._id);
      location.href = "http://127.0.0.1:5500/pages/my-account.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

// Events
loginFormElement.addEventListener("submit", loginUser);

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
