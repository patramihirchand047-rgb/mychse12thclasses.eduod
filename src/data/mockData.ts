import {
  Student,
  Lesson,
  MockTest,
  PaymentReceipt,
  Announcement,
  AuditLog,
  AdminUser,
  TestRanking,
  RegistrationApplication,
  SystemGatewayConfig,
  ChapterItem,
  BoardQuestion,
  MCQItem,
} from '../types';

export const INITIAL_ADMIN: AdminUser = {
  id: 'adm-01',
  name: 'Mihir Chand Patra',
  email: 'patramihirchand66@gmail.com',
  mobile: '+91 89174 08498',
  role: 'Super Administrator',
  avatarInitials: 'MP',
  lastLogin: 'Today at 08:30 AM',
  securityPin: '3971',
};

export const INITIAL_GATEWAY_CONFIG: SystemGatewayConfig = {
  upiVpa: 'mychseclasses@naviaxis',
  payeeDisplayName: 'MIHIRCHAND PATRA',
  razorpayMode: 'live',
  razorpayKeyId: 'rzp_live_chse2026_hdfc',
  razorpayKeySecret: 'sec_live_984920491823904',
  pricing: {
    arts: 99,
    science: 149,
    commerce: 149,
    artsOriginal: 499,
    scienceOriginal: 799,
    commerceOriginal: 799,
  },
  adminMobile: '+91 89174 08498',
  adminEmail: 'patramihirchand66@gmail.com',
  securityPin: '3971',
  autoLogoutMinutes: 15,
};

export const ODISHA_DISTRICTS = [
  'Khordha',
  'Cuttack',
  'Ganjam',
  'Sambalpur',
  'Balasore',
  'Mayurbhanj',
  'Puri',
  'Sundargarh',
  'Bhadrak',
  'Bargarh',
  'Keonjhar',
  'Bolangir',
  'Kalahandi',
  'Angul',
  'Dhenkanal',
  'Jajpur',
  'Kendrapada',
  'Jagatsinghpur',
  'Nayagarh',
  'Kandhamal',
  'Koraput',
  'Nabarangpur',
  'Rayagada',
  'Malkangiri',
];

export const ODISHA_COLLEGES = [
  'B.J.B. Autonomous Higher Secondary College, Bhubaneswar',
  'Ravenshaw Higher Secondary School, Cuttack',
  'Khalikote Higher Secondary College, Berhampur',
  'Fakir Mohan Higher Secondary College, Balasore',
  'Gangadhar Meher Higher Secondary School, Sambalpur',
  'Samanta Chandra Sekhar (SCS) Higher Secondary College, Puri',
  'Dharanidhar Higher Secondary College, Keonjhar',
  'Maharaja Purna Chandra (MPC) College, Baripada',
  'Government Higher Secondary College, Rourkela',
  'Dhenkanal Autonomous College, Dhenkanal',
  'Rajendra Higher Secondary College, Bolangir',
  'Stewart Science College, Cuttack',
];

export const STREAM_SUBJECTS: Record<string, string[]> = {
  Science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'IT', 'Odia', 'English'],
  Arts: ['Political Science', 'History', 'Economics', 'Education', 'Logic', 'Odia', 'English'],
  Commerce: ['Accountancy', 'Business Studies', 'Management', 'Economics', 'Odia', 'English'],
};

export const INITIAL_APPLICATIONS: RegistrationApplication[] = [];

