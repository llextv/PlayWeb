"use strict";
const KEY = "websteam.session.v2",
  DATA = "websteam.data.v2";
const accounts = {
  "demo-token-alice": {
    id: "alice",
    name: "Alice",
    role: "admin",
    avatar: "A",
    level: 18,
    xp: 7420,
    status: "En ligne",
    title: "Curatrice du chaos",
  },
  "demo-token-bob": {
    id: "bob",
    name: "Bob",
    role: "player",
    avatar: "B",
    level: 11,
    xp: 4210,
    status: "En ligne",
    title: "Speedrunner",
  },
  "demo-token-claire": {
    id: "claire",
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
    tone: "",
    price: 0,
    players: "1.2k",
    desc: "Lancer le fameux jeux de gambling BrainrotStar !",
  },
  {
    id: "gambleking",
    name: "GambleKing",
    genre: "Gamble • Multi",
    tone: "orange",
    price: 0,
    players: "842",
    desc: "Du gamble, du troll, et des potes.",
  },
  {
    id: "chess",
    name: "Chess",
    genre: "Echecs • Dames",
    tone: "pink",
    price: 0,
    players: "310",
    desc: "Jouez au échecs ainsi qu'au dames contre vos potes.",
  },
];
const defaults = {
  owned: ["neon"],
  credits: 25,
  notifications: 2,
  achievements: [
    {
      name: "Premier tour",
      game: "Neon Drift",
      icon: "zap",
      rare: "Commun",
      done: true,
    },
    {
      name: "Ligne parfaite",
      game: "Neon Drift",
      icon: "target",
      rare: "Rare",
      done: true,
    },
    {
      name: "Pas de retour",
      game: "Hollow Signal",
      icon: "skull",
      rare: "Légendaire",
      done: false,
    },
  ],
  friends: [
    { name: "Bob", status: "En ligne", avatar: "B" },
    { name: "Claire", status: "En partie", avatar: "C" },
  ],
  sessions: 2,
};
let session = null,
  data = null,
  view = "shop";
if (typeof structuredClone !== "function")
  window.structuredClone = (o) => JSON.parse(JSON.stringify(o));
let memStore = {};
const storage = {
  getItem(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return memStore[k] ?? null;
    }
  },
  setItem(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {
      memStore[k] = v;
    }
  },
  removeItem(k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {
      delete memStore[k];
    }
  },
};
const clone = (id) => document.querySelector(`#${id}`).content.cloneNode(true);
const one = (root, selector) => root.querySelector(selector);
const all = (root, selector) => [...root.querySelectorAll(selector)];
const setText = (root, selector, value) => {
  const node = one(root, selector);
  if (node) node.textContent = value;
};
const gameMode = (gameId) =>
  document.querySelector(`#game-modes [data-game-id="${gameId}"]`)?.dataset
    .gameMode || "";
const user = () => accounts[session.token];

function load() {
  try {
    session = JSON.parse(storage.getItem(KEY) || "null");
    data = JSON.parse(storage.getItem(DATA) || "null");
  } catch (e) {
    session = null;
    data = null;
  }
  if (session && !accounts[session.token]) {
    storage.removeItem(KEY);
    session = null;
  }
  if (session && !data) data = structuredClone(defaults);
}
function save() {
  storage.setItem(KEY, JSON.stringify(session));
  storage.setItem(DATA, JSON.stringify(data));
}
function toast(msg) {
  const element = clone("toast-template").firstElementChild;
  element.textContent = msg;
  document.querySelector("#toast").append(element);
  setTimeout(() => element.remove(), 3000);
}
function icons() {
  if (window.lucide) window.lucide.createIcons();
}

