window.pageInit = ({ user, data, games, setText, toast, save, icons }) => {
  setText("#page-title", "Votre profil");

  const profile = data.profile || {};
  const token = window.localStorage?.getItem?.("websteam.session.v2");
  const sessionToken = token ? JSON.parse(token).token : "demo-token-alice";
  const achievements = data.achievements || [];
  const unlocked = achievements.filter((item) => item.done).length;
  const playedGames = games.filter((game) => profile.games?.[game.id]?.played);
  const totalHours = games.reduce((sum, game) => sum + Number(profile.games?.[game.id]?.hours || 0), 0);

  setText("[data-profile-avatar]", user.avatar);
  setText("[data-profile-name]", user.name);
  setText("[data-profile-status]", user.status);
  setText("[data-profile-joined]", new Date(profile.joinedAt || Date.now()).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }));
  setText("[data-friends-count]", data.friends.length);
  setText("[data-achievements-count]", `${unlocked} / ${achievements.length}`);
  setText("[data-hours-count]", `${totalHours.toFixed(1)} h`);
  setText("[data-games-count]", `${playedGames.length} / ${games.length}`);
  document.querySelector("[data-profile-input]").value = user.name;

  const percent = achievements.length ? Math.round((unlocked / achievements.length) * 100) : 0;
  setText("[data-achievement-percent]", `${percent}%`);
  setText("[data-achievement-title]", unlocked === achievements.length ? "Collection terminée !" : "Encore quelques défis");
  document.querySelector("[data-achievement-progress]").style.width = `${percent}%`;

  const activity = document.querySelector("[data-game-activity]");
  games.forEach((game) => {
    const stats = profile.games?.[game.id] || { hours: 0, played: false };
    const row = document.createElement("article");
    row.className = `game-activity-row ${stats.played ? "" : "not-played"}`;
    row.innerHTML = `
      <div class="game-mark ${game.id}">${game.name.slice(0, 1)}</div>
      <div class="grow"><div class="game-row-title"><b>${game.name}</b><span class="${stats.played ? "tag" : "muted"}">${stats.played ? "Joué" : "Jamais joué"}</span></div>
      <div class="activity-track"><i style="width: ${Math.min(100, stats.hours * 4)}%"></i></div></div>
      <strong class="game-hours">${stats.played ? `${Number(stats.hours).toFixed(1)} h` : "—"}</strong>`;
    activity.append(row);
  });

  const privacySelect = document.querySelector("[data-privacy-select]");
  const updatePrivacy = () => {
    privacySelect.value = profile.privacy === "private" ? "private" : "public";
  };
  updatePrivacy();

  document.querySelector("[data-profile-form]").onsubmit = (event) => {
    event.preventDefault();
    const input = document.querySelector("[data-profile-input]");
    const name = input.value.trim();
    const feedback = document.querySelector("[data-profile-feedback]");
    if (name.length < 3) {
      feedback.textContent = "Ton pseudo doit contenir au moins 3 caractères.";
      feedback.className = "form-feedback error";
      return;
    }
    profile.name = name;
    data.profile = profile;
    save();
    setText("[data-profile-name]", name);
    document.querySelector(".user-mini b").textContent = name;
    feedback.textContent = "Pseudo modifié avec succès.";
    feedback.className = "form-feedback success";
    toast("Ton profil a été mis à jour.");
  };

  privacySelect.onchange = () => {
    profile.privacy = privacySelect.value;
    data.profile = profile;
    save();
    updatePrivacy();
    toast(profile.privacy === "public" ? "Profil visible par tous." : "Profil maintenant privé.");
  };

  let tokenVisible = false;
  const tokenElement = document.querySelector("[data-session-token]");
  document.querySelector("[data-reveal-token]").onclick = () => {
    tokenVisible = !tokenVisible;
    tokenElement.textContent = tokenVisible ? sessionToken : "••••••••••••••••";
  };
  document.querySelector("[data-copy-token]").onclick = async () => {
    await navigator.clipboard?.writeText(sessionToken);
    toast("Token copié dans le presse-papiers.");
  };

  document.querySelector("[data-share-profile]").onclick = async () => {
    const shareData = { title: `Profil de ${user.name} — PlayWeb`, text: `Découvre le profil de ${user.name} sur PlayWeb !`, url: window.location.href };
    if (navigator.share) await navigator.share(shareData);
    else {
      await navigator.clipboard?.writeText(window.location.href);
      toast("Lien du profil copié.");
    }
  };

  document.querySelector("[data-edit-profile]").onclick = () => {
    document.querySelector("[data-profile-input]").focus();
    document.querySelector("[data-profile-input]").scrollIntoView({ behavior: "smooth", block: "center" });
  };

  document.querySelector("[data-delete-account]").onclick = () => {
    if (!window.confirm("Supprimer définitivement ton compte et toutes tes données locales ? Cette action est irréversible.")) return;
    localStorage.removeItem("websteam.session.v2");
    localStorage.removeItem("websteam.data.v2");
    window.location.href = "../index/index.html";
  };

  icons();
};
