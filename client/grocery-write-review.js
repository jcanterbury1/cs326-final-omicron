"use strict";

const name = window.sessionStorage.getItem("name");
document.getElementById("heading").innerHTML = "Write a review for " + name + ":";

let price = 0;
document.getElementById("dollar-5").addEventListener("click", () => {
  price = 5;
});
document.getElementById("dollar-4").addEventListener("click", () => {
  price = 4;
});
document.getElementById("dollar-3").addEventListener("click", () => {
  price = 3;
});
document.getElementById("dollar-2").addEventListener("click", () => {
  price = 2;
});
document.getElementById("dollar-1").addEventListener("click", () => {
  price = 1;
});
document.getElementById("submit-review").addEventListener("click", () => {
  writeReview();
});

async function writeReview() {
  if(document.getElementById("comment").value === "" || price === 0) {
    return;
  }
  await fetch("/writeReview", {
    method: "POST",
    body: JSON.stringify({
      category: "grocery",
      id: name + "|" + window.sessionStorage.getItem("address"),
      description: document.getElementById("comment").value,
      price: price,
      username: window.sessionStorage.getItem("user")
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  location.href = "grocery-listings";
}