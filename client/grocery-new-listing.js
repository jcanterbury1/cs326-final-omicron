"use strict";

document.getElementById("submit").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  if(name.length > 25 || address.length > 25) {
    location.href = "/grocery-new-listing";
  } else if(name.length !== 0 && address.length !== 0) {
    await fetch("/addGroceryListing", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        address: address
      }),
      headers: {
        "Content-type": "application/json"
      }
    });
    location.href = "/grocery-listings";
  }
});