/* Figuras de acción - código común: ayudas, demos de JS y jQuery, formulario, carrusel y cuestionario.
   Cada bloque solo actúa si la página tiene los elementos que necesita. */
window.Brota = (function () {
  var B = { lang: "es", hooks: [] };   // hooks: funciones que se ejecutan al cambiar de idioma
  B.qs = function (s, r) { return (r || document).querySelector(s); };
  B.qsa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  B.getS = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  B.setS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  B.L = function (pair) { return pair[B.lang === "en" ? 1 : 0]; };
  return B;
})();

/* ---------- Demo de JavaScript (contador) y de jQuery ---------- */
(function () {
  var B = window.Brota, qs = B.qs;
  var btn = qs("#regar");
  if (btn) {
    var riegos = 0;
    var pintar = function () { btn.textContent = (B.lang === "en" ? "Figures collected: " : "Figuras coleccionadas: ") + riegos; };
    btn.addEventListener("click", function () { riegos = riegos + 1; pintar(); });
    B.hooks.push(pintar);
  }
  var caja = qs("#caja");
  if (caja) {
    if (window.jQuery) {
      var $c = window.jQuery("#caja");
      window.jQuery("#mostrar").on("click", function () { caja.hidden = false; $c.hide().fadeIn(); });
      window.jQuery("#alternar").on("click", function () { if (caja.hidden) { caja.hidden = false; $c.hide(); } $c.slideToggle(); });
    } else {
      qs("#mostrar").addEventListener("click", function () { caja.hidden = false; });
      qs("#alternar").addEventListener("click", function () { caja.hidden = !caja.hidden; });
    }
  }
})();

/* ---------- Formulario de contacto ---------- */
(function () {
  var B = window.Brota, qs = B.qs, L = B.L;
  if (!qs("#formularioContacto")) return;
  /* IMPORTANTE: el webhook anterior quedó público en el código. Bórralo en Discord (Editar canal > Integraciones > Webhooks),
     crea uno nuevo y pega aquí su URL. Aun así, en un sitio estático esta URL siempre será visible para quien abra la página. */
  var WEBHOOK_URL = "PEGA_AQUI_TU_NUEVO_WEBHOOK";
  var estado = null;
  var ICO_OK = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1F2A30" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICO_ERR = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1F2A30" stroke-width="3.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  function pintarEstado() {
    var box = qs("#estadoForm");
    if (!estado) { box.innerHTML = ""; return; }
    var ok = estado === "ok";
    var msg = ok ? ["¡Tu mensaje se envió perfectamente!", "Your message was sent successfully!"] : ["Tu mensaje no se pudo enviar correctamente.", "Your message could not be sent properly."];
    box.innerHTML = '<div class="estado ' + (ok ? "ok" : "err") + '"><span class="marca-i">' + (ok ? ICO_OK : ICO_ERR) + '</span><span>' + L(msg) + '</span></div>';
  }
  qs("#formularioContacto").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = this;
    var datos = { embeds: [{ title: "Nuevo mensaje desde la página de figuras de acción", color: 3447003, fields: [
      { name: "Nombre", value: qs("#nombre").value, inline: true },
      { name: "Email", value: qs("#email").value, inline: true },
      { name: "Mensaje", value: qs("#mensaje").value }], timestamp: new Date().toISOString() }] };
    fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) })
      .then(function (r) { if (r.ok) { estado = "ok"; f.reset(); } else estado = "err"; pintarEstado(); })
      .catch(function () { estado = "err"; pintarEstado(); });
  });


  B.hooks.push(pintarEstado);
})();

