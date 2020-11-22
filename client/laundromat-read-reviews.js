"use strict";

const name = window.sessionStorage.getItem("name");
document.getElementById("heading").innerHTML = name + " Reviews";
addReviews();

async function addReviews() {
  const reviews = await (await fetch("/getLaundromatReviews", {
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

function createReviews(laundromatDescription, laundromatPrice, userName) {
  const listGroupItem = document.createElement("li");
  document.getElementById("listGroup").appendChild(listGroupItem);
  listGroupItem.classList.add("list-group-item");
  const reviewContainer = document.createElement("div");
  listGroupItem.appendChild(reviewContainer);
  reviewContainer.classList.add("review-container");
  const description = document.createElement("h6");
  reviewContainer.appendChild(description);
  description.innerHTML = laundromatDescription;
  const price = document.createElement("h6");
  reviewContainer.appendChild(price);
  price.innerHTML = "$" + laundromatPrice + "/load";
  const user = document.createElement("h6");
  reviewContainer.appendChild(user);
  user.innerHTML = "User: " + userName;
}