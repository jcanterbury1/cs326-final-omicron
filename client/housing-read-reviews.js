"use strict";

const address = window.sessionStorage.getItem("address");
document.getElementById("heading").innerHTML = address + " Reviews";
addReviews();

async function addReviews() {
  const reviews = await (await fetch("/getHousingReviews", {
    method: "POST",
    body: JSON.stringify({
      address: address,
      landlord: window.sessionStorage.getItem("landlord")
    }),
    headers: {
      "Content-Type": "application/json",
    }
  })).json();
  const listGroup = document.createElement("ul");
  document.getElementById("container").appendChild(listGroup);
  listGroup.id = "listGroup";
  listGroup.classList.add("list-group");
  if(reviews.length === 0) {
    listGroup.appendChild(document.createElement("br"));
    const text = document.createElement("h2");
    listGroup.appendChild(text);
    text.innerHTML = "No Reviews";
    text.style.textAlign = "center";
  } else {
    for(let i = 0; i < reviews.length; i++) {
      createReviews(reviews[i].description, reviews[i].price, reviews[i].username);
    }
  }
}

function createReviews(housingDescription, housingPrice, userName) {
  const listGroupItem = document.createElement("li");
  document.getElementById("listGroup").appendChild(listGroupItem);
  listGroupItem.classList.add("list-group-item");
  const reviewContainer = document.createElement("div");
  listGroupItem.appendChild(reviewContainer);
  reviewContainer.classList.add("review-container");
  const description = document.createElement("h6");
  reviewContainer.appendChild(description);
  description.innerHTML = housingDescription;
  const price = document.createElement("h6");
  reviewContainer.appendChild(price);
  price.innerHTML = "$" + housingPrice + "/month";
  const user = document.createElement("h6");
  reviewContainer.appendChild(user);
  user.innerHTML = "User: " + userName;
}