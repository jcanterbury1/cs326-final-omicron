"use strict";

addName();

async function addName() {
  const name = await (await fetch("http://localhost:8000/getName")).json();
  document.getElementById("heading").innerHTML = "Write a review for " + name.name + ":";
}

let price = 0;
const name = "Planet Fitness";
const category = "Gym";
//assign price based on dollar sign
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

//on submit, add price, review, gym name and address to datatable
function writeReview(category, name, review, price) {
  fetch("/writeReview", {
      method: "POST",
      headers: {
        "content-type": "application/JSON",
      },
      body: JSON.stringify({ "category": category, "name": name, "review": review, "price": price }),
    })
    .then(data => {
      console.log("saved review succesfully", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
document.getElementById("submit-review").addEventListener("click", () => {
  const review = document.getElementById("comment").value;
  writeReview(category, name, review, price);
});