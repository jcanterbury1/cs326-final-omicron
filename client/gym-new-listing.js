"use strict";

document.getElementById("submit").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  if(name.length > 25 || address.length > 25) {
    location.href = "../Jason/gym-new-listing.html";
  } else if(name.length !== 0 && address.length !== 0) {
    await fetch("http://localhost:8000/addGymListing", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        address: address
      }),
      headers: {
        "Content-type": "application/json"
      }
    });
    location.href = "../Jason/gym-listings.html";
  }
});