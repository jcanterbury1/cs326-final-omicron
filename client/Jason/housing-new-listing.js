"use strict";

document.getElementById("submit").addEventListener("click", async () => {
  const address = document.getElementById("address").value;
  const landlord = document.getElementById("landlord").value;
  if(address.length > 25 || landlord.length > 25) {
    location.href = "../Jason/housing-new-listing.html";
  } else if(address.length !== 0 && landlord.length !== 0) {
    await fetch("http://localhost:8000/addHousingListing", {
      method: "POST",
      body: JSON.stringify({
        address: address,
        landlord: landlord
      }),
      headers: {
        "Content-type": "application/json"
      }
    });
    location.href = "../Jason/housing-listings.html";
  }
});