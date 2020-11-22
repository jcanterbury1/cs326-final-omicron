"use strict";

addListings();

async function addListings() {
  const listings = await (await fetch("/getTrending")).json();
  let box = document.getElementById("housing");
  let label = document.createElement("h1");
  label.innerHTML = "Housing";
  box.appendChild(label);
  box.appendChild(document.createElement("br"));
  if(listings[0].length === 0) {
    label = document.createElement("h2");
    label.innerHTML = "None";
    box.appendChild(label);
  } else {
    const address = document.createElement("h2");
    address.innerHTML = listings[0][0].address;
    box.appendChild(address);
    box.appendChild(document.createElement("br"));
    const landlord = document.createElement("h4");
    landlord.innerHTML = "Landlord: " + listings[0][0].landlord;
    box.appendChild(landlord);
    box.appendChild(document.createElement("br"));
    const price = document.createElement("h4");
    const avg = await (await fetch("/getPrice", {
      method: "POST",
      body: JSON.stringify({
        category: "housing",
        id: listings[0][0].address + "|" + listings[0][0].landlord
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })).json();
    price.innerHTML = "$" + avg.avg + "/month";
    box.appendChild(price);
    box.appendChild(document.createElement("br"));
    const likes = document.createElement("h4");
    likes.innerHTML = listings[0][0].likes + " &#11014";
    box.appendChild(likes);
  }
  box = document.getElementById("grocery");
  label = document.createElement("h1");
  label.innerHTML = "Grocery Stores";
  box.appendChild(label);
  box.appendChild(document.createElement("br"));
  if(listings[1].length === 0) {
    label = document.createElement("h2");
    label.innerHTML = "None";
    box.appendChild(label);
  } else {
    const name = document.createElement("h2");
    name.innerHTML = listings[1][0].name;
    box.appendChild(name);
    box.appendChild(document.createElement("br"));
    const address = document.createElement("h4");
    address.innerHTML = listings[1][0].address;
    box.appendChild(address);
    box.appendChild(document.createElement("br"));
    const price = document.createElement("h4");
    const avg = await (await fetch("/getPrice", {
      method: "POST",
      body: JSON.stringify({
        category: "grocery",
        id: listings[1][0].name + "|" + listings[1][0].address
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })).json();
    let s = "";
    for(let i = 0; i < avg.avg; i++) {
      s += "$";
    }
    price.innerHTML = s;
    box.appendChild(price);
    box.appendChild(document.createElement("br"));
    const likes = document.createElement("h4");
    likes.innerHTML = listings[1][0].likes + " &#11014";
    box.appendChild(likes);
  }
  box = document.getElementById("laundromat");
  label = document.createElement("h1");
  label.innerHTML = "Laundromats";
  box.appendChild(label);
  box.appendChild(document.createElement("br"));
  if(listings[2].length === 0) {
    label = document.createElement("h2");
    label.innerHTML = "None";
    box.appendChild(label);
  } else {
    const name = document.createElement("h2");
    name.innerHTML = listings[2][0].name;
    box.appendChild(name);
    box.appendChild(document.createElement("br"));
    const address = document.createElement("h4");
    address.innerHTML = listings[2][0].address;
    box.appendChild(address);
    box.appendChild(document.createElement("br"));
    const price = document.createElement("h4");
    const avg = await (await fetch("/getPrice", {
      method: "POST",
      body: JSON.stringify({
        category: "laundromat",
        id: listings[2][0].name + "|" + listings[2][0].address
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })).json();
    price.innerHTML = "$" + avg.avg + "/load";
    box.appendChild(price);
    box.appendChild(document.createElement("br"));
    const likes = document.createElement("h4");
    likes.innerHTML = listings[2][0].likes + " &#11014";
    box.appendChild(likes);
  }
  box = document.getElementById("gym");
  label = document.createElement("h1");
  label.innerHTML = "Gyms";
  box.appendChild(label);
  box.appendChild(document.createElement("br"));
  if(listings[3].length === 0) {
    label = document.createElement("h2");
    label.innerHTML = "None";
    box.appendChild(label);
  } else {
    const name = document.createElement("h2");
    name.innerHTML = listings[3][0].name;
    box.appendChild(name);
    box.appendChild(document.createElement("br"));
    const address = document.createElement("h4");
    address.innerHTML = listings[3][0].address;
    box.appendChild(address);
    box.appendChild(document.createElement("br"));
    const price = document.createElement("h4");
    const avg = await (await fetch("/getPrice", {
      method: "POST",
      body: JSON.stringify({
        category: "gym",
        id: listings[3][0].name + "|" + listings[3][0].address
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })).json();
    price.innerHTML = "$" + avg.avg + "/month";
    box.appendChild(price);
    box.appendChild(document.createElement("br"));
    const likes = document.createElement("h4");
    likes.innerHTML = listings[3][0].likes + " &#11014";
    box.appendChild(likes);
  }
}