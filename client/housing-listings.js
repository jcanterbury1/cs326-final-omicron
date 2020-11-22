"use strict";

addListings();
document.getElementById("filter").addEventListener("keyup", () => {
  document.getElementById("listGroup").remove();
  addListings();
});

async function addListings() {
  const listings = await (await fetch("/getHousingListings")).json();
  const filter = document.getElementById("filter").value;
  for(let i = 0; i < listings.length; i++) {
    for(let j = 0; j < filter.length; j++) {
      if(listings[i].address[j] !== filter[j]) {
        listings.splice(i, 1);
        i--;
        break;
      }
    }
  }
  const listGroup = document.createElement("ul");
  document.getElementById("container").appendChild(listGroup);
  listGroup.id = "listGroup";
  listGroup.classList.add("list-group");
  if(listings.length === 0) {
    listGroup.appendChild(document.createElement("br"));
    const text = document.createElement("h2");
    listGroup.appendChild(text);
    text.innerHTML = "No Listings";
    text.style.textAlign = "center";
  } else {
    for(let i = 0; i < listings.length; i++) {
      const price = await (await fetch("/getPrice", {
        method: "POST",
        body: JSON.stringify({
          category: "housing",
          id: listings[i].address + "|" + listings[i].landlord
        }),
        headers: {
          "Content-Type": "application/json",
        }
      })).json();
      createListing(listings[i].address, listings[i].landlord, price.avg, listings[i].likes);
    }
  }
}

function createListing(houseAddress, houseLandlord, housePrice, houseLikes) {
  const listGroupItem = document.createElement("li");
  document.getElementById("listGroup").appendChild(listGroupItem);
  listGroupItem.classList.add("list-group-item");
  const listingContainer = document.createElement("div");
  listGroupItem.appendChild(listingContainer);
  listingContainer.classList.add("listing-container");
  const infoContainer = document.createElement("div");
  listingContainer.appendChild(infoContainer);
  infoContainer.classList.add("info-container");
  const address = document.createElement("h2");
  infoContainer.appendChild(address);
  address.innerHTML = houseAddress;
  const landlord = document.createElement("label");
  infoContainer.appendChild(landlord);
  landlord.innerHTML = "Landlord: " + houseLandlord;
  const price = document.createElement("label");
  infoContainer.appendChild(price);
  price.innerHTML = "$" + housePrice + "/month";
  const likes = document.createElement("label");
  infoContainer.appendChild(likes);
  likes.innerHTML = houseLikes + " &#11014";
  const btnGroupVertical = document.createElement("div");
  listingContainer.appendChild(btnGroupVertical);
  btnGroupVertical.classList.add("btn-group-vertical");
  const likeButton = document.createElement("button");
  btnGroupVertical.appendChild(likeButton);
  likeButton.type = "button";
  likeButton.classList.add("btn");
  likeButton.classList.add("btn-secondary");
  likeButton.innerHTML = "&#11014";
  likeButton.addEventListener("click", async () => {
    const s = await (await fetch("/likeListing", {
      method: "POST",
      body: JSON.stringify({
        username: window.sessionStorage.getItem("user"),
        id: (houseAddress + houseLandlord).split(" ").join("").toLowerCase(),
        category: "housing",
        address: houseAddress
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })).json();
    likes.innerHTML = s.result + " &#11014";
  });
  const readReviewsButton = document.createElement("button");
  btnGroupVertical.appendChild(readReviewsButton);
  readReviewsButton.type = "button";
  readReviewsButton.classList.add("btn");
  readReviewsButton.classList.add("btn-secondary");
  readReviewsButton.innerHTML = "Read Reviews";
  readReviewsButton.addEventListener("click", () => {
    window.sessionStorage.setItem("address", address.innerHTML);
    window.sessionStorage.setItem("landlord", landlord.innerHTML.substring(10));
    location.href = "/housing-read-reviews";
  });
  const writeReviewButton = document.createElement("button");
  btnGroupVertical.appendChild(writeReviewButton);
  writeReviewButton.type = "button";
  writeReviewButton.classList.add("btn");
  writeReviewButton.classList.add("btn-secondary");
  writeReviewButton.innerHTML = "Write Review";
  writeReviewButton.addEventListener("click", () => {
    window.sessionStorage.setItem("address", address.innerHTML);
    window.sessionStorage.setItem("landlord", landlord.innerHTML.substring(10));
    location.href = "/housing-write-review";
  });
}