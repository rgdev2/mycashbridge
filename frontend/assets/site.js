/* ============================================================
   CASH BRIDGE — shared site behaviour (v2)
   Nav with product dropdowns — EN/HI language engine —
   working cookie consent (blocks non-essential cookies) —
   apply modal — forms?email — EMI — FAQ — why-choose strip.
   ============================================================ */
(function () {
  "use strict";

  window.CASHBRIDGE = window.CASHBRIDGE || {};
  var CFG = Object.assign({
    brand: "MyCashBridge",
    tagline: "Aapke Sapno Ka Financial Saathi",
    leadEmail: "application@mycashbridge.com",
    phone: "+91\u00A087965\u00A008140",
    phoneRaw: "918796508140",
    whatsapp: "918796508140",
    address: "750, Udyog Vihar Phase 5, Sector 19, Gurugram, Haryana 122016",
    thanksTitle: "Thank you — we've got your request!",
    thanksBody: "A MyCashBridge expert will call you within 24 hours to take it forward. Please keep your phone handy."
  }, window.CASHBRIDGE);
  /* logo lockup: brand with tagline */
  function brandLockup(extraClass) {
    return '<span class="brandmark ' + (extraClass || '') + '"><span class="bm-name">MyCashBridge</span><span class="bm-tag">' + CFG.tagline + '</span></span>';
  }

  var BASE = (function () {
    return /\/(loans|tools|pages|guides)\//.test(location.pathname) ? "../" : "";
  })();
  /* logo source — uses the standalone bundler's inlined blob when present, else the normal asset path */
  function LOGO_SRC() { return (window.__resources && window.__resources.cbLogo) || (BASE + "assets/looogogogog.png"); }
  /* split lockup: MCB mark image + separate live wordmark text */
  function MARK_SRC() { return (window.__resources && window.__resources.cbMark) || (BASE + "assets/mcb-mark.png"); }
  function logoLockup(cls) {
    return '<span class="cb-logo ' + (cls || '') + '">' +
        '<img class="cb-mark" src="' + MARK_SRC() + '" alt="' + CFG.brand + '" ' +
        'onerror="this.onerror=null;this.src=\'' + BASE + 'assets/logo-cashbridge-mark.svg\'">' +
        '<span class="cb-word"><span class="cb-name">MyCashBridge<span class="cb-tld">.com</span></span>' +
        '<span class="cb-tag">' + CFG.tagline + '</span></span>' +
      '</span>';
  }

  /* ---------------- catalogues ---------------- */
  var LOANS = [
    ["personal-loan", "Personal Loan", "wallet"],
    ["business-loan", "Business Loan", "store"],
    ["home-loan", "Home Loan", "home"],
    ["loan-against-property", "Loan Against Property", "building-2"],
    ["car-loan", "Car Loan", "car"],
    ["education-loan", "Education Loan", "graduation-cap"],
    ["gold-loan", "Gold Loan", "gem"]
  ];
  var CARDS = [
    ["cashback-cards", "Cashback Cards", "badge-percent"],
    ["travel-cards", "Travel Cards", "plane"],
    ["rewards-cards", "Rewards Cards", "gift"],
    ["secured-cards", "Secured Cards", "lock"],
    ["credit-cards", "Lifetime Free Cards", "infinity"],
    ["credit-cards", "Premium Cards", "crown"],
    ["credit-cards", "Fuel Cards", "fuel"],
    ["credit-cards", "Shopping Cards", "shopping-bag"]
  ];
  var INSURANCE = [
    ["health-insurance", "Health Insurance", "heart-pulse"],
    ["life-insurance", "Life Insurance", "umbrella"],
    ["motor-insurance", "Motor Insurance", "car"],
    ["travel-insurance", "Travel Insurance", "plane"]
  ];
  var INVEST = [
    ["sip", "SIP", "repeat"],
    ["mutual-funds", "Mutual Funds", "layers"],
    ["demat", "Demat Account", "line-chart"]
  ];
  var TOOLS = [
    ["tools/emi-calculator", "EMI Calculator", "calculator"],
    ["tools/credit-score", "Free CIBIL Score", "gauge"],
    ["tools/eligibility", "Eligibility Checker", "list-checks"],
    ["tools/compare", "Compare Loans", "scale"],
    ["guides/index", "Guides & Articles", "book-open"]
  ];
  window.CB_LOANS = LOANS;

  /* ------------------------------------------------------------
     Partner network data (banks/NBFCs/HFCs/SFBs)
     ------------------------------------------------------------ */
  var PARTNERS = [];
  var PARTNER_TYPES = {
    all: "All Partners",
    bank: "Banks",
    nbfc: "NBFCs",
    hfc: "HFCs",
    sfb: "Small Finance Banks"
  };
  var LOAN_DISPLAY = {
    "personal-loan": "Personal Loan",
    "business-loan": "Business Loan",
    "home-loan": "Home Loan",
    "loan-against-property": "Loan Against Property",
    "car-loan": "Car Loan",
    "education-loan": "Education Loan",
    "gold-loan": "Gold Loan"
  };
  var RATE_HINTS = {
    "personal-loan": { min: 10.5, max: 24.0, fee: "1% - 3%", tenure: "72 mo" },
    "business-loan": { min: 14.0, max: 28.0, fee: "2% - 3%", tenure: "60 mo" },
    "home-loan": { min: 8.5, max: 11.75, fee: "0.25% - 1%", tenure: "30 yrs" },
    "loan-against-property": { min: 9.0, max: 16.0, fee: "0.5% - 2%", tenure: "20 yrs" },
    "car-loan": { min: 9.25, max: 14.5, fee: "0.5% - 1%", tenure: "84 mo" },
    "education-loan": { min: 9.0, max: 15.0, fee: "0% - 1%", tenure: "15 yrs" },
    "gold-loan": { min: 9.0, max: 18.0, fee: "0% - 1%", tenure: "36 mo" }
  };
  var PARTNER_LOCAL_LOGOS = {
    "State Bank of India": "logos/sbi logo.png",
    "HDFC Bank": "logos/logo-hdfc.png",
    "ICICI Bank": "logos/icic bank logo.png",
    "Axis Bank": "logos/axis bank logo.jpg",
    "Kotak Mahindra Bank": "logos/kotak mahindra bank.jpg",
    "YES Bank": "logos/Yes_Bank_Logo_in_2024.png",
    "IDFC FIRST Bank": "logos/idfc first bank.jpg",
    "IndusInd Bank": "logos/indusind-bank-logo-png_seeklogo-71354.png",
    "Federal Bank": "logos/federal bank.jpg",
    "RBL Bank": "logos/RBL_Bank_SVG_Logo.svg.png",
    "IDBI Bank": "logos/IDBI-Bank-logo.png",
    "Bank of Baroda": "logos/bank of baroda logo.png",
    "Bank of Maharashtra": "logos/Bank-of-Maharashtra-Logo-Vector.svg-.png",
    "Indian Overseas Bank": "logos/indian overseas bank logo.png",
    "Punjab National Bank": "logos/pujab national bank logo.jpg",
    "Canara Bank": "logos/Canara_Bank_Logo.svg.png",
    "Union Bank of India": "logos/Union Bank of India logo.png",
    "Indian Bank": "logos/_indian-bank-logo-indian-bank-logo-vector-hd.png",
    "Central Bank of India": "logos/central-bank-of-india-1911-vector-logo-.png",
    "AU Small Finance Bank": "logos/AU-bank-logo.jpg",
    "Jana Small Finance Bank": "logos/Jana Small Finance Bank logo.jpg",
    "Ujjivan Small Finance Bank": "logos/Ujjivan Small Finance Bank logo.jpg",
    "Suryoday Small Finance Bank": "logos/Suryoday Small Finance Bank logo.jpg",
    "Unity Small Finance Bank": "logos/Unity Small Finance Bank logo.jpg",
    "Utkarsh Small Finance Bank": "logos/Utkarsh Small Finance Bank logo.jpg",
    "Bandhan Bank": "logos/Bandhan_Bank_Svg_Logo.svg.png",
    "DCB Bank": "logos/DCB-BANK.png",
    "DBS Bank": "logos/DBS_Bank_logo_logotype.png",
    "HSBC": "logos/hsbc bank logo.png",
    "HSBC Home Loans": "logos/HSBC Home Loans logo.png",
    "Standard Chartered": "logos/Standard Chartered India logo.png",
    "Doha Bank": "logos/doha-bank-logo.webp",
    "Shinhan Bank": "logos/shinhan-bank-logo.png",
    "Karur Vysya Bank": "logos/Karur_Vysya_Bank.svg.png",
    "South Indian Bank": "logos/south-indian-bank.webp"
  };

  function partnerTypeRank(t) {
    return { bank: 1, sfb: 2, nbfc: 3, hfc: 4 }[t] || 5;
  }
  function normalizePartner(p) {
    return {
      name: p.name || "",
      type: p.type || "bank",
      category: p.category || "",
      logo: typeof p.logo === "string" ? p.logo.trim() : "",
      website: p.website || "",
      loanTypes: Array.isArray(p.loanTypes) ? p.loanTypes : [],
      featured: !!p.featured
    };
  }
  function loanKeyFromPath() {
    var m = location.pathname.match(/\/loans\/([a-z-]+)\.html$/);
    return m ? m[1] : "";
  }
  function partnerForLoan(loanKey) {
    return PARTNERS.filter(function (p) { return p.loanTypes.indexOf(loanKey) > -1; });
  }
  function rateForPartner(partner, loanKey) {
    var hint = RATE_HINTS[loanKey] || { min: 10, max: 20, fee: "1% - 2%", tenure: "60 mo" };
    var base = hint.min;
    var spread = hint.max - hint.min;
    var typeWeight = partner.type === "bank" ? 0.18 : partner.type === "sfb" ? 0.35 : partner.type === "hfc" ? 0.3 : 0.42;
    var signature = 0;
    for (var i = 0; i < partner.name.length; i++) signature += partner.name.charCodeAt(i);
    var drift = (signature % 17) / 100;
    var low = Math.max(hint.min, (base + spread * typeWeight + drift)).toFixed(2);
    var high = Math.min(hint.max + 0.75, (parseFloat(low) + 2.2)).toFixed(2);
    return {
      rate: low + "% - " + high + "%",
      fee: hint.fee,
      tenure: hint.tenure
    };
  }
  function partnerCardHTML(p) {
    var safeName = p.name.replace(/"/g, "&quot;");
    var localLogo = PARTNER_LOCAL_LOGOS[p.name] ? (BASE + "assets/" + encodeURI(PARTNER_LOCAL_LOGOS[p.name])) : "";
    var logoSrc = localLogo || p.logo;
    if (logoSrc) {
      return '<div class="partner-card" title="' + safeName + '">' +
        '<img class="partner-logo" src="' + logoSrc + '" alt="' + safeName + ' logo" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.style.display=\'none\';this.parentNode.insertAdjacentHTML(\'beforeend\',\'<div class=\'partner-name-fallback\'>' + safeName + '</div>\')">' +
      '</div>';
    }
    return '<div class="partner-card"><div class="partner-name-fallback">' + safeName + '</div></div>';
  }
  function sortPartners(arr) {
    return arr.slice().sort(function (a, b) {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      var typeCmp = partnerTypeRank(a.type) - partnerTypeRank(b.type);
      if (typeCmp) return typeCmp;
      return a.name.localeCompare(b.name);
    });
  }
  function renderHomePartners() {
    var sec = document.querySelector("[data-partner-section]");
    if (!sec || !PARTNERS.length) return;
    var tabs = sec.querySelector("[data-partner-tabs]");
    var grid = sec.querySelector("[data-partner-grid]");
    /* scroller may be outside the partners section (e.g. hero placement) */
    var scroller = document.querySelector("[data-partner-scroller-track]");
    if (!tabs || !grid) return;
    var active = "all";
    if (scroller) {
      var marquee = sortPartners(PARTNERS).slice(0, 24);
      var seq = marquee.map(partnerCardHTML).join("");
      scroller.innerHTML = seq + seq;
    }
    function draw() {
      var filtered = active === "all" ? PARTNERS : PARTNERS.filter(function (p) { return p.type === active; });
      var display = sortPartners(filtered).slice(0, 30);
      grid.innerHTML = display.map(partnerCardHTML).join("");
    }
    tabs.innerHTML = Object.keys(PARTNER_TYPES).map(function (k) {
      return '<button type="button" data-type="' + k + '">' + PARTNER_TYPES[k] + '</button>';
    }).join("");
    tabs.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-type") === active);
      b.addEventListener("click", function () {
        active = b.getAttribute("data-type");
        tabs.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        draw();
      });
    });
    draw();
  }
  function renderLoanPartners() {
    var key = loanKeyFromPath();
    if (!key || !PARTNERS.length) return;
    var hero = document.querySelector("section.hero .wrap.hero-grid > div:first-child");
    if (hero && !hero.querySelector(".loan-partner-strip")) {
      var matches = sortPartners(partnerForLoan(key)).slice(0, 10);
      if (matches.length) {
        hero.insertAdjacentHTML("beforeend",
          '<div class="loan-partner-strip" data-loan-partner-strip>' +
            '<h3>Trusted partners for ' + (LOAN_DISPLAY[key] || "this loan") + '</h3>' +
            '<p>Access options across major banks, NBFCs and housing finance institutions through one guided application.</p>' +
            '<div class="loan-partner-grid">' + matches.map(partnerCardHTML).join("") + '</div>' +
          '</div>'
        );
      }
    }
    var tbody = document.querySelector("#rates table.cmp tbody");
    if (tbody && !tbody.querySelector("tr")) {
      var ratePartners = sortPartners(partnerForLoan(key)).slice(0, 10);
      tbody.innerHTML = ratePartners.map(function (p) {
        var r = rateForPartner(p, key);
        return '<tr><td>' + p.name + '</td><td>' + r.rate + '</td><td>' + r.fee + '</td><td>' + r.tenure + '</td></tr>';
      }).join("");
    }
  }
  function injectPartnerSchema() {
    if (!PARTNERS.length) return;
    var isHome = /\/index\.html$/.test(location.pathname) || /\/$/.test(location.pathname);
    var key = loanKeyFromPath();
    var list = isHome ? sortPartners(PARTNERS).slice(0, 30) : sortPartners(partnerForLoan(key)).slice(0, 20);
    if (!list.length) return;
    var node = document.createElement("script");
    node.type = "application/ld+json";
    node.setAttribute("data-partner-schema", "true");
    var itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": isHome ? "MyCashBridge Trusted Lending Partners" : ((LOAN_DISPLAY[key] || "Loan") + " Lending Partners"),
      "itemListElement": list.map(function (p, idx) {
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "Organization",
            "name": p.name,
            "url": p.website || undefined,
            "sameAs": p.website || undefined
          }
        };
      })
    };
    node.textContent = JSON.stringify(itemList);
    document.head.appendChild(node);
  }
  function loadPartners() {
    return fetch(BASE + "assets/partners-data.json", { cache: "no-store" })
      .then(function (res) { if (!res.ok) throw new Error("partner-data-fetch"); return res.json(); })
      .then(function (rows) {
        PARTNERS = (Array.isArray(rows) ? rows : []).map(normalizePartner).filter(function (p) { return p.name; });
      })
      .catch(function () { PARTNERS = []; });
  }

  /* ============================================================
     DPDP ACT 2023 — CONSENT CONSTANTS (Phase 1)
     ============================================================
     Version must match backend/src/utils/consent.js CONSENT_VERSION.
     Bump both when consent text changes — triggers re-collection of consent.

     These values are sent with every lead submission so the backend
     can store verifiable proof of what was shown and agreed to.
  */
  var CONSENT_VERSION     = "v1.0";
  var CONSENT_TEXT_SERVICE =
    "I authorise " + CFG.brand + " and its partner banks/NBFCs to contact me regarding my " +
    "loan enquiry via call, SMS, email or WhatsApp to process my application, and I accept " +
    "the Terms & Conditions and Privacy Policy. This overrides my DND/NDNC registration.";

  /* localStorage retry queue — replaces formsubmit.co fallback (Phase 3) */
  function queueLeadForRetry(payload) {
    try {
      var q = JSON.parse(localStorage.getItem("cb_lead_queue") || "[]");
      payload._queued_at = Date.now();
      q.push(payload);
      if (q.length > 5) q = q.slice(-5); // cap at 5 to prevent unbounded growth
      localStorage.setItem("cb_lead_queue", JSON.stringify(q));
    } catch (e) {}
  }
  function drainLeadRetryQueue() {
    try {
      var q = JSON.parse(localStorage.getItem("cb_lead_queue") || "[]");
      if (!q.length) return;
      var item = q.shift();
      localStorage.setItem("cb_lead_queue", JSON.stringify(q));
      fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item)
      }).catch(function () {
        // still failing — put back
        var q2 = JSON.parse(localStorage.getItem("cb_lead_queue") || "[]");
        q2.unshift(item);
        localStorage.setItem("cb_lead_queue", JSON.stringify(q2.slice(0, 5)));
      });
    } catch (e) {}
  }

  /* ============================================================
     i18n — full-page dictionary sweep (English ? Hindi)
     Translates EVERY matching visible text node + placeholders
     anywhere on the page, preserving icons & inline markup.
     ============================================================ */
  var HI = {
    // ---- top strip / nav ----
    "New here? Check your eligibility in 10 seconds \u25C6 it won't affect your credit score.": "\u0928\u092F\u093E \u0939\u0948\u0902? 10 \u0938\u0947\u0915\u0902\u0921 \u092E\u0947\u0902 \u0905\u092A\u0928\u0940 \u092A\u093E\u0924\u094D\u0930\u0924\u093E \u091C\u093E\u0928\u0947\u0902 \u2014 \u0906\u092A\u0915\u093E \u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0938\u094D\u0915\u094B\u0930 \u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u0928\u0939\u0940\u0902 \u0939\u094B\u0917\u093E",
    "Check now": "\u0905\u092D\u0940 \u091C\u093E\u0902\u091A\u0947\u0902",
    "Loans": "\u0932\u094B\u0928", "Credit Cards": "\u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0915\u093E\u0930\u094D\u0921", "Insurance": "\u092C\u0940\u092E\u093E", "Investments": "\u0928\u093F\u0935\u0947\u0936", "Tools": "\u091F\u0942\u0932\u094D\u0938",
    "Apply now": "\u0905\u092D\u0940 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902", "About Us": "\u0939\u092E\u093E\u0930\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902", "Contact Us": "\u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902", "Call": "\u0915\u0949\u0932 \u0915\u0930\u0947\u0902",
    // ---- product names ----
    "Personal Loan": "\u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0917\u0924 \u0932\u094B\u0928", "Business Loan": "\u0935\u094D\u092F\u093E\u092A\u093E\u0930 \u0932\u094B\u0928", "Home Loan": "\u0939\u094B\u092E \u0932\u094B\u0928",
    "Loan Against Property": "\u0938\u0902\u092A\u0924\u094D\u0924\u093F \u092A\u0930 \u0932\u094B\u0928", "Car Loan": "\u0915\u093E\u0930 \u0932\u094B\u0928", "Education Loan": "\u0936\u093F\u0915\u094D\u0937\u093E \u0932\u094B\u0928", "Gold Loan": "\u0938\u094B\u0928\u093E \u0932\u094B\u0928",
    "Cashback Cards": "\u0915\u0948\u0936\u092C\u0948\u0915 \u0915\u093E\u0930\u094D\u0921", "Travel Cards": "\u092F\u093E\u0924\u094D\u0930\u093E \u0915\u093E\u0930\u094D\u0921", "Rewards Cards": "\u0930\u093F\u0935\u093E\u0930\u094D\u0921 \u0915\u093E\u0930\u094D\u0921", "Secured Cards": "\u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0915\u093E\u0930\u094D\u0921",
    "Lifetime Free Cards": "\u0932\u093E\u0907\u092B\u091F\u093E\u0907\u092E \u092B\u094D\u0930\u0940 \u0915\u093E\u0930\u094D\u0921", "Premium Cards": "\u092A\u094D\u0930\u0940\u092E\u093F\u092F\u092E \u0915\u093E\u0930\u094D\u0921", "Fuel Cards": "\u0908\u0902\u0927\u0928 \u0915\u093E\u0930\u094D\u0921", "Shopping Cards": "\u0936\u0949\u092A\u093F\u0902\u0917 \u0915\u093E\u0930\u094D\u0921",
    "Health Insurance": "\u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u092C\u0940\u092E\u093E", "Life Insurance": "\u091C\u0940\u0935\u0928 \u092C\u0940\u092E\u093E", "Motor Insurance": "\u0935\u093E\u0939\u0928 \u092C\u0940\u092E\u093E", "Travel Insurance": "\u092F\u093E\u0924\u094D\u0930\u093E \u092C\u0940\u092E\u093E",
    "SIP": "\u090F\u0938\u0906\u0908\u092A\u0940", "Mutual Funds": "\u092E\u094D\u092F\u0941\u091A\u0941\u0905\u0932 \u092B\u0902\u0921", "Demat Account": "\u0921\u0940\u092E\u0948\u091F \u0916\u093E\u0924\u093E",
    "EMI Calculator": "EMI \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091F\u0930", "Free CIBIL Score": "\u092E\u0941\u092B\u094D\u0924 CIBIL \u0938\u094D\u0915\u094B\u0930", "Eligibility Checker": "\u092A\u093E\u0924\u094D\u0930\u0924\u093E \u091C\u093E\u0902\u091A\u0947\u0902",
    "Compare Loans": "\u0932\u094B\u0928 \u0915\u0940 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902", "Guides & Articles": "\u0917\u093E\u0907\u0921 \u0935 \u0932\u0947\u0916",
    // ---- hero A ----
    "Compare & apply from 128+ banks & NBFCs": "128+ \u092C\u0948\u0902\u0915\u094B\u0902 \u0914\u0930 NBFC \u0938\u0947 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902 \u0914\u0930 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902",
    "Borrow with": "\u0938\u092E\u091D\u0926\u093E\u0930\u0940 \u0938\u0947 \u0932\u0947\u0902", "a clear head.": "\u0932\u094B\u0928",
    "Compare and apply for personal, business, home and gold loans from India's leading banks & NBFCs \u2013 with EMIs you choose and a total you can see before you sign.":
      "\u092D\u093E\u0930\u0924 \u0915\u0947 \u092A\u094D\u0930\u092E\u0941\u0916 \u092C\u0948\u0902\u0915\u094B\u0902 \u0914\u0930 NBFC \u0938\u0947 \u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0917\u0924, \u0935\u094D\u092F\u093E\u092A\u093E\u0930, \u0918\u0930 \u0914\u0930 \u0938\u094B\u0928\u0947 \u0915\u0947 \u0932\u094B\u0928 \u0915\u0940 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902 \u2014 \u0905\u092A\u0928\u0940 EMI \u0914\u0930 \u0915\u0941\u0932 \u0930\u093E\u0936\u093F \u0938\u093E\u0907\u0928 \u0938\u0947 \u092A\u0939\u0932\u0947 \u0926\u0947\u0916\u0947\u0902",
    "See how it works": "\u0926\u0947\u0916\u0947\u0902 \u092F\u0939 \u0915\u0948\u0938\u0947 \u0915\u093E\u092E \u0915\u0930\u0924\u093E \u0939\u0948",
    "Apply Once \u2014 compare 128+ lenders, get the best offer": "\u090F\u0915 \u092C\u093E\u0930 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902 \u2014 128+ \u0932\u0947\u0902\u0921\u0930 \u0938\u0947 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902, \u0938\u0930\u094D\u0935\u0936\u094D\u0930\u0947\u0937\u094D\u0920 \u0911\u092B\u0930 \u092A\u093E\u090F\u0902",
    "Upload documents once \u2014 save time & effort": "\u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C \u090F\u0915 \u092C\u093E\u0930 \u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u0947\u0902 \u2014 \u0938\u092E\u092F \u0914\u0930 \u092E\u0947\u0939\u0928\u0924 \u092C\u091A\u093E\u090F\u0902",
    "Instant sanction & disbursal in 24 hours": "24 \u0918\u0902\u091F\u0947 \u092E\u0947\u0902 \u0924\u0924\u094D\u0915\u093E\u0932 \u0938\u094D\u0935\u0940\u0915\u0943\u0924\u093F \u0914\u0930 \u0935\u093F\u0924\u0930\u0923",
    "No hidden charges \u2014 what you see is what you pay": "\u0915\u094B\u0908 \u091B\u0941\u092A\u093E \u0936\u0941\u0932\u094D\u0915 \u0928\u0939\u0940\u0902 \u2014 \u091C\u094B \u0926\u093F\u0916\u0947 \u0935\u0939\u0940 \u092D\u0941\u0917\u0924\u093E\u0928 \u0915\u0930\u0947\u0902",
    "Money in 24 hours": "24 \u0918\u0902\u091F\u0947 \u092E\u0947\u0902 \u0930\u093E\u0936\u093F", "Rates from 8.5% p.a.": "\u0926\u0930 8.5% \u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u0938\u0947", "Bank-grade secure": "\u092C\u0948\u0902\u0915-\u0938\u094D\u0924\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924",
    "Estimate your EMI": "\u0905\u092A\u0928\u0940 EMI \u0905\u0928\u0941\u092E\u093E\u0928 \u0932\u0917\u093E\u090F\u0902", "Loan amount": "\u0932\u094B\u0928 \u0930\u093E\u0936\u093F", "Tenure": "\u0905\u0935\u0927\u093F",
    "Your Easy Monthly Installment =": "\u0906\u092A\u0915\u0940 \u0906\u0938\u093E\u0928 \u092E\u093E\u0938\u093F\u0915 \u0915\u093F\u0938\u094D\u0924 =", "Check your rate": "\u0905\u092A\u0928\u0940 \u0926\u0930 \u091C\u093E\u0902\u091A\u0947\u0902",
    "Checking your rate won't affect your credit score.": "\u0926\u0930 \u091C\u093E\u0902\u091A\u0928\u0947 \u0938\u0947 \u0906\u092A\u0915\u093E \u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0938\u094D\u0915\u094B\u0930 \u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u0928\u0939\u0940\u0902 \u0939\u094B\u0917\u093E",
    // ---- hero B ----
    "Get a call back in 30 seconds": "30 \u0938\u0947\u0915\u0902\u0921 \u092E\u0947\u0902 \u0915\u0949\u0932 \u092A\u093E\u090F\u0902",
    "The loan you need,": "\u0906\u092A\u0915\u093E \u091C\u0930\u0942\u0930\u0940 \u0932\u094B\u0928,", "without the runaround.": "\u092C\u093F\u0928\u093E \u0922\u0942\u0902\u0922\u093E\u0922\u093E\u0922\u0940 \u0915\u0947",
    // ---- modal ----
    "modal.safe": "100% \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0914\u0930 \u0917\u094B\u092A\u0928\u0940\u092F",
    "modal.title": "\u0932\u094B\u0928 \u0915\u0947 \u0932\u093F\u090F \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902",
    "Full name": "\u092A\u0942\u0930\u093E \u0928\u093E\u092E", "Mobile number": "\u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930", "City": "\u0936\u0939\u0930",
    "Loan type": "\u0932\u094B\u0928 \u092A\u094D\u0930\u0915\u093E\u0930", "Monthly income": "\u092E\u093E\u0938\u093F\u0915 \u0906\u092F", "Employer type": "\u0928\u093F\u092F\u094B\u0915\u094D\u0924\u093E \u092A\u094D\u0930\u0915\u093E\u0930",
    "Get a call back": "\u0915\u0949\u0932 \u092A\u093E\u090F\u0902",
    // ---- cookie ----
    "cookie.title": "\u0939\u092E \u0915\u0941\u0915\u0940\u091C\u093C \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902",
    "cookie.body": "\u0939\u092E \u0938\u093E\u0907\u091F \u0938\u0941\u0927\u093E\u0930\u0928\u0947 \u0914\u0930 \u091F\u094D\u0930\u0948\u092B\u093C\u093F\u0915 \u0938\u092E\u091D\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u0941\u0915\u0940\u091C\u093C \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902",
    "cookie.reject": "\u0917\u0948\u0930-\u091C\u0930\u0942\u0930\u0940 \u0905\u0938\u094D\u0935\u0940\u0915\u093E\u0930 \u0915\u0930\u0947\u0902", "cookie.settings": "\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938", "cookie.accept": "\u0938\u092D\u0940 \u0938\u094D\u0935\u0940\u0915\u093E\u0930 \u0915\u0930\u0947\u0902",
    // ---- misc ----
    "Start Now": "\u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902", "Refer Now": "\u0905\u092D\u0940 \u0930\u0947\u092B\u0930 \u0915\u0930\u0947\u0902",
    "Apply now \u2014 it\u2019s free": "\u0905\u092D\u0940 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902 \u2014 \u092E\u0941\u092B\u094D\u0924 \u0939\u0948",
    "128+ lenders": "128+ \u0932\u0947\u0902\u0921\u0930", "40,000+ helped": "40,000+ \u0915\u0940 \u092E\u0926\u0926", "Rates from 8.5%": "8.5% \u0938\u0947 \u0926\u0930\u0947\u0902", "Bank-grade secure": "\u092C\u0948\u0902\u0915-\u0938\u094D\u0924\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924",
    "months": "\u092E\u0939\u0940\u0928\u0947",
    "Apply Once \u2014 compare": "\u090F\u0915 \u092C\u093E\u0930 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902 \u2014 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902",
    ", get the best offer": ", \u0938\u0930\u094D\u0935\u0936\u094D\u0930\u0947\u0937\u094D\u0920 \u0911\u092B\u0930 \u092A\u093E\u090F\u0902",
    "Upload documents once \u2014": "\u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C \u090F\u0915 \u092C\u093E\u0930 \u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u0947\u0902 \u2014",
    "save time & effort": "\u0938\u092E\u092F \u0914\u0930 \u092E\u0947\u0939\u0928\u0924 \u092C\u091A\u093E\u090F\u0902",
    "Instant": "\u0924\u0924\u094D\u0915\u093E\u0932",
    "sanction & disbursal in 24 hours": "24 \u0918\u0902\u091F\u0947 \u092E\u0947\u0902 \u0938\u094D\u0935\u0940\u0915\u0943\u0924\u093F \u0914\u0930 \u0935\u093F\u0924\u0930\u0923",
    "No hidden charges": "\u0915\u094B\u0908 \u091B\u0941\u092A\u093E \u0936\u0941\u0932\u094D\u0915 \u0928\u0939\u0940\u0902",
    "\u2014 what you see is what you pay": "\u2014 \u091C\u094B \u0926\u093F\u0916\u0947 \u0935\u0939\u0940 \u092D\u0941\u0917\u0924\u093E\u0928 \u0915\u0930\u0947\u0902",
    "Apply now \u2014 it's free": "\u0905\u092D\u0940 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902 \u2014 \u092E\u0941\u092B\u094D\u0924 \u0939\u0948",
    "Why customers choose us": "\u0917\u094D\u0930\u093E\u0939\u0915 \u0939\u092E\u0947\u0902 \u0915\u094D\u092F\u094B\u0902 \u091A\u0941\u0928\u0924\u0947 \u0939\u0948\u0902",
    "Why Customers Choose Us": "\u0917\u094D\u0930\u093E\u0939\u0915 \u0939\u092E\u0947\u0902 \u0915\u094D\u092F\u094B\u0902 \u091A\u0941\u0928\u0924\u0947 \u0939\u0948\u0902",
    "Apply Once. Compare": "\u090F\u0915 \u092C\u093E\u0930 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902\u0964 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902",
    ". Get the best offer delivered to you.": "\u0964 \u0938\u0930\u094D\u0935\u0936\u094D\u0930\u0947\u0937\u094D\u0920 \u0911\u092B\u0930 \u0906\u092A\u0924\u0915 \u092A\u0939\u0941\u0902\u091A\u093E\u090F\u0902\u0964",
    "\u2013 what you see is what you pay": "\u2013 \u091C\u094B \u0926\u093F\u0916\u0947 \u0935\u0939\u0940 \u092D\u0941\u0917\u0924\u093E\u0928 \u0915\u0930\u0947\u0902",
    "128+ partners": "128+ \u0938\u093E\u091D\u0947\u0926\u093E\u0930",
    "Banks, NBFCs & HFCs": "\u092C\u0948\u0902\u0915, NBFC \u0914\u0930 HFC",
    "24-hr disbursal": "24 \u0918\u0902\u091F\u0947 \u092E\u0947\u0902 \u0935\u093F\u0924\u0930\u0923",
    "For approved applicants": "\u0905\u0928\u0941\u092E\u094B\u0926\u093F\u0924 \u0906\u0935\u0947\u0926\u0915\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F",
    "Customers helped": "\u0917\u094D\u0930\u093E\u0939\u0915\u094B\u0902 \u0915\u0940 \u092E\u0926\u0926",
    "Bank-grade": "\u092C\u0948\u0902\u0915-\u0938\u094D\u0924\u0930",
    "256-bit secure & private": "256-\u092C\u093F\u091F \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0914\u0930 \u0917\u094B\u092A\u0928\u0940\u092F",
    "All Major Banks & NBFCs": "\u0938\u092D\u0940 \u092A\u094D\u0930\u092E\u0941\u0916 \u092C\u0948\u0902\u0915 \u0914\u0930 NBFC",
    "One application \u2013 offers sourced across leading lenders": "\u090F\u0915 \u0906\u0935\u0947\u0926\u0928 \u2013 \u0936\u0940\u0930\u094D\u0937 \u0932\u0947\u0902\u0921\u0930\u094B\u0902 \u0938\u0947 \u0911\u092B\u0930",
    "RBI-regulated lending partners": "RBI-\u0935\u093F\u0928\u093F\u092F\u092E\u093F\u0924 \u0932\u0947\u0902\u0921\u093F\u0902\u0917 \u092A\u093E\u0930\u094D\u091F\u0928\u0930",
    "256-bit secure": "256-\u092C\u093F\u091F \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924",
    "Hand-picked offers from": "\u0939\u093E\u0925 \u0938\u0947 \u091A\u0941\u0928\u0947 \u0917\u090F \u0911\u092B\u0930",
    "Money in minutes via pre-approved offers": "\u092A\u094D\u0930\u0940-\u0905\u0928\u0941\u092E\u094B\u0926\u093F\u0924 \u0911\u092B\u0930 \u0938\u0947 \u092E\u093F\u0928\u091F\u094B\u0902 \u092E\u0947\u0902 \u092A\u0948\u0938\u093E",
    "Quick sanction & disbursal": "\u0924\u0947\u091C \u0938\u094D\u0935\u0940\u0915\u0943\u0924\u093F \u0914\u0930 \u0935\u093F\u0924\u0930\u0923",
    "Products": "\u0909\u0924\u094D\u092A\u093E\u0926",
    "Popular Guides": "\u0932\u094B\u0915\u092A\u094D\u0930\u093F\u092F \u0917\u093E\u0907\u0921",
    "Legal": "\u0915\u093E\u0928\u0942\u0928\u0940",
    "Compare": "\u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902",
    "Best Personal Loan": "\u0938\u0930\u094D\u0935\u0936\u094D\u0930\u0947\u0937\u094D\u0920 \u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0917\u0924 \u0932\u094B\u0928",
    "Loan for Low CIBIL": "\u0915\u092E CIBIL \u0915\u0947 \u0932\u093F\u090F \u0932\u094B\u0928",
    "Business Loan for MSMEs": "MSME \u0915\u0947 \u0932\u093F\u090F \u0935\u094D\u092F\u093E\u092A\u093E\u0930 \u0932\u094B\u0928",
    "Improve Credit Score": "\u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0938\u094D\u0915\u094B\u0930 \u0938\u0941\u0927\u093E\u0930\u0947\u0902",
    "Privacy Policy": "\u0917\u094B\u092A\u0928\u0940\u092F\u0924\u093E \u0928\u0940\u0924\u093F",
    "Your Rights (DPDP)": "\u0906\u092A\u0915\u0947 \u0905\u0927\u093F\u0915\u093E\u0930 (DPDP)",
    "Terms & Conditions": "\u0928\u093F\u092F\u092E \u0935 \u0936\u0930\u094D\u0924\u0947\u0902",
    "Disclaimer": "\u0905\u0938\u094D\u0935\u0940\u0915\u0930\u0923",
    "Grievance Redressal": "\u0936\u093F\u0915\u093E\u092F\u0924 \u0928\u093F\u0935\u093E\u0930\u0923",
    "Partner Lenders & Disclosures": "\u092A\u093E\u0930\u094D\u091F\u0928\u0930 \u0932\u0947\u0902\u0921\u0930 \u0914\u0930 \u092A\u094D\u0930\u0915\u091F\u0940\u0915\u0930\u0923",
    "Cookie Policy": "\u0915\u0941\u0915\u0940 \u0928\u0940\u0924\u093F",
    "Refund & Cancellation": "\u0935\u093E\u092A\u0938\u0940 \u0914\u0930 \u0930\u0926\u094D\u0926\u0940\u0915\u0930\u0923",
    "Data Retention Policy": "\u0921\u0947\u091F\u093E \u0938\u0902\u0917\u094D\u0930\u0939\u0923 \u0928\u0940\u0924\u093F",
    "Data Breach Policy": "\u0921\u0947\u091F\u093E \u0909\u0932\u094D\u0932\u0902\u0918\u0928 \u0928\u0940\u0924\u093F",
    "Fair Practices Code": "\u0909\u091A\u093F\u0924 \u0906\u091A\u0930\u0923 \u0938\u0902\u0939\u093F\u0924\u093E",
    "Consent & Communication": "\u0938\u0939\u092E\u0924\u093F \u0914\u0930 \u0938\u0902\u091A\u093E\u0930"
  };
    var PH_HI = {
    "e.g. Rohan Sharma": "\u091C\u0948\u0938\u0947 \u0930\u094B\u0939\u0928 \u0936\u0930\u094D\u092E\u093E", "10-digit mobile": "10-\u0905\u0902\u0915 \u092E\u094B\u092C\u093E\u0907\u0932",
    "e.g. Mumbai": "\u091C\u0948\u0938\u0947 \u092E\u0941\u0902\u092C\u0908"
  };
  var DICT = { hi: HI };
  var ORIG = (typeof WeakMap !== "undefined") ? new WeakMap() : null;

  function curLang() { return localStorage.getItem("cb_lang") || "en"; }
  function t(key) { var l = curLang(); return (l !== "en" && DICT[l] && DICT[l][key]) || null; }

  /* in-memory + persistent cache of auto-translations for the current language */
  var AUTO = {}, autoLang = null;
  function autoLoad(l) { if (autoLang === l) return; autoLang = l; try { AUTO = JSON.parse(localStorage.getItem("cb_auto_" + l) || "{}"); } catch (e) { AUTO = {}; } }
  function autoSave(l) { try { localStorage.setItem("cb_auto_" + l, JSON.stringify(AUTO)); } catch (e) {} }
  var HAS_LETTER = /[A-Za-z]/;

  function sweepText(l) {
    if (!document.body) return [];
    var d = DICT[l];
    var pending = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var p = n.parentNode; if (!p) continue;
      var tag = p.nodeName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "TEXTAREA") continue;
      if (p.closest && p.closest("[data-no-i18n]")) continue;
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      if (ORIG && !ORIG.has(n)) ORIG.set(n, n.nodeValue);
      var en = ORIG ? ORIG.get(n) : n.nodeValue;
      if (l === "en") { n.nodeValue = en; continue; }
      var key = en.trim();
      var tr = (d && d[key]) || AUTO[key];
      if (tr) { var lead = en.match(/^\s*/)[0], trail = en.match(/\s*$/)[0]; n.nodeValue = lead + tr + trail; }
      else { n.nodeValue = en; if (HAS_LETTER.test(key) && key.length > 1) pending.push({ node: n, en: en }); }
    }
    return pending;
  }
  function sweepPlaceholders(l) {
    document.querySelectorAll("[placeholder]").forEach(function (el) {
      if (!el.hasAttribute("data-en-ph")) el.setAttribute("data-en-ph", el.getAttribute("placeholder"));
      var en = el.getAttribute("data-en-ph");
      var tr = (l !== "en") && (PH_HI[en] || AUTO[en && en.trim()]);
      el.setAttribute("placeholder", tr || en);
    });
  }
  function applyPending(list) {
    var d = DICT[curLang()] || {};
    list.forEach(function (p) {
      if (!p.node || !p.node.parentNode) return;
      var en = p.en, key = en.trim();
      var val = (d && d[key]) || AUTO[key];
      if (val) { var lead = en.match(/^\s*/)[0], trail = en.match(/\s*$/)[0]; p.node.nodeValue = lead + val + trail; }
    });
  }

  /* tiny "translating" toast */
  function transToast(on) {
    var el = document.getElementById("cbTransToast");
    if (on) {
      if (!el) {
        el = document.createElement("div");
        el.id = "cbTransToast";
        el.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:400;background:var(--ink);color:#fff;font:600 13px/1 var(--font-sans);padding:10px 16px;border-radius:50px;box-shadow:0 8px 24px rgba(0,0,0,.3);display:flex;align-items:center;gap:8px";
        el.innerHTML = '<span style="width:13px;height:13px;border:2px solid rgba(255,255,255,.35);border-top-color:#9AEF5E;border-radius:50%;display:inline-block;animation:spin .7s linear infinite"></span> \u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0905\u0928\u0941\u0935\u093E\u0926 \u0939\u094B \u0930\u0939\u093E \u0939\u0948\u2014';
        document.body.appendChild(el);
      }
      el.style.display = "flex";
    } else if (el) { el.style.display = "none"; }
  }

  function parseArr(s) {
    if (!s) return null;
    var a = s.indexOf("["), b = s.lastIndexOf("]");
    if (a < 0 || b < 0) return null;
    try { var v = JSON.parse(s.slice(a, b + 1)); return Array.isArray(v) ? v : null; } catch (e) { return null; }
  }
  function buildPrompt(arr) {
    return "You are a professional English to Hindi (Devanagari) translator for an Indian consumer loan and finance website. " +
      "Translate each string into natural, simple, trustworthy Hindi that everyday Indian readers understand. " +
      "Do NOT translate or alter: the brand name MyCashBridge; the abbreviations EMI, NBFC, NBFCs, CIBIL, PAN, RBI, GST, GSTIN, CIN, LSP, DSA, KYC, SSL, ISO, WhatsApp, SIP, ITR, DND, NDNC; the rupee sign \u20B9; and all numbers, percentages, dates and currency amounts. Personal names may stay in English. Keep punctuation reasonable. " +
      "I will give a JSON array of English strings. Return ONLY a JSON array of the same length, in the SAME ORDER, where each element is the Hindi translation of the corresponding input. No markdown, no keys, no commentary. " +
      "Input: " + JSON.stringify(arr);
  }
  var autoBusy = false;
  function autoTranslate(l, pending) {
    if (autoBusy) return;
    if (!(window.claude && typeof window.claude.complete === "function")) return; // graceful: curated dict still covers funnel
    var need = [], seen = {};
    pending.forEach(function (p) { var k = p.en.trim(); if (!AUTO[k] && !seen[k]) { seen[k] = 1; need.push(k); } });
    if (!need.length) { applyPending(pending); return; }
    autoBusy = true; transToast(true);
    // batch by character budget so each response stays small enough to parse reliably
    var chunks = [], cur = [], curLen = 0;
    need.forEach(function (s) {
      if (cur.length && (curLen + s.length > 900 || cur.length >= 12)) { chunks.push(cur); cur = []; curLen = 0; }
      cur.push(s); curLen += s.length;
    });
    if (cur.length) chunks.push(cur);
    var done = 0;
    chunks.forEach(function (chunk) {
      window.claude.complete(buildPrompt(chunk)).then(function (res) {
        var arr = parseArr(res);
        if (arr && arr.length === chunk.length) {
          chunk.forEach(function (k, i) { if (typeof arr[i] === "string" && arr[i]) AUTO[k] = arr[i]; });
        }
      }).catch(function () {}).then(function () {
        done++;
        if (curLang() === l) { applyPending(pending); sweepPlaceholders(l); }
        if (done === chunks.length) { autoBusy = false; autoSave(l); transToast(false); }
      });
    });
  }

  function applyLang() {
    var l = curLang();
    document.documentElement.setAttribute("lang", l);
    if (l !== "en") autoLoad(l);
    var pending = sweepText(l);
    sweepPlaceholders(l);
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-l") === l);
    });
    if (l !== "en" && pending.length) autoTranslate(l, pending);
  }
  window.cbApplyLang = applyLang;
  function setLang(l) { localStorage.setItem("cb_lang", l); applyLang(); }

  /* ============================================================
     NAV
     ============================================================ */
  function dropItems(arr, folder) {
    return arr.map(function (l) {
      var href = folder === "tools" ? (BASE + l[0] + ".html") : (BASE + folder + "/" + l[0] + ".html");
      return '<a href="' + href + '"><span class="ic"><i data-lucide="' + l[2] + '"></i></span><span>' + l[1] + '</span></a>';
    }).join("");
  }
  function dropdown(label, key, overviewHref, items, compact) {
    return '<span class="nav-item"><a class="nav-link" href="' + overviewHref + '" data-i18n="' + key + '">' + label + ' <i data-lucide="chevron-down"></i></a>' +
      '<div class="nav-drop' + (compact ? ' compact' : '') + '"><div class="nav-drop-grid">' + items + '</div></div></span>';
  }
  function navHTML() {
    return '' +
    '<div class="topstrip"><span data-i18n="top.msg">New here? Check your eligibility in 10 seconds — it won\'t affect your credit score.</span>' +
      '<a href="' + BASE + 'tools/eligibility.html" data-i18n="top.cta">Check now</a></div>' +
    '<header class="nav"><div class="nav-inner">' +
      '<a class="nav-logo cb-logo-link" href="' + BASE + 'index.html">' + logoLockup() + '</a>' +
      '<nav class="nav-links">' +
        dropdown("Loans", "nav.loans", BASE + "index.html#loans", dropItems(LOANS, "loans")) +
        dropdown("Credit Cards", "nav.cards", BASE + "pages/credit-cards.html", dropItems(CARDS, "pages"), true) +
        dropdown("Insurance", "nav.insurance", BASE + "pages/insurance.html", dropItems(INSURANCE, "pages"), true) +
        dropdown("Investments", "nav.invest", BASE + "pages/investments.html", dropItems(INVEST, "pages"), true) +
        dropdown("Tools", "nav.tools", BASE + "tools/emi-calculator.html", dropItems(TOOLS, "tools"), true) +
      '</nav>' +
      '<span class="nav-spacer"></span>' +
      '<div class="lang-toggle" data-no-i18n><button data-l="en" data-setlang="en">EN</button><button data-l="hi" data-setlang="hi">\u0939\u093F\u0902</button></div>' +
      '<a class="nav-tel" href="tel:' + CFG.phoneRaw + '"><i data-lucide="phone-call"></i> ' + CFG.phone + '</a>' +
      '<button class="btn btn-filled btn-sm" data-apply data-i18n="nav.apply">Apply now</button>' +
      '<button class="btn btn-outline btn-sm nav-download-btn" id="cbNavReferBtn"><i data-lucide="share-2"></i> Refer Now</button>' +
      '<button class="hamburger" aria-label="Menu" data-drawer-open><i data-lucide="menu"></i></button>' +
    '</div></header>' + drawerHTML();
  }

  function drawerAcc(title, items, folder) {
    var links = items.map(function (l) {
      var href = folder === "tools" ? (BASE + l[0] + ".html") : (BASE + folder + "/" + l[0] + ".html");
      return '<a href="' + href + '">' + l[1] + '</a>';
    }).join("");
    return '<div class="drawer-group drawer-acc"><div class="drawer-acc-head" data-acc>' + title + ' <i data-lucide="chevron-down" class="chev"></i></div><div class="drawer-acc-body">' + links + '</div></div>';
  }
  function drawerHTML() {
    return '<div class="drawer" id="drawer"><div class="drawer-scrim" data-drawer-close></div><div class="drawer-panel">' +
      '<div class="drawer-head">' + logoLockup() + '<button class="drawer-close" data-drawer-close><i data-lucide="x"></i></button></div>' +
      '<div class="drawer-group" style="display:flex;gap:8px;border-top:none"><div class="lang-toggle" data-no-i18n><button data-l="en" data-setlang="en">EN</button><button data-l="hi" data-setlang="hi">\u0939\u093F\u0902</button></div></div>' +
      drawerAcc("Loans", LOANS, "loans") +
      drawerAcc("Credit Cards", CARDS, "pages") +
      drawerAcc("Insurance", INSURANCE, "pages") +
      drawerAcc("Investments", INVEST, "pages") +
      drawerAcc("Tools", TOOLS, "tools") +
      '<div class="drawer-group"><a href="' + BASE + 'pages/about.html">About Us</a></div>' +
      '<div class="drawer-group"><a href="' + BASE + 'pages/contact.html">Contact Us</a></div>' +
      '<div style="margin-top:18px;display:flex;flex-direction:column;gap:10px">' +
        '<button class="btn btn-filled btn-block" data-apply>Apply now</button>' +
        '<a class="btn btn-outline btn-block" href="tel:' + CFG.phoneRaw + '"><i data-lucide="phone-call"></i> ' + CFG.phone + '</a>' +
      '</div></div></div>';
  }

  /* ============================================================
     WHY-CHOOSE STRIP (subtle, every page) + injected above footer
     ============================================================ */
  function whyStripHTML() {
    return '<section class="whystrip"><div class="wrap whystrip-inner">' +
      '<span class="wlabel" data-i18n="why.label">Why customers choose us</span>' +
      '<span class="wp"><i data-lucide="check-circle-2"></i> Hand-picked offers from <b style="margin-left:4px">128+ lenders</b></span>' +
      '<span class="wp"><i data-lucide="zap"></i> Money in minutes via pre-approved offers</span>' +
      '<span class="wp"><i data-lucide="badge-check"></i> Quick sanction &amp; disbursal</span>' +
      '</div></section>';
  }

  /* ============================================================
     FAQS (constant across every page; injected above footer)
     ============================================================ */
  var FAQ_ITEMS = [
    ["How much loan amount can I get through MyCashBridge?", "The loan amount you may qualify for depends on your income, employment status, repayment capacity, credit profile, and lender eligibility criteria. Simply complete our application process, and our team will help identify suitable lending options based on your financial profile and borrowing requirements."],
    ["Will checking my eligibility with MyCashBridge affect my CIBIL score?", "No. Checking your eligibility through MyCashBridge does not impact your CIBIL score during the initial assessment stage. You can explore available loan options, understand your borrowing potential, and make informed decisions without worrying about negatively affecting your credit profile."],
    ["How quickly can I receive a loan through MyCashBridge?", "We understand that financial needs can arise unexpectedly. Once your application and required documents are submitted, our team works to connect you with suitable lending partners as quickly as possible. Final approval and disbursement timelines depend on lender verification and eligibility requirements."],
    ["What documents do I need to apply?", "Most applicants are required to provide basic documents such as Aadhaar Card, PAN Card, recent bank statements, income proof, and address proof. Depending on the loan type and lender requirements, additional documents may be requested to complete the verification and approval process."],
    ["Can MyCashBridge help if my CIBIL score is low?", "Yes. While your CIBIL score is an important consideration, lenders often evaluate multiple factors, including income stability, employment history, repayment capacity, and overall financial profile. Depending on your circumstances, suitable loan options may still be available through our lending network."],
    ["Are there any hidden charges?", "No. Transparency is one of the core values at MyCashBridge. Any applicable processing fees, charges, interest rates, and loan terms are clearly communicated before you proceed. We believe borrowers should have complete visibility into the financial commitment they are making."],
    ["Is my information safe with MyCashBridge?", "Absolutely. Protecting your personal and financial information is a priority for us. We use secure systems and industry-standard security practices to safeguard your data. Information is only used for processing your application and shared with relevant lending partners when necessary."],
    ["Why do borrowers choose MyCashBridge?", "Borrowers choose MyCashBridge because we simplify the loan journey through a fast, transparent, and customer-focused process. Instead of approaching multiple lenders individually, applicants can save time, reduce paperwork, and receive support in finding suitable lending solutions tailored to their needs."]
  ];
  function faqHTML() {
    var qa = FAQ_ITEMS.map(function (f) {
      return '<div class="qa"><button class="qa-q">' + f[0] + '<i data-lucide="chevron-down" class="chev"></i></button><div class="qa-a"><div class="qa-a-inner">' + f[1] + '</div></div></div>';
    }).join("");
    return '<section class="section" id="faqs" style="padding-top:0"><div class="wrap">' +
      '<div class="eyebrow">FAQs</div>' +
      '<h2 class="h-sec" style="margin:10px 0 20px">Frequently asked questions</h2>' +
      '<div class="faq">' + qa + '</div>' +
      '</div></section>';
  }

  /* ============================================================
     BRIDGE SLOGAN BAND (mascot + Hinglish line; every page)
     ============================================================ */
  function bridgeBandHTML() {
    return '<section class="bridge-band"><div class="wrap bridge-band-inner">' +
      '<img class="mascot bb-mascot" src="' + BASE + 'assets/setu/setu-hero.svg" alt="" aria-hidden="true">' +
      '<div class="bb-text">' +
        '<span class="bb-kicker">' + CFG.tagline + '</span>' +
        '<p class="bb-slogan">Hum sirf loan nahi, <b>financial support ka bridge</b> banate hain.</p>' +
      '</div>' +
      '</div></section>';
  }

  /* ============================================================
     FOOTER (LSP-aligned, real policy links, 5 columns)
     ============================================================ */
  function footerHTML() {
    var loanLinks = LOANS.slice(0, 5).map(function (l) { return '<a href="' + BASE + 'loans/' + l[0] + '.html">' + l[1] + '</a>'; }).join("");
    var prodLinks = '<a href="' + BASE + 'pages/credit-cards.html">Credit Cards</a><a href="' + BASE + 'pages/insurance.html">Insurance</a><a href="' + BASE + 'pages/investments.html">Investments</a><a href="' + BASE + 'tools/compare.html">Compare</a>';
    var guideLinks = '<a href="' + BASE + 'guides/best-personal-loan-india.html">Best Personal Loan</a><a href="' + BASE + 'guides/loan-for-low-cibil.html">Loan for Low CIBIL</a><a href="' + BASE + 'guides/business-loan-for-msme.html">Business Loan for MSMEs</a><a href="' + BASE + 'guides/how-to-improve-credit-score.html">Improve Credit Score</a>';
    var legal = [
      ["privacy-policy", "Privacy Policy"], ["user-rights", "Your Rights (DPDP)"], ["terms", "Terms & Conditions"], ["disclaimer", "Disclaimer"],
      ["grievance", "Grievance Redressal"], ["partner-lenders", "Partner Lenders & Disclosures"], ["cookie-policy", "Cookie Policy"], ["refund-policy", "Refund & Cancellation"],
      ["data-retention", "Data Retention Policy"], ["data-breach", "Data Breach Policy"], ["fair-practices", "Fair Practices Code"], ["consent-policy", "Consent & Communication"]
    ].map(function (p) { return '<a href="' + BASE + 'pages/' + p[0] + '.html">' + p[1] + '</a>'; }).join("");
    return '<footer class="footer"><div class="wrap footer-grid cols5">' +
      '<div>' +
        '' + logoLockup('cb-logo-foot') +
        '<p class="desc">A Lending Service Provider (LSP) helping you compare and apply for loans, cards and more from leading banks &amp; NBFCs &ndash; with clear EMIs and honest guidance.</p>' +
        '<div class="cert-strip">' +
          '<div class="cert-badge"><div class="cert-icon"><i data-lucide="shield-check"></i></div><div class="cert-info"><span class="cert-name">ISO 27001</span><span class="cert-label">Certified</span></div></div>' +
          '<div class="cert-badge"><div class="cert-icon"><i data-lucide="lock"></i></div><div class="cert-info"><span class="cert-name">SSL / TLS</span><span class="cert-label">256-bit Secure</span></div></div>' +
          '<div class="cert-badge"><div class="cert-icon"><i data-lucide="file-check-2"></i></div><div class="cert-info"><span class="cert-name">SOC 2</span><span class="cert-label">Compliant</span></div></div>' +
          '<div class="cert-badge"><div class="cert-icon"><i data-lucide="scan-search"></i></div><div class="cert-info"><span class="cert-name">VAPT</span><span class="cert-label">Tested</span></div></div>' +
          '<div class="cert-badge"><div class="cert-icon"><i data-lucide="credit-card"></i></div><div class="cert-info"><span class="cert-name">PCI DSS</span><span class="cert-label">Compliant</span></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-col"><h4>Loans</h4>' + loanLinks + '<a href="' + BASE + 'tools/emi-calculator.html">EMI Calculator</a></div>' +
      '<div class="footer-col"><h4>Products</h4>' + prodLinks + '</div>' +
      '<div class="footer-col"><h4>Popular Guides</h4>' + guideLinks + '</div>' +
      '<div class="footer-col"><h4>Legal</h4>' + legal + '</div>' +
    '</div>' +
    '<div class="footer-legal">' +
      '<p class="footer-disc"><strong data-i18n="foot.disc_label">Disclaimer:</strong> <span data-i18n="disc.text">MyCashBridge is a Lending Service Provider (LSP) and is not a bank, NBFC or financial institution. We only facilitate customer applications for financial products offered by partner banks and NBFCs. Loan approvals, interest rates, credit limits, processing fees and related terms are determined solely by the respective financial institution based on its policies and your eligibility. We do not guarantee approval of any product and never charge customers a fee for standard applications.</span></p>' +
      '<p class="footer-disc" style="margin-top:10px">MyCashBridge is a <strong>Reddington Global Consultancy Private Limited</strong> company.</p>' +
      '<p class="footer-disc" style="margin-top:4px">Registered office: ' + CFG.address + ', India &nbsp;&bull;&nbsp; <a href="tel:' + CFG.phoneRaw + '">' + CFG.phone + '</a> &nbsp;&bull;&nbsp; CIN: U72501HR2022PTC104372 &nbsp;&bull;&nbsp; GSTIN: 06AALCR9469E1ZV</p>' +
      '<p class="footer-disc" style="margin-top:4px">Inquiries: <a href="mailto:inquiry@mycashbridge.com">inquiry@mycashbridge.com</a> &nbsp;&bull;&nbsp; Applications: <a href="mailto:application@mycashbridge.com">application@mycashbridge.com</a> &nbsp;&bull;&nbsp; Privacy: <a href="mailto:privacy@mycashbridge.com">privacy@mycashbridge.com</a></p>' +
      '<p class="footer-disc" style="margin-top:4px">Grievance Officer: <strong>Jyotsana Bora</strong> &nbsp;&bull;&nbsp; <a href="mailto:grievance@mycashbridge.com">grievance@mycashbridge.com</a> &nbsp;&bull;&nbsp; <a href="tel:+918796508140">+91 87965 08140</a></p>' +
      '<div class="footer-bottom"><span>&copy; ' + new Date().getFullYear() + ' ' + CFG.brand + '. All rights reserved.</span>' +
        '<span class="links"><a href="' + BASE + 'pages/privacy-policy.html">Privacy</a><a href="' + BASE + 'pages/terms.html">Terms</a><a href="' + BASE + 'pages/disclaimer.html">Disclaimer</a><a href="#" data-cookie-settings>Cookie settings</a></span>' +
      '</div>' +
    '</div></footer>';
  }

  /* ============================================================
     FLOATS + MOBILE BAR
     ============================================================ */
  function floatsHTML() {
    return '<div class="floats">' +
      '<button class="float-btn cb-btt" id="cbBtt" aria-label="Back to top" title="Back to top"><i data-lucide="chevron-up"></i></button>' +
      '<a class="float-btn float-wa" href="https://wa.me/' + CFG.whatsapp + '?text=Hi%20' + encodeURIComponent(CFG.brand) + '%2C%20I%27d%20like%20help%20with%20a%20loan." target="_blank" rel="noopener" aria-label="WhatsApp"><i data-lucide="message-circle"></i></a>' +
      '<a class="float-btn float-call" href="tel:' + CFG.phoneRaw + '" aria-label="Call us"><i data-lucide="phone"></i></a></div>' +
    '<div class="mobile-bar"><div class="mobile-bar-inner">' +
      '<a class="btn btn-outline" href="tel:' + CFG.phoneRaw + '"><i data-lucide="phone"></i> Call</a>' +
      '<button class="btn btn-filled" data-apply><i data-lucide="pencil-line"></i> Apply now</button></div></div>' +
    /* -- Scroll nudge card (slides in from bottom-right at ~55% scroll depth) -- */
    '<div class="scroll-nudge" id="cbScrollNudge" role="complementary" aria-label="Quick apply">' +
      '<button class="scroll-nudge-close" id="cbNudgeClose" aria-label="Dismiss"><i data-lucide="x"></i></button>' +
      '<div class="scroll-nudge-body">' +
        '<span class="scroll-nudge-emoji">\uD83D\uDCDE</span>' +
        '<div>' +
          '<b class="scroll-nudge-title">Get a call back in 30 sec</b>' +
          '<p class="scroll-nudge-sub">Free &middot; No obligation &middot; Won\'t affect CIBIL score</p>' +
        '</div>' +
      '</div>' +
      '<button class="btn btn-filled btn-block scroll-nudge-cta" data-apply><i data-lucide="phone-call"></i> Apply Now &mdash; It\'s Free</button>' +
      '<div class="scroll-nudge-progress"><div class="scroll-nudge-progress-bar" id="cbNudgeBar"></div></div>' +
    '</div>' +
    /* -- Sticky bottom CTA bar (slides up after 350 px scroll, hides near footer) -- */
    '<div class="cb-sticky-bar" id="cbStickyBar">' +
      '<div class="cb-sticky-inner">' +
        '<div class="cb-sticky-msg">' +
          '<i data-lucide="gift" class="cb-sticky-ic"></i>' +
          '<div>' +
            '<b class="cb-sticky-title">Refer a friend &amp; earn up to &#8377;10,000 &bull; per successful disbursal</b>' +
            '<span class="cb-sticky-sub">Home Loan &bull; LAP &bull; Business Loan &bull; No limit on referrals</span>' +
          '</div>' +
        '</div>' +
        '<div class="cb-sticky-actions">' +
          '<button class="btn cb-sticky-apply" id="cbReferNowBtn"><i data-lucide="share-2"></i> Refer Now</button>' +
          '<button class="cb-sticky-dismiss" id="cbStickyDismiss" aria-label="Dismiss"><i data-lucide="x"></i></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ============================================================
     APPLY MODAL + FORM
     ============================================================ */
  function referModalHTML() {
    return '<div class="modal" id="referModal" role="dialog" aria-modal="true">' +
      '<div class="modal-scrim" id="referModalScrim"></div>' +
      '<div class="modal-box" style="max-width:480px">' +
        '<button class="modal-close" id="referModalClose"><i data-lucide="x"></i></button>' +
        '<div style="text-align:center;margin-bottom:18px">' +
          '<div style="background:var(--brand-lime,#9AEF5E);width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green-deep,#073d27)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>' +
          '</div>' +
          '<h3 style="font-size:20px;font-weight:800;color:var(--green-primary,#0c7a4e);margin:0 0 4px">Refer &amp; Earn</h3>' +
          '<p style="font-size:14px;color:var(--text-soft,#5a6472);margin:0">Earn a reward for every friend whose loan gets disbursed.</p>' +
        '</div>' +
        '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px">' +
          '<thead>' +
            '<tr style="border-bottom:2px solid var(--green-primary,#0c7a4e)">' +
              '<th style="text-align:left;padding:10px 8px;font-weight:700;color:var(--green-primary,#0c7a4e)">Product</th>' +
              '<th style="text-align:right;padding:10px 8px;font-weight:700;color:var(--green-primary,#0c7a4e)">Referral Reward on Disbursal (Upto)</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            '<tr style="border-bottom:1px solid #eee">' +
              '<td style="padding:12px 8px;font-weight:600">Home Loan</td>' +
              '<td style="padding:12px 8px;text-align:right;font-weight:700;color:var(--green-primary,#0c7a4e)">&#8377;7,000</td>' +
            '</tr>' +
            '<tr style="border-bottom:1px solid #eee">' +
              '<td style="padding:12px 8px;font-weight:600">LAP</td>' +
              '<td style="padding:12px 8px;text-align:right;font-weight:700;color:var(--green-primary,#0c7a4e)">&#8377;10,000</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:12px 8px;font-weight:600">Business Loan</td>' +
              '<td style="padding:12px 8px;text-align:right;font-weight:700;color:var(--green-primary,#0c7a4e)">&#8377;10,000</td>' +
            '</tr>' +
          '</tbody>' +
        '</table>' +
        '<form id="referForm" novalidate>' +
          '<div style="display:flex;flex-direction:column;gap:12px">' +
            '<div><label style="font-size:13px;font-weight:700;display:block;margin-bottom:4px">Your Name</label>' +
              '<input name="refName" type="text" placeholder="e.g. Rohan Sharma" style="width:100%;padding:10px 14px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box">' +
            '</div>' +
            '<div><label style="font-size:13px;font-weight:700;display:block;margin-bottom:4px">Your Mobile</label>' +
              '<input name="refMobile" type="tel" inputmode="numeric" maxlength="10" placeholder="10-digit mobile" style="width:100%;padding:10px 14px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box">' +
            '</div>' +
            '<div><label style="font-size:13px;font-weight:700;display:block;margin-bottom:4px">Friend\'s Name</label>' +
              '<input name="refFriendName" type="text" placeholder="e.g. Priya Mehta" style="width:100%;padding:10px 14px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box">' +
            '</div>' +
            '<div><label style="font-size:13px;font-weight:700;display:block;margin-bottom:4px">Friend\'s Mobile</label>' +
              '<input name="refFriendMobile" type="tel" inputmode="numeric" maxlength="10" placeholder="10-digit mobile" style="width:100%;padding:10px 14px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box">' +
            '</div>' +
            '<div><label style="font-size:13px;font-weight:700;display:block;margin-bottom:4px">Loan Type</label>' +
              '<select name="refLoan" style="width:100%;padding:10px 14px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;font-family:inherit;box-sizing:border-box;background:#fff">' +
                '<option value="">Select loan type</option>' +
                '<option>Home Loan</option>' +
                '<option>LAP</option>' +
                '<option>Business Loan</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<button type="submit" style="width:100%;margin-top:18px;padding:13px;background:var(--green-primary,#0c7a4e);color:#fff;border:none;border-radius:50px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>' +
            'Submit Referral' +
          '</button>' +
        '</form>' +
        '<div id="referThanks" style="display:none;text-align:center;padding:16px 0">' +
          '<div style="font-size:40px;margin-bottom:8px">\uD83C\uDF89</div>' +
          '<h4 style="font-size:18px;font-weight:800;color:var(--green-primary,#0c7a4e);margin:0 0 8px">Referral Submitted!</h4>' +
          '<p style="font-size:14px;color:var(--text-soft,#5a6472);margin:0">We\'ll reach out to your friend shortly. Reward is credited after disbursal.</p>' +
        '</div>' +
        '<p style="font-size:11px;color:#aaa;margin:12px 0 0;text-align:center">Reward credited to your account after successful loan disbursal. T&amp;C apply.</p>' +
      '</div>' +
    '</div>';
  }

  function modalHTML() {
    return '<div class="modal" id="applyModal" role="dialog" aria-modal="true"><div class="modal-scrim" data-modal-close></div>' +
      '<div class="modal-box"><button class="modal-close" data-modal-close><i data-lucide="x"></i></button>' +
        '<div class="modal-form-wrap"><div class="modal-head">' +
          '<span class="pill pill-approved" style="margin-bottom:12px" data-i18n="modal.safe"><i data-lucide="shield-check"></i> 100% safe & confidential</span>' +
          '<h3 id="applyTitle" data-i18n="modal.title">Apply for a loan</h3>' +
          '<p class="sub" data-i18n="modal.sub">Share a few details and an expert will call you back. No paperwork to start.</p></div>' +
          formFieldsHTML("modal") +
        '</div>' + thanksHTML() +
      '</div></div>';
  }
  function formFieldsHTML(ctx, loanLabel) {
    /*
     * DPDP Act 2023 Phase 2 — Section 5 Notice
     * A compact inline notice displayed immediately before form fields
     * stating: data collected, purpose, partner sharing, and rights link.
     * Design is intentionally minimal to preserve conversion rate.
     *
     * DPDP Act 2023 Phase 1 — Split Consent
     * Service consent (required): processing the loan enquiry.
     * Marketing consent (optional): promotional communications.
     * Two separate checkboxes as required by Section 6(1)(a).
     */
    return '<form class="lead-form" data-loan="' + (loanLabel || "") + '" novalidate>' +
      '<div class="dpdp-notice" style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:#155724;display:flex;gap:8px;align-items:flex-start">' +
        '<span style="flex-shrink:0;font-size:14px">&#x2139;&#xFE0F;</span>' +
        '<span><strong>Why we ask:</strong> Your details are shared with partner banks &amp; NBFCs to process your loan enquiry. See our <a href="' + BASE + 'pages/privacy-policy.html" style="color:#0a5e3a;text-decoration:underline">Privacy Policy</a> and <a href="' + BASE + 'pages/user-rights.html" style="color:#0a5e3a;text-decoration:underline">Your Rights (DPDP Act 2023)</a>.</span>' +
      '</div>' +
      '<div class="form-grid">' +
      '<div class="field full"><label>Full name</label><input name="name" type="text" placeholder="e.g. Rohan Sharma" autocomplete="name"><span class="err">Please enter your name</span></div>' +
      '<div class="field"><label>Mobile number</label><div class="tel-wrap"><span class="cc">+91</span><input name="mobile" type="tel" inputmode="numeric" maxlength="10" placeholder="10-digit mobile" autocomplete="tel-national"></div><span class="err">Enter a valid 10-digit mobile</span></div>' +
      '<div class="field"><label>City</label><input name="city" type="text" placeholder="e.g. Pune"><span class="err">Please enter your city</span></div>' +
      '<div class="field"><label>Monthly income</label><select name="income"><option value="">Select range</option><option>Below \u20B925,000</option><option>\u20B925,000 \u2013 \u20B950,000</option><option>\u20B950,000 \u2013 \u20B91,00,000</option><option>Above \u20B91,00,000</option></select><span class="err">Select your income range</span></div>' +
      '<div class="field"><label>Employment type</label><div class="seg" data-seg="employment"><div class="seg-opt" data-val="Salaried">Salaried</div><div class="seg-opt" data-val="Self-employed">Self-employed</div><div class="seg-opt" data-val="Business owner">Business</div><input type="hidden" name="employment"></div><span class="err">Select one</span></div>' +
      '<div class="field"><label>Age</label><input name="age" type="number" min="21" max="80" inputmode="numeric" placeholder="e.g. 28"><span class="err">Applicants must be 21 years or above</span><span style="display:block;margin-top:5px;font-size:11px;color:#0c5460;background:#d1ecf1;border:1px solid #bee5eb;border-radius:5px;padding:4px 8px">&#x2139;&#xFE0F; Applicants must be at least <strong>21 years old</strong> to be eligible for a loan.</span></div>' +
      '<div class="field full"><label>Outstanding debt <span class="opt">(if any)</span></label><div class="seg" data-seg="outstanding_debt"><div class="seg-opt" data-val="None">None</div><div class="seg-opt" data-val="Loan">Loan</div><div class="seg-opt" data-val="Credit Card">Credit Card</div><div class="seg-opt" data-val="Both">Both</div><input type="hidden" name="outstanding_debt"></div><div class="outstanding-amt" style="display:none;margin-top:8px"><label style="font-size:12px;color:var(--text-soft);margin-bottom:4px;display:block">Outstanding amount (&#x20B9;)</label><input name="outstanding_amount" type="number" min="0" placeholder="e.g. 50000" inputmode="numeric"></div></div>' +
      '<div class="field"><label>CIBIL score <span class="opt">(approx.)</span></label><select name="cibil_score"><option value="">Select range</option><option>Don\'t know</option><option>Below 600 (Poor)</option><option>600\u2013649 (Fair)</option><option>650\u2013699 (Average)</option><option>700\u2013749 (Good)</option><option>750\u2013799 (Very Good)</option><option>800+ (Excellent)</option></select></div>' +
      '<div class="field full"><label>PAN <span class="opt">(optional)</span></label><input name="pan" type="text" maxlength="10" placeholder="ABCDE1234F" style="text-transform:uppercase"></div>' +
      '<div class="field full"><div class="consent"><input type="checkbox" name="consent" id="' + ctx + '-consent"><label for="' + ctx + '-consent">I authorise ' + CFG.brand + ' and its partner banks/NBFCs to contact me regarding my loan enquiry via call, SMS, email or WhatsApp to process my application, and I accept the Terms &amp; Privacy Policy. This overrides my DND/NDNC registration.</label></div><span class="err">Please accept to continue</span></div>' +
      /* Optional marketing consent — separate checkbox per DPDP s.6(1)(a) */
      '<div class="field full" style="margin-top:-4px"><div class="consent"><input type="checkbox" name="mkt_consent" id="' + ctx + '-mkt"><label for="' + ctx + '-mkt" style="font-size:12px;color:var(--text-soft)">I also consent to receive promotional communications about other financial products from ' + CFG.brand + ' and its partners. <em>(Optional)</em></label></div></div>' +
      '</div><button class="btn btn-filled btn-block btn-lg" type="submit" style="margin-top:18px"><span class="btn-label"><i data-lucide="shield-check"></i> Get a call back</span></button>' +
      '<p style="text-align:center;font-size:12px;color:var(--text-soft);margin:12px 0 0">By continuing you agree it won\'t affect your credit score. We never charge a fee to apply.</p></form>';
  }
  window.cbFormFields = formFieldsHTML;
  function thanksHTML() {
    return '<div class="thanks"><div class="confetti"></div>' +
      '<img class="thanks-setu" src="' + BASE + 'assets/setu/setu-celebrate.svg" alt="" aria-hidden="true">' +
      '<h3 data-i18n="thanks.title">' + CFG.thanksTitle + '</h3><p data-i18n="thanks.body">' + CFG.thanksBody + '</p><div class="ref"></div></div>';
  }
  window.cbThanksHTML = thanksHTML;

  function relucide() { if (window.lucide) window.lucide.createIcons(); }

  function openModal(loanLabel) {
    var m = document.getElementById("applyModal"); if (!m) return;
    var title = m.querySelector("#applyTitle"), form = m.querySelector(".lead-form");
    m.querySelector(".modal-form-wrap").style.display = "";
    m.querySelector(".thanks").classList.remove("show");
    if (form) { form.reset(); form.querySelectorAll(".seg-opt").forEach(function (s) { s.classList.remove("sel"); }); form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("invalid"); }); resetBtn(form); }
    if (title) title.textContent = loanLabel ? "Apply for a " + loanLabel : "Apply for a loan";
    if (form) form.setAttribute("data-loan", loanLabel || "General enquiry");
    m.classList.add("open"); document.body.style.overflow = "hidden"; applyLang(); relucide();
  }
  function closeModal() { var m = document.getElementById("applyModal"); if (m) { m.classList.remove("open"); document.body.style.overflow = ""; } }
  window.cbOpenApply = openModal;

  function openReferModal() {
    var m = document.getElementById("referModal");
    if (!m) return;
    /* reset form if previously submitted */
    var form = document.getElementById("referForm");
    var thanks = document.getElementById("referThanks");
    if (form) form.style.display = "";
    if (thanks) thanks.style.display = "none";
    m.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeReferModal() {
    var m = document.getElementById("referModal");
    if (m) { m.classList.remove("open"); document.body.style.overflow = ""; }
  }
  function resetBtn(form) { var b = form.querySelector('button[type=submit]'); if (b) { b.disabled = false; var lbl = b.querySelector(".btn-label"); if (lbl) lbl.innerHTML = '<i data-lucide="shield-check"></i> Get a call back'; } }

  function validate(form) {
    var ok = true; function bad(f) { if (f) { f.classList.add("invalid"); ok = false; } }
    form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("invalid"); });
    var name = form.querySelector('[name=name]'); if (name && !name.value.trim()) bad(name.closest(".field"));
    var mob = form.querySelector('[name=mobile]'); if (mob && !/^[6-9]\d{9}$/.test(mob.value.trim())) bad(mob.closest(".field"));
    var city = form.querySelector('[name=city]'); if (city && !city.value.trim()) bad(city.closest(".field"));
    var inc = form.querySelector('[name=income]'); if (inc && !inc.value) bad(inc.closest(".field"));
    var emp = form.querySelector('[name=employment]'); if (emp && !emp.value) bad(emp.closest(".field"));
    var ageEl = form.querySelector('[name=age]'); if (ageEl) { var av = parseInt(ageEl.value, 10); if (!ageEl.value || isNaN(av) || av < 21) bad(ageEl.closest(".field")); }
    var con = form.querySelector('[name=consent]'); if (con && !con.checked) bad(con.closest(".field"));
    return ok;
  }
  function refCode() { return "CB-" + Date.now().toString(36).toUpperCase().slice(-6); }
  function confetti(container) {
    var colors = ["#9AEF5E", "#cba258", "#0c7a4e", "#7fe06a", "#e0fced"];
    var box = container.querySelector(".confetti"); if (!box) return; box.innerHTML = "";
    for (var i = 0; i < 28; i++) { var s = document.createElement("i");
      s.style.left = (Math.random() * 100) + "%"; s.style.top = "-12px"; s.style.background = colors[i % colors.length];
      s.style.animation = "cbFall " + (0.9 + Math.random() * 0.7) + "s " + (Math.random() * 0.25) + "s ease-in forwards";
      s.style.transform = "rotate(" + ((Math.random() * 360) | 0) + "deg)"; box.appendChild(s); }
  }
  function showThanks(form) {
    var ref = refCode(), modal = form.closest(".modal-box");
    if (modal) { modal.querySelector(".modal-form-wrap").style.display = "none"; var tk = modal.querySelector(".thanks"); tk.classList.add("show"); var r = tk.querySelector(".ref"); if (r) r.textContent = "Reference: " + ref; confetti(tk); }
    else { var card = form.closest(".apply-card"); if (card) { var fw = card.querySelector(".apply-form-wrap"); if (fw) fw.style.display = "none"; var th = card.querySelector(".thanks"); if (th) { th.classList.add("show"); var rr = th.querySelector(".ref"); if (rr) rr.textContent = "Reference: " + ref; confetti(th); } } }
    relucide();
  }
  function sendLead(form) {
    try {
      var data = new FormData(form), loan = form.getAttribute("data-loan") || "General enquiry";
      /*
       * Phase 1 — Consent Evidence:
       * Read both checkboxes and include consent metadata in payload.
       * Backend stores this as the consent sub-document on the lead record.
       * consent_service is always true (the required checkbox must be checked to reach here).
       * consent_marketing is optional — false does NOT block lead creation.
       */
      var mktConsent = form.querySelector('[name=mkt_consent]');
      var payload = {
        name:              data.get("name")       || "",
        mobile:            "+91 " + (data.get("mobile") || ""),
        city:              data.get("city")       || "",
        monthly_income:    data.get("income")     || "",
        employment:        data.get("employment") || "",
        age:               data.get("age")        || "",
        outstanding_debt:  data.get("outstanding_debt") || "None",
        outstanding_amount: data.get("outstanding_amount") || "",
        cibil_score:       data.get("cibil_score") || "",
        product_type:      loan,
        source_page:       location.pathname,
        /* DPDP consent evidence fields */
        consent_service:   true,
        consent_marketing: mktConsent ? mktConsent.checked : false,
        consent_version:   CONSENT_VERSION,
        _hp:               ""   /* honeypot — always empty from real users */
      };
      Object.assign(payload, getUtm());
      /* Primary: our Express server ? MongoDB */
      fetch("/api/lead", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
        signal:  AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined
      }).then(function(r){ if (!r.ok) throw new Error(r.status); })
      .catch(function() {
        /*
         * Phase 3 — Fallback: queue for retry on next page load.
         * FormSubmit.co dependency removed — all data stays first-party.
         * Queued leads are retried automatically via drainLeadRetryQueue().
         */
        queueLeadForRetry(payload);
      });
      /* Meta Pixel — Lead Event Tracking */
      if (typeof window.fbq === 'function') {
        try { window.fbq('track', 'Lead', { content_name: loan || 'general_lead', currency: 'INR' }); } catch(e) {}
      }
    } catch (e) {}
  }
  function handleSubmit(e) {
    var form = e.target.closest(".lead-form"); if (!form) return; e.preventDefault();
    if (!validate(form)) { var fb = form.querySelector(".field.invalid input, .field.invalid select"); if (fb) fb.focus(); return; }
    var btn = form.querySelector('button[type=submit]'); if (btn) { btn.disabled = true; var lbl = btn.querySelector(".btn-label"); if (lbl) lbl.innerHTML = '<span class="spinner"></span> Submitting…'; }
    setTimeout(function () { sendLead(form); showThanks(form); }, 850);
  }

  function openDrawer() { var d = document.getElementById("drawer"); if (d) { d.classList.add("open"); document.body.style.overflow = "hidden"; } }
  function closeDrawer() { var d = document.getElementById("drawer"); if (d) { d.classList.remove("open"); document.body.style.overflow = ""; } }

  /* ============================================================
     COOKIE CONSENT — actually blocks/clears non-essential cookies
     ============================================================ */
  var ESSENTIAL = ["cb_lang", "cb_cookie", "cb_hero_choice"]; // functional keys we allow
  var META_PIXEL_ID = "2554292998349367";
  var clearTimer = null;
  function getConsent() { try { return JSON.parse(localStorage.getItem("cb_cookie") || "null"); } catch (e) { return null; } }
  function clearNonEssentialCookies() {
    var all = document.cookie ? document.cookie.split(";") : [];
    var host = location.hostname, paths = ["/", location.pathname];
    all.forEach(function (c) {
      var name = c.split("=")[0].trim(); if (!name) return;
      if (ESSENTIAL.indexOf(name) !== -1) return;
      paths.forEach(function (p) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=" + p;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=" + p + ";domain=" + host;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=" + p + ";domain=." + host;
      });
    });
  }
  function enforceBlocking() {
    var c = getConsent();
    if (!c || (!c.analytics && !c.marketing)) {
      clearNonEssentialCookies();
      if (!clearTimer) clearTimer = setInterval(clearNonEssentialCookies, 3000); // keep blocking anything that tries to set cookies
    } else {
      if (clearTimer) { clearInterval(clearTimer); clearTimer = null; }
      if (c.analytics) loadAnalytics();
      if (c.marketing) loadMetaPixel();
    }
  }
  var analyticsLoaded = false;
  function loadAnalytics() {
    if (analyticsLoaded) return; analyticsLoaded = true;
    // Placeholder: real Meta Pixel / GA / GTM go here. They ONLY run after explicit consent.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "consent_granted_analytics", ts: Date.now() });
    // console.info("[Cash Bridge] Analytics enabled with consent.");
  }
  var metaPixelLoaded = false;
  function loadMetaPixel() {
    if (metaPixelLoaded) return; metaPixelLoaded = true;
    if (typeof window.fbq !== 'function') {
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "consent_granted_marketing", provider: "meta_pixel", pixelId: META_PIXEL_ID, ts: Date.now() });
  }
  function cookieHTML() {
    return '<div class="cookie" id="cookieBanner"><div class="cookie-inner">' +
      '<div class="cookie-txt"><b data-i18n="cookie.title">We use cookies</b><span data-i18n="cookie.body">We use cookies to improve the site and understand traffic. Click “Accept all” to allow analytics &amp; marketing cookies, or reject non-essential ones. See our <a href="' + BASE + 'pages/cookie-policy.html">Cookie Policy</a>.</span></div>' +
      '<div class="cookie-actions">' +
        '<button class="btn btn-rej btn-sm" data-ck="reject" data-i18n="cookie.reject">Reject non-essential</button>' +
        '<button class="btn btn-ghost btn-sm" style="color:#fff;border-color:rgba(255,255,255,.4)" data-ck="settings" data-i18n="cookie.settings">Settings</button>' +
        '<button class="btn btn-filled btn-sm" data-ck="accept" data-i18n="cookie.accept">Accept all</button>' +
      '</div></div></div>' +
      '<div class="ck-modal" id="ckModal"><div class="modal-scrim" data-ck="closesettings"></div><div class="ck-box">' +
        '<h3 style="font-size:21px;color:var(--green-primary);font-weight:700;margin:0 0 4px">Cookie settings</h3>' +
        '<p style="font-size:14px;color:var(--text-soft);margin:0 0 12px">Choose which cookies we may use. Essential cookies are always on.</p>' +
        '<div class="ck-row"><div><b>Essential</b><p>Required for the site to work (language, security). Always active.</p></div><label class="switch"><input type="checkbox" checked disabled><span class="sl"></span></label></div>' +
        '<div class="ck-row"><div><b>Analytics</b><p>Helps us understand usage to improve the site (e.g. Google Analytics).</p></div><label class="switch"><input type="checkbox" id="ckAnalytics"><span class="sl"></span></label></div>' +
        '<div class="ck-row"><div><b>Marketing</b><p>Used for ads &amp; remarketing (e.g. Meta Pixel).</p></div><label class="switch"><input type="checkbox" id="ckMarketing"><span class="sl"></span></label></div>' +
        '<button class="btn btn-filled btn-block btn-lg" data-ck="save" style="margin-top:16px">Save preferences</button>' +
      '</div></div>';
  }
  function saveConsent(obj) {
    /*
     * Phase 8 — Cookie Consent Evidence:
     * Persist consent to localStorage (existing UX, unchanged) AND
     * fire a silent POST to the backend so server-side evidence is
     * recorded independently of the user's device/browser storage.
     * This provides auditable proof of consent for DPDP compliance.
     */
    var withTs = Object.assign({ ts: Date.now() }, obj);
    localStorage.setItem("cb_cookie", JSON.stringify(withTs));
    enforceBlocking();
    /* Server-side evidence (fire-and-forget — never blocks UX) */
    try {
      fetch("/api/cookie-consent", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          cookieVersion:      "v1",
          analytics:          !!obj.analytics,
          marketing:          !!obj.marketing,
          acceptedCategories: Object.keys(obj).filter(function(k){ return k !== "ts" && obj[k]; }),
        }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined,
      }).catch(function(){});
    } catch (e) {}
  }
  function showCookieBanner() { var b = document.getElementById("cookieBanner"); if (b) b.classList.add("show"); }
  function hideCookieBanner() { var b = document.getElementById("cookieBanner"); if (b) b.classList.remove("show"); }
  function wireCookies() {
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-ck]"); if (el) {
        var a = el.getAttribute("data-ck");
        if (a === "accept") { saveConsent({ analytics: true, marketing: true }); hideCookieBanner(); }
        else if (a === "reject") { saveConsent({ analytics: false, marketing: false }); hideCookieBanner(); }
        else if (a === "settings" || a === "opensettings") { var m = document.getElementById("ckModal"); var c = getConsent(); document.getElementById("ckAnalytics").checked = !!(c && c.analytics); document.getElementById("ckMarketing").checked = !!(c && c.marketing); m.classList.add("open"); }
        else if (a === "closesettings") { document.getElementById("ckModal").classList.remove("open"); }
        else if (a === "save") { saveConsent({ analytics: document.getElementById("ckAnalytics").checked, marketing: document.getElementById("ckMarketing").checked }); document.getElementById("ckModal").classList.remove("open"); hideCookieBanner(); }
      }
      if (e.target.closest("[data-cookie-settings]")) { e.preventDefault(); var c2 = getConsent(); var mm = document.getElementById("ckModal"); document.getElementById("ckAnalytics").checked = !!(c2 && c2.analytics); document.getElementById("ckMarketing").checked = !!(c2 && c2.marketing); mm.classList.add("open"); }
    });
    enforceBlocking();
    if (!getConsent()) showCookieBanner();
  }

  /* ============================================================
     GLOBAL WIRING
     ============================================================ */
  function wire() {
    document.addEventListener("click", function (e) {
      var t2 = e.target;
      if (t2.closest("[data-apply]") && !t2.closest("[data-quick-apply]")) {
        e.preventDefault();
        var applyBtn = t2.closest("[data-apply]");
        var loanLabel = applyBtn.getAttribute("data-apply-loan") || "";
        /* Route to new 7-step QB popup. Falls back to old modal only on
           tool/guide/legal pages where the popup is intentionally blocked. */
        openQbPopup("loan", null, loanLabel || null);
        closeDrawer();
      }
      if (t2.closest("[data-modal-close]")) closeModal();
      if (t2.closest("[data-drawer-open]")) openDrawer();
      if (t2.closest("[data-drawer-close]")) closeDrawer();
      if (t2.closest("[data-acc]")) t2.closest(".drawer-acc").classList.toggle("open");
      var sl = t2.closest("[data-setlang]"); if (sl) setLang(sl.getAttribute("data-setlang"));
      var seg = t2.closest(".seg-opt");
      if (seg && seg.closest(".seg[data-seg]")) { var g = seg.closest(".seg"); g.querySelectorAll(".seg-opt").forEach(function (s) { s.classList.remove("sel"); }); seg.classList.add("sel"); var hid = g.querySelector('input[type=hidden]'); if (hid) hid.value = seg.getAttribute("data-val"); seg.closest(".field") && seg.closest(".field").classList.remove("invalid"); var _amtW = seg.closest(".field") ? seg.closest(".field").querySelector(".outstanding-amt") : null; if (_amtW && g.getAttribute("data-seg") === "outstanding_debt") _amtW.style.display = seg.getAttribute("data-val") !== "None" ? "" : "none"; }
      var q = t2.closest(".qa-q");
      if (q) { var qa = q.closest(".qa"), a = qa.querySelector(".qa-a"); var open = qa.classList.toggle("open"); a.style.maxHeight = open ? a.scrollHeight + "px" : "0px"; }
    });
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("input", function (e) {
      if (e.target.name === "mobile") e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
      if (e.target.name === "pan") e.target.value = e.target.value.toUpperCase().slice(0, 10);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeModal(); closeDrawer(); closeQbPopup(); var ck = document.getElementById("ckModal"); if (ck) ck.classList.remove("open"); var rm = document.getElementById("referModal"); if (rm) rm.classList.remove("open"); } });

    /* Refer Now modal */
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest("#cbReferNowBtn") || t.closest("#cbNavReferBtn")) { openReferModal(); }
      if (t.closest("#referModalClose") || t.closest("#referModalScrim")) { closeReferModal(); }
    });
    document.addEventListener("submit", function (e) {
      if (!e.target.matches("#referForm")) return;
      e.preventDefault();
      var f = e.target;
      var name   = f.refName.value.trim();
      var mobile = f.refMobile.value.trim();
      var fName  = f.refFriendName.value.trim();
      var fMob   = f.refFriendMobile.value.trim();
      var loan   = f.refLoan.value;
      if (!name || !mobile || !fName || !fMob || !loan) {
        alert("Please fill in all fields before submitting."); return;
      }
      f.style.display = "none";
      document.getElementById("referThanks").style.display = "block";
    });
  }

  /* EMI widget */
  function initEmi(root) {
    var rate = parseFloat(root.getAttribute("data-rate") || "11");
    var amtEl = root.querySelector("[data-emi-amount]"), monEl = root.querySelector("[data-emi-months]");
    var amtOut = root.querySelector("[data-emi-amount-out]"), monOut = root.querySelector("[data-emi-months-out]");
    var emiOut = root.querySelector("[data-emi-out]"), totOut = root.querySelector("[data-emi-total]"), intOut = root.querySelector("[data-emi-interest]"), rateOut = root.querySelector("[data-emi-rate]");
    function inr(n) { return "\u20B9" + Math.round(n).toLocaleString("en-IN"); }
    function calc() {
      var P = +amtEl.value, n = +monEl.value, r = rate / 12 / 100;
      var emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1), total = emi * n;
      if (amtOut) amtOut.textContent = inr(P); if (monOut) monOut.textContent = n + " " + (curLang() === "hi" ? "\u092E\u0939\u0940\u0928\u0947" : "months");
      if (emiOut) emiOut.textContent = inr(emi); if (totOut) totOut.textContent = inr(total);
      if (intOut) intOut.textContent = inr(total - P); if (rateOut) rateOut.textContent = rate + "% p.a.";
    }
    if (amtEl) amtEl.addEventListener("input", calc); if (monEl) monEl.addEventListener("input", calc); calc();
  }

  /* ============================================================
     PREMIUM UX — scroll reveal + interaction polish
     ============================================================ */
  function initReveal() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sel = ".section, .band, .whybox, .prod, .why, .tool, .step, .spec, .rev, .guide-card, .flow > div, .cta-strip, .emi, .apply-card, .whystrip-inner";
    var els = [].slice.call(document.querySelectorAll(sel));
    function showAll() { els.forEach(function (el) { el.style.transition = "none"; el.classList.add("in"); }); }
    if (reduce || !("IntersectionObserver" in window)) { showAll(); return; }
    document.documentElement.classList.add("cb-anim");
    els.forEach(function (el) { el.classList.add("reveal"); });
    function inView(el) { var r = el.getBoundingClientRect(); return r.top < (window.innerHeight || 800) * 0.96 && r.bottom > 0; }
    // reveal anything already on screen at load
    els.forEach(function (el) { if (inView(el)) el.classList.add("in"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var sibs = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (c) { return c.classList.contains("reveal"); }) : [];
          var idx = sibs.indexOf(el);
          el.style.transitionDelay = (idx > 0 ? Math.min(idx, 6) * 60 : 0) + "ms";
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
    // FAIL-SAFE: if the observer never fires (some embedded/preview environments),
    // force everything visible so content can never be stuck at opacity:0.
    setTimeout(showAll, 1400);
  }
  window.cbInitReveal = initReveal;

  /* ============================================================
     GSAP MOTION LAYER — smooth, professional, reduced-motion safe.
     Loads local gsap + ScrollTrigger; falls back to initReveal()
     if the files fail to load or the user prefers reduced motion.
     ============================================================ */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.async = false;
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  /* count-up for stat numbers: keeps prefix (₹), suffix (+, ₹) and en-IN grouping */
  function animateCounter(el) {
    var m = (el.textContent || "").match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    var prefix = m[1], raw = m[2].replace(/,/g, ""), suffix = m[3];
    var isFloat = raw.indexOf(".") > -1, target = parseFloat(raw);
    if (!isFinite(target) || target === 0) return;
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: Math.min(2, 0.8 + String(Math.round(target)).length * 0.15), ease: "power2.out",
      onUpdate: function () {
        el.textContent = prefix + (isFloat ? obj.v.toFixed(1) : Math.round(obj.v).toLocaleString("en-IN")) + suffix;
      },
      onComplete: function () {
        el.textContent = prefix + (isFloat ? target.toFixed(1) : Math.round(target).toLocaleString("en-IN")) + suffix;
      }
    });
  }

  function initGsapFx() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.7 });
    document.documentElement.classList.add("cb-gsap");

    /* ---- hero entrance (homepage hero variants + interior page headers) ---- */
    var heroLeft = document.querySelector(".hero-variant.on .hero-grid > div:first-child, .hero-variant.on .wrap > div:first-child") ||
                   document.querySelector(".hero .hero-grid > div:first-child") ||
                   document.querySelector(".phead .wrap");
    if (heroLeft) {
      gsap.from(heroLeft.children, { y: 26, opacity: 0, stagger: 0.09, duration: 0.8, delay: 0.05, clearProps: "all" });
    }
    var heroCard = document.querySelector(".hero-variant.on .emi-zone, .hero-variant.on .elig-card, .hero .emi-zone");
    if (heroCard) gsap.from(heroCard, { y: 34, opacity: 0, duration: 0.9, delay: 0.25, clearProps: "opacity" });
    var heroMascot = document.querySelector(".emi-figure");
    if (heroMascot) gsap.from(heroMascot, { y: 24, opacity: 0, scale: 0.92, duration: 0.7, delay: 0.6, clearProps: "all" });

    /* ---- scroll reveals: sections drift up gently ---- */
    var sections = gsap.utils.toArray(".section, .band, .whystrip, .bridge-band, .trust");
    sections.forEach(function (sec) {
      gsap.from(sec, {
        y: 22, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: sec, start: "top 92%", once: true }
      });
    });

    /* ---- cards stagger in as their row enters (carousel cards excluded: it owns transforms) ---- */
    var cardSel = ".prod, .why, .tool, .step, .goal, .guide-card, .spec, .rev, .cert-card, .whypoint, .pick a";
    var cards = gsap.utils.toArray(cardSel);
    if (cards.length) {
      gsap.set(cards, { y: 26, opacity: 0 });
      ScrollTrigger.batch(cards, {
        start: "top 94%", once: true,
        onEnter: function (batch) { gsap.to(batch, { y: 0, opacity: 1, stagger: 0.07, duration: 0.65, clearProps: "transform" }); }
      });
      /* fail-safe: never leave content invisible (mirrors initReveal's safety net) */
      setTimeout(function () { gsap.to(cards, { opacity: 1, y: 0, duration: 0.4, overwrite: "auto", clearProps: "transform" }); }, 3000);
    }

    /* ---- big feature blocks: soft rise + settle ---- */
    gsap.utils.toArray(".whybox, .slogan-ribbon, .founder, .cta-strip, .emi, .apply-card").filter(function (el) {
      return !el.closest(".hero") && !el.closest(".hero-variant"); /* hero cards already animated above */
    }).forEach(function (el) {
      gsap.from(el, {
        y: 30, opacity: 0, duration: 0.85,
        scrollTrigger: { trigger: el, start: "top 90%", once: true }
      });
    });

    /* ---- stat counters count up when seen ---- */
    gsap.utils.toArray(".hero-stat .s b, .whybox .card b").forEach(function (el) {
      ScrollTrigger.create({
        trigger: el, start: "top 95%", once: true,
        onEnter: function () { animateCounter(el); }
      });
    });

    /* layout shifts (fonts, lazy images, injected bands) — keep trigger positions honest */
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  function initMotion() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { initReveal(); return; } /* initReveal's reduce path shows everything, no motion */
    loadScript(BASE + "assets/gsap.min.js")
      .then(function () { return loadScript(BASE + "assets/ScrollTrigger.min.js"); })
      .then(function () {
        try { initGsapFx(); } catch (e) { initReveal(); }
      })
      .catch(function () { initReveal(); });
  }

  /* ============================================================
     MULTI-STEP LEAD POPUP — Paisabazaar-inspired
     Triggered by: [data-quick-apply], [data-service-type],
     product cards, navigation apply, exit-intent
     ============================================================ */
  var QB_STEPS = {
    loan: [
      /* Step 1 — Loan type tiles */
      { id: "lt0", title: "What type of loan do you need?",
        type: "tiles", field: "loan_type", required: true,
        options: [
          { val: "Personal Loan",          icon: "wallet",         label: "Personal Loan" },
          { val: "Business Loan",          icon: "store",          label: "Business Loan" },
          { val: "Home Loan",              icon: "home",           label: "Home Loan" },
          { val: "Car Loan",               icon: "car",            label: "Car Loan" },
          { val: "Education Loan",         icon: "graduation-cap", label: "Education" },
          { val: "Gold Loan",              icon: "gem",            label: "Gold Loan" }
        ]
      },
      /* Step 2 — Loan amount slider */
      { id: "lt1", title: "How much do you need?",
        subtitle: "Move the slider to select your loan amount.",
        type: "slider", field: "loan_amount",
        min: 50000, max: 5000000, step: 50000, default: 500000,
        format: function(v) { return qbFmtAmt(v); }
      },
      /* Step 3 — Contact + profile (lead saved fire-and-forget on Next) */
      { id: "lt2", title: "Tell us about yourself",
        subtitle: "Takes 30 seconds. Won\u2019t affect your credit score.",
        type: "lead_collect",
        fields: ["name","mobile","income","employment","age","outstanding_debt","cibil_score","city","consent"]
      },
      /* Step 4 — Eligibility estimate (no bureau hit) */
      { id: "lt3", type: "eligibility",
        title: "Your Estimated Eligibility",
        subtitle: "Based on your profile only \u2014 no credit report accessed yet."
      },
      /* Step 5 — Bureau consent gate */
      { id: "lt4", type: "bureau_gate",
        title: "Unlock Personalised Loan Offers"
      },
      /* Step 6 — Animated loading (auto-advances to step 7) */
      { id: "lt5", type: "bureau_loading" },
      /* Step 7 — Matched lenders */
      { id: "lt6", type: "lender_results" }
    ],
    insurance: [
      { id: "is1", title: "Which insurance are you looking for?", type: "tiles",
        field: "insurance_type", required: true,
        options: [
          { val: "Health Insurance", icon: "heart-pulse", label: "Health Insurance" },
          { val: "Life Insurance", icon: "umbrella", label: "Life Insurance" },
          { val: "Motor Insurance", icon: "car", label: "Motor Insurance" },
          { val: "Travel Insurance", icon: "plane", label: "Travel Insurance" }
        ]
      },
      { id: "is2", title: "Tell us about yourself", type: "form",
        fields: ["name","mobile","city","age","outstanding_debt","cibil_score"]
      }
    ],
    card: [
      { id: "cs1", title: "What type of card do you want?", type: "tiles",
        field: "card_type", required: true,
        options: [
          { val: "Cashback Card", icon: "badge-percent", label: "Cashback" },
          { val: "Travel Card", icon: "plane", label: "Travel" },
          { val: "Rewards Card", icon: "gift", label: "Rewards" },
          { val: "Secured Card", icon: "lock", label: "Secured" }
        ]
      },
      { id: "cs2", title: "Tell us about yourself", type: "form",
        fields: ["name","mobile","city","income","age","outstanding_debt","cibil_score"]
      }
    ],
    investment: [
      { id: "iv1", title: "What would you like to invest in?", type: "tiles",
        field: "invest_type", required: true,
        options: [
          { val: "SIP", icon: "repeat", label: "SIP" },
          { val: "Mutual Funds", icon: "layers", label: "Mutual Funds" },
          { val: "Demat Account", icon: "line-chart", label: "Demat Account" }
        ]
      },
      { id: "iv2", title: "Tell us about yourself", type: "form",
        fields: ["name","mobile","city","age","outstanding_debt","cibil_score"]
      }
    ],
    general: [
      /* Same 7-step flow as loan — general apply starts with loan type selection */
      { id: "gf0", title: "What type of loan do you need?",
        type: "tiles", field: "loan_type", required: true,
        options: [
          { val: "Personal Loan",          icon: "wallet",         label: "Personal Loan" },
          { val: "Business Loan",          icon: "store",          label: "Business Loan" },
          { val: "Home Loan",              icon: "home",           label: "Home Loan" },
          { val: "Car Loan",               icon: "car",            label: "Car Loan" },
          { val: "Education Loan",         icon: "graduation-cap", label: "Education" },
          { val: "Gold Loan",              icon: "gem",            label: "Gold Loan" }
        ]
      },
      { id: "gf1", title: "How much do you need?",
        subtitle: "Move the slider to select your loan amount.",
        type: "slider", field: "loan_amount",
        min: 50000, max: 5000000, step: 50000, default: 500000,
        format: function(v) { return qbFmtAmt(v); }
      },
      { id: "gf2", title: "Tell us about yourself",
        subtitle: "Takes 30 seconds. Won\u2019t affect your credit score.",
        type: "lead_collect",
        fields: ["name","mobile","income","employment","age","outstanding_debt","cibil_score","city","consent"]
      },
      { id: "gf3", type: "eligibility",
        title: "Your Estimated Eligibility",
        subtitle: "Based on your profile only \u2014 no credit report accessed yet."
      },
      { id: "gf4", type: "bureau_gate",
        title: "Unlock Personalised Loan Offers"
      },
      { id: "gf5", type: "bureau_loading" },
      { id: "gf6", type: "lender_results" }
    ]
  };

  var _qbData = {}, _qbStep = 0, _qbFlow = "general", _qbFixedType = null, _qbLoadingTimer = null;

  /* Collect UTM params from URL for lead attribution */
  function getUtm() {
    var p = new URLSearchParams(location.search);
    var r = {};
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach(function(k){
      var v = p.get(k); if (v) r[k] = v.slice(0, 100);
    });
    return r;
  }

  /* Map current page URL to a named service category for per-service popup tracking */
  function getServiceCategory() {
    var p = location.pathname;
    if (/\/loans\//.test(p)) return 'loans';
    if (/\/tools\//.test(p)) return 'tools';
    if (/\/guides\//.test(p)) return 'guides';
    if (/\/pages\//.test(p)) {
      if (/credit.card|cashback|travel.card|rewards.card|secured.card/.test(p)) return 'cards';
      if (/insurance|health|motor|life/.test(p)) return 'insurance';
      if (/invest|mutual.fund|sip|demat/.test(p)) return 'investments';
      return 'other';
    }
    return null;
  }

  /*
   * qbLead — QuickBook popup lead submission (Phase 1 + Phase 3)
   * Consent evidence added; FormSubmit.co fallback replaced with retry queue.
   */
  function qbLead(data) {
    var productLabel = data.loan_type || data.insurance_type || data.card_type ||
                       data.invest_type || data.product_type || "General";
    /* Phase 1: include consent evidence in QB lead payload */
    var payload = Object.assign(
      {},
      data,
      getUtm(),
      {
        product_type:      productLabel,
        source_page:       location.pathname,
        submitted_at:      new Date().toLocaleString("en-IN"),
        /* DPDP consent evidence — QB form service consent is always true */
        consent_service:   true,
        consent_marketing: false,  // QB popup does not have marketing checkbox
        consent_version:   CONSENT_VERSION,
        _hp:               ""   /* honeypot — must always be empty from real users */
      }
    );

    /* Track locally so we can show "already submitted" UX next visit */
    try {
      sessionStorage.setItem("cb_lead_sent", "1");
      var _submittedCat = getServiceCategory();
      if (_submittedCat) localStorage.setItem("cb_popup_done_" + _submittedCat, "1");
    } catch(e) {}

    /* Primary: our secure API server ? MongoDB */
    fetch("/api/lead", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
      signal:  AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined
    })
    .then(function(r) {
      if (!r.ok) throw new Error("API " + r.status);
    })
    .catch(function() {
      /* Phase 3: queue for retry — FormSubmit.co dependency removed */
      queueLeadForRetry(payload);
    });
  }

  function qbTileHTML(step) {
    return '<div class="qb-tiles">' + step.options.map(function(o){
      return '<button type="button" class="qb-tile" data-qb-tile data-val="' + o.val + '" data-field="' + step.field + '">' +
        '<span class="qb-tile-ic"><i data-lucide="' + o.icon + '"></i></span>' +
        '<span>' + o.label + '</span>' +
        '</button>';
    }).join("") + '</div>';
  }

  function qbSliderHTML(step) {
    var def = step.default || step.min;
    return '<div class="qb-slider-wrap">' +
      '<div class="qb-slider-val" id="qb_slider_out">' + step.format(def) + '</div>' +
      '<input type="range" class="qb-range" id="qb_slider" min="' + step.min + '" max="' + step.max + '" step="' + step.step + '" value="' + def + '" data-qb-slider data-field="' + step.field + '">' +
      '<div class="qb-slider-labels"><span>' + step.format(step.min) + '</span><span>' + step.format(step.max) + '</span></div>' +
      '</div>';
  }

  function qbFormHTML(step) {
    var f = step.fields || [];
    var html = '<div class="qb-form-inner">';
    /* Honeypot: hidden from real users via CSS, bots fill it — server drops submission */
    html += '<div class="hp-field" aria-hidden="true"><input name="_hp" type="text" tabindex="-1" autocomplete="off"></div>';
    if (f.indexOf("name") > -1) html += '<div class="field full"><label>Full name</label><input name="qb_name" type="text" placeholder="e.g. Rohan Sharma" autocomplete="name"><span class="err">Please enter your name</span></div>';
    if (f.indexOf("mobile") > -1) html += '<div class="field full"><label>Mobile number</label><div class="tel-wrap"><span class="cc">+91</span><input name="qb_mobile" type="tel" inputmode="numeric" maxlength="10" placeholder="10-digit mobile" autocomplete="tel-national"></div><span class="err">Enter a valid 10-digit mobile</span></div>';
    if (f.indexOf("city") > -1) html += '<div class="field"><label>City</label><input name="qb_city" type="text" placeholder="e.g. Pune"><span class="err">Required</span></div>';
    if (f.indexOf("income") > -1) html += '<div class="field"><label>Monthly income</label><select name="qb_income"><option value="">Select range</option><option>Below \u20B925,000</option><option>\u20B925,000 \u2013 \u20B950,000</option><option>\u20B950,000 \u2013 \u20B91,00,000</option><option>Above \u20B91,00,000</option></select><span class="err">Required</span></div>';
    if (f.indexOf("employment") > -1) html += '<div class="field full"><label>Employment type</label><div class="seg qb-seg" data-seg="qb_employment"><div class="seg-opt" data-val="Salaried">Salaried</div><div class="seg-opt" data-val="Self-employed">Self-employed</div><div class="seg-opt" data-val="Business owner">Business</div><input type="hidden" name="qb_employment"></div><span class="err">Select one</span></div>';
    if (f.indexOf("age") > -1) html += '<div class="field"><label>Age</label><input name="qb_age" type="number" min="21" max="80" inputmode="numeric" placeholder="e.g. 28"><span class="err">Must be 21 or above</span><span style="display:block;margin-top:5px;font-size:11px;color:#0c5460;background:#d1ecf1;border:1px solid #bee5eb;border-radius:5px;padding:4px 8px">&#x2139;&#xFE0F; Applicants must be at least <strong>21 years old</strong> to be eligible for a loan.</span></div>';
    if (f.indexOf("outstanding_debt") > -1) html += '<div class="field full"><label>Outstanding debt <span style="font-size:11px;color:var(--text-soft);font-weight:400">(if any)</span></label><div class="seg qb-seg" data-seg="qb_outstanding"><div class="seg-opt" data-val="None">None</div><div class="seg-opt" data-val="Loan">Loan</div><div class="seg-opt" data-val="Credit Card">Credit Card</div><div class="seg-opt" data-val="Both">Both</div><input type="hidden" name="qb_outstanding"></div><div class="outstanding-amt" style="display:none;margin-top:8px"><label style="font-size:12px;color:var(--text-soft);margin-bottom:4px;display:block">Outstanding amount (&#x20B9;)</label><input name="qb_outstanding_amount" type="number" min="0" placeholder="e.g. 50000" inputmode="numeric"></div></div>';
    if (f.indexOf("cibil_score") > -1) html += '<div class="field"><label>CIBIL score <span style="font-size:11px;color:var(--text-soft);font-weight:400">(approx.)</span></label><select name="qb_cibil"><option value="">Select range</option><option>Don\'t know</option><option>Below 600 (Poor)</option><option>600\u2013649 (Fair)</option><option>650\u2013699 (Average)</option><option>700\u2013749 (Good)</option><option>750\u2013799 (Very Good)</option><option>800+ (Excellent)</option></select></div>';
    if (f.indexOf("pan") > -1) html += '<div class="field full"><label>PAN Number <span class="opt-tag">Optional</span></label><input name="qb_pan" type="text" placeholder="ABCDE1234F" maxlength="10" style="text-transform:uppercase" autocomplete="off"></div>';
    if (f.indexOf("consent") > -1) html += '<div class="field full"><div class="consent"><input type="checkbox" name="qb_consent" id="qb-consent"><label for="qb-consent">I agree to receive loan-related communication via call, SMS, WhatsApp and email from ' + CFG.brand + ' and its partner lenders, and accept the <a href="' + BASE + 'pages/privacy-policy.html">Privacy Policy</a> and <a href="' + BASE + 'pages/terms.html">Terms</a>.</label></div><span class="err">Please accept to continue</span></div>';
    html += '</div>';
    return html;
  }

  function qbPreviewHTML() {
    var income = _qbData.monthly_income || "";
    var loanType = _qbData.loan_type || "Loan";
    var minAmt, maxAmt, rate;
    if (income.indexOf("Above") > -1) {
      minAmt = "\u20B98 Lakhs"; maxAmt = "\u20B925 Lakhs"; rate = "10.5";
    } else if (income.indexOf("1,00,000") > -1) {
      minAmt = "\u20B95 Lakhs"; maxAmt = "\u20B918 Lakhs"; rate = "11.5";
    } else if (income.indexOf("50,000") > -1 && income.indexOf("Below") === -1) {
      minAmt = "\u20B92 Lakhs"; maxAmt = "\u20B98 Lakhs"; rate = "12.5";
    } else {
      minAmt = "\u20B950,000"; maxAmt = "\u20B93 Lakhs"; rate = "13.5";
    }
    return '<div class="qb-preview-wrap">' +
      '<div class="qb-preview-card">' +
        '<div class="qb-preview-label">Estimated Eligibility</div>' +
        '<div class="qb-preview-range">' + minAmt + ' \u2013 ' + maxAmt + '</div>' +
        '<div class="qb-preview-meta">' +
          '<div class="qb-preview-stat"><span class="stat-label">Indicative Rate</span><span class="stat-val">From ' + rate + '% p.a.</span></div>' +
          '<div class="qb-preview-stat"><span class="stat-label">Partner Network</span><span class="stat-val">128+ Banks & NBFCs</span></div>' +
        '</div>' +
        '<div class="qb-preview-progress-row">' +
          '<span class="qb-preview-pct-label">Approval Journey</span>' +
          '<div class="qb-preview-pbar"><div class="qb-preview-pfill"></div></div>' +
          '<span class="qb-preview-pct">90%</span>' +
        '</div>' +
      '</div>' +
      '<p class="qb-preview-nudge">Based on the details provided, you may qualify for multiple ' + loanType + ' options from our lending network.</p>' +
      '<p class="qb-preview-sub">You\'re almost done. Complete the final step to view available offers.</p>' +
      '<div class="qb-preview-trust">' +
        '<span>\uD83D\uDD12 Secure & Encrypted</span>' +
        '<span>\u2705 Data Protected</span>' +
        '<span>\uD83C\uDFE6 Multiple Lending Partners</span>' +
        '<span>\u26A1 Quick Assessment</span>' +
      '</div>' +
      '<p class="qb-preview-disclaimer">Indicative estimate only \u2014 not a guaranteed offer. Final eligibility is subject to lender assessment and applicable terms.</p>' +
    '</div>';
  }

  /* ---- QB helper: format loan amount as ₹X L / ₹X Cr ---- */
  function qbFmtAmt(v) {
    v = parseInt(v, 10) || 0;
    if (v >= 10000000) return "\u20B9" + (v / 10000000).toFixed(1) + " Cr";
    if (v >= 100000)   return "\u20B9" + (v / 100000).toFixed(0) + " L";
    return "\u20B9" + v.toLocaleString("en-IN");
  }

  /* ---- Step 4: Eligibility estimate (no bureau) ---- */
  function qbEligibilityHTML() {
    var income     = _qbData.monthly_income || "";
    var employment = _qbData.employment    || "";
    var loanType   = _qbData.loan_type     || "Loan";
    var reqAmt     = parseInt(_qbData.loan_amount || "500000", 10);
    var minAmt, maxAmt, rate;
    if (income.indexOf("Above") > -1) {
      minAmt = 1000000; maxAmt = 3500000;
      rate = (employment === "Salaried") ? "10.5" : "12.0";
    } else if (income.indexOf("1,00,000") > -1) {
      minAmt = 500000; maxAmt = 1800000;
      rate = (employment === "Salaried") ? "11.0" : "13.0";
    } else if (income.indexOf("50,000") > -1 && income.indexOf("Below") === -1) {
      minAmt = 200000; maxAmt = 800000;
      rate = (employment === "Salaried") ? "11.5" : "14.0";
    } else {
      minAmt = 50000; maxAmt = 300000; rate = "13.5";
    }
    var inRange = reqAmt >= minAmt && reqAmt <= maxAmt;
    var msg = inRange
      ? "Your requested amount of <strong>" + qbFmtAmt(reqAmt) + "</strong> falls within your estimated eligibility range."
      : "Based on your salary and employment profile, you are <strong>likely eligible</strong> for loans between <strong>" + qbFmtAmt(minAmt) + "</strong> and <strong>" + qbFmtAmt(maxAmt) + "</strong>.";
    return '<div class="qb-elig-wrap">' +
      '<div class="qb-elig-card">' +
        '<div class="qb-elig-label">Estimated Eligibility Range</div>' +
        '<div class="qb-elig-range">' + qbFmtAmt(minAmt) + ' \u2013 ' + qbFmtAmt(maxAmt) + '</div>' +
        '<div class="qb-elig-meta">' +
          '<div class="qb-elig-stat"><span>Indicative Rate</span><b>From ' + rate + '% p.a.</b></div>' +
          '<div class="qb-elig-stat"><span>Lender Network</span><b>50+ Banks &amp; NBFCs</b></div>' +
          '<div class="qb-elig-stat"><span>Employment</span><b>' + (employment || "\u2014") + '</b></div>' +
        '</div>' +
      '</div>' +
      '<p class="qb-elig-note">' + msg + '</p>' +
      '<p class="qb-elig-wording">\u26a0\ufe0f Not approved. Not guaranteed. <em>Likely eligible.</em><br>' +
        '<span style="font-size:11px;color:#aaa">This estimate is based on your salary and employment data only. No credit report has been accessed.</span></p>' +
      '<div class="qb-elig-unlock">' +
        '<span class="qb-elig-unlock-icon">\uD83D\uDD13</span>' +
        '<div><strong>Unlock exact offers from 50+ lenders</strong><br>' +
          '<span style="font-size:12px;color:#888">Verify your credit profile to see personalised rates. Soft check \u2014 score safe.</span></div>' +
      '</div>' +
    '</div>';
  }

  /* ---- Step 5: Bureau consent gate ---- */
  function qbBureauGateHTML() {
    var maxDob = new Date();
    maxDob.setFullYear(maxDob.getFullYear() - 18);
    var maxDobStr = maxDob.toISOString().split("T")[0];
    return '<div class="qb-bureau-gate">' +
      '<p class="qb-bureau-intro">To provide <strong>exact offers</strong> from our lending partners, please verify your credit profile.<br>' +
        '<strong style="color:var(--green-primary)">\u2705 Soft check only \u2014 it will NOT affect your credit score.</strong></p>' +
      '<div class="qb-form-inner">' +
        '<div class="hp-field" aria-hidden="true"><input name="_hp" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<div class="field full"><label>PAN Number</label>' +
          '<input name="qb_pan" type="text" placeholder="ABCDE1234F" maxlength="10" style="text-transform:uppercase" autocomplete="off">' +
          '<span class="err">Enter a valid PAN (e.g. ABCDE1234F)</span></div>' +
        '<div class="field full"><label>Date of Birth</label>' +
          '<input name="qb_dob" type="date" max="' + maxDobStr + '">' +
          '<span class="err">Enter your date of birth (must be 18+)</span></div>' +
        '<div class="field full"><div class="consent">' +
          '<input type="checkbox" name="bureau_consent" id="bureau-consent">' +
          '<label for="bureau-consent">I authorise MyCashBridge to access my credit information from credit bureaus (CIBIL / Experian / Equifax) to fetch personalised loan offers. This is a <strong>soft inquiry</strong> and will <strong>not affect</strong> my credit score.</label>' +
        '</div><span class="err">Please accept to continue</span></div>' +
      '</div>' +
      '<div class="qb-bureau-trust">' +
        '<span>\uD83D\uDD12 256-bit encrypted</span>' +
        '<span>\u2705 Soft pull \u2014 score safe</span>' +
        '<span>\uD83C\uDFE6 50+ lenders matched</span>' +
      '</div>' +
    '</div>';
  }

  /* ---- Step 6: Bureau loading animation ---- */
  var QB_LOADING_LENDERS = ["HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra Bank","SBI","IDFC FIRST Bank","IndusInd Bank","YES Bank"];
  function qbBureauLoadingHTML() {
    var loanType = _qbData.loan_type || "Loan";
    var tickerHTML = QB_LOADING_LENDERS.map(function(l, i) {
      return '<div class="qb-ticker-item" style="animation-delay:' + (i * 0.38) + 's">' +
        '<span class="qb-ticker-dot"></span>' + l + '</div>';
    }).join("");
    return '<div class="qb-bureau-loading">' +
      '<div class="qb-loading-ring"><div></div><div></div><div></div><div></div></div>' +
      '<p class="qb-loading-headline">We\u2019re checking offers from <strong>35+ banks\u2026</strong></p>' +
      '<p class="qb-loading-sub">Analysing your ' + loanType + ' eligibility across our partner network.</p>' +
      '<div class="qb-lender-ticker">' + tickerHTML + '</div>' +
    '</div>';
  }
  function qbStartLoadingAdvance() {
    if (_qbLoadingTimer) clearTimeout(_qbLoadingTimer);
    _qbLoadingTimer = setTimeout(function() {
      _qbLoadingTimer = null;
      var flow = QB_STEPS[_qbFlow] || QB_STEPS.general;
      if (_qbStep < flow.length - 1) { _qbStep++; qbRenderStep(); }
    }, 3200);
  }

  /* ---- Step 7: Matched lender results ---- */
  var QB_LENDER_MAP = {
    "Personal Loan":          ["HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra Bank","IDFC FIRST Bank"],
    "Business Loan":          ["HDFC Bank","ICICI Bank","Axis Bank","Bank of Baroda","Kotak Mahindra Bank"],
    "Home Loan":               ["SBI","HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra Bank"],
    "Car Loan":                ["HDFC Bank","ICICI Bank","SBI","Axis Bank","Kotak Mahindra Bank"],
    "Education Loan":          ["SBI","Bank of Baroda","HDFC Bank","ICICI Bank","Axis Bank"],
    "Gold Loan":               ["Muthoot Finance","Manappuram Finance","HDFC Bank","SBI","ICICI Bank"],
    "Loan Against Property":   ["HDFC Bank","Axis Bank","Kotak Mahindra Bank","ICICI Bank","IDFC FIRST Bank"]
  };
  function qbLenderResultsHTML() {
    var loanType = _qbData.loan_type || "Personal Loan";
    var income   = _qbData.monthly_income || "";
    var lenders  = QB_LENDER_MAP[loanType] || QB_LENDER_MAP["Personal Loan"];
    var rate = income.indexOf("Above") > -1 ? "10.5"
             : income.indexOf("1,00,000") > -1 ? "11.0"
             : income.indexOf("50,000") > -1 && income.indexOf("Below") === -1 ? "11.5"
             : "12.5";
    var rowsHTML = lenders.slice(0, 4).map(function(l) {
      return '<div class="qb-lender-row">' +
        '<span class="qb-lender-check">\u2705</span>' +
        '<span class="qb-lender-name">' + l + '</span>' +
        '<span class="qb-lender-badge">Eligible</span>' +
      '</div>';
    }).join("");
    return '<div class="qb-lender-results">' +
      '<div class="qb-results-header">' +
        '<div class="qb-results-emoji">\uD83C\uDF89</div>' +
        '<h4 class="qb-results-title">Great news! Offers found.</h4>' +
        '<p class="qb-results-sub">Based on your profile, you are <strong>likely eligible</strong> with these lenders:</p>' +
      '</div>' +
      '<div class="qb-lender-list">' + rowsHTML + '</div>' +
      '<div class="qb-results-rate">' +
        '<span>\u26A1 Indicative rate from ' + rate + '% p.a.</span>' +
        '<span style="font-size:11px;color:#bbb">Final rate subject to lender assessment</span>' +
      '</div>' +
      '<div class="qb-expert-call">' +
        '<div class="qb-expert-icon"><i data-lucide="phone-call"></i></div>' +
        '<div><strong>Our financial expert will call you shortly</strong><br>' +
          '<span style="font-size:12px;color:#888">with exact rates, terms, and the best offer for your profile.</span></div>' +
      '</div>' +
      '<p class="qb-results-disclaimer">These are indicative matches based on your profile. Actual eligibility and rates are determined by the lender during assessment.</p>' +
    '</div>';
  }

  /* ---- Bureau consent: fire-and-forget to /api/bureau-consent ---- */
  function qbSubmitBureauConsent() {
    try {
      var payload = Object.assign({}, getUtm(), {
        mobile:          _qbData.mobile         || "",
        pan:             _qbData.pan            || "",
        dob:             _qbData.dob            || "",
        loan_type:       _qbData.loan_type      || "General",
        loan_amount:     _qbData.loan_amount    || "",
        source_page:     location.pathname,
        bureau_consent:  true,
        consent_version: CONSENT_VERSION,
        _hp: ""
      });
      fetch("/api/bureau-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined
      }).catch(function() {});
    } catch(e) {}
  }

  /* ---- Fire-and-forget lead save (no thanks screen) ---- */
  function qbSaveLead(data) {
    try { qbLead(data); } catch(e) {}
  }

  /* ---- Bureau gate validation ---- */
  function qbValidateBureauGate() {
    var box = document.getElementById("qbPopup"); if (!box) return false;
    var ok = true;
    box.querySelectorAll(".field").forEach(function(f){ f.classList.remove("invalid"); });
    var pan = box.querySelector("[name=qb_pan]");
    if (!pan || !/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(pan.value.trim())) {
      if (pan && pan.closest(".field")) pan.closest(".field").classList.add("invalid"); ok = false;
    }
    var dob = box.querySelector("[name=qb_dob]");
    if (!dob || !dob.value) {
      if (dob && dob.closest(".field")) dob.closest(".field").classList.add("invalid"); ok = false;
    }
    var bc = box.querySelector("[name=bureau_consent]");
    if (!bc || !bc.checked) {
      if (bc && bc.closest(".field")) bc.closest(".field").classList.add("invalid"); ok = false;
    }
    return ok;
  }

  /* ---- Collect bureau gate form data ---- */
  function qbCollectBureauData() {
    var box = document.getElementById("qbPopup"); if (!box) return;
    var pan = box.querySelector("[name=qb_pan]"); if (pan && pan.value.trim()) _qbData.pan = pan.value.trim().toUpperCase();
    var dob = box.querySelector("[name=qb_dob]"); if (dob && dob.value) _qbData.dob = dob.value;
  }

  function qbRenderStep() {
    var box = document.getElementById("qbPopup"); if (!box) return;
    var flow = QB_STEPS[_qbFlow] || QB_STEPS.general;
    var step = flow[_qbStep];
    if (!step) return;
    var total = flow.length;
    var pct = Math.round((_qbStep / total) * 100);

    // progress bar
    box.querySelector(".qb-progress-fill").style.width = pct + "%";
    box.querySelector(".qb-step-counter").textContent = "Step " + (_qbStep + 1) + " of " + total;

    // title
    box.querySelector(".qb-step-title").textContent = step.title;

    // subtitle
    var subEl = box.querySelector(".qb-step-subtitle");
    if (subEl) { subEl.textContent = step.subtitle || ""; subEl.style.display = step.subtitle ? "" : "none"; }

    // body
    var body = box.querySelector(".qb-body");
    if (step.type === "tiles")           body.innerHTML = qbTileHTML(step);
    else if (step.type === "slider")     body.innerHTML = qbSliderHTML(step);
    else if (step.type === "preview")    body.innerHTML = qbPreviewHTML();
    else if (step.type === "eligibility") body.innerHTML = qbEligibilityHTML();
    else if (step.type === "bureau_gate") body.innerHTML = qbBureauGateHTML();
    else if (step.type === "bureau_loading") { body.innerHTML = qbBureauLoadingHTML(); qbStartLoadingAdvance(); }
    else if (step.type === "lender_results") body.innerHTML = qbLenderResultsHTML();
    else body.innerHTML = qbFormHTML(step);
    body.innerHTML += ""; // flush

    // back / next buttons
    var backBtn = box.querySelector(".qb-back");
    var nextBtn = box.querySelector(".qb-next");
    var hideNav = (step.type === "bureau_loading" || step.type === "lender_results");
    backBtn.style.display = (_qbStep > 0 && !hideNav) ? "" : "none";
    if (step.type === "form" || step.type === "final" || step.type === "lead_collect") {
      nextBtn.innerHTML = '<i data-lucide="shield-check"></i> ' + (step.cta || "Get a call back");
      nextBtn.classList.add("qb-submit");
    } else if (step.type === "eligibility") {
      nextBtn.innerHTML = '\uD83D\uDD13 Unlock Personalised Loan Offers';
      nextBtn.classList.remove("qb-submit");
    } else if (step.type === "bureau_gate") {
      nextBtn.innerHTML = '<i data-lucide="search"></i> Check My Eligibility';
      nextBtn.classList.add("qb-submit");
    } else if (step.type === "lender_results") {
      nextBtn.innerHTML = '<i data-lucide="check-circle-2"></i> Done \u2014 Got it!';
      nextBtn.classList.remove("qb-submit");
    } else {
      nextBtn.innerHTML = (step.cta || "Next") + ' <i data-lucide="arrow-right"></i>';
      nextBtn.classList.remove("qb-submit");
    }
    // tiles & bureau_loading: hide Next (auto-advance); lender_results shows Done button
    if (step.type === "tiles" || step.type === "bureau_loading") {
      nextBtn.style.display = "none";
    } else {
      nextBtn.style.display = "";
    }
    // Always show close button on the final step so users can dismiss on any page
    var closeBtn2 = box.querySelector('#qbClose');
    if (closeBtn2 && step.type === "lender_results") closeBtn2.style.display = "flex";

    // init slider listener
    var slider = box.querySelector("[data-qb-slider]");
    if (slider) {
      var out = box.querySelector("#qb_slider_out");
      var fmt = step.format || function(v){ return v; };
      slider.addEventListener("input", function(){
        _qbData[slider.getAttribute("data-field")] = slider.value;
        if (out) out.textContent = fmt(slider.value);
      });
      _qbData[slider.getAttribute("data-field")] = slider.value;
    }
    applyLang();
    relucide();
  }

  function qbValidateFormStep() {
    var box = document.getElementById("qbPopup"); if (!box) return true;
    var flow = QB_STEPS[_qbFlow] || QB_STEPS.general;
    var step = flow[_qbStep];
    if (!step || step.type === "tiles" || step.type === "slider" || step.type === "preview" ||
        step.type === "eligibility" || step.type === "bureau_loading" || step.type === "lender_results") return true;
    /* bureau_gate has its own specialised validator */
    if (step.type === "bureau_gate") return qbValidateBureauGate();
    var fields = step.fields || [];
    var ok = true;
    box.querySelectorAll(".field").forEach(function(f){ f.classList.remove("invalid"); });
    var n = box.querySelector("[name=qb_name]"); if (n && fields.indexOf("name") > -1 && !n.value.trim()) { n.closest(".field").classList.add("invalid"); ok = false; }
    var m = box.querySelector("[name=qb_mobile]"); if (m && fields.indexOf("mobile") > -1 && !/^[6-9]\d{9}$/.test(m.value.trim())) { m.closest(".field").classList.add("invalid"); ok = false; }
    var c = box.querySelector("[name=qb_city]"); if (c && fields.indexOf("city") > -1 && !c.value.trim()) { c.closest(".field").classList.add("invalid"); ok = false; }
    var inc = box.querySelector("[name=qb_income]"); if (inc && fields.indexOf("income") > -1 && !inc.value) { inc.closest(".field").classList.add("invalid"); ok = false; }
    var emp = box.querySelector("[name=qb_employment]"); if (emp && fields.indexOf("employment") > -1 && !emp.value) { emp.closest(".field").classList.add("invalid"); ok = false; }
    var ageEl = box.querySelector("[name=qb_age]"); if (ageEl && fields.indexOf("age") > -1) { var av = parseInt(ageEl.value, 10); if (!ageEl.value || isNaN(av) || av < 21) { ageEl.closest(".field").classList.add("invalid"); ok = false; } }
    var con = box.querySelector("[name=qb_consent]"); if (con && fields.indexOf("consent") > -1 && !con.checked) { con.closest(".field").classList.add("invalid"); ok = false; }
    return ok;
  }

  function qbCollectFormData() {
    var box = document.getElementById("qbPopup"); if (!box) return;
    var n = box.querySelector("[name=qb_name]"); if (n && n.value.trim()) _qbData.name = n.value.trim();
    var m = box.querySelector("[name=qb_mobile]"); if (m && m.value.trim()) _qbData.mobile = "+91 " + m.value.trim();
    var c = box.querySelector("[name=qb_city]"); if (c && c.value.trim()) _qbData.city = c.value.trim();
    var inc = box.querySelector("[name=qb_income]"); if (inc && inc.value) _qbData.monthly_income = inc.value;
    var emp = box.querySelector("[name=qb_employment]"); if (emp && emp.value) _qbData.employment = emp.value;
    var ageEl = box.querySelector("[name=qb_age]"); if (ageEl && ageEl.value) _qbData.age = ageEl.value;
    var od = box.querySelector("[name=qb_outstanding]"); if (od && od.value) _qbData.outstanding_debt = od.value;
    var odAmt = box.querySelector("[name=qb_outstanding_amount]"); if (odAmt && odAmt.value) _qbData.outstanding_amount = odAmt.value;
    var cibil = box.querySelector("[name=qb_cibil]"); if (cibil && cibil.value) _qbData.cibil_score = cibil.value;
    var pan = box.querySelector("[name=qb_pan]"); if (pan && pan.value.trim()) _qbData.pan = pan.value.trim().toUpperCase();
  }

  function qbNext() {
    var flow = QB_STEPS[_qbFlow] || QB_STEPS.general;
    var step = flow[_qbStep];
    /* legacy single-step form: validate + save + show thanks screen */
    if (step.type === "form" || step.type === "final") {
      if (!qbValidateFormStep()) return;
      qbCollectFormData();
      qbSubmit();
      return;
    }
    /* Step 3 — lead_collect: validate, save lead fire-and-forget, advance to eligibility */
    if (step.type === "lead_collect") {
      if (!qbValidateFormStep()) return;
      qbCollectFormData();
      qbSaveLead(_qbData);
      _qbStep = Math.min(_qbStep + 1, flow.length - 1);
      qbRenderStep();
      return;
    }
    /* Step 4 — eligibility: no validation, advance to bureau gate */
    if (step.type === "eligibility") {
      _qbStep = Math.min(_qbStep + 1, flow.length - 1);
      qbRenderStep();
      return;
    }
    /* Step 5 — bureau_gate: validate, collect, submit consent, advance to loading */
    if (step.type === "bureau_gate") {
      if (!qbValidateBureauGate()) return;
      qbCollectBureauData();
      qbSubmitBureauConsent();
      _qbStep = Math.min(_qbStep + 1, flow.length - 1);
      qbRenderStep();
      return;
    }
    /* Step 7 — lender_results: close popup */
    if (step.type === "lender_results") {
      closeQbPopup();
      return;
    }
    /* For contact/profile steps: validate + persist data before advancing */
    if (step.type === "contact" || step.type === "profile") {
      if (!qbValidateFormStep()) return;
      qbCollectFormData();
    }
    _qbStep = Math.min(_qbStep + 1, flow.length - 1);
    qbRenderStep();
  }

  function qbSubmit() {
    var box = document.getElementById("qbPopup"); if (!box) return;
    var nb = box.querySelector(".qb-next");
    if (nb) { nb.disabled = true; nb.innerHTML = '<span class="spinner"></span> Submitting…'; }
    setTimeout(function(){
      qbLead(_qbData);
      box.querySelector(".qb-content").style.display = "none";
      box.querySelector(".qb-thanks").classList.add("show");
      var ref = "CB-" + Date.now().toString(36).toUpperCase().slice(-6);
      var rr = box.querySelector(".qb-ref"); if (rr) rr.textContent = "Reference: " + ref;
      confetti(box.querySelector(".qb-thanks"));
      relucide();
    }, 900);
  }

  function openQbPopup(flow, preselect, fixedType) {
    /* Allow popup on all transactional pages. Blocked only on legal/tool/guide
       pages where it makes no sense to start a loan application. */
    var p = location.pathname;
    var blocked = /\/(pages\/(about|contact|grievance|privacy|terms|disclaimer|cookie|refund|user-rights|data-breach|data-retention|security|aml|fair|consent|copyright|partner-lenders)\.html|tools\/|guides\/)/.test(p);
    if (blocked) return;
    _qbFlow = flow || "general";
    _qbData = {};
    _qbStep = 0;
    if (fixedType) {
      var f = QB_STEPS[_qbFlow] || QB_STEPS.general;
      if (f[0] && f[0].type === "tiles") {
        _qbData[f[0].field] = fixedType;
        _qbStep = 1;
      } else {
        _qbData.loan_type = fixedType;
      }
    }
    var box = document.getElementById("qbPopup"); if (!box) return;
    box.querySelector(".qb-content").style.display = "";
    box.querySelector(".qb-thanks").classList.remove("show");
    var nb = box.querySelector(".qb-next"); if (nb) nb.disabled = false;
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    var isHome = /index\.html/.test(p) || p === '/' || p.endsWith('/');
    var closeBtn = box.querySelector('#qbClose');
    if (closeBtn) closeBtn.style.display = isHome ? 'flex' : 'none';
    qbRenderStep();
  }
  window.cbOpenQuick = openQbPopup;

  function closeQbPopup() {
    var box = document.getElementById("qbPopup"); if (!box) return;
    box.classList.remove("open"); document.body.style.overflow = "";
  }

  function qbPopupHTML() {
    return '<div class="qb-popup" id="qbPopup" role="dialog" aria-modal="true" aria-label="Quick apply">' +
      '<div class="qb-scrim" id="qbScrim"></div>' +
      '<div class="qb-box">' +
        '<div class="qb-header">' +
          '<div class="qb-brand"><span class="qb-brand-name">MyCashBridge</span><span class="qb-brand-tag">Aapke Sapno Ka Financial Saathi</span></div>' +
          '<img class="qb-avatar" src="' + BASE + 'assets/setu/setu-hero.svg" alt="" aria-hidden="true">' +
          '<button class="qb-close" id="qbClose" aria-label="Close" style="display:none"><i data-lucide="x"></i></button>' +
        '</div>' +
        '<div class="qb-progress"><div class="qb-progress-fill" style="width:0%"></div></div>' +
        '<div class="qb-step-counter">Step 1 of 3</div>' +
        '<div class="qb-content">' +
          '<h3 class="qb-step-title">What type of loan do you need?</h3>' +
          '<p class="qb-step-subtitle" style="display:none"></p>' +
          '<div class="qb-body"></div>' +
          '<div class="qb-actions">' +
            '<button class="btn btn-ghost btn-sm qb-back" id="qbBack" style="display:none"><i data-lucide="arrow-left"></i> Back</button>' +
            '<button class="btn btn-filled qb-next" id="qbNext">Next <i data-lucide="arrow-right"></i></button>' +
          '</div>' +
          '<p class="qb-disclaimer">By continuing you agree that it won\'t affect your credit score. We never charge a fee to apply. <a href="' + BASE + 'pages/privacy-policy.html">Privacy Policy</a></p>' +
        '</div>' +
        '<div class="qb-thanks">' +
          '<div class="confetti"></div>' +
          '<img class="thanks-setu" src="' + BASE + 'assets/setu/setu-celebrate.svg" alt="" aria-hidden="true">' +
          '<h3>You\'re all set! \uD83C\uDF89</h3>' +
          '<p>A MyCashBridge expert will call you within <strong>24 hours</strong> with the best offers. Keep your phone handy.</p>' +
          '<div class="qb-ref"></div>' +
          '<button class="btn btn-filled" id="qbDoneBtn">Done</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ============================================================
     EXIT-INTENT POPUP
     Shows once per session when cursor leaves top of viewport
     ============================================================ */
  var _exitShown = false;
  function initExitIntent() {
    if (sessionStorage.getItem("cb_exit_shown")) return;
    document.addEventListener("mouseleave", function(e) {
      if (_exitShown || e.clientY > 10) return;
      _exitShown = true;
      sessionStorage.setItem("cb_exit_shown", "1");
      setTimeout(function(){ openQbPopup("general"); }, 300);
    });
  }

  /* ============================================================
     SCROLL-LINKED FLOATING APPLY BUTTON
     Fixed on the right edge of the screen. Appears after 300px
     scroll. Moves vertically with the scrollbar so it always
     stays at the same relative position as the scroll thumb.
     ============================================================ */
  function initCursorApply() {
    /* mobile / touch ? skip */
    if (window.innerWidth < 769) return;

    /* create button */
    var el = document.createElement("div");
    el.id = "cbScrollApply";
    el.style.cssText = "position:fixed;right:20px;top:50%;z-index:9000;opacity:0;transform:translateY(-50%) scale(0.8);transition:opacity .3s ease,transform .3s ease;pointer-events:none;";
    el.innerHTML =
      '<button type="button" style="display:flex;align-items:center;gap:8px;' +
      'background:#0c7a4e;color:#fff;padding:12px 20px;border-radius:50px;' +
      'font-size:14px;font-weight:700;white-space:nowrap;letter-spacing:.01em;border:none;cursor:pointer;' +
      'box-shadow:0 8px 28px rgba(12,122,78,.45),0 2px 8px rgba(0,0,0,.15);' +
      'font-family:inherit;transition:background .2s,box-shadow .2s,transform .15s;">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.34 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6.35 6.35l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>' +
      'Apply Now</button>';
    document.body.appendChild(el);

    /* hover effect on inner button */
    var btn = el.querySelector("button");
    btn.addEventListener("mouseenter", function () { btn.style.background = "#073d27"; btn.style.transform = "scale(1.05)"; });
    btn.addEventListener("mouseleave", function () { btn.style.background = "#0c7a4e"; btn.style.transform = "scale(1)"; });
    btn.addEventListener("click", function () {
      if (window.cbOpenApply) window.cbOpenApply("");
    });

    /* state */
    var currentTopPct = 50;
    var shown = false;

    function update() {
      var scrollY    = window.scrollY || window.pageYOffset;
      var maxScroll  = document.documentElement.scrollHeight - window.innerHeight;
      var pct        = maxScroll > 0 ? scrollY / maxScroll : 0;

      /* map scroll 0–100 % → button top 15 %–85 % of viewport */
      var targetPct  = 15 + pct * 70;
      currentTopPct += (targetPct - currentTopPct) * 0.1;
      el.style.top    = currentTopPct + "%";

      /* show/hide */
      var shouldShow = scrollY > 300;
      if (shouldShow !== shown) {
        shown = shouldShow;
        el.style.opacity       = shouldShow ? "1" : "0";
        el.style.pointerEvents = shouldShow ? "auto" : "none";
        el.style.transform     = "translateY(-50%) scale(" + (shouldShow ? "1" : "0.8") + ")";
      }

      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ============================================================
     STICKY OFFER BAR — appears after 40% scroll on product pages
     ============================================================ */
  function initStickyBar() {
    var bar      = document.getElementById("cbStickyBar");
    var dismiss  = document.getElementById("cbStickyDismiss");
    var btt      = document.getElementById("cbBtt");
    var nudge    = document.getElementById("cbScrollNudge");
    var nudgeClose = document.getElementById("cbNudgeClose");
    var nudgeBar = document.getElementById("cbNudgeBar");
    var floats   = document.querySelector(".floats");

    var barDismissed  = !!sessionStorage.getItem("cb_bar_dismissed");
    var nudgeDismissed = !!sessionStorage.getItem("cb_nudge_dismissed");
    var nudgeShown    = false;
    var nudgeTimer    = null;

    function nearFooter() {
      var docH = document.documentElement.scrollHeight;
      return (window.scrollY || window.pageYOffset) + window.innerHeight > docH - 160;
    }

    function update() {
      var scrollY  = window.scrollY || window.pageYOffset;
      var docH     = document.documentElement.scrollHeight;
      var winH     = window.innerHeight;
      var pct      = scrollY / Math.max(docH - winH, 1);
      var atFooter = nearFooter();

      /* -- Back-to-top -- */
      if (btt) {
        if (scrollY > 600) btt.classList.add("show"); else btt.classList.remove("show");
      }

      /* -- Sticky bar -- */
      if (bar) {
        var showBar = !barDismissed && scrollY > 350 && !atFooter;
        if (showBar) bar.classList.add("visible"); else bar.classList.remove("visible");
        /* shift floats above bar on desktop */
        if (floats) floats.style.bottom = showBar ? "74px" : "18px";
      }

      /* -- Scroll nudge (once, at ~55 % depth) -- */
      if (nudge && !nudgeDismissed && !nudgeShown && pct >= 0.55 && !atFooter) {
        nudgeShown = true;
        nudge.classList.add("show");
        /* restart progress-bar animation */
        if (nudgeBar) { nudgeBar.style.animation = "none"; nudgeBar.offsetHeight; nudgeBar.style.animation = ""; }
        /* auto-hide after 8 s unless user hovers */
        nudgeTimer = setTimeout(function () {
          if (!nudge.matches(":hover")) hideNudge();
        }, 8000);
        nudge.addEventListener("mouseenter", function () { clearTimeout(nudgeTimer); }, { once: true });
        nudge.addEventListener("mouseleave", function () { nudgeTimer = setTimeout(hideNudge, 2000); }, { once: true });
      }
      /* hide nudge near footer */
      if (atFooter && nudge) nudge.classList.remove("show");
    }

    function hideNudge() {
      if (nudge) nudge.classList.remove("show");
    }

    /* scroll listener (RAF-throttled) */
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(function () { update(); ticking = false; }); ticking = true; }
    }, { passive: true });

    /* dismiss sticky bar */
    if (dismiss) {
      dismiss.addEventListener("click", function () {
        barDismissed = true;
        sessionStorage.setItem("cb_bar_dismissed", "1");
        if (bar) bar.classList.remove("visible");
        if (floats) floats.style.bottom = "18px";
      });
    }

    /* dismiss nudge */
    if (nudgeClose) {
      nudgeClose.addEventListener("click", function () {
        nudgeDismissed = true; nudgeShown = true;
        sessionStorage.setItem("cb_nudge_dismissed", "1");
        clearTimeout(nudgeTimer);
        hideNudge();
      });
    }

    /* back to top */
    if (btt) {
      btt.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    }

    update(); /* run once on load */
  }

  function stickyBarHTML(loanLabel, flow) {
    return '<div class="cb-sticky-bar" id="cbStickyBar">' +
      '<div class="cb-sticky-inner">' +
        '<span class="cb-sticky-msg"><i data-lucide="zap"></i> <strong>Get the best ' + (loanLabel || "loan") + ' offers</strong> — free, no commitment</span>' +
        '<button class="btn btn-filled btn-sm" data-quick-apply data-qb-flow="' + (flow||"loan") + '" data-qb-type="' + (loanLabel||"") + '">Get FREE Offers <i data-lucide="arrow-right"></i></button>' +
      '</div>' +
    '</div>';
  }
  window.cbStickyBarHTML = stickyBarHTML;

  /* ============================================================
     TRUST NUDGES — rotating badges above CTA in popups
     ============================================================ */
  var TRUST_ITEMS = [
    "\uD83D\uDD12 Bank-grade 256-bit encryption",
    "\u2705 Won't affect your credit score",
    "\uD83C\uDFC6 4.7\u2605 rated by 6,200+ customers",
    "\uD83D\uDCB0 \u20B950,00,00,000+ disbursed to date",
    "\u2705 Free service — no charges ever"
  ];
  function initTrustNudge() {
    var els = document.querySelectorAll(".qb-trust-nudge");
    if (!els.length) return;
    var i = 0;
    els.forEach(function(el){ el.textContent = TRUST_ITEMS[0]; });
    setInterval(function(){
      i = (i + 1) % TRUST_ITEMS.length;
      els.forEach(function(el){
        el.style.opacity = "0";
        setTimeout(function(){ el.textContent = TRUST_ITEMS[i]; el.style.opacity = "1"; }, 300);
      });
    }, 3500);
  }

  function mount() {
    var nav = document.querySelector("[data-mount=nav]"); if (nav) nav.innerHTML = navHTML();
    var foot = document.querySelector("[data-mount=footer]");
    if (foot && !document.querySelector(".faq")) foot.insertAdjacentHTML("beforebegin", faqHTML());
    if (foot) foot.insertAdjacentHTML("beforebegin", bridgeBandHTML());
    if (foot) foot.insertAdjacentHTML("beforebegin", whyStripHTML());
    if (foot) foot.innerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", floatsHTML() + modalHTML() + referModalHTML() + cookieHTML() + qbPopupHTML());
    wire(); wireCookies(); wireQb();
    document.querySelectorAll("[data-emi]").forEach(initEmi);
    applyLang(); relucide();
    loadPartners().then(function () {
      renderHomePartners();
      renderLoanPartners();
      injectPartnerSchema();
      relucide();
    });
    initMotion();
    initStickyBar();
    initExitIntent();
    initCursorApply();
    initTrustNudge();
  }
  function wireQb() {
    document.addEventListener("click", function(e) {
      // tile click ? auto advance
      var tile = e.target.closest("[data-qb-tile]");
      if (tile) {
        var flow = QB_STEPS[_qbFlow] || QB_STEPS.general;
        var step = flow[_qbStep];
        if (step) _qbData[step.field] = tile.getAttribute("data-val");
        // highlight
        tile.closest(".qb-tiles") && tile.closest(".qb-tiles").querySelectorAll(".qb-tile").forEach(function(t){ t.classList.remove("sel"); });
        tile.classList.add("sel");
        setTimeout(function(){
          _qbStep = Math.min(_qbStep + 1, flow.length - 1);
          qbRenderStep();
        }, 220);
        return;
      }
      // quick apply triggers
      var qa = e.target.closest("[data-quick-apply]");
      if (qa) {
        e.preventDefault();
        var f = qa.getAttribute("data-qb-flow") || "general";
        var t = qa.getAttribute("data-qb-type") || qa.getAttribute("data-apply-loan") || null;
        openQbPopup(f, null, t);
        closeDrawer();
        return;
      }
      // close button
      if (e.target.closest("#qbClose")) { closeQbPopup(); return; }
      // done (thank-you screen close)
      if (e.target.closest("#qbDoneBtn")) { closeQbPopup(); return; }
      // back
      if (e.target.closest("#qbBack")) { if (_qbStep > 0) { _qbStep--; qbRenderStep(); } return; }
      // next/submit
      if (e.target.closest("#qbNext")) { qbNext(); return; }
    });
    document.addEventListener("input", function(e){
      if (e.target.name === "qb_mobile") e.target.value = e.target.value.replace(/\D/g,"").slice(0,10);
    });
    // seg options inside QB popup
    document.addEventListener("click", function(e){
      var seg = e.target.closest(".qb-seg .seg-opt");
      if (seg) {
        var g = seg.closest(".qb-seg");
        g.querySelectorAll(".seg-opt").forEach(function(s){ s.classList.remove("sel"); });
        seg.classList.add("sel");
        var hid = g.querySelector("input[type=hidden]"); if (hid) hid.value = seg.getAttribute("data-val");
        var _amtW = seg.closest(".field") ? seg.closest(".field").querySelector(".outstanding-amt") : null; if (_amtW && g.getAttribute("data-seg") === "qb_outstanding") _amtW.style.display = seg.getAttribute("data-val") !== "None" ? "" : "none";
      }
    });
  }

  function mount() {

    var nav = document.querySelector("[data-mount=nav]"); if (nav) nav.innerHTML = navHTML();
    var foot = document.querySelector("[data-mount=footer]");
    if (foot && !document.querySelector(".faq")) foot.insertAdjacentHTML("beforebegin", faqHTML());
    if (foot) foot.insertAdjacentHTML("beforebegin", bridgeBandHTML());
    if (foot) foot.insertAdjacentHTML("beforebegin", whyStripHTML());
    if (foot) foot.innerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", floatsHTML() + modalHTML() + referModalHTML() + cookieHTML() + qbPopupHTML());
    wire(); wireCookies(); wireQb();
    document.querySelectorAll("[data-emi]").forEach(initEmi);
    applyLang(); relucide();
    loadPartners().then(function () {
      renderHomePartners();
      renderLoanPartners();
      injectPartnerSchema();
      relucide();
    });
    initMotion();
    initStickyBar();
    initExitIntent();
    initCursorApply();
    initTrustNudge();
    /* Phase 3: drain queued leads from previous failed submissions */
    try { drainLeadRetryQueue(); } catch (e) {}
    // Redirect to home on page refresh from any service page
    try {
      var _navEntry = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
      if (_navEntry && _navEntry.type === "reload" && /\/(loans|pages|tools|guides)\//.test(location.pathname)) {
        location.replace("../index.html");
        return;
      }
    } catch(e) {}
    // Auto-open QB popup on service pages — per service category, skipped if form already submitted for this category
    if (/\/(loans|pages|tools|guides)\//.test(location.pathname)) {
      var _popupCat = getServiceCategory();
      if (_popupCat && !localStorage.getItem("cb_popup_done_" + _popupCat)) {
        setTimeout(function(){ openQbPopup("loan"); }, 2000);
      }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
