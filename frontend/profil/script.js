window.pageInit = ({ user, setText, toast }) => {
  setText("#page-title", "Votre capsule");
  setText("[data-profile-avatar]", user.avatar);
  setText("[data-profile-status]", `● ${user.status}`);
  setText("[data-profile-name]", user.name);
  setText("[data-profile-title]", user.title);
  setText("[data-profile-level]", `Niveau ${user.level}`);
  setText("[data-profile-xp]", `${user.xp} XP`);
  setText("[data-session-token]", "Session navigateur");
  document.querySelector(".profile-edit").onclick = () =>
    toast("Profil mis à jour.");
  document.querySelector(".profile-revoke").onclick = () =>
    toast("Session révoquée.");
  window.lucide?.createIcons();
};