export const INITIAL_CHAPTERS: ChapterItem[] = [
  // Science - Physics
  {
    id: 'chap-phy-01',
    chapterNo: 1,
    title: 'Electrostatics & Electric Charges',
    titleOdia: 'ସ୍ଥିର ବିଦ୍ୟୁତ୍ ଏବଂ ବିଦ୍ୟୁତ୍ ଆଧାନ',
    stream: 'Science',
    subject: 'Physics',
    isFree: true,
    notesMarkdown: `# Chapter 1: Electrostatics & Electric Charges

## 1. Coulomb's Law
The electrostatic force of attraction or repulsion between two point charges $q_1$ and $q_2$ separated by a distance $r$ is:
$$F = \\frac{1}{4\\pi \\varepsilon_0} \\frac{|q_1 q_2|}{r^2}$$
where $\\frac{1}{4\\pi \\varepsilon_0} = 9 \\times 10^9 \\text{ N}\\cdot\\text{m}^2/\\text{C}^2$.

## 2. Electric Field & Potential
The electric field at a point is the force experienced by a unit positive test charge placed at that point:
$$E = \\frac{F}{q_0}$$

### Odia Key Concepts (ଓଡ଼ିଆରେ ମୁଖ୍ୟ ତତ୍ତ୍ୱ):
- **କୁଲମ୍ବ୍ଙ୍କ ନିୟମ**: ଦୁଇଟି ସ୍ଥିର ବିନ୍ଦୁ ଆଧାନ ମଧ୍ୟରେ ଥିବା ଆକର୍ଷଣ ବା ବିକର୍ଷଣ ବଳ ସେମାନଙ୍କ ଗୁଣଫଳ ସହିତ ସମାନୁପାତୀ ଏବଂ ଦୂରତାର ବର୍ଗ ସହିତ ବ୍ୟସ୍ତାନୁପାତୀ ।
- **ବିଦ୍ୟୁତ୍ ଫ୍ଲକ୍ସ**: ଗାଉସ୍ଙ୍କ ନିୟମ ଅନୁଯାୟୀ ଏକ ଆବଦ୍ଧ ପୃଷ୍ଠ ଦେଇ ଗତି କରୁଥିବା ମୋଟ ଫ୍ଲକ୍ସ = $q / \\varepsilon_0$ ।`,
    odiaSummary: 'ସ୍ଥିର ବିଦ୍ୟୁତ୍, କୁଲମ୍ବଙ୍କ ନିୟମ, ବିଦ୍ୟୁତ୍ କ୍ଷେତ୍ର ରେଖା ଏବଂ ଗାଉସ୍ଙ୍କ ନିୟମର ମୁଖ୍ୟ ସୂତ୍ରାବଳୀ ।',
    boardQuestionsCount: 4,
    mcqCount: 5,
  },
  {
    id: 'chap-phy-02',
    chapterNo: 2,
    title: 'Current Electricity & Kirchhoff’s Laws',
    titleOdia: 'ପ୍ରବାହୀ ବିଦ୍ୟୁତ୍ ଏବଂ କିର୍କଫ୍ଙ୍କ ନିୟମ',
    stream: 'Science',
    subject: 'Physics',
    isFree: false,
    notesMarkdown: `# Chapter 2: Current Electricity & Circuits

## 1. Ohm's Law and Drift Velocity
$$I = n A e v_d$$
Current density $J = \\sigma E$.

## 2. Kirchhoff's Laws
- **Current Law (KCL)**: $\\sum I = 0$ (Conservation of Charge)
- **Voltage Law (KVL)**: $\\sum \\Delta V = 0$ (Conservation of Energy)

## 3. Wheatstone Bridge Principle
For balanced bridge: $\\frac{P}{Q} = \\frac{R}{S}$.`,
    odiaSummary: 'କିର୍କଫ୍ଙ୍କ ପ୍ରଥମ ଓ ଦ୍ୱିତୀୟ ନିୟମ, ହ୍ୱିଟଷ୍ଟୋନ୍ ବ୍ରିଜ୍ ନୀତି ଏବଂ ପୋଟେନସିଓମିଟର ପ୍ରୟୋଗ ।',
    boardQuestionsCount: 3,
    mcqCount: 5,
  },
  // Arts - Political Science
  {
    id: 'chap-pol-01',
    chapterNo: 1,
    title: 'Democracy in India: Challenges & Working',
    titleOdia: 'ଭାରତରେ ଗଣତନ୍ତ୍ର: ଆହ୍ୱାନ ଏବଂ କାର୍ଯ୍ୟକାରିତା',
    stream: 'Arts',
    subject: 'Political Science',
    isFree: true,
    notesMarkdown: `# Chapter 1: Democracy in India

## Core Themes
1. Meaning and forms of Democracy (Direct vs Representative)
2. Inequality, regionalism, communalism, and corruption as major challenges
3. Role of Election Commission of India and voting reforms

### Odia Summary (ଓଡ଼ିଆ ସାରାଂଶ):
ଗଣତନ୍ତ୍ର ହେଉଛି ଲୋକମାନଙ୍କର, ଲୋକମାନଙ୍କ ଦ୍ୱାରା ଏବଂ ଲୋକମାନଙ୍କ ପାଇଁ ଶାସନ (ଆବ୍ରାହାମ ଲିଙ୍କନ) । ଭାରତୀୟ ସମ୍ବିଧାନ ଏକ ସାର୍ବଭୌମ, ସମାଜବାଦୀ, ଧର୍ମନିରପେକ୍ଷ ଏବଂ ଗଣତାନ୍ତ୍ରିକ ଗଣରାଜ୍ୟ ପ୍ରତିଷ୍ଠା କରେ ।`,
    odiaSummary: 'ଭାରତୀୟ ଗଣତନ୍ତ୍ରର ମୂଳଦୁଆ, ପ୍ରତ୍ୟକ୍ଷ ଓ ପରୋକ୍ଷ ଗଣତନ୍ତ୍ର ଏବଂ ଆଞ୍ଚଳିକତାବାଦ ବିରୁଦ୍ଧରେ ପଦକ୍ଷେପ ।',
    boardQuestionsCount: 4,
    mcqCount: 4,
  },
  {
    id: 'chap-pol-02',
    chapterNo: 2,
    title: 'Indian Foreign Policy & Non-Aligned Movement (NAM)',
    titleOdia: 'ଭାରତର ବୈଦେଶିକ ନୀତି ଏବଂ ନିରପେକ୍ଷ ଆନ୍ଦୋଳନ',
    stream: 'Arts',
    subject: 'Political Science',
    isFree: false,
    notesMarkdown: `# Chapter 2: Indian Foreign Policy

## Key Principles:
1. Panchasheel Principles (1954 Indo-China agreement)
2. Non-Aligned Movement (NAM) founded by Nehru, Tito, Nasser
3. India's Act East Policy & relations with South Asian neighbors (SAARC).`,
    odiaSummary: 'ପଞ୍ଚଶୀଳ ନୀତି, ନିରପେକ୍ଷ ଆନ୍ଦୋଳନ (NAM) ଏବଂ ସାର୍କ (SAARC) ସହିତ ଭାରତର ସମ୍ପର୍କ ।',
    boardQuestionsCount: 3,
    mcqCount: 4,
  },
  // Commerce - Accountancy
  {
    id: 'chap-acc-01',
    chapterNo: 1,
    title: 'Accounting for Partnership: Fundamentals',
    titleOdia: 'ଅଂଶୀଦାରୀ ବ୍ୟବସାୟର ହିସାବ ସୂତ୍ର',
    stream: 'Commerce',
    subject: 'Accountancy',
    isFree: true,
    notesMarkdown: `# Chapter 1: Partnership Fundamentals

## Essential Topics:
1. Partnership Deed provisions in absence of agreement
2. Profit and Loss Appropriation Account preparation
3. Guarantee of minimum profit to a partner.`,
    odiaSummary: 'ଅଂଶୀଦାରୀ ଚୁକ୍ତିପତ୍ର ଅଭାବରେ ନିୟମାବଳୀ ଏବଂ ଲାଭ-କ୍ଷତି ବିନିଯୋଗ ହିସାବ ।',
    boardQuestionsCount: 4,
    mcqCount: 4,
  },
  {
    id: 'chap-acc-02',
    chapterNo: 2,
    title: 'Issue & Forfeiture of Company Shares',
    titleOdia: 'କମ୍ପାନୀ ଅଂଶଧନ (Shares) ନିର୍ଗମ ଓ ବାଜ୍ୟାପ୍ତି',
    stream: 'Commerce',
    subject: 'Accountancy',
    isFree: false,
    notesMarkdown: `# Chapter 2: Accounting for Share Capital

## Core Journal Entries:
1. Share Application Money received and transferred
2. Calls in Arrears & Calls in Advance
3. Forfeiture of Shares & Re-issue at discount.`,
    odiaSummary: 'କମ୍ପାନୀ ସେୟାର ଆବେଦନ, ଆବଣ୍ଟନ ଏବଂ ବାଜ୍ୟାପ୍ତି (Forfeiture) ଜର୍ଣ୍ଣାଲ ଏଣ୍ଟ୍ରି ।',
    boardQuestionsCount: 3,
    mcqCount: 4,
  },
];

