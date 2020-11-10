let price = 0;

//assign price based on dollar sign
document.getElementById("dollar-5").addEventListener("click", ()=>{
    price = 5;
});
document.getElementById("dollar-4").addEventListener("click", ()=>{
    price = 4; 
});
document.getElementById("dollar-3").addEventListener("click", ()=>{
    price = 3;
});
document.getElementById("dollar-2").addEventListener("click", ()=>{
    price = 2;
});
document.getElementById("dollar-1").addEventListener("click", ()=>{
    price = 1;
});

//on submit, add price, review, gym name and address to datatable

document.getElementById("submit-review").addEventListener("click", ()=>{
    const review = document.getElementById("comment").value;
});
