/* Figuras de acción - selector de idioma Español / English.
   Cada texto traducible lleva su versión en inglés en data-en="..." (y data-en-aria-label, data-en-alt, data-en-placeholder).
   Al cambiar de idioma también se vuelven a dibujar el cuestionario, las herramientas y los avisos (B.hooks). */
(function () {
  var B = window.Brota, qs = B.qs, qsa = B.qsa;
  var ATTRS = [["aria-label", "enAriaLabel"], ["placeholder", "enPlaceholder"], ["alt", "enAlt"], ["title", "enTitle"]];

  function aplicar(l, guardar) {
    B.lang = l;
    document.documentElement.lang = l;
    qsa("[data-en]").forEach(function (el) {
      if (el.dataset.es === undefined) el.dataset.es = el.tagName === "TITLE" ? el.textContent : el.innerHTML;
      var v = l === "en" ? el.dataset.en : el.dataset.es;
      if (el.tagName === "TITLE") el.textContent = v; else el.innerHTML = v;
    });
    ATTRS.forEach(function (a) {
      qsa("[data-en-" + a[0] + "]").forEach(function (el) {
        var esKey = "es" + a[1].slice(2);
        if (el.dataset[esKey] === undefined) el.dataset[esKey] = el.getAttribute(a[0]);
        el.setAttribute(a[0], l === "en" ? el.dataset[a[1]] : el.dataset[esKey]);
      });
    });
    var bi = qs("#btnIdioma");
    if (bi) {
      bi.textContent = l === "en" ? "ES" : "EN";
      bi.setAttribute("aria-label", l === "en" ? "Cambiar a español" : "Switch to English");
    }
    B.hooks.forEach(function (fn) { fn(); });
    if (guardar) B.setS("idioma", l);
  }

  var btn = qs("#btnIdioma");
  if (btn) btn.addEventListener("click", function () { aplicar(B.lang === "es" ? "en" : "es", true); });
  aplicar(B.getS("idioma") === "en" ? "en" : "es", false);
})();
