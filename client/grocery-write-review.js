"use strict";

//const { name } = require("faker");


addName();

async function addName() {
  const name = await (await fetch("http://localhost:8000/getName")).json();
  document.getElementById("heading").innerHTML = "Write a review for " + name.name + ":";
}

//const name = "big y";
const category = "Grocery";
let price = 0;
//link submit button to reviews page
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

async function writeReview(){
  const response = await fetch('/write-grocery-review', {
      method: 'POST',
      headers: {
          'content-type': 'application/JSON',
      },
      body: JSON.stringify({
          category: category,
          name: name,
          review: document.getElementById("comment").value,
          price: price,
      })
  });

  if (!response.ok) {
      console.error("Could not write review.");
  }
  else{
    console.log("wrote review");
  }
};

//on submit, add price, review, gym name and address to datatable
document.getElementById("submit-review").addEventListener("click", () => {
  writeReview();
});