/* ---------- Fotos del inicio y carrusel ---------- */
(function () {
  var B = window.Brota, qs = B.qs, qsa = B.qsa;
  if (!qs("#hero")) return;
  /* ---------- fotos (si no existen, se queda la ilustración) ---------- */
  qsa("img.foto").forEach(function (img) {
    function ok() { img.hidden = false; img.parentNode.classList.add("con-foto"); }
    if (img.complete && img.naturalWidth) ok(); else img.addEventListener("load", ok);
  });

  /* ---------- carrusel ---------- */
  var slides = qsa(".slide"), puntos = qsa(".puntos button"), cur = 0, pausa = false;
  function ir(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("on", k === cur); });
    puntos.forEach(function (p, k) { p.setAttribute("aria-current", k === cur ? "true" : "false"); });
  }
  qs("#prev").addEventListener("click", function () { ir(cur - 1); });
  qs("#next").addEventListener("click", function () { ir(cur + 1); });
  puntos.forEach(function (p, k) { p.addEventListener("click", function () { ir(k); }); });
  var hero = qs("#hero");
  hero.addEventListener("mouseenter", function () { pausa = true; });
  hero.addEventListener("mouseleave", function () { pausa = false; });
  hero.addEventListener("focusin", function () { pausa = true; });
  hero.addEventListener("focusout", function () { pausa = false; });
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(function () { if (!pausa && !qs("#p-inicio").hidden && !document.hidden) ir(cur + 1); }, 5500);
  }


})();

/* ---------- Cuestionario ---------- */
(function () {
  var B = window.Brota, qs = B.qs, qsa = B.qsa, L = B.L;
  if (!qs("#quiz")) return;
  var QUIZ = [
    { q: ["¿Qué papel cumple CSS en una página web?", "What role does CSS play on a web page?"], a: 1, o: [["Da la estructura", "It provides the structure"], ["Da el estilo", "It provides the style"], ["Da el comportamiento", "It provides the behavior"], ["Guarda los datos", "It stores the data"]] },
    { q: ["¿Qué significa \"Vanilla\" en \"JavaScript Vanilla\"?", "What does \"Vanilla\" mean in \"Vanilla JavaScript\"?"], a: 0, o: [["JavaScript puro, sin librerías", "Plain JavaScript, with no libraries"], ["Una versión ligera de jQuery", "A lightweight version of jQuery"], ["Un framework de Google", "A Google framework"], ["Un tipo de hosting", "A type of hosting"]] },
    { q: ["¿Qué símbolo usa jQuery para seleccionar elementos?", "Which symbol does jQuery use to select elements?"], a: 1, o: [["#", "#"], ["$", "$"], ["@", "@"], ["&", "&"]] },
    { q: ["¿Qué método convierte un texto JSON en un objeto de JavaScript?", "Which method turns JSON text into a JavaScript object?"], a: 3, o: [["JSON.stringify()", "JSON.stringify()"], ["JSON.object()", "JSON.object()"], ["JSON.fetch()", "JSON.fetch()"], ["JSON.parse()", "JSON.parse()"]] },
    { q: ["En JSON, ¿cómo deben escribirse las claves?", "In JSON, how must keys be written?"], a: 2, o: [["Sin comillas", "Without quotes"], ["Con comillas simples", "With single quotes"], ["Siempre con comillas dobles", "Always with double quotes"], ["Entre corchetes", "Between square brackets"]] },
    { q: ["¿Qué tipo de hosting reserva una parte de un servidor solo para ti?", "Which type of hosting reserves part of a server just for you?"], a: 1, o: [["Compartido", "Shared"], ["VPS", "VPS"], ["Nube", "Cloud"], ["Subdominio", "Subdomain"]] },
    { q: ["¿Qué hace el DNS?", "What does DNS do?"], a: 0, o: [["Traduce un dominio a la dirección IP del servidor", "It translates a domain into the server's IP address"], ["Guarda los archivos HTML del sitio", "It stores the site's HTML files"], ["Hace más rápido el JavaScript", "It makes JavaScript faster"], ["Cambia los colores del sitio", "It changes the site's colors"]] },
    { q: ["En un sitio estático, ¿qué hace Vercel cada vez que haces un commit?", "On a static site, what does Vercel do every time you make a commit?"], a: 2, o: [["Compra un dominio .com", "It buys a .com domain"], ["Convierte el HTML en PDF", "It converts the HTML to PDF"], ["Copia los archivos a una red de servidores y te da una URL", "It copies the files to a server network and gives you a URL"], ["Borra el repositorio", "It deletes the repository"]] }
  ];
  var sel = QUIZ.map(function () { return null; });
  var revisado = false;

  function renderQuiz() {
    qs("#quiz").innerHTML = QUIZ.map(function (q, i) {
      return '<fieldset><legend>' + (i + 1) + '. ' + L(q.q) + '</legend>' + q.o.map(function (o, j) {
        return '<label class="op"><input type="radio" name="q' + i + '" value="' + j + '"' + (sel[i] === j ? " checked" : "") + '><span>' + L(o) + '</span></label>';
      }).join("") + '</fieldset>';
    }).join("");
    if (revisado) marcar();
  }
  function limpiarMarcas() { qsa("#quiz .op").forEach(function (l) { l.classList.remove("ok", "bad"); }); qs("#nota").textContent = ""; }
  function marcar() {
    var aciertos = 0;
    QUIZ.forEach(function (q, i) {
      var ops = qsa("fieldset", qs("#quiz"))[i].querySelectorAll(".op");
      ops[q.a].classList.add("ok");
      if (sel[i] === q.a) aciertos++; else if (sel[i] !== null) ops[sel[i]].classList.add("bad");
    });
    var msg = aciertos === 8 ? ["¡Perfecto!", "Perfect!"] : aciertos >= 6 ? ["¡Muy bien!", "Great job!"] : aciertos >= 4 ? ["Vas bien, repasa las páginas.", "You're getting there, review the pages."] : ["Repasa las páginas e inténtalo otra vez.", "Review the pages and try again."];
    qs("#nota").textContent = (B.lang === "en" ? "You got " + aciertos + " out of 8. " : "Sacaste " + aciertos + " de 8. ") + L(msg);
  }
  qs("#quiz").addEventListener("change", function (e) {
    var m = /^q(\d+)$/.exec(e.target.name || ""); if (!m) return;
    sel[+m[1]] = +e.target.value;
    if (revisado) { revisado = false; limpiarMarcas(); }
  });
  qs("#revisar").addEventListener("click", function () {
    var faltan = sel.filter(function (s) { return s === null; }).length;
    if (faltan) {
      qs("#nota").textContent = B.lang === "en" ? "You still have " + faltan + " question(s) to answer." : "Te faltan " + faltan + " pregunta(s) por responder.";
      return;
    }
    revisado = true; marcar();
  });


  B.hooks.push(renderQuiz);
  renderQuiz();
})();


