/* ============================================================
   CASH BRIDGE — shared site behaviour (v2)
   Nav with product dropdowns · EN/HI language engine ·
   working cookie consent (blocks non-essential cookies) ·
   apply modal · forms→email · EMI · FAQ · why-choose strip.
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
    "DCB Bank": "logos/DCB_Bank.svg",
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
     i18n — full-page dictionary sweep (English ⇆ Hindi)
     Translates EVERY matching visible text node + placeholders
     anywhere on the page, preserving icons & inline markup.
     ============================================================ */
  var HI = {
    // ---- top strip / nav ----
    "New here? Check your eligibility in 10 seconds — it won't affect your credit score.": "नए हैं? 10 सेकंड में अपनी पात्रता जांचें — इससे आपके क्रेडिट स्कोर पर असर नहीं पड़ता।",
    "Check now": "अभी जांचें",
    "Loans": "लोन", "Credit Cards": "क्रेडिट कार्ड", "Insurance": "बीमा", "Investments": "निवेश", "Tools": "टूल्स",
    "Apply now": "अभी अप्लाई करें", "About Us": "हमारे बारे में", "Contact Us": "संपर्क करें", "Call": "कॉल करें",
    // ---- product names (nav, cards, lists) ----
    "Personal Loan": "पर्सनल लोन", "Business Loan": "बिज़नेस लोन", "Home Loan": "होम लोन",
    "Loan Against Property": "प्रॉपर्टी पर लोन", "Car Loan": "कार लोन", "Education Loan": "एजुकेशन लोन", "Gold Loan": "गोल्ड लोन",
    "Cashback Cards": "कैशबैक कार्ड", "Travel Cards": "ट्रैवल कार्ड", "Rewards Cards": "रिवॉर्ड्स कार्ड", "Secured Cards": "सिक्योर्ड कार्ड",
    "Lifetime Free Cards": "लाइफटाइम फ्री कार्ड", "Premium Cards": "प्रीमियम कार्ड", "Fuel Cards": "फ्यूल कार्ड", "Shopping Cards": "शॉपिंग कार्ड",
    "Health Insurance": "हेल्थ बीमा", "Life Insurance": "जीवन बीमा", "Motor Insurance": "मोटर बीमा", "Travel Insurance": "ट्रैवल बीमा",
    "SIP": "एसआईपी", "Mutual Funds": "म्यूचुअल फंड", "Demat Account": "डीमैट अकाउंट",
    "EMI Calculator": "EMI कैलकुलेटर", "Free CIBIL Score": "मुफ़्त CIBIL स्कोर", "Eligibility Checker": "पात्रता जांचक",
    "Compare Loans": "लोन की तुलना करें", "Guides & Articles": "गाइड और लेख",
    // ---- hero A ----
    "Compare & apply from 128+ banks & NBFCs": "128+ बैंक और NBFC से तुलना करें और अप्लाई करें",
    "Borrow with": "साफ़ सोच के साथ", "a clear head.": "लोन पाएं।",
    "Compare and apply for personal, business, home and gold loans from India's leading banks & NBFCs — with EMIs you choose and a total you can see before you sign.":
      "भारत के प्रमुख बैंकों और NBFC से पर्सनल, बिज़नेस, होम और गोल्ड लोन की तुलना करें और अप्लाई करें — अपनी पसंद की EMI और साइन करने से पहले दिखने वाला कुल भुगतान।",
    "See how it works": "यह कैसे काम करता है देखें",
    "Money in 24 hours": "24 घंटे में पैसा", "Rates from 8.5% p.a.": "दरें 8.5% प्रतिवर्ष से", "Bank-grade secure": "बैंक-स्तरीय सुरक्षा",
    "Estimate your EMI": "अपनी EMI का अनुमान लगाएं", "Loan amount": "लोन राशि", "Tenure": "अवधि",
    "Your Easy Monthly Installment =": "आपकी आसान मासिक किस्त =", "Check your rate": "अपनी दर जांचें",
    "Checking your rate won't affect your credit score.": "अपनी दर जांचने से आपके क्रेडिट स्कोर पर असर नहीं पड़ता।",
    // ---- hero B ----
    "Get a call back in 30 minutes": "30 सेकंड में कॉल बैक पाएं", "Get a call back in 30 seconds": "30 सेकंड में कॉल बैक पाएं",
    "The loan you need,": "जो लोन आपको चाहिए,", "without the runaround.": "बिना किसी झंझट के।",
    "Tell us a little about yourself and a MyCashBridge expert calls you with a clear offer — the amount, the EMI, and the total. Simple, honest, fast.":
      "अपने बारे में थोड़ा बताएं और MyCashBridge का विशेषज्ञ आपको एक स्पष्ट ऑफर के साथ कॉल करेगा — राशि, EMI और कुल भुगतान। सरल, ईमानदार, तेज़।",
    "Disbursed to date": "अब तक वितरित", "Happy borrowers": "संतुष्ट ग्राहक", "Average rating": "औसत रेटिंग",
    "No paperwork to start": "शुरू करने के लिए कोई कागज़ी कार्रवाई नहीं", "100% confidential": "100% गोपनीय",
    "Check your eligibility": "अपनी पात्रता जांचें", "Free": "मुफ़्त",
    "Takes 2 minutes. Won't affect your credit score.": "2 मिनट लगते हैं। क्रेडिट स्कोर पर असर नहीं पड़ता।", "Takes 10 seconds. Won't affect your credit score.": "10 सेकंड लगते हैं। क्रेडिट स्कोर पर असर नहीं पड़ता।",
    "Loan type": "लोन का प्रकार", "Select": "चुनें",
    "I authorise MyCashBridge to contact me about my enquiry. This overrides my DND/NDNC registration.":
      "मैं MyCashBridge को मेरी पूछताछ के बारे में संपर्क करने की अनुमति देता/देती हूँ। यह मेरे DND/NDNC रजिस्ट्रेशन के बावजूद मान्य रहेगा।",
    "Get my free call back": "मेरा मुफ़्त कॉल बैक पाएं",
    "Thank you — we've got your request.": "धन्यवाद — आपका अनुरोध मिल गया है।",
    "A MyCashBridge loan expert will call you within 24 hours. Please keep your phone handy.":
      "MyCashBridge का लोन विशेषज्ञ 24 घंटे के भीतर आपको कॉल करेगा। कृपया अपना फ़ोन पास रखें।",
    // ---- hero C ----
    "A lending service provider you can trust (LSP)": "एक भरोसेमंद लेंडिंग सर्विस प्रोवाइडर (LSP)",
    "Find the right loan": "सही लोन खोजें", "for your plan in 10 seconds.": "अपनी ज़रूरत के लिए, 10 सेकंड में।",
    "Compare what you'd pay across loan types, check your EMI, and apply — all with a clear total before you commit. Pick where to start:":
      "अलग-अलग लोन में आपका भुगतान कितना होगा इसकी तुलना करें, अपनी EMI जांचें और अप्लाई करें — साइन करने से पहले स्पष्ट कुल राशि के साथ। यहाँ से शुरू करें:",
    "Personal": "पर्सनल", "Business": "बिज़नेस", "Home": "होम", "Gold": "गोल्ड", "Car": "कार", "Education": "एजुकेशन",
    "Against Property": "प्रॉपर्टी पर", "Compare all": "सभी की तुलना करें", "Check free CIBIL score": "मुफ़्त CIBIL स्कोर जांचें",
    // ---- trust strip ----
    "All Major Banks & NBFCs": "सभी प्रमुख बैंक और NBFC",
    "One application — offers sourced across leading lenders": "एक आवेदन — प्रमुख ऋणदाताओं से ऑफर",
    "Trusted lender network": "भरोसेमंद ऋणदाता नेटवर्क",
    // ---- products section ----
    "Our loans": "हमारे लोन", "Pick the loan that fits your plan": "वह लोन चुनें जो आपकी ज़रूरत के लिए सही हो",
    "Apply Once. Compare 128+ Lenders. Upload Documents Once. Get the Best Offer Delivered to You.":
      "एक बार अप्लाई करें। 128+ ऋणदाताओं की तुलना करें। दस्तावेज़ एक बार अपलोड करें। सबसे अच्छा ऑफर अपने आप पाएं।",
    "Check rate": "दर जांचें",
    "PERSONAL LOAN": "पर्सनल लोन", "BUSINESS LOAN": "बिज़नेस लोन", "HOME LOAN": "होम लोन",
    "GOLD LOAN": "गोल्ड लोन", "CAR LOAN": "कार लोन", "EDUCATION LOAN": "एजुकेशन लोन",
    "Up to ₹40,00,000": "₹40,00,000 तक", "Up to ₹75,00,000": "₹75,00,000 तक", "Up to ₹5,00,00,000": "₹5,00,00,000 तक",
    "Up to ₹50,00,000": "₹50,00,000 तक", "Up to ₹1,00,00,000": "₹1,00,00,000 तक", "Up to ₹1,50,00,000": "₹1,50,00,000 तक",
    "For weddings, travel, medical or any plan. No collateral, money in 24 hours.": "शादी, यात्रा, मेडिकल या किसी भी ज़रूरत के लिए। कोई गिरवी नहीं, 24 घंटे में पैसा।",
    "Stock up, hire, or expand. Flexible EMIs that move with your cash flow.": "स्टॉक बढ़ाएं, भर्ती करें या विस्तार करें। आपके कैश फ़्लो के साथ चलने वाली लचीली EMI।",
    "Buy, build or transfer your home loan at a lower rate. Long, easy tenures.": "कम दर पर घर खरीदें, बनाएं या होम लोन ट्रांसफ़र करें। लंबी, आसान अवधि।",
    "Unlock the value of your gold at a low rate, with fully insured safekeeping.": "कम दर पर अपने सोने का मूल्य पाएं, पूरी तरह बीमित सुरक्षा के साथ।",
    "New or used car, up to 100% on-road funding with quick approval.": "नई या पुरानी कार, तेज़ मंज़ूरी के साथ 100% तक ऑन-रोड फंडिंग।",
    "Fund studies in India or abroad. Pay only interest while studying.": "भारत या विदेश में पढ़ाई के लिए फंड। पढ़ाई के दौरान केवल ब्याज़ चुकाएं।",
    "From 10.5% p.a.": "10.5% प्रतिवर्ष से", "From 14.0% p.a.": "14.0% प्रतिवर्ष से", "From 8.5% p.a.": "8.5% प्रतिवर्ष से",
    "From 9.0% p.a.": "9.0% प्रतिवर्ष से", "From 9.5% p.a.": "9.5% प्रतिवर्ष से",
    // ---- why customers choose us ----
    "Why customers choose us": "ग्राहक हमें क्यों चुनते हैं", "Why Customers Choose Us": "ग्राहक हमें क्यों चुनते हैं",
    "Hand-picked offers from": "चुनिंदा ऑफर", "128+ lenders": "128+ ऋणदाताओं से",
    "Money in minutes via": "मिनटों में पैसा", "pre-approved loans": "प्री-अप्रूव्ड लोन के ज़रिए",
    "Instant": "तुरंत", "sanction & disbursal": "मंज़ूरी और वितरण",
    "No hidden charges": "कोई छिपा शुल्क नहीं", "— what you see is what you pay": "— जो दिखे वही चुकाएं",
    "Money in minutes via pre-approved offers": "प्री-अप्रूव्ड ऑफर से मिनटों में पैसा",
    "Quick sanction & disbursal": "तेज़ मंज़ूरी और वितरण",
    "128+ partners": "128+ साझेदार", "Banks & NBFCs in one place": "बैंक और NBFC एक ही जगह",
    "24-hr disbursal": "24-घंटे वितरण", "For approved applicants": "मंज़ूर आवेदकों के लिए",
    "40,000+": "40,000+", "Customers helped": "ग्राहकों की मदद की", "Bank-grade": "बैंक-स्तरीय", "256-bit secure & private": "256-बिट सुरक्षित और निजी",
    // ---- how it works ----
    "How it works": "यह कैसे काम करता है", "From “maybe” to money in three steps.": "“शायद” से पैसे तक, तीन आसान कदम में।",
    "No paperwork to begin, no jargon. Just a clear answer and a fair rate — explained in plain language.":
      "शुरू करने के लिए कोई कागज़ी कार्रवाई नहीं, कोई कठिन शब्द नहीं। बस एक स्पष्ट जवाब और उचित दर — आसान भाषा में समझाई गई।",
    "Check eligibility": "पात्रता जांचें",
    "1. Apply in 10 seconds": "1. 10 सेकंड में अप्लाई करें",
    "Answer a few simple questions. A soft check shows where you stand without touching your credit score.":
      "कुछ आसान सवालों के जवाब दें। एक सॉफ्ट जांच बताती है कि आप कहाँ खड़े हैं, बिना आपके क्रेडिट स्कोर को छुए।",
    "2. Get a clear offer": "2. स्पष्ट ऑफर पाएं",
    "An expert calls you with the amount, the EMI and the total payable — all in plain numbers.":
      "एक विशेषज्ञ आपको राशि, EMI और कुल देय राशि के साथ कॉल करता है — सब साफ़ आंकड़ों में।",
    "3. Money in your account": "3. आपके खाते में पैसा",
    "Accept the offer, complete a quick verification, and funds reach your bank — often within 24 hours.":
      "ऑफर स्वीकार करें, एक त्वरित सत्यापन पूरा करें, और पैसा आपके बैंक में पहुँचता है — अक्सर 24 घंटे के भीतर।",
    // ---- why us ----
    "Why MyCashBridge": "MyCashBridge क्यों", "Borrowing made simple and honest": "लोन लेना सरल और ईमानदार बनाया",
    "We built MyCashBridge for everyday India — clear language, fair rates, and real human help when you need it.":
      "हमने MyCashBridge को आम भारत के लिए बनाया — स्पष्ट भाषा, उचित दरें, और ज़रूरत पड़ने पर असली इंसानी मदद।",
    "Fast approvals": "तेज़ मंज़ूरी",
    "Apply in minutes and get a clear decision quickly — often with money the same day.":
      "मिनटों में अप्लाई करें और जल्दी स्पष्ट फैसला पाएं — अक्सर उसी दिन पैसे के साथ।",
    "Expert assistance": "विशेषज्ञ सहायता",
    "Real people who speak your language guide you end to end — on call or WhatsApp.":
      "आपकी भाषा बोलने वाले असली लोग शुरू से अंत तक आपका मार्गदर्शन करते हैं — कॉल या WhatsApp पर।",
    "Safe & confidential": "सुरक्षित और गोपनीय",
    "Bank-grade 256-bit encryption. Your data is never sold and stays protected.":
      "बैंक-स्तरीय 256-बिट एन्क्रिप्शन। आपका डेटा कभी नहीं बेचा जाता और सुरक्षित रहता है।",
    "You see the EMI, the interest and the total before you sign. What you see is what you pay.":
      "साइन करने से पहले आप EMI, ब्याज़ और कुल राशि देखते हैं। जो दिखे वही चुकाएं।",
    // ---- tools ----
    "Free tools": "मुफ़्त टूल्स", "Plan before you borrow": "लोन लेने से पहले योजना बनाएं",
    "Smart, free tools to help you decide with confidence — no sign-up needed.":
      "आत्मविश्वास के साथ फैसला लेने में मदद करने वाले स्मार्ट, मुफ़्त टूल्स — कोई साइन-अप नहीं।",
    "See your monthly payment and total cost for any amount and tenure.": "किसी भी राशि और अवधि के लिए अपनी मासिक किस्त और कुल लागत देखें।",
    "Check your credit score free — and learn how to improve it.": "अपना क्रेडिट स्कोर मुफ़्त जांचें — और उसे सुधारना सीखें।",
    "Find out how much you could borrow in under 10 seconds.": "10 सेकंड से कम में जानें कि आप कितना उधार ले सकते हैं।",
    "Compare indicative rates across our lending partners side by side.": "हमारे ऋणदाता साझेदारों की संकेतात्मक दरों की साथ-साथ तुलना करें।",
    // ---- reviews ----
    "Loved by borrowers": "ग्राहकों का पसंदीदा", "Trusted across India": "पूरे भारत में भरोसेमंद",
    "/ 5 · 6,200+ reviews": "/ 5 · 6,200+ समीक्षाएं",
    // ---- cta strip ----
    "Ready when you are": "जब आप तैयार हों, हम तैयार हैं",
    "Check your eligibility in 10 seconds. No obligation, no impact on your credit score, no paperwork to begin.":
      "10 सेकंड में अपनी पात्रता जांचें। कोई बाध्यता नहीं, क्रेडिट स्कोर पर असर नहीं, शुरू करने के लिए कोई कागज़ी कार्रवाई नहीं।",
    // ---- forms / modal ----
    "100% safe & confidential": "100% सुरक्षित और गोपनीय",
    "Apply for a loan": "लोन के लिए अप्लाई करें",
    "Share a few details and an expert will call you back. No paperwork to start.":
      "कुछ जानकारी साझा करें और एक विशेषज्ञ आपको वापस कॉल करेगा। शुरू करने के लिए कोई कागज़ी कार्रवाई नहीं।",
    "Full name": "पूरा नाम", "Mobile number": "मोबाइल नंबर", "City": "शहर", "Monthly income": "मासिक आय",
    "Employment type": "रोज़गार का प्रकार", "Employment": "रोज़गार", "PAN": "पैन", "(optional)": "(वैकल्पिक)",
    "Select range": "रेंज चुनें", "Below ₹25,000": "₹25,000 से कम", "Above ₹1,00,000": "₹1,00,000 से अधिक",
    "Salaried": "वेतनभोगी", "Self-employed": "स्व-रोज़गार", "Business": "व्यापार", "Business owner": "व्यापार मालिक",
    "Get a call back": "कॉल बैक पाएं", "Get a call back from an expert. No paperwork to start.": "किसी विशेषज्ञ से कॉल बैक पाएं। शुरू करने के लिए कोई कागज़ी कार्रवाई नहीं।",
    "By continuing you agree it won't affect your credit score. We never charge a fee to apply.":
      "जारी रखकर आप सहमत हैं कि इससे आपके क्रेडिट स्कोर पर असर नहीं पड़ेगा। हम अप्लाई करने के लिए कभी शुल्क नहीं लेते।",
    "Please enter your name": "कृपया अपना नाम दर्ज करें", "Enter a valid 10-digit mobile": "मान्य 10-अंकीय मोबाइल दर्ज करें",
    "Please enter your city": "कृपया अपना शहर दर्ज करें", "Select your income range": "अपनी आय सीमा चुनें",
    "Select one": "एक चुनें", "Please accept to continue": "जारी रखने के लिए स्वीकार करें", "Required": "आवश्यक",
    // ---- cookie ----
    "We use cookies": "हम कुकीज़ का उपयोग करते हैं",
    "Accept all": "सभी स्वीकारें", "Reject non-essential": "गैर-ज़रूरी अस्वीकारें", "Settings": "सेटिंग्स",
    // ---- loan page template chrome ----
    "Home": "होम", "Why this loan": "यह लोन क्यों", "Calculate EMI": "EMI कैलकुलेट करें",
    "Know your EMI before you borrow": "लोन लेने से पहले अपनी EMI जानें",
    "Slide to your amount and tenure. The total payable updates instantly — what you see is what you pay, all-in.":
      "अपनी राशि और अवधि पर स्लाइड करें। कुल देय राशि तुरंत अपडेट होती है — जो दिखे वही चुकाएं, पूरा।",
    "Apply for this rate": "इस दर पर अप्लाई करें", "Eligibility": "पात्रता", "Who can apply": "कौन अप्लाई कर सकता है",
    "Documents": "दस्तावेज़", "What you'll need": "आपको क्या चाहिए होगा", "How to apply": "कैसे अप्लाई करें",
    "Indicative rates": "संकेतात्मक दरें", "FAQs": "अक्सर पूछे जाने वाले सवाल",
    "Interest rate": "ब्याज़ दर", "Processing fee": "प्रोसेसिंग शुल्क",
    "Lending partner": "ऋणदाता साझेदार", "Interest rate (p.a.)": "ब्याज़ दर (प्रतिवर्ष)", "Max tenure": "अधिकतम अवधि",
    // ---- footer ----
    "Products": "उत्पाद", "Popular Guides": "लोकप्रिय गाइड", "Legal": "कानूनी",
    "Privacy Policy": "गोपनीयता नीति", "Terms & Conditions": "नियम और शर्तें", "Disclaimer": "अस्वीकरण",
    "Grievance Redressal": "शिकायत निवारण", "Cookie Policy": "कुकी नीति", "Refund & Cancellation": "रिफंड और रद्दीकरण",
    "Fair Practices Code": "उचित व्यवहार संहिता", "Consent & Communication": "सहमति और संचार",
    "Privacy": "गोपनीयता", "Terms": "नियम", "Cookie settings": "कुकी सेटिंग्स",
    "A Lending Service Provider (LSP) helping you compare and apply for loans, cards and more from leading banks & NBFCs — with clear EMIs and honest guidance.":
      "एक लेंडिंग सर्विस प्रोवाइडर (LSP) जो आपको प्रमुख बैंकों और NBFC से लोन, कार्ड और बहुत कुछ की तुलना और आवेदन में मदद करता है — स्पष्ट EMI और ईमानदार मार्गदर्शन के साथ।",
    "Best Personal Loan": "बेस्ट पर्सनल लोन", "Loan for Low CIBIL": "कम CIBIL पर लोन",
    "Business Loan for MSMEs": "MSME के लिए बिज़नेस लोन", "Improve Credit Score": "क्रेडिट स्कोर सुधारें",
    // ---- aspiration band ----
    "For life's biggest moments": "जीवन के सबसे बड़े पलों के लिए",
    "A financial support for every dream you're building": "आपके हर सपने के लिए वित्तीय सहायता",
    "From your first home to your child's degree — we help you fund the moments that matter, responsibly.":
      "आपके पहले घर से लेकर आपके बच्चे की डिग्री तक — हम ज़िम्मेदारी से उन पलों को फंड करने में मदद करते हैं जो मायने रखते हैं।",
    "Your own home": "अपना घर", "Buy, build or transfer": "खरीदें, बनाएं या ट्रांसफ़र करें",
    "Education": "शिक्षा", "In India or abroad": "भारत में या विदेश में",
    "Family & weddings": "परिवार और शादियां", "Celebrate without worry": "बिना चिंता के जश्न मनाएं",
    "Grow a business": "व्यापार बढ़ाएं", "Working capital & more": "वर्किंग कैपिटल और बहुत कुछ",
    "Peace of mind": "मन की शांति", "Funds for emergencies": "आपातकाल के लिए फंड",
    // ---- founder box ----
    "Directly from the founder": "सीधे संस्थापक से",
    "Borrowing should feel like having someone in your corner.": "लोन लेना ऐसा लगना चाहिए जैसे कोई आपके साथ खड़ा हो।",
    "Founder, MyCashBridge": "संस्थापक, MyCashBridge", "Founder, MyCashBridge": "संस्थापक, MyCashBridge",
    // ---- full-site sweep (auto-generated curated translations) ----
    "Guides": "गाइड्स",
    "Match the card to how you spend": "अपने खर्च करने के तरीके के हिसाब से कार्ड चुनें",
    "– best all-rounders that earn points across categories": "– बेस्ट ऑल-राउंडर कार्ड जो हर कैटेगरी में पॉइंट्स कमाते हैं",
    "Lounge access and fuel-surcharge waivers if relevant": "ज़रूरत के हिसाब से लाउंज एक्सेस और फ्यूल-सरचार्ज में छूट",
    "Pay the full bill on time, every time": "हर बार पूरा बिल समय पर चुकाएं",
    "how to improve your credit score": "अपना क्रेडिट स्कोर कैसे सुधारें",
    "Are cashback and rewards taxable?": "क्या कैशबैक और रिवॉर्ड्स पर टैक्स लगता है?",
    "7 min read": "7 मिनट में पढ़ें",
    "– 12 to 72 months; longer means smaller EMIs but more total interest": "– 12 से 72 महीने; लंबी अवधि का मतलब छोटी EMI लेकिन कुल ब्याज ज़्यादा",
    "While each lender sets its own rules, most look for:": "हर लेंडर के अपने नियम होते हैं, लेकिन ज़्यादातर ये देखते हैं:",
    "No paperwork, and it won't affect your credit score.": "कोई पेपरवर्क नहीं, और आपके क्रेडिट स्कोर पर कोई असर नहीं पड़ेगा।",
    "How to get the lowest rate": "सबसे कम रेट कैसे पाएं",
    "compare and apply for a personal loan": "पर्सनल लोन की तुलना करें और अप्लाई करें",
    "Which bank gives the cheapest personal loan?": "सबसे सस्ता पर्सनल लोन कौन सा बैंक देता है?",
    "Business Loans": "बिज़नेस लोन",
    "Term loans": "टर्म लोन",
    "Eligibility for an MSME loan": "MSME लोन के लिए एलिजिबिलिटी",
    "Quick, paperless, and no obligation.": "तेज़, पेपरलेस, और कोई बाध्यता नहीं।",
    "Tips to get approved faster": "जल्दी अप्रूवल पाने के टिप्स",
    "compare and apply for a business loan": "बिज़नेस लोन की तुलना करें और अप्लाई करें",
    "Yes, many lenders offer unsecured business loans up to a limit based on turnover and credit. Larger amounts may need security.": "हां, कई लेंडर टर्नओवर और क्रेडिट के आधार पर एक लिमिट तक अनसिक्योर्ड बिज़नेस लोन देते हैं। बड़ी रकम के लिए सिक्योरिटी की ज़रूरत पड़ सकती है।",
    "What affects your CIBIL score": "आपके CIBIL स्कोर पर क्या असर डालता है",
    "– older accounts and a healthy mix of loans/cards help": "– पुराने अकाउंट और लोन/कार्ड का अच्छा मिक्स फायदेमंद होता है",
    "Don't close your oldest credit card without reason": "बिना वजह अपना सबसे पुराना क्रेडिट कार्ड बंद न करें",
    "A better score saves you real money": "बेहतर स्कोर से होती है आपकी सचमुच की बचत",
    "What is a good CIBIL score?": "अच्छा CIBIL स्कोर क्या होता है?",
    "Guides & articles": "गाइड्स और आर्टिकल्स",
    "Loan for Low CIBIL Score: Your Options in India (2026)": "कम CIBIL स्कोर पर लोन: भारत में आपके विकल्प (2026)",
    "– a gold loan or loan against property uses an asset as security, so approval is easier and rates are lower": "– गोल्ड लोन या प्रॉपर्टी पर लोन में एसेट को सिक्योरिटी के तौर पर रखा जाता है, इसलिए अप्रूवल आसान होता है और रेट कम होते हैं",
    "– some specialise in thin-file or low-score customers (often at higher rates)": "– कुछ लेंडर कम क्रेडिट हिस्ट्री या कम स्कोर वाले ग्राहकों में स्पेशलाइज़ करते हैं (अक्सर ऊंचे रेट पर)",
    "Pay every EMI and credit-card bill on time": "हर EMI और क्रेडिट कार्ड बिल समय पर चुकाएं",
    "and reading": "और पढ़ें",
    "Will applying and getting rejected hurt my score?": "क्या अप्लाई करने और रिजेक्ट होने से मेरा स्कोर खराब होगा?",
    "Thank you – we've got your request.": "धन्यवाद – आपकी रिक्वेस्ट हमें मिल गई है।",
    "From your first home to your child's degree – we help you fund the moments that matter, responsibly.": "आपके पहले घर से लेकर आपके बच्चे की डिग्री तक – ज़िंदगी के अहम पलों के लिए हम ज़िम्मेदारी से फंडिंग में आपकी मदद करते हैं।",
    "Real people who speak your language guide you end to end – on call or WhatsApp.": "आपकी भाषा बोलने वाले असली लोग कॉल या WhatsApp पर शुरू से आखिर तक आपका मार्गदर्शन करते हैं।",
    "Real stories from real people who found their perfect loan through MyCashBridge.": "उन असली लोगों की असली कहानियां जिन्होंने MyCashBridge के ज़रिए अपना परफेक्ट लोन पाया।",
    "I was struggling to find a good personal loan rate. MyCashBridge matched me with a lender at 10.5% — much better than what my bank offered. The whole process took less than 48 hours!": "मुझे अच्छे रेट पर पर्सनल लोन ढूंढने में मुश्किल हो रही थी। MyCashBridge ने मुझे 10.5% पर एक लेंडर से मैच कराया — जो मेरे बैंक के ऑफर से कहीं बेहतर था। पूरी प्रोसेस में 48 घंटे से भी कम लगे!",
    "Hyderabad · Business Loan": "हैदराबाद · बिज़नेस लोन",
    "No hidden charges, exactly the EMI they promised. As a shop owner I value straight talk — MyCashBridge gave me that.": "कोई छिपे हुए चार्ज नहीं, बिल्कुल वही EMI जिसका वादा किया गया था। एक दुकानदार के तौर पर मुझे सीधी बात पसंद है — MyCashBridge ने मुझे वही दी।",
    "₹6 Lakhs": "₹6 लाख",
    "Stock up, hire, buy equipment or smooth out cash flow. Get up to ₹75 lakh with flexible repayment that moves with your revenue.": "स्टॉक भरें, स्टाफ रखें, इक्विपमेंट खरीदें या कैश फ्लो संभालें। पाएं ₹75 लाख तक, ऐसी फ्लेक्सिबल रीपेमेंट के साथ जो आपकी कमाई के हिसाब से चलती है।",
    "Self-emp.": "सेल्फ-एम्प्लॉयड",
    "flexible tenure": "फ्लेक्सिबल टेन्योर",
    "Funds for stock, equipment, salaries or expansion": "स्टॉक, इक्विपमेंट, सैलरी या विस्तार के लिए फंड",
    "Up to 2.5%": "2.5% तक",
    "Indian resident aged 24 to 65 years": "24 से 65 वर्ष की उम्र का भारतीय निवासी",
    "Get your business loan in 4 simple steps": "4 आसान स्टेप्स में पाएं अपना बिज़नेस लोन",
    "Upload your business and KYC documents online – no branch visit.": "अपने बिज़नेस और KYC डॉक्यूमेंट ऑनलाइन अपलोड करें – ब्रांच जाने की ज़रूरत नहीं।",
    "What can I use the loan for?": "मैं लोन का इस्तेमाल किन कामों के लिए कर सकता हूं?",
    "Is there a prepayment penalty?": "क्या प्रीपेमेंट पेनल्टी लगती है?",
    "Up to 100% funding": "100% तक फंडिंग",
    "12–84 mo": "12–84 महीने",
    "Attractive rates for strong credit profiles": "मज़बूत क्रेडिट प्रोफाइल के लिए आकर्षक रेट",
    "Salaried or self-employed with steady income": "नियमित आय वाले सैलरीड या सेल्फ-एम्प्लॉयड",
    "Bank statements for the last 3–6 months": "पिछले 3–6 महीनों के बैंक स्टेटमेंट",
    "Get an offer": "ऑफर पाएं",
    "Car Loan – common questions": "कार लोन – आम सवाल",
    "Typically 1 to 7 years. A longer tenure lowers your EMI but increases total interest – the calculator shows you the trade-off.": "आमतौर पर 1 से 7 साल। लंबा टेन्योर आपकी EMI कम करता है लेकिन कुल ब्याज बढ़ाता है – कैलकुलेटर आपको यह ट्रेड-ऑफ दिखाता है।",
    "Check your car loan eligibility and EMI in minutes. No obligation, no credit-score impact.": "मिनटों में अपनी कार लोन एलिजिबिलिटी और EMI चेक करें। कोई बाध्यता नहीं, क्रेडिट स्कोर पर कोई असर नहीं।",
    "Tax benefits u/s 80E": "सेक्शन 80E के तहत टैक्स बेनिफिट",
    "Education without the money worry": "पढ़ाई, पैसों की चिंता के बिना",
    "Long repayment tenure after course completion": "कोर्स पूरा होने के बाद लंबा रीपेमेंट टेन्योर",
    "Aged 18 years and above": "18 वर्ष या उससे अधिक उम्र",
    "Academic records (marksheets, test scores)": "एकेडमिक रिकॉर्ड (मार्कशीट, टेस्ट स्कोर)",
    "Sanction & disbursal": "सैंक्शन और डिस्बर्सल",
    "It's the period during your course (plus a few months after) when you don't pay the full EMI – usually only simple interest. Full repayment begins after you finish studying.": "यह आपके कोर्स के दौरान (और उसके कुछ महीने बाद तक) की वह अवधि है जब आपको पूरी EMI नहीं चुकानी होती – आमतौर पर सिर्फ साधारण ब्याज देना होता है। पूरी रीपेमेंट पढ़ाई खत्म होने के बाद शुरू होती है।",
    "Usually a parent or guardian with a stable income. The co-applicant's profile supports the loan during the study period.": "आमतौर पर स्थिर आय वाले माता-पिता या अभिभावक। पढ़ाई की अवधि के दौरान को-एप्लिकेंट की प्रोफाइल लोन को सपोर्ट करती है।",
    "Insured safekeeping": "इंश्योरेंस के साथ सुरक्षित स्टोरेज",
    "low / often waived": "कम / अक्सर माफ",
    "Flexible repayment, including interest-only options": "फ्लेक्सिबल रीपेमेंट, सिर्फ-ब्याज वाले विकल्पों सहित",
    "Valid identity and address proof": "वैध पहचान और पते का प्रमाण",
    "Get your gold loan in 4 simple steps": "4 आसान स्टेप्स में पाएं अपना गोल्ड लोन",
    "Your gold is evaluated and securely stored, fully insured.": "आपके गोल्ड का मूल्यांकन कर उसे सुरक्षित रखा जाता है, पूरी तरह इंश्योर्ड।",
    "Is my gold safe?": "क्या मेरा गोल्ड सुरक्षित है?",
    "How quickly can I get the money?": "मुझे पैसा कितनी जल्दी मिल सकता है?",
    "Tenure up to 30 years": "30 साल तक का टेन्योर",
    "long, easy tenure": "लंबा, आसान टेन्योर",
    "Tax benefits under Sections 80C & 24(b)": "सेक्शन 80C और 24(b) के तहत टैक्स बेनिफिट",
    "Salaried or self-employed with stable income": "स्थिर आय वाले सैलरीड या सेल्फ-एम्प्लॉयड",
    "Property documents and sale agreement": "प्रॉपर्टी डॉक्यूमेंट और सेल एग्रीमेंट",
    "An expert assesses your eligibility and calls with rate and EMI options.": "एक एक्सपर्ट आपकी एलिजिबिलिटी जांचता है और रेट व EMI विकल्पों के साथ आपको कॉल करता है।",
    "Typically up to 75–90% of the property value, subject to your income and eligibility. MyCashBridge helps you borrow up to ₹5 crore across our partners.": "आमतौर पर प्रॉपर्टी वैल्यू का 75–90% तक, आपकी आय और एलिजिबिलिटी के अनुसार। MyCashBridge हमारे पार्टनर्स के ज़रिए ₹5 करोड़ तक उधार लेने में आपकी मदद करता है।",
    "How long does approval take?": "अप्रूवल में कितना समय लगता है?",
    "High loan amounts": "ऊंची लोन राशि",
    "long tenure": "लंबा टेन्योर",
    "Continue to use or occupy your property": "अपनी प्रॉपर्टी का इस्तेमाल या उसमें रहना जारी रखें",
    "Property ownership and title documents": "प्रॉपर्टी ओनरशिप और टाइटल डॉक्यूमेंट",
    "Valuation & legal check": "वैल्यूएशन और लीगल चेक",
    "How much can I borrow?": "मैं कितना उधार ले सकता हूं?",
    "What happens if I can't repay?": "अगर मैं चुका नहीं पाया तो क्या होगा?",
    "No collateral needed": "किसी कोलैटरल की ज़रूरत नहीं",
    "No collateral or guarantor required": "किसी कोलैटरल या गारंटर की ज़रूरत नहीं",
    "Indicative Personal Loan Rates": "पर्सनल लोन की सांकेतिक दरें",
    "PAN card and Aadhaar card": "PAN कार्ड और आधार कार्ड",
    "Fill the short form – name, mobile, city and income. Takes 10 seconds.": "छोटा-सा फॉर्म भरें – नाम, मोबाइल, शहर और आय। सिर्फ 10 सेकंड लगते हैं।",
    "Personal Loan – common questions": "पर्सनल लोन – आम सवाल",
    "For approved applicants with complete documents, disbursal can happen within 24 hours – sometimes the same day.": "पूरे डॉक्यूमेंट वाले अप्रूव्ड आवेदकों के लिए डिस्बर्सल 24 घंटे के भीतर हो सकता है – कभी-कभी उसी दिन भी।",
    "Check your personal loan eligibility in 10 seconds. No obligation, no impact on your credit score.": "10 सेकंड में अपनी पर्सनल लोन एलिजिबिलिटी चेक करें। कोई बाध्यता नहीं, क्रेडिट स्कोर पर कोई असर नहीं।",
    "What we stand for": "हमारे उसूल",
    "Real people": "असली लोग",
    "Data Retention & Deletion": "डेटा रिटेंशन और डिलीशन",
    "Submission of forged documents or false information may result in reporting to the relevant authorities.": "जाली दस्तावेज़ या गलत जानकारी जमा करने पर संबंधित अधिकारियों को रिपोर्ट किया जा सकता है।",
    "Low or zero annual fee options": "कम या ज़ीरो एनुअल फीस वाले विकल्प",
    "Notify me": "मुझे सूचित करें",
    "Higher cashback on popular shopping and food apps.": "लोकप्रिय शॉपिंग और फूड ऐप्स पर ज़्यादा कैशबैक।",
    "Explore other credit cards": "अन्य क्रेडिट कार्ड देखें",
    "We're here to help": "हम आपकी मदद के लिए मौजूद हैं",
    "– quickest replies": "– सबसे तेज़ जवाब",
    "Send us a message": "हमें मैसेज भेजें",
    "I authorise MyCashBridge to contact me regarding my enquiry. This overrides my DND/NDNC registration.": "मैं MyCashBridge को अपनी पूछताछ के संबंध में मुझसे संपर्क करने की अनुमति देता/देती हूं। यह मेरे DND/NDNC रजिस्ट्रेशन को ओवरराइड करेगा।",
    "Improve website functionality": "वेबसाइट की फंक्शनैलिटी बेहतर बनाना",
    "Essential cookies": "ज़रूरी कुकीज़",
    "You can change your choice anytime by clicking \"Cookie settings– in the website footer. You may also disable cookies through your browser settings; however, certain website features may not function properly.": "आप वेबसाइट फुटर में \"Cookie settings– पर क्लिक करके कभी भी अपनी पसंद बदल सकते हैं। आप अपनी ब्राउज़र सेटिंग्स से भी कुकीज़ डिसेबल कर सकते हैं; हालांकि, ऐसा करने पर वेबसाइट की कुछ सुविधाएं ठीक से काम नहीं कर सकतीं।",
    "Credit Cards,": "क्रेडिट कार्ड,",
    "Browse Credit Cards": "क्रेडिट कार्ड ब्राउज़ करें",
    "Fuel & Travel": "फ्यूल और ट्रैवल",
    "This policy explains how long we keep your data and how you can ask us to delete it.": "यह पॉलिसी बताती है कि हम आपका डेटा कितने समय तक रखते हैं और आप हमसे उसे डिलीट करने के लिए कैसे कह सकते हैं।",
    "Paperless account opening": "पेपरलेस अकाउंट ओपनिंग",
    "One portfolio": "एक पोर्टफोलियो",
    "More in Investments": "इन्वेस्टमेंट्स में और देखें",
    "The Company does not guarantee approval of any financial product, and does not use any misleading wording such as \"instant guaranteed loan–, \"RBI approved loan– or \"government loan scheme–.": "कंपनी किसी भी फाइनेंशियल प्रोडक्ट के अप्रूवल की गारंटी नहीं देती, और \"instant guaranteed loan–, \"RBI approved loan– या \"government loan scheme– जैसे भ्रामक शब्दों का इस्तेमाल नहीं करती।",
    "Respect customer privacy": "ग्राहकों की प्राइवेसी का सम्मान करें",
    "Customer satisfaction and fair practices are important to us. If something goes wrong, here's how to reach us.": "ग्राहक संतुष्टि और निष्पक्ष व्यवहार हमारे लिए महत्वपूर्ण हैं। अगर कुछ गड़बड़ हो, तो हमसे ऐसे संपर्क करें।",
    "Incorrect information": "गलत जानकारी",
    "Name: Grievance Officer, MyCashBridge – Email:": "नाम: ज्योत्सना बोरा (ग्रीवांस ऑफिसर, MyCashBridge) – ईमेल:",
    "Family floater options": "फैमिली फ्लोटर विकल्प",
    "One plan that covers your whole family affordably.": "एक ऐसा प्लान जो किफायती दाम में आपके पूरे परिवार को कवर करे।",
    "Explore other insurance": "अन्य इंश्योरेंस देखें",
    "Choose a category to preview": "प्रीव्यू के लिए एक कैटेगरी चुनें",
    "Secure your family's future.": "अपने परिवार का भविष्य सुरक्षित करें।",
    "Simple tools to help everyday India invest – SIPs, mutual funds and a Demat account, all explained in plain language.": "आम भारतीयों को निवेश में मदद करने वाले आसान टूल्स – SIP, म्यूचुअल फंड और डीमैट अकाउंट, सब कुछ आसान भाषा में समझाया गया।",
    "Hold shares safely in one account.": "अपने शेयर एक अकाउंट में सुरक्षित रखें।",
    "Life Insurance on MyCashBridge": "MyCashBridge पर लाइफ इंश्योरेंस",
    "Add critical illness and accident cover.": "क्रिटिकल इलनेस और एक्सीडेंट कवर जोड़ें।",
    "Cashless garages": "कैशलेस गैराज",
    "Cashless repair": "कैशलेस रिपेयर",
    "Curated fund shortlists": "चुनिंदा फंड शॉर्टलिस्ट",
    "Goal-based": "गोल-बेस्ड",
    "MyCashBridge (\"Company–, \"we–, \"our–, or \"us–) is committed to protecting the privacy and confidentiality of customer information. This Privacy Policy explains what we collect, why, and how we handle it.": "MyCashBridge (\"कंपनी–, \"हम–, \"हमारा–, या \"हमें–) ग्राहकों की जानकारी की प्राइवेसी और गोपनीयता की सुरक्षा के लिए प्रतिबद्ध है। यह प्राइवेसी पॉलिसी बताती है कि हम क्या जानकारी इकट्ठा करते हैं, क्यों करते हैं, और उसे कैसे संभालते हैं।",
    "Address details": "पते की जानकारी",
    "Your information may be used for:": "आपकी जानकारी का इस्तेमाल इन कामों के लिए किया जा सकता है:",
    "Marketing and communication regarding financial products": "फाइनेंशियल प्रोडक्ट्स से जुड़ी मार्केटिंग और कम्युनिकेशन",
    "Technology service providers": "टेक्नोलॉजी सर्विस प्रोवाइडर",
    "We implement reasonable administrative, technical and organisational safeguards to protect your information including encryption, restricted access controls, secure hosting and periodic security reviews.": "हम आपकी जानकारी की सुरक्षा के लिए उचित प्रशासनिक, तकनीकी और संगठनात्मक उपाय लागू करते हैं, जिनमें एन्क्रिप्शन, सीमित एक्सेस कंट्रोल, सुरक्षित होस्टिंग और समय-समय पर सिक्योरिटी रिव्यू शामिल हैं।",
    "Correction of inaccurate information": "गलत जानकारी में सुधार",
    "This policy explains our position on fees, refunds and cancellations.": "यह पॉलिसी फीस, रिफंड और कैंसिलेशन पर हमारी स्थिति स्पष्ट करती है।",
    "Accelerated points on categories": "चुनिंदा कैटेगरीज़ पर एक्सेलरेटेड पॉइंट्स",
    "Bonus categories": "बोनस कैटेगरीज़",
    "Build your credit, the smart way.": "अपना क्रेडिट बनाएं, स्मार्ट तरीके से।",
    "Easy approval": "आसान अप्रूवल",
    "Upgrade path": "अपग्रेड का रास्ता",
    "Secure cloud infrastructure with access controls": "एक्सेस कंट्रोल के साथ सुरक्षित क्लाउड इंफ्रास्ट्रक्चर",
    "Security & Compliance Certifications": "सिक्योरिटी और कंप्लायंस सर्टिफिकेशन",
    "Service Organization Control – independent audit of security, availability, and confidentiality controls.": "Service Organization Control – सिक्योरिटी, उपलब्धता और गोपनीयता कंट्रोल्स का स्वतंत्र ऑडिट।",
    "256-bit TLS encryption ensures all data between your browser and our servers is fully encrypted in transit.": "256-बिट TLS एन्क्रिप्शन सुनिश्चित करता है कि आपके ब्राउज़र और हमारे सर्वर के बीच का सारा डेटा ट्रांज़िट में पूरी तरह एन्क्रिप्टेड रहे।",
    "Start from ₹500/month": "₹500/महीना से शुरू करें",
    "Compounding": "कंपाउंडिंग",
    "By accessing or using this website, you agree to be bound by these Terms & Conditions.": "इस वेबसाइट को एक्सेस या इस्तेमाल करके, आप इन नियमों और शर्तों (Terms & Conditions) से बंधे होने के लिए सहमत होते हैं।",
    "You agree:": "आप सहमत हैं:",
    "All content, trademarks, logos, designs, graphics and materials on this website are owned by the Company unless otherwise stated.": "इस वेबसाइट पर मौजूद सभी कंटेंट, ट्रेडमार्क, लोगो, डिज़ाइन, ग्राफिक्स और सामग्री कंपनी के स्वामित्व में हैं, जब तक कि अन्यथा न बताया गया हो।",
    "Third-party actions or system failures": "थर्ड-पार्टी की कार्रवाइयां या सिस्टम की विफलता",
    "Complimentary lounge access": "कॉम्प्लिमेंटरी लाउंज एक्सेस",
    "Relax at domestic and international airport lounges.": "घरेलू और इंटरनेशनल एयरपोर्ट लाउंज में आराम करें।",
    "Cover medical emergencies, trip delays, lost baggage and more on your domestic and international trips.": "अपनी घरेलू और इंटरनेशनल यात्राओं पर मेडिकल इमरजेंसी, ट्रिप में देरी, खोए सामान और बहुत कुछ कवर करें।",
    "Emergency medical cover anywhere you travel.": "आप जहां भी यात्रा करें, इमरजेंसी मेडिकल कवर।",
    "Simple, quick claims while you're on the move.": "सफर के दौरान भी आसान, तेज़ क्लेम।",
    "Collateral": "कोलैटरल",
    "Know your credit score, for free.": "अपना क्रेडिट स्कोर जानें, बिल्कुल फ्री।",
    "Your data is encrypted": "आपका डेटा एन्क्रिप्टेड है",
    "Fetching–": "फेच हो रहा है–",
    "Watch": "देखें",
    "Pay on time": "समय पर भुगतान करें",
    "Check for errors": "गलतियां चेक करें",
    "Current monthly EMIs": "मौजूदा मासिक EMI",
    "5 years": "5 साल",
    "What affects eligibility": "एलिजिबिलिटी पर क्या असर डालता है",
    "Existing EMIs": "मौजूदा EMI",
    "6 months": "6 महीने",
    "Total payable": "कुल देय राशि",
    "EMI = P – r – (1+r)n – [(1+r)n - 1], where P is principal, r is monthly rate, and n is the number of months.": "EMI = P – r – (1+r)n – [(1+r)n - 1], जहां P मूलधन है, r मासिक दर है, और n महीनों की संख्या है।",
    "As a rule of thumb, keep all your EMIs under 40–50% of your monthly income.": "एक सामान्य नियम के तौर पर, अपनी सभी EMI को अपनी मासिक आय के 40–50% से कम रखें।",
    "We understand that financial needs can arise unexpectedly. Once your application and required documents are submitted, our team works to connect you with suitable lending partners as quickly as possible. Final approval and disbursement timelines depend on lender verification and eligibility requirements.": "हम समझते हैं कि वित्तीय ज़रूरतें कभी भी अचानक आ सकती हैं। आपका आवेदन और ज़रूरी डॉक्यूमेंट जमा होने के बाद, हमारी टीम आपको जल्द से जल्द उपयुक्त लेंडिंग पार्टनर्स से जोड़ने का काम करती है। फाइनल अप्रूवल और डिस्बर्समेंट की समयसीमा लेंडर वेरिफिकेशन और एलिजिबिलिटी आवश्यकताओं पर निर्भर करती है।",
    "No. Transparency is one of the core values at MyCashBridge. Any applicable processing fees, charges, interest rates, and loan terms are clearly communicated before you proceed. We believe borrowers should have complete visibility into the financial commitment they are making.": "नहीं। पारदर्शिता MyCashBridge के मूल मूल्यों में से एक है। कोई भी लागू प्रोसेसिंग फीस, चार्ज, ब्याज दरें और लोन की शर्तें आपके आगे बढ़ने से पहले साफ-साफ बताई जाती हैं। हमारा मानना है कि उधार लेने वालों को अपनी वित्तीय प्रतिबद्धता की पूरी जानकारी होनी चाहिए।",
    "Which insurance are you looking for?": "आप कौन सा इंश्योरेंस ढूंढ रहे हैं?",
    "Done": "हो गया",
    "You're all set! 🎉": "सब हो गया! 🎉",
    "Indicative estimate only — not a guaranteed offer. Final eligibility is subject to lender assessment and applicable terms.": "यह केवल सांकेतिक अनुमान है — कोई गारंटीड ऑफर नहीं। फाइनल एलिजिबिलिटी लेंडर के आकलन और लागू शर्तों के अधीन है।",
    "Submitting…": "सबमिट हो रहा है…",
    "Step 3 of 3": "चरण 3 / 3",
    "Apply for a Education Loan": "एजुकेशन लोन के लिए अप्लाई करें",
    "Best Credit Cards for Salaried Employees in India (2026)": "भारत में सैलरीड कर्मचारियों के लिए बेस्ट क्रेडिट कार्ड (2026)",
    "Cashback cards": "कैशबैक कार्ड",
    "Secured cards": "सिक्योर्ड कार्ड",
    "A reasonable credit limit based on your salary": "आपकी सैलरी के आधार पर एक उचित क्रेडिट लिमिट",
    "Keep spends under 30% of your credit limit": "अपने खर्च क्रेडिट लिमिट के 30% से कम रखें",
    "Frequently asked questions": "अक्सर पूछे जाने वाले सवाल",
    "Generally, everyday cashback is not treated as income, but rules can vary. Consult a tax advisor for your situation.": "आम तौर पर, रोज़मर्रा का कैशबैक इनकम नहीं माना जाता, लेकिन नियम अलग-अलग हो सकते हैं। अपनी स्थिति के लिए किसी टैक्स सलाहकार से सलाह लें।",
    "A personal loan is one of the fastest ways to fund a wedding, medical emergency, travel or any urgent need – without pledging collateral. But with dozens of banks and NBFCs offering different rates, choosing the best personal loan in India can feel confusing. This guide breaks it down in plain language.": "पर्सनल लोन शादी, मेडिकल इमरजेंसी, यात्रा या किसी भी ज़रूरी खर्च के लिए फंड पाने के सबसे तेज़ तरीकों में से एक है – वो भी बिना कुछ गिरवी रखे। लेकिन दर्जनों बैंक और NBFC अलग-अलग रेट ऑफर करते हैं, इसलिए भारत में बेस्ट पर्सनल लोन चुनना उलझन भरा लग सकता है। यह गाइड इसे आसान भाषा में समझाती है।",
    "Disbursal speed": "डिसबर्सल की स्पीड",
    "Age between 21 and 60 years": "उम्र 21 से 60 साल के बीच",
    "Documents you'll typically need": "आम तौर पर ज़रूरी डॉक्युमेंट्स",
    "Keep your credit score healthy (pay EMIs and card bills on time)": "अपना क्रेडिट स्कोर अच्छा रखें (EMI और कार्ड के बिल समय पर चुकाएं)",
    "across 128+ partners, so you see clear EMIs and totals up front. You can also": "30+ पार्टनर्स के बीच, ताकि आपको EMI और कुल राशि पहले ही साफ़-साफ़ दिख जाए। आप यह भी कर सकते हैं –",
    "Rates change often and depend on your profile. Rather than chasing one bank, compare multiple lenders for your specific income and credit score – that's what MyCashBridge.com does for you.": "रेट अक्सर बदलते रहते हैं और आपकी प्रोफाइल पर निर्भर करते हैं। किसी एक बैंक के पीछे भागने के बजाय, अपनी इनकम और क्रेडिट स्कोर के हिसाब से कई लेंडर्स की तुलना करें – और यही काम MyCashBridge.com आपके लिए करता है।",
    "Business Loan for MSMEs in India (2026): Eligibility, Documents & Tips": "भारत में MSME के लिए बिज़नेस लोन (2026): एलिजिबिलिटी, डॉक्युमेंट्स और टिप्स",
    "– fund equipment, expansion or new premises": "– इक्विपमेंट, विस्तार या नई जगह के लिए फंड पाएं",
    "Business vintage of typically 1–2 years": "आम तौर पर 1–2 साल का बिज़नेस विंटेज",
    "Documents you'll usually need": "आम तौर पर लगने वाले डॉक्युमेंट्स",
    "Keep your GST filings and bank statements clean and up to date": "अपनी GST फाइलिंग और बैंक स्टेटमेंट साफ़ और अप-टू-डेट रखें",
    "across multiple partners. For larger needs at lower rates, consider a": "कई पार्टनर्स के बीच। कम रेट पर बड़ी ज़रूरतों के लिए, देखें –",
    "What is the typical interest rate for MSME loans?": "MSME लोन पर आम तौर पर ब्याज दर कितनी होती है?",
    "Payment history (~35%)": "पेमेंट हिस्ट्री (~35%)",
    "Hard enquiries": "हार्ड इन्क्वायरी",
    "Apply for new credit sparingly and only when needed": "नए क्रेडिट के लिए कम और सिर्फ ज़रूरत पड़ने पर ही अप्लाई करें",
    "Even a 1% lower interest rate on a large loan can save you tens of thousands of rupees over the tenure. Improving your score is one of the highest-return financial habits you can build.": "बड़े लोन पर सिर्फ 1% कम ब्याज दर भी पूरी अवधि में आपके दसियों हज़ार रुपये बचा सकती है। अपना स्कोर सुधारना सबसे ज़्यादा रिटर्न देने वाली फाइनेंशियल आदतों में से एक है।",
    "750 and above is considered excellent and gets you the best rates. 700–749 is good.": "750 और उससे ऊपर का स्कोर एक्सीलेंट माना जाता है और आपको बेस्ट रेट दिलाता है। 700–749 अच्छा माना जाता है।",
    "Borrow smarter, with clear advice": "समझदारी से उधार लें, साफ़ सलाह के साथ",
    "A low CIBIL score can make borrowing harder – but it doesn't always mean a 'no'. Many people get loans with a less-than-perfect score by choosing the right product and lender. Here's what you need to know.": "कम CIBIL स्कोर से लोन मिलना मुश्किल हो सकता है – लेकिन इसका मतलब हमेशा 'ना' नहीं होता। सही प्रोडक्ट और लेंडर चुनकर कई लोग कम-परफेक्ट स्कोर के साथ भी लोन पा लेते हैं। जानिए आपको क्या पता होना चाहिए।",
    "Add a co-applicant or guarantor": "को-एप्लिकेंट या गारंटर जोड़ें",
    "Explore a gold loan – easier approval, low rate": "गोल्ड लोन देखें – आसान अप्रूवल, कम रेट",
    "Lower your credit utilisation below 30%": "अपना क्रेडिट यूटिलाइज़ेशन 30% से नीचे लाएं",
    ". When you're ready, a": "। जब आप तैयार हों, तो",
    "Each hard enquiry can dip your score slightly. Compare first and apply selectively rather than to many lenders at once.": "हर हार्ड इन्क्वायरी आपके स्कोर को थोड़ा गिरा सकती है। एक साथ कई लेंडर्स के पास अप्लाई करने के बजाय पहले तुलना करें और सोच-समझकर अप्लाई करें।",
    "Aapke Sapno Ka Financial Saathi": "आपके सपनों का फाइनेंशियल साथी",
    "Compare what you'd pay across loan types, check your EMI, and apply – all with a clear total before you commit. Pick where to start:": "अलग-अलग लोन टाइप्स पर आप कितना चुकाएंगे, इसकी तुलना करें, अपनी EMI चेक करें और अप्लाई करें – कमिट करने से पहले पूरी कुल राशि साफ़-साफ़ देखें। चुनें, शुरुआत कहां से करनी है:",
    "No paperwork to begin, no jargon. Just a clear answer and a fair rate – explained in plain language.": "शुरू करने के लिए न कोई पेपरवर्क, न भारी-भरकम शब्द। बस एक साफ़ जवाब और एक फेयर रेट – आसान भाषा में समझाया हुआ।",
    "Smart, free tools to help you decide with confidence – no sign-up needed.": "भरोसे के साथ फैसला लेने में मदद करने वाले स्मार्ट, फ्री टूल्स – किसी साइन-अप की ज़रूरत नहीं।",
    "(5,000+ reviews)": "(5,000+ रिव्यू)",
    "Priya Mehta": "प्रिया मेहता",
    "₹25 Lakhs": "₹25 लाख",
    "Mohammed Rafiq": "मोहम्मद रफ़ीक़",
    "I built MyCashBridge on a simple idea: getting a loan should feel like sitting across from someone who genuinely wants to help – not filling endless forms or decoding fine print. We bring you offers from trusted banks and NBFCs in one place, explain every number in plain language, and show you the full cost before you sign. Whether it's your first home, your child's education, or growing your business, we're here to help you get there with confidence. That's what": "मैंने MyCashBridge एक सीधी-सी सोच पर बनाया: लोन लेना ऐसा महसूस होना चाहिए जैसे आप किसी ऐसे इंसान के सामने बैठे हों जो सच में आपकी मदद करना चाहता है – न कि अंतहीन फॉर्म भरना या बारीक अक्षरों की भूलभुलैया सुलझाना। हम भरोसेमंद बैंकों और NBFC के ऑफर एक ही जगह लाते हैं, हर आंकड़ा आसान भाषा में समझाते हैं, और साइन करने से पहले पूरी लागत दिखाते हैं। चाहे आपका पहला घर हो, बच्चे की पढ़ाई हो, या बिज़नेस बढ़ाना हो, हम आपको भरोसे के साथ वहां तक पहुंचाने के लिए हैं। यही है",
    "Collateral-free options": "बिना कोलैटरल के विकल्प",
    "I authorise MyCashBridge and its lending partners to contact me about my enquiry via call, SMS, email or WhatsApp. This overrides my DND/NDNC registration.": "मैं MyCashBridge और इसके लेंडिंग पार्टनर्स को कॉल, SMS, ईमेल या WhatsApp के ज़रिए मेरी इन्क्वायरी के बारे में मुझसे संपर्क करने की अनुमति देता/देती हूं। यह मेरे DND/NDNC रजिस्ट्रेशन को ओवरराइड करता है।",
    "one-time, on approval": "एक बार, अप्रूवल पर",
    "Quick approvals with minimal paperwork": "कम से कम पेपरवर्क के साथ तेज़ अप्रूवल",
    "4 yrs": "4 साल",
    "GST registration and business bank account": "GST रजिस्ट्रेशन और बिज़नेस बैंक अकाउंट",
    "Tell us about your business": "हमें अपने बिज़नेस के बारे में बताएं",
    "Receive your funds": "अपना फंड पाएं",
    "Anything that grows or sustains your business – buying stock, equipment, paying salaries, marketing, or managing seasonal cash-flow gaps.": "वह सब कुछ जो आपके बिज़नेस को बढ़ाए या चलाए रखे – स्टॉक खरीदना, इक्विपमेंट, सैलरी देना, मार्केटिंग, या सीज़नल कैश-फ्लो की कमी संभालना।",
    "It varies by lender. We show all charges, including any foreclosure fee, clearly before you accept.": "यह लेंडर के हिसाब से अलग-अलग होता है। आपके स्वीकार करने से पहले हम फोरक्लोज़र फीस समेत सभी चार्ज साफ़-साफ़ दिखाते हैं।",
    "New & used cars": "नई और पुरानी कारें",
    "Less waiting, more driving": "कम इंतज़ार, ज़्यादा ड्राइविंग",
    "Doorstep document pickup with partners": "पार्टनर्स के साथ डोरस्टेप डॉक्युमेंट पिकअप",
    "Minimum income as per lender norms": "लेंडर के नियमों के अनुसार न्यूनतम इनकम",
    "Proforma invoice / quotation of the car": "कार का प्रोफॉर्मा इनवॉइस / कोटेशन",
    "An expert calls with your funding amount, rate and EMI.": "एक एक्सपर्ट आपको फंडिंग अमाउंट, रेट और EMI के साथ कॉल करता है।",
    "Can I get a loan for a used car?": "क्या मुझे पुरानी कार के लिए लोन मिल सकता है?",
    "Is a down payment required?": "क्या डाउन पेमेंट ज़रूरी है?",
    "Invest in a brighter future.": "एक उज्जवल भविष्य में निवेश करें।",
    "Apply for Education Loan": "एजुकेशन लोन के लिए अप्लाई करें",
    "Covers tuition, living, travel & equipment": "ट्यूशन, रहने-खाने, यात्रा और इक्विपमेंट का खर्च कवर",
    "Indicative Education Loan Rates": "एजुकेशन लोन की सांकेतिक दरें",
    "Good academic record helps approval": "अच्छा एकेडमिक रिकॉर्ड अप्रूवल में मदद करता है",
    "Get your education loan in 4 simple steps": "4 आसान स्टेप्स में पाएं अपना एजुकेशन लोन",
    "On approval, fees are disbursed to the institution as scheduled.": "अप्रूवल के बाद, फीस तय शेड्यूल के अनुसार संस्थान को भेज दी जाती है।",
    "Do I need collateral?": "क्या मुझे कोलैटरल देना होगा?",
    "Don't let funds limit a future": "पैसों की कमी को भविष्य की राह न रोकने दें",
    "Quick disbursal": "तेज़ डिसबर्सल",
    "Your gold, working for you": "आपका सोना, अब आपके काम आए",
    "Ornaments returned in full on repayment": "रीपेमेंट पर गहने पूरी तरह वापस",
    "No minimum income requirement": "न्यूनतम इनकम की कोई शर्त नहीं",
    "Tell us about your gold": "हमें अपने सोने के बारे में बताएं",
    "Instant disbursal": "इंस्टेंट डिसबर्सल",
    "Yes. Pledged gold is stored in secure, insured vaults and returned to you intact once you repay the loan in full.": "हां। गिरवी रखा गया सोना सुरक्षित, बीमित वॉल्ट में रखा जाता है और लोन पूरा चुकाते ही आपको ज्यों का त्यों वापस कर दिया जाता है।",
    "Gold loans are among the fastest – once your gold is valued, funds can be disbursed the same day.": "गोल्ड लोन सबसे तेज़ लोन में से हैं – आपके सोने की वैल्यूएशन होते ही, उसी दिन फंड डिसबर्स हो सकता है।",
    "Up to 90% funding": "90% तक फंडिंग",
    "A home loan that feels light": "एक होम लोन जो हल्का महसूस हो",
    "Top-up loan available for renovation": "रेनोवेशन के लिए टॉप-अप लोन उपलब्ध",
    "Clear property title and valuation": "साफ़ प्रॉपर्टी टाइटल और वैल्यूएशन",
    "Proof of own contribution / down payment": "खुद के योगदान / डाउन पेमेंट का प्रूफ",
    "Property & document check": "प्रॉपर्टी और डॉक्युमेंट चेक",
    "What is a balance transfer?": "बैलेंस ट्रांसफर क्या है?",
    "After document and property verification, sanction usually takes a few working days. Disbursal follows as per your agreement and construction stage.": "डॉक्युमेंट और प्रॉपर्टी वेरिफिकेशन के बाद, सैंक्शन में आम तौर पर कुछ वर्किंग डेज़ लगते हैं। डिसबर्सल आपके एग्रीमेंट और कंस्ट्रक्शन स्टेज के अनुसार होता है।",
    "Lower rates than personal loans": "पर्सनल लोन से कम रेट",
    "Big funding at a fair rate": "फेयर रेट पर बड़ी फंडिंग",
    "Long tenure keeps EMIs manageable": "लंबी अवधि से EMI आसान रहती है",
    "Latest property tax receipts": "लेटेस्ट प्रॉपर्टी टैक्स रसीदें",
    "The property is valued and its title verified by the lender.": "लेंडर प्रॉपर्टी की वैल्यूएशन करता है और उसका टाइटल वेरिफाई करता है।",
    "Typically 50–70% of the property's market value, depending on the lender and property type.": "आम तौर पर प्रॉपर्टी की मार्केट वैल्यू का 50–70%, जो लेंडर और प्रॉपर्टी टाइप पर निर्भर करता है।",
    "As with any secured loan, default can lead the lender to recover dues from the property. Always borrow within your comfortable repayment capacity.": "किसी भी सिक्योर्ड लोन की तरह, डिफॉल्ट होने पर लेंडर प्रॉपर्टी से बकाया वसूल सकता है। हमेशा उतना ही उधार लें जितना आप आराम से चुका सकें।",
    "Tenure up to 6 years": "6 साल तक की अवधि",
    "Disbursal in as little as 24 hours": "सिर्फ 24 घंटे में डिसबर्सल",
    "6 yrs": "6 साल",
    "Last 3 salary slips (salaried) or ITR (self-employed)": "पिछली 3 सैलरी स्लिप (सैलरीड) या ITR (सेल्फ-एम्प्लॉयड)",
    "An expert calls you with a clear offer: amount, EMI and total payable.": "एक एक्सपर्ट आपको साफ़ ऑफर के साथ कॉल करता है: अमाउंट, EMI और कुल देय राशि।",
    "How much personal loan can I get?": "मुझे कितना पर्सनल लोन मिल सकता है?",
    "Do I need to pledge any security?": "क्या मुझे कोई सिक्योरिटी गिरवी रखनी होगी?",
    "Our story": "हमारी कहानी",
    "Our values": "हमारे मूल्य",
    "Friendly experts who speak your language and genuinely help.": "दोस्ताना एक्सपर्ट्स जो आपकी भाषा बोलते हैं और सच में मदद करते हैं।",
    "Registered office: 750, Udyog Vihar Phase 5, Sector 19, Gurugram, Haryana – 122016, India – CIN: U72501HR2022PTC104372 – GSTIN: 06AALCR9469E1ZV": "रजिस्टर्ड ऑफिस: 750, उद्योग विहार फेज़ 5, सेक्टर 19, गुरुग्राम, हरियाणा – 122016, भारत – CIN: U72501HR2022PTC104372 – GSTIN: 06AALCR9469E1ZV",
    "Information Security": "इन्फॉर्मेशन सिक्योरिटी",
    "Raise a grievance": "शिकायत दर्ज करें",
    "Instant online comparison": "इंस्टेंट ऑनलाइन तुलना",
    "What to expect": "क्या उम्मीद करें",
    "Easy redemption": "आसान रिडेम्पशन",
    "Consent & Communication Policy": "कंसेंट और कम्युनिकेशन पॉलिसी",
    "Email": "ईमेल",
    "Talk to a loan expert": "लोन एक्सपर्ट से बात करें",
    "Fill in the form and we'll get back to you shortly.": "फॉर्म भरें और हम जल्द ही आपसे संपर्क करेंगे।",
    "Send message": "मैसेज भेजें",
    "Analyse traffic and user behaviour": "ट्रैफिक और यूज़र बिहेवियर का विश्लेषण करना",
    "are always active because the site needs them to function.": "हमेशा एक्टिव रहती हैं क्योंकि साइट को काम करने के लिए इनकी ज़रूरत होती है।",
    "Copyright & Intellectual Property Notice": "कॉपीराइट और बौद्धिक संपदा सूचना",
    "applied through MyCashBridge.": "जो MyCashBridge के ज़रिए अप्लाई किया गया हो।",
    "⭐ Popular Cards": "⭐ पॉपुलर कार्ड",
    "Ready to apply for a Credit Card?": "क्रेडिट कार्ड के लिए अप्लाई करने को तैयार?",
    "Customer data may be retained for business, legal, audit, fraud-prevention, regulatory and contractual obligations.": "बिज़नेस, कानूनी, ऑडिट, फ्रॉड-रोकथाम, रेगुलेटरी और कॉन्ट्रैक्चुअल ज़िम्मेदारियों के लिए ग्राहक डेटा को सुरक्षित रखा जा सकता है।",
    "Hold shares & ETFs": "शेयर और ETF रखें",
    "Hold all your securities in a single account.": "अपनी सभी सिक्योरिटीज़ एक ही अकाउंट में रखें।",
    "Explore other investments": "दूसरे निवेश विकल्प देखें",
    "All trademarks and logos belong to their respective owners and are used strictly in accordance with applicable permissions and guidelines. Interest rates and offers shown on this website are indicative and subject to change without notice.": "सभी ट्रेडमार्क और लोगो उनके संबंधित मालिकों के हैं और लागू अनुमतियों व दिशा-निर्देशों के अनुसार ही इस्तेमाल किए गए हैं। इस वेबसाइट पर दिखाई गई ब्याज दरें और ऑफर सांकेतिक हैं और बिना सूचना के बदल सकते हैं।",
    "Ensure professional conduct": "प्रोफेशनल व्यवहार सुनिश्चित करना",
    "You may raise complaints regarding:": "आप इन विषयों पर शिकायत दर्ज कर सकते हैं:",
    "Escalation matrix": "एस्केलेशन मैट्रिक्स",
    "Response timelines": "रिस्पॉन्स टाइमलाइन",
    "Tax benefits u/s 80D": "सेक्शन 80D के तहत टैक्स बेनिफिट",
    "No-claim bonus": "नो-क्लेम बोनस",
    "Protect what matters most.": "जो सबसे ज़रूरी है, उसे सुरक्षित रखें।",
    "These products are launching soon. Tap any to see what's coming – and leave your details to be first in line.": "ये प्रोडक्ट जल्द लॉन्च हो रहे हैं। क्या आने वाला है, यह देखने के लिए किसी पर भी टैप करें – और सबसे पहले पाने के लिए अपनी डिटेल्स छोड़ें।",
    "MOTOR": "मोटर",
    "Investments we're building": "निवेश विकल्प जो हम बना रहे हैं",
    "Peace of mind for your family.": "आपके परिवार के लिए मन की शांति।",
    "Term cover": "टर्म कवर",
    "Premiums qualify under Section 80C.": "प्रीमियम सेक्शन 80C के तहत योग्य हैं।",
    "Motor Insurance on MyCashBridge": "MyCashBridge पर मोटर इंश्योरेंस",
    "Repairs at network garages with no upfront cost.": "नेटवर्क गैराज में रिपेयर, बिना कोई अपफ्रंट खर्च।",
    "Goal-based investing": "गोल-बेस्ड निवेश",
    "Invest for a home, education or retirement.": "घर, पढ़ाई या रिटायरमेंट के लिए निवेश करें।",
    "1. Nature of services": "1. सेवाओं की प्रकृति",
    "Date of birth": "जन्म तिथि",
    "Evaluating eligibility for financial products": "फाइनेंशियल प्रोडक्ट्स के लिए एलिजिबिलिटी का आकलन",
    "Regulatory and compliance requirements": "रेगुलेटरी और कंप्लायंस आवश्यकताएं",
    "CRM and cloud infrastructure providers": "CRM और क्लाउड इन्फ्रास्ट्रक्चर प्रोवाइडर",
    "7. Data retention": "7. डेटा रिटेंशन",
    "Withdrawal of consent": "सहमति वापस लेना",
    "The Company primarily provides facilitation and sourcing services for financial products.": "कंपनी मुख्य रूप से फाइनेंशियल प्रोडक्ट्स के लिए फैसिलिटेशन और सोर्सिंग सेवाएं प्रदान करती है।",
    "Big redemption catalogue": "बड़ा रिडेम्पशन कैटलॉग",
    "Extra points on dining, shopping and more.": "डाइनिंग, शॉपिंग और भी बहुत कुछ पर एक्स्ट्रा पॉइंट्स।",
    "New to credit or rebuilding your score? A secured card backed by a fixed deposit helps you build a strong credit history responsibly.": "क्रेडिट में नए हैं या स्कोर दोबारा बना रहे हैं? फिक्स्ड डिपॉज़िट पर आधारित सिक्योर्ड कार्ड आपको ज़िम्मेदारी से मज़बूत क्रेडिट हिस्ट्री बनाने में मदद करता है।",
    "Get a card against an FD, even with no credit history.": "FD के बदले कार्ड पाएं, बिना किसी क्रेडिट हिस्ट्री के भी।",
    "Graduate to a regular card as your score improves.": "स्कोर सुधरने पर रेगुलर कार्ड पर अपग्रेड करें।",
    "Multi-factor authentication for privileged access": "प्रिविलेज्ड एक्सेस के लिए मल्टी-फैक्टर ऑथेंटिकेशन",
    "This platform follows industry-standard security and compliance practices designed to protect customer information and financial data.": "यह प्लेटफॉर्म ग्राहक की जानकारी और फाइनेंशियल डेटा की सुरक्षा के लिए बनाई गई इंडस्ट्री-स्टैंडर्ड सिक्योरिटी और कंप्लायंस प्रैक्टिसेज़ का पालन करता है।",
    "Audit Framework": "ऑडिट फ्रेमवर्क",
    "Active": "एक्टिव",
    "Power of compounding": "कंपाउंडिंग की ताकत",
    "Let returns earn returns over the long term.": "लंबी अवधि में रिटर्न से रिटर्न कमाएं।",
    "1. Scope of services": "1. सेवाओं का दायरा",
    "To provide accurate and complete information": "सटीक और पूरी जानकारी देना",
    "5. Limitation of liability": "5. देयता की सीमा",
    "6. Modifications": "6. संशोधन",
    "Low forex markup": "कम फॉरेक्स मार्कअप",
    "Low forex": "कम फॉरेक्स",
    "Medical & evacuation cover": "मेडिकल और इवैक्युएशन कवर",
    "Trip protection": "ट्रिप प्रोटेक्शन",
    "Compare": "तुलना करें",
    "Live partner rates": "लाइव पार्टनर रेट",
    "Your CIBIL score is the single biggest factor in your loan approval and interest rate. Check it free in 10 seconds and get clear tips to improve it.": "आपका CIBIL स्कोर आपके लोन अप्रूवल और ब्याज दर का सबसे बड़ा फैक्टर है। 10 सेकंड में इसे फ्री में चेक करें और इसे सुधारने के साफ़ टिप्स पाएं।",
    "Check your score free": "अपना स्कोर फ्री में चेक करें",
    "Payment history": "पेमेंट हिस्ट्री",
    "Credit mix & age": "क्रेडिट मिक्स और उम्र",
    "Never miss an EMI or card due date. Payment history is the biggest factor in your score.": "EMI या कार्ड की ड्यू डेट कभी न चूकें। पेमेंट हिस्ट्री आपके स्कोर का सबसे बड़ा फैक्टर है।",
    "Review your report yearly and dispute any mistakes that may be dragging your score down.": "हर साल अपनी रिपोर्ट देखें और स्कोर गिराने वाली किसी भी गलती पर डिस्प्यूट दर्ज करें।",
    "Your age": "आपकी उम्र",
    "Indicative rate": "सांकेतिक रेट",
    "5 things lenders look at": "5 चीज़ें जो लेंडर देखते हैं",
    "Lower existing obligations leave more room for a new loan.": "मौजूदा देनदारियां कम होने पर नए लोन के लिए ज़्यादा गुंजाइश रहती है।",
    "30 years": "30 साल",
    "Apply at this EMI": "इस EMI पर अप्लाई करें",
    "Lower rate, lower cost": "कम रेट, कम लागत",
    "How much loan amount can I get through MyCashBridge?": "MyCashBridge के ज़रिए मुझे कितना लोन अमाउंट मिल सकता है?",
    "What documents do I need to apply?": "अप्लाई करने के लिए मुझे कौन से डॉक्युमेंट्स चाहिए?",
    "Is my information safe with MyCashBridge?": "क्या मेरी जानकारी MyCashBridge के पास सुरक्षित है?",
    "What type of card do you want?": "आपको किस तरह का कार्ड चाहिए?",
    "Get FREE Offers": "फ्री ऑफर पाएं",
    "A MyCashBridge expert will call you within 24 hours with the best offers. Keep your phone handy.": "MyCashBridge का एक एक्सपर्ट 24 घंटे के भीतर बेस्ट ऑफर्स के साथ आपको कॉल करेगा। अपना फोन पास रखें।",
    "You're almost done. Complete the final step to view available offers.": "बस थोड़ा-सा बाकी है। उपलब्ध ऑफर देखने के लिए आखिरी स्टेप पूरा करें।",
    "All rights reserved.": "सर्वाधिकार सुरक्षित।",
    "Step 1 of 1": "चरण 1 / 1",
    "Apply for a Personal Loan": "पर्सनल लोन के लिए अप्लाई करें",
    "Apply for a Loan Against Property": "लोन अगेंस्ट प्रॉपर्टी के लिए अप्लाई करें",
    "MyCashBridge.com Editorial": "MyCashBridge.com एडिटोरियल",
    "– best if you want simple money back on groceries, fuel and bills": "– बेस्ट अगर आप ग्रॉसरी, फ्यूल और बिलों पर सीधा-सादा मनी बैक चाहते हैं",
    "– best if you're new to credit or rebuilding your score": "– बेस्ट अगर आप क्रेडिट में नए हैं या अपना स्कोर दोबारा बना रहे हैं",
    "Be first to compare cards on MyCashBridge.com": "MyCashBridge.com पर सबसे पहले कार्ड्स की तुलना करें",
    "Avoid applying for many cards at once": "एक साथ कई कार्ड्स के लिए अप्लाई करने से बचें",
    "What credit score do I need for a good credit card?": "एक अच्छे क्रेडिट कार्ड के लिए मुझे कितना क्रेडिट स्कोर चाहिए?",
    "Disclaimer:": "डिस्क्लेमर:",
    "What makes a personal loan the 'best' for you": "क्या चीज़ किसी पर्सनल लोन को आपके लिए 'बेस्ट' बनाती है",
    "– the best lenders fund within 24 hours": "– बेस्ट लेंडर 24 घंटे के भीतर फंड कर देते हैं",
    "A steady monthly income (often ₹15,000+ depending on city)": "एक नियमित मासिक इनकम (शहर के हिसाब से अक्सर ₹15,000+)",
    "PAN and Aadhaar": "PAN और आधार",
    "Reduce existing obligations before applying": "अप्लाई करने से पहले मौजूदा देनदारियां कम करें",
    "calculate your EMI": "अपनी EMI कैलकुलेट करें",
    "How much personal loan can I get on my salary?": "मेरी सैलरी पर मुझे कितना पर्सनल लोन मिल सकता है?",
    "Micro, Small and Medium Enterprises (MSMEs) are the backbone of India's economy – but cash flow gaps and growth plans often need outside funding. A business loan can help you buy stock, hire, upgrade equipment or expand. Here's how MSME loans work.": "सूक्ष्म, लघु और मध्यम उद्यम (MSMEs) भारत की अर्थव्यवस्था की रीढ़ हैं – लेकिन कैश फ्लो की कमी और ग्रोथ प्लान के लिए अक्सर बाहरी फंडिंग की ज़रूरत पड़ती है। बिज़नेस लोन से आप स्टॉक खरीद सकते हैं, स्टाफ रख सकते हैं, इक्विपमेंट अपग्रेड कर सकते हैं या कारोबार बढ़ा सकते हैं। जानिए MSME लोन कैसे काम करते हैं।",
    "Collateral-free loans": "कोलैटरल-फ्री लोन",
    "Minimum annual turnover as per lender norms": "लेंडर के नियमों के अनुसार न्यूनतम सालाना टर्नओवर",
    "PAN and Aadhaar of the proprietor/partners": "प्रोप्राइटर/पार्टनर्स का PAN और आधार",
    "Maintain a healthy current account balance": "करंट अकाउंट में अच्छा बैलेंस बनाए रखें",
    "loan against property": "लोन अगेंस्ट प्रॉपर्टी",
    "It varies widely (around 14% p.a. upwards) depending on the lender, your profile and whether the loan is secured.": "यह लेंडर, आपकी प्रोफाइल और लोन सिक्योर्ड है या नहीं – इन बातों के आधार पर काफी अलग-अलग होती है (लगभग 14% प्रति वर्ष से शुरू)।",
    "– paying EMIs and bills on time is the biggest factor": "– EMI और बिल समय पर चुकाना सबसे बड़ा फैक्टर है",
    "– too many applications in a short time lower your score": "– कम समय में बहुत सारी एप्लीकेशन आपका स्कोर घटा देती हैं",
    "Check your report yearly and dispute any errors": "हर साल अपनी रिपोर्ट चेक करें और किसी भी गलती पर डिस्प्यूट दर्ज करें",
    "Ready to check where you stand?": "जानने के लिए तैयार हैं कि आप कहां खड़े हैं?",
    "Does checking my own score lower it?": "क्या अपना स्कोर खुद चेक करने से वह घटता है?",
    "Practical, jargon-free guides on loans, credit cards and credit scores for everyday India – written to help you make confident money decisions.": "लोन, क्रेडिट कार्ड और क्रेडिट स्कोर पर आम भारत के लिए प्रैक्टिकल, आसान भाषा वाली गाइड्स – ताकि आप पैसों के फैसले भरोसे के साथ ले सकें।",
    "What counts as a low CIBIL score?": "कम CIBIL स्कोर किसे माना जाता है?",
    "– a co-applicant with a strong score can boost your application": "– मजबूत स्कोर वाला को-एप्लिकेंट आपकी एप्लीकेशन को बूस्ट कर सकता है",
    "No income proof needed, and your gold is insured.": "किसी इनकम प्रूफ की ज़रूरत नहीं, और आपका सोना इंश्योर्ड रहता है।",
    "Fix errors in your credit report": "अपनी क्रेडिट रिपोर्ट की गलतियां ठीक करवाएं",
    "gold loan": "गोल्ड लोन",
    "How fast can I improve a low score?": "कम स्कोर कितनी जल्दी सुधर सकता है?",
    "Compare and apply for personal, business, home and gold loans from India's leading banks & NBFCs – with EMIs you choose and a total you can see before you sign.": "भारत के लीडिंग बैंकों और NBFCs से पर्सनल, बिज़नेस, होम और गोल्ड लोन की तुलना करें और अप्लाई करें – अपनी पसंद की EMI और साइन करने से पहले पूरा टोटल आपके सामने।",
    "One application – offers sourced across leading lenders": "एक एप्लीकेशन – लीडिंग लेंडर्स से ऑफर आप तक",
    "An expert calls you with the amount, the EMI and the total payable – all in plain numbers.": "एक एक्सपर्ट आपको कॉल करके अमाउंट, EMI और कुल देय राशि बताता है – सब कुछ साफ-साफ आंकड़ों में।",
    "Check your credit score free – and learn how to improve it.": "अपना क्रेडिट स्कोर फ्री में चेक करें – और जानें इसे कैसे सुधारें।",
    "Was managing 4 different EMIs and it was a nightmare. MyCashBridge helped me consolidate everything into one loan with a lower overall EMI. Life is so much simpler now!": "मैं 4 अलग-अलग EMI मैनेज कर रहा था और यह किसी बुरे सपने जैसा था। MyCashBridge ने सब कुछ एक लोन में कंसोलिडेट करने में मदद की, वह भी कम कुल EMI के साथ। अब ज़िंदगी कितनी आसान हो गई है!",
    "Mumbai · Personal Loan": "मुंबई · पर्सनल लोन",
    "I needed money for my daughter's admission urgently. The team explained everything in Hindi, no confusion. Loan was approved the same day.": "मुझे अपनी बेटी के एडमिशन के लिए तुरंत पैसों की ज़रूरत थी। टीम ने सब कुछ हिंदी में समझाया, कोई कन्फ्यूजन नहीं। लोन उसी दिन अप्रूव हो गया।",
    "₹18 Lakhs": "₹18 लाख",
    "truly means to us.": "हमारे लिए सच में मायने रखता है।",
    "Flexible EMIs": "फ्लेक्सिबल EMI",
    "Won't affect your credit score. We never charge a fee to apply.": "आपके क्रेडिट स्कोर पर कोई असर नहीं पड़ेगा। अप्लाई करने के लिए हम कभी कोई फीस नहीं लेते।",
    "Capital that keeps pace with you": "ऐसी पूंजी जो आपकी रफ्तार से चले",
    "Dedicated relationship manager": "डेडिकेटेड रिलेशनशिप मैनेजर",
    "EMI calculator": "EMI कैलकुलेटर",
    "Proprietor, partnership, LLP or Pvt Ltd eligible": "प्रोप्राइटर, पार्टनरशिप, LLP या प्राइवेट लिमिटेड – सभी एलिजिबल",
    "Share basic details and your funding need. Just 10 seconds.": "बेसिक डिटेल्स और अपनी फंडिंग की ज़रूरत बताएं। बस 10 सेकंड।",
    "Once approved, the money is credited to your business account quickly.": "अप्रूवल के बाद पैसा जल्दी ही आपके बिज़नेस अकाउंट में क्रेडिट हो जाता है।",
    "How is my eligibility decided?": "मेरी एलिजिबिलिटी कैसे तय होती है?",
    "Give your business room to grow": "अपने बिज़नेस को बढ़ने की जगह दें",
    "Quick approval": "क्विक अप्रूवल",
    "Funding up to 100% of on-road price": "ऑन-रोड कीमत की 100% तक फंडिंग",
    "Indicative Car Loan Rates": "कार लोन की सांकेतिक दरें",
    "Valid driving licence and PAN": "वैध ड्राइविंग लाइसेंस और PAN",
    "Passport-size photographs": "पासपोर्ट साइज़ फोटो",
    "Verification": "वेरिफिकेशन",
    "Yes. We have partners who finance pre-owned cars, usually up to a certain age of the vehicle, with funding based on its valuation.": "हां। हमारे ऐसे पार्टनर हैं जो प्री-ओन्ड (पुरानी) कारों को फाइनेंस करते हैं – आमतौर पर गाड़ी की एक तय उम्र तक, और फंडिंग उसकी वैल्यूएशन के आधार पर मिलती है।",
    "If the loan doesn't cover the full on-road price, you pay the balance as down payment. Many new-car loans offer up to 100% funding.": "अगर लोन पूरी ऑन-रोड कीमत को कवर नहीं करता, तो बाकी रकम आप डाउन पेमेंट के रूप में देते हैं। कई नई कार के लोन 100% तक फंडिंग देते हैं।",
    "Send yourself or your child to study in India or abroad. Cover tuition, living and travel – and pay only interest while studying.": "खुद या अपने बच्चे को भारत में या विदेश में पढ़ने भेजें। ट्यूशन, रहने और यात्रा का खर्च कवर करें – और पढ़ाई के दौरान सिर्फ ब्याज चुकाएं।",
    "up to ₹1,50,00,000": "₹1,50,00,000 तक",
    "Pay only interest during your course (moratorium)": "कोर्स के दौरान सिर्फ ब्याज चुकाएं (मोरेटोरियम)",
    "15 yrs": "15 साल",
    "Admission letter / offer from the institution": "संस्थान से एडमिशन लेटर / ऑफर",
    "Share course details": "कोर्स की डिटेल्स बताएं",
    "Education Loan – common questions": "एजुकेशन लोन – आम सवाल",
    "Smaller loans are often collateral-free. Larger amounts, especially for overseas study, may require collateral or a guarantor. We'll explain the options for your case.": "छोटे लोन अक्सर कोलैटरल-फ्री होते हैं। बड़ी रकम के लिए, खासकर विदेश में पढ़ाई के लिए, कोलैटरल या गारंटर की ज़रूरत पड़ सकती है। हम आपके केस के हिसाब से सारे विकल्प समझाएंगे।",
    "Check education loan eligibility in minutes. No obligation, no impact on your credit score.": "मिनटों में एजुकेशन लोन की एलिजिबिलिटी चेक करें। कोई बाध्यता नहीं, क्रेडिट स्कोर पर कोई असर नहीं।",
    "Minimal documents": "कम से कम डॉक्यूमेंट्स",
    "Low interest, often cheaper than personal loans": "कम ब्याज, अक्सर पर्सनल लोन से भी सस्ता",
    "Indicative Gold Loan Rates": "गोल्ड लोन की सांकेतिक दरें",
    "Quick KYC at branch or doorstep": "ब्रांच या घर पर ही क्विक KYC",
    "Share the approximate weight and your funding need.": "सोने का अनुमानित वज़न और अपनी फंडिंग की ज़रूरत बताएं।",
    "The loan amount is credited to you, often the same day.": "लोन की रकम आपको क्रेडिट कर दी जाती है, अक्सर उसी दिन।",
    "Do I need to show income proof?": "क्या मुझे इनकम प्रूफ दिखाना होगा?",
    "Instant funds, against your gold": "आपके सोने के बदले, तुरंत पैसा",
    "Balance transfer available": "बैलेंस ट्रांसफर उपलब्ध",
    "Low interest rates from 8.5% p.a.": "कम ब्याज दरें, 8.5% प्रति वर्ष से शुरू",
    "Indicative Home Loan Rates": "होम लोन की सांकेतिक दरें",
    "Healthy credit score (preferably 750+)": "अच्छा क्रेडिट स्कोर (बेहतर हो तो 750+)",
    "Get your home loan in 4 simple steps": "4 आसान स्टेप्स में पाएं अपना होम लोन",
    "Submit income and property papers for verification and valuation.": "वेरिफिकेशन और वैल्यूएशन के लिए इनकम और प्रॉपर्टी के कागज़ात जमा करें।",
    "If you already have a home loan at a higher rate, you can move it to a lender offering a lower rate – reducing your EMI or tenure. We help you compare and switch.": "अगर आपका मौजूदा होम लोन ऊंची दर पर चल रहा है, तो आप उसे कम दर देने वाले लेंडर के पास ट्रांसफर कर सकते हैं – जिससे आपकी EMI या टेन्योर घट जाए। हम तुलना करने और स्विच करने में आपकी मदद करते हैं।",
    "Let's get you home": "चलिए, आपको आपके घर तक पहुंचाएं",
    "Tenure up to 15 years": "15 साल तक का टेन्योर",
    "Borrow against property you already own": "अपनी मौजूदा प्रॉपर्टी के बदले लोन लें",
    "Indicative Loan Against Property Rates": "लोन अगेंस्ट प्रॉपर्टी की सांकेतिक दरें",
    "Get your loan against property in 4 simple steps": "4 आसान स्टेप्स में पाएं लोन अगेंस्ट प्रॉपर्टी",
    "On approval, funds are disbursed to your account.": "अप्रूवल के बाद, पैसा आपके अकाउंट में डिस्बर्स कर दिया जाता है।",
    "Can I get a LAP on a commercial property?": "क्या मुझे कमर्शियल प्रॉपर्टी पर LAP मिल सकता है?",
    "Put your property to work": "अपनी प्रॉपर्टी को काम पर लगाएं",
    "Apply for Personal Loan": "पर्सनल लोन के लिए अप्लाई करें",
    "Fixed EMIs – your payment never changes": "फिक्स्ड EMI – आपकी किस्त कभी नहीं बदलती",
    "Indian resident aged 21 to 60 years": "21 से 60 साल की उम्र का भारतीय निवासी",
    "A recent passport-size photograph": "एक हालिया पासपोर्ट साइज़ फोटो",
    "Upload documents": "डॉक्यूमेंट्स अपलोड करें",
    "It depends on your income, obligations and credit history. With MyCashBridge you can borrow from ₹50,000 up to ₹40 lakh. Use the eligibility checker to see your indicative amount in 10 seconds.": "यह आपकी इनकम, मौजूदा देनदारियों और क्रेडिट हिस्ट्री पर निर्भर करता है। MyCashBridge के साथ आप ₹50,000 से ₹40 लाख तक उधार ले सकते हैं। एलिजिबिलिटी चेकर से 10 सेकंड में अपनी अनुमानित रकम देखें।",
    "No. A personal loan is unsecured, so you don't need to pledge gold, property or any collateral.": "नहीं। पर्सनल लोन अनसिक्योर्ड होता है, इसलिए आपको सोना, प्रॉपर्टी या कोई कोलैटरल गिरवी रखने की ज़रूरत नहीं।",
    "Borrowing, made human.": "उधार लेना, अब इंसानी अंदाज़ में।",
    "Transparency": "पारदर्शिता",
    "Responsible lending": "जिम्मेदार लेंडिंग",
    "AML / KYC Policy": "AML / KYC पॉलिसी",
    "Copyright & IP Notice": "कॉपीराइट और IP नोटिस",
    "Coming soon": "जल्द आ रहा है",
    "Notify me when it's live": "लाइव होने पर मुझे बताएं",
    "Cashback Cards on MyCashBridge": "MyCashBridge पर कैशबैक कार्ड्स",
    "Adjust cashback against your statement with a tap.": "एक टैप में कैशबैक को अपने स्टेटमेंट में एडजस्ट करें।",
    "This policy explains how we obtain and record your consent to communicate with you.": "यह पॉलिसी बताती है कि आपसे संपर्क करने के लिए हम आपकी सहमति कैसे लेते और रिकॉर्ड करते हैं।",
    "Push notifications": "पुश नोटिफिकेशन",
    "Have a question or want help choosing the right loan? Reach us any way you like – we usually respond within a few hours on working days.": "कोई सवाल है या सही लोन चुनने में मदद चाहिए? जिस भी तरीके से चाहें हमसे संपर्क करें – कामकाजी दिनों में हम आमतौर पर कुछ ही घंटों में जवाब देते हैं।",
    "Office": "ऑफिस",
    "How can we help?": "हम कैसे मदद कर सकते हैं?",
    "Thank you – message received.": "धन्यवाद – आपका मैसेज मिल गया।",
    "Support advertising and remarketing campaigns": "विज्ञापन और रीमार्केटिंग कैंपेन को सपोर्ट करना",
    "Analytics": "एनालिटिक्स",
    "All website content is protected by intellectual property rights.": "वेबसाइट की पूरी सामग्री बौद्धिक संपदा अधिकारों द्वारा संरक्षित है।",
    "Apply for any credit card through us — same official cards, same benefits, with a dedicated advisor to guide you every step of the way.": "हमारे ज़रिए किसी भी क्रेडिट कार्ड के लिए अप्लाई करें — वही ऑफिशियल कार्ड, वही बेनिफिट्स, और हर कदम पर गाइड करने के लिए एक डेडिकेटेड एडवाइज़र।",
    "Everyday Rewards": "एवरीडे रिवॉर्ड्स",
    "Our advisors help you pick the right card for your spending habits and get your application processed quickly — at no extra cost to you.": "हमारे एडवाइज़र आपकी खर्च करने की आदतों के हिसाब से सही कार्ड चुनने में मदद करते हैं और आपकी एप्लीकेशन जल्दी प्रोसेस करवाते हैं — आपके लिए बिना किसी अतिरिक्त लागत के।",
    "You may request deletion of your information by contacting the Company. Such requests shall be processed subject to applicable laws, compliance obligations and partner-institution requirements.": "आप कंपनी से संपर्क करके अपनी जानकारी डिलीट करने का अनुरोध कर सकते हैं। ऐसे अनुरोध लागू कानूनों, अनुपालन दायित्वों और पार्टनर-संस्थानों की आवश्यकताओं के अधीन प्रोसेस किए जाएंगे।",
    "Secure & regulated": "सिक्योर और रेगुलेटेड",
    "Easy trading": "आसान ट्रेडिंग",
    "Please read this disclaimer carefully before using the MyCashBridge website.": "MyCashBridge वेबसाइट का उपयोग करने से पहले कृपया यह डिस्क्लेमर ध्यान से पढ़ें।",
    "The Company is committed to ethical and transparent business practices.": "कंपनी नैतिक और पारदर्शी व्यावसायिक प्रथाओं के लिए प्रतिबद्ध है।",
    "Prevent harassment or coercive practices": "उत्पीड़न या ज़बरदस्ती वाले तरीकों को रोकना",
    "Service quality": "सर्विस क्वालिटी",
    "Level 1 – Customer Support": "लेवल 1 – कस्टमर सपोर्ट",
    "The Company aims to acknowledge complaints within 48 hours and resolve them within 7 to 15 business days.": "कंपनी का लक्ष्य है कि शिकायतों की पावती 48 घंटों के भीतर दी जाए और उन्हें 7 से 15 कार्य दिवसों में हल किया जाए।",
    "Health Insurance on MyCashBridge": "MyCashBridge पर हेल्थ इंश्योरेंस",
    "Grow your cover for every claim-free year.": "हर क्लेम-फ्री साल पर अपना कवर बढ़ाएं।",
    "Health, life, motor and travel cover – explained in plain language, with plans that fit your life and your budget.": "हेल्थ, लाइफ, मोटर और ट्रैवल कवर – आसान भाषा में समझाया गया, ऐसे प्लान्स के साथ जो आपकी ज़िंदगी और बजट में फिट बैठें।",
    "HEALTH": "हेल्थ",
    "Car and bike cover, fast.": "कार और बाइक का कवर, फटाफट।",
    "Invest a fixed amount monthly.": "हर महीने एक तय रकम निवेश करें।",
    "Secure your family's financial future with term and savings plans that pay out when they need it most.": "टर्म और सेविंग्स प्लान्स के साथ अपने परिवार का वित्तीय भविष्य सुरक्षित करें – जो तब पेआउट देते हैं जब उन्हें सबसे ज़्यादा ज़रूरत हो।",
    "Large life cover for a small monthly premium.": "छोटे मासिक प्रीमियम में बड़ा लाइफ कवर।",
    "Stay road-legal and protected.": "सड़क पर कानूनन वैध रहें और सुरक्षित भी।",
    "Comprehensive cover": "कॉम्प्रिहेंसिव कवर",
    "Add-ons": "ऐड-ऑन्स",
    "Direct plans, low cost": "डायरेक्ट प्लान्स, कम लागत",
    "Diversified": "डायवर्सिफाइड",
    "The Company acts as a Lending Service Provider (LSP) for various banks, NBFCs and financial institutions. We facilitate customer applications for financial products including loans, credit cards, insurance and related financial services. We are not a bank or NBFC and do not lend directly.": "कंपनी विभिन्न बैंकों, NBFCs और वित्तीय संस्थानों के लिए लेंडिंग सर्विस प्रोवाइडर (LSP) के रूप में कार्य करती है। हम लोन, क्रेडिट कार्ड, इंश्योरेंस और संबंधित वित्तीय सेवाओं सहित वित्तीय उत्पादों के लिए ग्राहकों की एप्लीकेशन की सुविधा प्रदान करते हैं। हम बैंक या NBFC नहीं हैं और सीधे लोन नहीं देते।",
    "Employment and income information": "रोज़गार और इनकम की जानकारी",
    "Processing your applications": "आपकी एप्लीकेशन प्रोसेस करना",
    "4. Sharing of information": "4. जानकारी साझा करना",
    "Regulatory authorities where legally required": "जहां कानूनन आवश्यक हो, वहां नियामक प्राधिकरण",
    "Your information is retained only for as long as necessary for business, legal, audit, fraud-prevention and regulatory purposes.": "आपकी जानकारी केवल उतने समय तक रखी जाती है जितनी व्यावसायिक, कानूनी, ऑडिट, धोखाधड़ी-रोकथाम और नियामक उद्देश्यों के लिए आवश्यक हो।",
    "Deletion of information, subject to applicable laws and business obligations": "लागू कानूनों और व्यावसायिक दायित्वों के अधीन, जानकारी को डिलीट करना",
    "Unless specifically stated otherwise, the Company does not charge customers any application fees for standard financial product applications.": "जब तक स्पष्ट रूप से अन्यथा न कहा गया हो, कंपनी स्टैंडर्ड वित्तीय उत्पादों की एप्लीकेशन के लिए ग्राहकों से कोई एप्लीकेशन फीस नहीं लेती।",
    "Welcome bonuses": "वेलकम बोनस",
    "Redeem easily": "आसानी से रिडीम करें",
    "No credit history needed": "क्रेडिट हिस्ट्री की ज़रूरत नहीं",
    "Build CIBIL": "CIBIL बनाएं",
    "Information Security Statement": "इन्फॉर्मेशन सिक्योरिटी स्टेटमेंट",
    "Periodic vulnerability assessments and penetration testing (VAPT)": "समय-समय पर वल्नरेबिलिटी असेसमेंट और पेनेट्रेशन टेस्टिंग (VAPT)",
    "Pause or change anytime": "कभी भी पॉज़ करें या बदलें",
    "Auto-invest": "ऑटो-इन्वेस्ट",
    "The Company acts solely as a facilitator, Lending Service Provider (LSP) for financial institutions and does not provide loans or financial products directly.": "कंपनी वित्तीय संस्थानों के लिए केवल एक फैसिलिटेटर, लेंडिंग सर्विस प्रोवाइडर (LSP) के रूप में कार्य करती है और सीधे लोन या वित्तीय उत्पाद प्रदान नहीं करती।",
    "Not to misuse the website": "वेबसाइट का दुरुपयोग न करना",
    "The Company shall not be liable for:": "कंपनी इनके लिए उत्तरदायी नहीं होगी:",
    "The Company reserves the right to modify these Terms at any time without prior notice. Continued use of the website constitutes acceptance of the updated Terms.": "कंपनी बिना पूर्व सूचना के किसी भी समय इन शर्तों में बदलाव करने का अधिकार सुरक्षित रखती है। वेबसाइट का निरंतर उपयोग अपडेटेड शर्तों की स्वीकृति माना जाएगा।",
    "Travel Cards on MyCashBridge": "MyCashBridge पर ट्रैवल कार्ड्स",
    "Spend abroad with minimal foreign-currency markup.": "विदेश में खर्च करें, कम से कम फॉरेन-करेंसी मार्कअप के साथ।",
    "Baggage & delay cover": "बैगेज और डिले कवर",
    "Cover for cancellations, delays and missed connections.": "कैंसिलेशन, देरी और छूटी हुई कनेक्टिंग फ्लाइट्स के लिए कवर।",
    "Compare loans, side by side": "लोन की तुलना करें, आमने-सामने",
    "Compare rates across lenders": "अलग-अलग लेंडर्स की दरें कंपेयर करें",
    "Soft check – no score impact": "सॉफ्ट चेक – स्कोर पर कोई असर नहीं",
    "We use your PAN to fetch your score securely. We never store it without consent.": "आपका स्कोर सुरक्षित रूप से लाने के लिए हम आपके PAN का इस्तेमाल करते हैं। बिना सहमति के हम इसे कभी स्टोर नहीं करते।",
    "On-time payments": "समय पर पेमेंट",
    "Healthy variety": "हेल्दी वैरायटी",
    "Use under 30%": "30% से कम इस्तेमाल करें",
    "Free – won't affect your credit score": "फ्री – आपके क्रेडिट स्कोर पर कोई असर नहीं",
    "32 years": "32 साल",
    "EMI affordability used": "इस्तेमाल की गई EMI अफोर्डेबिलिटी",
    "Income": "इनकम",
    "Job stability": "जॉब स्टेबिलिटी",
    "Principal": "मूलधन",
    "Indicative only. Your actual rate is set after assessment.": "केवल सांकेतिक। आपकी वास्तविक दर असेसमेंट के बाद तय होती है।",
    "Even a 1% lower rate can save you thousands over the loan. Compare offers before you sign.": "सिर्फ 1% कम दर भी पूरे लोन में आपके हज़ारों रुपये बचा सकती है। साइन करने से पहले ऑफर्स की तुलना करें।",
    "The loan amount you may qualify for depends on your income, employment status, repayment capacity, credit profile, and lender eligibility criteria. Simply complete our application process, and our team will help identify suitable lending options based on your financial profile and borrowing requirements.": "आपको कितनी लोन राशि मिल सकती है, यह आपकी इनकम, रोज़गार की स्थिति, चुकाने की क्षमता, क्रेडिट प्रोफाइल और लेंडर की एलिजिबिलिटी शर्तों पर निर्भर करता है। बस हमारी एप्लीकेशन प्रोसेस पूरी करें, और हमारी टीम आपकी वित्तीय प्रोफाइल और उधार की ज़रूरत के आधार पर उपयुक्त लेंडिंग विकल्प चुनने में मदद करेगी।",
    "Most applicants are required to provide basic documents such as Aadhaar Card, PAN Card, recent bank statements, income proof, and address proof. Depending on the loan type and lender requirements, additional documents may be requested to complete the verification and approval process.": "ज़्यादातर आवेदकों को आधार कार्ड, PAN कार्ड, हाल के बैंक स्टेटमेंट, इनकम प्रूफ और एड्रेस प्रूफ जैसे बेसिक डॉक्यूमेंट्स देने होते हैं। लोन के प्रकार और लेंडर की आवश्यकताओं के आधार पर, वेरिफिकेशन और अप्रूवल प्रोसेस पूरी करने के लिए अतिरिक्त डॉक्यूमेंट्स मांगे जा सकते हैं।",
    "Absolutely. Protecting your personal and financial information is a priority for us. We use secure systems and industry-standard security practices to safeguard your data. Information is only used for processing your application and shared with relevant lending partners when necessary.": "बिल्कुल। आपकी व्यक्तिगत और वित्तीय जानकारी की सुरक्षा हमारी प्राथमिकता है। आपके डेटा की सुरक्षा के लिए हम सिक्योर सिस्टम और इंडस्ट्री-स्टैंडर्ड सिक्योरिटी प्रैक्टिस का इस्तेमाल करते हैं। जानकारी का उपयोग केवल आपकी एप्लीकेशन प्रोसेस करने के लिए होता है और ज़रूरत पड़ने पर ही संबंधित लेंडिंग पार्टनर्स के साथ साझा की जाती है।",
    "What would you like to invest in?": "आप किसमें निवेश करना चाहेंगे?",
    "Estimated Eligibility": "अनुमानित एलिजिबिलिटी",
    "Secure & Encrypted": "सिक्योर और एन्क्रिप्टेड",
    "Cashback": "कैशबैक",
    "Get App": "ऐप डाउनलोड करें",
    "Step 1 of 2": "चरण 1 / 2",
    "Apply for a Business Loan": "बिज़नेस लोन के लिए अप्लाई करें",
    "6 min read": "6 मिनट में पढ़ें",
    "Travel cards": "ट्रैवल कार्ड्स",
    "What salaried employees should look for": "सैलरीड कर्मचारियों को किन बातों पर ध्यान देना चाहिए",
    "Our card marketplace is launching soon – leave your details to get early access.": "हमारा कार्ड मार्केटप्लेस जल्द लॉन्च हो रहा है – अर्ली एक्सेस पाने के लिए अपनी डिटेल्स छोड़ें।",
    "Want to know where you stand first?": "पहले जानना चाहते हैं कि आप कहाँ खड़े हैं?",
    "Most premium cards prefer a score of 750+. If you're below that, a secured card can help you build up.": "ज़्यादातर प्रीमियम कार्ड्स के लिए 750+ स्कोर बेहतर माना जाता है। अगर आपका स्कोर इससे कम है, तो सिक्योर्ड कार्ड आपको स्कोर बनाने में मदद कर सकता है।",
    "MyCashBridge.com is a Lending Service Provider (LSP). Rates and offers are indicative; final terms are decided by the lender. This article is for general information, not financial advice.": "MyCashBridge.com एक लेंडिंग सर्विस प्रोवाइडर (LSP) है। रेट्स और ऑफर्स सांकेतिक हैं; फाइनल शर्तें लेंडर तय करता है। यह लेख सामान्य जानकारी के लिए है, फाइनेंशियल सलाह नहीं।",
    "The cheapest advertised rate is not always the best deal. The right loan balances the interest rate, processing fee, tenure flexibility and how fast you get the money. Focus on the all-in cost, not just the headline rate.": "सबसे सस्ता विज्ञापित रेट हमेशा सबसे अच्छी डील नहीं होता। सही लोन वह है जिसमें ब्याज दर, प्रोसेसिंग फीस, टेन्योर की फ्लेक्सिबिलिटी और पैसा कितनी जल्दी मिलता है – इन सबका संतुलन हो। सिर्फ हेडलाइन रेट नहीं, कुल (ऑल-इन) लागत पर ध्यान दें।",
    "Prepayment terms": "प्रीपेमेंट की शर्तें",
    "A credit score of 700+ for the best rates": "बेस्ट रेट्स के लिए 700+ क्रेडिट स्कोर",
    "Latest 3 months' bank statements": "पिछले 3 महीनों के बैंक स्टेटमेंट",
    "Apply Once. Compare 128+ Lenders. Upload Documents Once. Get the Best Offer Delivered to You.": "एक बार अप्लाई करें। 128+ ऋणदाताओं की तुलना करें। दस्तावेज़ एक बार अपलोड करें। सबसे अच्छा ऑफर अपने आप पाएं।",
    "or": "या",
    "As a rule of thumb, your total EMIs (including the new loan) should stay under 40–50% of your monthly income. Use our eligibility checker for an indicative amount.": "एक सामान्य नियम के तौर पर, आपकी कुल EMI (नए लोन सहित) आपकी मासिक आय के 40–50% से कम रहनी चाहिए। सांकेतिक राशि जानने के लिए हमारा एलिजिबिलिटी चेकर इस्तेमाल करें।",
    "Types of MSME finance": "MSME फाइनेंस के प्रकार",
    "– unsecured funding up to a limit based on your turnover and credit": "– आपके टर्नओवर और क्रेडिट के आधार पर तय लिमिट तक अनसिक्योर्ड फंडिंग",
    "GST registration and a business bank account": "GST रजिस्ट्रेशन और बिज़नेस बैंक अकाउंट",
    "Business registration / GST certificate": "बिज़नेस रजिस्ट्रेशन / GST सर्टिफिकेट",
    "Separate personal and business finances": "पर्सनल और बिज़नेस फाइनेंस अलग-अलग रखें",
    "Can a new business get a loan?": "क्या नए बिज़नेस को लोन मिल सकता है?",
    "Credit Score": "क्रेडिट स्कोर",
    "Credit utilisation (~30%)": "क्रेडिट यूटिलाइज़ेशन (~30%)",
    "Habits that lift your score": "ऐसी आदतें जो आपका स्कोर बढ़ाती हैं",
    "See where you stand and get personalised tips – no impact on your score.": "जानें कि आप कहाँ खड़े हैं और पर्सनलाइज़्ड टिप्स पाएँ – आपके स्कोर पर कोई असर नहीं।",
    "Get your free CIBIL score": "अपना फ्री CIBIL स्कोर पाएँ",
    "No. Checking your own score is a 'soft' enquiry and never affects it. Only lender 'hard' enquiries can.": "नहीं। अपना स्कोर खुद चेक करना एक 'सॉफ्ट' एन्क्वायरी है और इससे स्कोर पर कभी असर नहीं पड़ता। सिर्फ लेंडर की 'हार्ड' एन्क्वायरी से असर पड़ सकता है।",
    "Ready to apply?": "अप्लाई करने के लिए तैयार हैं?",
    "CIBIL scores range from 300 to 900. Broadly: 750+ is excellent, 700–749 is good, 650–699 is fair, and below 650 is considered low. A low score signals higher risk to lenders, which can mean rejection or a higher interest rate.": "CIBIL स्कोर 300 से 900 के बीच होता है। आम तौर पर: 750+ एक्सीलेंट है, 700–749 गुड, 650–699 फेयर, और 650 से नीचे का स्कोर कम माना जाता है। कम स्कोर लेंडर्स के लिए ज़्यादा रिस्क का संकेत है, जिसका मतलब रिजेक्शन या ज़्यादा ब्याज दर हो सकता है।",
    "Smaller loan amounts": "छोटी लोन राशि",
    "Be cautious of red flags": "रेड फ्लैग्स से सावधान रहें",
    "Avoid multiple loan applications in a short span": "कम समय में कई लोन एप्लिकेशन करने से बचें",
    "is often the easiest route with a low score.": "कम स्कोर के साथ अक्सर सबसे आसान रास्ता होता है।",
    "Meaningful improvement usually takes a few months of disciplined, on-time payments and lower utilisation.": "स्कोर में सही मायने में सुधार के लिए आमतौर पर कुछ महीनों तक अनुशासित, समय पर पेमेंट और कम यूटिलाइज़ेशन की ज़रूरत होती है।",
    "24 months": "24 महीने",
    "RBI-regulated lending partners": "RBI-रेगुलेटेड लेंडिंग पार्टनर्स",
    "Accept the offer, complete a quick verification, and funds reach your bank – often within 24 hours.": "ऑफर स्वीकार करें, क्विक वेरिफिकेशन पूरा करें, और पैसा आपके बैंक में पहुँच जाता है – अक्सर 24 घंटों के भीतर।",
    "SUCCESS STORIES": "सक्सेस स्टोरीज़",
    "Rajesh Kumar": "राजेश कुमार",
    "₹8 Lakhs": "₹8 लाख",
    "Sunita Patil": "सुनीता पाटिल",
    "Applied from my phone during lunch. Got a call back within the hour and the whole thing was done on WhatsApp. Very easy.": "लंच के दौरान अपने फोन से अप्लाई किया। एक घंटे के भीतर कॉल आ गया और पूरा काम WhatsApp पर हो गया। बहुत आसान।",
    "Vishal Bora": "विशाल बोरा",
    "Up to ₹75 lakh": "₹75 लाख तक",
    "₹1 lakh to ₹75,00,000": "₹1 लाख से ₹75,00,000 तक",
    "Collateral-free working capital options": "कोलैटरल-फ्री वर्किंग कैपिटल विकल्प",
    "Indicative Business Loan Rates": "बिज़नेस लोन की सांकेतिक दरें",
    "Slide to your amount and tenure. The total payable updates instantly – what you see is what you pay, all-in.": "स्लाइडर से अपनी राशि और टेन्योर चुनें। कुल देय राशि तुरंत अपडेट होती है – जो आप देखते हैं वही आप चुकाते हैं, ऑल-इन।",
    "PAN and Aadhaar of proprietor/partners": "प्रोप्राइटर/पार्टनर्स का PAN और आधार",
    "Get a tailored offer": "अपने लिए कस्टमाइज़्ड ऑफर पाएँ",
    "Business Loan – common questions": "बिज़नेस लोन – आम सवाल",
    "Lenders look at your business vintage, turnover, bank statements, GST filings and credit history. A healthy, steady cash flow improves your offer.": "लेंडर्स आपके बिज़नेस की उम्र (विंटेज), टर्नओवर, बैंक स्टेटमेंट, GST फाइलिंग और क्रेडिट हिस्ट्री देखते हैं। हेल्दी और स्थिर कैश फ्लो से आपका ऑफर बेहतर होता है।",
    "Check how much working capital you qualify for – in 10 seconds, with no obligation.": "जानें कि आप कितनी वर्किंग कैपिटल के लिए योग्य हैं – सिर्फ 10 सेकंड में, बिना किसी बाध्यता के।",
    "Tenure up to 7 years": "7 साल तक का टेन्योर",
    "Loans for new and pre-owned cars": "नई और प्री-ओन्ड कारों के लिए लोन",
    "Up to 1%": "1% तक",
    "Good credit history improves your rate": "अच्छी क्रेडिट हिस्ट्री से आपका रेट बेहतर होता है",
    "Get your car loan in 4 simple steps": "4 आसान स्टेप्स में पाएँ अपना कार लोन",
    "Submit KYC and income documents online for quick approval.": "क्विक अप्रूवल के लिए KYC और इनकम डॉक्यूमेंट्स ऑनलाइन सबमिट करें।",
    "How much of the car's price is funded?": "कार की कीमत का कितना हिस्सा फंड किया जाता है?",
    "How quickly is the loan approved?": "लोन कितनी जल्दी अप्रूव होता है?",
    "Studies in India & abroad": "भारत और विदेश में पढ़ाई",
    "up to 15 yrs": "15 साल तक",
    "Funding for India and overseas study": "भारत और विदेश में पढ़ाई के लिए फंडिंग",
    "Indian resident student with a confirmed admission": "कन्फर्म एडमिशन वाला भारतीय निवासी छात्र",
    "PAN, Aadhaar of student and co-applicant": "छात्र और को-एप्लिकेंट का PAN, आधार",
    "Tell us the course, country and amount needed.": "हमें कोर्स, देश और ज़रूरी राशि बताएँ।",
    "Does the loan cover overseas education?": "क्या लोन विदेश में पढ़ाई को कवर करता है?",
    "Are there tax benefits?": "क्या टैक्स बेनिफिट्स मिलते हैं?",
    "Unlock the value of your gold.": "अपने सोने की वैल्यू अनलॉक करें।",
    "Apply for Gold Loan": "गोल्ड लोन के लिए अप्लाई करें",
    "Funds disbursed quickly, sometimes same day": "फंड जल्दी डिस्बर्स होता है, कभी-कभी उसी दिन",
    "3 yrs": "3 साल",
    "PAN or Form 60": "PAN या फॉर्म 60",
    "Get a quote": "कोटेशन पाएँ",
    "Gold Loan – common questions": "गोल्ड लोन – आम सवाल",
    "Usually not. Because the loan is secured by gold, most lenders don't require income documents – making it accessible to almost everyone.": "आमतौर पर नहीं। चूँकि लोन सोने से सिक्योर्ड होता है, ज़्यादातर लेंडर्स इनकम डॉक्यूमेंट्स नहीं माँगते – जिससे यह लगभग हर किसी के लिए सुलभ है।",
    "Check your gold loan value in minutes. Safe, insured, and no income proof needed.": "मिनटों में अपने गोल्ड लोन की वैल्यू चेक करें। सुरक्षित, इंश्योर्ड, और इनकम प्रूफ की ज़रूरत नहीं।",
    "Apply for Home Loan": "होम लोन के लिए अप्लाई करें",
    "Long tenures up to 30 years for smaller EMIs": "छोटी EMI के लिए 30 साल तक का लंबा टेन्योर",
    "Up to 0.50%": "0.50% तक",
    "Co-applicant can boost your eligibility": "को-एप्लिकेंट से आपकी एलिजिबिलिटी बढ़ सकती है",
    "Share your requirement": "अपनी ज़रूरत बताएँ",
    "On approval, the loan is sanctioned and disbursed as per your agreement.": "अप्रूवल के बाद, लोन आपके एग्रीमेंट के अनुसार सैंक्शन और डिस्बर्स किया जाता है।",
    "Yes. You can claim deductions on principal (Section 80C) and interest (Section 24b) as per current income-tax rules. Please consult a tax advisor for your situation.": "हाँ। मौजूदा इनकम-टैक्स नियमों के अनुसार आप प्रिंसिपल (सेक्शन 80C) और ब्याज (सेक्शन 24b) पर डिडक्शन क्लेम कर सकते हैं। अपनी स्थिति के लिए कृपया टैक्स सलाहकार से सलाह लें।",
    "Check your home loan eligibility and EMI in minutes. No obligation, no impact on your credit score.": "मिनटों में अपनी होम लोन एलिजिबिलिटी और EMI चेक करें। कोई बाध्यता नहीं, आपके क्रेडिट स्कोर पर कोई असर नहीं।",
    "Residential or commercial": "रेज़िडेंशियल या कमर्शियल",
    "Lower interest than an unsecured loan": "अनसिक्योर्ड लोन से कम ब्याज",
    "Own a residential or commercial property": "रेज़िडेंशियल या कमर्शियल प्रॉपर्टी के मालिक हों",
    "Share property & need": "प्रॉपर्टी और ज़रूरत बताएँ",
    "Loan Against Property – common questions": "लोन अगेंस्ट प्रॉपर्टी – आम सवाल",
    "Yes. Both residential and commercial properties are generally accepted, subject to clear title and valuation.": "हाँ। रेज़िडेंशियल और कमर्शियल दोनों प्रॉपर्टी आम तौर पर स्वीकार की जाती हैं, बशर्ते टाइटल क्लियर हो और वैल्यूएशन सही हो।",
    "See how much you can raise against your property – in minutes, with no obligation.": "जानें कि आप अपनी प्रॉपर्टी पर कितनी राशि जुटा सकते हैं – मिनटों में, बिना किसी बाध्यता के।",
    "₹50,000 to ₹40,00,000": "₹50,000 से ₹40,00,000 तक",
    "Use it for any personal need": "किसी भी पर्सनल ज़रूरत के लिए इस्तेमाल करें",
    "Minimum monthly income of ₹15,000 (varies by city)": "न्यूनतम मासिक आय ₹15,000 (शहर के अनुसार अलग-अलग)",
    "Proof of current address": "वर्तमान पते का प्रमाण",
    "Complete a quick paperless KYC and verification from your phone.": "अपने फोन से क्विक पेपरलेस KYC और वेरिफिकेशन पूरा करें।",
    "Will checking my rate affect my credit score?": "क्या अपना रेट चेक करने से मेरे क्रेडिट स्कोर पर असर पड़ेगा?",
    "Can I prepay or foreclose my loan?": "क्या मैं अपना लोन प्रीपे या फोरक्लोज़ कर सकता हूँ?",
    "MyCashBridge is a money lending service provider built for everyday India. We saw too many people confused by fine print, hidden charges and pushy sales. So we built a simpler way – clear language, fair rates, and a total you can see before you sign.": "MyCashBridge एक मनी लेंडिंग सर्विस प्रोवाइडर है, जो आम भारतीयों के लिए बनाया गया है। हमने देखा कि बहुत से लोग फाइन प्रिंट, छिपे चार्जेस और दबाव डालने वाली सेल्स से परेशान हैं। इसलिए हमने एक आसान तरीका बनाया – साफ भाषा, फेयर रेट्स, और साइन करने से पहले दिखने वाला पूरा हिसाब।",
    "No hidden charges, ever. You see every number before you commit.": "कोई छिपा चार्ज नहीं, कभी नहीं। कमिट करने से पहले आप हर नंबर देखते हैं।",
    "We help you borrow what you can comfortably repay – never more.": "हम आपको उतना ही उधार लेने में मदद करते हैं जितना आप आराम से चुका सकें – उससे ज़्यादा कभी नहीं।",
    "Legal & compliance": "लीगल और कंप्लायंस",
    "To comply with applicable laws and partner-institution requirements, we follow Anti-Money-Laundering (AML) and Know-Your-Customer (KYC) practices.": "लागू कानूनों और पार्टनर संस्थानों की आवश्यकताओं का पालन करने के लिए, हम एंटी-मनी-लॉन्ड्रिंग (AML) और नो-योर-कस्टमर (KYC) प्रैक्टिसेज़ का पालन करते हैं।",
    "Cashback on every spend.": "हर खर्च पर कैशबैक।",
    "Explore loans meanwhile": "तब तक लोन एक्सप्लोर करें",
    "Everyday cashback": "रोज़मर्रा का कैशबैक",
    "No hidden fees": "कोई छिपी फीस नहीं",
    "By submitting information on this website, you expressly consent to receive communication from the Company and its partner banks/NBFCs through:": "इस वेबसाइट पर जानकारी सबमिट करके, आप कंपनी और इसके पार्टनर बैंकों/NBFC से इन माध्यमों से संपर्क प्राप्त करने की स्पष्ट सहमति देते हैं:",
    "You authorise the Company to share submitted information with partner financial institutions for evaluation and processing purposes.": "आप कंपनी को अधिकृत करते हैं कि वह सबमिट की गई जानकारी मूल्यांकन और प्रोसेसिंग के उद्देश्य से पार्टनर वित्तीय संस्थानों के साथ साझा करे।",
    "Call us": "हमें कॉल करें",
    "750, Udyog Vihar Phase 5, Sector 19,": "750, उद्योग विहार फेज़ 5, सेक्टर 19,",
    "Select a topic": "विषय चुनें",
    "Our team will get back to you within a few hours on working days. For anything urgent, please call us.": "हमारी टीम कार्यदिवसों पर कुछ ही घंटों में आपसे संपर्क करेगी। किसी भी अर्जेंट ज़रूरत के लिए, कृपया हमें कॉल करें।",
    "Enhance customer experience": "कस्टमर एक्सपीरियंस को बेहतर बनाना",
    "and": "और",
    "All website content including text, graphics, logos, calculators, software and designs are the intellectual property of the Company unless otherwise stated.": "वेबसाइट की सभी सामग्री – जिसमें टेक्स्ट, ग्राफिक्स, लोगो, कैलकुलेटर, सॉफ्टवेयर और डिज़ाइन शामिल हैं – कंपनी की बौद्धिक संपदा है, जब तक अन्यथा न कहा गया हो।",
    "Apply for a Card": "कार्ड के लिए अप्लाई करें",
    "Premium": "प्रीमियम",
    "Apply via MyCashBridge": "MyCashBridge के ज़रिए अप्लाई करें",
    "Certain information may continue to be retained where legally required.": "कानूनी रूप से आवश्यक होने पर कुछ जानकारी आगे भी सुरक्षित रखी जा सकती है।",
    "Demat Account on MyCashBridge": "MyCashBridge पर डीमैट अकाउंट",
    "Buy and sell with a clean, simple interface.": "क्लीन, सिंपल इंटरफेस से खरीदें और बेचें।",
    "The Company is a Lending Service Provider (LSP) and is not a bank, NBFC or financial institution.": "कंपनी एक लेंडिंग सर्विस प्रोवाइडर (LSP) है और कोई बैंक, NBFC या वित्तीय संस्थान नहीं है।",
    "The Company aims to:": "कंपनी का उद्देश्य है:",
    "Maintain fair customer treatment": "ग्राहकों के साथ निष्पक्ष व्यवहार बनाए रखना",
    "Communication practices": "कम्युनिकेशन प्रैक्टिसेज़",
    "Email:": "ईमेल:",
    "Health cover without the worry.": "बिना चिंता के हेल्थ कवर।",
    "Cashless claims": "कैशलेस क्लेम्स",
    "Tax savings": "टैक्स बचत",
    "Notify me & explore loans": "मुझे नोटिफाई करें और लोन एक्सप्लोर करें",
    "Cover hospital bills for your family.": "अपने परिवार के हॉस्पिटल बिल कवर करें।",
    "TRAVEL": "ट्रैवल",
    "MUTUAL FUNDS": "म्यूचुअल फंड्स",
    "High cover, low premium": "हाई कवर, कम प्रीमियम",
    "Savings plans": "सेविंग्स प्लान्स",
    "Quick car and two-wheeler insurance with comprehensive and third-party options, plus speedy claims.": "कॉम्प्रिहेंसिव और थर्ड-पार्टी विकल्पों के साथ क्विक कार और टू-व्हीलर इंश्योरेंस, साथ ही तेज़ क्लेम सेटलमेंट।",
    "Protect against damage, theft and third-party liability.": "डैमेज, चोरी और थर्ड-पार्टी लायबिलिटी से सुरक्षा पाएँ।",
    "Zero-dep, engine and roadside-assistance covers.": "ज़ीरो-डेप, इंजन और रोडसाइड-असिस्टेंस कवर।",
    "Mutual Funds on MyCashBridge": "MyCashBridge पर म्यूचुअल फंड्स",
    "Spread risk across equity, debt and hybrid.": "इक्विटी, डेट और हाइब्रिड में रिस्क बाँटें।",
    "2. Information we collect": "2. हम कौन-सी जानकारी इकट्ठा करते हैं",
    "Banking and financial information voluntarily submitted by you": "आपके द्वारा स्वेच्छा से सबमिट की गई बैंकिंग और वित्तीय जानकारी",
    "Sharing applications with partner banks/NBFCs": "पार्टनर बैंकों/NBFC के साथ एप्लिकेशन साझा करना",
    "Your data may be shared with:": "आपका डेटा इनके साथ साझा किया जा सकता है:",
    "5. Your consent": "5. आपकी सहमति",
    "8. Your rights": "8. आपके अधिकार",
    "9. Contact": "9. संपर्क",
    "Where any value-added paid service is offered, applicable refund terms shall be communicated separately at the time of purchase.": "जहाँ कोई वैल्यू-एडेड पेड सर्विस दी जाती है, वहाँ लागू रिफंड शर्तें खरीद के समय अलग से बताई जाएँगी।",
    "Rewards Cards on MyCashBridge": "MyCashBridge पर रिवॉर्ड्स कार्ड्स",
    "Convert points to vouchers, products or statement credit.": "पॉइंट्स को वाउचर, प्रोडक्ट्स या स्टेटमेंट क्रेडिट में बदलें।",
    "Backed by a fixed deposit": "फिक्स्ड डिपॉज़िट से बैक्ड",
    "On-time use reports to bureaus and lifts your score.": "समय पर इस्तेमाल की रिपोर्ट क्रेडिट ब्यूरो तक जाती है और आपका स्कोर बढ़ता है।",
    "MyCashBridge follows industry-standard security and compliance practices designed to protect customer information and financial data at every touchpoint.": "MyCashBridge इंडस्ट्री-स्टैंडर्ड सिक्योरिटी और कंप्लायंस प्रैक्टिसेज़ का पालन करता है, जो हर टचपॉइंट पर ग्राहक जानकारी और वित्तीय डेटा की सुरक्षा के लिए डिज़ाइन की गई हैं।",
    "Employee confidentiality obligations and security training": "कर्मचारियों के लिए गोपनीयता दायित्व और सिक्योरिटी ट्रेनिंग",
    "Information Security Management – systematic protection of sensitive company and customer data.": "इन्फॉर्मेशन सिक्योरिटी मैनेजमेंट – संवेदनशील कंपनी और ग्राहक डेटा की व्यवस्थित सुरक्षा।",
    "Vulnerability Assessment & Penetration Testing – regular ethical hacking to identify and remediate security gaps.": "वल्नरेबिलिटी असेसमेंट और पेनेट्रेशन टेस्टिंग – सिक्योरिटी गैप्स की पहचान और सुधार के लिए नियमित एथिकल हैकिंग।",
    "Payment Card Industry Data Security Standard – ensures safe handling of cardholder data and payment information.": "पेमेंट कार्ड इंडस्ट्री डेटा सिक्योरिटी स्टैंडर्ड – कार्डहोल्डर डेटा और पेमेंट जानकारी की सुरक्षित हैंडलिंग सुनिश्चित करता है।",
    "SIP on MyCashBridge": "MyCashBridge पर SIP",
    "Set it once and invest automatically every month.": "एक बार सेट करें और हर महीने ऑटोमैटिकली निवेश करें।",
    "2. No guarantee of approval": "2. अप्रूवल की कोई गारंटी नहीं",
    "Not to submit fraudulent or forged documents": "धोखाधड़ी वाले या जाली दस्तावेज़ सबमिट न करना",
    "Rejection of applications": "एप्लिकेशन का रिजेक्शन",
    "Travel further for less.": "कम खर्च में और दूर तक घूमें।",
    "Air miles": "एयर माइल्स",
    "Travel insurance": "ट्रैवल इंश्योरेंस",
    "Single & multi-trip plans": "सिंगल और मल्टी-ट्रिप प्लान्स",
    "Baggage cover": "बैगेज कवर",
    "See how our loan types stack up on rates, amounts and tenure – then check live partner rates for the one that fits. All rates are indicative; your final offer depends on your profile.": "देखें कि हमारे लोन टाइप्स रेट्स, राशि और टेन्योर के मामले में कैसे हैं – फिर जो आपके लिए फिट हो, उसके लाइव पार्टनर रेट्स चेक करें। सभी रेट्स सांकेतिक हैं; आपका फाइनल ऑफर आपकी प्रोफाइल पर निर्भर करता है।",
    "Pick a loan type to see indicative rates, fees and tenure across our lending partners.": "हमारे लेंडिंग पार्टनर्स के सांकेतिक रेट्स, फीस और टेन्योर देखने के लिए एक लोन टाइप चुनें।",
    "Personalised improvement tips": "पर्सनलाइज़्ड सुधार टिप्स",
    "Full name (as on PAN)": "पूरा नाम (PAN के अनुसार)",
    "Strong": "मज़बूत",
    "See loans I qualify for": "देखें कि मैं किन लोन के लिए योग्य हूँ",
    "Keep your credit-card spends below 30% of your limit to look financially healthy.": "फाइनेंशियली हेल्दी दिखने के लिए अपने क्रेडिट-कार्ड खर्च को लिमिट के 30% से नीचे रखें।",
    "How much can you borrow?": "आप कितना उधार ले सकते हैं?",
    "You could be eligible for up to": "आप इस राशि तक के लिए एलिजिबल हो सकते हैं",
    "50% of income": "आय का 50%",
    "Higher, stable income increases how much you can comfortably repay.": "ज़्यादा और स्थिर आय से वह राशि बढ़ती है जो आप आराम से चुका सकते हैं।",
    "Longer tenure with an employer or business builds lender confidence.": "एक ही एम्प्लॉयर या बिज़नेस के साथ लंबा समय लेंडर का भरोसा बढ़ाता है।",
    "Interest": "ब्याज",
    "Good to know": "जानने लायक बातें",
    "Tenure trade-off": "टेन्योर का ट्रेड-ऑफ",
    "Will checking my eligibility with MyCashBridge affect my CIBIL score?": "क्या MyCashBridge पर अपनी एलिजिबिलिटी चेक करने से मेरे CIBIL स्कोर पर असर पड़ेगा?",
    "Can MyCashBridge help if my CIBIL score is low?": "अगर मेरा CIBIL स्कोर कम है तो क्या MyCashBridge मदद कर सकता है?",
    "Why do borrowers choose MyCashBridge?": "बॉरोअर्स MyCashBridge को क्यों चुनते हैं?",
    "Tell us about yourself": "हमें अपने बारे में बताएँ",
    "Indicative Rate": "सांकेतिक रेट",
    "Data Protected": "डेटा सुरक्षित",
    "Travel": "ट्रैवल",
    "PAN Number": "PAN नंबर",
    "Step 1 of 3": "चरण 1 / 3",
    "Apply for a Home Loan": "होम लोन के लिए अप्लाई करें",
    "Updated June 2026": "जून 2026 में अपडेट किया गया",
    "– best for frequent flyers wanting miles and lounge access": "– माइल्स और लाउंज एक्सेस चाहने वाले फ्रीक्वेंट फ्लायर्स के लिए सबसे बेहतर",
    "A joining and annual fee you can easily offset with rewards": "जॉइनिंग और एनुअल फीस जिसे आप रिवॉर्ड्स से आसानी से वसूल कर सकते हैं",
    "Use your card to build credit": "क्रेडिट बनाने के लिए अपने कार्ड का इस्तेमाल करें",
    "Check your CIBIL score free": "अपना CIBIL स्कोर फ्री में चेक करें",
    "How many credit cards should a salaried person have?": "एक सैलरीड व्यक्ति के पास कितने क्रेडिट कार्ड होने चाहिए?",
    "Personal Loans": "पर्सनल लोन",
    "– currently from around 10.5% p.a. for strong profiles": "– मजबूत प्रोफाइल के लिए फिलहाल लगभग 10.5% सालाना से शुरू",
    "– look for low or nil foreclosure charges": "– कम या शून्य फोरक्लोज़र चार्ज वाले विकल्प देखें",
    "Stable employment or business history": "स्थिर नौकरी या बिज़नेस हिस्ट्री",
    "Salary slips (salaried) or ITR (self-employed)": "सैलरी स्लिप (सैलरीड) या ITR (सेल्फ-एम्प्लॉयड)",
    "Choose a tenure you can comfortably afford": "ऐसा टेन्योर चुनें जिसे आप आराम से अफोर्ड कर सकें",
    "check your eligibility": "अपनी एलिजिबिलिटी चेक करें",
    "Does checking my rate affect my credit score?": "क्या रेट चेक करने से मेरे क्रेडिट स्कोर पर असर पड़ता है?",
    "Working capital loans": "वर्किंग कैपिटल लोन",
    "Loan against property": "लोन अगेंस्ट प्रॉपर्टी",
    "Acceptable credit history of the business and promoters": "बिज़नेस और प्रमोटर्स की स्वीकार्य क्रेडिट हिस्ट्री",
    "Last 6–12 months' bank statements": "पिछले 6–12 महीनों के बैंक स्टेटमेंट",
    "Keep your and your business's credit healthy": "अपना और अपने बिज़नेस का क्रेडिट हेल्दी रखें",
    "Most lenders want 1–2 years of vintage. Newer businesses may need collateral or a strong personal credit profile.": "ज़्यादातर लेंडर 1–2 साल का बिज़नेस विंटेज चाहते हैं। नए बिज़नेस को कोलैटरल या मजबूत पर्सनल क्रेडिट प्रोफाइल की ज़रूरत पड़ सकती है।",
    "How to Improve Your Credit Score in India: A Simple 2026 Guide": "भारत में अपना क्रेडिट स्कोर कैसे सुधारें: एक आसान 2026 गाइड",
    "– how much of your credit limit you use": "– आप अपनी क्रेडिट लिमिट का कितना हिस्सा इस्तेमाल करते हैं",
    "Never miss a due date – set auto-pay or reminders": "कभी भी ड्यू डेट न चूकें – ऑटो-पे या रिमाइंडर सेट करें",
    "How long does it take?": "इसमें कितना समय लगता है?",
    ". If your score is currently low, read our guide on": "। अगर आपका स्कोर अभी कम है, तो इस विषय पर हमारी गाइड पढ़ें",
    "How often is my score updated?": "मेरा स्कोर कितनी बार अपडेट होता है?",
    "Put what you've learned to work": "जो सीखा है, उसे अमल में लाएँ",
    "Options if your score is low": "अगर आपका स्कोर कम है तो विकल्प",
    "– asking for less improves your odds": "– कम राशि माँगने से अप्रूवल की संभावना बढ़ती है",
    "If a low score has you worried, never fall for anyone promising a 'guaranteed loan' for an upfront fee. MyCashBridge.com never charges customers a fee to apply, and no genuine lender guarantees approval before assessment.": "अगर कम स्कोर आपको परेशान कर रहा है, तो अपफ्रंट फीस लेकर 'गारंटीड लोन' का वादा करने वाले किसी के झाँसे में कभी न आएँ। MyCashBridge.com अप्लाई करने के लिए ग्राहकों से कभी कोई फीस नहीं लेता, और कोई भी असली लेंडर असेसमेंट से पहले अप्रूवल की गारंटी नहीं देता।",
    "Start by": "शुरुआत करें",
    "Can I get a personal loan with a 600 CIBIL score?": "क्या मुझे 600 CIBIL स्कोर पर पर्सनल लोन मिल सकता है?",
    "– all-in": "– ऑल-इन",
    "256-bit secure": "256-बिट सिक्योर",
    "We built MyCashBridge for everyday India – clear language, fair rates, and real human help when you need it.": "हमने MyCashBridge को आम भारत के लिए बनाया है – साफ भाषा, फेयर रेट, और ज़रूरत पड़ने पर असली इंसानी मदद।",
    "40,000+ Happy": "40,000+ खुश",
    "Chennai · Debt Consolidation": "चेन्नई · डेट कंसोलिडेशन",
    "As a self-employed professional, I always struggled with loan approvals. MyCashBridge's credit analysis helped me understand my profile and I got approved within 3 days.": "एक सेल्फ-एम्प्लॉयड प्रोफेशनल होने के नाते, लोन अप्रूवल में मुझे हमेशा दिक्कत होती थी। MyCashBridge के क्रेडिट एनालिसिस से मुझे अपनी प्रोफाइल समझने में मदद मिली और 3 दिनों के अंदर मेरा लोन अप्रूव हो गया।",
    "Nashik · Education Loan": "नासिक · एजुकेशन लोन",
    "Anjali Kapoor": "अंजलि कपूर",
    "in": "में",
    "Minimal documentation": "मिनिमल डॉक्यूमेंटेशन",
    "per annum onwards": "सालाना से शुरू",
    "Repayment that flexes with your cash flow": "ऐसा रीपेमेंट जो आपके कैश फ्लो के हिसाब से फ्लेक्सिबल हो",
    "Indicative only – your final rate depends on your profile, income and credit history. Final terms are set by the lender.": "केवल सांकेतिक – आपका फाइनल रेट आपकी प्रोफाइल, इनकम और क्रेडिट हिस्ट्री पर निर्भर करता है। अंतिम शर्तें लेंडर द्वारा तय की जाती हैं।",
    "Total": "कुल",
    "Last 6–12 months' business bank statements": "पिछले 6–12 महीनों के बिज़नेस बैंक स्टेटमेंट",
    "An expert reviews your profile and calls with a clear, no-jargon offer.": "एक एक्सपर्ट आपकी प्रोफाइल रिव्यू करता है और साफ, बिना जार्गन वाले ऑफर के साथ कॉल करता है।",
    "Do I need collateral for a business loan?": "क्या बिज़नेस लोन के लिए मुझे कोलैटरल की ज़रूरत है?",
    "Can new businesses apply?": "क्या नए बिज़नेस अप्लाई कर सकते हैं?",
    "Drive home the car you love.": "अपनी पसंदीदा कार घर ले आएँ।",
    "Apply for Car Loan": "कार लोन के लिए अप्लाई करें",
    "Quick approvals, minimal paperwork": "क्विक अप्रूवल, कम से कम पेपरवर्क",
    "7 yrs": "7 साल",
    "PAN, Aadhaar and address proof": "PAN, आधार और एड्रेस प्रूफ",
    "Pick your car": "अपनी कार चुनें",
    "Disbursal": "डिस्बर्सल",
    "For new cars, up to 100% of the on-road price with some lenders. For used cars, funding is based on the car's assessed value.": "नई कारों के लिए, कुछ लेंडर्स के साथ ऑन-रोड कीमत का 100% तक। यूज़्ड कारों के लिए, फंडिंग कार की आँकी गई वैल्यू पर आधारित होती है।",
    "With complete documents and a good profile, approval can be same-day, with payment made directly to the dealer.": "पूरे डॉक्यूमेंट्स और अच्छी प्रोफाइल के साथ, अप्रूवल उसी दिन मिल सकता है, और पेमेंट सीधे डीलर को किया जाता है।",
    "Up to ₹1.5 crore": "₹1.5 करोड़ तक",
    "after course": "कोर्स के बाद",
    "Tax deduction on interest under Section 80E": "सेक्शन 80E के तहत ब्याज पर टैक्स डिडक्शन",
    "Co-applicant (parent/guardian) usually required": "को-एप्लिकेंट (माता-पिता/अभिभावक) आमतौर पर ज़रूरी",
    "Course fee structure and schedule": "कोर्स की फीस स्ट्रक्चर और शेड्यूल",
    "An expert calls with the loan amount, rate and moratorium terms.": "एक एक्सपर्ट लोन अमाउंट, रेट और मोरेटोरियम शर्तों के साथ कॉल करता है।",
    "Yes. Education loans cover recognised courses both in India and abroad, including tuition, living expenses, travel and study equipment.": "हाँ। एजुकेशन लोन भारत और विदेश दोनों जगह मान्यता प्राप्त कोर्स कवर करते हैं, जिनमें ट्यूशन, रहने का खर्च, यात्रा और स्टडी इक्विपमेंट शामिल हैं।",
    "Yes. Interest paid on an education loan is deductible under Section 80E for up to 8 years. Consult a tax advisor for specifics.": "हाँ। एजुकेशन लोन पर चुकाया गया ब्याज सेक्शन 80E के तहत 8 साल तक डिडक्टिबल है। विशेष जानकारी के लिए टैक्स एडवाइज़र से सलाह लें।",
    "Turn idle gold jewellery into instant funds at a low rate – with fully insured safekeeping and your ornaments returned on repayment.": "बेकार पड़ी सोने की ज्वेलरी को कम रेट पर तुरंत फंड में बदलें – पूरी तरह इंश्योर्ड सेफकीपिंग के साथ, और रीपेमेंट पर आपके गहने वापस।",
    "₹10,000 to ₹50,00,000": "₹10,000 से ₹50,00,000 तक",
    "Your gold is insured and safely stored": "आपका सोना इंश्योर्ड और सुरक्षित रूप से स्टोर किया जाता है",
    "Indian resident aged 18 years and above": "18 साल या उससे अधिक उम्र का भारतीय निवासी",
    "Aadhaar / valid address proof": "आधार / वैध एड्रेस प्रूफ",
    "An expert explains the rate, loan value and repayment options.": "एक एक्सपर्ट रेट, लोन वैल्यू और रीपेमेंट विकल्प समझाता है।",
    "How is the loan amount on gold decided?": "गोल्ड पर लोन अमाउंट कैसे तय होता है?",
    "What are my repayment options?": "मेरे रीपेमेंट विकल्प क्या हैं?",
    "The keys to your own home.": "आपके अपने घर की चाबियाँ।",
    "up to ₹5,00,00,000": "₹5,00,00,000 तक",
    "Funding up to 90% of property value": "प्रॉपर्टी वैल्यू के 90% तक फंडिंग",
    "30 yrs": "30 साल",
    "Income proof: salary slips / ITR & financials": "इनकम प्रूफ: सैलरी स्लिप / ITR और फाइनेंशियल्स",
    "Tell us the property and loan amount you have in mind.": "हमें बताएँ कि आपके मन में कौन-सी प्रॉपर्टी और कितना लोन अमाउंट है।",
    "Home Loan – common questions": "होम लोन – आम सवाल",
    "Can I add a co-applicant?": "क्या मैं को-एप्लिकेंट जोड़ सकता हूँ?",
    "Your property's value, in your hands.": "आपकी प्रॉपर्टी की वैल्यू, आपके हाथों में।",
    "Apply for Loan Against Property": "लोन अगेंस्ट प्रॉपर्टी के लिए अप्लाई करें",
    "High loan-to-value, large ticket sizes": "हाई लोन-टू-वैल्यू, बड़े टिकट साइज़",
    "Clear and marketable property title": "साफ और मार्केटेबल प्रॉपर्टी टाइटल",
    "Tell us about your property and how much you'd like to raise.": "हमें अपनी प्रॉपर्टी के बारे में बताएँ और यह भी कि आप कितनी राशि जुटाना चाहते हैं।",
    "What is a loan against property?": "लोन अगेंस्ट प्रॉपर्टी क्या है?",
    "What can the funds be used for?": "फंड का इस्तेमाल किसके लिए किया जा सकता है?",
    "A personal loan for every plan.": "हर प्लान के लिए एक पर्सनल लोन।",
    "6–72 mo": "6–72 महीने",
    "Prepay or foreclose anytime": "कभी भी प्रीपे या फोरक्लोज़ करें",
    "A working mobile number and PAN": "एक चालू मोबाइल नंबर और PAN",
    "Get your personal loan in 4 simple steps": "4 आसान स्टेप्स में पाएँ अपना पर्सनल लोन",
    "Money in your account": "पैसा आपके अकाउंट में",
    "No. The initial check is a 'soft' enquiry and does not impact your credit score. A 'hard' enquiry only happens once you choose to formally proceed with a lender.": "नहीं। शुरुआती चेक एक 'सॉफ्ट' इंक्वायरी है और इससे आपके क्रेडिट स्कोर पर कोई असर नहीं पड़ता। 'हार्ड' इंक्वायरी तभी होती है जब आप किसी लेंडर के साथ औपचारिक रूप से आगे बढ़ने का फैसला करते हैं।",
    "Yes. Most of our partners allow prepayment and foreclosure. Charges, if any, vary by lender and are shown clearly before you sign.": "हाँ। हमारे ज़्यादातर पार्टनर प्रीपेमेंट और फोरक्लोज़र की अनुमति देते हैं। चार्ज, अगर कोई हों, लेंडर के हिसाब से अलग-अलग होते हैं और साइन करने से पहले साफ-साफ दिखाए जाते हैं।",
    "Contact us": "हमसे संपर्क करें",
    "Plain language": "आसान भाषा",
    "Company details": "कंपनी की जानकारी",
    "Last updated: June 2026 – MyCashBridge – Lending Service Provider (LSP)": "आखिरी अपडेट: जून 2026 – MyCashBridge – लेंडिंग सर्विस प्रोवाइडर (LSP)",
    "You may be required to submit identity and address verification documents.": "आपसे पहचान और एड्रेस वेरिफिकेशन डॉक्यूमेंट जमा करने के लिए कहा जा सकता है।",
    "Earn real money back on groceries, fuel, bills and online shopping. We'll help you find the card that pays you the most for how you actually spend.": "ग्रॉसरी, फ्यूल, बिल और ऑनलाइन शॉपिंग पर असली कैशबैक कमाएँ। हम आपको वह कार्ड ढूँढने में मदद करेंगे जो आपके असल खर्च के हिसाब से सबसे ज़्यादा रिटर्न देता है।",
    "Launching soon on MyCashBridge": "MyCashBridge पर जल्द लॉन्च हो रहा है",
    "Earn on groceries, fuel and utility bills automatically.": "ग्रॉसरी, फ्यूल और यूटिलिटी बिल पर अपने आप कमाएँ।",
    "Clear fee and reward terms before you apply.": "अप्लाई करने से पहले फीस और रिवॉर्ड की साफ शर्तें।",
    "Phone calls": "फोन कॉल",
    "The Company may maintain consent records including timestamps, IP logs, communication preferences and verification details for audit and compliance purposes.": "कंपनी ऑडिट और कंप्लायंस उद्देश्यों के लिए सहमति रिकॉर्ड रख सकती है, जिनमें टाइमस्टैम्प, IP लॉग, कम्युनिकेशन प्रेफरेंस और वेरिफिकेशन डिटेल्स शामिल हैं।",
    "– Mon–Sat, 9am–7pm": "– सोम–शनि, सुबह 9 बजे–शाम 7 बजे",
    "Gurugram, Haryana 122016": "गुरुग्राम, हरियाणा 122016",
    "Other loan": "अन्य लोन",
    "This Cookie Policy explains how MyCashBridge uses cookies and similar technologies, and how you can control them.": "यह कुकी पॉलिसी बताती है कि MyCashBridge कुकीज़ और इसी तरह की तकनीकों का इस्तेमाल कैसे करता है, और आप उन्हें कैसे कंट्रोल कर सकते हैं।",
    "Managing your cookies": "अपनी कुकीज़ मैनेज करना",
    "marketing": "मार्केटिंग",
    "Unauthorised copying, reproduction, distribution or modification is prohibited without prior written permission.": "पूर्व लिखित अनुमति के बिना अनधिकृत कॉपी, पुनरुत्पादन, वितरण या संशोधन प्रतिबंधित है।",
    "Check Eligibility": "एलिजिबिलिटी चेक करें",
    "Digital & UPI": "डिजिटल और UPI",
    "Call an advisor": "एडवाइज़र को कॉल करें",
    "Your investments, in one place.": "आपके सभी निवेश, एक ही जगह।",
    "Quick opening": "क्विक ओपनिंग",
    "Bank-grade security": "बैंक-ग्रेड सिक्योरिटी",
    "The Company only facilitates customer applications for financial products offered by partner banks and NBFCs.": "कंपनी केवल पार्टनर बैंकों और NBFC द्वारा ऑफर किए गए फाइनेंशियल प्रोडक्ट्स के लिए ग्राहक आवेदन की सुविधा प्रदान करती है।",
    "Provide accurate product information": "सटीक प्रोडक्ट जानकारी प्रदान करना",
    "You are encouraged to independently review lender terms before accepting any financial product.": "किसी भी फाइनेंशियल प्रोडक्ट को स्वीकार करने से पहले आपको लेंडर की शर्तों की स्वतंत्र रूप से समीक्षा करने की सलाह दी जाती है।",
    "Data privacy concerns": "डेटा प्राइवेसी से जुड़ी चिंताएँ",
    "Level 2 – Escalation Desk": "लेवल 2 – एस्केलेशन डेस्क",
    "Cover hospitalisation, treatments and medical emergencies for you and your family – without dipping into your savings.": "अपने और अपने परिवार के लिए हॉस्पिटलाइज़ेशन, इलाज और मेडिकल इमरजेंसी कवर करें – अपनी बचत को हाथ लगाए बिना।",
    "Treatment at network hospitals with no upfront payment.": "नेटवर्क हॉस्पिटल्स में बिना किसी अपफ्रंट पेमेंट के इलाज।",
    "Premiums qualify for deduction under Section 80D.": "प्रीमियम सेक्शन 80D के तहत डिडक्शन के योग्य हैं।",
    "Browse loans": "लोन ब्राउज़ करें",
    "Preview": "प्रीव्यू",
    "Travel worry-free, home or abroad.": "बेफिक्र होकर घूमें, देश में या विदेश में।",
    "Curated funds for your goals.": "आपके लक्ष्यों के लिए चुने हुए फंड।",
    "Term & savings plans": "टर्म और सेविंग्स प्लान",
    "Combine protection with disciplined long-term savings.": "सुरक्षा को अनुशासित लॉन्ग-टर्म सेविंग्स के साथ जोड़ें।",
    "Comprehensive & third-party": "कॉम्प्रिहेंसिव और थर्ड-पार्टी",
    "Quick renewal": "क्विक रिन्यूअल",
    "Funds matched to your goals.": "आपके लक्ष्यों से मेल खाते फंड।",
    "Curated picks": "क्यूरेटेड पिक्स",
    "Track easily": "आसानी से ट्रैक करें",
    "Email address": "ईमेल एड्रेस",
    "Device, browser, IP address and website usage data": "डिवाइस, ब्राउज़र, IP एड्रेस और वेबसाइट उपयोग डेटा",
    "Customer verification and fraud prevention": "ग्राहक वेरिफिकेशन और फ्रॉड की रोकथाम",
    "Partner banks and NBFCs": "पार्टनर बैंक और NBFC",
    "By submitting information on our website, you expressly authorise the Company and its partner financial institutions to contact you through phone calls, SMS, WhatsApp, email or other communication channels, including over and above any DND/NDNC registration.": "हमारी वेबसाइट पर जानकारी सबमिट करके, आप कंपनी और उसके पार्टनर फाइनेंशियल संस्थानों को फोन कॉल, SMS, WhatsApp, ईमेल या अन्य कम्युनिकेशन चैनलों के ज़रिए आपसे संपर्क करने के लिए स्पष्ट रूप से अधिकृत करते हैं, भले ही आपका कोई भी DND/NDNC रजिस्ट्रेशन हो।",
    "You may request:": "आप अनुरोध कर सकते हैं:",
    "For privacy-related concerns, email": "प्राइवेसी से जुड़ी चिंताओं के लिए, ईमेल करें",
    "Every spend, rewarded.": "हर खर्च पर रिवॉर्ड।",
    "Reward points": "रिवॉर्ड पॉइंट्स",
    "Welcome perks": "वेलकम पर्क्स",
    "Helps improve CIBIL score": "CIBIL स्कोर सुधारने में मदद करता है",
    "Earn on FD": "FD पर कमाएँ",
    "Security measures include:": "सिक्योरिटी उपायों में शामिल हैं:",
    "Audit logs, monitoring and incident response procedures": "ऑडिट लॉग, मॉनिटरिंग और इंसिडेंट रिस्पॉन्स प्रक्रियाएँ",
    "Compliance Standard": "कंप्लायंस स्टैंडर्ड",
    "Tested Regularly": "नियमित रूप से टेस्टेड",
    "Small amounts, big future.": "छोटी रकम, बड़ा भविष्य।",
    "Start small": "छोटी शुरुआत करें",
    "Flexible": "फ्लेक्सिबल",
    "Submission of an application through our platform does not guarantee approval. Approval decisions, interest rates, fees, tenures and other terms are solely determined by the respective lender.": "हमारे प्लेटफॉर्म के ज़रिए आवेदन सबमिट करने से अप्रूवल की गारंटी नहीं मिलती। अप्रूवल के फैसले, इंटरेस्ट रेट, फीस, टेन्योर और अन्य शर्तें पूरी तरह संबंधित लेंडर द्वारा तय की जाती हैं।",
    "To comply with applicable laws": "लागू कानूनों का पालन करने के लिए",
    "Delays caused by partner institutions": "पार्टनर संस्थानों के कारण हुई देरी",
    "Collect air miles, enjoy airport lounge access and skip high forex markups. Perfect for frequent flyers and holiday planners.": "एयर माइल्स इकट्ठा करें, एयरपोर्ट लाउंज एक्सेस का आनंद लें और हाई फॉरेक्स मार्कअप से बचें। फ्रीक्वेंट फ्लायर्स और हॉलिडे प्लानर्स के लिए परफेक्ट।",
    "Earn miles on every spend and redeem for flights.": "हर खर्च पर माइल्स कमाएँ और फ्लाइट्स के लिए रिडीम करें।",
    "Cover for delays, baggage and emergencies on trips.": "यात्रा में देरी, बैगेज और इमरजेंसी के लिए कवर।",
    "Travel Insurance on MyCashBridge": "MyCashBridge पर ट्रैवल इंश्योरेंस",
    "Compensation for lost or delayed baggage.": "खोए या देर से मिले बैगेज के लिए मुआवज़ा।",
    "Rate from": "रेट शुरू",
    "Apply with the best rate": "बेस्ट रेट के साथ अप्लाई करें",
    "See loans you may qualify for": "देखें कि आप किन लोन के लिए क्वालिफाई कर सकते हैं",
    "I authorise MyCashBridge.com to fetch my credit score and contact me about suitable offers. This overrides my DND/NDNC registration.": "मैं MyCashBridge.com को अपना क्रेडिट स्कोर प्राप्त करने और उपयुक्त ऑफर्स के बारे में मुझसे संपर्क करने के लिए अधिकृत करता/करती हूँ। यह मेरे DND/NDNC रजिस्ट्रेशन को ओवरराइड करता है।",
    "Credit utilisation": "क्रेडिट यूटिलाइज़ेशन",
    "Improve your score": "अपना स्कोर सुधारें",
    "Limit hard enquiries": "हार्ड इंक्वायरी सीमित रखें",
    "Adjust the details below to see an indicative loan amount you could qualify for. It's just an estimate – your final offer is set after a quick assessment.": "नीचे दी गई डिटेल्स बदलकर देखें कि आप अनुमानित कितने लोन अमाउंट के लिए क्वालिफाई कर सकते हैं। यह सिर्फ एक अनुमान है – आपका फाइनल ऑफर एक क्विक असेसमेंट के बाद तय होता है।",
    "Indicative EMI ₹40,900 / month over 5 years": "सांकेतिक EMI ₹40,900 / माह, 5 साल के लिए",
    "Get this loan": "यह लोन पाएँ",
    "Credit score": "क्रेडिट स्कोर",
    "Free tool": "फ्री टूल",
    "Principal amount": "प्रिंसिपल अमाउंट",
    "How EMI is calculated": "EMI कैसे कैलकुलेट होती है",
    "A longer tenure means a smaller EMI but more total interest. Pick a balance you're comfortable with.": "लंबे टेन्योर का मतलब है छोटी EMI लेकिन ज़्यादा कुल ब्याज। ऐसा बैलेंस चुनें जिसमें आप कम्फर्टेबल हों।",
    "No. Checking your eligibility through MyCashBridge does not impact your CIBIL score during the initial assessment stage. You can explore available loan options, understand your borrowing potential, and make informed decisions without worrying about negatively affecting your credit profile.": "नहीं। MyCashBridge के ज़रिए एलिजिबिलिटी चेक करने से शुरुआती असेसमेंट स्टेज में आपके CIBIL स्कोर पर कोई असर नहीं पड़ता। आप उपलब्ध लोन विकल्प एक्सप्लोर कर सकते हैं, अपनी उधार लेने की क्षमता समझ सकते हैं, और अपने क्रेडिट प्रोफाइल पर नकारात्मक असर की चिंता किए बिना सोच-समझकर फैसले ले सकते हैं।",
    "Yes. While your CIBIL score is an important consideration, lenders often evaluate multiple factors, including income stability, employment history, repayment capacity, and overall financial profile. Depending on your circumstances, suitable loan options may still be available through our lending network.": "हाँ। हालाँकि आपका CIBIL स्कोर एक अहम पहलू है, लेंडर अक्सर कई फैक्टर्स का मूल्यांकन करते हैं, जिनमें इनकम स्टेबिलिटी, एम्प्लॉयमेंट हिस्ट्री, रीपेमेंट क्षमता और समग्र फाइनेंशियल प्रोफाइल शामिल हैं। आपकी परिस्थितियों के आधार पर, हमारे लेंडिंग नेटवर्क के ज़रिए उपयुक्त लोन विकल्प फिर भी उपलब्ध हो सकते हैं।",
    "Borrowers choose MyCashBridge because we simplify the loan journey through a fast, transparent, and customer-focused process. Instead of approaching multiple lenders individually, applicants can save time, reduce paperwork, and receive support in finding suitable lending solutions tailored to their needs.": "उधारकर्ता MyCashBridge को इसलिए चुनते हैं क्योंकि हम एक तेज़, पारदर्शी और कस्टमर-केंद्रित प्रक्रिया के ज़रिए लोन की पूरी प्रक्रिया को आसान बनाते हैं। कई लेंडर्स से अलग-अलग संपर्क करने के बजाय, आवेदक समय बचा सकते हैं, पेपरवर्क कम कर सकते हैं, और अपनी ज़रूरतों के हिसाब से उपयुक्त लेंडिंग समाधान खोजने में सहायता पा सकते हैं।",
    "Next": "आगे बढ़ें",
    "Partner Network": "पार्टनर नेटवर्क",
    "Multiple Lending Partners": "कई लेंडिंग पार्टनर्स",
    "Rewards": "रिवॉर्ड्स",
    "Optional": "वैकल्पिक",
    "Step 2 of 2": "चरण 2 / 2",
    "Apply for a Gold Loan": "गोल्ड लोन के लिए अप्लाई करें",
    "For salaried professionals, the right credit card is a powerful everyday tool – earning cashback, miles or rewards on spends you'd make anyway, while helping you build a strong credit history. Here's how to choose well.": "सैलरीड प्रोफेशनल्स के लिए सही क्रेडिट कार्ड रोज़मर्रा का एक दमदार टूल है – जो खर्च आप वैसे भी करते, उन पर कैशबैक, माइल्स या रिवॉर्ड्स कमाएं और साथ ही मज़बूत क्रेडिट हिस्ट्री भी बनाएं। यहां जानें सही कार्ड कैसे चुनें।",
    "Rewards cards": "रिवॉर्ड्स कार्ड",
    "Reward or cashback rates on your biggest spend categories": "आपकी सबसे बड़ी खर्च कैटेगरी पर रिवॉर्ड या कैशबैक रेट",
    "Used responsibly, a credit card lifts your CIBIL score over time. Keep these habits:": "समझदारी से इस्तेमाल करने पर क्रेडिट कार्ड समय के साथ आपका CIBIL स्कोर बढ़ाता है। ये आदतें बनाए रखें:",
    ", then read": ", फिर पढ़ें",
    "One or two used responsibly is plenty for most people. Too many cards can hurt your score and tempt overspending.": "ज़्यादातर लोगों के लिए समझदारी से इस्तेमाल किए गए एक या दो कार्ड काफी हैं। बहुत सारे कार्ड आपका स्कोर गिरा सकते हैं और ज़रूरत से ज़्यादा खर्च के लिए ललचा सकते हैं।",
    "Best Personal Loan in India (2026): Rates, Eligibility & How to Choose": "भारत में बेस्ट पर्सनल लोन (2026): रेट, एलिजिबिलिटी और कैसे चुनें",
    "– usually 1–3% of the loan amount": "– आमतौर पर लोन राशि का 1–3%",
    "Eligibility for a personal loan in India": "भारत में पर्सनल लोन के लिए एलिजिबिलिटी",
    "Check your personal loan rate in 10 seconds": "10 सेकंड में अपना पर्सनल लोन रेट चेक करें",
    "A passport-size photograph and address proof": "एक पासपोर्ट साइज़ फोटो और एड्रेस प्रूफ",
    "MyCashBridge.com helps you": "MyCashBridge.com आपकी मदद करता है",
    "free.": "फ्री।",
    "No. The initial check is a soft enquiry and does not impact your score.": "नहीं। शुरुआती चेक एक सॉफ्ट इंक्वायरी है और इससे आपके स्कोर पर कोई असर नहीं पड़ता।",
    "– smooth out day-to-day cash flow": "– रोज़मर्रा के कैश फ्लो को आसान बनाएं",
    "– larger amounts at lower rates by pledging property": "– प्रॉपर्टी गिरवी रखकर कम रेट पर बड़ी राशि",
    "See how much working capital you qualify for": "देखें आप कितनी वर्किंग कैपिटल के लिए योग्य हैं",
    "Last 1–2 years' ITR and financials": "पिछले 1–2 साल का ITR और फाइनेंशियल्स",
    "MyCashBridge.com helps MSMEs": "MyCashBridge.com MSMEs की मदद करता है",
    "Are collateral-free business loans real?": "क्या कोलैटरल-फ्री बिज़नेस लोन सच में मिलते हैं?",
    "Your credit score is the single biggest factor in whether you get a loan and at what rate. The good news: improving it is straightforward once you understand what drives it. Here's a clear, no-jargon guide.": "आपको लोन मिलेगा या नहीं और किस रेट पर – इसका सबसे बड़ा फैक्टर है आपका क्रेडिट स्कोर। अच्छी खबर: एक बार समझ लें कि स्कोर किन चीज़ों से बनता है, तो उसे सुधारना आसान है। यहां है एक साफ़, बिना जार्गन वाली गाइड।",
    "Credit age & mix": "क्रेडिट एज और मिक्स",
    "Keep credit-card spends under 30% of your limit": "क्रेडिट कार्ड खर्च अपनी लिमिट के 30% से कम रखें",
    "There's no overnight fix. With consistent on-time payments and lower utilisation, most people see meaningful improvement within 3 to 6 months, and strong results over a year.": "रातोंरात कोई जादू नहीं होता। समय पर पेमेंट और कम यूटिलाइज़ेशन के साथ ज़्यादातर लोगों को 3 से 6 महीनों में अच्छा सुधार दिखता है, और एक साल में शानदार नतीजे।",
    "getting a loan with a low CIBIL score": "कम CIBIL स्कोर पर लोन पाना",
    "Credit bureaus typically update scores monthly, as lenders report your repayment data.": "क्रेडिट ब्यूरो आमतौर पर हर महीने स्कोर अपडेट करते हैं, जब लेंडर आपका रीपेमेंट डेटा रिपोर्ट करते हैं।",
    "Compare and apply for the right loan across 128+ banks & NBFCs – with clear EMIs and honest guidance.": "30+ बैंकों और NBFCs में से सही लोन कंपेयर करें और अप्लाई करें – साफ़ EMI और ईमानदार गाइडेंस के साथ।",
    "Secured loans": "सिक्योर्ड लोन",
    "NBFCs and newer lenders": "NBFCs और नए लेंडर",
    "Improve your score, then borrow cheaper": "अपना स्कोर सुधारें, फिर सस्ता लोन पाएं",
    "checking your CIBIL score free": "अपना CIBIL स्कोर फ्री में चेक करना",
    "It's harder and usually costs more. A secured loan (gold or property) or adding a co-applicant improves your chances significantly.": "यह मुश्किल होता है और आमतौर पर महंगा भी। सिक्योर्ड लोन (गोल्ड या प्रॉपर्टी) या को-एप्लिकेंट जोड़ने से आपके चांस काफी बढ़ जाते हैं।",
    "Tell us a little about yourself and a MyCashBridge expert calls you with a clear offer – the amount, the EMI, and the total. Simple, honest, fast.": "अपने बारे में थोड़ी जानकारी दें और MyCashBridge का एक्सपर्ट आपको साफ़ ऑफर के साथ कॉल करेगा – राशि, EMI और कुल रकम। सिंपल, ईमानदार, फास्ट।",
    "– what you see is what you pay": "– जो दिखता है, वही आप चुकाते हैं",
    "Apply in minutes and get a clear decision quickly – often with money the same day.": "मिनटों में अप्लाई करें और जल्दी साफ़ फैसला पाएं – अक्सर उसी दिन पैसे के साथ।",
    "Customers": "कस्टमर्स",
    "₹12 Lakhs": "₹12 लाख",
    "Suresh Reddy": "सुरेश रेड्डी",
    "₹5 Lakhs": "₹5 लाख",
    "Delhi · Personal Loan": "दिल्ली · पर्सनल लोन",
    "Fuel for your business, on your terms.": "आपके बिज़नेस के लिए फ्यूल, आपकी शर्तों पर।",
    "Apply for Business Loan": "बिज़नेस लोन के लिए अप्लाई करें",
    "12–60 mo": "12–60 महीने",
    "Top-up available as your business grows": "बिज़नेस बढ़ने के साथ टॉप-अप उपलब्ध",
    "Business vintage of at least 1–2 years": "कम से कम 1–2 साल पुराना बिज़नेस",
    "Proof of business address": "बिज़नेस एड्रेस का प्रूफ",
    "Submit documents": "डॉक्यूमेंट जमा करें",
    "Many of our partners offer collateral-free (unsecured) business loans up to a certain limit. Larger amounts may require security. We'll tell you the options for your profile upfront.": "हमारे कई पार्टनर एक तय लिमिट तक कोलैटरल-फ्री (अनसिक्योर्ड) बिज़नेस लोन देते हैं। बड़ी राशि के लिए सिक्योरिटी की ज़रूरत पड़ सकती है। हम आपकी प्रोफाइल के हिसाब से सभी विकल्प पहले ही बता देंगे।",
    "Most lenders require 1–2 years of business vintage. If you're newer, talk to us – we can suggest suitable options.": "ज़्यादातर लेंडर 1–2 साल पुराना बिज़नेस मांगते हैं। अगर आपका बिज़नेस नया है, तो हमसे बात करें – हम सही विकल्प सुझा सकते हैं।",
    "New or pre-owned, get up to 100% on-road funding with quick approvals and EMIs that fit your monthly budget.": "नई हो या पुरानी कार, पाएं 100% तक ऑन-रोड फंडिंग – फटाफट अप्रूवल और आपके मंथली बजट में फिट होने वाली EMI के साथ।",
    "of on-road price": "ऑन-रोड कीमत का",
    "Flexible tenures up to 7 years": "7 साल तक का फ्लेक्सिबल टेन्योर",
    "Indian resident aged 21 to 65 years": "21 से 65 साल की उम्र का भारतीय निवासी",
    "Income proof: salary slips / ITR": "इनकम प्रूफ: सैलरी स्लिप / ITR",
    "Choose your new or used car and tell us the on-road price.": "अपनी नई या पुरानी कार चुनें और हमें ऑन-रोड कीमत बताएं।",
    "The amount is paid to the dealer and you drive home your car.": "राशि डीलर को चुका दी जाती है और आप अपनी कार घर ले जाते हैं।",
    "What tenure can I choose?": "मैं कौन-सा टेन्योर चुन सकता/सकती हूं?",
    "Your new car is closer than you think": "आपकी नई कार आपकी सोच से ज़्यादा करीब है",
    "Moratorium while studying": "पढ़ाई के दौरान मोराटोरियम",
    "often waived": "अक्सर माफ",
    "Collateral-free options up to a limit": "एक लिमिट तक कोलैटरल-फ्री विकल्प",
    "Admission to a recognised institution/course": "मान्यता प्राप्त संस्थान/कोर्स में एडमिशन",
    "Income proof of co-applicant": "को-एप्लिकेंट का इनकम प्रूफ",
    "Provide admission, academic and co-applicant documents online.": "एडमिशन, एकेडमिक और को-एप्लिकेंट के डॉक्यूमेंट ऑनलाइन दें।",
    "What is a moratorium period?": "मोराटोरियम पीरियड क्या है?",
    "Who should be the co-applicant?": "को-एप्लिकेंट किसे बनाना चाहिए?",
    "Low interest rates": "कम ब्याज दरें",
    "3–36 mo": "3–36 महीने",
    "Minimal documentation, no income proof needed": "बहुत कम डॉक्यूमेंटेशन, इनकम प्रूफ की ज़रूरत नहीं",
    "Own gold jewellery/ornaments (18–24 carat)": "खुद के सोने के गहने/आभूषण (18–24 कैरेट)",
    "The gold ornaments to be pledged": "गिरवी रखे जाने वाले सोने के गहने",
    "Gold valuation": "गोल्ड वैल्यूएशन",
    "It's based on the weight and purity of your gold and the lender's loan-to-value ratio (regulated up to 75% of value). Higher purity and weight mean a higher loan.": "यह आपके सोने के वज़न और शुद्धता, और लेंडर के लोन-टू-वैल्यू रेशियो (नियमानुसार वैल्यू के 75% तक) पर आधारित है। जितनी ज़्यादा शुद्धता और वज़न, उतना बड़ा लोन।",
    "Flexible – you can pay regular EMIs, pay interest periodically and principal at the end, or settle as a bullet payment. We'll explain what suits you.": "फ्लेक्सिबल – आप रेगुलर EMI चुका सकते हैं, समय-समय पर ब्याज और अंत में मूलधन दे सकते हैं, या बुलेट पेमेंट के रूप में सेटल कर सकते हैं। आपके लिए क्या सही है, हम समझा देंगे।",
    "Buy a ready home, build your own, or transfer an existing loan to a lower rate. Borrow up to ₹5 crore with long, comfortable tenures.": "रेडी घर खरीदें, अपना खुद का बनाएं, या मौजूदा लोन को कम रेट पर ट्रांसफर करें। लंबे, आरामदायक टेन्योर के साथ ₹5 करोड़ तक का लोन पाएं।",
    "up to 30 yrs": "30 साल तक",
    "Balance transfer to cut your existing EMI": "मौजूदा EMI घटाने के लिए बैलेंस ट्रांसफर",
    "Indian resident or NRI aged 21 to 65 years": "21 से 65 साल की उम्र का भारतीय निवासी या NRI",
    "Bank statements for the last 6 months": "पिछले 6 महीनों का बैंक स्टेटमेंट",
    "Get an indicative offer": "अनुमानित ऑफर पाएं",
    "How much home loan can I get?": "मुझे कितना होम लोन मिल सकता है?",
    "Yes. Adding a co-applicant (often a spouse or parent) can increase your loan eligibility and may help with the interest rate.": "हां। को-एप्लिकेंट (अक्सर जीवनसाथी या माता-पिता) जोड़ने से आपकी लोन एलिजिबिलिटी बढ़ सकती है और ब्याज दर में भी फायदा मिल सकता है।",
    "Use your residential or commercial property to raise a large loan for business or personal needs – and keep living in or using it.": "अपनी रेज़िडेंशियल या कमर्शियल प्रॉपर्टी से बिज़नेस या पर्सनल ज़रूरतों के लिए बड़ा लोन पाएं – और उसमें रहना या उसका इस्तेमाल जारी रखें।",
    "up to ₹10,00,00,000": "₹10,00,00,000 तक",
    "Use funds for business or personal needs": "फंड का इस्तेमाल बिज़नेस या पर्सनल ज़रूरतों के लिए करें",
    "Property should be free of major legal disputes": "प्रॉपर्टी बड़े कानूनी विवादों से मुक्त होनी चाहिए",
    "An expert assesses value and eligibility, then calls with a clear offer.": "एक्सपर्ट वैल्यू और एलिजिबिलिटी का आकलन करता है, फिर साफ़ ऑफर के साथ कॉल करता है।",
    "It's a secured loan where you pledge your residential or commercial property as security to borrow a large amount, usually at a lower rate than an unsecured loan. You continue to own and use the property.": "यह एक सिक्योर्ड लोन है जिसमें आप अपनी रेज़िडेंशियल या कमर्शियल प्रॉपर्टी को सिक्योरिटी के तौर पर गिरवी रखकर बड़ी राशि उधार लेते हैं, आमतौर पर अनसिक्योर्ड लोन से कम रेट पर। प्रॉपर्टी का मालिकाना हक और इस्तेमाल आपके पास ही रहता है।",
    "Business expansion, working capital, education, medical needs, debt consolidation – almost any legitimate large expense.": "बिज़नेस विस्तार, वर्किंग कैपिटल, पढ़ाई, मेडिकल ज़रूरतें, कर्ज़ कंसॉलिडेशन – लगभग कोई भी जायज़ बड़ा खर्च।",
    "Weddings, travel, a medical bill, or just some breathing room – borrow up to ₹40 lakh with no collateral and EMIs you choose.": "शादी, ट्रैवल, मेडिकल बिल, या बस थोड़ी राहत – बिना कोलैटरल के ₹40 लाख तक का लोन पाएं, EMI आपकी पसंद की।",
    "Cash for whatever life needs": "ज़िंदगी की हर ज़रूरत के लिए कैश",
    "100% paperless application to start": "शुरुआत के लिए 100% पेपरलेस एप्लिकेशन",
    "Credit score of 700+ helps you get the best rate": "700+ का क्रेडिट स्कोर आपको बेस्ट रेट दिलाने में मदद करता है",
    "Share your details": "अपनी डिटेल्स शेयर करें",
    "Accept the offer and funds reach your bank – often the same day.": "ऑफर एक्सेप्ट करें और फंड आपके बैंक में पहुंच जाता है – अक्सर उसी दिन।",
    "How fast will I get the money?": "मुझे पैसे कितनी जल्दी मिलेंगे?",
    "Get the funds you need, the honest way": "ज़रूरत का फंड पाएं, ईमानदार तरीके से",
    "Lending partners": "लेंडिंग पार्टनर",
    "No jargon. We explain everything the way we'd explain it to family.": "कोई जार्गन नहीं। हम हर चीज़ ऐसे समझाते हैं जैसे अपने परिवार को समझा रहे हों।",
    "Registered & accountable": "रजिस्टर्ड और जवाबदेह",
    "Policies": "पॉलिसीज़",
    "The Company reserves the right to reject suspicious or fraudulent applications.": "कंपनी संदिग्ध या धोखाधड़ी वाले आवेदनों को अस्वीकार करने का अधिकार सुरक्षित रखती है।",
    "Flat or category cashback": "फ्लैट या कैटेगरी कैशबैक",
    "Be among the first to compare and apply. Leave your details and we'll reach out at launch.": "कंपेयर और अप्लाई करने वालों में सबसे पहले रहें। अपनी डिटेल्स छोड़ें और लॉन्च पर हम आपसे संपर्क करेंगे।",
    "Online bonus": "ऑनलाइन बोनस",
    "More in Credit Cards": "क्रेडिट कार्ड्स में और",
    "You may opt out of promotional communication at any time by contacting the Company through the designated support channels.": "आप निर्धारित सपोर्ट चैनलों के ज़रिए कंपनी से संपर्क करके कभी भी प्रमोशनल कम्युनिकेशन से ऑप्ट-आउट कर सकते हैं।",
    "Chat with us": "हमसे चैट करें",
    "We never share your details": "हम आपकी डिटेल्स कभी शेयर नहीं करते",
    "General question": "सामान्य सवाल",
    "The website uses cookies and similar technologies to:": "यह वेबसाइट कुकीज़ और इसी तरह की तकनीकों का इस्तेमाल इन कामों के लिए करती है:",
    "When you first visit, we ask for your choice.": "जब आप पहली बार विज़िट करते हैं, तो हम आपकी पसंद पूछते हैं।",
    "cookies only run if you click \"Accept all– or enable them in cookie settings. If you reject non-essential cookies, we do not set or keep them – and any that try to set are cleared automatically.": "कुकीज़ तभी चलती हैं जब आप \"Accept all– पर क्लिक करते हैं या कुकी सेटिंग्स में उन्हें इनेबल करते हैं। अगर आप गैर-ज़रूरी कुकीज़ रिजेक्ट करते हैं, तो हम उन्हें सेट या स्टोर नहीं करते – और जो सेट होने की कोशिश करती हैं, वे अपने आप क्लियर हो जाती हैं।",
    "Credit Cards, applied through MyCashBridge.": "क्रेडिट कार्ड, MyCashBridge के ज़रिए अप्लाई किए गए।",
    "Types of Credit Cards": "क्रेडिट कार्ड के प्रकार",
    "Lifestyle & Shopping": "लाइफस्टाइल और शॉपिंग",
    "Data Retention & Deletion Policy": "डेटा रिटेंशन और डिलीशन पॉलिसी",
    "Hold shares, ETFs and securities safely in one digital account, with easy buying and selling.": "शेयर, ETFs और सिक्योरिटीज़ एक ही डिजिटल अकाउंट में सुरक्षित रखें, आसान खरीद-बिक्री के साथ।",
    "Open your account online with paperless KYC.": "पेपरलेस KYC के साथ अपना अकाउंट ऑनलाइन खोलें।",
    "Your holdings are safe and fully regulated.": "आपकी होल्डिंग्स सुरक्षित और पूरी तरह रेगुलेटेड हैं।",
    "Loan approvals, interest rates, credit limits, processing fees and related terms are determined solely by the respective financial institution based on its internal policies and your eligibility.": "लोन अप्रूवल, ब्याज दरें, क्रेडिट लिमिट, प्रोसेसिंग फीस और संबंधित शर्तें पूरी तरह संबंधित वित्तीय संस्थान अपनी आंतरिक नीतियों और आपकी एलिजिबिलिटी के आधार पर तय करता है।",
    "Avoid misleading claims": "भ्रामक दावों से बचें",
    "Grievance Redressal Policy": "शिकायत निवारण नीति",
    "Misconduct": "दुर्व्यवहार",
    "Level 3 – Grievance Officer": "लेवल 3 – शिकायत अधिकारी",
    "Cashless hospital network": "कैशलेस हॉस्पिटल नेटवर्क",
    "Family floater": "फैमिली फ्लोटर",
    "More in Insurance": "इंश्योरेंस में और",
    "Insurance we're building": "इंश्योरेंस जो हम बना रहे हैं",
    "LIFE": "लाइफ",
    "Grow your money with confidence.": "अपना पैसा भरोसे के साथ बढ़ाएं।",
    "DEMAT": "डीमैट",
    "Tax benefits u/s 80C": "धारा 80C के तहत टैक्स बेनिफिट",
    "Rider add-ons": "राइडर ऐड-ऑन",
    "Quick online renewal": "फटाफट ऑनलाइन रिन्यूअल",
    "Renew online in minutes, no paperwork.": "मिनटों में ऑनलाइन रिन्यू करें, कोई पेपरवर्क नहीं।",
    "Choose from curated equity, debt and hybrid funds matched to your goals and risk appetite – no jargon.": "अपने लक्ष्यों और रिस्क क्षमता के हिसाब से चुने हुए इक्विटी, डेट और हाइब्रिड फंड में से चुनें – कोई जार्गन नहीं।",
    "Hand-picked funds so you don't have to guess.": "हैंड-पिक्ड फंड, ताकि आपको अंदाज़ा न लगाना पड़े।",
    "Monitor your portfolio in one simple view.": "अपना पोर्टफोलियो एक सिंपल व्यू में मॉनिटर करें।",
    "PAN details": "PAN डिटेल्स",
    "3. Purpose of collection": "3. संग्रह का उद्देश्य",
    "Customer support and grievance handling": "कस्टमर सपोर्ट और शिकायत निपटान",
    "Verification agencies": "वेरिफिकेशन एजेंसियां",
    "6. Data security": "6. डेटा सुरक्षा",
    "Access to your personal information": "आपकी पर्सनल जानकारी तक पहुंच",
    "Refund & Cancellation Policy": "रिफंड और कैंसिलेशन पॉलिसी",
    "Collect reward points on all your spending and redeem them for vouchers, products and more. Great all-rounders for daily use.": "अपने हर खर्च पर रिवॉर्ड पॉइंट्स जमा करें और उन्हें वाउचर, प्रोडक्ट्स और बहुत कुछ के लिए रिडीम करें। रोज़ाना इस्तेमाल के लिए बेहतरीन ऑल-राउंडर।",
    "Earn points on every transaction, everywhere.": "हर ट्रांज़ैक्शन पर, हर जगह पॉइंट्स कमाएं।",
    "Joining bonuses and milestone rewards.": "जॉइनिंग बोनस और माइलस्टोन रिवॉर्ड्स।",
    "Secured Cards on MyCashBridge": "MyCashBridge पर सिक्योर्ड कार्ड्स",
    "Your fixed deposit keeps earning interest.": "आपकी फिक्स्ड डिपॉज़िट पर ब्याज मिलता रहता है।",
    "SSL/TLS encryption for all data in transit": "ट्रांज़िट में सभी डेटा के लिए SSL/TLS एन्क्रिप्शन",
    "While reasonable safeguards are implemented, no digital platform can guarantee absolute security.": "हालांकि उचित सुरक्षा उपाय लागू किए गए हैं, कोई भी डिजिटल प्लेटफॉर्म पूर्ण सुरक्षा की गारंटी नहीं दे सकता।",
    "SSL Certificate": "SSL सर्टिफिकेट",
    "Invest a fixed amount every month and let the power of compounding build your wealth over time.": "हर महीने एक तय राशि निवेश करें और कंपाउंडिंग की ताकत को समय के साथ अपनी वेल्थ बनाने दें।",
    "Begin with as little as ₹500 every month.": "हर महीने सिर्फ ₹500 से शुरुआत करें।",
    "Increase, pause or stop your SIP anytime.": "अपनी SIP कभी भी बढ़ाएं, रोकें या बंद करें।",
    "3. Your obligations": "3. आपके दायित्व",
    "4. Intellectual property": "4. बौद्धिक संपदा",
    "Technical interruptions": "तकनीकी रुकावटें",
    "Air miles & hotel points": "एयर माइल्स और होटल पॉइंट्स",
    "Lounge access": "लाउंज एक्सेस",
    "Travel covered, worry-free.": "ट्रैवल कवर्ड, बिल्कुल बेफिक्र।",
    "Medical abroad": "विदेश में मेडिकल",
    "Easy claims": "आसान क्लेम",
    "Max amount": "अधिकतम राशि",
    "100% free – no impact on your score": "100% फ्री – आपके स्कोर पर कोई असर नहीं",
    "Bank-grade data security": "बैंक-ग्रेड डेटा सुरक्षा",
    "Get my free score": "मेरा फ्री स्कोर पाएं",
    "Keep below 30%": "30% से नीचे रखें",
    "Simple habits that lift your CIBIL": "आसान आदतें जो आपका CIBIL बढ़ाएं",
    "Apply Once. Compare 128+ Lenders. Upload Documents Once. Get the Best Offer Delivered to You.": "एक बार अप्लाई करें। 128+ ऋणदाताओं की तुलना करें। दस्तावेज़ एक बार अपलोड करें। सबसे अच्छा ऑफर अपने आप पाएं।",
    "Net monthly income": "नेट मंथली इनकम",
    "Estimated tenure": "अनुमानित टेन्योर",
    "A real offer depends on your documents and credit profile.": "असली ऑफर आपके डॉक्यूमेंट्स और क्रेडिट प्रोफाइल पर निर्भर करता है।",
    "A score of 750+ unlocks higher amounts and better rates.": "750+ का स्कोर बड़ी राशि और बेहतर रेट के दरवाज़े खोलता है।",
    "Plan your loan with confidence. Move the sliders to see your monthly EMI, total interest, and total amount payable – instantly.": "अपना लोन भरोसे के साथ प्लान करें। स्लाइडर हिलाएं और तुरंत देखें अपनी मंथली EMI, कुल ब्याज और कुल देय राशि।",
    "Total interest": "कुल ब्याज",
    "The formula": "फॉर्मूला",
    "Keep EMIs affordable": "EMI किफायती रखें",
    "How quickly can I receive a loan through MyCashBridge?": "MyCashBridge के ज़रिए मुझे कितनी जल्दी लोन मिल सकता है?",
    "Are there any hidden charges?": "क्या कोई छिपे हुए चार्ज हैं?",
    "What type of loan do you need?": "आपको किस तरह का लोन चाहिए?",
    "Back": "वापस",
    "Approval Journey": "अप्रूवल जर्नी",
    "Quick Assessment": "क्विक असेसमेंट",
    "Secured": "सिक्योर्ड",
    "Step 2 of 3": "चरण 2 / 3",
    "Apply for a Car Loan": "कार लोन के लिए अप्लाई करें"
  };
  var PH_HI = {
    "e.g. Rohan Sharma": "उदा. रोहन शर्मा", "10-digit mobile": "10-अंकीय मोबाइल", "e.g. Pune": "उदा. पुणे", "ABCDE1234F": "ABCDE1234F"
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
        el.innerHTML = '<span style="width:13px;height:13px;border:2px solid rgba(255,255,255,.35);border-top-color:#9AEF5E;border-radius:50%;display:inline-block;animation:spin .7s linear infinite"></span> हिंदी में अनुवाद हो रहा है…';
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
      "Do NOT translate or alter: the brand name MyCashBridge; the abbreviations EMI, NBFC, NBFCs, CIBIL, PAN, RBI, GST, GSTIN, CIN, LSP, DSA, KYC, SSL, ISO, WhatsApp, SIP, ITR, DND, NDNC; the rupee sign ₹; and all numbers, percentages, dates and currency amounts. Personal names may stay in English. Keep punctuation reasonable. " +
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
      '<div class="lang-toggle" data-no-i18n><button data-l="en" data-setlang="en">EN</button><button data-l="hi" data-setlang="hi">हिं</button></div>' +
      '<a class="nav-tel" href="tel:' + CFG.phoneRaw + '"><i data-lucide="phone-call"></i> ' + CFG.phone + '</a>' +
      '<button class="btn btn-filled btn-sm" data-apply data-i18n="nav.apply">Apply now</button>' +
      '<a class="btn btn-filled btn-sm nav-download-btn" href="https://play.google.com/store" target="_blank" rel="noopener"><i data-lucide="smartphone"></i> Get App</a>' +
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
      '<div class="drawer-group" style="display:flex;gap:8px;border-top:none"><div class="lang-toggle" data-no-i18n><button data-l="en" data-setlang="en">EN</button><button data-l="hi" data-setlang="hi">हिं</button></div></div>' +
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
        '<p class="desc">A Lending Service Provider (LSP) helping you compare and apply for loans, cards and more from leading banks & NBFCs — with clear EMIs and honest guidance.</p>' +
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
      '<p class="footer-disc" style="margin-top:4px">Registered office: ' + CFG.address + ', India &nbsp;·&nbsp; <a href="tel:' + CFG.phoneRaw + '">' + CFG.phone + '</a> &nbsp;·&nbsp; CIN: U72501HR2022PTC104372 &nbsp;·&nbsp; GSTIN: 06AALCR9469E1ZV</p>' +
      '<p class="footer-disc" style="margin-top:4px">Inquiries: <a href="mailto:inquiry@mycashbridge.com">inquiry@mycashbridge.com</a> &nbsp;·&nbsp; Applications: <a href="mailto:application@mycashbridge.com">application@mycashbridge.com</a> &nbsp;·&nbsp; Privacy: <a href="mailto:privacy@mycashbridge.com">privacy@mycashbridge.com</a></p>' +
      '<p class="footer-disc" style="margin-top:4px">Grievance Officer: <strong>Jyotsana Bora</strong> &nbsp;·&nbsp; <a href="mailto:grievance@mycashbridge.com">grievance@mycashbridge.com</a> &nbsp;·&nbsp; <a href="tel:+918796508140">+91 87965 08140</a></p>' +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' ' + CFG.brand + '. All rights reserved.</span>' +
        '<span class="links"><a href="' + BASE + 'pages/privacy-policy.html">Privacy</a><a href="' + BASE + 'pages/terms.html">Terms</a><a href="' + BASE + 'pages/disclaimer.html">Disclaimer</a><a href="#" data-cookie-settings>Cookie settings</a></span>' +
      '</div>' +
    '</div></footer>';
  }

  /* ============================================================
     FLOATS + MOBILE BAR
     ============================================================ */
  function floatsHTML() {
    return '<div class="floats">' +
      '<a class="float-btn float-wa" href="https://wa.me/' + CFG.whatsapp + '?text=Hi%20' + encodeURIComponent(CFG.brand) + '%2C%20I%27d%20like%20help%20with%20a%20loan." target="_blank" rel="noopener" aria-label="WhatsApp"><i data-lucide="message-circle"></i></a>' +
      '<a class="float-btn float-call" href="tel:' + CFG.phoneRaw + '" aria-label="Call us"><i data-lucide="phone"></i></a></div>' +
    '<div class="mobile-bar"><div class="mobile-bar-inner">' +
      '<a class="btn btn-outline" href="tel:' + CFG.phoneRaw + '"><i data-lucide="phone"></i> Call</a>' +
      '<button class="btn btn-filled" data-apply><i data-lucide="pencil-line"></i> Apply now</button></div></div>';
  }

  /* ============================================================
     APPLY MODAL + FORM
     ============================================================ */
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
  function resetBtn(form) { var b = form.querySelector('button[type=submit]'); if (b) { b.disabled = false; var lbl = b.querySelector(".btn-label"); if (lbl) lbl.innerHTML = '<i data-lucide="shield-check"></i> Get a call back'; } }

  function validate(form) {
    var ok = true; function bad(f) { if (f) { f.classList.add("invalid"); ok = false; } }
    form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("invalid"); });
    var name = form.querySelector('[name=name]'); if (name && !name.value.trim()) bad(name.closest(".field"));
    var mob = form.querySelector('[name=mobile]'); if (mob && !/^[6-9]\d{9}$/.test(mob.value.trim())) bad(mob.closest(".field"));
    var city = form.querySelector('[name=city]'); if (city && !city.value.trim()) bad(city.closest(".field"));
    var inc = form.querySelector('[name=income]'); if (inc && !inc.value) bad(inc.closest(".field"));
    var emp = form.querySelector('[name=employment]'); if (emp && !emp.value) bad(emp.closest(".field"));
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
        product_type:      loan,
        source_page:       location.pathname,
        /* DPDP consent evidence fields */
        consent_service:   true,
        consent_marketing: mktConsent ? mktConsent.checked : false,
        consent_version:   CONSENT_VERSION,
        _hp:               ""   /* honeypot — always empty from real users */
      };
      Object.assign(payload, getUtm());
      /* Primary: our Express server → MongoDB */
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
    if (!c || !c.analytics) {
      clearNonEssentialCookies();
      if (!clearTimer) clearTimer = setInterval(clearNonEssentialCookies, 3000); // keep blocking anything that tries to set cookies
    } else {
      if (clearTimer) { clearInterval(clearTimer); clearTimer = null; }
      loadAnalytics();
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
      if (t2.closest("[data-apply]") && !t2.closest("[data-quick-apply]")) { e.preventDefault(); openModal(t2.closest("[data-apply]").getAttribute("data-apply-loan") || ""); closeDrawer(); }
      if (t2.closest("[data-modal-close]")) closeModal();
      if (t2.closest("[data-drawer-open]")) openDrawer();
      if (t2.closest("[data-drawer-close]")) closeDrawer();
      if (t2.closest("[data-acc]")) t2.closest(".drawer-acc").classList.toggle("open");
      var sl = t2.closest("[data-setlang]"); if (sl) setLang(sl.getAttribute("data-setlang"));
      var seg = t2.closest(".seg-opt");
      if (seg && seg.closest(".seg[data-seg]")) { var g = seg.closest(".seg"); g.querySelectorAll(".seg-opt").forEach(function (s) { s.classList.remove("sel"); }); seg.classList.add("sel"); var hid = g.querySelector('input[type=hidden]'); if (hid) hid.value = seg.getAttribute("data-val"); seg.closest(".field") && seg.closest(".field").classList.remove("invalid"); }
      var q = t2.closest(".qa-q");
      if (q) { var qa = q.closest(".qa"), a = qa.querySelector(".qa-a"); var open = qa.classList.toggle("open"); a.style.maxHeight = open ? a.scrollHeight + "px" : "0px"; }
    });
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("input", function (e) {
      if (e.target.name === "mobile") e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
      if (e.target.name === "pan") e.target.value = e.target.value.toUpperCase().slice(0, 10);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeModal(); closeDrawer(); closeQbPopup(); var ck = document.getElementById("ckModal"); if (ck) ck.classList.remove("open"); } });
  }

  /* EMI widget */
  function initEmi(root) {
    var rate = parseFloat(root.getAttribute("data-rate") || "11");
    var amtEl = root.querySelector("[data-emi-amount]"), monEl = root.querySelector("[data-emi-months]");
    var amtOut = root.querySelector("[data-emi-amount-out]"), monOut = root.querySelector("[data-emi-months-out]");
    var emiOut = root.querySelector("[data-emi-out]"), totOut = root.querySelector("[data-emi-total]"), intOut = root.querySelector("[data-emi-interest]"), rateOut = root.querySelector("[data-emi-rate]");
    function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
    function calc() {
      var P = +amtEl.value, n = +monEl.value, r = rate / 12 / 100;
      var emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1), total = emi * n;
      if (amtOut) amtOut.textContent = inr(P); if (monOut) monOut.textContent = n + " months";
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
     GSAP MOTION LAYER â smooth, professional, reduced-motion safe.
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

  /* count-up for stat numbers: keeps prefix (â¹), suffix (+, â) and en-IN grouping */
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

    /* layout shifts (fonts, lazy images, injected bands) â keep trigger positions honest */
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
      { id: "lf1", type: "form",
        fields: ["name","mobile","city","income","employment","pan","consent"],
        cta: "Get a call back"
      }
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
        fields: ["name","mobile","city"]
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
        fields: ["name","mobile","city","income"]
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
        fields: ["name","mobile","city"]
      }
    ],
    general: [
      { id: "gf1", type: "form",
        fields: ["name","mobile","city","income","employment","pan","consent"],
        cta: "Get a call back"
      }
    ]
  };

  var _qbData = {}, _qbStep = 0, _qbFlow = "general", _qbFixedType = null;

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

    /* Primary: our secure API server → MongoDB */
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
    if (step.type === "tiles") body.innerHTML = qbTileHTML(step);
    else if (step.type === "slider") body.innerHTML = qbSliderHTML(step);
    else if (step.type === "preview") body.innerHTML = qbPreviewHTML();
    else body.innerHTML = qbFormHTML(step);
    body.innerHTML += ""; // flush

    // back / next buttons
    var backBtn = box.querySelector(".qb-back");
    var nextBtn = box.querySelector(".qb-next");
    backBtn.style.display = _qbStep > 0 ? "" : "none";
    var isFinalStep = (step.type === "form" || step.type === "final");
    if (isFinalStep) {
      nextBtn.innerHTML = '<i data-lucide="shield-check"></i> ' + (step.cta || "Get FREE Offers");
      nextBtn.classList.add("qb-submit");
    } else {
      nextBtn.innerHTML = (step.cta || "Next") + ' <i data-lucide="arrow-right"></i>';
      nextBtn.classList.remove("qb-submit");
    }
    // tiles: auto-advance on click, hide Next button
    if (step.type === "tiles") { nextBtn.style.display = "none"; } else { nextBtn.style.display = ""; }

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
    if (!step || step.type === "tiles" || step.type === "slider" || step.type === "preview") return true;
    var fields = step.fields || [];
    var ok = true;
    box.querySelectorAll(".field").forEach(function(f){ f.classList.remove("invalid"); });
    var n = box.querySelector("[name=qb_name]"); if (n && fields.indexOf("name") > -1 && !n.value.trim()) { n.closest(".field").classList.add("invalid"); ok = false; }
    var m = box.querySelector("[name=qb_mobile]"); if (m && fields.indexOf("mobile") > -1 && !/^[6-9]\d{9}$/.test(m.value.trim())) { m.closest(".field").classList.add("invalid"); ok = false; }
    var c = box.querySelector("[name=qb_city]"); if (c && fields.indexOf("city") > -1 && !c.value.trim()) { c.closest(".field").classList.add("invalid"); ok = false; }
    var inc = box.querySelector("[name=qb_income]"); if (inc && fields.indexOf("income") > -1 && !inc.value) { inc.closest(".field").classList.add("invalid"); ok = false; }
    var emp = box.querySelector("[name=qb_employment]"); if (emp && fields.indexOf("employment") > -1 && !emp.value) { emp.closest(".field").classList.add("invalid"); ok = false; }
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
    var pan = box.querySelector("[name=qb_pan]"); if (pan && pan.value.trim()) _qbData.pan = pan.value.trim().toUpperCase();
  }

  function qbNext() {
    var flow = QB_STEPS[_qbFlow] || QB_STEPS.general;
    var step = flow[_qbStep];
    if (step.type === "form" || step.type === "final") {
      if (!qbValidateFormStep()) return;
      qbCollectFormData();
      qbSubmit();
      return;
    }
    // For contact/profile steps: validate + persist data before advancing
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
    /* Only allow the popup on loan, credit-card, insurance & investment pages */
    var p = location.pathname;
    var allowed =
      /index\.html/.test(p) || p === '/' || p.endsWith('/') ||
      /\/loans\//.test(p) ||
      /\/pages\/(credit-cards?|cashback-cards?|travel-cards?|rewards-cards?|secured-cards?|insurance|health-insurance|life-insurance|motor-insurance|travel-insurance|investments|sip|mutual-funds?|demat)\.html/.test(p);
    if (!allowed) return;
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
          '<h3>You\'re all set! 🎉</h3>' +
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
     STICKY OFFER BAR — appears after 40% scroll on product pages
     ============================================================ */
  function initStickyBar() {
    var bar = document.getElementById("cbStickyBar"); if (!bar) return;
    var shown = false;
    window.addEventListener("scroll", function() {
      var threshold = document.body.scrollHeight * 0.4;
      if (!shown && window.scrollY > threshold) {
        bar.classList.add("visible"); shown = true;
      }
    }, { passive: true });
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
    "\uD83C\uDFC6 4.7★ rated by 6,200+ customers",
    "\uD83D\uDCB0 ₹50,00,00,000+ disbursed to date",
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
    document.body.insertAdjacentHTML("beforeend", floatsHTML() + modalHTML() + cookieHTML() + qbPopupHTML());
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
    initTrustNudge();
  }
  function wireQb() {
    document.addEventListener("click", function(e) {
      // tile click → auto advance
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
    document.body.insertAdjacentHTML("beforeend", floatsHTML() + modalHTML() + cookieHTML() + qbPopupHTML());
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
