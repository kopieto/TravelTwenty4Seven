document.querySelector("#update-options").addEventListener("change", function (e)  {

 if (this.value === "password") {
     document.querySelector("#update").setAttribute("type", "password");
     document.querySelector("#update").setAttribute("name", this.value);
     document.querySelector("#update").setAttribute("placeholder", this.value);



 } else if(this.value === "email") {
    document.querySelector("#update").setAttribute("type","email");
    document.querySelector("#update").setAttribute("name", this.value);
    document.querySelector("#update").setAttribute("placeholder", this.value);

 } else {
    document.querySelector("#update").setAttribute("type", "text");
    document.querySelector("#update").setAttribute("name", this.value);
    document.querySelector("#update").setAttribute("placeholder", this.value);

 }
})