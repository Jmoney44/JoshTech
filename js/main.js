// ---- WhatsApp number used for bookings (international format, no + or spaces)
var JOSHTECH_WHATSAPP = "2348141135589";

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Book Me modal ---------- */
  var overlay = document.getElementById("bookOverlay");
  var closeBtn = document.getElementById("bookClose");
  var openers = document.querySelectorAll("#bookBtn, .js-open-book");
  var form = document.getElementById("bookForm");
  var planRow = document.getElementById("bookPlanRow");
  var planInput = document.getElementById("bookPlanInput");

  function openModal(plan) {
    if (!overlay) return;
    if (planRow && planInput) {
      if (plan) {
        planInput.value = plan;
        planRow.hidden = false;
      } else {
        planInput.value = "";
        planRow.hidden = true;
      }
    }
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  openers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-plan"));
    });
  });
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* Reusable: wires any booking-style form to open WhatsApp with a
     prefilled message. onSuccess (optional) runs after opening WhatsApp,
     e.g. to close a modal or show a confirmation note. */
  function attachWhatsAppForm(formEl, onSuccess) {
    if (!formEl) return;
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(formEl);
      var name = (data.get("name") || "").trim();
      var email = (data.get("email") || "").trim();
      var phone = (data.get("phone") || "").trim();
      var service = (data.get("service") || "").trim();
      var plan = (data.get("plan") || "").trim();
      var message = (data.get("message") || "").trim();

      var text =
        "New booking request from joshtech website:\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + phone + "\n" +
        "Service: " + service + "\n" +
        (plan ? "Plan: " + plan + "\n" : "") +
        "Details: " + message;

      var url = "https://wa.me/" + JOSHTECH_WHATSAPP + "?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
      formEl.reset();
      if (onSuccess) onSuccess();
    });
  }

  attachWhatsAppForm(form, closeModal);

  var contactForm = document.getElementById("contactForm");
  var contactNote = document.getElementById("contactNote");
  attachWhatsAppForm(contactForm, function () {
    if (contactNote) {
      contactNote.classList.add("is-visible");
      setTimeout(function () { contactNote.classList.remove("is-visible"); }, 5000);
    }
  });

  /* ---------- Chatbot ---------- */
  var chatToggle = document.getElementById("chatToggle");
  var chatPanel = document.getElementById("chatPanel");
  var chatClose = document.getElementById("chatClose");
  var chatMessages = document.getElementById("chatMessages");
  var chatForm = document.getElementById("chatForm");
  var chatInput = document.getElementById("chatInput");
  var chatQuick = document.getElementById("chatQuick");

  function addMsg(text, from) {
    if (!chatMessages) return;
    var div = document.createElement("div");
    div.className = "msg " + (from === "user" ? "msg-user" : "msg-bot");
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  var replies = {
    services: "We cover the full stack: Product & UI Design, Frontend & Mobile Development, Design Systems, Cloud & DevOps, Cybersecurity, and IT Consulting. There's more detail on the Services page.",
    pricing: "Pricing depends on scope — most projects are quoted after a quick chat about what you need. Tap \"Book a call\" and I'll get the details and follow up with a quote.",
    book: "Happy to jump on a call. Click the \"Book Me\" button at the top, fill the short form, and it'll open WhatsApp with everything ready to send to Josh.",
    contact: "You can reach Josh directly:\nEmail: joshtech3913@gmail.com\nWhatsApp: +234 814 113 5589",
    projects: "You can see recent work on the Projects page — a mix of mobile apps, web apps and design systems.",
    default: "Good question — for anything specific it's best to book a quick call so Josh can give you a proper answer. Want me to open the booking form?"
  };

  function botReply(userText) {
    var t = userText.toLowerCase();
    var key = "default";
    if (t.indexOf("price") > -1 || t.indexOf("cost") > -1 || t.indexOf("pricing") > -1) key = "pricing";
    else if (t.indexOf("service") > -1) key = "services";
    else if (t.indexOf("book") > -1 || t.indexOf("call") > -1 || t.indexOf("meet") > -1) key = "book";
    else if (t.indexOf("contact") > -1 || t.indexOf("email") > -1 || t.indexOf("whatsapp") > -1 || t.indexOf("phone") > -1) key = "contact";
    else if (t.indexOf("project") > -1 || t.indexOf("work") > -1 || t.indexOf("portfolio") > -1) key = "projects";

    setTimeout(function () {
      addMsg(replies[key], "bot");
    }, 450);
  }

  function openChat() {
    if (chatPanel) chatPanel.classList.add("is-open");
  }
  function closeChat() {
    if (chatPanel) chatPanel.classList.remove("is-open");
  }

  if (chatToggle) {
    chatToggle.addEventListener("click", function () {
      if (chatPanel && chatPanel.classList.contains("is-open")) closeChat();
      else openChat();
    });
  }
  if (chatClose) chatClose.addEventListener("click", closeChat);

  if (chatQuick) {
    chatQuick.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        var q = b.getAttribute("data-q");
        addMsg(b.textContent, "user");
        botReply(q);
      });
    });
  }

  if (chatForm) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = chatInput.value.trim();
      if (!val) return;
      addMsg(val, "user");
      botReply(val);
      chatInput.value = "";
    });
  }

  /* ---------- Accordions (services list, FAQ, etc.) ---------- */
  document.querySelectorAll(".accordion").forEach(function (accordion) {
    accordion.querySelectorAll(".acc-item").forEach(function (item) {
      var trigger = item.querySelector(".acc-trigger");
      trigger.addEventListener("click", function () {
        var wasOpen = item.classList.contains("is-open");
        accordion.querySelectorAll(".acc-item").forEach(function (i) {
          i.classList.remove("is-open");
        });
        if (!wasOpen) item.classList.add("is-open");
      });
    });
  });

  /* ---------- Projects filter + pagination ---------- */
  var filterRow = document.getElementById("filterRow");
  var projectsGrid = document.getElementById("projectsGrid");
  var prevPageBtn = document.getElementById("prevPage");
  var nextPageBtn = document.getElementById("nextPage");
  var pageIndicator = document.getElementById("pageIndicator");
  var PROJECTS_PER_PAGE = 4;

  if (projectsGrid) {
    var allCards = Array.prototype.slice.call(projectsGrid.querySelectorAll(".project-card"));
    var currentFilter = "all";
    var currentPage = 1;

    var getMatchingCards = function () {
      return allCards.filter(function (card) {
        return currentFilter === "all" || card.getAttribute("data-category") === currentFilter;
      });
    };

    var renderProjects = function () {
      var matching = getMatchingCards();
      var totalPages = Math.max(1, Math.ceil(matching.length / PROJECTS_PER_PAGE));
      if (currentPage > totalPages) currentPage = totalPages;

      var start = (currentPage - 1) * PROJECTS_PER_PAGE;
      var end = start + PROJECTS_PER_PAGE;

      allCards.forEach(function (card) {
        var isMatch = currentFilter === "all" || card.getAttribute("data-category") === currentFilter;
        card.classList.toggle("is-hidden", !isMatch);
      });
      matching.forEach(function (card, i) {
        card.classList.toggle("is-page-hidden", i < start || i >= end);
      });

      if (pageIndicator) pageIndicator.textContent = "Page " + currentPage + " of " + totalPages;
      if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
      if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
    };

    if (filterRow) {
      filterRow.querySelectorAll(".filter-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          filterRow.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          currentFilter = btn.getAttribute("data-filter");
          currentPage = 1;
          renderProjects();
        });
      });
    }

    if (prevPageBtn) {
      prevPageBtn.addEventListener("click", function () {
        currentPage -= 1;
        renderProjects();
        projectsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    if (nextPageBtn) {
      nextPageBtn.addEventListener("click", function () {
        currentPage += 1;
        renderProjects();
        projectsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    renderProjects();
  }

  /* ---------- Project details toggle ---------- */
  if (projectsGrid) {
    projectsGrid.querySelectorAll(".details-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".project-card");
        if (card) card.classList.toggle("is-open");
      });
    });
  }

  /* ---------- Blog filter + expandable posts ---------- */
  var blogFilterRow = document.getElementById("blogFilterRow");
  var blogGrid = document.getElementById("blogGrid");
  if (blogFilterRow && blogGrid) {
    var blogFilterBtns = blogFilterRow.querySelectorAll(".filter-btn");
    var blogCards = blogGrid.querySelectorAll(".blog-card");

    blogFilterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        blogFilterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var filter = btn.getAttribute("data-filter");

        blogCards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          card.classList.toggle("is-hidden", !match);
        });
      });
    });
  }
  if (blogGrid) {
    blogGrid.querySelectorAll(".details-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".blog-card");
        if (card) card.classList.toggle("is-open");
      });
    });
  }
});