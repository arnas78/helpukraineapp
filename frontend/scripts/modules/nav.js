// Variables
const navElement = document.querySelector("nav");

let lang = localStorage.getItem("languageSet");

// Functions
const generateNavigation = () => {
  // -- creating navigation elements
  // --- <ul>
  const ul = document.createElement("ul");

  // --- <li> X 3
  const li1 = document.createElement("li"); // HOME
  const li2 = document.createElement("li"); // INFO
  const li3 = document.createElement("li"); // POSTS
  const li4 = document.createElement("li"); // ADD POST
  const li5 = document.createElement("li"); // MESSENGER
  const li6 = document.createElement("li"); // MY ACCOUNT
  const li7 = document.createElement("li"); // LOGIN/SIGNUP
  const li8 = document.createElement("li"); // LITHUANIAN
  const li9 = document.createElement("li"); // ENGLISH
  const li10 = document.createElement("li"); // UKRAINIAN

  const a1 = document.createElement("a"); // HOME
  const a2 = document.createElement("a"); // INFO
  const a3 = document.createElement("a"); // POSTS
  const a4 = document.createElement("a"); // ADD POST
  const a5 = document.createElement("a"); // MESSENGER
  const a6 = document.createElement("a"); // MY ACCOUNT
  const a7 = document.createElement("a"); // LOGIN/SIGNUP
  const p1 = document.createElement("p"); // LITHUANIAN
  const p2 = document.createElement("p"); // ENGLISH
  const p3 = document.createElement("p"); // UKRAINIAN

  a1.href = location.href.includes("pages") ? "../index.html" : "./index.html";
  a2.href = location.href.includes("pages")
    ? "./information.html"
    : "./pages/information.html";
  a3.href = location.href.includes("pages")
    ? "./posts.html"
    : "./pages/posts.html";
  a4.href = location.href.includes("pages")
    ? "./be-volunteer.html"
    : "./pages/be-volunteer.html";
  a5.href = location.href.includes("pages")
    ? "./messenger.html"
    : "./pages/messenger.html";
  a6.href = location.href.includes("pages")
    ? "./my-account.html"
    : "./pages/my-account.html";
  a7.href = location.href.includes("pages")
    ? "./login.html"
    : "./pages/login.html";

  if (lang == "en") {
    a1.innerText = "HOME";
    a2.innerText = "🇺🇦 INFORMATION";
    a3.innerText = "POSTS";
    a4.innerText = "NEW POST";
    a5.innerText = "MESSENGER";
    a6.innerText = "MY ACCOUNT";
    a7.innerText = "LOGIN/SIGNUP";
  } else if (lang == "ua") {
    a1.innerText = "ДІМ";
    a2.innerText = "🇺🇦 ІНФОРМАЦІЯ";
    a3.innerText = "ПОСТИ";
    a4.innerText = "НОВИЙ ПОСТ";
    a5.innerText = "МЕСЕНДЖЕР";
    a6.innerText = "МІЙ РАХУНОК";
    a7.innerText = "УВІЙТИ/ЗАРЕЄСТРУВАТИСЯ";
  } else {
    a1.innerText = "PAGRINDINIS";
    a2.innerText = "🇺🇦 INFORMACIJA";
    a3.innerText = "SKELBIMAI";
    a4.innerText = "NAUJAS SKELBIMAS";
    a5.innerText = "ŽINUTĖS";
    a6.innerText = "MANO PASKYRA";
    a7.innerText = "PRISIJUNGTI/REGISTRUOTIS";
  }

  p1.innerText = "LT";
  p2.innerText = "EN";
  p3.innerText = "UA";

  p1.addEventListener("click", () => {
    localStorage.setItem("languageSet", "lt");
    location.reload();
  });
  p2.addEventListener("click", () => {
    localStorage.setItem("languageSet", "en");
    location.reload();
  });
  p3.addEventListener("click", () => {
    localStorage.setItem("languageSet", "ua");
    location.reload();
  });

  li1.appendChild(a1);
  li2.appendChild(a2);
  li3.appendChild(a3);
  li4.appendChild(a4);
  li6.appendChild(a6);
  li7.appendChild(a7);
  li8.appendChild(p1);
  li9.appendChild(p2);
  li10.appendChild(p3);

  ul.append(li1, li2, li3, li7, li8, li9, li10);
  if (localStorage.getItem("user")) {
    ul.textContent = "";
    ul.append(li1, li2, li3, li4, li6, li8, li9, li10);
  }

  ul.classList.add("nav-links");
  navElement.classList.add("navbar");
  navElement.appendChild(ul);
};

// Events
document.addEventListener("DOMContentLoaded", generateNavigation);
