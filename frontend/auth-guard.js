(() => {
  document.documentElement.style.visibility = "hidden";

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("websteam.session.v2") || "null");
  } catch {
    session = null;
  }

  if (!session?.token) {
    window.location.replace("../index/index.html");
    return;
  }

  document.documentElement.style.visibility = "visible";
})();
