(function () {
  "use strict";

  var CFG = {
    name: "Dev.Minds",
    email: "hello@yourdomain.com",
    phone: "+254700000000",
    whatsapp: "254700000000",
    github: "https://github.com/yourusername",
    linkedin: "https://www.linkedin.com/in/yourusername",
    cv: "/cv.pdf",
    formEndpoint: "",
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

  /* ---------- 3. Mobile menu & Accordions ---------- */
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

  // Mobile Dropdown Accordion Logic
  var mobileDropdownToggles = document.querySelectorAll(
    ".mobile-dropdown-toggle",
  );
  mobileDropdownToggles.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); // Stop it from scrolling immediately
      var parentLi = this.parentElement;
      var dropdown = parentLi.querySelector(".mobile-dropdown");

      // Toggle classes for CSS
      this.classList.toggle("is-open");
      if (dropdown) {
        dropdown.classList.toggle("is-open");
      }
    });
  });

  // Close mobile menu when clicking a standard link (not a dropdown toggle)
  var menuLinks = menu
    ? menu.querySelectorAll("a:not(.mobile-dropdown-toggle)")
    : [];
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

      // Ignore if it's a modal trigger, empty, or a mobile accordion toggle
      if (
        !id ||
        id === "#" ||
        link.hasAttribute("data-case") ||
        link.classList.contains("mobile-dropdown-toggle")
      )
        return;

      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  }

  /* ---------- 8. Navbar Active State (Scrollspy) ---------- */
  var allNavLinks = document.querySelectorAll(
    '.nav a[href^="#"], .mobile-menu__nav a[href^="#"]',
  );
  var sections = document.querySelectorAll("section[id]");

  if (sections.length > 0 && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var currentId = "#" + entry.target.id;

            // 1. Remove active class from ALL links and parent items
            allNavLinks.forEach(function (link) {
              link.classList.remove("is-active");
              var parentLi = link.closest(".has-dropdown");
              if (parentLi) parentLi.classList.remove("is-active");
            });

            // 2. Find and highlight matching links
            allNavLinks.forEach(function (link) {
              if (link.getAttribute("href") === currentId) {
                link.classList.add("is-active");

                // 3. If the link is inside a dropdown, highlight the parent too
                var parentLi = link.closest(".has-dropdown");
                if (parentLi) {
                  parentLi.classList.add("is-active");
                }
              }
            });
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Trigger when section hits the upper-middle of screen
        threshold: 0,
      },
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }
})();

/* ---------- 9. Scroll Progress & Back to Top ---------- */
var progressBar = document.getElementById("scroll-progress");
var backToTopBtn = document.getElementById("back-to-top");

if (progressBar || backToTopBtn) {
  window.addEventListener("scroll", function () {
    // Calculate progress
    var winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    var height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;

    if (progressBar) progressBar.style.width = scrolled + "%";

    // Show/hide back to top button after 500px
    if (backToTopBtn) {
      if (winScroll > 500) {
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    }
  });
}

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 10. Copy to Clipboard ---------- */
var copyBtns = document.querySelectorAll(".copy-btn");
copyBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    var textToCopy = this.getAttribute("data-copy");

    // Fallback for older browsers
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(function () {
        btn.classList.add("is-copied");
        var originalText = btn.querySelector("span").textContent;
        btn.querySelector("span").textContent = "Copied!";

        setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.querySelector("span").textContent = originalText;
        }, 2000);
      });
    }
  });
});

/* ---------- 11. Focus Trap for Modals ---------- */
// This prevents keyboard users from tabbing into the background page when a modal is open.
document.addEventListener("keydown", function (e) {
  if (e.key === "Tab" && openModal) {
    var focusableEls = openModal.querySelectorAll(
      "a[href], button:not([disabled]), textarea, input, select",
    );
    if (focusableEls.length === 0) return;

    var firstEl = focusableEls[0];
    var lastEl = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }
});
