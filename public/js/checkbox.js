const checkbox = document.querySelector("#unhide");
console.log(document.body.clientWidth)

checkbox.addEventListener("click", function (e) {
    // e.preventDefault();
    
    document.querySelector("#parcel-info").classList.toggle("hide");


    if (document.body.clientWidth < 600) {
        document.querySelector("#pi").classList.toggle("hide");
    } else {
        document.querySelector('.back-btn').classList.toggle("hide")
    }

})