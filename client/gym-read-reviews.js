"use strict";

const name = window.sessionStorage.getItem("name");
document.getElementById("heading").innerHTML = name + " Reviews";
addReviews();

async function addReviews() {
  const reviews = await (await fetch("/getGymReviews", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      address: window.sessionStorage.getItem("address")
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

function createReviews(gymDescription, gymPrice, userName) {
  const listGroupItem = document.createElement("li");
  document.getElementById("listGroup").appendChild(listGroupItem);
  listGroupItem.classList.add("list-group-item");
  const reviewContainer = document.createElement("div");
  listGroupItem.appendChild(reviewContainer);
  reviewContainer.classList.add("review-container");
  const description = document.createElement("h6");
  reviewContainer.appendChild(description);
  description.innerHTML = gymDescription;
  const price = document.createElement("h6");
  reviewContainer.appendChild(price);
  price.innerHTML = "$" + gymPrice + "/month";
  const user = document.createElement("h6");
  reviewContainer.appendChild(user);
  user.innerHTML = "User: " + userName;
}