(function () {
  "use strict";

  /* ============================================================
     CONFIG — change everything in one place.
     ============================================================ */
  var CFG = {
    name: "[Your Name]",
    email: "hello@yourdomain.com",
    phone: "+254700000000",
    whatsapp: "254700000000",
    github: "https://github.com/yourusername",
    linkedin: "https://www.linkedin.com/in/yourusername",
    cv: "/cv.pdf",
    formEndpoint: "", // e.g. "https://formspree.io/f/xxxxxxx"
  };

  /* ---------- 1. Fill placeholders ---------- */
  var fills = document.querySelectorAll("[data-fill]");
  for (var i = 0; i < fills.length; i++) {
    var key = fills[i].getAttribute("data-fill");
    if (CFG[key]) fills[i].textContent = CFG[key];
  }

  var hrefMap = {
    email: "mailto:" + CFG.email,
    phone: "tel:" + CFG.phone,
    whatsapp: "https://wa.me/" + CFG.whatsapp,
    github: CFG.github,
    linkedin: CFG.linkedin,
    cv: CFG.cv,
  };
  var hrefs = document.querySelectorAll("[data-href]");
  for (var j = 0; j < hrefs.length; j++) {
    var hk = hrefs[j].getAttribute("data-href");
    if (hrefMap[hk]) hrefs[j].setAttribute("href", hrefMap[hk]);
  }

  /* ---------- 2. Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 3. Mobile menu ---------- */
  var menu = document.getElementById("mobile-menu");
  var toggle = document.querySelector(".menu-toggle");
  var closeBtn = document.querySelector(".menu-close");

  function openMenu() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
    if (closeBtn) closeBtn.focus();
  }
  function closeMenu(returnFocus) {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    if (returnFocus && toggle) toggle.focus();
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.contains("is-open") ? closeMenu(true) : openMenu();
    });
  }
  if (closeBtn)
    closeBtn.addEventListener("click", function () {
      closeMenu(true);
    });

  var menuLinks = menu ? menu.querySelectorAll("a") : [];
  for (var m = 0; m < menuLinks.length; m++) {
    menuLinks[m].addEventListener("click", function () {
      closeMenu(false);
    });
  }

  /* ---------- 4. Scroll reveal ---------- */
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    for (var r = 0; r < revealEls.length; r++)
      revealEls[r].classList.add("is-in");
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (var k = 0; k < revealEls.length; k++) io.observe(revealEls[k]);
  }

  /* ---------- 5. Case study modals ---------- */
  var lastFocused = null;
  var openModal = null;

  function showCase(id) {
    var modal = document.getElementById("case-" + id);
    if (!modal) return;
    if (openModal) hideCase(false);

    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    document.body.classList.add("is-locked");
    openModal = modal;

    var closeEl = modal.querySelector(".case-modal__close");
    if (closeEl) closeEl.focus();
  }

  function hideCase(restore) {
    if (!openModal) return;
    openModal.classList.remove("is-open");
    openModal = null;
    document.body.classList.remove("is-locked");
    if (restore !== false && lastFocused && lastFocused.focus)
      lastFocused.focus();
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-case]");
    if (trigger) {
      e.preventDefault();
      showCase(trigger.getAttribute("data-case"));
      return;
    }
    if (e.target.closest("[data-close]")) {
      e.preventDefault();
      hideCase(true);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (openModal) hideCase(true);
      else if (menu && menu.classList.contains("is-open")) closeMenu(true);
    }
  });

  /* ---------- 6. Contact form ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      function say(msg) {
        status.textContent = msg;
        status.hidden = false;
      }

      if (!CFG.formEndpoint) {
        say(
          "This form isn't connected yet — please email me directly at " +
            CFG.email +
            ".",
        );
        return;
      }

      var data = new FormData(form);
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }

      fetch(CFG.formEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          say(
            "Thanks — your message has been sent. I'll get back to you within 1–2 working days.",
          );
        })
        .catch(function () {
          say(
            "Something went wrong sending the form. Please email me at " +
              CFG.email +
              ".",
          );
        })
        .then(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = "Start a Project";
          }
        });
    });
  }

  /* ---------- 7. Smooth anchor scroll ---------- */
  if (!reduceMotion) {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      if (!id || id === "#" || link.hasAttribute("data-case")) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  }
})();
