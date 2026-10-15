/* Figuras de acción - música de fondo con botón de play/pausa.
   1) Si existe audio/musica.mp3, suena ese archivo en bucle.
   2) Si no existe, genera una melodía suave y tranquila con Web Audio (sin archivos ni derechos de autor).
   Los navegadores bloquean el sonido automático: la música empieza cuando la persona pulsa el botón.
   La preferencia (sonando / en pausa) se recuerda entre páginas. */
(function () {
  var B = window.Brota, qs = B.qs;
  var btn = qs("#btnMusica");
  if (!btn) return;

  var audio = new Audio("audio/musica.mp3");
  audio.loop = true; audio.volume = 0.35;
  var ctx = null, master = null, timer = null, modo = null, sonando = false;

  function pintar() {
    btn.setAttribute("aria-pressed", sonando ? "true" : "false");
    btn.setAttribute("aria-label", B.lang === "en" ? (sonando ? "Pause music" : "Play music") : (sonando ? "Pausar música" : "Reproducir música"));
  }

  /* ----- melodía generada ----- */
  var NOTAS = [220, 261.63, 293.66, 329.63, 392, 440, 523.25];   // La menor pentatónica
  function montarGenerador() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.16;
    var eco = ctx.createDelay(1); eco.delayTime.value = 0.42;
    var fb = ctx.createGain(); fb.gain.value = 0.38;
    eco.connect(fb); fb.connect(eco);
    master.connect(ctx.destination); master.connect(eco); eco.connect(ctx.destination);
    [110, 164.81].forEach(function (f, i) {              // colchón grave constante
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f; o.detune.value = i ? 4 : -4; g.gain.value = 0.35;
      o.connect(g); g.connect(master); o.start();
    });
    return true;
  }
  function nota() {
    if (!ctx || ctx.state !== "running") return;
    var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    o.type = "sine"; o.frequency.value = NOTAS[Math.floor(Math.random() * NOTAS.length)];
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 3);
  }
  function arrancarGenerado() {
    if (!ctx && !montarGenerador()) return Promise.reject();
    return ctx.resume().then(function () {
      if (ctx.state !== "running") throw new Error("bloqueado");
      modo = "gen"; clearInterval(timer); nota(); timer = setInterval(nota, 1900);
    });
  }

  /* ----- control ----- */
  function iniciar() {
    var guardado = parseFloat(B.getS("musicaPos"));
    if (modo !== "gen") {
      if (guardado && isFinite(guardado)) { try { audio.currentTime = guardado; } catch (e) {} }
      return audio.play().then(function () { modo = "archivo"; })
        .catch(function (err) {
          if (err && err.name === "NotAllowedError") throw err;   // bloqueado por el navegador, no por falta de archivo
          return arrancarGenerado();                              // no hay audio/musica.mp3 -> melodía generada
        });
    }
    return arrancarGenerado();
  }
  function detener() {
    audio.pause(); clearInterval(timer);
    if (ctx) ctx.suspend();
  }
  function encender() {
    return iniciar().then(function () { sonando = true; B.setS("musica", "1"); pintar(); });
  }
  function apagar() { detener(); sonando = false; B.setS("musica", "0"); pintar(); }

  btn.addEventListener("click", function () { if (sonando) apagar(); else encender().catch(function () {}); });
  window.addEventListener("pagehide", function () { if (modo === "archivo") B.setS("musicaPos", String(audio.currentTime)); });

  /* Si la persona la dejó sonando en otra página, intenta seguir; si el navegador lo bloquea, espera al primer toque. */
  if (B.getS("musica") === "1") {
    encender().catch(function () {
      var seguir = function () { document.removeEventListener("pointerdown", seguir); document.removeEventListener("keydown", seguir); encender().catch(function () {}); };
      document.addEventListener("pointerdown", seguir); document.addEventListener("keydown", seguir);
    });
  }

  B.hooks.push(pintar);
  pintar();
})();