export const INITIAL_BOARD_QUESTIONS: BoardQuestion[] = [
  {
    id: 'bq-01',
    chapterId: 'chap-phy-01',
    markType: '2-Mark',
    questionText: 'State Coulomb’s Law in electrostatics and write down its vector form.',
    questionOdia: 'ସ୍ଥିର ବିଦ୍ୟୁତ୍ କ୍ଷେତ୍ରରେ କୁଲମ୍ବ୍ଙ୍କ ନିୟମ ବର୍ଣ୍ଣନା କର ଏବଂ ଏହାର ଭେକ୍ଟର ରୂପ ଲେଖ ।',
    answerText: 'Coulomb’s law states that the force between two stationary point charges is directly proportional to the product of charges and inversely proportional to the square of the distance between them. In vector form: F_12 = (1 / 4πε₀) * (q₁q₂ / r²) * r̂₁₂.',
    answerOdia: 'ଦୁଇଟି ସ୍ଥିର ବିନ୍ଦୁ ଆଧାନ ମଧ୍ୟରେ ଥିବା ଆକର୍ଷଣ କିମ୍ବା ବିକର୍ଷଣ ବଳ ସେମାନଙ୍କ ଆଧାନର ଗୁଣଫଳ ସହ ସମାନୁପାତୀ ଏବଂ ସେମାନଙ୍କ ମଧ୍ୟବର୍ତ୍ତୀ ଦୂରତାର ବର୍ଗ ସହ ବ୍ୟସ୍ତାନୁପାତୀ ।',
    yearAppeared: 'CHSE Odisha 2024 Annual',
  },
  {
    id: 'bq-02',
    chapterId: 'chap-phy-01',
    markType: '3-Mark',
    questionText: 'Derive an expression for electric potential due to a point charge at a distance r.',
    questionOdia: 'ଏକ ବିନ୍ଦୁ ଆଧାନ ଠାରୁ r ଦୂରତାରେ ବିଦ୍ୟୁତ୍ ବିଭବର ସୂତ୍ର ନିର୍ଣ୍ଣୟ କର ।',
    answerText: 'Electric potential V is the work done in bringing a unit positive charge from infinity to that point against electrostatic force. W = ∫ F · dr = ∫ (q / 4πε₀ r²) dr = q / 4πε₀ r. Therefore, V = q / (4πε₀ r).',
    answerOdia: 'ଅନନ୍ତ ଦୂରତାରୁ ଏକ ଏକକ ଧନାତ୍ମକ ଆଧାନକୁ ବିଦ୍ୟୁତ୍ କ୍ଷେତ୍ରର କୌଣସି ବିନ୍ଦୁକୁ ଆଣିବା ପାଇଁ ଯେଉଁ ପରିମାଣର କାର୍ଯ୍ୟ କରିବାକୁ ପଡେ, ତାହାକୁ ସେହି ବିନ୍ଦୁର ବିଭବ (V) କୁହାଯାଏ । V = q / (4πε₀ r) ।',
    yearAppeared: 'CHSE Odisha 2023 Annual',
  },
  {
    id: 'bq-03',
    chapterId: 'chap-phy-01',
    markType: '5-Mark',
    questionText: 'State Gauss’s theorem in electrostatics. Apply it to calculate the electric field due to an infinitely long straight charged wire.',
    questionOdia: 'ଗାଉସ୍ଙ୍କ ପ୍ରମେୟ ଉଲ୍ଲେଖ କର । ଏହାକୁ ପ୍ରୟୋଗ କରି ଏକ ଅସୀମ ଦୈର୍ଘ୍ୟ ବିଶିଷ୍ଟ ସରଳ ରେଖୀୟ ଚାର୍ଜିତ ତାରର ବିଦ୍ୟୁତ୍ କ୍ଷେତ୍ର ନିର୍ଣ୍ଣୟ କର ।',
    answerText: 'Gauss’s theorem states that the total electric flux through a closed Gaussian surface is equal to 1/ε₀ times the net charge enclosed by the surface (∮ E · dS = q / ε₀). For an infinite straight line charge of linear density λ, choosing a cylindrical Gaussian surface of radius r and length L: E · (2πrL) = λL / ε₀ => E = λ / (2πε₀ r).',
    answerOdia: 'ଗାଉସ୍ଙ୍କ ତତ୍ତ୍ୱ ଅନୁସାରେ ଯେ କୌଣସି ଆବଦ୍ଧ ପୃଷ୍ଠ ଦେଇ ନିର୍ଗତ ମୋଟ ବିଦ୍ୟୁତ୍ ଫ୍ଲକ୍ସ, ତାହା ଭିତରେ ଥିବା ଆଧାନର ୧/ε₀ ଗୁଣ । ସରଳ ତାର ପାଇଁ: E = λ / (2πε₀ r) ।',
    yearAppeared: 'CHSE Odisha 2022 & 2020 Long Answer',
  },
  {
    id: 'bq-04',
    chapterId: 'chap-pol-01',
    markType: '2-Mark',
    questionText: 'Explain any two major differences between Direct Democracy and Indirect Democracy.',
    questionOdia: 'ପ୍ରତ୍ୟକ୍ଷ ଗଣତନ୍ତ୍ର ଓ ପରୋକ୍ଷ ଗଣତନ୍ତ୍ର ମଧ୍ୟରେ ଦୁଇଟି ମୁଖ୍ୟ ପାର୍ଥକ୍ୟ ଦର୍ଶାଅ ।',
    answerText: '1. In Direct Democracy, citizens participate directly in law-making (e.g. Switzerland via referendum). In Indirect Democracy, citizens elect representatives to make laws (e.g. India). 2. Direct democracy is feasible only for small populations, while indirect democracy works for large diverse nations.',
    answerOdia: '୧. ପ୍ରତ୍ୟକ୍ଷ ଗଣତନ୍ତ୍ରରେ ଲୋକମାନେ ସିଧାସଳଖ ଆଇନ ପ୍ରଣୟନରେ ଅଂଶଗ୍ରହଣ କରନ୍ତି (ଯେପରି ସ୍ୱିଜରଲ୍ୟାଣ୍ଡ) । ପରୋକ୍ଷ ଗଣତନ୍ତ୍ରରେ ନିର୍ବାଚିତ ପ୍ରତିନିଧିମାନେ ଶାସନ କରନ୍ତି (ଯେପରି ଭାରତ) ।',
    yearAppeared: 'CHSE Arts 2024 Model Paper',
  },
  {
    id: 'bq-05',
    chapterId: 'chap-acc-01',
    markType: '3-Mark',
    questionText: 'What rules apply in the absence of a Partnership Deed according to the Indian Partnership Act, 1932?',
    questionOdia: 'ଅଂଶୀଦାରୀ ଚୁକ୍ତିପତ୍ର ଅନୁପସ୍ଥିତିରେ ଭାରତୀୟ ଅଂଶୀଦାରୀ ଆଇନ୍, ୧୯୩୨ ଅନୁଯାୟୀ କେଉଁ ନିୟମାବଳୀ ଲାଗୁ ହୁଏ?',
    answerText: '1. Profits & losses are shared equally. 2. No interest on capital is allowed. 3. No interest on drawings is charged. 4. Interest on loan advanced by a partner is allowed @ 6% p.a. 5. No partner is entitled to any salary or commission.',
    answerOdia: '୧. ଲାଭ ଓ କ୍ଷତି ସମାନ ଭାବେ ବଣ୍ଟାଯାଏ । ୨. ପୁଞ୍ଜି ଉପରେ କୌଣସି ସୁଧ ଦିଆଯାଏ ନାହିଁ । ୩. ଅଂଶୀଦାରଙ୍କ ଋଣ ଉପରେ ବାର୍ଷିକ ୬% ହାରରେ ସୁଧ ମିଳେ ।',
    yearAppeared: 'CHSE Commerce 2023',
  },
];

