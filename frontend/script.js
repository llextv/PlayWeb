"use strict";

const SESSION_KEY = "websteam.session.v2";
const DATA_KEY = "websteam.data.v2";

const accounts = {
  "demo-token-alice": {
    name: "Alice",
    role: "admin",
    avatar: "A",
    level: 18,
    xp: 7420,
    status: "En ligne",
    title: "Curatrice du chaos",
  },
  "demo-token-bob": {
    name: "Bob",
    role: "player",
    avatar: "B",
    level: 11,
    xp: 4210,
    status: "En ligne",
    title: "Speedrunner",
  },
  "demo-token-claire": {
    name: "Claire",
    role: "player",
    avatar: "C",
    level: 14,
    xp: 5980,
    status: "Absente",
    title: "Exploratrice",
  },
};

const games = [
  {
    id: "brainrotstar",
    name: "BrainrotStar",
    genre: "Gambling • Brainrot",
    description: "Lancer le fameux jeu de gambling BrainrotStar !",
  },
  {
    id: "gambleking",
    name: "GambleKing",
    genre: "Gamble • Multi",
    description: "Du gamble, du troll, et des potes.",
  },
  {
    id: "chess",
    name: "Chess",
    genre: "Échecs • Dames",
    description: "Jouez aux échecs ainsi qu'aux dames contre vos potes.",
  },
];

const defaults = {
  friends: [
    { name: "Bob", status: "En ligne", avatar: "B" },
    { name: "Claire", status: "En partie", avatar: "C" },
  ],
  achievements: [
    {
      name: "Premier tour",
      game: "BrainrotStar",
      icon: "zap",
      rare: "Commun",
      done: true,
    },
    {
      name: "Ligne parfaite",
      game: "BrainrotStar",
      icon: "target",
      rare: "Rare",
      done: true,
    },
    {
      name: "Pas de retour",
      game: "GambleKing",
      icon: "skull",
      rare: "Légendaire",
      done: false,
    },
  ],
};

let session = null;
let data = null;
const memoryStorage = {};

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return memoryStorage[key] ?? null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      memoryStorage[key] = value;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      delete memoryStorage[key];
    }
  },
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const currentPage = () => document.body.dataset.page || "shop";
const currentUser = () => accounts[session.token];

function loadSession() {
  try {
    session = JSON.parse(storage.get(SESSION_KEY) || "null");
    data = JSON.parse(storage.get(DATA_KEY) || "null");
  } catch {
    session = null;
    data = null;
  }

  if (session && !accounts[session.token]) {
    storage.remove(SESSION_KEY);
    session = null;
  }

  if (session && !data) {
    data = clone(defaults);
    saveData();
  }
}

function saveData() {
  storage.set(SESSION_KEY, JSON.stringify(session));
  storage.set(DATA_KEY, JSON.stringify(data));
}

function setText(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (element) element.textContent = value;
}

function icons() {
  if (window.lucide) window.lucide.createIcons();
}

function toast(message) {
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = message;
  document.querySelector("#toast")?.append(element);
  setTimeout(() => element.remove(), 3000);
}

function logout() {
  session = null;
  data = null;
  storage.remove(SESSION_KEY);
  storage.remove(DATA_KEY);
  showLogin();
}

function showLogin() {
  document.querySelector("#app").innerHTML = `
    <main class="login">
      <section class="token-modal-card">
        <div class="brand login-brand"><span class="brand-mark">PW</span><span>PlayWeb</span></div>
        <div class="eyebrow centered">Accès capsule</div>
        <h1 class="centered">Reprenez<br>la partie.</h1>
        <p class="muted centered login-description">Entrez votre token de démo pour synchroniser votre identité.</p>
        <form id="login-form" class="form">
          <input id="token" class="input" autocomplete="off" placeholder="demo-token-alice" required>
          <button class="btn-play">Ouvrir la capsule</button>
          <div id="login-error" class="hidden login-error"></div>
        </form>
        <div class="test-tokens">
          <div class="eyebrow centered">Tokens de test</div>
          ${Object.keys(accounts)
            .map(
              (token) =>
                `<button class="token" data-token="${token}"><code>${token}</code><span>Utiliser</span></button>`,
            )
            .join("")}
        </div>
      </section>
    </main>`;

  document.querySelectorAll("[data-token]").forEach((button) => {
    button.onclick = () => {
      document.querySelector("#token").value = button.dataset.token;
    };
  });

  document.querySelector("#login-form").onsubmit = (event) => {
    event.preventDefault();
    const token = document.querySelector("#token").value.trim();
    const error = document.querySelector("#login-error");

    if (!accounts[token]) {
      error.textContent = "Token invalide. Utilisez un token de démonstration.";
      error.classList.remove("hidden");
      return;
    }

    session = { token, createdAt: Date.now() };
    data = clone(defaults);
    saveData();
    renderApp();
  };
}

function renderShell() {
  document.querySelector("#app").innerHTML = `
    <div class="app">
      <aside class="sidebar">
        <div class="brand"><span class="brand-mark">PW</span><span>PlayWeb</span></div>
        <nav class="nav">
          <a class="btn-nav" data-page-link="shop" href="../index/index.html"><i data-lucide="store"></i><span>Jeux</span></a>
          <a class="btn-nav" data-page-link="friends" href="../amis/index.html"><i data-lucide="users"></i><span>Amis</span></a>
          <a class="btn-nav" data-page-link="achievements" href="../succes/index.html"><i data-lucide="trophy"></i><span>Succès</span></a>
          <a class="btn-nav" data-page-link="leaderboard" href="../leaderboard/index.html"><i data-lucide="bar-chart"></i><span>Leaderboard</span></a>
          <a class="btn-nav" data-page-link="updates" href="../mises-a-jour/index.html"><i data-lucide="scroll-text"></i><span>Mises à jour</span></a>
          <a class="btn-nav" data-page-link="profile" href="../profil/index.html"><i data-lucide="user"></i><span>Profil</span></a>
        </nav>
        <div class="side-foot">
          <div class="user-mini">
            <div class="avatar">${currentUser().avatar}</div>
            <div class="grow"><b>${currentUser().name}</b><br><span class="small muted">Niveau ${currentUser().level}</span></div>
            <button class="btn danger" id="logout" title="Déconnexion"><i data-lucide="log-out"></i></button>
          </div>
        </div>
      </aside>
      <main class="main" id="content">
        <header class="topbar">
          <h1 id="page-title"></h1>
          <button class="btn" id="quick-profile">${currentUser().avatar} ${currentUser().name}</button>
        </header>
        <div id="page-content"></div>
      </main>
    </div>`;

  document
    .querySelector(`[data-page-link="${currentPage()}"]`)
    ?.classList.add("active");
  document.querySelector("#logout").onclick = logout;
  document.querySelector("#quick-profile").onclick = () => {
    window.location.href = "../profil/index.html";
  };
  icons();
}

function renderApp() {
  if (!session) {
    showLogin();
    return;
  }

  renderShell();
  const pageTemplate = document.querySelector("#page-template");
  if (pageTemplate) {
    document
      .querySelector("#page-content")
      .append(pageTemplate.content.cloneNode(true));
  }
  window.pageInit?.({
    user: currentUser(),
    data,
    games,
    setText,
    toast,
    save: saveData,
    icons,
  });
}

loadSession();
document.addEventListener("DOMContentLoaded", renderApp);
