(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Menu mobile
  ------------------------------------------------------------------ */
  var menuToggle = $(".menu-toggle");
  var navMenu = $("#nav-links");

  function setMenu(open) {
    if (!menuToggle || !navMenu) return;
    navMenu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  /* ------------------------------------------------------------------
     Simulasi di hero
  ------------------------------------------------------------------ */
  var sceneNames = ["QR dikenali", "Menu terbuka", "Pilihan ditemukan", "Pembayaran selesai", "Pesanan diterima"];
  var sceneButtons = $$("[data-scene]");
  var screens = $$("[data-screen]");
  var ops = $$("[data-op]");
  var sceneCaption = $("#scene-caption");
  var sceneControls = $(".scene-controls");
  var sceneIndex = 0;
  var sceneTimer;

  function showScene(index) {
    sceneIndex = index;
    sceneButtons.forEach(function (button, i) {
      var active = i === index;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    screens.forEach(function (screen, i) { screen.classList.toggle("active", i === index); });
    ops.forEach(function (item, i) { item.classList.toggle("active", i <= index); });
    if (sceneCaption) sceneCaption.textContent = sceneNames[index];
  }

  function stopSceneTimer() {
    if (sceneTimer) window.clearInterval(sceneTimer);
    sceneTimer = null;
  }

  sceneButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      stopSceneTimer();
      if (sceneControls) sceneControls.classList.add("is-manual");
      showScene(index);
    });
  });

  if (reduceMotion) {
    if (sceneControls) sceneControls.classList.add("is-manual");
  } else {
    sceneTimer = window.setInterval(function () {
      showScene((sceneIndex + 1) % sceneButtons.length);
    }, 4800);
  }

  /* ------------------------------------------------------------------
     Tab peran (dengan thumb yang menggeser)
  ------------------------------------------------------------------ */
  var roleTabs = $$("[data-role]");
  var rolePanels = $$("[data-panel]");
  var roleSwitch = $(".role-switch");
  var roleThumb = $(".role-switch-thumb");

  function moveRoleThumb(tab, instant) {
    if (!roleThumb || !tab) return;
    if (instant) roleThumb.classList.add("instant");
    roleThumb.style.setProperty("--x", tab.offsetLeft + "px");
    roleThumb.style.setProperty("--w", tab.offsetWidth + "px");
    if (instant) {
      roleThumb.offsetWidth; // paksa reflow
      roleThumb.classList.remove("instant");
    }
  }

  function selectRole(tab, focus) {
    var selected = tab.getAttribute("data-role");
    roleTabs.forEach(function (item) {
      var active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.setAttribute("tabindex", active ? "0" : "-1");
    });
    rolePanels.forEach(function (panel) {
      var on = panel.getAttribute("data-panel") === selected;
      panel.hidden = !on;
      panel.classList.toggle("active", on);
    });
    moveRoleThumb(tab, false);
    if (focus) tab.focus();
  }

  roleTabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectRole(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = roleTabs[(i + 1) % roleTabs.length];
      if (e.key === "ArrowLeft") next = roleTabs[(i - 1 + roleTabs.length) % roleTabs.length];
      if (e.key === "Home") next = roleTabs[0];
      if (e.key === "End") next = roleTabs[roleTabs.length - 1];
      if (!next) return;
      e.preventDefault();
      selectRole(next, true);
    });
  });

  function syncRoleThumb() {
    moveRoleThumb($(".role-tab.active"), true);
  }

  /* ------------------------------------------------------------------
     Popover kontak
  ------------------------------------------------------------------ */
  var contactPopover = $("#contact-popover");
  var contactButtons = $$("[data-contact]");
  var closeContact = $(".close", contactPopover);

  function setContact(open) {
    contactPopover.classList.toggle("open", open);
    contactPopover.setAttribute("aria-hidden", open ? "false" : "true");
    contactButtons.forEach(function (button) {
      if (button.classList.contains("wa-float")) button.setAttribute("aria-expanded", open ? "true" : "false");
    });
    if (open) closeContact.focus();
  }

  contactButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      setContact(!contactPopover.classList.contains("open"));
    });
  });
  closeContact.addEventListener("click", function () { setContact(false); });
  contactPopover.addEventListener("click", function (event) { event.stopPropagation(); });
  document.addEventListener("click", function () {
    if (contactPopover.classList.contains("open")) setContact(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    setContact(false);
    setMenu(false);
  });

  /* ------------------------------------------------------------------
     Reveal saat scroll
  ------------------------------------------------------------------ */
  var revealItems = $$(".receipt-line, .pipe-node, .tl-step, .capability, .about-item, .scale-card, .faq-list details, .role-switch, .role-stage, .final-box");
  revealItems.forEach(function (item) {
    var siblings = item.parentElement ? Array.prototype.slice.call(item.parentElement.children) : [item];
    item.style.setProperty("--d", Math.min(siblings.indexOf(item), 4) * 0.08 + "s");
    item.classList.add("reveal");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  /* ------------------------------------------------------------------
     Navigasi: scroll halus + scroll-spy + indikator yang menggeser
     (tidak memakai CSS scroll-behavior agar tidak bentrok)
  ------------------------------------------------------------------ */
  var topbar = $(".topbar");
  var navLinks = $$(".nav-links a");
  var navIndicator = $(".nav-indicator");
  var navLinkBox = $("#nav-links");

  // semua section yang diamati: id -> index link navbar (-1 = tidak ada di navbar)
  var spySections = $$("main section[id]").map(function (section) {
    var index = -1;
    navLinks.forEach(function (link, i) {
      if (link.getAttribute("href") === "#" + section.id) index = i;
    });
    return { el: section, nav: index };
  });

  var activeNav = -2;      // -2 = belum diset
  var spyLocked = false;   // true selama scroll terprogram berjalan

  function setIndicator(index, instant) {
    if (!navIndicator || !navLinkBox) return;
    navLinks.forEach(function (link, i) { link.classList.toggle("active", i === index); });
    activeNav = index;

    if (index < 0) { navIndicator.classList.remove("ready"); return; }
    var link = navLinks[index];
    if (!link.offsetParent) return; // menu mobile tertutup: indikator tidak dipakai

    var firstShow = !navIndicator.classList.contains("ready");
    if (instant || firstShow) navIndicator.classList.add("instant");
    navIndicator.style.setProperty("--x", link.offsetLeft + 13 + "px");
    navIndicator.style.setProperty("--w", Math.max(18, link.offsetWidth - 26) + "px");
    navIndicator.classList.add("ready");
    if (instant || firstShow) {
      navIndicator.offsetWidth; // paksa reflow supaya posisi awal tidak ikut dianimasikan
      navIndicator.classList.remove("instant");
    }
  }

  function currentSectionNav() {
    var line = (topbar ? topbar.offsetHeight : 64) + 70; // garis acuan di bawah navbar
    var found = -1;
    for (var i = 0; i < spySections.length; i++) {
      if (spySections[i].el.getBoundingClientRect().top <= line) found = spySections[i].nav;
      else break;
    }
    // di ujung bawah halaman, section terakhir dianggap aktif
    return found;
  }

  var spyFrame = null;
  function runSpy() {
    spyFrame = null;
    if (spyLocked) return;
    var next = currentSectionNav();
    if (next !== activeNav) setIndicator(next, false);
  }
  function queueSpy() {
    if (spyFrame) return;
    spyFrame = window.requestAnimationFrame(runSpy);
  }

  /* --- scroll halus --- */
  var scrollFrame = null;

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function targetScrollTop(target) {
    var anchor = target.querySelector(".shell") || target;
    var bar = topbar ? topbar.getBoundingClientRect().bottom : 78;
    var top = anchor.getBoundingClientRect().top + window.scrollY;
    return Math.max(0, Math.round(top - bar - 28));
  }

  function cancelScroll() {
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
    if (spyLocked) { spyLocked = false; queueSpy(); }
  }

  function smoothScrollTo(target) {
    var start = window.scrollY;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var finish = Math.min(targetScrollTop(target), maxScroll);
    var distance = finish - start;
    if (Math.abs(distance) < 2) return;

    var duration = Math.min(1500, Math.max(800, 520 + Math.abs(distance) * 0.2));
    var startedAt = null;
    spyLocked = true;
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);

    function step(now) {
      if (startedAt === null) startedAt = now;
      var progress = Math.min(1, (now - startedAt) / duration);
      window.scrollTo(0, start + distance * ease(progress));
      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(step);
      } else {
        scrollFrame = null;
        spyLocked = false;
        queueSpy();
      }
    }
    scrollFrame = window.requestAnimationFrame(step);
  }

  // pengguna menggulir sendiri: hentikan animasi
  ["wheel", "touchstart", "mousedown"].forEach(function (name) {
    window.addEventListener(name, cancelScroll, { passive: true });
  });
  window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].indexOf(e.key) >= 0) cancelScroll();
  });

  $$("a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var hash = link.getAttribute("href");
      var target = hash.length > 1 ? document.querySelector(hash) : null;
      if (!target) return;
      event.preventDefault();
      setMenu(false);
      var navIndex = navLinks.indexOf(link);
      if (navIndex < 0) {
        var match = spySections.filter(function (s) { return s.el === target; })[0];
        navIndex = match ? match.nav : -1;
      }
      setIndicator(navIndex, false); // indikator langsung mulai meluncur, sambil halaman bergulir
      smoothScrollTo(target);
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    });
  });

  window.addEventListener("scroll", queueSpy, { passive: true });

  /* --- timeline "cara kerja" terisi mengikuti scroll --- */
  var timeline = $("#timeline");
  var tlSteps = timeline ? $$(".tl-step", timeline) : [];
  var tlFrame = null;

  function updateTimeline() {
    tlFrame = null;
    if (!timeline) return;
    var box = timeline.getBoundingClientRect();
    var marker = window.innerHeight * 0.62;
    var firstNode = $(".tl-node", tlSteps[0]);
    var lastNode = $(".tl-node", tlSteps[tlSteps.length - 1]);
    var startY = firstNode.getBoundingClientRect().top + 22;
    var endY = lastNode.getBoundingClientRect().top + 22;
    var fill = Math.max(0, Math.min(endY - startY, marker - startY));
    timeline.style.setProperty("--fill", fill + "px");
    tlSteps.forEach(function (step) {
      var node = $(".tl-node", step).getBoundingClientRect();
      step.classList.toggle("done", node.top + 22 <= marker);
    });
    void box;
  }
  function queueTimeline() {
    if (tlFrame) return;
    tlFrame = window.requestAnimationFrame(updateTimeline);
  }
  window.addEventListener("scroll", queueTimeline, { passive: true });

  /* --- sinkronisasi saat resize / font selesai dimuat --- */
  function syncAll() {
    if (activeNav >= 0) setIndicator(activeNav, true);
    syncRoleThumb();
    queueTimeline();
  }
  window.addEventListener("resize", syncAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncAll);

  function init() {
    syncRoleThumb();
    var spyStart = currentSectionNav();
    setIndicator(spyStart, true);
    queueTimeline();
  }
  window.addEventListener("load", function () {
    init();
    // buka langsung ke hash (mis. /#faq) dengan posisi yang benar
    if (window.location.hash.length > 1) {
      var t = document.querySelector(window.location.hash);
      if (t) window.scrollTo(0, targetScrollTop(t));
      queueSpy();
    }
  });
  init();
})();