export const INITIAL_MCQS: MCQItem[] = [
  {
    id: 'mcq-01',
    chapterId: 'chap-phy-01',
    question: 'The SI unit of electric permittivity (ε₀) of free space is:',
    questionOdia: 'ମୁକ୍ତ ସ୍ଥାନର ବିଦ୍ୟୁତ୍ ପ୍ରବେଶ୍ୟତା (ε₀) ର SI ଏକକ କ’ଣ?',
    options: ['C² N⁻¹ m⁻²', 'N m² C⁻²', 'N C⁻¹ m', 'C N⁻¹ m⁻¹'],
    correctOptionIndex: 0,
    explanation: 'From Coulomb’s law F = (1/4πε₀) (q₁q₂/r²), we have ε₀ = q₁q₂ / (4π F r²). Hence unit is C² / (N m²) = C² N⁻¹ m⁻².',
    explanationOdia: 'କୁଲମ୍ବଙ୍କ ସୂତ୍ରରୁ ε₀ = C² N⁻¹ m⁻² ନିର୍ଣ୍ଣୟ ହୁଏ ।',
  },
  {
    id: 'mcq-02',
    chapterId: 'chap-phy-01',
    question: 'Two charges +2 µC and -2 µC placed 10 cm apart form an electric dipole. The electric field at the mid-point of the dipole is:',
    questionOdia: '+2 µC ଏବଂ -2 µC ଦୁଇଟି ଆଧାନ 10 cm ଦୂରରେ ଅବସ୍ଥିତ । ଦ୍ୱିମେରୁର ମଧ୍ୟବିନ୍ଦୁରେ ବିଦ୍ୟୁତ୍ କ୍ଷେତ୍ରର ଦିଗ କେଉଁଆଡ଼କୁ ହେବ?',
    options: ['Zero', 'Directed towards +2 µC', 'Directed towards -2 µC', 'Perpendicular to dipole axis'],
    correctOptionIndex: 2,
    explanation: 'Both positive and negative charges produce electric fields in the same direction (from + to -) at the mid-point, reinforcing towards the negative charge.',
    explanationOdia: 'ମଧ୍ୟବିନ୍ଦୁରେ ଉଭୟ ଆଧାନର ବିଦ୍ୟୁତ୍ କ୍ଷେତ୍ର ଧନାତ୍ମକରୁ ଋଣାତ୍ମକ ଆଡ଼କୁ ଏକତ୍ରିତ ହୁଏ ।',
  },
  {
    id: 'mcq-03',
    chapterId: 'chap-pol-01',
    question: 'Which amendment to the Constitution of India added the words "Socialist" and "Secular" to the Preamble?',
    questionOdia: 'କେଉଁ ସମ୍ବିଧାନ ସଂଶୋଧନ ଦ୍ୱାରା ଭାରତୀୟ ସମ୍ବିଧାନର ପ୍ରସ୍ତାବନାରେ "ସମାଜବାଦୀ" ଏବଂ "ଧର୍ମନିରପେକ୍ଷ" ଶବ୍ଦ ଯୋଡ଼ାଯାଇଥିଲା?',
    options: ['42nd Amendment Act (1976)', '44th Amendment Act (1978)', '73rd Amendment Act (1992)', '86th Amendment Act (2002)'],
    correctOptionIndex: 0,
    explanation: 'The 42nd Constitutional Amendment Act of 1976 added "Socialist", "Secular", and "Integrity" to the Preamble under Prime Minister Indira Gandhi.',
    explanationOdia: '୧୯୭୬ ମସିହାର ୪୨ତମ ସମ୍ବିଧାନ ସଂଶୋଧନ ଦ୍ୱାରା ଏହି ଦୁଇଟି ଶବ୍ଦ ପ୍ରସ୍ତାବନାରେ ସନ୍ନିବେଶିତ କରାଯାଇଥିଲା ।',
  },
  {
    id: 'mcq-04',
    chapterId: 'chap-acc-01',
    question: 'In the absence of any agreement in the Partnership Deed, the rate of interest allowed on partner’s loan is:',
    questionOdia: 'ଚୁକ୍ତିପତ୍ର ନଥିଲେ ଅଂଶୀଦାରଙ୍କ ଋଣ ଉପରେ କେତେ ପ୍ରତିଶତ ସୁଧ ପ୍ରଦାନ କରାଯାଏ?',
    options: ['5% per annum', '6% per annum', '8% per annum', 'No interest is paid'],
    correctOptionIndex: 1,
    explanation: 'Section 13(d) of the Indian Partnership Act, 1932 provides for 6% p.a. interest on advances/loans made by a partner beyond capital.',
    explanationOdia: 'ଭାରତୀୟ ଅଂଶୀଦାରୀ ଆଇନ ୧୯୩୨ ଅନୁସାରେ ଋଣ ଉପରେ ବାର୍ଷିକ ୬% ସୁଧ ପ୍ରଦାନ କରାଯାଏ ।',
  },
];


