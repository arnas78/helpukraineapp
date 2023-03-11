import { API_URL } from "./modules/constants.js";
import { languages } from "../data/posts.js";

const postsContainer = document.querySelectorAll(".container-posts");
const postsContainerEl = document.querySelector(".container-posts");
const postDetailsContainer = document.querySelector(".container-details");
const mainContainer = document.querySelector("main");
const btnClose = document.querySelector(".btn-close");
const detailsBackground = document.querySelector(".details-background");
const btnContainerEl = document.querySelector(".container-btn");
const detailsUserType = document.querySelector("#user-type");
const detailsUserName = document.querySelector("#details-name");
const detailsUserPhone = document.querySelector("#details-phone");
const detailsUserAddress = document.querySelector("#details-address");
const detailsPostType = document.querySelector("#post-type");
const detailsPostDesc = document.querySelector("#post-desc");
const sortTypeSelectEl = document.querySelector("#type-sort");
const sortUserTypeSelectEl = document.querySelector("#user-type-sort");
let imagePreviewEl = document.querySelector(".img-profile");
let sortType = "any";
let sortUserType = "any";

postsContainer.forEach((post) => {
  post.addEventListener("click", () => {
    postDetailsContainer.classList.add("right-0");
    mainContainer.classList.add("blur");
    detailsBackground.classList.add("background-active");
    btnClose.classList.remove("opacity-none");
  });
});

btnClose.addEventListener("click", () => {
  postDetailsContainer.classList.remove("right-0");
  mainContainer.classList.remove("blur");
  detailsBackground.classList.remove("background-active");
  btnClose.classList.add("opacity-none");
});

detailsBackground.addEventListener("click", () => {
  postDetailsContainer.classList.remove("right-0");
  mainContainer.classList.remove("blur");
  detailsBackground.classList.remove("background-active");
  btnClose.classList.add("opacity-none");
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    postDetailsContainer.classList.remove("right-0");
    mainContainer.classList.remove("blur");
    detailsBackground.classList.remove("background-active");
    btnClose.classList.add("opacity-none");
  }
});

const getData = async (type, userType) => {
  try {
    const data = await (await fetch(API_URL + "/posts")).json();

    showPosts(data, type, userType);
  } catch (error) {
    console.log(error);
  }
};

let arr = [];

const changePostData = (post) => {
  detailsUserType.textContent =
    post.user_type == "volunteer" ? "Noriu padėti!" : "Ieškau pagalbos!";
  detailsUserName.textContent = post.name_surname;
  detailsUserPhone.textContent = post.phone;
  detailsUserAddress.textContent = post.address;
  detailsPostType.textContent = getTypeText(post.post_type);
  detailsPostDesc.textContent = post.description;
  imagePreviewEl.src = post.image;
};

const clearPosts = () => {
  while (postsContainerEl.firstElementChild) {
    postsContainerEl.removeChild(postsContainerEl.firstElementChild);
  }
};

async function loadPicture(e) {
  const userId = localStorage.getItem("user");

  try {
    const data = await (await fetch(API_URL + "/images/" + userId)).json();

    if (data.img) {
      document.querySelector("#display-image").src = data.img;
    }
  } catch (error) {
    console.log(error);
  }
}

