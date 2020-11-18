"use strict";

addName();
addReviews();

async function addName() {
  const name = await (await fetch("http://localhost:8000/getName")).json();
  document.getElementById("heading").innerHTML = name.name + " Reviews";
}

async function addReviews() {
  const reviews = await (await fetch("http://localhost:8000/getGroceryReviews")).json();
  const listGroup = document.createElement("ul");
  document.getElementById("container").appendChild(listGroup);
  listGroup.id = "listGroup";
  listGroup.classList.add("list-group");
  if(reviews.length === 0) {
    listGroup.appendChild(document.createElement("br"));
    const text = document.createElement("h2");
    listGroup.appendChild(text);
    text.innerHTML = "No Listings";
    text.style.textAlign = "center";
  } else {
    for(let i = 0; i < reviews.length; i++) {
      createReviews(reviews[i].description, reviews[i].price, reviews[i].user);
    }
  }
}

function createReviews(storeDescription, storePrice, userName) {
  const listGroupItem = document.createElement("li");
  document.getElementById("listGroup").appendChild(listGroupItem);
  listGroupItem.classList.add("list-group-item");
  const reviewContainer = document.createElement("div");
  listGroupItem.appendChild(reviewContainer);
  reviewContainer.classList.add("review-container");
  const description = document.createElement("h6");
  reviewContainer.appendChild(description);
  description.innerHTML = storeDescription;
  const price = document.createElement("h6");
  reviewContainer.appendChild(price);
  let s = "";
  for(let i = 0; i < storePrice; i++) {
    s += "$";
  }
  price.innerHTML = s;
  const user = document.createElement("h6");
  reviewContainer.appendChild(user);
  user.innerHTML = "User: " + userName;
}