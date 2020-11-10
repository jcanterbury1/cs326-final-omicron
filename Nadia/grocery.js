const name = 'big y';
const category = 'Grocery';
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

function writeReview(category, name, review, price){
    fetch('/groceryReview', {
        method: 'POST',
        headers: {
            'content-type': 'application/JSON',
        },
        body: JSON.stringify({'category': category, 'name': name, 'review': review, 'price': price}),
    })
    .then(data=>{
        console.log('saved review succesfully', data);
    })
    .catch((error)=> {
        console.error('Error:', error);
    });
};

//on submit, add price, review, gym name and address to datatable
document.getElementById("submit-review").addEventListener("click", ()=>{
    const review = document.getElementById("comment").value;
    writeReview(category, name, review, price);
});