const showPosts = async (postsArray, type, userType) => {
  const loggedInUserId = localStorage.getItem("user");

  const newPosts = loggedInUserId
    ? postsArray.filter((post) => post.userId !== loggedInUserId)
    : postsArray;

  let posts = [];
  if (userType != "any") {
    posts = newPosts.filter((post) => post.user_type == userType);
  } else {
    posts = newPosts;
  }

  // const data = await (await fetch(API_URL + "/images/" + userId)).json();

  posts.forEach((post) => {
    if (type == "any") {
      postCreate(post);
    } else if (post.post_type == type) {
      postCreate(post);
    }
  });

  function postCreate(post) {
    const postContainer = document.createElement("div");

    const pEl1 = document.createElement("p");
    const pEl2 = document.createElement("p");
    const pEl3 = document.createElement("p");

    const imageContainer = document.createElement("div");
    const imageEl = document.createElement("img");
    imageEl.classList.add("img-profile");
    imageEl.src = post.image;
    imageContainer.append(imageEl);

    const textContainer = document.createElement("div");
    textContainer.classList.add("container-text");

    const spanEl1 = document.createElement("span");

    pEl1.append(spanEl1);
    pEl1.textContent = post.name_surname;

    const spanEl2 = document.createElement("span");
    spanEl2.classList.add("text-bold");
    spanEl1.textContent = "Vieta:";
    pEl2.append(spanEl2);
    pEl2.textContent = post.address;
    const spanEl3 = document.createElement("span");
    spanEl3.classList.add("text-bold");
    spanEl1.textContent = pEl3.append(spanEl3);
    pEl3.textContent = getTypeText(post.post_type);
    textContainer.append(pEl1, pEl2, pEl3);

    const arrowContainer = document.createElement("div");
    const spanEl4 = document.createElement("span");
    const iEl = document.createElement("i");
    arrowContainer.classList.add("container-arrow");
    iEl.classList.add("fa-solid", "fa-chevron-right");
    spanEl4.append(iEl);
    arrowContainer.append(spanEl4);

    if (post.user_type == "volunteer") {
      postContainer.classList.add("blue");
    } else {
      postContainer.classList.add("yellow");
    }
    postContainer.classList.add("single-post");
    postContainer.append(imageContainer, textContainer, arrowContainer);

    postContainer.addEventListener("click", () => {
      sessionStorage.clear();
      sessionStorage.setItem("chatUser", post.userId);
      changePostData(post);
    });

    arr.push(postContainer);
  }

  const length = arr.length;

  if (length == 0) {
    const noPostsInfoEl = document.createElement("h1");
    noPostsInfoEl.textContent = "ŠIUO METU JOKIŲ SKELBIMŲ NĖRA";
    noPostsInfoEl.classList.add("no-posts");
    postsContainerEl.append(noPostsInfoEl);

    // while (btnContainerEl.firstElementChild) {
    //   btnContainerEl.removeChild(btnContainerEl.firstElementChild);
    // }
    // loadButtonEl.remove();
  }
  // else if (length < 4 && length != 0) {
  //   while (btnContainerEl.firstElementChild) {
  //     btnContainerEl.removeChild(btnContainerEl.firstElementChild);
  //   }
  // } else if (
  //   length != 0 &&
  //   length > 3 &&
  //   btnContainerEl.childElementCount == 0
  // ) {
  //   console.log(
  //     "kiekis: " + length + " el kiekis " + btnContainerEl.childElementCount
  //   );
  //   console.log("xd");
  //   const buttonEl = document.createElement("button");
  //   buttonEl.classList.add("btn", "btn-load");
  //   buttonEl.textContent = "Daugiau";
  //   btnContainerEl.append(buttonEl);
  // }

  for (let i = 0; i < length; i++) {
    postsContainerEl.append(arr[0]);
    arr.shift(arr[0]);
  }
};

const containerAddNewEl = document.querySelector(".container-add-new");

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("user")) {
    const buttonEl = document.createElement("button");
    buttonEl.classList.add("btn", "btn-add");
    const aEl = document.createElement("a");
    aEl.href = window.location.href.includes("pages")
      ? "./be-volunteer.html"
      : "./pages/be-volunteer.html";

    if (localStorage.getItem("languageSet")) {
      if (localStorage.getItem("languageSet") == "lt") {
        aEl.textContent = "+ Pridėti naują skelbimą";
      } else if (localStorage.getItem("languageSet") == "en") {
        aEl.textContent = "+ NEW POST";
      } else {
        aEl.textContent = "+ НОВИЙ ПОСТ";
      }
    }

    buttonEl.append(aEl);
    containerAddNewEl.append(buttonEl);
  }
});

document.addEventListener("DOMContentLoaded", getData("any", "any"));

// const loadButtonEl = document.querySelector(".btn-load");

// loadButtonEl.addEventListener("click", () => {
//   let length = arr.length;
//   if (length > 0) {
//     for (let i = 0; i < length; i++) {
//       if (i > 2) break;
//       postsContainerEl.append(arr[0]);
//       arr.shift(arr[0]);
//       if (arr.length == 0) {
//         loadButtonEl.remove();
//       }
//     }
//   }
// });

sortTypeSelectEl.addEventListener("change", () => {
  clearPosts();
  sortType = sortTypeSelectEl.value;
  getData(sortType, sortUserType);
});

sortUserTypeSelectEl.addEventListener("change", () => {
  clearPosts();
  sortUserType = sortUserTypeSelectEl.value;
  getData(sortType, sortUserType);
});

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

const btnHelpEl = document.querySelector(".btn-help");

btnHelpEl.addEventListener("click", () => {
  document.location.href =
    "http://127.0.0.1:5500/frontend/pages/messenger.html";
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
