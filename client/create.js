
async function createAccount(){
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'content-type': 'application/JSON',
        },
        body: JSON.stringify({
            first: document.getElementById("first").value,
            last: document.getElementById("last").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        })
    });

    if (!response.ok) {
        console.error("Could not create account.");
    }
}