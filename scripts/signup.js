import { API_URL } from "./modules/constants.js";
import { languages } from "../data/signup.js";

// Variables
const signupFormElement = document.querySelector("#signup-form");
const checkboxElement = document.querySelector("input[name=checkbox]");
const body = document.querySelector("body");

let userType = "volunteer";

document.addEventListener("DOMContentLoaded", () => {
  checkboxElement.checked = false;
  body.classList.remove("background-yellow");
  body.classList.add("background-blue");
});

checkboxElement.addEventListener("change", function () {
  if (this.checked) {
    body.classList.remove("background-blue");
    body.classList.add("background-yellow");
    userType = "seeker";
  } else {
    body.classList.remove("background-yellow");
    body.classList.add("background-blue");
    userType = "volunteer";
  }
});

const signupUser = async (e) => {
  e.preventDefault();

  const user = {
    name_surname: e.target.signup_name_surname.value,
    email: e.target.signup_email.value,
    password: e.target.signup_password.value,
    phone: "",
    address: "",
    type: userType,
  };

  if (!user.name_surname || !user.email || !user.password) {
    alert("Užpildykite visus laukus");
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
signupFormElement.addEventListener("submit", signupUser);

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
