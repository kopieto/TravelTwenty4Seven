document.querySelector("#forgot").addEventListener("click", function (e) {
   const body = document.querySelector(".login-holder");
   const form = body.appendChild(document.createElement("form"));
   const div = form.appendChild(document.createElement("div"));
   const input = div.appendChild(document.createElement("input"));
   const btn = div.appendChild(document.createElement("button"));

   form.setAttribute("action", "/users/password");
   form.setAttribute("id", "fp");

   div.setAttribute("class", "login-element");

   input.setAttribute("type", "email");
   input.setAttribute("placeholder", "email");
   input.setAttribute("name", "email");

   btn.setAttribute("class", "btn")
   btn.setAttribute("form", "fp")
   btn.textContent = "Send"
})