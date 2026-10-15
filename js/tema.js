/* Figuras de acción - modo claro / oscuro. El valor inicial lo pone el script del <head>; aquí se maneja el botón. */
(function () {
  var B = window.Brota, qs = B.qs;
  var btn = qs("#btnTema");
  if (!btn) return;
  function pintar() {
    var oscuro = document.documentElement.getAttribute("data-tema") === "dark";
    btn.setAttribute("aria-label", B.lang === "en" ? (oscuro ? "Switch to light mode" : "Switch to dark mode") : (oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"));
  }
  btn.addEventListener("click", function () {
    var t = document.documentElement.getAttribute("data-tema") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-tema", t);
    B.setS("tema", t);
    pintar();
  });
  B.hooks.push(pintar);
  pintar();
})();