/* Figuras de acción - código común: ayudas, demos de JS y jQuery, formulario, carrusel y cuestionario.
   Cada bloque solo actúa si la página tiene los elementos que necesita. */
window.Brota = (function () {
  var B = { lang: "es", hooks: [] };   // hooks: funciones que se ejecutan al cambiar de idioma
  B.qs = function (s, r) { return (r || document).querySelector(s); };
  B.qsa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  B.getS = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  B.setS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  B.L = function (pair) { return pair[B.lang === "en" ? 1 : 0]; };
  return B;
})();

/* ---------- Demo de JavaScript (contador) y de jQuery ---------- */
(function () {
  var B = window.Brota, qs = B.qs;
  var btn = qs("#regar");
  if (btn) {
    var riegos = 0;
    var pintar = function () { btn.textContent = (B.lang === "en" ? "Figures collected: " : "Figuras coleccionadas: ") + riegos; };
    btn.addEventListener("click", function () { riegos = riegos + 1; pintar(); });
    B.hooks.push(pintar);
  }
  var caja = qs("#caja");
  if (caja) {
    if (window.jQuery) {
      var $c = window.jQuery("#caja");
      window.jQuery("#mostrar").on("click", function () { caja.hidden = false; $c.hide().fadeIn(); });
      window.jQuery("#alternar").on("click", function () { if (caja.hidden) { caja.hidden = false; $c.hide(); } $c.slideToggle(); });
    } else {
      qs("#mostrar").addEventListener("click", function () { caja.hidden = false; });
      qs("#alternar").addEventListener("click", function () { caja.hidden = !caja.hidden; });
    }
  }
})();

