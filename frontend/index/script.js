window.pageInit = ({ games, setText }) => {
  setText("#page-title", "Découvrir");
  setText("[data-games-count]", `${games.length} jeux`);
  const grid = document.querySelector(".games-grid");
  games.forEach((game) => {
    const mode =
      document.querySelector(`[data-game-id="${game.id}"]`)?.dataset.gameMode ||
      "MULTI";
    const card = document.createElement("article");
    card.className = "card game-card";
    card.innerHTML = `
      <div class="cover">${game.name}</div>
      <div class="card-body">
        <div class="row"><div><b>${game.name}</b><div class="muted small">${game.genre}</div></div><span class="tag">${mode}</span></div>
        <p class="muted small">${game.description}</p>
        <button class="btn primary game-play" type="button">Jouer</button>
      </div>`;
    grid.append(card);
  });
};
