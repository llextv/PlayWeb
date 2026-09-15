window.pageInit = ({ data, setText }) => {
  setText("#page-title", "Collection de succès");
  setText(
    "[data-done-count]",
    data.achievements.filter((item) => item.done).length,
  );
  setText("[data-achievement-count]", data.achievements.length);
  const grid = document.querySelector(".achievements-grid");
  data.achievements.forEach((achievement) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `<div class="row"><div class="badge"><i data-lucide="${achievement.icon}"></i></div><span class="tag">${achievement.rare}</span></div><h3>${achievement.name}</h3><div class="muted small">${achievement.game}</div><div class="${achievement.done ? "tag" : "muted"} achievement-status">${achievement.done ? "✓ Débloqué" : "◌ À découvrir"}</div>`;
    grid.append(card);
  });
  window.lucide?.createIcons();
};
