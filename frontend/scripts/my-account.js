import { API_URL } from "./modules/constants.js";
import { languages } from "../data/my-account.js";

// Variables
const userLogoutButtonElement = document.querySelector("#user-logout-button");
const inputNameEl = document.querySelector("#name");
const emailEl = document.querySelector("#email");
const addressEl = document.querySelector("#address");
const phoneEl = document.querySelector("#phone");
const btnUpdate = document.querySelector("#btn-update");
const containerUpdate = document.querySelector(".container-update");
const postsContainerEl = document.querySelector(".container-posts");
const detailsUserType = document.querySelector("#user-type");
const detailsUserName = document.querySelector("#details-name");
const detailsUserPhone = document.querySelector("#details-phone");
const detailsUserAddress = document.querySelector("#details-address");
const detailsPostType = document.querySelector("#post-type");
const detailsPostDesc = document.querySelector("#post-desc");
const imagePreviewEl = document.querySelector(".img-profile");
const image_input = document.querySelector("#getFile");
const btnDelete = document.querySelector(".btn-delete");

// Funtions
const getUserData = async () => {
  const userId = localStorage.getItem("user");

  try {
    const data = await (await fetch(API_URL + "/users/" + userId)).json();

    const currentUserElement = document.querySelector("#current-user");

    if (localStorage.getItem("languageSet")) {
      if (localStorage.getItem("languageSet") == "lt") {
        currentUserElement.innerText = "👋 Sveiki, " + data.name_surname;
      } else if (localStorage.getItem("languageSet") == "en") {
        currentUserElement.innerText = "👋 HELLO, " + data.name_surname;
      } else {
        currentUserElement.innerText = "👋 ПРИВІТ, " + data.name_surname;
      }
    }

    inputNameEl.value = data.name_surname;
    emailEl.value = data.email;

    if (data.address) {
      addressEl.value = data.address;
    }
    if (data.phone) {
      phoneEl.value = data.phone;
    }
    // showUserMovies(data.posts);
    // showUserOrders(data.orders);
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = () => {
  localStorage.removeItem("user");
  location.href = "http://127.0.0.1:5500/frontend/index.html";
};

// Events
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("user")) {
    getUserData();
  } else {
    location.href = "http://127.0.0.1:5500/frontend/index.html";
  }
});

image_input.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").src = uploaded_image;
  });
  reader.readAsDataURL(this.files[0]);
});

const postsContainer = document.querySelectorAll(".container-posts");
const postDetailsContainer = document.querySelector(".container-details");
const mainContainer = document.querySelector("main");
const btnClose = document.querySelector(".btn-close");
const detailsBackground = document.querySelector(".details-background");

// mainContainer.addEventListener("click", () => {
//   postDetailsContainer.classList.remove("right-0");
//   mainContainer.classList.remove("blur");
// });

postsContainer.forEach((post) => {
  post.addEventListener("click", () => {
    postDetailsContainer.classList.add("right-0");
    mainContainer.classList.add("blur");
    detailsBackground.classList.add("background-active");
  });
});

btnClose.addEventListener("click", () => {
  postDetailsContainer.classList.remove("right-0");
  mainContainer.classList.remove("blur");
  detailsBackground.classList.remove("background-active");
});

detailsBackground.addEventListener("click", () => {
  postDetailsContainer.classList.remove("right-0");
  mainContainer.classList.remove("blur");
  detailsBackground.classList.remove("background-active");
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    postDetailsContainer.classList.remove("right-0");
    mainContainer.classList.remove("blur");
    detailsBackground.classList.remove("background-active");
  }
});

// addMovieFormElement.addEventListener("submit", addMovie);
userLogoutButtonElement.addEventListener("click", logoutUser);

const updateUserData = async (obj) => {
  const userId = localStorage.getItem("user");
  try {
    const data = await (
      await fetch(API_URL + "/users/" + userId, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(obj),
      })
    ).json();

    while (containerUpdate.firstElementChild) {
      containerUpdate.removeChild(containerUpdate.firstElementChild);
    }
    const successTextEl = document.createElement("h3");
    successTextEl.classList.add("success-text");
    successTextEl.textContent = "Sėkmingai atnaujinta";
    containerUpdate.append(successTextEl);
  } catch (error) {
    console.log(error);
  }
};

btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  let newObj = {
    name_surname: inputNameEl.value,
    address: addressEl.value,
    phone: phoneEl.value,
  };
  updateUserData(newObj);
  deletePicture();
  addPicture();
});

const addPicture = (e) => {
  const userId = localStorage.getItem("user");
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("image", image_input.files[0]);

  if (image_input.files[0] != undefined) {
    const data = fetch("http://localhost:5001/api/images", {
      method: "POST",
      body: formData,
    }).catch((err) => ("Error occured", err));
  }
};

const deletePicture = async () => {
  const userId = localStorage.getItem("user");

  try {
    const data = await (
      await fetch("http://localhost:5001/api/images/" + userId)
    ).json();

    let imageId = data._id;

    if (imageId) {
      const newData = await await fetch(API_URL + "/images/" + imageId, {
        method: "DELETE",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getData = async () => {
  try {
    const data = await (await fetch(API_URL + "/posts")).json();

    showPosts(data);
  } catch (error) {
    console.log(error);
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

let i = 0;

const showPosts = async (postsArray) => {
  let posts = [];
  const loggedInUserId = localStorage.getItem("user");
  // const posts = loggedInUserId
  //   ? postsArray.filter((post) => post.user_Id !== loggedInUserId)
  //   : postsArray;

  posts = postsArray;

  posts.forEach((post) => {
    if (post.userId == loggedInUserId) {
      postCreate(post);
    }
  });

  function postCreate(post) {
    const postContainer = document.createElement("div");
    const btnLinkEdit = document.querySelector("#link-edit");

    btnLinkEdit.href = location.href.includes("pages")
      ? "./edit-post.html"
      : "./pages/edit-post.html";

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

    postContainer.addEventListener("click", (e) => {
      changePostData(post);
      sessionStorage.clear();
      sessionStorage.setItem("postId", post._id);
    });

    arr.push(postContainer);
  }

  const length = arr.length;

  if (length == 0) {
    const noPostsInfoEl = document.createElement("h1");
    if (localStorage.getItem("languageSet")) {
      if (localStorage.getItem("languageSet") == "lt") {
        noPostsInfoEl.textContent = "JŪS NETURITE SKELBIMŲ";
      } else if (localStorage.getItem("languageSet") == "en") {
        noPostsInfoEl.textContent = "YOU DO NOT HAVE ANY POSTS";
      } else {
        noPostsInfoEl.textContent = "У ВАС НЕМАЄ ПУБЛІКАЦІЙ";
      }
    }

    noPostsInfoEl.classList.add("no-posts");
    postsContainerEl.append(noPostsInfoEl);
  }
  for (let i = 0; i < length; i++) {
    postsContainerEl.append(arr[0]);
    arr.shift(arr[0]);
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

const deletePost = async (id) => {
  try {
    const data = await await fetch(
      API_URL + "/posts/" + sessionStorage.getItem("postId"),
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.log(error);
  }
};

btnDelete.addEventListener("click", () => {
  let newPostId = sessionStorage.getItem("postId");
  deletePost(newPostId);
  alert("Skelbimas sėkmingai ištrintas!");
  clearPosts();
  postDetailsContainer.classList.remove("right-0");
  mainContainer.classList.remove("blur");
  detailsBackground.classList.remove("background-active");
  getData();
});

document.addEventListener("DOMContentLoaded", getData());
document.addEventListener("DOMContentLoaded", loadPicture());

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