export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_44086a7c-082a-4aee-a13f-8eba428901af',
    chseRegNo: 'MYCHSE-2026-00001',
    rollNo: '2026-00001',
    name: 'Swapnarani Patra',
    fatherName: 'Mihirchand Patra',
    mobileNumber: '8917408498',
    email: 'swapnaranipatrasalani@gmail.com',
    gmail: 'swapnaranipatrasalani@gmail.com',
    age: 17,
    classYear: '+2 2nd Year',
    batchYear: '2026-27',
    stream: 'Arts',
    district: 'Boudh',
    college: 'Kantamal Jr College, Boudh',
    block: 'Kantamal',
    state: 'Odisha',
    address: 'At- Narayanaprasad , Po- Narayanaprasad , Block - Kantamal , Dist- Boudh , Odisha, Pincode- 762017',
    subjects: ['English', 'MIL (Odia)', 'History', 'Political Science', 'Sanskrit', 'Education'],
    subject_1: 'English',
    subject_2: 'MIL (Odia)',
    subject_3: 'History',
    subject_4: 'Political Science',
    subject_5: 'Sanskrit',
    subject_6: 'Education',
    admissionDate: '2026-09-15',
    admission_status: 'Approved',
    accountStatus: 'Active',
    courseAccessApproved: true,
    enrolledPackage: 'Arts +2 2nd Year Master Pack',
    passwordHash: 'MYCHSE@2026',
    registeredDate: '2026-09-15',
    lastActive: 'Today',
    totalMockTestsTaken: 3,
    avgScorePercentage: 78,
  },
  {
    id: 'std_3a432757-1354-45e6-b1e3-18f627b00d4f',
    chseRegNo: 'MYCHSE-2026-00002',
    rollNo: '2026-00002',
    name: 'RITIK ROSHAN',
    fatherName: 'Not specified',
    mobileNumber: '9861234567',
    email: 'gma@gmail.com',
    gmail: 'gma@gmail.com',
    age: 18,
    classYear: '+2 2nd Year',
    batchYear: '2026-27',
    stream: 'Arts',
    district: 'Khordha',
    college: 'Bhubaneswar Jr College, Khordha',
    block: 'Bhubaneswar',
    state: 'Odisha',
    address: 'Gohiria, Bhubaneswar, Khordha, Odisha',
    subjects: ['English', 'MIL (Odia)', 'History', 'Political Science', 'Economics', 'Education'],
    subject_1: 'English',
    subject_2: 'MIL (Odia)',
    subject_3: 'History',
    subject_4: 'Political Science',
    subject_5: 'Economics',
    subject_6: 'Education',
    admissionDate: '2026-09-20',
    admission_status: 'Approved',
    accountStatus: 'Active',
    courseAccessApproved: true,
    enrolledPackage: 'Arts +2 2nd Year Master Pack',
    passwordHash: 'MYCHSE@2026',
    registeredDate: '2026-09-20',
    lastActive: 'Today',
    totalMockTestsTaken: 1,
    avgScorePercentage: 82,
  },
  {
    id: 'std_2e66e962-a88c-4a76-a809-9f901fd2035c',
    chseRegNo: 'MYCHSE-2026-00003',
    rollNo: '2026-00003',
    name: 'Sarita bhoi',
    fatherName: 'Not specified',
    mobileNumber: '9437123456',
    email: 'saritabhoi103@gmail.com',
    gmail: 'saritabhoi103@gmail.com',
    age: 17,
    classYear: '+2 2nd Year',
    batchYear: '2026-27',
    stream: 'Arts',
    district: 'Sambalpur',
    college: 'Jujumura Jr College, Sambalpur',
    block: 'Jujumura',
    state: 'Odisha',
    address: 'Basiapada, block-jujomura dist-Sambalpur, pin-768105',
    subjects: ['MIL (Odia)', 'History', 'Economics', 'Education', 'Sanskrit', 'English'],
    subject_1: 'MIL (Odia)',
    subject_2: 'History',
    subject_3: 'Economics',
    subject_4: 'Education',
    subject_5: 'Sanskrit',
    subject_6: 'English',
    admissionDate: '2026-09-21',
    admission_status: 'Approved',
    accountStatus: 'Active',
    courseAccessApproved: true,
    enrolledPackage: 'Arts +2 2nd Year Master Pack',
    passwordHash: 'MYCHSE@2026',
    registeredDate: '2026-09-21',
    lastActive: 'Yesterday',
    totalMockTestsTaken: 2,
    avgScorePercentage: 75,
  },
  {
    id: 'std_c193f9ab-8a7c-4045-a794-31bde4c257d0',
    chseRegNo: 'MYCHSE-2026-00004',
    rollNo: '2026-00004',
    name: 'djjddjd',
    fatherName: 'Not specified',
    mobileNumber: '8917408498',
    email: 'g34@gmail.com',
    gmail: 'g34@gmail.com',
    age: 15,
    classYear: '+2 2nd Year',
    batchYear: '2026-27',
    stream: 'Arts',
    district: 'Mangaluru_Dakshina_Kannada',
    college: 'Puttur Jr College, Mangaluru',
    block: 'Puttur',
    state: 'Karnataka',
    address: 'Fjjfjgn46747383',
    subjects: ['English', 'MIL (Odia)', 'History', 'Political Science', 'Economics', 'Education'],
    subject_1: 'English',
    subject_2: 'MIL (Odia)',
    subject_3: 'History',
    subject_4: 'Political Science',
    subject_5: 'Economics',
    subject_6: 'Education',
    admissionDate: '2026-09-23',
    admission_status: 'Approved',
    accountStatus: 'Active',
    courseAccessApproved: true,
    enrolledPackage: 'Arts +2 2nd Year Master Pack',
    passwordHash: 'MYCHSE@2026',
    registeredDate: '2026-09-23',
    lastActive: 'Today',
    totalMockTestsTaken: 0,
    avgScorePercentage: 0,
  },
];

