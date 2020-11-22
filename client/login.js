document.getElementById("username").addEventListener("keyup", () => {
  window.sessionStorage.setItem("user", document.getElementById("username").value);
});