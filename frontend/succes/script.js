const RARITY_LABELS = { COMMON: "Commun", UNCOMMON: "Peu commun", RARE: "Rare", EPIC: "Épique", LEGENDARY: "Légendaire" };

window.pageInit = ({ data, games, setText }) => {
  setText("#page-title", "Collection de succès");
  const achievements = [...(data.achievements || [])].sort((left, right) => {
    if (left.done !== right.done) return left.done ? -1 : 1;
    if (!left.unlockedAt && !right.unlockedAt) return 0;
    if (!left.unlockedAt) return 1;
    if (!right.unlockedAt) return -1;
    return new Date(right.unlockedAt).getTime() - new Date(left.unlockedAt).getTime();
  });
  const doneCount = achievements.filter((item) => item.done).length;
  const percent = achievements.length ? Math.round((doneCount / achievements.length) * 100) : 0;

  setText("[data-done-count]", doneCount);
  setText("[data-achievement-count]", data.achievements.length);
  setText("[data-global-percent]", `${percent}%`);
  setText("[data-global-status]", percent === 100 ? "Collection terminée" : "En progression");
  document.querySelector("[data-global-progress]").style.width = `${percent}%`;
  document.querySelector(".achievement-hero-score").style.setProperty("--achievement-progress", `${percent}%`);
  setText("[data-achievement-filter-label]", `${doneCount} débloqué${doneCount > 1 ? "s" : ""}`);

  const gameGrid = document.querySelector("[data-game-achievements]");
  const isSoon = (game) => /^(very[\s_-]+)?soon$/i.test(String(game.tag || "").trim());
  const availableGames = games.filter((game) => !isSoon(game));
  setText("[data-universe-count]", `${availableGames.length} univers à compléter`);
  [...availableGames, ...games.filter(isSoon)].forEach((game) => {
    const soon = isSoon(game);
    const gameAchievements = soon ? [] : achievements.filter((item) => item.game === game.name);
    const gameDone = gameAchievements.filter((item) => item.done).length;
    const gamePercent = gameAchievements.length
      ? Math.round((gameDone / gameAchievements.length) * 100)
      : 0;
    const available = soon
      ? "Succès à venir"
      : gameAchievements.length ? `${gameAchievements.length} succès disponibles` : "Aucun succès pour l'instant";
    const status = soon
      ? `<span class="muted">Bientôt</span>`
      : `<span class="${gamePercent === 100 ? "tag" : "muted"}">${gamePercent === 100 ? "Terminé" : "À continuer"}</span>`;
    const card = document.createElement("article");
    card.className = `game-achievement-card game-${game.slug || game.id}${soon ? " is-soon" : ""}`;
    card.innerHTML = `
      <div class="game-achievement-head">
        <div class="game-achievement-icon">${escapeHtml(game.name.slice(0, 1))}</div>
        <div><h3>${escapeHtml(game.name)}</h3><span class="muted small">${available}</span></div>
        <strong>${soon ? "—" : `${gameDone}/${gameAchievements.length}`}</strong>
      </div>
      <div class="progress"><i style="width: ${gamePercent}%"></i></div>
      <div class="game-achievement-foot"><span class="muted small">${soon ? "Arrive bientôt" : `${gamePercent}% complété`}</span>${status}</div>`;
    gameGrid.append(card);
  });

  const grid = document.querySelector(".achievements-grid");
  achievements.forEach((achievement) => {
    const card = document.createElement("article");
    card.className = `card achievement-card ${achievement.done ? "achievement-unlocked" : "achievement-locked"}`;
    const unlockedDate = achievement.done && achievement.unlockedAt
      ? new Date(achievement.unlockedAt).toLocaleDateString("fr-FR")
      : null;
    card.innerHTML = `<div class="row"><div class="badge"><i data-lucide="${escapeHtml(achievement.icon)}"></i></div><span class="tag">${escapeHtml(RARITY_LABELS[achievement.rare] || achievement.rare)}</span></div><h3>${escapeHtml(achievement.name)}</h3>${achievement.description ? `<p class="achievement-description">${escapeHtml(achievement.description)}</p>` : ""}<div class="muted small">${escapeHtml(achievement.game)}</div>${unlockedDate ? `<div class="muted small achievement-unlocked-date">Débloqué le ${unlockedDate}</div>` : ""}<div class="${achievement.done ? "tag" : "achievement-discover"} achievement-status">${achievement.done ? "✓ Débloqué" : "◌ À découvrir"}</div>`;
    grid.append(card);
  });
  window.lucide?.createIcons();
};
