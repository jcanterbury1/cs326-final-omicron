"use strict";

addName();

async function addName() {
  const name = await (await fetch("http://localhost:8000/getName")).json();
  document.getElementById("heading").innerHTML = "Write a review for " + name.name + ":";
}

const name = "laundro";
const category = "laundromat";

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
//on submit, add price, review, gym name and address to datatable
document.getElementById("submit-review").addEventListener("click", () => {
  const review = document.getElementById("comment").value;
  const price = document.getElementById("price").value;
  writeReview(category, name, review, price);
});