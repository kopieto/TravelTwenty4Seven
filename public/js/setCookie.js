if (!localStorage.t247) {
  const t247 = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('t247'))
    .split('=')[1];

  localStorage.setItem("t247", t247);
}