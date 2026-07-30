// ---- WhatsApp number used for bookings (international format, no + or spaces)
var JOSHTECH_WHATSAPP = "2347070503044";

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

  function openModal() {
    if (!overlay) return;
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  openers.forEach(function (btn) {
    btn.addEventListener("click", openModal);
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

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").trim();
      var email = (data.get("email") || "").trim();
      var phone = (data.get("phone") || "").trim();
      var service = (data.get("service") || "").trim();
      var message = (data.get("message") || "").trim();

      var text =
        "New booking request from joshtech website:\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + phone + "\n" +
        "Service: " + service + "\n" +
        "Details: " + message;

      var url = "https://wa.me/" + JOSHTECH_WHATSAPP + "?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
      form.reset();
      closeModal();
    });
  }

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
    services: "I cover three things mainly: Product & UI Design, Frontend Development, and Design Systems. There's more detail on the Services page.",
    pricing: "Pricing depends on scope — most projects are quoted after a quick chat about what you need. Tap \"Book a call\" and I'll get the details and follow up with a quote.",
    book: "Happy to jump on a call. Click the \"Book Me\" button at the top, fill the short form, and it'll open WhatsApp with everything ready to send to Josh.",
    contact: "You can reach Josh directly:\nEmail: joshtech3913@gmail.com\nWhatsApp: 0707 050 3044",
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

  /* ---------- Services accordion ---------- */
  var accordion = document.getElementById("servicesAccordion");
  if (accordion) {
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
  }
});