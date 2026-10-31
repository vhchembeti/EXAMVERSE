// server/data/studentPersonas.js
// 11 Mandatory Statutory Student Personas for Deterministic Verification
// Covers secondary, vocational, technical, non-technical, postgraduate, and research cohorts.

const STUDENT_PERSONAS = {
  'class-12-pcm': {
    id: 'class-12-pcm',
    name: 'Aarav Sharma',
    personaTitle: 'Class 12 Science (PCM) Student',
    dateOfBirth: '2008-04-15', // ~18 yrs on Aug 2026
    gender: 'Male',
    educationalQualification: '12th Standard',
    degree: 'Higher Secondary (10+2)',
    specialization: 'Physics, Chemistry & Mathematics (PCM)',
    graduationStatus: 'Appearing',
    percentage: 84.5,
    category: 'General',
    state: 'UP',
    domicileState: 'UP',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['NDA & NA', 'JEE Main', 'JEE Advanced', 'CUET UG'],
    expectedNotEligibleExams: ['UPSC CSE', 'GATE CS', 'SSC CGL', 'UPSC ESE']
  },

  'diploma-mechanical': {
    id: 'diploma-mechanical',
    name: 'Rohan Patil',
    personaTitle: '3-Year Polytechnic Diploma (Mechanical)',
    dateOfBirth: '2005-09-10', // ~20.9 yrs on Aug 2026
    gender: 'Male',
    educationalQualification: '3-Year Diploma',
    degree: 'Diploma in Mechanical Engineering',
    specialization: 'Mechanical Engineering',
    graduationStatus: 'Completed',
    percentage: 76.0,
    category: 'OBC',
    state: 'MH',
    domicileState: 'MH',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['SSC JE', 'RRB JE', 'MPSC Subordinate'],
    expectedNotEligibleExams: ['UPSC CSE', 'UPSC ESE', 'GATE ME']
  },

  'btech-cse': {
    id: 'btech-cse',
    name: 'Pooja Iyer',
    personaTitle: 'B.Tech Computer Science Graduate',
    dateOfBirth: '2003-02-14', // ~23.5 yrs
    gender: 'Female',
    educationalQualification: "Bachelor's degree",
    degree: 'B.Tech',
    specialization: 'Computer Science and Engineering',
    graduationStatus: 'Completed',
    percentage: 82.0,
    cgpa: 8.4,
    category: 'General',
    state: 'KA',
    domicileState: 'KA',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['GATE CS', 'UPSC CSE', 'SSC CGL', 'NIC Scientist B', 'ISRO ICRB CS']
  },

  'btech-aids': {
    id: 'btech-aids',
    name: 'Aditya Verma',
    personaTitle: 'B.Tech Data Science & AI Graduate',
    dateOfBirth: '2003-11-20', // ~22.7 yrs
    gender: 'Male',
    educationalQualification: "Bachelor's degree",
    degree: 'B.Tech',
    specialization: 'Artificial Intelligence and Data Science',
    graduationStatus: 'Completed',
    percentage: 79.5,
    category: 'General',
    state: 'DL',
    domicileState: 'DL',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['GATE DA', 'UPSC CSE', 'SSC CGL', 'CDAC C-CAT']
  },

  'btech-ece': {
    id: 'btech-ece',
    name: 'Suresh Kumar',
    personaTitle: 'B.Tech Electronics & Communication Graduate',
    dateOfBirth: '2002-05-18', // ~24.2 yrs
    gender: 'Male',
    educationalQualification: "Bachelor's degree",
    degree: 'B.Tech',
    specialization: 'Electronics and Communication Engineering',
    graduationStatus: 'Completed',
    percentage: 74.0,
    category: 'OBC',
    state: 'AP',
    domicileState: 'AP',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['GATE EC', 'UPSC ESE', 'UPSC CSE', 'ISRO ICRB EC', 'BEL PE', 'SSC CGL']
  },

  'btech-eee': {
    id: 'btech-eee',
    name: 'Kavita Reddy',
    personaTitle: 'B.Tech Electrical Engineering Graduate',
    dateOfBirth: '2003-07-25', // ~23.0 yrs
    gender: 'Female',
    educationalQualification: "Bachelor's degree",
    degree: 'B.Tech',
    specialization: 'Electrical and Electronics Engineering',
    graduationStatus: 'Completed',
    percentage: 80.0,
    category: 'General',
    state: 'TG',
    domicileState: 'TG',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['GATE EE', 'UPSC ESE', 'PGCIL ET', 'NTPC ET', 'UPSC CSE']
  },

  'btech-me': {
    id: 'btech-me',
    name: 'Vikas Meena',
    personaTitle: 'B.Tech Mechanical Engineering Graduate',
    dateOfBirth: '2001-08-12', // ~25.0 yrs
    gender: 'Male',
    educationalQualification: "Bachelor's degree",
    degree: 'B.Tech',
    specialization: 'Mechanical Engineering',
    graduationStatus: 'Completed',
    percentage: 68.5,
    category: 'SC',
    state: 'RJ',
    domicileState: 'RJ',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['GATE ME', 'UPSC CSE', 'UPSC ESE', 'IOCL GET', 'ONGC AEE']
  },

  'ba-arts': {
    id: 'ba-arts',
    name: 'Ananya Sen',
    personaTitle: 'B.A. Arts Graduate (Pol Science & History)',
    dateOfBirth: '2003-03-30', // ~23.3 yrs
    gender: 'Female',
    educationalQualification: "Bachelor's degree",
    degree: 'B.A.',
    specialization: 'Political Science and History',
    graduationStatus: 'Completed',
    percentage: 71.0,
    category: 'General',
    state: 'WB',
    domicileState: 'WB',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['UPSC CSE', 'SSC CGL', 'WBPSC WBCS', 'IBPS PO', 'SBI PO'],
    expectedNotEligibleExams: ['GATE CS', 'GATE EC', 'UPSC ESE']
  },

  'bcom-commerce': {
    id: 'bcom-commerce',
    name: 'Harsh Vardhan',
    personaTitle: 'B.Com Commerce Graduate (Finance & Accounts)',
    dateOfBirth: '2004-01-15', // ~22.5 yrs
    gender: 'Male',
    educationalQualification: "Bachelor's degree",
    degree: 'B.Com',
    specialization: 'Accounting and Finance',
    graduationStatus: 'Completed',
    percentage: 75.5,
    category: 'EWS',
    state: 'GJ',
    domicileState: 'GJ',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['UPSC CSE', 'SSC CGL (AAO)', 'RBI Grade B', 'SEBI Grade A', 'IBPS PO'],
    expectedNotEligibleExams: ['GATE EC', 'UPSC ESE']
  },

  'postgraduate-mtech': {
    id: 'postgraduate-mtech',
    name: 'Dr. Nikhil Kulkarni',
    personaTitle: 'Postgraduate (M.Tech in VLSI Design)',
    dateOfBirth: '2000-06-20', // ~26.1 yrs
    gender: 'Male',
    educationalQualification: "Master's degree",
    degree: 'M.Tech',
    specialization: 'VLSI Design & Microelectronics',
    graduationStatus: 'Completed',
    percentage: 85.0,
    category: 'General',
    state: 'MH',
    domicileState: 'MH',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['UGC NET', 'CSIR NET', 'GATE EC', 'DRDO Scientist B', 'UPSC CSE']
  },

  'research-aspirant': {
    id: 'research-aspirant',
    name: 'Deepika Nair',
    personaTitle: 'Research Aspirant (M.Sc. Physics)',
    dateOfBirth: '2000-11-10', // ~25.7 yrs
    gender: 'Female',
    educationalQualification: "Master's degree",
    degree: 'M.Sc.',
    specialization: 'Physics',
    graduationStatus: 'Completed',
    percentage: 78.0,
    category: 'OBC',
    state: 'KL',
    domicileState: 'KL',
    isPwD: false,
    isExServicemen: false,
    expectedEligibleExams: ['CSIR NET JRF', 'UGC NET', 'GATE PH', 'BARC OCES (Physics)', 'TIFR GS']
  }
};

module.exports = {
  STUDENT_PERSONAS
};