export const INITIAL_LESSONS: Lesson[] = [
  // Science - Physics
  {
    id: 'les-sci-01',
    stream: 'Science',
    subject: 'Physics',
    chapterNo: 1,
    chapterTitle: 'Electrostatics & Electric Charges',
    lessonTitle: 'Coulomb’s Law, Superposition Principle & Electric Field Lines',
    duration: '48 mins',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    odiaNotesUrl: 'https://chseodisha.gov.in/notes/physics-ch1-odia.pdf',
    englishNotesUrl: 'https://chseodisha.gov.in/notes/physics-ch1-eng.pdf',
    isFreePreview: true,
    addedDate: '2026-01-05',
    instructor: 'Dr. Radhakanta Mishra (HOD Physics)',
  },
  {
    id: 'les-sci-02',
    stream: 'Science',
    subject: 'Physics',
    chapterNo: 1,
    chapterTitle: 'Electrostatics & Electric Charges',
    lessonTitle: 'Gauss’s Law & Applications (Derivation of Field due to Infinite Wire)',
    duration: '54 mins',
    videoType: 'vimeo',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    odiaNotesUrl: 'https://chseodisha.gov.in/notes/gauss-law-odia.pdf',
    englishNotesUrl: 'https://chseodisha.gov.in/notes/gauss-law-eng.pdf',
    isFreePreview: false,
    addedDate: '2026-01-07',
    instructor: 'Dr. Radhakanta Mishra (HOD Physics)',
  },
  // Science - Chemistry
  {
    id: 'les-sci-03',
    stream: 'Science',
    subject: 'Chemistry',
    chapterNo: 2,
    chapterTitle: 'Solutions & Colligative Properties',
    lessonTitle: 'Raoult’s Law, Elevation in Boiling Point & Van’t Hoff Factor',
    duration: '42 mins',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    odiaNotesUrl: 'https://chseodisha.gov.in/notes/solutions-odia.pdf',
    englishNotesUrl: 'https://chseodisha.gov.in/notes/solutions-eng.pdf',
    isFreePreview: true,
    addedDate: '2026-01-12',
    instructor: 'Prof. Snigdha Priyadarshini',
  },
  // Science - Mathematics
  {
    id: 'les-sci-04',
    stream: 'Science',
    subject: 'Mathematics',
    chapterNo: 3,
    chapterTitle: 'Matrices & Determinants',
    lessonTitle: 'Properties of Determinants & Solving Equations via Cramer’s Rule',
    duration: '60 mins',
    videoType: 'stream',
    videoUrl: 'https://cdn.chseclasses.odisha.org/streams/math-ch3-matrices.mp4',
    odiaNotesUrl: 'https://chseodisha.gov.in/notes/matrices-odia.pdf',
    englishNotesUrl: 'https://chseodisha.gov.in/notes/matrices-eng.pdf',
    isFreePreview: false,
    addedDate: '2026-01-15',
    instructor: 'Er. Debi Prasad Dash',
  },
  // Science - Biology
  {
    id: 'les-sci-05',
    stream: 'Science',
    subject: 'Biology',
    chapterNo: 1,
    chapterTitle: 'Genetics & Molecular Basis of Inheritance',
    lessonTitle: 'Mendelian Genetics, Monohybrid/Dihybrid Cross & Test Cross',
    duration: '50 mins',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    odiaNotesUrl: 'https://chseodisha.gov.in/notes/bio-genetics-odia.pdf',
    englishNotesUrl: 'https://chseodisha.gov.in/notes/bio-genetics-eng.pdf',
    isFreePreview: true,
    addedDate: '2026-01-18',
    instructor: 'Dr. Tanuja Senapati',
  },
  // Arts - Political Science
  {
    id: 'les-art-01',
    stream: 'Arts',
    subject: 'Political Science',
    chapterNo: 1,
    chapterTitle: 'Indian Democracy & Federalism',
    lessonTitle: 'Preamble, Fundamental Rights vs Directive Principles & Odisha Panchayati Raj',
    duration: '45 mins',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    odiaNotesUrl: 'https://chseodisha.gov.in/notes/polsci-ch1-odia.pdf',
    englishNotesUrl: 'https://chseodisha.gov.in/notes/polsci-ch1-eng.pdf',
    isFreePreview: true,
    addedDate: '2026-01-09',
    instructor: 'Prof. Prasanna Tripathy',
  },
  // Arts - History
  {
    id: 'les-art-02',
    stream: 'Arts',
    subject: 'History',
    chapterNo: 2,
    chapterTitle: 'Freedom Struggle in Odisha & India',
    lessonTitle: 'Paika Rebellion (1817), Salt Satyagraha in Inchudi & Eram Massacre',
    duration: '52 mins',
    videoType: 'vimeo',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    odiaNotesUrl: 'https://chseodisha.gov.in/notes/history-odisha-odia.pdf',
    englishNotesUrl: 'https://chseodisha.gov.in/notes/history-odisha-eng.pdf',
    isFreePreview: false,
    addedDate: '2026-01-16',
    instructor: 'Dr. Bijay Kumar Samal',
  },
  // Commerce - Accountancy
  {
    id: 'les-com-01',
    stream: 'Commerce',
    subject: 'Accountancy',
    chapterNo: 1,
    chapterTitle: 'Accounting for Partnership Firms',
    lessonTitle: 'Profit and Loss Appropriation Account & Capital Accounts Preparation',
    duration: '58 mins',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    odiaNotesUrl: 'https://chseodisha.gov.in/notes/accountancy-ch1-odia.pdf',
    englishNotesUrl: 'https://chseodisha.gov.in/notes/accountancy-ch1-eng.pdf',
    isFreePreview: true,
    addedDate: '2026-01-11',
    instructor: 'CA Santosh Kumar Panda',
  },
  // Commerce - Business Studies
  {
    id: 'les-com-02',
    stream: 'Commerce',
    subject: 'Business Studies',
    chapterNo: 2,
    chapterTitle: 'Principles of Management',
    lessonTitle: 'Henri Fayol’s 14 Principles of Management with Case Studies',
    duration: '40 mins',
    videoType: 'stream',
    videoUrl: 'https://cdn.chseclasses.odisha.org/streams/bst-fayol.mp4',
    odiaNotesUrl: 'https://chseodisha.gov.in/notes/bst-odia.pdf',
    englishNotesUrl: 'https://chseodisha.gov.in/notes/bst-eng.pdf',
    isFreePreview: false,
    addedDate: '2026-01-22',
    instructor: 'Prof. Manorama Barik',
  },
];

