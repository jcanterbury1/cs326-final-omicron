
async function login(){
    let username = document.getElementById('username').value;
    let url = '/user/login' + username;
    const response = await fetch(url);
    if (!response.ok) {
        console.error("Could not create account.");
    }
}