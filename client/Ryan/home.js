

async function search(){
    const url = "/search" + document.getElementById("searchbar").value;
    const response = await fetch(url);
    if (!response.ok) {
        console.error("Could not search.");
    }
}

//Table Creations
//CREATE TABLE Users ( first char(255), last char(255), email varchar(255), username varchar(255), password varchar(255) );
