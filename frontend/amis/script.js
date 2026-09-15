window.pageInit = ({ data, user, setText, toast, icons }) => {
  setText("#page-title", "Équipage");
  setText("[data-profile-name]", user.name);
  setText("[data-friends-count]", `${data.friends.length} amis`);

  const friendsList = document.querySelector("[data-friends-list]");

  data.friends.forEach((friend) => {
    const row = document.createElement("article");
    row.className = "friend-row";
    row.innerHTML = `
      <div class="friend-details">
        <div class="avatar">${friend.avatar}</div>
        <div>
          <b>${friend.name}</b>
          <p class="${friend.status === "En ligne" ? "tag" : "muted"}">● ${friend.status}</p>
        </div>
      </div>
      <div class="friend-actions">
        <button class="btn invite-friend" type="button">Inviter</button>
        <button class="btn danger remove-friend" type="button">Retirer</button>
      </div>`;

    row.querySelector(".invite-friend").onclick = () => {
      toast(`Invitation envoyée à ${friend.name}.`);
    };

    row.querySelector(".remove-friend").onclick = () => {
      row.remove();
      toast(`${friend.name} a été retiré de vos amis.`);
    };

    friendsList.append(row);
  });

  document.querySelector("[data-invite-button]").onclick = () => {
    const input = document.querySelector("[data-invite-input]");
    const name = input.value.trim();

    if (!name) {
      toast("Entre le pseudo d'un ami.");
      return;
    }

    toast(`Demande envoyée à ${name}.`);
    input.value = "";
  };

  document.querySelector("[data-profile-form]").onsubmit = (event) => {
    event.preventDefault();
    const input = document.querySelector("[data-profile-input]");
    const feedback = document.querySelector("[data-profile-feedback]");
    const name = input.value.trim();

    if (!name) {
      feedback.textContent = "Entre un pseudo valide.";
      feedback.style.color = "#fda4af";
      return;
    }

    feedback.textContent = "Pseudo modifié avec succès.";
    feedback.style.color = "#86efac";
    setText("[data-profile-name]", name);
    input.value = "";
  };

  icons();
};