/* ---------- Formulario de contacto ---------- */
(function () {
  var B = window.Brota, qs = B.qs, L = B.L;
  if (!qs("#formularioContacto")) return;
  /* IMPORTANTE: el webhook anterior quedó público en el código. Bórralo en Discord (Editar canal > Integraciones > Webhooks),
     crea uno nuevo y pega aquí su URL. Aun así, en un sitio estático esta URL siempre será visible para quien abra la página. */
  var WEBHOOK_URL = "https://discord.com/api/webhooks/1560028102430818436/XbhsrZycva-2cmntRjh2HdP7ydVULqwyZ6u9Ymyaf6oZxbCYQbF6OwhfUSd2682nRDxl";
  var estado = null;
  var ICO_OK = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1F2A30" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICO_ERR = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1F2A30" stroke-width="3.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  function pintarEstado() {
    var box = qs("#estadoForm");
    if (!estado) { box.innerHTML = ""; return; }
    var ok = estado === "ok";
    var msg = ok ? ["¡Tu mensaje se envió perfectamente!", "Your message was sent successfully!"] : ["Tu mensaje no se pudo enviar correctamente.", "Your message could not be sent properly."];
    box.innerHTML = '<div class="estado ' + (ok ? "ok" : "err") + '"><span class="marca-i">' + (ok ? ICO_OK : ICO_ERR) + '</span><span>' + L(msg) + '</span></div>';
  }
  qs("#formularioContacto").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = this;
    var datos = { embeds: [{ title: "Nuevo mensaje desde la página de figuras de acción", color: 3447003, fields: [
      { name: "Nombre", value: qs("#nombre").value, inline: true },
      { name: "Email", value: qs("#email").value, inline: true },
      { name: "Mensaje", value: qs("#mensaje").value }], timestamp: new Date().toISOString() }] };
    fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) })
      .then(function (r) { if (r.ok) { estado = "ok"; f.reset(); } else estado = "err"; pintarEstado(); })
      .catch(function () { estado = "err"; pintarEstado(); });
  });


  B.hooks.push(pintarEstado);
})();

/* ---------- Fotos del inicio y carrusel ---------- */
(function () {
  var B = window.Brota, qs = B.qs, qsa = B.qsa;
  if (!qs("#hero")) return;
  /* ---------- fotos (si no existen, se queda la ilustración) ---------- */
  qsa("img.foto").forEach(function (img) {
    function ok() { img.hidden = false; img.parentNode.classList.add("con-foto"); }
    if (img.complete && img.naturalWidth) ok(); else img.addEventListener("load", ok);
  });

  /* ---------- carrusel ---------- */
  var slides = qsa(".slide"), puntos = qsa(".puntos button"), cur = 0, pausa = false;
  function ir(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("on", k === cur); });
    puntos.forEach(function (p, k) { p.setAttribute("aria-current", k === cur ? "true" : "false"); });
  }
  qs("#prev").addEventListener("click", function () { ir(cur - 1); });
  qs("#next").addEventListener("click", function () { ir(cur + 1); });
  puntos.forEach(function (p, k) { p.addEventListener("click", function () { ir(k); }); });
  var hero = qs("#hero");
  hero.addEventListener("mouseenter", function () { pausa = true; });
  hero.addEventListener("mouseleave", function () { pausa = false; });
  hero.addEventListener("focusin", function () { pausa = true; });
  hero.addEventListener("focusout", function () { pausa = false; });
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(function () { if (!pausa && !qs("#p-inicio").hidden && !document.hidden) ir(cur + 1); }, 5500);
  }


})();

