// client/src/services/i18n.ts
// Multilingual Internationalization Scaffolding for EXAMVERSE
// Supports 13 Indian Languages + RTL layout for Urdu
// Adheres to DPDP Act 2023 & statutory language rules

export type LanguageCode =
  | 'en' // English
  | 'hi' // Hindi
  | 'te' // Telugu
  | 'ta' // Tamil
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'or' // Odia
  | 'as' // Assamese
  | 'ur'; // Urdu (RTL)

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  isRTL?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    tagline: 'Every Exam. Every Opportunity. One Platform.',
    antiScamWarning: 'Trust only verified official government domains (.gov.in, .nic.in, .ac.in). EXAMVERSE never collects examination or recruitment application fees.',
    dashboard: 'Dashboard',
    exploreExams: 'Explore Exams',
    opportunityDiscovery: 'Opportunity Discovery',
    higherStudies: 'Higher Studies & PG',
    mockTests: 'Mock Tests',
    aiTutor: 'AI Academic Tutor',
    calendar: 'Exam Calendar',
    performance: 'Performance',
    admin: 'Admin Portal',
    signIn: 'Sign In',
    register: 'Create Account',
    signOut: 'Sign Out',
    lowBandwidthMode: 'Low-Bandwidth Mode',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    eligible: 'Eligible',
    activeWindows: 'Active Windows',
    closingSoon: 'Closing Soon',
    startOnboarding: 'Start Smart Discovery',
  },
  hi: {
    tagline: 'प्रत्येक परीक्षा। प्रत्येक अवसर। एक मंच।',
    antiScamWarning: 'केवल आधिकारिक सरकारी डोमेन (.gov.in, .nic.in, .ac.in) पर ही भरोसा करें। EXAMVERSE कभी भी परीक्षा शुल्क नहीं लेता है।',
    dashboard: 'डैशबोर्ड',
    exploreExams: 'परीक्षाएं खोजें',
    opportunityDiscovery: 'अवसर खोज इंजन',
    higherStudies: 'उच्च शिक्षा और पीजी',
    mockTests: 'मॉक टेस्ट',
    aiTutor: 'एआई अध्ययन शिक्षक',
    calendar: 'परीक्षा कैलेंडर',
    performance: 'प्रदर्शन रिपोर्ट',
    admin: 'व्यवस्थापक पोर्टल',
    signIn: 'साइन इन करें',
    register: 'नया खाता बनाएं',
    signOut: 'साइन आउट',
    lowBandwidthMode: 'लो-बैंडविड्थ मोड',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    eligible: 'पात्र',
    activeWindows: 'सक्रिय आवेदन',
    closingSoon: 'शीघ्र समाप्त',
    startOnboarding: 'अवसर खोज शुरू करें',
  },
  te: {
    tagline: 'ప్రతి పరీక్ష. ప్రతి అవకాశం. ఒకే వేదిక.',
    antiScamWarning: 'అధికారిక ప్రభుత్వ డొమైన్‌లను మాత్రమే నమ్మండి (.gov.in, .nic.in, .ac.in). EXAMVERSE ఎలాంటి పరీక్ష రుసుములను వసూలు చేయదు.',
    dashboard: 'డ్యాష్‌బోర్డ్',
    exploreExams: 'పరీక్షల డైరెక్టరీ',
    opportunityDiscovery: 'అవకాశాల శోధన',
    higherStudies: 'ఉన్నత విద్య & పీజీ',
    mockTests: 'మాక్ టెస్టులు',
    aiTutor: 'AI స్టడీ ట్యూటర్',
    calendar: 'పరీక్షల క్యాలెండర్',
    performance: 'ఫలితాల విశ్లేషణ',
    admin: 'అడ్మిన్ పోర్టల్',
    signIn: 'సైన్ ఇన్',
    register: 'ఖాతా తెరవండి',
    signOut: 'లాగ్ అవుట్',
    lowBandwidthMode: 'తక్కువ-బ్యాండ్‌విడ్త్ మోడ్',
    darkMode: 'డార్క్ మోడ్',
    lightMode: 'లైట్ మోడ్',
    eligible: 'అర్హులు',
    activeWindows: 'ప్రస్తుత దరఖాస్తులు',
    closingSoon: 'త్వరలో ముగింపు',
    startOnboarding: 'కెరీర్ శోధన ప్రారంభించండి',
  },
  ta: {
    tagline: 'ஒவ்வொரு தேர்வு. ஒவ்வொரு வாய்ப்பு. ஒரே தளம்.',
    antiScamWarning: 'அதிகாரப்பூர்வ அரசு இணையதளங்களை (.gov.in, .nic.in, .ac.in) மட்டுமே நம்புங்கள். EXAMVERSE விண்ணப்ப கட்டணம் வசூலிப்பதில்லை.',
    dashboard: 'டாஷ்போர்டு',
    exploreExams: 'தேர்வுகள்',
    opportunityDiscovery: 'வாய்ப்புகள் கண்டறிதல்',
    higherStudies: 'உயர் கல்வி & ஆராய்ச்சி',
    mockTests: 'மாதிரி தேர்வுகள்',
    aiTutor: 'AI ஆசிரியர்',
    calendar: 'தேர்வு நாட்காட்டி',
    performance: 'செயல்திறன்',
    admin: 'நிர்வாக போர்டல்',
    signIn: 'உள்நுழைக',
    register: 'பதிவு செய்க',
    signOut: 'வெளியேறு',
    lowBandwidthMode: 'குறைந்த அலைவரிசை முறை',
    darkMode: 'இருண்ட பயன்முறை',
    lightMode: 'ஒளி பயன்முறை',
    eligible: 'தகுதியுடையவை',
    activeWindows: 'செயலில் உள்ளவை',
    closingSoon: 'விரைவில் முடிகிறது',
    startOnboarding: 'தொடங்குக',
  },
  kn: {
    tagline: 'ಪ್ರತಿ ಪರೀಕ್ಷೆ. ಪ್ರತಿ ಅವಕಾಶ. ಒಂದೇ ವೇದಿಕೆ.',
    antiScamWarning: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಡೊಮೇನ್‌ಗಳನ್ನು ಮಾತ್ರ ನಂಬಿರಿ (.gov.in, .nic.in, .ac.in). EXAMVERSE ಪರೀಕ್ಷಾ ಶುಲ್ಕವನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    exploreExams: 'ಪರೀಕ್ಷೆಗಳನ್ನು ಹುಡುಕಿ',
    opportunityDiscovery: 'ಅವಕಾಶ ಶೋಧನೆ',
    higherStudies: 'ಉನ್ನತ ಶಿಕ್ಷಣ & ಪಿಜಿ',
    mockTests: 'ಮಾಕ್ ಪರೀಕ್ಷೆಗಳು',
    aiTutor: 'AI ಅಧ್ಯಯನ ಬೋಧಕ',
    calendar: 'ಪರೀಕ್ಷಾ ಕ್ಯಾಲೆಂಡರ್',
    performance: 'ಕಾರ್ಯಕ್ಷಮತೆ',
    admin: 'ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್',
    signIn: 'ಸೈನ್ ಇನ್',
    register: 'ಖಾತೆ ರಚಿಸಿ',
    signOut: 'ಸೈನ್ ಔಟ್',
    lowBandwidthMode: 'ಕಡಿಮೆ-ಬ್ಯಾಂಡ್‌ವಿಡ್ತ್ ಮೋಡ್',
    darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್',
    lightMode: 'ಲೈಟ್ ಮೋಡ್',
    eligible: 'ಅರ್ಹ',
    activeWindows: 'ಸಕ್ರಿಯ ಅರ್ಜಿಗಳು',
    closingSoon: 'ಶೀಘ್ರದಲ್ಲೇ ಮುಕ್ತಾಯ',
    startOnboarding: 'ಪ್ರಾರಂಭಿಸಿ',
  },
  ml: {
    tagline: 'ഓരോ പരീക്ഷയും. ഓരോ അവസരവും. ഒരു പ്ലാറ്റ്ഫോം.',
    antiScamWarning: 'ഔദ്യോഗിക സർക്കാർ വെബ്സൈറ്റുകളിൽ മാത്രം വിശ്വസിക്കുക (.gov.in, .nic.in, .ac.in). EXAMVERSE പരീക്ഷാ ഫീസ് ഈടാക്കില്ല.',
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    exploreExams: 'പരീക്ഷകൾ കണ്ടെത്തുക',
    opportunityDiscovery: 'അവസരങ്ങൾ',
    higherStudies: 'ഉന്നത വിദ്യാഭ്യാസം',
    mockTests: 'മോക്ക് ടെസ്റ്റുകൾ',
    aiTutor: 'AI ട്യൂട്ടർ',
    calendar: 'പരീക്ഷാ കലണ്ടർ',
    performance: 'പ്രകടനം',
    admin: 'അഡ്മിൻ പോർട്ടൽ',
    signIn: 'സൈൻ ഇൻ',
    register: 'അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    signOut: 'പുറത്തുകടക്കുക',
    lowBandwidthMode: 'ലോ-ബാൻഡ്‌വിഡ്ത്ത് മോഡ്',
    darkMode: 'ഡാർക്ക് മോഡ്',
    lightMode: 'ലൈറ്റ് മോഡ്',
    eligible: 'യോഗ്യതയുള്ളവ',
    activeWindows: 'സജീവം',
    closingSoon: 'ഉടൻ അവസാനിക്കും',
    startOnboarding: 'ആരംഭിക്കുക',
  },
  bn: {
    tagline: 'প্রতিটি পরীক্ষা। প্রতিটি সুযোগ। এক প্ল্যাটফর্ম।',
    antiScamWarning: 'কেবল অফিসিয়াল সরকারি ডোমেইনে (.gov.in, .nic.in, .ac.in) আস্থা রাখুন। EXAMVERSE কোনো ফি সংগ্রহ করে না।',
    dashboard: 'ড্যাশবোর্ড',
    exploreExams: 'পরীক্ষাসমূহ',
    opportunityDiscovery: 'সুযোগ সন্ধান',
    higherStudies: 'উচ্চশিক্ষা ও পিজি',
    mockTests: 'মক টেস্ট',
    aiTutor: 'এআই টিউটর',
    calendar: 'পরীক্ষা ক্যালেন্ডার',
    performance: 'পারফরম্যান্স',
    admin: 'অ্যাডমিন পোর্টাল',
    signIn: 'সাইন ইন',
    register: 'অ্যাকাউন্ট তৈরি করুন',
    signOut: 'সাইন আউট',
    lowBandwidthMode: 'কম-ব্যান্ডউইথ মোড',
    darkMode: 'ডার্ক মোড',
    lightMode: 'লাইট মোড',
    eligible: 'যোগ্য',
    activeWindows: 'সক্রিয় আবেদন',
    closingSoon: 'শীঘ্রই শেষ',
    startOnboarding: 'শুরু করুন',
  },
  mr: {
    tagline: 'प्रत्येक परीक्षा. प्रत्येक संधी. एकच व्यासपीठ.',
    antiScamWarning: 'केवळ अधिकृत सरकारी डोमेन (.gov.in, .nic.in, .ac.in) वर विश्वास ठेवा. EXAMVERSE कोणतीही फी गोळा करत नाही.',
    dashboard: 'डॅशबोर्ड',
    exploreExams: 'परीक्षा शोधा',
    opportunityDiscovery: 'संधी शोध',
    higherStudies: 'उच्च शिक्षण आणि पीजी',
    mockTests: 'सराव चाचण्या',
    aiTutor: 'एआय ट्यूटर',
    calendar: 'परीक्षा दिनदर्शिका',
    performance: 'कामगिरी',
    admin: 'प्रशासक पोर्टल',
    signIn: 'साइन इन करा',
    register: 'नवीन खाते तयार करा',
    signOut: 'साइन आउट',
    lowBandwidthMode: 'कमी बँडविड्थ मोड',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    eligible: 'पात्र',
    activeWindows: 'सक्रिय अर्ज',
    closingSoon: 'लवकरच समाप्त',
    startOnboarding: 'सुरू करा',
  },
  gu: {
    tagline: 'દરેક પરીક્ષા. દરેક તક. એક જ પ્લેટફોર્મ.',
    antiScamWarning: 'માત્ર અધિકૃત સરકારી ડોમેન્સ (.gov.in, .nic.in, .ac.in) પર વિશ્વાસ કરો. EXAMVERSE કોઈ ફી વસૂલતું નથી.',
    dashboard: 'ડેશબોર્ડ',
    exploreExams: 'પરીક્ષાઓ શોધો',
    opportunityDiscovery: 'તકોની શોધ',
    higherStudies: 'ઉચ્ચ શિક્ષણ અને પીજી',
    mockTests: 'મોક ટેસ્ટ',
    aiTutor: 'AI અભ્યાસ શિક્ષક',
    calendar: 'પરીક્ષા કેલેન્ડર',
    performance: 'પ્રદર્શન',
    admin: 'એડમિન પોર્ટલ',
    signIn: 'સાઇન ઇન',
    register: 'ખાતું બનાવો',
    signOut: 'સાઇન આઉટ',
    lowBandwidthMode: 'ઓછી બેન્ડવિડ્થ મોડ',
    darkMode: 'ડાર્ક મોડ',
    lightMode: 'લાઇટ મોડ',
    eligible: 'લાયક',
    activeWindows: 'સક્રિય અરજીઓ',
    closingSoon: 'ટૂંક સમયમાં સમાપ્ત',
    startOnboarding: 'શરૂ કરો',
    aiCompanion: 'AI શૈક્ષણિક સાથી',
    notebook: 'એન્ક્રિપ્ટેડ નોટબુક',
    sideBySidePreservationBadge: 'મશીન અનુવાદ — સત્તાવાર મૂળ લખાણ સાથે સાચવેલ',
    e2eeBadge: 'ક્લાયંટ-સાઇડ E2EE (ઝીરો-નોલેજ)',
    casVerifiedBadge: 'CAS / SymPy ગણિત દ્વારા પ્રમાણિત',
    epistemicIntegrityBadge: 'શૈક્ષણિક માર્ગદર્શન — સત્તાવાર ગેઝેટ ચકાસો',
  },
  pa: {
    tagline: 'ਹਰ ਪ੍ਰੀਖਿਆ। ਹਰ ਮੌਕਾ। ਇੱਕ ਪਲੇਟਫਾਰਮ।',
    antiScamWarning: 'ਸਿਰਫ਼ ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਡੋਮੇਨਾਂ (.gov.in, .nic.in, .ac.in) ਤੇ ਭਰੋਸਾ ਕਰੋ। EXAMVERSE ਕੋਈ ਫੀਸ ਨਹੀਂ ਲੈਂਦਾ।',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    exploreExams: 'ਪ੍ਰੀਖਿਆਵਾਂ ਖੋਜੋ',
    opportunityDiscovery: 'ਮੌਕਿਆਂ ਦੀ ਖੋਜ',
    higherStudies: 'ਉੱਚ ਸਿੱਖਿਆ',
    mockTests: 'ਮੌਕ ਟੈਸਟ',
    aiTutor: 'AI ਟਿਊਟਰ',
    calendar: 'ਪ੍ਰੀਖਿਆ ਕੈਲੰਡਰ',
    performance: 'ਕਾਰਗੁਜ਼ਾਰੀ',
    admin: 'ਐਡਮਿਨ ਪੋਰਟਲ',
    signIn: 'ਸਾਈਨ ਇਨ',
    register: 'ਖਾਤਾ ਬਣਾਓ',
    signOut: 'ਸਾਈਨ ਆਊਟ',
    lowBandwidthMode: 'ਘੱਟ ਬੈਂਡਵਿਡਥ ਮੋਡ',
    darkMode: 'ਡਾਰਕ ਮੋਡ',
    lightMode: 'ਲਾਈਟ ਮੋਡ',
    eligible: 'ਯੋਗ',
    activeWindows: 'ਸਰਗਰਮ ਅਰਜ਼ੀਆਂ',
    closingSoon: 'ਜਲਦੀ ਬੰਦ',
    startOnboarding: 'ਸ਼ੁਰੂ ਕਰੋ',
    aiCompanion: 'AI ਅਕਾਦਮਿਕ ਸਾਥੀ',
    notebook: 'ਇਨਕ੍ਰਿਪਟਡ ਨੋਟਬੁੱਕ',
    sideBySidePreservationBadge: 'ਮਸ਼ੀਨੀ ਅਨੁਵਾਦ — ਅਧਿਕਾਰਤ ਸਰੋਤ ਪਾਠ ਨਾਲ ਸੁਰੱਖਿਅਤ',
    e2eeBadge: 'ਕਲਾਇੰਟ-ਸਾਈਡ E2EE (ਜ਼ੀਰੋ-ਨੌਲੇਜ)',
    casVerifiedBadge: 'CAS / SymPy ਗਣਿਤਿਕ ਤੌਰ ਤੇ ਪ੍ਰਮਾਣਿਤ',
    epistemicIntegrityBadge: 'ਅਕਾਦਮਿਕ ਸੇਧ — ਅਧਿਕਾਰਤ ਨੋਟੀਫਿਕੇਸ਼ਨ ਵੇਖੋ',
  },
  or: {
    tagline: 'ପ୍ରତ୍ୟେକ ପରୀକ୍ଷା। ପ୍ରତ୍ୟେକ ସୁଯୋଗ। ଗୋଟିଏ ମଞ୍ଚ।',
    antiScamWarning: 'କେବଳ ସରକାରୀ ୱେବସାଇଟ୍ (.gov.in, .nic.in, .ac.in) କୁ ବିଶ୍ୱାସ କରନ୍ତୁ। EXAMVERSE କୌଣସି ଫି ଆଦାୟ କରେ ନାହିଁ।',
    dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    exploreExams: 'ପରୀକ୍ଷା ସୂଚୀ',
    opportunityDiscovery: 'ସୁଯୋଗ ଅନ୍ୱେଷଣ',
    higherStudies: 'ଉଚ୍ଚ ଶିକ୍ଷା ଓ ପିଜି',
    mockTests: 'ମକ୍ ଟେଷ୍ଟ',
    aiTutor: 'AI ଶିକ୍ଷକ',
    calendar: 'ପରୀକ୍ଷା କ୍ୟାଲେଣ୍ଡର',
    performance: 'ଦକ୍ଷତା ରିପୋର୍ଟ',
    admin: 'ପ୍ରଶାସକ ପୋର୍ଟାଲ',
    signIn: 'ସାଇନ୍ ଇନ୍',
    register: 'ଖାତା ଖୋଲନ୍ତୁ',
    signOut: 'ସାଇନ୍ ଆଉଟ୍',
    lowBandwidthMode: 'କମ୍-ବ୍ୟାଣ୍ଡୱିଡ୍ଥ ମୋଡ୍',
    darkMode: 'ଡାର୍କ ମୋଡ୍',
    lightMode: 'ଲାଇଟ୍ ମୋଡ୍',
    eligible: 'ଯୋଗ୍ୟ',
    activeWindows: 'ସକ୍ରିୟ ଆବେଦନ',
    closingSoon: 'ଶୀଘ୍ର ଶେଷ',
    startOnboarding: 'ଆରମ୍ଭ କରନ୍ତୁ',
    aiCompanion: 'AI ଶିକ୍ଷାଦାନ ସହଯୋଗୀ',
    notebook: 'ଏନକ୍ରିପ୍ଟେଡ୍ ନୋଟବୁକ୍',
    sideBySidePreservationBadge: 'ଯନ୍ତ୍ର ଅନୁବାଦ — ଅଫିସିଆଲ୍ ମୂଳ ପାଠ୍ୟ ସଂରକ୍ଷିତ',
    e2eeBadge: 'କ୍ଲାଏଣ୍ଟ-ସାଇଡ୍ E2EE (ଶୂନ୍ୟ-ଜ୍ଞାନ)',
    casVerifiedBadge: 'CAS / SymPy ଗାଣିତିକ ଯାଞ୍ଚ ହୋଇଛି',
    epistemicIntegrityBadge: 'ଶିକ୍ଷାଗତ ମାର୍ଗଦର୍ଶନ — ଅଫିସିଆଲ୍ PDF ଯାଞ୍ଚ କରନ୍ତୁ',
  },
  as: {
    tagline: 'প্ৰতিটো পৰীক্ষা। প্ৰতিটো সুযোগ। এটা মঞ্চ।',
    antiScamWarning: 'কেৱল চৰকাৰী ৱেবছাইট (.gov.in, .nic.in, .ac.in) ত বিশ্বাস ৰাখক। EXAMVERSE কোনো মাচুল সংগ্ৰহ নকৰে।',
    dashboard: 'ডেচবৰ্ড',
    exploreExams: 'পৰীক্ষাসমূহ',
    opportunityDiscovery: 'সুযোগ সন্ধান',
    higherStudies: 'উচ্চ শিক্ষা আৰু পিজি',
    mockTests: 'মক টেষ্ট',
    aiTutor: 'AI শিক্ষক',
    calendar: 'পৰীক্ষা কেলেণ্ডাৰ',
    performance: 'কাৰ্যক্ষমতা',
    admin: 'এডমিন পৰ্টেল',
    signIn: 'ছাইন ইন',
    register: 'একাউণ্ট সৃষ্টি কৰক',
    signOut: 'ছাইন আউট',
    lowBandwidthMode: 'নিম্ন-বেণ্ডৱিডথ মোড',
    darkMode: 'ডাৰ্ক মোড',
    lightMode: 'লাইট মোড',
    eligible: 'যোগ্য',
    activeWindows: 'সক্ৰিয় আবেদন',
    closingSoon: 'শীঘ্ৰে শেষ',
    startOnboarding: 'আৰম্ভ কৰক',
    aiCompanion: 'AI শৈক্ষিক সংগী',
    notebook: 'এনক্ৰিপ্ট কৰা নোটবুক',
    sideBySidePreservationBadge: 'যান্ত্ৰিক অনুবাদ — চৰকাৰী মূল পাঠ্য সংৰক্ষিত',
    e2eeBadge: 'ক্লায়েণ্ট-চাইড E2EE (শূন্য-জ্ঞান)',
    casVerifiedBadge: 'CAS / SymPy গাণিতিকভাৱে প্ৰমাণিত',
    epistemicIntegrityBadge: 'শৈক্ষিক পথপ্ৰদৰ্শন — অফিচিয়েল গেজেট পৰীক্ষা কৰক',
  },
  ur: {
    tagline: 'ہر امتحان۔ ہر موقع۔ ایک پلیٹ فارم۔',
    antiScamWarning: 'صرف سرکاری تصدیق شدہ ڈومینز (.gov.in, .nic.in, .ac.in) پر بھروسہ کریں۔ EXAMVERSE کبھی بھی امتحانی فیس وصول نہیں کرتا۔',
    dashboard: 'ڈیش بورڈ',
    exploreExams: 'امتحانات تلاش کریں',
    opportunityDiscovery: 'مواقع کی تلاش',
    higherStudies: 'اعلیٰ تعلیم و پی جی',
    mockTests: 'فرضی امتحانات',
    aiTutor: 'اے آئی استاد',
    calendar: 'امتحانی کیلنڈر',
    performance: 'کارکردگی',
    admin: 'ایڈمن پورٹل',
    signIn: 'سائن ان',
    register: 'اکاؤنٹ بنائیں',
    signOut: 'سائن آؤٹ',
    lowBandwidthMode: 'کم بینڈوتھ موڈ',
    darkMode: 'ڈارک موڈ',
    lightMode: 'لائٹ موڈ',
    eligible: 'اہل',
    activeWindows: 'فعال درخواستیں',
    closingSoon: 'جلد بند ہونے والا',
    startOnboarding: 'شروع کریں',
    aiCompanion: 'اے آئی تعلیمی رفیق',
    notebook: 'خفیہ کردہ شکوک نوٹ بک',
    sideBySidePreservationBadge: 'مشینی ترجمہ — سرکاری اصل متن ہمراہ محفوظ',
    e2eeBadge: 'کلائنٹ سائیڈ E2EE (صفر معلومات)',
    casVerifiedBadge: 'CAS / SymPy ریاضیاتی تصدیق شدہ',
    epistemicIntegrityBadge: 'تعلیمی رہنمائی — سرکاری نوٹیفکیشن پی ڈی ایف ضرور چیک کریں',
  },
};

