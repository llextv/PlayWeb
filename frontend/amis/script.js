window.pageInit = ({ data, user, games, setText, toast, icons }) => {
  setText("#page-title", "Équipage");
  setText("[data-profile-name]", user.name);
  setText("[data-friends-count]", `${data.friends.length} amis`);

  const friendsList = document.querySelector("[data-friends-list]");
  const inviteModal = document.querySelector("[data-invite-modal]");
  const inviteFriend = document.querySelector("[data-invite-friend]");
  const inviteGame = document.querySelector("[data-invite-game]");
  let selectedFriend = null;

  inviteGame.innerHTML = games
    .map((game) => `<option value="${game.id}">${game.name}</option>`)
    .join("");

  const closeInviteModal = () => {
    inviteModal.classList.add("hidden");
    selectedFriend = null;
  };

  const openInviteModal = (friend) => {
    selectedFriend = friend;
    inviteFriend.textContent = friend.name;
    inviteGame.value = games[0]?.id || "";
    inviteModal.classList.remove("hidden");
    inviteGame.focus();
  };

  document.querySelectorAll("[data-close-invite]").forEach((element) => {
    element.onclick = closeInviteModal;
  });

  document.querySelector("[data-invite-form]").onsubmit = (event) => {
    event.preventDefault();
    if (!selectedFriend) return;
    const game = games.find((item) => item.id === inviteGame.value);
    if (!game) return;
    closeInviteModal();
    toast(`Invitation envoyée à ${selectedFriend.name} pour ${game.name}.`);
  };

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !inviteModal.classList.contains("hidden")) {
      closeInviteModal();
    }
  });

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
      openInviteModal(friend);
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
