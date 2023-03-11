import { API_URL } from "./modules/constants.js";
import { languages } from "../data/edit-post.js";

const fnameEl = document.querySelector("#name");
const fnamePreviewEl = document.querySelector("#name-preview");

const addressEl = document.querySelector("#address");
const addressElPreviewEl = document.querySelector("#address-preview");

const phoneEl = document.querySelector("#phone");
const phonePreviewEl = document.querySelector("#phone-preview");

const descEl = document.querySelector("#desc");
const descPreviewEl = document.querySelector("#desc-preview");

const typeEl = document.querySelector("#type");
const typePreviewEl = document.querySelector("#type-preview");

const imagePreviewEl = document.querySelector(".img-profile");

fnameEl.addEventListener("keyup", () => {
  fnamePreviewEl.textContent = fnameEl.value;
});

addressEl.addEventListener("keyup", () => {
  addressElPreviewEl.textContent = addressEl.value;
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
  addressEl.value = "";
  phoneEl.value = "";
  descEl.value = "";
  typePreviewEl.textContent = typeEl.options[typeEl.selectedIndex].text;
});

const getData = async () => {
  try {
    const userData = await (
      await fetch(API_URL + "/images/" + localStorage.getItem("user"))
    ).json();

    const data = await (await fetch(API_URL + `/posts`)).json();

    const editPost = data.filter(
      (post) => post._id == sessionStorage.getItem("postId")
    );
    console.log(editPost);

    fnameEl.value = editPost[0].name_surname;
    fnamePreviewEl.textContent = editPost[0].name_surname;
    if (editPost[0].address) {
      addressEl.value = editPost[0].address;
      addressElPreviewEl.textContent = editPost[0].address;
    }
    if (editPost[0].phone) {
      phoneEl.value = editPost[0].phone;
      phonePreviewEl.textContent = editPost[0].phone;
    }
    if (editPost[0].post_type) {
      typeEl.value = editPost[0].post_type;
      typePreviewEl.textContent = getTypeText(editPost[0].post_type);
    }
    if (editPost[0].description) {
      descEl.value = editPost[0].description;
      descPreviewEl.textContent = editPost[0].description;
    }
    if (userData.img) {
      imagePreviewEl.src = userData.img;
    }
  } catch (error) {
    console.log(error);
  }
};

function getTypeText(type) {
  switch (type) {
    case "stay":
      return "Laikinas būstas";
    case "job":
      return "Darbo pasiūlymas";
    case "clothes":
      return "Drabužiai";
    case "food":
      return "Maistas";
    case "meds":
      return "Vaistai";
    case "other-items":
      return "Kiti daiktai";
    case "other":
      return "Kita";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  getData();
});

const btnUpdate = document.querySelector(".input-submit");

const updateUserData = async (obj) => {
  try {
    const data = await (
      await fetch(API_URL + "/posts/" + sessionStorage.getItem("postId"), {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(obj),
      })
    ).json();
    alert("Success");
  } catch (error) {
    console.log(error);
  }
};

btnUpdate.addEventListener("click", () => {
  let newObj = {
    name_surname: fnameEl.value,
    address: addressEl.value,
    phone: phoneEl.value,
    description: descEl.value,
    post_type: typeEl.value,
  };
  console.log(newObj);
  updateUserData(newObj);
  window.open("http://127.0.0.1:5500/pages/my-account.html?");
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
