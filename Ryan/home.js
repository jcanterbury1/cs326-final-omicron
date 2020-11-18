

async function search(){
    const url = "/search" + document.getElementById("searchbar").value;
    const response = await fetch(url);
    if (!response.ok) {
        console.error("Could not search.");
    }
}