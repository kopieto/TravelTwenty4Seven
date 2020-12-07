const isToken = localStorage.getItem("t247");

if (isToken) {
    const maxAge = 1000 * 60 * 60 * 24;

    const loginIcon = document.querySelector("#login-icon");
    const logTag = document.querySelector("#login");

    document.cookie = `t247=${isToken}; max-age=${maxAge}`

    loginIcon.setAttribute("href","/users/me");

    logTag.textContent = "Logout";
    logTag.setAttribute("href", "/users/logout");

    logTag.addEventListener("click", () => {
        localStorage.removeItem("t247");

    });
} else {
    document.cookie = "t247=; max-age=1"
}