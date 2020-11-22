"use strict";

const address = window.sessionStorage.getItem("address");
document.getElementById("heading").innerHTML = "Write a review for " + address + ":";

document.getElementById("submit-review").addEventListener("click", () => {
  writeReview();
});

async function writeReview() {
  let price = document.getElementById("price").value;
  let s = "";
  let flag = false;
  for(let i = 0; i < price.length; i++) {
    if("1234567890".indexOf(price[i]) !== -1) {
      flag = true;
      s += price[i];
    } else if(flag) {
      break;
    }
  }
  price = parseInt(s);
  if(document.getElementById("comment").value === "") {
    return;
  }
  await fetch("/writeReview", {
    method: "POST",
    body: JSON.stringify({
      category: "housing",
      id: address + "|" + window.sessionStorage.getItem("landlord"),
      description: document.getElementById("comment").value,
      price: price,
      username: window.sessionStorage.getItem("user")
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  location.href = "/housing-listings";
}