/* ---------- Cuestionario ---------- */
(function () {
  var B = window.Brota, qs = B.qs, qsa = B.qsa, L = B.L;
  if (!qs("#quiz")) return;
  var QUIZ = [
    { q: ["¿Qué papel cumple CSS en una página web?", "What role does CSS play on a web page?"], a: 1, o: [["Da la estructura", "It provides the structure"], ["Da el estilo", "It provides the style"], ["Da el comportamiento", "It provides the behavior"], ["Guarda los datos", "It stores the data"]] },
    { q: ["¿Qué significa \"Vanilla\" en \"JavaScript Vanilla\"?", "What does \"Vanilla\" mean in \"Vanilla JavaScript\"?"], a: 0, o: [["JavaScript puro, sin librerías", "Plain JavaScript, with no libraries"], ["Una versión ligera de jQuery", "A lightweight version of jQuery"], ["Un framework de Google", "A Google framework"], ["Un tipo de hosting", "A type of hosting"]] },
    { q: ["¿Qué símbolo usa jQuery para seleccionar elementos?", "Which symbol does jQuery use to select elements?"], a: 1, o: [["#", "#"], ["$", "$"], ["@", "@"], ["&", "&"]] },
    { q: ["¿Qué método convierte un texto JSON en un objeto de JavaScript?", "Which method turns JSON text into a JavaScript object?"], a: 3, o: [["JSON.stringify()", "JSON.stringify()"], ["JSON.object()", "JSON.object()"], ["JSON.fetch()", "JSON.fetch()"], ["JSON.parse()", "JSON.parse()"]] },
    { q: ["En JSON, ¿cómo deben escribirse las claves?", "In JSON, how must keys be written?"], a: 2, o: [["Sin comillas", "Without quotes"], ["Con comillas simples", "With single quotes"], ["Siempre con comillas dobles", "Always with double quotes"], ["Entre corchetes", "Between square brackets"]] },
    { q: ["¿Qué tipo de hosting reserva una parte de un servidor solo para ti?", "Which type of hosting reserves part of a server just for you?"], a: 1, o: [["Compartido", "Shared"], ["VPS", "VPS"], ["Nube", "Cloud"], ["Subdominio", "Subdomain"]] },
    { q: ["¿Qué hace el DNS?", "What does DNS do?"], a: 0, o: [["Traduce un dominio a la dirección IP del servidor", "It translates a domain into the server's IP address"], ["Guarda los archivos HTML del sitio", "It stores the site's HTML files"], ["Hace más rápido el JavaScript", "It makes JavaScript faster"], ["Cambia los colores del sitio", "It changes the site's colors"]] },
    { q: ["En un sitio estático, ¿qué hace Vercel cada vez que haces un commit?", "On a static site, what does Vercel do every time you make a commit?"], a: 2, o: [["Compra un dominio .com", "It buys a .com domain"], ["Convierte el HTML en PDF", "It converts the HTML to PDF"], ["Copia los archivos a una red de servidores y te da una URL", "It copies the files to a server network and gives you a URL"], ["Borra el repositorio", "It deletes the repository"]] }
  ];
  var sel = QUIZ.map(function () { return null; });
  var revisado = false;

  function renderQuiz() {
    qs("#quiz").innerHTML = QUIZ.map(function (q, i) {
      return '<fieldset><legend>' + (i + 1) + '. ' + L(q.q) + '</legend>' + q.o.map(function (o, j) {
        return '<label class="op"><input type="radio" name="q' + i + '" value="' + j + '"' + (sel[i] === j ? " checked" : "") + '><span>' + L(o) + '</span></label>';
      }).join("") + '</fieldset>';
    }).join("");
    if (revisado) marcar();
  }
  function limpiarMarcas() { qsa("#quiz .op").forEach(function (l) { l.classList.remove("ok", "bad"); }); qs("#nota").textContent = ""; }
  function marcar() {
    var aciertos = 0;
    QUIZ.forEach(function (q, i) {
      var ops = qsa("fieldset", qs("#quiz"))[i].querySelectorAll(".op");
      ops[q.a].classList.add("ok");
      if (sel[i] === q.a) aciertos++; else if (sel[i] !== null) ops[sel[i]].classList.add("bad");
    });
    var msg = aciertos === 8 ? ["¡Perfecto!", "Perfect!"] : aciertos >= 6 ? ["¡Muy bien!", "Great job!"] : aciertos >= 4 ? ["Vas bien, repasa las páginas.", "You're getting there, review the pages."] : ["Repasa las páginas e inténtalo otra vez.", "Review the pages and try again."];
    qs("#nota").textContent = (B.lang === "en" ? "You got " + aciertos + " out of 8. " : "Sacaste " + aciertos + " de 8. ") + L(msg);
  }
  qs("#quiz").addEventListener("change", function (e) {
    var m = /^q(\d+)$/.exec(e.target.name || ""); if (!m) return;
    sel[+m[1]] = +e.target.value;
    if (revisado) { revisado = false; limpiarMarcas(); }
  });
  qs("#revisar").addEventListener("click", function () {
    var faltan = sel.filter(function (s) { return s === null; }).length;
    if (faltan) {
      qs("#nota").textContent = B.lang === "en" ? "You still have " + faltan + " question(s) to answer." : "Te faltan " + faltan + " pregunta(s) por responder.";
      return;
    }
    revisado = true; marcar();
  });


  B.hooks.push(renderQuiz);
  renderQuiz();
})();