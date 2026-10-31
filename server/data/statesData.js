// server/data/statesData.js
// Complete registry of all 28 Indian States and 8 Union Territories
// Includes state recruitment boards, state entrance examinations, and major state universities

const indianStatesAndUTs = [
  // --- 28 STATES ---
  {
    code: "AP",
    name: "Andhra Pradesh",
    type: "State",
    capital: "Amaravati",
    officialLanguage: "Telugu",
    recruitmentBoards: [
      { name: "APPSC", fullName: "Andhra Pradesh Public Service Commission", url: "https://psc.ap.gov.in" },
      { name: "SLPRB AP", fullName: "State Level Police Recruitment Board AP", url: "https://slprb.ap.gov.in" },
      { name: "AP DSC", fullName: "District Selection Committee (School Education)", url: "https://apdsc.apcfss.in" },
      { name: "AP Health Board", fullName: "AP Medical Services Recruitment Board", url: "https://cfw.ap.nic.in" },
      { name: "AP Forest Dept", fullName: "AP Forest Department Recruitment", url: "https://forests.ap.gov.in" }
    ],
    entranceExams: [
      { code: "AP-EAPCET", name: "AP EAPCET (Engineering, Agriculture & Pharmacy)", conductingBody: "JNTU Kakinada / APSCHE" },
      { code: "AP-ICET", name: "AP ICET (MBA & MCA)", conductingBody: "Sri Krishnadevaraya University / APSCHE" },
      { code: "AP-ECET", name: "AP ECET (Diploma Lateral Entry B.Tech)", conductingBody: "APSCHE" },
      { code: "AP-EDCET", name: "AP EdCET (B.Ed Entrance)", conductingBody: "APSCHE" },
      { code: "AP-LAWCET", name: "AP LAWCET / PGLCET (Law Entrance)", conductingBody: "APSCHE" },
      { code: "AP-PGECET", name: "AP PGECET (M.Tech / M.Pharmacy)", conductingBody: "APSCHE" }
    ],
    majorUniversities: [
      "Andhra University (Visakhapatnam)",
      "Sri Venkateswara University (Tirupati)",
      "JNTU Kakinada & JNTU Anantapur",
      "Acharya Nagarjuna University (Guntur)",
      "Sri Krishnadevaraya University (Anantapur)",
      "Dr. YSR University of Health Sciences (Vijayawada)"
    ],
    domicileRules: "85% reservation for local candidates in state universities and local cadres under AP Public Employment Order."
  },
  {
    code: "TG",
    name: "Telangana",
    type: "State",
    capital: "Hyderabad",
    officialLanguage: "Telugu, Urdu",
    recruitmentBoards: [
      { name: "TGPSC", fullName: "Telangana Public Service Commission", url: "https://websitenew.tspsc.gov.in" },
      { name: "TSLPRB", fullName: "Telangana State Level Police Recruitment Board", url: "https://tslprb.in" },
      { name: "TG DSC / TRT", fullName: "Telangana Teacher Recruitment Test", url: "https://schooledu.telangana.gov.in" },
      { name: "MHSRB TG", fullName: "Medical Health Services Recruitment Board", url: "https://mhsrb.telangana.gov.in" }
    ],
    entranceExams: [
      { code: "TG-EAPCET", name: "TG EAPCET (Engineering & Agriculture)", conductingBody: "JNTUH / TGCHE" },
      { code: "TG-ICET", name: "TG ICET (MBA & MCA)", conductingBody: "Kakatiya University / TGCHE" },
      { code: "TG-ECET", name: "TG ECET (Engineering Lateral Entry)", conductingBody: "Osmania University" },
      { code: "TG-LAWCET", name: "TG LAWCET (3-Yr & 5-Yr LLB)", conductingBody: "Osmania University" },
      { code: "TG-PGECET", name: "TG PGECET (Postgraduate Engineering)", conductingBody: "JNTUH" }
    ],
    majorUniversities: [
      "Osmania University (Hyderabad)",
      "JNTU Hyderabad",
      "Kakatiya University (Warangal)",
      "University of Hyderabad (Central)",
      "Telangana University (Nizamabad)",
      "Kaloji Narayana Rao University of Health Sciences"
    ],
    domicileRules: "95% local reservation in state government employment under Presidential Order 2018."
  },
  {
    code: "TN",
    name: "Tamil Nadu",
    type: "State",
    capital: "Chennai",
    officialLanguage: "Tamil",
    recruitmentBoards: [
      { name: "TNPSC", fullName: "Tamil Nadu Public Service Commission", url: "https://tnpsc.gov.in" },
      { name: "TNUSRB", fullName: "Tamil Nadu Uniformed Services Recruitment Board", url: "https://tnusrb.tn.gov.in" },
      { name: "TRB TN", fullName: "Teachers Recruitment Board Tamil Nadu", url: "https://trb.tn.gov.in" },
      { name: "MRB TN", fullName: "Medical Services Recruitment Board Tamil Nadu", url: "https://mrb.tn.gov.in" }
    ],
    entranceExams: [
      { code: "TANCET", name: "TANCET (MBA & MCA)", conductingBody: "Anna University" },
      { code: "CEETA-PG", name: "CEETA-PG (M.E. / M.Tech / M.Arch)", conductingBody: "Anna University" },
      { code: "TNEA", name: "TNEA (Tamil Nadu Engineering Admissions - Merit)", conductingBody: "DOTE TN" }
    ],
    majorUniversities: [
      "Anna University (Chennai)",
      "University of Madras (Chennai)",
      "Bharathiar University (Coimbatore)",
      "Madurai Kamaraj University",
      "Tamil Nadu Dr. M.G.R. Medical University"
    ],
    domicileRules: "Tamil eligibility test is compulsory for state government appointments. 69% reservation quota."
  },
  {
    code: "KA",
    name: "Karnataka",
    type: "State",
    capital: "Bengaluru",
    officialLanguage: "Kannada",
    recruitmentBoards: [
      { name: "KPSC", fullName: "Karnataka Public Service Commission", url: "https://kpsc.kar.nic.in" },
      { name: "KSP", fullName: "Karnataka State Police Recruitment", url: "https://ksp.karnataka.gov.in" },
      { name: "KAE", fullName: "Karnataka Examinations Authority (Recruitment Wing)", url: "https://cetonline.karnataka.gov.in" }
    ],
    entranceExams: [
      { code: "KCET", name: "KCET (Karnataka Common Entrance Test)", conductingBody: "KEA" },
      { code: "Karnataka PGCET", name: "PGCET (MBA, MCA, M.Tech)", conductingBody: "KEA" },
      { code: "COMEDK-UGET", name: "COMEDK UGET (Private Engineering Colleges)", conductingBody: "COMEDK" }
    ],
    majorUniversities: [
      "Bangalore University",
      "Visvesvaraya Technological University (Belagavi)",
      "University of Mysore",
      "IISc Bengaluru (Autonomous Central Institute)",
      "Rajiv Gandhi University of Health Sciences"
    ],
    domicileRules: "Kannada language proficiency compulsory; 10 years schooling in Karnataka required for KCET local seats."
  },
  {
    code: "KL",
    name: "Kerala",
    type: "State",
    capital: "Thiruvananthapuram",
    officialLanguage: "Malayalam",
    recruitmentBoards: [
      { name: "Kerala PSC", fullName: "Kerala Public Service Commission", url: "https://keralapsc.gov.in" },
      { name: "Kerala Police", fullName: "Kerala Police Recruitment", url: "https://keralapolice.gov.in" }
    ],
    entranceExams: [
      { code: "KEAM", name: "KEAM (Kerala Engineering Architecture Medical)", conductingBody: "CEE Kerala" },
      { code: "KMAT-Kerala", name: "KMAT Kerala (Management)", conductingBody: "CEE Kerala" }
    ],
    majorUniversities: [
      "University of Kerala",
      "APJ Abdul Kalam Technological University (KTU)",
      "Mahatma Gandhi University (Kottayam)",
      "Calicut University",
      "Cochin University of Science and Technology (CUSAT)"
    ],
    domicileRules: "Keralite / Non-Keralite Category I & II criteria for admissions; Malayalam knowledge required for state posts."
  },
  {
    code: "MH",
    name: "Maharashtra",
    type: "State",
    capital: "Mumbai",
    officialLanguage: "Marathi",
    recruitmentBoards: [
      { name: "MPSC", fullName: "Maharashtra Public Service Commission", url: "https://mpsc.gov.in" },
      { name: "Maharashtra Police", fullName: "Maharashtra Police Bharti", url: "https://mahapolice.gov.in" }
    ],
    entranceExams: [
      { code: "MHT-CET", name: "MHT CET (Engineering, Technology & Pharmacy)", conductingBody: "State CET Cell Maharashtra" },
      { code: "MAH-MBA-CET", name: "MAH MBA/MMS CET", conductingBody: "State CET Cell Maharashtra" },
      { code: "MAH-LLB-CET", name: "MAH LLB CET (3-Yr & 5-Yr)", conductingBody: "State CET Cell" }
    ],
    majorUniversities: [
      "University of Mumbai",
      "Savitribai Phule Pune University",
      "COEP Technological University",
      "Rashtrasant Tukadoji Maharaj Nagpur University",
      "Maharashtra University of Health Sciences"
    ],
    domicileRules: "Maharashtra State Domicile required for 85% state quota and state government civil posts; Marathi mandatory."
  },
  {
    code: "UP",
    name: "Uttar Pradesh",
    type: "State",
    capital: "Lucknow",
    officialLanguage: "Hindi",
    recruitmentBoards: [
      { name: "UPPSC", fullName: "Uttar Pradesh Public Service Commission", url: "https://uppsc.up.nic.in" },
      { name: "UPSSSC", fullName: "Uttar Pradesh Subordinate Services Selection Commission", url: "https://upsssc.gov.in" },
      { name: "UPPRPB", fullName: "UP Police Recruitment and Promotion Board", url: "https://uppbpb.gov.in" },
      { name: "UPSESSB", fullName: "UP Secondary Education Service Selection Board", url: "https://upsessb.org" }
    ],
    entranceExams: [
      { code: "UPTAC", name: "UPTAC (AKTU Engineering & Management Admissions)", conductingBody: "Dr. APJ Abdul Kalam Tech Univ" },
      { code: "UP-BED-JEE", name: "UP B.Ed Joint Entrance Examination", conductingBody: "Bundelkhand University" }
    ],
    majorUniversities: [
      "Banaras Hindu University (Central)",
      "Aligarh Muslim University (Central)",
      "University of Lucknow",
      "Dr. A.P.J. Abdul Kalam Technical University",
      "University of Allahabad (Central)"
    ],
    domicileRules: "Candidates from other states treated as General category for UP government recruitment."
  },
  {
    code: "BR",
    name: "Bihar",
    type: "State",
    capital: "Patna",
    officialLanguage: "Hindi",
    recruitmentBoards: [
      { name: "BPSC", fullName: "Bihar Public Service Commission", url: "https://bpsc.bih.nic.in" },
      { name: "BSSC", fullName: "Bihar Staff Selection Commission", url: "https://bssc.bihar.gov.in" },
      { name: "BPSSC", fullName: "Bihar Police Subordinate Services Commission", url: "https://bpssc.bih.nic.in" },
      { name: "CSBC", fullName: "Central Selection Board of Constable Bihar", url: "https://csbc.bih.nic.in" }
    ],
    entranceExams: [
      { code: "BCECE", name: "BCECE (Agriculture, Pharmacy & Paramedical)", conductingBody: "BCECEB Bihar" },
      { code: "Bihar B.Ed CET", name: "Bihar B.Ed Combined Entrance Test", conductingBody: "LNMU Darbhanga" }
    ],
    majorUniversities: [
      "Patna University",
      "Aryabhatta Knowledge University (Patna)",
      "Babasaheb Bhimrao Ambedkar Bihar University",
      "Nalanda Open University"
    ],
    domicileRules: "Reservation benefits applicable exclusively to Bihar domiciled candidates; other states eligible under Unreserved."
  },
  {
    code: "WB",
    name: "West Bengal",
    type: "State",
    capital: "Kolkata",
    officialLanguage: "Bengali, English",
    recruitmentBoards: [
      { name: "WBPSC", fullName: "West Bengal Public Service Commission", url: "https://wbpsc.gov.in" },
      { name: "WBPRB", fullName: "West Bengal Police Recruitment Board", url: "https://prb.wb.gov.in" },
      { name: "WBSSC", fullName: "West Bengal School Service Commission", url: "https://westbengalssc.com" }
    ],
    entranceExams: [
      { code: "WBJEE", name: "WBJEE (West Bengal Joint Entrance Exam - Engg & Pharm)", conductingBody: "WBJEEB" },
      { code: "WB JECA", name: "WB JECA (Master of Computer Applications)", conductingBody: "WBJEEB" },
      { code: "WB JELET", name: "WB JELET (Lateral Entry Engineering)", conductingBody: "WBJEEB" }
    ],
    majorUniversities: [
      "Jadavpur University (Kolkata)",
      "Calcutta University",
      "MAKAUT (Maulana Abul Kalam Azad Univ of Tech)",
      "Visva-Bharati (Central)",
      "Presidency University"
    ],
    domicileRules: "WBJEE Government Engineering seats require 10-year West Bengal domicile certificate."
  },
  {
    code: "RJ",
    name: "Rajasthan",
    type: "State",
    capital: "Jaipur",
    officialLanguage: "Hindi",
    recruitmentBoards: [
      { name: "RPSC", fullName: "Rajasthan Public Service Commission", url: "https://rpsc.rajasthan.gov.in" },
      { name: "RSMSSB", fullName: "Rajasthan Staff Selection Board", url: "https://rsmssb.rajasthan.gov.in" },
      { name: "Rajasthan Police", fullName: "Rajasthan Police Recruitment", url: "https://police.rajasthan.gov.in" }
    ],
    entranceExams: [
      { code: "REAP", name: "REAP (Rajasthan Engineering Admission Process)", conductingBody: "CEG Rajasthan" },
      { code: "Rajasthan PTET", name: "PTET (Pre-Teacher Education Test)", conductingBody: "VMOU Kota" }
    ],
    majorUniversities: [
      "University of Rajasthan (Jaipur)",
      "Rajasthan Technical University (Kota)",
      "MNIT Jaipur (NIT)",
      "Mohanlal Sukhadia University (Udaipur)"
    ],
    domicileRules: "Non-Rajasthan candidates apply under Open/General category for state services."
  },
  {
    code: "MP",
    name: "Madhya Pradesh",
    type: "State",
    capital: "Bhopal",
    officialLanguage: "Hindi",
    recruitmentBoards: [
      { name: "MPPSC", fullName: "Madhya Pradesh Public Service Commission", url: "https://mppsc.mp.gov.in" },
      { name: "MPESB", fullName: "MP Employees Selection Board (Vyapam)", url: "https://esb.mp.gov.in" },
      { name: "MP Police", fullName: "Madhya Pradesh Police Headquarters", url: "https://mppolice.gov.in" }
    ],
    entranceExams: [
      { code: "MP-Pre-MCA", name: "MP Pre-MCA Entrance Test", conductingBody: "MPESB" },
      { code: "MP-PAT", name: "MP Pre-Agriculture Test", conductingBody: "MPESB" }
    ],
    majorUniversities: [
      "Barkatullah University (Bhopal)",
      "Devi Ahilya Vishwavidyalaya (Indore)",
      "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV Bhopal)"
    ],
    domicileRules: "Employment registration on MP Rojgar Portal is mandatory for MP state exams."
  },
  {
    code: "GJ",
    name: "Gujarat",
    type: "State",
    capital: "Gandhinagar",
    officialLanguage: "Gujarati",
    recruitmentBoards: [
      { name: "GPSC", fullName: "Gujarat Public Service Commission", url: "https://gpsc.gujarat.gov.in" },
      { name: "GSSSB", fullName: "Gujarat Subordinate Service Selection Board", url: "https://gsssb.gujarat.gov.in" }
    ],
    entranceExams: [
      { code: "GUJCET", name: "GUJCET (Gujarat Common Entrance Test)", conductingBody: "GSEB" }
    ],
    majorUniversities: [
      "Gujarat University (Ahmedabad)",
      "MS University of Baroda",
      "NFSU (National Forensic Sciences University, Gandhinagar)",
      "GTU (Gujarat Technological University)"
    ],
    domicileRules: "Gujarati language proficiency required for state administrative posts."
  },
  {
    code: "OR",
    name: "Odisha",
    type: "State",
    capital: "Bhubaneswar",
    officialLanguage: "Odia",
    recruitmentBoards: [
      { name: "OPSC", fullName: "Odisha Public Service Commission", url: "https://opsc.gov.in" },
      { name: "OSSC", fullName: "Odisha Staff Selection Commission", url: "https://ossc.gov.in" },
      { name: "OSSSC", fullName: "Odisha Sub-Ordinate Staff Selection Commission", url: "https://osssc.gov.in" }
    ],
    entranceExams: [
      { code: "OJEE", name: "OJEE (Odisha Joint Entrance Examination)", conductingBody: "OJEE Committee" }
    ],
    majorUniversities: [
      "Utkal University (Bhubaneswar)",
      "Biju Patnaik University of Technology (Rourkela)",
      "Sambalpur University"
    ],
    domicileRules: "Candidate must have passed ME school with Odia as language subject to be eligible for state civil posts."
  },
  {
    code: "AS",
    name: "Assam",
    type: "State",
    capital: "Dispur",
    officialLanguage: "Assamese, Bengali, Bodo",
    recruitmentBoards: [
      { name: "APSC", fullName: "Assam Public Service Commission", url: "https://apsc.nic.in" },
      { name: "SLPRB Assam", fullName: "State Level Police Recruitment Board Assam", url: "https://slprbassam.in" }
    ],
    entranceExams: [
      { code: "Assam CEE", name: "Assam Combined Entrance Examination", conductingBody: "ASTU" }
    ],
    majorUniversities: [
      "Gauhati University",
      "Tezpur University (Central)",
      "Assam Science and Technology University"
    ],
    domicileRules: "Permanent Resident Certificate (PRC) of Assam mandatory for APSC state services."
  },
  {
    code: "PB",
    name: "Punjab",
    type: "State",
    capital: "Chandigarh",
    officialLanguage: "Punjabi",
    recruitmentBoards: [
      { name: "PPSC", fullName: "Punjab Public Service Commission", url: "https://ppsc.gov.in" },
      { name: "PSSSB", fullName: "Punjab Subordinate Services Selection Board", url: "https://sssb.punjab.gov.in" }
    ],
    entranceExams: [
      { code: "PTU CET", name: "IKGPTU Admissions", conductingBody: "IK Gujral Punjab Tech Univ" }
    ],
    majorUniversities: [
      "Panjab University (Chandigarh)",
      "Guru Nanak Dev University (Amritsar)",
      "Punjab Agricultural University (Ludhiana)"
    ],
    domicileRules: "Punjabi up to Matriculation standard is mandatory for all Punjab state jobs."
  },
  {
    code: "HR",
    name: "Haryana",
    type: "State",
    capital: "Chandigarh",
    officialLanguage: "Hindi",
    recruitmentBoards: [
      { name: "HPSC", fullName: "Haryana Public Service Commission", url: "https://hpsc.gov.in" },
      { name: "HSSC", fullName: "Haryana Staff Selection Commission", url: "https://hssc.gov.in" }
    ],
    entranceExams: [
      { code: "HSTES", name: "Haryana State Technical Education Society", conductingBody: "HSTES" }
    ],
    majorUniversities: [
      "Kurukshetra University",
      "Maharshi Dayanand University (Rohtak)",
      "JC Bose University of Science and Technology (YMCA)"
    ],
    domicileRules: "Haryana Parivar Pehchan Patra (Family ID) linked for socio-economic marks and reservations."
  },
  {
    code: "JH",
    name: "Jharkhand",
    type: "State",
    capital: "Ranchi",
    officialLanguage: "Hindi",
    recruitmentBoards: [
      { name: "JPSC", fullName: "Jharkhand Public Service Commission", url: "https://jpsc.gov.in" },
      { name: "JSSC", fullName: "Jharkhand Staff Selection Commission", url: "https://jssc.nic.in" }
    ],
    entranceExams: [
      { code: "JCECE", name: "JCECE (Jharkhand Combined Entrance Exam)", conductingBody: "JCECEB" }
    ],
    majorUniversities: ["Ranchi University", "BIT Mesra", "Kolhan University"],
    domicileRules: "Local resident certificate required for Grade 3 and Grade 4 state government positions."
  },
  {
    code: "CG",
    name: "Chhattisgarh",
    type: "State",
    capital: "Raipur",
    officialLanguage: "Hindi, Chhattisgarhi",
    recruitmentBoards: [
      { name: "CGPSC", fullName: "Chhattisgarh Public Service Commission", url: "https://psc.cg.gov.in" },
      { name: "CG Vyapam", fullName: "Chhattisgarh Professional Examination Board", url: "https://vyapam.cgstate.gov.in" }
    ],
    entranceExams: [
      { code: "CG-PET", name: "CG PET (Pre-Engineering Test)", conductingBody: "CG Vyapam" }
    ],
    majorUniversities: ["Pt. Ravishankar Shukla University", "CSVTU Bhilai", "Hidayatullah National Law University"],
    domicileRules: "Domicile of Chhattisgarh eligible for local cadre concessions and reservations."
  },
  {
    code: "UK",
    name: "Uttarakhand",
    type: "State",
    capital: "Dehradun",
    officialLanguage: "Hindi",
    recruitmentBoards: [
      { name: "UKPSC", fullName: "Uttarakhand Public Service Commission", url: "https://psc.uk.gov.in" },
      { name: "UKSSSC", fullName: "Uttarakhand Subordinate Service Selection Commission", url: "https://sssc.uk.gov.in" }
    ],
    entranceExams: [
      { code: "UKSEE", name: "Uttarakhand State Entrance Exam", conductingBody: "UTU" }
    ],
    majorUniversities: ["Kumaun University", "Hemwati Nandan Bahuguna Garhwal Univ", "Uttarakhand Technical Univ"],
    domicileRules: "High school and intermediate passed from Uttarakhand or Uttarakhand domicile mandatory for Group C."
  },
  {
    code: "HP",
    name: "Himachal Pradesh",
    type: "State",
    capital: "Shimla",
    officialLanguage: "Hindi",
    recruitmentBoards: [
      { name: "HPPSC", fullName: "Himachal Pradesh Public Service Commission", url: "https://hppsc.hp.gov.in" },
      { name: "HPSSC", fullName: "HP Rajya Chayan Aayog", url: "https://hprca.hp.gov.in" }
    ],
    entranceExams: [
      { code: "HPCET", name: "HP Common Entrance Test", conductingBody: "HPTU" }
    ],
    majorUniversities: ["Himachal Pradesh University (Shimla)", "HPTU Hamirpur"],
    domicileRules: "Bonafide Himachali status required for Class III and IV non-gazetted positions."
  },
  {
    code: "GA",
    name: "Goa",
    type: "State",
    capital: "Panaji",
    officialLanguage: "Konkani",
    recruitmentBoards: [
      { name: "GPSC-Goa", fullName: "Goa Public Service Commission", url: "https://gpsc.goa.gov.in" },
      { name: "GSSSB-Goa", fullName: "Goa Staff Selection Commission", url: "https://gssc.goa.gov.in" }
    ],
    entranceExams: [
      { code: "GCET", name: "Goa Common Entrance Test", conductingBody: "DTE Goa" }
    ],
    majorUniversities: ["Goa University", "BITS Pilani Goa Campus"],
    domicileRules: "15 years continuous residence certificate in Goa is mandatory for government appointments."
  },
  {
    code: "TR",
    name: "Tripura",
    type: "State",
    capital: "Agartala",
    officialLanguage: "Bengali, Kokborok, English",
    recruitmentBoards: [
      { name: "TPSC", fullName: "Tripura Public Service Commission", url: "https://tpsc.tripura.gov.in" }
    ],
    entranceExams: [
      { code: "TJEE", name: "Tripura Joint Entrance Examination", conductingBody: "TBJEE" }
    ],
    majorUniversities: ["Tripura University (Central)", "MBB University"],
    domicileRules: "Permanent Resident Certificate of Tripura (PRTC) required."
  },
  {
    code: "ML",
    name: "Meghalaya",
    type: "State",
    capital: "Shillong",
    officialLanguage: "English",
    recruitmentBoards: [
      { name: "MPSC-Meghalaya", fullName: "Meghalaya Public Service Commission", url: "https://mpsc.nic.in" }
    ],
    entranceExams: [],
    majorUniversities: ["North-Eastern Hill University (NEHU Central)"],
    domicileRules: "State reservation policy for Khasi, Jaintia and Garo indigenous communities."
  },
  {
    code: "MN",
    name: "Manipur",
    type: "State",
    capital: "Imphal",
    officialLanguage: "Meitei (Manipuri)",
    recruitmentBoards: [
      { name: "MPSC-Manipur", fullName: "Manipur Public Service Commission", url: "https://mpscmanipur.gov.in" }
    ],
    entranceExams: [],
    majorUniversities: ["Manipur University (Central)"],
    domicileRules: "Domicile of Manipur required for state category reservations."
  },
  {
    code: "NL",
    name: "Nagaland",
    type: "State",
    capital: "Kohima",
    officialLanguage: "English",
    recruitmentBoards: [
      { name: "NPSC", fullName: "Nagaland Public Service Commission", url: "https://npsc.nagaland.gov.in" }
    ],
    entranceExams: [],
    majorUniversities: ["Nagaland University (Central)"],
    domicileRules: "Indigenous Inhabitant Certificate required for Nagaland state public employment."
  },
  {
    code: "MZ",
    name: "Mizoram",
    type: "State",
    capital: "Aizawl",
    officialLanguage: "Mizo, English",
    recruitmentBoards: [
      { name: "MPSC-Mizoram", fullName: "Mizoram Public Service Commission", url: "https://mpsc.mizoram.gov.in" }
    ],
    entranceExams: [],
    majorUniversities: ["Mizoram University (Central)"],
    domicileRules: "Mizo language qualification required for state civil services."
  },
  {
    code: "AR",
    name: "Arunachal Pradesh",
    type: "State",
    capital: "Itanagar",
    officialLanguage: "English",
    recruitmentBoards: [
      { name: "APPSC-Arunachal", fullName: "Arunachal Pradesh Public Service Commission", url: "https://appsc.gov.in" }
    ],
    entranceExams: [
      { code: "APJEE", name: "Arunachal Pradesh Joint Entrance Examination", conductingBody: "DHTE Arunachal" }
    ],
    majorUniversities: ["Rajiv Gandhi University (Central)", "NERIST (Nirjuli)"],
    domicileRules: "Arunachal Pradesh Scheduled Tribe (APST) quotas apply to 80% state posts."
  },
  {
    code: "SK",
    name: "Sikkim",
    type: "State",
    capital: "Gangtok",
    officialLanguage: "English, Nepali, Sikkimese",
    recruitmentBoards: [
      { name: "SPSC", fullName: "Sikkim Public Service Commission", url: "https://spsc.sikkim.gov.in" }
    ],
    entranceExams: [],
    majorUniversities: ["Sikkim University (Central)", "Sikkim Manipal University"],
    domicileRules: "Certificate of Identification (COI) / Sikkim Subject Certificate mandatory."
  },

  // --- 8 UNION TERRITORIES ---
  {
    code: "DL",
    name: "Delhi (NCT)",
    type: "Union Territory",
    capital: "New Delhi",
    officialLanguage: "Hindi, English",
    recruitmentBoards: [
      { name: "DSSSB", fullName: "Delhi Subordinate Services Selection Board", url: "https://dsssb.delhi.gov.in" }
    ],
    entranceExams: [
      { code: "IPU-CET", name: "IPU CET (Guru Gobind Singh Indraprastha Univ)", conductingBody: "GGSIPU" },
      { code: "Delhi CET", name: "Delhi Skill and Entrepreneurship Univ CET", conductingBody: "DSEU" }
    ],
    majorUniversities: [
      "University of Delhi (Central)",
      "Jawaharlal Nehru University (JNU Central)",
      "Jamia Millia Islamia (Central)",
      "Delhi Technological University (DTU)",
      "Netaji Subhas University of Technology (NSUT)",
      "Indraprastha Institute of Information Technology Delhi (IIITD)"
    ],
    domicileRules: "85% Delhi Region reservation in state-funded Delhi universities (DTU, NSUT, GGSIPU, DSEU) for candidates passing qualifying exam from Delhi schools."
  },
  {
    code: "JK",
    name: "Jammu and Kashmir",
    type: "Union Territory",
    capital: "Srinagar (Summer), Jammu (Winter)",
    officialLanguage: "Kashmiri, Dogri, Urdu, Hindi, English",
    recruitmentBoards: [
      { name: "JKPSC", fullName: "Jammu and Kashmir Public Service Commission", url: "https://jkpsc.nic.in" },
      { name: "JKSSB", fullName: "Jammu and Kashmir Services Selection Board", url: "https://jkssb.nic.in" }
    ],
    entranceExams: [
      { code: "JKCET", name: "JKCET (Jammu and Kashmir Common Entrance Test)", conductingBody: "JKBOPEE" }
    ],
    majorUniversities: ["University of Kashmir", "University of Jammu", "SMVDU Katra", "NIT Srinagar"],
    domicileRules: "J&K Domicile Certificate mandatory for all public employment and UT quotas under J&K Reorganisation."
  },
  {
    code: "LA",
    name: "Ladakh",
    type: "Union Territory",
    capital: "Leh",
    officialLanguage: "Ladakhi, Hindi, English",
    recruitmentBoards: [
      { name: "LAHDSSRB", fullName: "Ladakh Autonomous Hill Development Council Staff Selection Board", url: "https://leh.nic.in" }
    ],
    entranceExams: [],
    majorUniversities: ["University of Ladakh"],
    domicileRules: "Resident Certificate of Ladakh UT mandatory for recruitment."
  },
  {
    code: "CH",
    name: "Chandigarh",
    type: "Union Territory",
    capital: "Chandigarh",
    officialLanguage: "English, Hindi, Punjabi",
    recruitmentBoards: [
      { name: "Chandigarh Administration", fullName: "Chandigarh Administration Recruitment", url: "https://chandigarh.gov.in" }
    ],
    entranceExams: [
      { code: "JAC Chandigarh", name: "Joint Admission Committee (Panjab Univ, CCET)", conductingBody: "JAC" }
    ],
    majorUniversities: ["Panjab University (Chandigarh)", "PEC University of Technology"],
    domicileRules: "85% quota for students completing Class 12 from Chandigarh schools in Chandigarh Engineering College admissions."
  },
  {
    code: "PY",
    name: "Puducherry",
    type: "Union Territory",
    capital: "Pondicherry",
    officialLanguage: "Tamil, English, French",
    recruitmentBoards: [
      { name: "Puducherry Govt", fullName: "Puducherry Administration Department of Personnel", url: "https://py.gov.in" }
    ],
    entranceExams: [
      { code: "CENTAC", name: "Centralised Admission Committee Puducherry", conductingBody: "CENTAC" }
    ],
    majorUniversities: ["Pondicherry University (Central)", "JIPMER (Autonomous National Institute)"],
    domicileRules: "Puducherry resident certificate needed for state university subsidized seats."
  },
  {
    code: "AN",
    name: "Andaman and Nicobar Islands",
    type: "Union Territory",
    capital: "Port Blair",
    officialLanguage: "Hindi, English",
    recruitmentBoards: [
      { name: "A&N Administration", fullName: "Andaman & Nicobar Administration Recruitment", url: "https://andaman.gov.in" }
    ],
    entranceExams: [],
    majorUniversities: ["Jawaharlal Nehru Rajkeeya Mahavidyalaya (Affiliated to Pondicherry Univ)"],
    domicileRules: "Local candidate certificate required for category concessions."
  },
  {
    code: "DN",
    name: "Dadra & Nagar Haveli and Daman & Diu",
    type: "Union Territory",
    capital: "Daman",
    officialLanguage: "Gujarati, Hindi, English",
    recruitmentBoards: [
      { name: "DNHDD Administration", fullName: "Staff Selection Board DNH & DD", url: "https://daman.nic.in" }
    ],
    entranceExams: [],
    majorUniversities: ["Govt College Daman"],
    domicileRules: "Domicile of the UT required for local job reservations."
  },
  {
    code: "LD",
    name: "Lakshadweep",
    type: "Union Territory",
    capital: "Kavaratti",
    officialLanguage: "Malayalam, English",
    recruitmentBoards: [
      { name: "Lakshadweep Administration", fullName: "Lakshadweep Administration Services", url: "https://lakshadweep.gov.in" }
    ],
    entranceExams: [],
    majorUniversities: ["Calicut University Study Centres"],
    domicileRules: "ST status and native islander domicile applicable."
  }
];

module.exports = indianStatesAndUTs;