function shell() {
  const root = document.querySelector("#root");
  root.replaceChildren(clone("shell-template"));
  const current = root.firstElementChild;
  setText(current, "[data-user-avatar]", user().avatar);
  setText(current, "[data-user-name]", user().name);
  setText(current, "[data-user-level]", user().level);
  setText(current, "[data-quick-avatar]", user().avatar);
  setText(current, "[data-quick-name]", user().name);
  all(current, "[data-view]").forEach((button) =>
    button.classList.toggle("active", button.dataset.view === view),
  );
  all(current, "[data-view]").forEach(
    (button) =>
      (button.onclick = () => {
        view = button.dataset.view;
        shell();
      }),
  );
  one(current, "#logout").onclick = logout;
  one(current, "#quickProfile").onclick = () => {
    view = "profile";
    shell();
  };
  renderContent(current);
  icons();
}
function renderContent(root) {
  const titles = {
    shop: "Découvrir",
    library: "Votre bibliothèque",
    friends: "Équipage",
    achievements: "Collection de succès",
    leaderboard: "Classement",
    notifications: "Centre de signaux",
    profile: "Votre capsule",
    admin: "Console opérateur",
  };
  setText(root, "#page-title", titles[view]);
  const panel = one(root, "#content-panel");
  panel.replaceChildren(
    {
      shop,
      library,
      friends,
      achievements,
      leaderboard,
      notifications,
      profile,
      admin,
    }[view](),
  );
  bind(panel);
  icons();
}
function gameCard(game) {
  const node = clone("game-card-template").firstElementChild,
    owned = data.owned.includes(game.id);
  one(node, "[data-game-cover]").className = `cover ${game.tone}`;
  setText(node, "[data-game-cover]", game.name);
  setText(node, "[data-game-name]", game.name);
  setText(node, "[data-game-genre]", game.genre);
  setText(node, "[data-game-mode]", gameMode(game.id));
  setText(node, "[data-game-desc]", game.desc);
  const button = one(node, "[data-game-button]");
  button.textContent = "Jouer";
  button.classList.add("primary");
  button.dataset.action = "launch";
  button.dataset.id = game.id;
  return node;
}
function shop() {
  const node = clone("shop-template"),
    gamesRoot = one(node, "#games");
  games.forEach((game) => gamesRoot.append(gameCard(game)));
  return node;
}
function library() {
  const node = clone("library-template"),
    owned = games.filter((game) => data.owned.includes(game.id));
  setText(
    node,
    "[data-library-title]",
    `${owned.length} jeu${owned.length > 1 ? "x" : ""} prêt${owned.length > 1 ? "s" : ""} à lancer`,
  );
  const list = one(node, "[data-library-games]");
  if (!owned.length) {
    list.append(clone("empty-library-template"));
    return node;
  }
  owned.forEach((game) => {
    const card = clone("library-card-template").firstElementChild,
      progress = game.id === "neon" ? 72 : 18;
    one(card, "[data-game-cover]").className = `cover ${game.tone}`;
    setText(card, "[data-game-cover]", game.name);
    setText(card, "[data-game-name]", game.name);
    one(card, "[data-game-progress]").style.width = `${progress}%`;
    setText(card, "[data-game-explored]", `${progress}% exploré`);
    one(card, "[data-action]").dataset.id = game.id;
    list.append(card);
  });
  return node;
}
function friends() {
  const node = clone("friends-template");
  setText(node, "[data-friends-count]", data.friends.length);
  data.friends.forEach((friend) => {
    const item = clone("friend-template").firstElementChild;
    setText(item, "[data-friend-avatar]", friend.avatar);
    setText(item, "[data-friend-name]", friend.name);
    setText(item, "[data-friend-status]", `● ${friend.status}`);
    one(item, "[data-friend-status]").classList.toggle(
      "tag",
      friend.status === "En ligne",
    );
    one(item, "[data-action]").dataset.name = friend.name;
    one(node, "[data-friends-list]").append(item);
  });
  return node;
}
function achievements() {
  const node = clone("achievements-template");
  setText(
    node,
    "[data-done-count]",
    data.achievements.filter((a) => a.done).length,
  );
  setText(node, "[data-achievement-count]", data.achievements.length);
  data.achievements.forEach((achievement) => {
    const item = clone("achievement-template").firstElementChild,
      status = one(item, "[data-achievement-status]");
    one(item, "[data-achievement-icon]").setAttribute(
      "data-lucide",
      achievement.icon,
    );
    setText(item, "[data-achievement-rarity]", achievement.rare);
    setText(item, "[data-achievement-name]", achievement.name);
    setText(item, "[data-achievement-game]", achievement.game);
    status.textContent = achievement.done ? "✓ Débloqué" : "◌ À découvrir";
    status.classList.toggle("tag", achievement.done);
    status.classList.toggle("muted", !achievement.done);
    one(node, "[data-achievements-list]").append(item);
  });
  return node;
}
function leaderboard() {
  const node = clone("leaderboard-template");
  [
    ["01", "Alice", "18", "7 420", "Curatrice"],
    ["02", "Claire", "14", "5 980", "Exploratrice"],
    ["03", "Bob", "11", "4 210", "Speedrunner"],
    ["04", "Nova", "09", "3 880", "Rookie"],
  ].forEach((row, index) => {
    const item = clone("leaderboard-row-template").firstElementChild;
    ["rank", "player", "level", "xp", "title"].forEach((key, i) =>
      setText(item, `[data-${key}]`, row[i]),
    );
    if (!index) one(item, "[data-rank]").classList.add("tag");
    one(node, "[data-leaderboard-list]").append(item);
  });
  return node;
}
function notifications() {
  const node = clone("notifications-template");
  [
    "Votre session est sécurisée et active.",
    "Bob vous a invité à jouer à Neon Drift.",
    "Nouveau succès disponible : Ligne parfaite.",
  ].forEach((text, index) => {
    const item = clone("notification-template").firstElementChild;
    one(item, "[data-notification-icon]").setAttribute(
      "data-lucide",
      index ? "zap" : "check",
    );
    setText(item, "[data-notification-text]", text);
    setText(item, "[data-notification-age]", `Il y a ${index + 1} h`);
    setText(item, "[data-notification-type]", index ? "Nouveau" : "Système");
    one(node, "[data-notifications-list]").append(item);
  });
  return node;
}
function profile() {
  const node = clone("profile-template");
  setText(node, "[data-profile-avatar]", user().avatar);
  setText(node, "[data-profile-status]", `● ${user().status}`);
  setText(node, "[data-profile-name]", user().name);
  setText(node, "[data-profile-title]", user().title);
  setText(node, "[data-profile-level]", `Niveau ${user().level}`);
  setText(node, "[data-profile-xp]", `${user().xp} XP`);
  setText(node, "[data-session-token]", session.token);
  return node;
}
function admin() {
  const node = clone("admin-template");
  if (user().role !== "admin") {
    one(node, "div").replaceChildren(clone("empty-admin-template"));
    return node;
  }
  setText(node, "[data-games-count]", games.length);
  setText(node, "[data-account-count]", Object.keys(accounts).length);
  setText(node, "[data-configured-achievements]", data.achievements.length);
  games.forEach((game) => {
    const item = clone("admin-game-template").firstElementChild;
    setText(item, "[data-game-name]", game.name);
    setText(item, "[data-game-meta]", `${game.genre} · ${gameMode(game.id)}`);
    const button = one(item, "[data-action]");
    button.dataset.id = game.id;
    one(node, "[data-admin-games]").append(item);
  });
  return node;
}
function bind(root) {
  all(root, "[data-action]").forEach(
    (button) =>
      (button.onclick = () =>
        action(button.dataset.action, button.dataset.id, button.dataset.name)),
  );
}
function action(type, id, name) {
  if (type === "launch") {
    return;
  } else if (type === "play") toast(`Invitation envoyée à ${name}.`);
  else if (type === "invite") modal("Ajouter un ami", "invite-modal-template");
  else if (type === "edit")
    modal("Modifier le profil", "profile-modal-template");
  else if (type === "revoke") {
    session = null;
    storage.removeItem(KEY);
    closeModal();
    showLogin();
    toast("Session révoquée.");
  } else if (type === "add" || type === "editgame")
    modal(
      type === "add" ? "Créer un jeu" : "Éditer le jeu",
      "form-modal-template",
      id,
    );
}
function modal(title, bodyTemplate, id) {
  closeModal();
  const node = clone("modal-template").firstElementChild;
  setText(node, "[data-modal-title]", title);
  const body = clone(bodyTemplate);
  one(node, "[data-modal-body]").append(body);
  if (bodyTemplate === "launch-modal-template")
    setText(
      node,
      "[data-launch-text]",
      `${id} démarre dans une capsule de jeu mock.`,
    );
  if (bodyTemplate === "profile-modal-template") {
    one(node, "[data-form-profile-name]").value = user().name;
    one(node, "[data-form-submit]").onclick = () => {
      closeModal();
      toast("Profil mis à jour.");
    };
  }
  if (bodyTemplate === "invite-modal-template")
    one(node, "[data-form-submit]").onclick = () => {
      closeModal();
      toast("Invitation envoyée.");
    };
  if (bodyTemplate === "form-modal-template") {
    if (id)
      one(node, "[data-form-name]").value = games.find(
        (game) => game.id === id,
      ).name;
    one(node, "[data-form-submit]").onclick = () => {
      closeModal();
      toast("Jeu enregistré dans le mock.");
    };
  }
  one(node, "[data-close-modal]").onclick = closeModal;
  document.body.append(node);
  icons();
}
function closeModal() {
  document.querySelector("#modal")?.remove();
}
function showLogin() {
  const root = document.querySelector("#root");
  root.replaceChildren(clone("login-template"));
  const current = root.firstElementChild,
    tokenList = one(current, "[data-token-list]");
  Object.keys(accounts).forEach((token) => {
    const item = clone("token-template").firstElementChild;
    setText(item, "[data-token-value]", token);
    one(item, "[data-token-use]").onclick = () => {
      one(current, "#token").value = token;
    };
    tokenList.append(item);
  });
  one(current, "#loginForm").onsubmit = (event) => {
    event.preventDefault();
    const token = one(current, "#token").value.trim(),
      error = one(current, "#error");
    if (!accounts[token]) {
      error.textContent = "Token invalide. Utilisez un token de démonstration.";
      error.classList.remove("hidden");
      return;
    }
    session = { token, createdAt: Date.now() };
    data = structuredClone(defaults);
    save();
    toast("Connexion réussie.");
    shell();
  };
}
function logout() {
  session = null;
  data = null;
  storage.removeItem(KEY);
  storage.removeItem(DATA);
  showLogin();
}
load();
session ? shell() : showLogin();
