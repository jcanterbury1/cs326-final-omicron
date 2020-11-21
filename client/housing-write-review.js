"use strict";

addName();

async function addName() {
  const name = await (await fetch("http://localhost:8000/getName")).json();
  document.getElementById("heading").innerHTML = "Write a review for " + name.name + ":";
};

//const name = "Hobart";
const category = "Housing";

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
          price: document.getElementById("price").value,
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