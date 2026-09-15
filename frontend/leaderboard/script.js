window.pageInit = ({ user, setText, toast, icons }) => {
  setText("#page-title", "Classement");

  const players = [
    { name: "Alice", level: 18, xp: 7420, title: "Curatrice" },
    { name: "Claire", level: 14, xp: 5980, title: "Exploratrice" },
    { name: "Bob", level: 11, xp: 4210, title: "Speedrunner" },
    { name: "Nova", level: 9, xp: 3880, title: "Rookie" },
  ];

  const rankingBody = document.querySelector("[data-ranking-body]");
  const sortBy = document.querySelector("#sort-by");

  function rankClass(rank) {
    if (rank === 1) return "rank-pill rank-top-1";
    if (rank === 2) return "rank-pill rank-top-2";
    if (rank === 3) return "rank-pill rank-top-3";
    return "rank-pill";
  }

  function renderRanking() {
    const sorted = [...players].sort((a, b) => {
      if (sortBy.value === "name") return a.name.localeCompare(b.name, "fr");
      if (sortBy.value === "level") return b.level - a.level;
      if (sortBy.value === "xp") return b.xp - a.xp;
      return b.xp - a.xp;
    });

    rankingBody.innerHTML = sorted
      .map(
        (player, index) => `
          <tr>
            <td><span class="${rankClass(index + 1)}">${index + 1}</span></td>
            <td>${player.name}</td>
            <td>${player.level}</td>
            <td class="ranking-xp">${player.xp.toLocaleString("fr-FR")} XP</td>
            <td class="muted">${player.title}</td>
          </tr>`,
      )
      .join("");

    const userRank =
      sorted.findIndex((player) => player.name === user.name) + 1;
    setText("[data-user-rank]", userRank ? `${userRank}e` : "non classé");
    setText("[data-user-pseudo]", user.name);
  }

  sortBy.addEventListener("change", renderRanking);
  document.querySelector("[data-scroll-profile]").onclick = () => {
    document
      .querySelector("[data-profile-section]")
      .scrollIntoView({ behavior: "smooth" });
  };

  document.querySelector("[data-publish-form]").onsubmit = (event) => {
    event.preventDefault();
    const input = document.querySelector("[data-publish-name]");
    const feedback = document.querySelector("[data-publish-feedback]");
    const name = input.value.trim();

    if (!name) {
      feedback.textContent = "Entre un pseudo valide.";
      feedback.style.color = "#fda4af";
      return;
    }

    feedback.textContent = "Pseudo modifié avec succès.";
    feedback.style.color = "#86efac";
    setText("[data-user-pseudo]", name);
    input.value = "";
    toast("Profil mis à jour.");
  };

  renderRanking();
  icons();
};
