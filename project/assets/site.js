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
    leadEmail: "deepakjordy.bora@reddingtonglobal.com",
    phone: "1800 000 0000",
    phoneRaw: "18000000000",
    whatsapp: "910000000000",
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
  function LOGO_SRC() { return (window.__resources && window.__resources.cbLogo) || (BASE + "assets/logo-cashbridge.svg"); }

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
    ["secured-cards", "Secured Cards", "lock"]
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
    "Health Insurance": "हेल्थ बीमा", "Life Insurance": "जीवन बीमा", "Motor Insurance": "मोटर बीमा", "Travel Insurance": "ट्रैवल बीमा",
    "SIP": "एसआईपी", "Mutual Funds": "म्यूचुअल फंड", "Demat Account": "डीमैट अकाउंट",
    "EMI Calculator": "EMI कैलकुलेटर", "Free CIBIL Score": "मुफ़्त CIBIL स्कोर", "Eligibility Checker": "पात्रता जांचक",
    "Compare Loans": "लोन की तुलना करें", "Guides & Articles": "गाइड और लेख",
    // ---- hero A ----
    "Compare & apply from 30+ banks & NBFCs": "30+ बैंक और NBFC से तुलना करें और अप्लाई करें",
    "Borrow with": "साफ़ सोच के साथ", "a clear head.": "लोन पाएं।",
    "Compare and apply for personal, business, home and gold loans from India's leading banks & NBFCs — with EMIs you choose and a total you can see before you sign.":
      "भारत के प्रमुख बैंकों और NBFC से पर्सनल, बिज़नेस, होम और गोल्ड लोन की तुलना करें और अप्लाई करें — अपनी पसंद की EMI और साइन करने से पहले दिखने वाला कुल भुगतान।",
    "See how it works": "यह कैसे काम करता है देखें",
    "Money in 24 hours": "24 घंटे में पैसा", "Rates from 8.5% p.a.": "दरें 8.5% प्रतिवर्ष से", "Bank-grade secure": "बैंक-स्तरीय सुरक्षा",
    "Estimate your EMI": "अपनी EMI का अनुमान लगाएं", "Loan amount": "लोन राशि", "Tenure": "अवधि",
    "Monthly EMI": "मासिक EMI", "Check your rate": "अपनी दर जांचें",
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
      "मैं MyCashBridge को मेरी पूछताछ के बारे में संपर्क करने की अनुमति देता/देती हूँ। यह मेरे DND/NDNC रजिस्ट्रेशन पर लागू होता है।",
    "Get my free call back": "मेरा मुफ़्त कॉल बैक पाएं",
    "Thank you — we've got your request.": "धन्यवाद — आपका अनुरोध मिल गया है।",
    "A MyCashBridge loan expert will call you within 24 hours. Please keep your phone handy.":
      "MyCashBridge का लोन विशेषज्ञ 24 घंटे के भीतर आपको कॉल करेगा। कृपया अपना फ़ोन पास रखें।",
    // ---- hero C ----
    "A lending service provider you can trust (LSP & DSA)": "एक भरोसेमंद लेंडिंग सर्विस प्रोवाइडर (LSP और DSA)",
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
    "Every loan shows your EMI and total payable up front. No surprises at signing, no hidden charges.":
      "हर लोन में आपकी EMI और कुल देय राशि पहले ही दिख जाती है। साइन करते समय कोई आश्चर्य नहीं, कोई छिपा शुल्क नहीं।",
    "Check rate": "दर जांचें",
    "PERSONAL LOAN": "पर्सनल लोन", "BUSINESS LOAN": "बिज़नेस लोन", "HOME LOAN": "होम लोन",
    "GOLD LOAN": "गोल्ड लोन", "CAR LOAN": "कार लोन", "EDUCATION LOAN": "एजुकेशन लोन",
    "Up to ₹40,00,000": "₹40,00,000 तक", "Up to ₹75,00,000": "₹75,00,000 तक", "Up to ₹5 Cr": "₹5 करोड़ तक",
    "Up to ₹50,00,000": "₹50,00,000 तक", "Up to ₹1,00,00,000": "₹1,00,00,000 तक", "Up to ₹1.5 Cr": "₹1.5 करोड़ तक",
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
    "Hand-picked offers from": "चुनिंदा ऑफर", "30+ lenders": "30+ ऋणदाताओं से",
    "Money in minutes via": "मिनटों में पैसा", "pre-approved loans": "प्री-अप्रूव्ड लोन के ज़रिए",
    "Instant": "तुरंत", "sanction & disbursal": "मंज़ूरी और वितरण",
    "No hidden charges": "कोई छिपा शुल्क नहीं", "— what you see is what you pay": "— जो दिखे वही चुकाएं",
    "Money in minutes via pre-approved offers": "प्री-अप्रूव्ड ऑफर से मिनटों में पैसा",
    "Quick sanction & disbursal": "तेज़ मंज़ूरी और वितरण",
    "30+ partners": "30+ साझेदार", "Banks & NBFCs in one place": "बैंक और NBFC एक ही जगह",
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
    "A Lending Service Provider (LSP) & Direct Selling Agent (DSA) helping you compare and apply for loans, cards and more from leading banks & NBFCs — with clear EMIs and honest guidance.":
      "एक लेंडिंग सर्विस प्रोवाइडर (LSP) और डायरेक्ट सेलिंग एजेंट (DSA) जो आपको प्रमुख बैंकों और NBFC से लोन, कार्ड और बहुत कुछ की तुलना और आवेदन में मदद करता है — स्पष्ट EMI और ईमानदार मार्गदर्शन के साथ।",
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
    "Founder, MyCashBridge": "संस्थापक, MyCashBridge", "Founder, MyCashBridge": "संस्थापक, MyCashBridge"
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
      '<a class="nav-logo lockup" href="' + BASE + 'index.html"><img src="' + LOGO_SRC() + '" alt="' + CFG.brand + '"><span class="nav-tagline">' + CFG.tagline + '</span></a>' +
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
      '<div class="drawer-head"><img src="' + LOGO_SRC() + '" alt="' + CFG.brand + '"><button class="drawer-close" data-drawer-close><i data-lucide="x"></i></button></div>' +
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
      '<span class="wp"><i data-lucide="check-circle-2"></i> Hand-picked offers from <b style="margin-left:4px">30+ lenders</b></span>' +
      '<span class="wp"><i data-lucide="zap"></i> Money in minutes via pre-approved offers</span>' +
      '<span class="wp"><i data-lucide="badge-check"></i> Quick sanction &amp; disbursal</span>' +
      '</div></section>';
  }

  /* ============================================================
     FOOTER (DSA-aligned, real policy links, 5 columns)
     ============================================================ */
  function footerHTML() {
    var loanLinks = LOANS.slice(0, 5).map(function (l) { return '<a href="' + BASE + 'loans/' + l[0] + '.html">' + l[1] + '</a>'; }).join("");
    var prodLinks = '<a href="' + BASE + 'pages/credit-cards.html">Credit Cards</a><a href="' + BASE + 'pages/insurance.html">Insurance</a><a href="' + BASE + 'pages/investments.html">Investments</a><a href="' + BASE + 'tools/compare.html">Compare</a>';
    var guideLinks = '<a href="' + BASE + 'guides/best-personal-loan-india.html">Best Personal Loan</a><a href="' + BASE + 'guides/loan-for-low-cibil.html">Loan for Low CIBIL</a><a href="' + BASE + 'guides/business-loan-for-msme.html">Business Loan for MSMEs</a><a href="' + BASE + 'guides/how-to-improve-credit-score.html">Improve Credit Score</a>';
    var legal = [
      ["privacy-policy", "Privacy Policy"], ["terms", "Terms & Conditions"], ["disclaimer", "Disclaimer"],
      ["grievance", "Grievance Redressal"], ["cookie-policy", "Cookie Policy"], ["refund-policy", "Refund & Cancellation"],
      ["fair-practices", "Fair Practices Code"], ["consent-policy", "Consent & Communication"]
    ].map(function (p) { return '<a href="' + BASE + 'pages/' + p[0] + '.html">' + p[1] + '</a>'; }).join("");
    return '<footer class="footer"><div class="wrap footer-grid cols5">' +
      '<div>' +
        '<img src="' + LOGO_SRC() + '" alt="' + CFG.brand + '" style="height:34px">' +
        '<p class="footer-tagline">' + CFG.tagline + '</p>' +
        '<p class="desc">A Lending Service Provider (LSP) & Direct Selling Agent (DSA) helping you compare and apply for loans, cards and more from leading banks & NBFCs — with clear EMIs and honest guidance.</p>' +
        '<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap"><span class="pill pill-reward"><i data-lucide="shield-check"></i> ISO 27001</span><span class="pill pill-approved"><i data-lucide="lock"></i> 256-bit SSL</span></div>' +
      '</div>' +
      '<div class="footer-col"><h4>Loans</h4>' + loanLinks + '<a href="' + BASE + 'tools/emi-calculator.html">EMI Calculator</a></div>' +
      '<div class="footer-col"><h4>Products</h4>' + prodLinks + '</div>' +
      '<div class="footer-col"><h4>Popular Guides</h4>' + guideLinks + '</div>' +
      '<div class="footer-col"><h4>Legal</h4>' + legal + '</div>' +
    '</div>' +
    '<div class="footer-legal">' +
      '<p class="footer-disc"><strong data-i18n="foot.disc_label">Disclaimer:</strong> <span data-i18n="disc.text">MyCashBridge is a Lending Service Provider (LSP) / Direct Selling Agent (DSA) and is not a bank, NBFC or financial institution. We only facilitate customer applications for financial products offered by partner banks and NBFCs. Loan approvals, interest rates, credit limits, processing fees and related terms are determined solely by the respective financial institution based on its policies and your eligibility. We do not guarantee approval of any product and never charge customers a fee for standard applications.</span></p>' +
      '<p class="footer-disc" style="margin-top:10px">Registered office: [Office address line], India &nbsp;·&nbsp; CIN: [U00000XX0000XXX000000] &nbsp;·&nbsp; GSTIN: [00XXXXX0000X0X0] &nbsp;·&nbsp; Support: <a href="mailto:' + CFG.leadEmail + '">' + CFG.leadEmail + '</a></p>' +
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
    return '<form class="lead-form" data-loan="' + (loanLabel || "") + '" novalidate><div class="form-grid">' +
      '<div class="field full"><label>Full name</label><input name="name" type="text" placeholder="e.g. Rohan Sharma" autocomplete="name"><span class="err">Please enter your name</span></div>' +
      '<div class="field"><label>Mobile number</label><div class="tel-wrap"><span class="cc">+91</span><input name="mobile" type="tel" inputmode="numeric" maxlength="10" placeholder="10-digit mobile" autocomplete="tel-national"></div><span class="err">Enter a valid 10-digit mobile</span></div>' +
      '<div class="field"><label>City</label><input name="city" type="text" placeholder="e.g. Pune"><span class="err">Please enter your city</span></div>' +
      '<div class="field"><label>Monthly income</label><select name="income"><option value="">Select range</option><option>Below ₹25,000</option><option>₹25,000 – ₹50,000</option><option>₹50,000 – ₹1,00,000</option><option>Above ₹1,00,000</option></select><span class="err">Select your income range</span></div>' +
      '<div class="field"><label>Employment type</label><div class="seg" data-seg="employment"><div class="seg-opt" data-val="Salaried">Salaried</div><div class="seg-opt" data-val="Self-employed">Self-employed</div><div class="seg-opt" data-val="Business owner">Business</div><input type="hidden" name="employment"></div><span class="err">Select one</span></div>' +
      '<div class="field full"><label>PAN <span class="opt">(optional)</span></label><input name="pan" type="text" maxlength="10" placeholder="ABCDE1234F" style="text-transform:uppercase"></div>' +
      '<div class="field full"><div class="consent"><input type="checkbox" name="consent" id="' + ctx + '-consent"><label for="' + ctx + '-consent">I authorise ' + CFG.brand + ' and its partner banks/NBFCs to contact me regarding my enquiry via call, SMS, email or WhatsApp, and I accept the Terms & Privacy Policy. This overrides my DND/NDNC registration.</label></div><span class="err">Please accept to continue</span></div>' +
      '</div><button class="btn btn-filled btn-block btn-lg" type="submit" style="margin-top:18px"><span class="btn-label"><i data-lucide="shield-check"></i> Get a call back</span></button>' +
      '<p style="text-align:center;font-size:12px;color:var(--text-soft);margin:12px 0 0">By continuing you agree it won\'t affect your credit score. We never charge a fee to apply.</p></form>';
  }
  window.cbFormFields = formFieldsHTML;
  function thanksHTML() {
    return '<div class="thanks"><div class="confetti"></div>' +
      '<svg class="check-ring" viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="46"></circle><circle class="ring" cx="50" cy="50" r="42"></circle><path class="tick" d="M32 51 L45 64 L69 38"></path></svg>' +
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
      var payload = { _subject: "New " + loan + " lead — " + CFG.brand, _template: "table", _captcha: "false",
        product: loan, name: data.get("name") || "", mobile: "+91 " + (data.get("mobile") || ""), city: data.get("city") || "",
        monthly_income: data.get("income") || "", employment: data.get("employment") || "", pan: data.get("pan") || "—",
        consent: data.get("consent") ? "Yes" : "No", source_page: location.pathname, submitted_at: new Date().toLocaleString("en-IN") };
      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(CFG.leadEmail), { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) }).catch(function () {});
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
  function saveConsent(obj) { localStorage.setItem("cb_cookie", JSON.stringify(Object.assign({ ts: Date.now() }, obj))); enforceBlocking(); }
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
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeModal(); closeDrawer(); var ck = document.getElementById("ckModal"); if (ck) ck.classList.remove("open"); } });
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
    credit_card: [
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

  /*
   * qbLead — dual-track submission
   *   1. Primary: POST /api/lead to our own Express server (MongoDB)
   *   2. Fallback: formsubmit.co email notification if API unreachable
   *   The MongoDB URI never appears here — it lives in server/.env
   */
  function qbLead(data) {
    var productLabel = data.loan_type || data.insurance_type || data.card_type ||
                       data.invest_type || data.product_type || "General";
    var payload = Object.assign(
      {},
      data,
      getUtm(),
      {
        source_page:  location.pathname,
        submitted_at: new Date().toLocaleString("en-IN"),
        _hp:          ""   /* honeypot — must always be empty from real users */
      }
    );

    /* Track locally so we can show "already submitted" UX next visit */
    try { sessionStorage.setItem("cb_lead_sent", "1"); } catch(e) {}

    /* 1️⃣ Primary: our secure API server → MongoDB */
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
      /* 2️⃣ Fallback: formsubmit.co email (fires only if API is down) */
      var fsPayload = Object.assign(
        { _subject: "Lead — " + CFG.brand + " (" + productLabel + ")",
          _template: "table", _captcha: "false" },
        payload
      );
      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(CFG.leadEmail), {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body:    JSON.stringify(fsPayload)
      }).catch(function(){});
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
    /* Honeypot: hidden from real users via CSS, bots fill it → server drops submission */
    html += '<div class="hp-field" aria-hidden="true"><input name="_hp" type="text" tabindex="-1" autocomplete="off"></div>';
    if (f.indexOf("name") > -1) html += '<div class="field full"><label>Full name</label><input name="qb_name" type="text" placeholder="e.g. Rohan Sharma" autocomplete="name"><span class="err">Please enter your name</span></div>';
    if (f.indexOf("mobile") > -1) html += '<div class="field full"><label>Mobile number</label><div class="tel-wrap"><span class="cc">+91</span><input name="qb_mobile" type="tel" inputmode="numeric" maxlength="10" placeholder="10-digit mobile" autocomplete="tel-national"></div><span class="err">Enter a valid 10-digit mobile</span></div>';
    if (f.indexOf("city") > -1) html += '<div class="field"><label>City</label><input name="qb_city" type="text" placeholder="e.g. Pune"><span class="err">Required</span></div>';
    if (f.indexOf("income") > -1) html += '<div class="field"><label>Monthly income</label><select name="qb_income"><option value="">Select range</option><option>Below \u20B925,000</option><option>\u20B925,000 \u2013 \u20B950,000</option><option>\u20B950,000 \u2013 \u20B91,00,000</option><option>Above \u20B91,00,000</option></select><span class="err">Required</span></div>';
    if (f.indexOf("employment") > -1) html += '<div class="field full"><label>Employment type</label><div class="seg qb-seg" data-seg="qb_employment"><div class="seg-opt" data-val="Salaried">Salaried</div><div class="seg-opt" data-val="Self-employed">Self-employed</div><div class="seg-opt" data-val="Business owner">Business</div><input type="hidden" name="qb_employment"></div><span class="err">Select one</span></div>';
    html += '<div class="field full"><div class="consent"><input type="checkbox" name="qb_consent" id="qb-consent"><label for="qb-consent">I authorise ' + CFG.brand + ' and its partner banks/NBFCs to contact me via call, SMS, email or WhatsApp. This overrides my DND/NDNC registration.</label></div><span class="err">Please accept to continue</span></div>';
    html += '</div>';
    return html;
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

    // body
    var body = box.querySelector(".qb-body");
    if (step.type === "tiles") body.innerHTML = qbTileHTML(step);
    else if (step.type === "slider") body.innerHTML = qbSliderHTML(step);
    else if (step.type === "form") body.innerHTML = '<div class="form-grid">' + qbFormHTML(step) + '</div>';
    body.innerHTML += ""; // flush

    // back / next
    var backBtn = box.querySelector(".qb-back");
    var nextBtn = box.querySelector(".qb-next");
    backBtn.style.display = _qbStep > 0 ? "" : "none";
    if (step.type === "form") {
      nextBtn.innerHTML = '<i data-lucide="shield-check"></i> Get FREE Offers';
      nextBtn.classList.add("qb-submit");
    } else {
      nextBtn.innerHTML = 'Next <i data-lucide="arrow-right"></i>';
      nextBtn.classList.remove("qb-submit");
    }
    // if tile, auto-advance
    if (step.type === "tiles") nextBtn.style.display = "none"; else nextBtn.style.display = "";

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
    relucide();
  }

  function qbValidateFormStep() {
    var box = document.getElementById("qbPopup"); if (!box) return true;
    var ok = true;
    box.querySelectorAll(".field").forEach(function(f){ f.classList.remove("invalid"); });
    var n = box.querySelector("[name=qb_name]"); if (n && !n.value.trim()) { n.closest(".field").classList.add("invalid"); ok = false; }
    var m = box.querySelector("[name=qb_mobile]"); if (m && !/^[6-9]\d{9}$/.test(m.value.trim())) { m.closest(".field").classList.add("invalid"); ok = false; }
    var c = box.querySelector("[name=qb_city]"); if (c && !c.value.trim()) { c.closest(".field").classList.add("invalid"); ok = false; }
    var inc = box.querySelector("[name=qb_income]"); if (inc && !inc.value) { inc.closest(".field").classList.add("invalid"); ok = false; }
    var emp = box.querySelector("[name=qb_employment]"); if (emp && !emp.value) { emp.closest(".field").classList.add("invalid"); ok = false; }
    var con = box.querySelector("[name=qb_consent]"); if (con && !con.checked) { con.closest(".field").classList.add("invalid"); ok = false; }
    return ok;
  }

  function qbCollectFormData() {
    var box = document.getElementById("qbPopup"); if (!box) return;
    var n = box.querySelector("[name=qb_name]"); if (n) _qbData.name = n.value.trim();
    var m = box.querySelector("[name=qb_mobile]"); if (m) _qbData.mobile = "+91 " + m.value.trim();
    var c = box.querySelector("[name=qb_city]"); if (c) _qbData.city = c.value.trim();
    var inc = box.querySelector("[name=qb_income]"); if (inc) _qbData.monthly_income = inc.value;
    var emp = box.querySelector("[name=qb_employment]"); if (emp) _qbData.employment = emp.value;
  }

  function qbNext() {
    var flow = QB_STEPS[_qbFlow] || QB_STEPS.general;
    var step = flow[_qbStep];
    if (step.type === "form") {
      if (!qbValidateFormStep()) return;
      qbCollectFormData();
      qbSubmit();
      return;
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
    if (fixedType) {
      var f = QB_STEPS[_qbFlow] || QB_STEPS.general;
      if (f[0] && f[0].type === "tiles") {
        _qbData[f[0].field] = fixedType;
        _qbStep = 1;
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
          '<button class="qb-close" id="qbClose" aria-label="Close" style="display:none"><i data-lucide="x"></i></button>' +
        '</div>' +
        '<div class="qb-progress"><div class="qb-progress-fill" style="width:0%"></div></div>' +
        '<div class="qb-step-counter">Step 1 of 3</div>' +
        '<div class="qb-content">' +
          '<h3 class="qb-step-title">What type of loan do you need?</h3>' +
          '<div class="qb-body"></div>' +
          '<div class="qb-actions">' +
            '<button class="btn btn-ghost btn-sm qb-back" id="qbBack" style="display:none"><i data-lucide="arrow-left"></i> Back</button>' +
            '<button class="btn btn-filled qb-next" id="qbNext">Next <i data-lucide="arrow-right"></i></button>' +
          '</div>' +
          '<p class="qb-disclaimer">By continuing you agree that it won\'t affect your credit score. We never charge a fee to apply. <a href="' + BASE + 'pages/privacy-policy.html">Privacy Policy</a></p>' +
        '</div>' +
        '<div class="qb-thanks">' +
          '<div class="confetti"></div>' +
          '<svg class="check-ring" viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="46"></circle><circle class="ring" cx="50" cy="50" r="42"></circle><path class="tick" d="M32 51 L45 64 L69 38"></path></svg>' +
          '<h3>You\'re all set! 🎉</h3>' +
          '<p>A MyCashBridge expert will call you within <strong>24 hours</strong> with the best offers. Keep your phone handy.</p>' +
          '<div class="qb-ref"></div>' +
          '<button class="btn btn-filled" onclick="document.getElementById(\'qbPopup\').classList.remove(\'open\');document.body.style.overflow=\'\'">Done</button>' +
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
    "\uD83D\uDCB0 ₹50 Cr+ disbursed to date",
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
    if (foot) foot.insertAdjacentHTML("beforebegin", whyStripHTML());
    if (foot) foot.innerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", floatsHTML() + modalHTML() + cookieHTML() + qbPopupHTML());
    wire(); wireCookies(); wireQb();
    document.querySelectorAll("[data-emi]").forEach(initEmi);
    applyLang(); relucide();
    initReveal();
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
      // back
      if (e.target.closest("#qbBack")) { if (_qbStep > 0) { _qbStep--; qbRenderStep(); } return; }
      // next/submit
      if (e.target.closest("#qbNext")) { qbNext(); return; }
      // close
      if (e.target.closest("#qbClose") || e.target.closest("#qbScrim")) { closeQbPopup(); return; }
    });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeQbPopup(); });
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
    if (foot) foot.insertAdjacentHTML("beforebegin", whyStripHTML());
    if (foot) foot.innerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", floatsHTML() + modalHTML() + cookieHTML() + qbPopupHTML());
    wire(); wireCookies(); wireQb();
    document.querySelectorAll("[data-emi]").forEach(initEmi);
    applyLang(); relucide();
    initReveal();
    initStickyBar();
    initExitIntent();
    initTrustNudge();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