export const INITIAL_MOCK_TESTS: MockTest[] = [];

export const INITIAL_RANKINGS: TestRanking[] = [];

export const INITIAL_PAYMENTS: PaymentReceipt[] = [
  {
    id: '4eed8c79-023f-448e-9d6e-540109d5a7cb',
    studentRegNo: 'MYCHSE-2026-00001',
    studentName: 'Swapnarani Patra',
    stream: 'Arts',
    amount: 99,
    paymentDate: '2026-09-19',
    utrNumber: '65656568686865',
    paymentMethod: 'BHIM UPI',
    status: 'Approved',
  },
  {
    id: 'b8201508-a047-4222-9bb0-5a4e50436a73',
    studentRegNo: 'MYCHSE-2026-00002',
    studentName: 'RITIK ROSHAN',
    stream: 'Arts',
    amount: 99,
    paymentDate: '2026-09-20',
    utrNumber: 'pay_TeDvIAi1NHn33t',
    paymentMethod: 'Razorpay Live Online',
    status: 'Approved',
  },
  {
    id: '21c6258a-70a6-474a-8b35-67b585a98708',
    studentRegNo: 'MYCHSE-2026-COMM',
    studentName: 'Admin Manual Pass',
    stream: 'Arts',
    amount: 0,
    paymentDate: '2026-09-22',
    utrNumber: 'ADMIN-UNLOCKED-1790049038186',
    paymentMethod: 'Direct Bank Transfer',
    status: 'Approved',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

