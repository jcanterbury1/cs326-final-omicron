async function login() {
  const username = document.getElementById("username").value;
  const url = "/user/login" + username;
  const response = await fetch(url);
  if(!response.ok) {
    console.error("Could not create account.");
  }
}