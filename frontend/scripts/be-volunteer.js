import { API_URL } from "./modules/constants.js";
import { languages } from "../data/be-volunteer.js";

const fnameEl = document.querySelector("#name");
const fnamePreviewEl = document.querySelector("#name-preview");

const adressEl = document.querySelector("#address");
const adressElPreviewEl = document.querySelector("#address-preview");

const phoneEl = document.querySelector("#phone");
const phonePreviewEl = document.querySelector("#phone-preview");

const descEl = document.querySelector("#desc");
const descPreviewEl = document.querySelector("#desc-preview");

const typeEl = document.querySelector("#type");
const typePreviewEl = document.querySelector("#type-preview");

const imagePreviewEl = document.querySelector(".img-profile");

const languageNew = {
  lt: {},
  en: {},
  ua: {},
};

fnameEl.addEventListener("keyup", () => {
  fnamePreviewEl.textContent = fnameEl.value;
});

adressEl.addEventListener("keyup", () => {
  adressElPreviewEl.textContent = adressEl.value;
});

phoneEl.addEventListener("keyup", () => {
  phonePreviewEl.textContent = phoneEl.value;
});

descEl.addEventListener("keyup", () => {
  descPreviewEl.textContent = descEl.value;
});

typeEl.addEventListener("change", () => {
  typePreviewEl.textContent = typeEl.options[typeEl.selectedIndex].text;
});

window.addEventListener("DOMContentLoaded", () => {
  fnameEl.value = "";
  adressEl.value = "";
  phoneEl.value = "";
  descEl.value = "";
  typePreviewEl.textContent = typeEl.options[typeEl.selectedIndex].text;
});

const addPostFormElement = document.querySelector("#add-post-form");

const addPost = async (e) => {
  e.preventDefault();

  const data = await (
    await fetch(API_URL + `/users/${localStorage.getItem("user")}`)
  ).json();

  const userData = await (
    await fetch(API_URL + "/images/" + localStorage.getItem("user"))
  ).json();

  console.log(data.type);

  const post = {
    user_id: localStorage.getItem("user"),
    user_type: data.type,
    name_surname: e.target.name.value,
    address: e.target.address.value,
    description: e.target.desc.value,
    phone: e.target.phone.value,
    post_type: e.target.type.options[type.selectedIndex].value,
    image: userData.img,
  };

  if (
    !post.name_surname ||
    !post.address ||
    !post.description ||
    !post.phone ||
    !post.post_type
  ) {
    alert("Užpildykite privalomus laukus");
    return;
  }

  try {
    const data = await (
      await fetch(API_URL + "/posts", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(post),
      })
    ).json();

    if (data.message === "Post added") {
      addPostFormElement.reset();
      getData();
      alert("Skelbimas sėkmingai sukurtas!");
      window.open("https://helpukraineapp.netlify.app/pages/my-account.html?");
    } else {
      alert("Skelbimas nesukurtas, pabandykite iš naujo.");
    }
  } catch (error) {
    console.log(error);
  }
};

addPostFormElement.addEventListener("submit", addPost);

const getData = async () => {
  const userData = await (
    await fetch(API_URL + "/images/" + localStorage.getItem("user"))
  ).json();

  try {
    const data = await (
      await fetch(API_URL + `/users/${localStorage.getItem("user")}`)
    ).json();

    fnameEl.value = data.name_surname;
    fnamePreviewEl.textContent = data.name_surname;
    if (data.address) {
      adressEl.value = data.address;
      adressElPreviewEl.textContent = data.address;
    }
    if (data.phone) {
      phoneEl.value = data.phone;
      phonePreviewEl.textContent = data.phone;
    }
    if (userData.img) {
      imagePreviewEl.src = userData.img;
    }
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
