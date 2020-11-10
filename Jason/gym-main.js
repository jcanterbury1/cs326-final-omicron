document.getElementById("b1").addEventListener("click", function() {
  let s = document.getElementById("likes1").innerHTML;
  const likes = parseInt(s.substring(0, s.indexOf(" "))) + 1;
  document.getElementById("likes1").innerHTML = likes + s.substring(s.indexOf(" "));
});

document.getElementById("b2").addEventListener("click", function() {
  let s = document.getElementById("likes2").innerHTML;
  const likes = parseInt(s.substring(0, s.indexOf(" "))) + 1;
  document.getElementById("likes2").innerHTML = likes + s.substring(s.indexOf(" "));
});

document.getElementById("b3").addEventListener("click", function() {
  let s = document.getElementById("likes3").innerHTML;
  const likes = parseInt(s.substring(0, s.indexOf(" "))) + 1;
  document.getElementById("likes3").innerHTML = likes + s.substring(s.indexOf(" "));
});