// Also inject the Phase 8 keys to the remaining languages (en, hi, te, ta, kn, ml, bn, mr)
const PHASE_8_ENRICHMENTS: Record<LanguageCode, Record<string, string>> = {
  en: {
    aiCompanion: 'AI Academic Companion',
    notebook: 'Encrypted Doubt Notebook',
    sideBySidePreservationBadge: 'Machine/Localized Translation — Official Source Text Preserved Alongside',
    e2eeBadge: 'Client-Side E2EE (Zero-Knowledge)',
    casVerifiedBadge: 'CAS / SymPy Mathematically Verified',
    epistemicIntegrityBadge: 'AI Educational Guidance — Verify Official Rules in Source PDF',
  },
  hi: {
    aiCompanion: 'एआई शैक्षणिक साथी',
    notebook: 'एन्क्रिप्टेड डाउट नोटबुक',
    sideBySidePreservationBadge: 'मशीनी अनुवाद — आधिकारिक मूल पाठ साथ में सुरक्षित',
    e2eeBadge: 'क्लाइंट-साइड E2EE (शून्य-ज्ञान)',
    casVerifiedBadge: 'CAS / SymPy गणितीय रूप से सत्यापित',
    epistemicIntegrityBadge: 'एआई शैक्षणिक मार्गदर्शन — मूल अधिसूचना PDF से अवश्य जांचें',
  },
  te: {
    aiCompanion: 'AI విద్యా సహచరుడు',
    notebook: 'గుప్తీకరించిన నోట్‌బుక్',
    sideBySidePreservationBadge: 'మెషిన్ అనువాదం — అధికారిక మూల వచనం భద్రపరచబడింది',
    e2eeBadge: 'క్లయింట్-సైడ్ E2EE (జీరో-నాలెడ్జ్)',
    casVerifiedBadge: 'CAS / SymPy గణితపరంగా ధృవీకరించబడింది',
    epistemicIntegrityBadge: 'విద్యా మార్గదర్శకత్వం — అధికారిక PDF ని తనిఖీ చేయండి',
  },
  ta: {
    aiCompanion: 'AI கல்வித் தோழன்',
    notebook: 'மறைகுறியாக்கப்பட்ட நோட்புக்',
    sideBySidePreservationBadge: 'இயந்திர மொழிபெயர்ப்பு — அதிகாரப்பூர்வ மூல உரை பாதுகாக்கப்பட்டது',
    e2eeBadge: 'கிளையண்ட்-பக்க E2EE (ஜீரோ-அறிவு)',
    casVerifiedBadge: 'CAS / SymPy கணித ரீதியாக சரிபார்க்கப்பட்டது',
    epistemicIntegrityBadge: 'கல்வி வழிகாட்டுதல் — அதிகாரப்பூர்வ அறிவிப்பை சரிபார்க்கவும்',
  },
  kn: {
    aiCompanion: 'AI ಶೈಕ್ಷಣಿಕ ಒಡನಾಡಿ',
    notebook: 'ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ನೋಟ್‌ಬುಕ್',
    sideBySidePreservationBadge: 'ಯಂತ್ರ ಅನುವಾದ — ಅಧಿಕೃತ ಮೂಲ ಪಠ್ಯವನ್ನು ಸಂರಕ್ಷಿಸಲಾಗಿದೆ',
    e2eeBadge: 'ಕ್ಲೈಂಟ್-ಸೈಡ್ E2EE (ಶೂನ್ಯ-ಜ್ಞಾನ)',
    casVerifiedBadge: 'CAS / SymPy ಗಣಿತೀಯವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    epistemicIntegrityBadge: 'ಶೈಕ್ಷಣಿಕ ಮಾರ್ಗದರ್ಶನ — ಅಧಿಕೃತ PDF ಪರಿಶೀಲಿಸಿ',
  },
  ml: {
    aiCompanion: 'AI അക്കാദമിക് കൂട്ടുകാരൻ',
    notebook: 'എൻക്രിപ്റ്റ് ചെയ്ത നോട്ട്ബുക്ക്',
    sideBySidePreservationBadge: 'മെഷീൻ വിവർത്തനം — ഔദ്യോഗിക ഉറവിട വാചകം ഒപ്പം സംരക്ഷിച്ചു',
    e2eeBadge: 'ക്ലയന്റ്-സൈഡ് E2EE (സീറോ-നോളജ്)',
    casVerifiedBadge: 'CAS / SymPy ഗണിതശാസ്ത്രപരമായി പരിശോധിച്ചു',
    epistemicIntegrityBadge: 'വിദ്യാഭ്യാസ മാർഗ്ഗനിർദ്ദേശം — ഔദ്യോഗിക വിജ്ഞാപനം പരിശോധിക്കുക',
  },
  bn: {
    aiCompanion: 'এআই একাডেমিক সঙ্গী',
    notebook: 'এনক্রিপ্ট করা নোটবুক',
    sideBySidePreservationBadge: 'মেশিন অনুবাদ — অফিসিয়াল মূল পাঠ্য অক্ষুণ্ণ সংরক্ষিত',
    e2eeBadge: 'ক্লায়েন্ট-সাইড E2EE (জিরো-নলেজ)',
    casVerifiedBadge: 'CAS / SymPy গাণিতিকভাবে যাচাইকৃত',
    epistemicIntegrityBadge: 'শিক্ষামূলক নির্দেশনা — অফিসিয়াল বিজ্ঞপ্তির PDF যাচাই করুন',
  },
  mr: {
    aiCompanion: 'एआय शैक्षणिक साथी',
    notebook: 'एनक्रिप्टेड डाऊट नोटबुक',
    sideBySidePreservationBadge: 'यंत्र अनुवाद — अधिकृत मूळ मजकूर सोबत जतन केला आहे',
    e2eeBadge: 'क्लायंट-साइड E2EE (शून्य-ज्ञान)',
    casVerifiedBadge: 'CAS / SymPy गणितीयदृष्ट्या पडताळणीकृत',
    epistemicIntegrityBadge: 'शैक्षणिक मार्गदर्शन — अधिकृत मूळ PDF मधून तपासा',
  },
  gu: {},
  pa: {},
  or: {},
  as: {},
  ur: {},
};

