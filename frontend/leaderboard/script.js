window.pageInit = ({ user, setText, toast, icons }) => {
  setText("#page-title", "Classement");

  const rankings = {
    brainrotstar: {
      label: "BrainrotStar",
      players: [
        { name: "Alice", level: 18, xp: 7420 },
        { name: "Claire", level: 14, xp: 5980 },
        { name: "Bob", level: 11, xp: 4210 },
        { name: "Nova", level: 9, xp: 3880 },
      ],
    },
    gambleking: {
      label: "GambleKing",
      players: [
        { name: "Bob", level: 19, xp: 8160 },
        { name: "Alice", level: 16, xp: 6740 },
        { name: "Nova", level: 12, xp: 4890 },
        { name: "Claire", level: 8, xp: 2960 },
      ],
    },
    chess: {
      label: "Chess",
      players: [
        { name: "Claire", level: 22, xp: 9340 },
        { name: "Alice", level: 17, xp: 7210 },
        { name: "Nova", level: 13, xp: 5120 },
        { name: "Bob", level: 10, xp: 3670 },
      ],
    },
  };

  const rankingBody = document.querySelector("[data-ranking-body]");
  const gameFilter = document.querySelector("#game-filter");
  const rankingSubtitle = document.querySelector(".ranking-subtitle");

  function rankClass(rank) {
    if (rank === 1) return "rank-pill rank-top-1";
    if (rank === 2) return "rank-pill rank-top-2";
    if (rank === 3) return "rank-pill rank-top-3";
    return "rank-pill";
  }

  function renderRanking() {
    const ranking = rankings[gameFilter.value] || rankings.brainrotstar;
    const sorted = [...ranking.players].sort((a, b) => b.xp - a.xp);
    rankingSubtitle.textContent = `Top joueurs de ${ranking.label}`;

    rankingBody.innerHTML = sorted
      .map(
        (player, index) => `
          <tr>
            <td><span class="${rankClass(index + 1)}">${index + 1}</span></td>
            <td>${player.name}</td>
            <td>${player.level}</td>
            <td class="ranking-xp">${player.xp.toLocaleString("fr-FR")} XP</td>
          </tr>`,
      )
      .join("");

    setText("[data-user-pseudo]", user.name);
  }

  const personalRankings = document.querySelector("[data-personal-rankings]");
  personalRankings.innerHTML = Object.entries(rankings)
    .map(([gameId, ranking]) => {
      const sorted = [...ranking.players].sort((a, b) => b.xp - a.xp);
      const rank = sorted.findIndex((player) => player.name === user.name) + 1;
      return `
        <article class="personal-ranking-row">
          <span class="personal-game">${ranking.label}</span>
          <span class="${rankClass(rank)}">${rank ? `${rank}e` : "Non classé"}</span>
        </article>`;
    })
    .join("");

  gameFilter.addEventListener("change", renderRanking);
  document.querySelector("[data-scroll-profile]").onclick = () => {
    document
      .querySelector("[data-profile-section]")
      .scrollIntoView({ behavior: "smooth" });
  };

  document.querySelector("[data-go-profile]").onclick = () => {
    window.location.href = "../profil/index.html";
  };

  renderRanking();
  icons();
};
