
async function login() {
  const response = await fetch('/login', { 
    method: 'POST',
    headers: {
        'content-type': 'application/JSON',
    },
    body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    })
});
  console.log("Log in attempted.");

if (!response.ok) {
    console.error("Could not Log in account.");
}
}

// document.getElementById("register").addEventListener("click", () => register, false);

async function register(){
  //add event listener
  console.log("Make a new account");
  const response = await fetch('/register');
  if (!response.ok) {
    console.error("Could not register an account.");
}
}