// Merge enrichments
for (const lang of Object.keys(PHASE_8_ENRICHMENTS) as LanguageCode[]) {
  if (TRANSLATIONS[lang]) {
    Object.assign(TRANSLATIONS[lang], PHASE_8_ENRICHMENTS[lang]);
  }
}

export function getTranslation(lang: LanguageCode, key: string): string {
  const table = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return table[key] || TRANSLATIONS.en[key] || key;
}

/**
 * Safe translation lookup with automatic English fallback
 * Prevents missing keys from rendering undefined or blank strings.
 */
export function t(key: string, lang: LanguageCode = 'en'): string {
  const catalog = TRANSLATIONS[lang];
  if (catalog && catalog[key]) {
    return catalog[key];
  }
  // Fallback to English catalog
  const enCatalog = TRANSLATIONS.en;
  if (enCatalog && enCatalog[key]) {
    return enCatalog[key];
  }
  // Fallback to humanized key name if missing in all catalogs
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

export function isLanguageRTL(lang: LanguageCode): boolean {
  return lang === 'ur';
}

/**
 * Dynamically applies document direction and language attribute
 * Ensures Urdu triggers RTL mirroring, and other Indian languages maintain LTR
 */
export function applyLanguageDirection(lang: LanguageCode): void {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
    const isRTL = isLanguageRTL(lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    if (isRTL) {
      document.documentElement.classList.add('rtl-layout');
    } else {
      document.documentElement.classList.remove('rtl-layout');
    }
  }
}

/**
 * Normalizes Romanized / Hinglish search queries into canonical search terms
 * e.g., 'sarkari naukri' -> 'government recruitment'
 *       'gate tayari' -> 'gate preparation'
 *       'pariksha patrata' -> 'exam eligibility'
 */
export function normalizeRomanizedQuery(rawQuery: string): string {
  if (!rawQuery) return '';
  let q = rawQuery.toLowerCase().trim();

  const transliterationMap: Record<string, string> = {
    'sarkari': 'government',
    'naukri': 'recruitment job',
    'bharti': 'recruitment',
    'pariksha': 'exam examination',
    'tayari': 'preparation syllabus',
    'taiyari': 'preparation syllabus',
    'patrata': 'eligibility criteria',
    'yogyata': 'eligibility',
    'aayu': 'age limit',
    'umra': 'age limit',
    'shulk': 'application fee',
    'tareekh': 'exam date schedule',
    'tarikh': 'exam date schedule',
    'cutoff': 'qualifying marks cutoff',
    'pad': 'vacancies posts',
    'vetan': 'salary pay scale',
    'vetanman': 'pay scale level',
  };

  for (const [hindiRoman, englishCanonical] of Object.entries(transliterationMap)) {
    const regex = new RegExp(`\\b${hindiRoman}\\b`, 'gi');
    if (regex.test(q)) {
      q = q.replace(regex, `${hindiRoman} ${englishCanonical}`);
    }
  }

  return q.replace(/\s+/g, ' ').trim();
}
