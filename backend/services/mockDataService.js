const hospitalsSeed = [
  {
    _id: "hosp-001",
    name: "Dhaka Medical College Hospital (DMCH)",
    banglaName: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
    type: "public",
    district: "Dhaka",
    upazila: "Ramna",
    address: "Secretariat Road, Dhaka-1000",
    phone: "02-55165001",
    emergencyHotline: "01711-234567",
    coordinates: { lat: 23.7259, lng: 90.3976 },
    beds: {
      general: { total: 2600, available: 142 },
      icu: { total: 32, available: 4 },
      ccu: { total: 20, available: 2 },
      nicu: { total: 25, available: 3 }
    },
    facilities: ["Oxygen Plant", "Burn Unit", "Dialysis Center", "Trauma Center", "Blood Bank", "24/7 Pharmacy"],
    opdQueue: { currentWaiting: 48, avgWaitMinutes: 35, activeDoctors: 12 },
    doctorRoster: [
      { doctorName: "Dr. Rafiqul Islam, FCPS", specialty: "Cardiology & Emergency", shift: "Morning", roomNo: "OPD-102", available: true },
      { doctorName: "Dr. Farhana Yasmin, MS", specialty: "General Surgery", shift: "Morning", roomNo: "Room-204", available: true },
      { doctorName: "Dr. Tanvir Ahmed, MD", specialty: "Internal Medicine", shift: "Evening", roomNo: "OPD-105", available: true },
      { doctorName: "Dr. Sabina Begum, FCPS", specialty: "Pediatrics", shift: "Night", roomNo: "ER-02", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  },
  {
    _id: "hosp-002",
    name: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
    banglaName: "বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়",
    type: "specialized",
    district: "Dhaka",
    upazila: "Shahbagh",
    address: "Shahbagh, Dhaka-1000",
    phone: "02-9661051",
    emergencyHotline: "01730-324567",
    coordinates: { lat: 23.7388, lng: 90.3956 },
    beds: {
      general: { total: 1900, available: 85 },
      icu: { total: 45, available: 6 },
      ccu: { total: 28, available: 4 },
      nicu: { total: 30, available: 5 }
    },
    facilities: ["Super Specialized Hospital", "Cath Lab", "Organ Transplant", "Oncology", "Dialysis Center"],
    opdQueue: { currentWaiting: 62, avgWaitMinutes: 45, activeDoctors: 15 },
    doctorRoster: [
      { doctorName: "Prof. Dr. M. A. Karim", specialty: "Neurology", shift: "Morning", roomNo: "Block C-301", available: true },
      { doctorName: "Dr. Nasreen Sultana", specialty: "Endocrinology", shift: "Morning", roomNo: "Block D-102", available: true },
      { doctorName: "Dr. Monirul Haque", specialty: "Nephrology", shift: "Evening", roomNo: "Block B-205", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  },
  {
    _id: "hosp-003",
    name: "National Institute of Cardiovascular Diseases (NICVD)",
    banglaName: "জাতীয় হৃদরোগ ইনস্টিটিউট ও হাসপাতাল",
    type: "specialized",
    district: "Dhaka",
    upazila: "Sher-e-Bangla Nagar",
    address: "Sher-e-Bangla Nagar, Dhaka-1207",
    phone: "02-9122560",
    emergencyHotline: "01819-876543",
    coordinates: { lat: 23.7709, lng: 90.3705 },
    beds: {
      general: { total: 1250, available: 35 },
      icu: { total: 50, available: 3 },
      ccu: { total: 60, available: 5 },
      nicu: { total: 10, available: 1 }
    },
    facilities: ["Cardiac Catheterization", "Open Heart Surgery", "24/7 Cardiac ER", "Echocardiography"],
    opdQueue: { currentWaiting: 75, avgWaitMinutes: 50, activeDoctors: 10 },
    doctorRoster: [
      { doctorName: "Dr. Zahirul Islam, FCPS", specialty: "Interventional Cardiology", shift: "Morning", roomNo: "Cath-01", available: true },
      { doctorName: "Dr. Shireen Akhter, MD", specialty: "Cardiac Surgery", shift: "Evening", roomNo: "ER-Cardio", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  },
  {
    _id: "hosp-004",
    name: "Shaheed Suhrawardy Medical College Hospital",
    banglaName: "শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ হাসপাতাল",
    type: "public",
    district: "Dhaka",
    upazila: "Sher-e-Bangla Nagar",
    address: "Sher-e-Bangla Nagar, Dhaka-1207",
    phone: "02-9130800",
    emergencyHotline: "01722-112233",
    coordinates: { lat: 23.7692, lng: 90.3727 },
    beds: {
      general: { total: 850, available: 62 },
      icu: { total: 20, available: 2 },
      ccu: { total: 16, available: 3 },
      nicu: { total: 18, available: 2 }
    },
    facilities: ["Trauma Center", "General Surgery", "Pediatric Wing", "Orthopedics"],
    opdQueue: { currentWaiting: 40, avgWaitMinutes: 30, activeDoctors: 8 },
    doctorRoster: [
      { doctorName: "Dr. Asaduzzaman, MS", specialty: "Orthopedics", shift: "Morning", roomNo: "Room-104", available: true },
      { doctorName: "Dr. Rumana Parveen", specialty: "Gynecology", shift: "Evening", roomNo: "Room-201", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  },
  {
    _id: "hosp-005",
    name: "Evercare Hospital Dhaka",
    banglaName: "এভারকেয়ার হাসপাতাল ঢাকা",
    type: "private",
    district: "Dhaka",
    upazila: "Bashundhara",
    address: "Plot 81, Block E, Bashundhara R/A, Dhaka-1229",
    phone: "10678",
    emergencyHotline: "01714-090000",
    coordinates: { lat: 23.8136, lng: 90.4347 },
    beds: {
      general: { total: 425, available: 94 },
      icu: { total: 48, available: 11 },
      ccu: { total: 24, available: 7 },
      nicu: { total: 20, available: 6 }
    },
    facilities: ["JCI Accredited", "Air Ambulance Liaison", "Advanced Robotic Surgery", "Comprehensive Cancer Center"],
    opdQueue: { currentWaiting: 15, avgWaitMinutes: 15, activeDoctors: 22 },
    doctorRoster: [
      { doctorName: "Dr. Shams Munir, FRCP", specialty: "Critical Care", shift: "Morning", roomNo: "ICU Wing A", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  },
  {
    _id: "hosp-006",
    name: "Square Hospital",
    banglaName: "স্কয়ার হাসপাতাল",
    type: "private",
    district: "Dhaka",
    upazila: "Panthapath",
    address: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka",
    phone: "10616",
    emergencyHotline: "01713-377775",
    coordinates: { lat: 23.7533, lng: 90.3816 },
    beds: {
      general: { total: 400, available: 72 },
      icu: { total: 40, available: 8 },
      ccu: { total: 22, available: 5 },
      nicu: { total: 18, available: 4 }
    },
    facilities: ["24/7 Stroke Unit", "Advanced Trauma Surgery", "Neonatal Intensive Care", "Helipad Access"],
    opdQueue: { currentWaiting: 18, avgWaitMinutes: 20, activeDoctors: 20 },
    doctorRoster: [
      { doctorName: "Dr. Khaled Mahmud, FCPS", specialty: "Emergency Medicine", shift: "Morning", roomNo: "ER-Square", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  },
  {
    _id: "hosp-007",
    name: "Chittagong Medical College Hospital (CMCH)",
    banglaName: "চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল",
    type: "public",
    district: "Chittagong",
    upazila: "Panchlaish",
    address: "57 K.B. Fazlul Kader Road, Chittagong",
    phone: "031-619400",
    emergencyHotline: "01711-998877",
    coordinates: { lat: 22.3592, lng: 91.8285 },
    beds: {
      general: { total: 2200, available: 110 },
      icu: { total: 30, available: 3 },
      ccu: { total: 18, available: 2 },
      nicu: { total: 22, available: 4 }
    },
    facilities: ["Regional Burn Unit", "Trauma Center", "Renal Dialysis", "24/7 Emergency Wing"],
    opdQueue: { currentWaiting: 55, avgWaitMinutes: 40, activeDoctors: 12 },
    doctorRoster: [
      { doctorName: "Dr. Manzurul Islam, FCPS", specialty: "Trauma Surgery", shift: "Morning", roomNo: "Room-10", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  },
  {
    _id: "hosp-008",
    name: "Sylhet MAG Osmani Medical College Hospital",
    banglaName: "সিলেট এম.এ.জি ওসমানী মেডিকেল কলেজ হাসপাতাল",
    type: "public",
    district: "Sylhet",
    upazila: "Kajalshah",
    address: "Medical Road, Kajalshah, Sylhet-3100",
    phone: "0821-713667",
    emergencyHotline: "01715-443322",
    coordinates: { lat: 24.8988, lng: 91.8542 },
    beds: {
      general: { total: 1500, available: 78 },
      icu: { total: 24, available: 4 },
      ccu: { total: 14, available: 2 },
      nicu: { total: 16, available: 3 }
    },
    facilities: ["Regional Flood Trauma Center", "ICU Support", "Dialysis Center"],
    opdQueue: { currentWaiting: 38, avgWaitMinutes: 30, activeDoctors: 9 },
    doctorRoster: [
      { doctorName: "Dr. Kabir Ahmed, MD", specialty: "Infectious Diseases", shift: "Morning", roomNo: "OPD-03", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  },
  {
    _id: "hosp-009",
    name: "Kurmitola General Hospital",
    banglaName: "কুর্মিটোলা জেনারেল হাসপাতাল",
    type: "public",
    district: "Dhaka",
    upazila: "Dhaka Cantonment",
    address: "Airport Road, Dhaka Cantonment, Dhaka",
    phone: "02-55067676",
    emergencyHotline: "01769-010200",
    coordinates: { lat: 23.8223, lng: 90.4074 },
    beds: {
      general: { total: 500, available: 52 },
      icu: { total: 28, available: 5 },
      ccu: { total: 12, available: 3 },
      nicu: { total: 14, available: 3 }
    },
    facilities: ["Infectious Disease Triage", "Respiratory ICU", "Covid/Dengue Specialized Ward"],
    opdQueue: { currentWaiting: 28, avgWaitMinutes: 25, activeDoctors: 7 },
    doctorRoster: [
      { doctorName: "Dr. Shahinur Rahman", specialty: "Respiratory Medicine", shift: "Morning", roomNo: "Room-12", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  },
  {
    _id: "hosp-010",
    name: "Mugda Medical College Hospital",
    banglaName: "মুগদা মেডিকেল কলেজ হাসপাতাল",
    type: "public",
    district: "Dhaka",
    upazila: "Mugda",
    address: "Mugda, Dhaka-1214",
    phone: "02-7278278",
    emergencyHotline: "01712-887766",
    coordinates: { lat: 23.7297, lng: 90.4328 },
    beds: {
      general: { total: 600, available: 41 },
      icu: { total: 18, available: 2 },
      ccu: { total: 10, available: 1 },
      nicu: { total: 12, available: 2 }
    },
    facilities: ["Dengue Dedicated Ward", "General Surgery", "24/7 Blood Transfusion"],
    opdQueue: { currentWaiting: 42, avgWaitMinutes: 32, activeDoctors: 8 },
    doctorRoster: [
      { doctorName: "Dr. Morshed Alam", specialty: "Internal Medicine", shift: "Morning", roomNo: "Room-05", available: true }
    ],
    surgeTriageActive: false,
    lastUpdated: new Date()
  }
];

const donorsSeed = [
  { _id: "don-001", name: "Tanvir Hasan", phone: "01711-001122", bloodGroup: "O+", district: "Dhaka", upazila: "Mirpur", isAvailable: true, donationCount: 7, heroBadge: "Silver" },
  { _id: "don-002", name: "Nusrat Jahan", phone: "01819-223344", bloodGroup: "A+", district: "Dhaka", upazila: "Dhanmondi", isAvailable: true, donationCount: 4, heroBadge: "Bronze" },
  { _id: "don-003", name: "Arifur Rahman", phone: "01912-334455", bloodGroup: "B+", district: "Dhaka", upazila: "Uttara", isAvailable: true, donationCount: 14, heroBadge: "Gold" },
  { _id: "don-004", name: "Kazi Saiful Islam", phone: "01678-445566", bloodGroup: "AB+", district: "Dhaka", upazila: "Mohakhali", isAvailable: true, donationCount: 2, heroBadge: "Bronze" },
  { _id: "don-005", name: "Shahadat Hossain", phone: "01723-556677", bloodGroup: "O-", district: "Dhaka", upazila: "Gulshan", isAvailable: true, donationCount: 19, heroBadge: "LifeSaver Champion" },
  { _id: "don-006", name: "Sadia Afroz", phone: "01552-667788", bloodGroup: "A-", district: "Dhaka", upazila: "Badda", isAvailable: true, donationCount: 6, heroBadge: "Silver" },
  { _id: "don-007", name: "Rezaul Karim", phone: "01844-778899", bloodGroup: "B-", district: "Dhaka", upazila: "Old Dhaka", isAvailable: true, donationCount: 8, heroBadge: "Silver" },
  { _id: "don-008", name: "Mehedi Hasan Niloy", phone: "01999-889900", bloodGroup: "AB-", district: "Dhaka", upazila: "Shahbagh", isAvailable: true, donationCount: 5, heroBadge: "Silver" },
  { _id: "don-009", name: "Kamrul Islam", phone: "01711-121212", bloodGroup: "O+", district: "Chittagong", upazila: "Agrabad", isAvailable: true, donationCount: 11, heroBadge: "Gold" },
  { _id: "don-010", name: "Farhana Dilshad", phone: "01819-343434", bloodGroup: "A+", district: "Chittagong", upazila: "Panchlaish", isAvailable: true, donationCount: 3, heroBadge: "Bronze" },
  { _id: "don-011", name: "Tariqul Islam", phone: "01733-565656", bloodGroup: "B+", district: "Sylhet", upazila: "Zindabazar", isAvailable: true, donationCount: 9, heroBadge: "Silver" },
  { _id: "don-012", name: "Zubair Al Mamun", phone: "01688-787878", bloodGroup: "O-", district: "Sylhet", upazila: "Amberkhana", isAvailable: true, donationCount: 16, heroBadge: "LifeSaver Champion" }
];

const medicinesSeed = [
  {
    _id: "med-001",
    brandName: "Napa Extra",
    genericName: "Paracetamol + Caffeine",
    strength: "500mg + 65mg",
    dosageForm: "Tablet",
    manufacturer: "Beximco Pharmaceuticals Ltd.",
    dgdaMaxPrice: 3.00,
    marketPrice: 3.50,
    therapeuticClass: "Analgesic & Antipyretic",
    isBannedOrRecalled: false,
    cheaperGenerics: [
      { brandName: "Ace Plus", manufacturer: "Square Pharmaceuticals", price: 3.00, savingsPercent: 14 },
      { brandName: "Fast Plus", manufacturer: "Acme Laboratories", price: 2.75, savingsPercent: 21 },
      { brandName: "Pyrigesic Plus", manufacturer: "Incepta", price: 2.80, savingsPercent: 20 }
    ]
  },
  {
    _id: "med-002",
    brandName: "Cef-3",
    genericName: "Cefixime",
    strength: "200mg",
    dosageForm: "Capsule",
    manufacturer: "Square Pharmaceuticals",
    dgdaMaxPrice: 40.00,
    marketPrice: 42.00,
    therapeuticClass: "Third Generation Cephalosporin Antibiotic",
    isBannedOrRecalled: false,
    cheaperGenerics: [
      { brandName: "Fixolin", manufacturer: "Renata Limited", price: 36.00, savingsPercent: 14 },
      { brandName: "T-Cef", manufacturer: "Popular Pharmaceuticals", price: 35.00, savingsPercent: 16 },
      { brandName: "Denicef", manufacturer: "Delta Pharma", price: 32.00, savingsPercent: 23 }
    ]
  },
  {
    _id: "med-003",
    brandName: "Nexum 20",
    genericName: "Esomeprazole",
    strength: "20mg",
    dosageForm: "Tablet",
    manufacturer: "Beximco Pharmaceuticals Ltd.",
    dgdaMaxPrice: 7.00,
    marketPrice: 8.00,
    therapeuticClass: "Proton Pump Inhibitor (Anti-ulcerant)",
    isBannedOrRecalled: false,
    cheaperGenerics: [
      { brandName: "Maxpro 20", manufacturer: "Square Pharmaceuticals", price: 7.00, savingsPercent: 12 },
      { brandName: "Sergel 20", manufacturer: "Healthcare Pharmaceuticals", price: 7.00, savingsPercent: 12 },
      { brandName: "Progut 20", manufacturer: "Beximco", price: 6.50, savingsPercent: 18 }
    ]
  },
  {
    _id: "med-004",
    brandName: "Monas 10",
    genericName: "Montelukast",
    strength: "10mg",
    dosageForm: "Tablet",
    manufacturer: "Acme Laboratories",
    dgdaMaxPrice: 16.00,
    marketPrice: 17.50,
    therapeuticClass: "Leukotriene Receptor Antagonist (Asthma/Allergy)",
    isBannedOrRecalled: false,
    cheaperGenerics: [
      { brandName: "Montene 10", manufacturer: "Square Pharmaceuticals", price: 16.00, savingsPercent: 8 },
      { brandName: "Lumona 10", manufacturer: "Incepta", price: 15.00, savingsPercent: 14 },
      { brandName: "Ventikast 10", manufacturer: "Eskayef", price: 15.00, savingsPercent: 14 }
    ]
  },
  {
    _id: "med-005",
    brandName: "Adulterated Paracetamol Syrup (Batch X94)",
    genericName: "Paracetamol Liquid",
    strength: "120mg/5ml",
    dosageForm: "Syrup",
    manufacturer: "Unlicensed Pharma Unit",
    dgdaMaxPrice: 35.00,
    marketPrice: 25.00,
    therapeuticClass: "Pediatric Antipyretic",
    isBannedOrRecalled: true,
    recallReason: "DGDA Circular: Detected toxic Diethylene Glycol (DEG) contamination. Immediate confiscation order.",
    cheaperGenerics: []
  },
  {
    _id: "med-006",
    brandName: "Lipicon 10",
    genericName: "Atorvastatin",
    strength: "10mg",
    dosageForm: "Tablet",
    manufacturer: "Square Pharmaceuticals",
    dgdaMaxPrice: 12.00,
    marketPrice: 13.00,
    therapeuticClass: "Lipid Lowering Statin",
    isBannedOrRecalled: false,
    cheaperGenerics: [
      { brandName: "Atova 10", manufacturer: "Beximco", price: 12.00, savingsPercent: 7 },
      { brandName: "Stator 10", manufacturer: "Incepta", price: 11.50, savingsPercent: 11 }
    ]
  }
];

const healthAlertsSeed = [
  {
    _id: "alert-001",
    title: "High Dengue Surge Alert: Dhaka South & North Municipalities",
    titleBn: "উচ্চ ডেঙ্গু ঝুঁকি সতর্কতা: ঢাকা উত্তর ও দক্ষিণ সিটি কর্পোরেশন",
    severity: "critical_emergency",
    category: "dengue",
    affectedAreas: ["Dhaka South", "Dhaka North", "Gazipur", "Narayanganj"],
    description: "Recent unseasonal rains followed by high relative humidity (84%) have created ideal Aedes aegypti mosquito breeding grounds. Platelet counts and NS1 antigen testing are in high demand.",
    descriptionBn: "টানা বৃষ্টি ও বাতাসে উচ্চ আর্দ্রতার কারণে এডিস মশার বিস্তার আশঙ্কাজনক হারে বৃদ্ধি পেয়েছে। জ্বর হলে অবিলম্বে রক্তের প্লাটিলেট ও এনএস১ পরীক্ষা করানোর পরামর্শ দেওয়া হচ্ছে।",
    advisory: "Eliminate stagnant water in flower pots, construction sites, and AC trays. Use mosquito nets day and night. Immediately seek emergency hospital care if platelets fall below 100,000.",
    isActive: true,
    source: "DGHS Vector-Borne Disease Control & MediPulse Real-Time Telemetry"
  },
  {
    _id: "alert-002",
    title: "Severe Air Pollution Advisory (AQI 245 - Hazardous)",
    titleBn: "মারাত্মক বায়ুদূষণ সতর্কতা (একিউআই ২৪৫ - বিপজ্জনক)",
    severity: "high",
    category: "air_quality",
    affectedAreas: ["Dhaka - Mirpur", "Gazipur Industrial Zone", "Savar"],
    description: "Real-time atmospheric monitors detect PM2.5 levels at 195 ug/m3. Heavy industrial emissions and brick kiln operations are causing severe particulate entrapment.",
    descriptionBn: "মিরপুর ও গাজীপুর অঞ্চলে অতিক্ষুদ্র ধূলিকণার মাত্রা স্বাস্থ্যসীমার বহু উপরে। শিশু, বয়স্ক ও অ্যাজমা রোগীদের জন্য পরিস্থিতি অত্যন্ত ঝুঁকিপূর্ণ।",
    advisory: "Wear certified N95 masks when stepping outdoors. Asthma and cardiac patients should strictly avoid vigorous outdoor morning exercise.",
    isActive: true,
    source: "OpenAQ & MediPulse Environmental Telemetry Station"
  },
  {
    _id: "alert-003",
    title: "DGDA Urgent Recall: Batch #PG-912 Pediatric Suspensions",
    titleBn: "জরুরি ওষুধ প্রত্যাহার নোটিশ: ডিজিডিএ কর্তৃক ভেজাল ব্যাচ শনাক্ত",
    severity: "high",
    category: "medicine_recall",
    affectedAreas: ["Nationwide"],
    description: "Directorate General of Drug Administration (DGDA) has issued an immediate seizure notice for counterfeit syrup batches missing holographic security seals.",
    descriptionBn: "হোলোগ্রাম সিলবিহীন ভেজাল তরল সিরাপ বাজার থেকে অবিলম্বে প্রত্যাহারের নির্দেশ প্রদান করেছে ঔষধ প্রশাসন অধিদপ্তর।",
    advisory: "Check medicine batch numbers before purchase. Report unauthorized vendors charging inflated prices via MediPulse Fake Drug Reporter.",
    isActive: true,
    source: "DGDA Directorate Circular"
  }
];

const speedDialContacts = [
  { service: "National Emergency Service", serviceBn: "জাতীয় জরুরি সেবা", number: "999", type: "Police, Fire & Ambulance", icon: "PhoneCall", color: "bg-red-500" },
  { service: "Shastho Batayon (DGHS Health Hotline)", serviceBn: "স্বাস্থ্য বাতায়ন (ডিজিএইচএস)", number: "16263", type: "24/7 Free Doctor Tele-Advice", icon: "Stethoscope", color: "bg-emerald-600" },
  { service: "Citizen Public Grievance Helpline", serviceBn: "নাগরিক সেবা হটলাইন", number: "333", type: "Relief, Disaster & Food Safety", icon: "Shield", color: "bg-blue-600" },
  { service: "Dhaka Poison Information Center", serviceBn: "বিষক্রিয়া ও জরুরি বিষাক্ততা তথ্য", number: "01713-000000", type: "Snake Bite, Pesticide, Chemical", icon: "AlertTriangle", color: "bg-amber-600" },
  { service: "Red Crescent Ambulance Dispatch", serviceBn: "রেড ক্রিসেন্ট অ্যাম্বুলেন্স সার্ভিস", number: "02-9330188", type: "Emergency Patient Transport", icon: "Truck", color: "bg-rose-600" },
  { service: "National Mental Health Institute", serviceBn: "জাতীয় মানসিক স্বাস্থ্য ইনস্টিটিউট", number: "02-9118171", type: "Psychological Support & Suicide Prevention", icon: "HeartHandshake", color: "bg-purple-600" }
];

const epiVaccineSchedule = [
  { age: "At Birth (জন্মের সাথে সাথে)", vaccines: ["BCG (Tuberculosis)", "OPV-0 (Polio)"], description: "Protection against severe childhood TB and initial polio defense." },
  { age: "6 Weeks (৬ সপ্তাহ)", vaccines: ["Penta-1 (DPT+HepB+Hib)", "PCV-1 (Pneumococcal)", "bOPV-1", "Rota-1"], description: "First major combination immunization round." },
  { age: "10 Weeks (১০ সপ্তাহ)", vaccines: ["Penta-2", "PCV-2", "bOPV-2", "Rota-2"], description: "Second booster protection." },
  { age: "14 Weeks (১৪ সপ্তাহ)", vaccines: ["Penta-3", "PCV-3", "bOPV-3", "IPV-1 (Injectable Polio)"], description: "Completes primary pentavalent series." },
  { age: "9 Months (৯ মাস)", vaccines: ["MR-1 (Measles & Rubella)", "IPV-2"], description: "Measles and Rubella initial protection." },
  { age: "15 Months (১৫ মাস)", vaccines: ["MR-2 (Measles & Rubella Booster)"], description: "Long-term lasting immunity." }
];

module.exports = {
  hospitalsSeed,
  donorsSeed,
  medicinesSeed,
  healthAlertsSeed,
  speedDialContacts,
  epiVaccineSchedule
};
