//link submit button to reviews page 
document.getElementById("dollar-5").addEventListener("click", ()=>{
    console.log("5");
});
document.getElementById("dollar-4").addEventListener("click", ()=>{
    console.log("4");
});
document.getElementById("dollar-3").addEventListener("click", ()=>{
    console.log("3");
});
document.getElementById("dollar-2").addEventListener("click", ()=>{
    console.log("2");
});
document.getElementById("dollar-1").addEventListener("click", ()=>{
    console.log("1");
});

//on submit, add price, review, gym name and address to datatable
document.getElementById("submit-review").addEventListener("click", ()=>{
    const review = document.getElementById("comment").value;
});