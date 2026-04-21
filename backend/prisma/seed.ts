// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (for re-running seed cleanly)
  await prisma.eligibilityRule.deleteMany();
  await prisma.scheme.deleteMany();

  // ─────────────────────────────────────────────────
  // SCHEME 1: PM Kisan Samman Nidhi
  // ─────────────────────────────────────────────────
  const pmKisan = await prisma.scheme.create({
    data: {
      name: 'PM Kisan Samman Nidhi',
      nameHi: 'प्रधानमंत्री किसान सम्मान निधि',
      slug: 'pm-kisan-samman-nidhi',
      category: 'agriculture',
      ministry: 'Ministry of Agriculture and Farmers Welfare',
      description: 'Direct income support of ₹6000 per year to small and marginal farmers, paid in 3 installments of ₹2000 each.',
      descriptionHi: 'छोटे और सीमांत किसानों को प्रति वर्ष ₹6000 की प्रत्यक्ष आय सहायता, ₹2000 की 3 किस्तों में।',
      benefitSummary: 'Direct cash transfer of ₹6000 per year',
      benefitSummaryHi: 'प्रति वर्ष ₹6000 का सीधा नकद हस्तांतरण',
      benefitAmount: '₹6,000/year',
      applicationUrl: 'https://pmkisan.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: pmKisan.id,
        field: 'occupation',
        operator: 'eq',
        value: 'farmer',
        description: 'Applicant must be a farmer',
        descriptionHi: 'आवेदक किसान होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: pmKisan.id,
        field: 'annualIncome',
        operator: 'lte',
        value: 200000,
        description: 'Annual household income must be ₹2,00,000 or less',
        descriptionHi: 'वार्षिक घरेलू आय ₹2,00,000 या उससे कम होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: pmKisan.id,
        field: 'hasBankAccount',
        operator: 'is_true',
        value: true,
        description: 'Must have a bank account for direct transfer',
        descriptionHi: 'प्रत्यक्ष हस्तांतरण के लिए बैंक खाता होना चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 2: PM Ujjwala Yojana
  // ─────────────────────────────────────────────────
  const ujjwala = await prisma.scheme.create({
    data: {
      name: 'PM Ujjwala Yojana',
      nameHi: 'प्रधानमंत्री उज्ज्वला योजना',
      slug: 'pm-ujjwala-yojana',
      category: 'women_welfare',
      ministry: 'Ministry of Petroleum and Natural Gas',
      description: 'Free LPG connection to women from BPL households. Aims to replace unclean cooking fuels with clean LPG.',
      descriptionHi: 'BPL परिवारों की महिलाओं को मुफ्त LPG कनेक्शन।',
      benefitSummary: 'Free LPG gas connection',
      benefitSummaryHi: 'मुफ्त LPG गैस कनेक्शन',
      benefitAmount: 'Free connection + subsidy',
      applicationUrl: 'https://www.pmuy.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: ujjwala.id,
        field: 'gender',
        operator: 'eq',
        value: 'female',
        description: 'Applicant must be a woman',
        descriptionHi: 'आवेदक महिला होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: ujjwala.id,
        field: 'age',
        operator: 'gte',
        value: 18,
        description: 'Applicant must be at least 18 years old',
        descriptionHi: 'आवेदक की आयु कम से कम 18 वर्ष होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: ujjwala.id,
        field: 'isBplHousehold',
        operator: 'is_true',
        value: true,
        description: 'Must belong to a BPL (Below Poverty Line) household',
        descriptionHi: 'BPL परिवार से होना चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 3: National Scholarship for SC Students
  // ─────────────────────────────────────────────────
  const scScholarship = await prisma.scheme.create({
    data: {
      name: 'Post Matric Scholarship for SC Students',
      nameHi: 'अनुसूचित जाति छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति',
      slug: 'post-matric-scholarship-sc',
      category: 'education',
      ministry: 'Ministry of Social Justice and Empowerment',
      description: 'Financial assistance for SC students studying at post-matriculation or post-secondary stage. Covers tuition fees, maintenance allowance.',
      descriptionHi: 'पोस्ट मैट्रिकुलेशन स्तर पर पढ़ रहे SC छात्रों के लिए वित्तीय सहायता।',
      benefitSummary: 'Scholarship covering tuition fees + maintenance allowance',
      benefitSummaryHi: 'ट्यूशन फीस + रखरखाव भत्ता',
      benefitAmount: 'Up to ₹1,200/month + tuition fees',
      applicationUrl: 'https://scholarships.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: scScholarship.id,
        field: 'caste',
        operator: 'eq',
        value: 'SC',
        description: 'Must belong to Scheduled Caste (SC) category',
        descriptionHi: 'अनुसूचित जाति (SC) से होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: scScholarship.id,
        field: 'isCurrentlyStudying',
        operator: 'is_true',
        value: true,
        description: 'Must currently be enrolled in a post-matriculation course',
        descriptionHi: 'वर्तमान में पोस्ट मैट्रिकुलेशन पाठ्यक्रम में नामांकित होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: scScholarship.id,
        field: 'annualIncome',
        operator: 'lte',
        value: 250000,
        description: 'Annual family income must not exceed ₹2,50,000',
        descriptionHi: 'वार्षिक पारिवारिक आय ₹2,50,000 से अधिक नहीं होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: scScholarship.id,
        field: 'age',
        operator: 'lte',
        value: 30,
        description: 'Applicant must be 30 years or younger',
        descriptionHi: 'आवेदक की आयु 30 वर्ष या उससे कम होनी चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 4: PM Awas Yojana (Gramin)
  // ─────────────────────────────────────────────────
  const pmay = await prisma.scheme.create({
    data: {
      name: 'PM Awas Yojana Gramin',
      nameHi: 'प्रधानमंत्री आवास योजना ग्रामीण',
      slug: 'pm-awas-yojana-gramin',
      category: 'housing',
      ministry: 'Ministry of Rural Development',
      description: 'Financial assistance to BPL rural households to construct a pucca house. ₹1.2 lakh in plain areas, ₹1.3 lakh in hilly areas.',
      descriptionHi: 'ग्रामीण BPL परिवारों को पक्का मकान बनाने के लिए वित्तीय सहायता।',
      benefitSummary: 'Grant of ₹1.2–1.3 lakh for house construction',
      benefitSummaryHi: 'मकान निर्माण के लिए ₹1.2–1.3 लाख अनुदान',
      benefitAmount: '₹1,20,000 – ₹1,30,000',
      applicationUrl: 'https://pmayg.nic.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: pmay.id,
        field: 'isBplHousehold',
        operator: 'is_true',
        value: true,
        description: 'Must be a BPL household',
        descriptionHi: 'BPL परिवार होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: pmay.id,
        field: 'annualIncome',
        operator: 'lte',
        value: 180000,
        description: 'Annual income must be ₹1,80,000 or less',
        descriptionHi: 'वार्षिक आय ₹1,80,000 या उससे कम होनी चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 5: Pradhan Mantri Matru Vandana Yojana
  // ─────────────────────────────────────────────────
  const pmmvy = await prisma.scheme.create({
    data: {
      name: 'Pradhan Mantri Matru Vandana Yojana',
      nameHi: 'प्रधानमंत्री मातृ वंदना योजना',
      slug: 'pradhan-mantri-matru-vandana-yojana',
      category: 'women_welfare',
      ministry: 'Ministry of Women and Child Development',
      description: 'Maternity benefit program providing ₹5000 to pregnant and lactating mothers for their first child. Supports nutrition and health.',
      descriptionHi: 'पहले बच्चे के लिए गर्भवती और स्तनपान कराने वाली माताओं को ₹5000 की सहायता।',
      benefitSummary: '₹5000 cash benefit for first child pregnancy',
      benefitSummaryHi: 'पहले बच्चे की गर्भावस्था के लिए ₹5000 नकद लाभ',
      benefitAmount: '₹5,000 (in 3 installments)',
      applicationUrl: 'https://pmmvy.wcd.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: pmmvy.id,
        field: 'gender',
        operator: 'eq',
        value: 'female',
        description: 'Applicant must be a woman',
        descriptionHi: 'आवेदक महिला होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: pmmvy.id,
        field: 'age',
        operator: 'between',
        value: { min: 19, max: 45 },
        description: 'Age must be between 19 and 45 years',
        descriptionHi: 'आयु 19 से 45 वर्ष के बीच होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: pmmvy.id,
        field: 'annualIncome',
        operator: 'lte',
        value: 800000,
        description: 'Annual household income must be ₹8,00,000 or less',
        descriptionHi: 'वार्षिक घरेलू आय ₹8,00,000 या उससे कम होनी चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 6: Atal Pension Yojana
  // ─────────────────────────────────────────────────
  const apy = await prisma.scheme.create({
    data: {
      name: 'Atal Pension Yojana',
      nameHi: 'अटल पेंशन योजना',
      slug: 'atal-pension-yojana',
      category: 'social_security',
      ministry: 'Ministry of Finance',
      description: 'Pension scheme for unorganized sector workers. Guaranteed monthly pension of ₹1000–₹5000 after age 60, based on contribution.',
      descriptionHi: 'असंगठित क्षेत्र के कामगारों के लिए पेंशन योजना। 60 वर्ष के बाद ₹1000-₹5000 मासिक पेंशन।',
      benefitSummary: 'Monthly pension of ₹1000–₹5000 after age 60',
      benefitSummaryHi: '60 वर्ष के बाद ₹1000–₹5000 मासिक पेंशन',
      benefitAmount: '₹1,000–₹5,000/month (post 60)',
      applicationUrl: 'https://npscra.nsdl.co.in/scheme-details.php',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: apy.id,
        field: 'age',
        operator: 'between',
        value: { min: 18, max: 40 },
        description: 'Age must be between 18 and 40 years to join',
        descriptionHi: 'आयु 18 से 40 वर्ष के बीच होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: apy.id,
        field: 'hasBankAccount',
        operator: 'is_true',
        value: true,
        description: 'Must have a savings bank account',
        descriptionHi: 'बचत बैंक खाता होना चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 7: PM MUDRA Yojana (Shishu)
  // ─────────────────────────────────────────────────
  const mudra = await prisma.scheme.create({
    data: {
      name: 'PM MUDRA Yojana (Shishu)',
      nameHi: 'प्रधानमंत्री मुद्रा योजना (शिशु)',
      slug: 'pm-mudra-yojana-shishu',
      category: 'business',
      ministry: 'Ministry of Finance',
      description: 'Collateral-free loans up to ₹50,000 for micro/small businesses and self-employed individuals to start or expand businesses.',
      descriptionHi: 'सूक्ष्म/लघु व्यवसायों के लिए ₹50,000 तक का बिना जमानत ऋण।',
      benefitSummary: 'Loan up to ₹50,000 without collateral',
      benefitSummaryHi: 'बिना जमानत ₹50,000 तक का ऋण',
      benefitAmount: 'Loan up to ₹50,000',
      applicationUrl: 'https://www.mudra.org.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: mudra.id,
        field: 'occupation',
        operator: 'in',
        value: ['self_employed', 'other'],
        description: 'Must be self-employed or running a small business',
        descriptionHi: 'स्व-रोजगार या छोटे व्यवसाय में होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: mudra.id,
        field: 'age',
        operator: 'gte',
        value: 18,
        description: 'Must be at least 18 years old',
        descriptionHi: 'कम से कम 18 वर्ष की आयु होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: mudra.id,
        field: 'hasBankAccount',
        operator: 'is_true',
        value: true,
        description: 'Must have a bank account',
        descriptionHi: 'बैंक खाता होना चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 8: Skill India — PMKVY
  // ─────────────────────────────────────────────────
  const pmkvy = await prisma.scheme.create({
    data: {
      name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
      nameHi: 'प्रधानमंत्री कौशल विकास योजना',
      slug: 'pmkvy',
      category: 'skill_employment',
      ministry: 'Ministry of Skill Development and Entrepreneurship',
      description: 'Free skill training in industry-relevant trades. Certification on completion with placement assistance.',
      descriptionHi: 'उद्योग-संबंधित व्यापारों में मुफ्त कौशल प्रशिक्षण। प्रमाणपत्र और नौकरी सहायता।',
      benefitSummary: 'Free skill training + certificate + placement support',
      benefitSummaryHi: 'मुफ्त कौशल प्रशिक्षण + प्रमाणपत्र + नियुक्ति सहायता',
      benefitAmount: 'Free training + ₹8,000 reward on certification',
      applicationUrl: 'https://www.pmkvyofficial.org',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: pmkvy.id,
        field: 'age',
        operator: 'between',
        value: { min: 15, max: 45 },
        description: 'Age must be between 15 and 45 years',
        descriptionHi: 'आयु 15 से 45 वर्ष के बीच होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: pmkvy.id,
        field: 'occupation',
        operator: 'in',
        value: ['unemployed', 'student', 'worker'],
        description: 'Should be unemployed, a student, or an unskilled worker',
        descriptionHi: 'बेरोजगार, छात्र, या अकुशल कामगार होना चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 9: National Food Security Act (Ration Card)
  // ─────────────────────────────────────────────────
  const nfsa = await prisma.scheme.create({
    data: {
      name: 'National Food Security Act — Subsidized Ration',
      nameHi: 'राष्ट्रीय खाद्य सुरक्षा अधिनियम — सब्सिडी राशन',
      slug: 'nfsa-subsidized-ration',
      category: 'food_security',
      ministry: 'Ministry of Consumer Affairs, Food and Public Distribution',
      description: 'Heavily subsidized food grains (rice at ₹3/kg, wheat at ₹2/kg) for BPL families under the Public Distribution System.',
      descriptionHi: 'BPL परिवारों के लिए सब्सिडी वाले खाद्यान्न (चावल ₹3/किग्रा, गेहूं ₹2/किग्रा)।',
      benefitSummary: '5 kg subsidized grain per person per month',
      benefitSummaryHi: 'प्रति व्यक्ति प्रति माह 5 किग्रा सब्सिडी वाला अनाज',
      benefitAmount: 'Rice at ₹3/kg, Wheat at ₹2/kg',
      applicationUrl: 'https://nfsa.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: nfsa.id,
        field: 'isBplHousehold',
        operator: 'is_true',
        value: true,
        description: 'Must be a BPL or AAY household',
        descriptionHi: 'BPL या AAY परिवार होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: nfsa.id,
        field: 'annualIncome',
        operator: 'lte',
        value: 120000,
        description: 'Annual income must be ₹1,20,000 or less',
        descriptionHi: 'वार्षिक आय ₹1,20,000 या उससे कम होनी चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 10: Fasal Bima Yojana (Crop Insurance)
  // ─────────────────────────────────────────────────
  const fasalBima = await prisma.scheme.create({
    data: {
      name: 'Pradhan Mantri Fasal Bima Yojana',
      nameHi: 'प्रधानमंत्री फसल बीमा योजना',
      slug: 'pm-fasal-bima-yojana',
      category: 'agriculture',
      ministry: 'Ministry of Agriculture and Farmers Welfare',
      description: 'Crop insurance scheme for farmers. Premium is just 2% for Kharif crops, 1.5% for Rabi crops. Protects against crop loss due to natural calamities.',
      descriptionHi: 'किसानों के लिए फसल बीमा। खरीफ फसलों के लिए 2% और रबी फसलों के लिए 1.5% प्रीमियम।',
      benefitSummary: 'Crop loss compensation at very low premium rates',
      benefitSummaryHi: 'बहुत कम प्रीमियम पर फसल नुकसान मुआवजा',
      benefitAmount: 'Full insured sum on crop loss',
      applicationUrl: 'https://pmfby.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: fasalBima.id,
        field: 'occupation',
        operator: 'eq',
        value: 'farmer',
        description: 'Applicant must be a farmer',
        descriptionHi: 'आवेदक किसान होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: fasalBima.id,
        field: 'hasBankAccount',
        operator: 'is_true',
        value: true,
        description: 'Must have a bank account for claim settlement',
        descriptionHi: 'दावा निपटान के लिए बैंक खाता होना चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 11: Ayushman Bharat — PMJAY
  // ─────────────────────────────────────────────────
  const pmjay = await prisma.scheme.create({
    data: {
      name: 'Ayushman Bharat — PM Jan Arogya Yojana',
      nameHi: 'आयुष्मान भारत — प्रधानमंत्री जन आरोग्य योजना',
      slug: 'ayushman-bharat-pmjay',
      category: 'health',
      ministry: 'Ministry of Health and Family Welfare',
      description: 'World\'s largest health insurance scheme. Provides ₹5 lakh health cover per family per year for secondary and tertiary care. Free at empanelled hospitals.',
      descriptionHi: 'प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य बीमा कवर।',
      benefitSummary: '₹5 lakh health insurance per family per year',
      benefitSummaryHi: 'प्रति परिवार प्रति वर्ष ₹5 लाख स्वास्थ्य बीमा',
      benefitAmount: '₹5,00,000/year health cover',
      applicationUrl: 'https://pmjay.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: pmjay.id,
        field: 'isBplHousehold',
        operator: 'is_true',
        value: true,
        description: 'Must be a BPL household or SECC-listed family',
        descriptionHi: 'BPL परिवार या SECC सूची में होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: pmjay.id,
        field: 'annualIncome',
        operator: 'lte',
        value: 180000,
        description: 'Annual income must be ₹1,80,000 or less',
        descriptionHi: 'वार्षिक आय ₹1,80,000 या उससे कम होनी चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 12: OBC Pre-Matric Scholarship
  // ─────────────────────────────────────────────────
  const obcScholarship = await prisma.scheme.create({
    data: {
      name: 'Pre-Matric Scholarship for OBC Students',
      nameHi: 'OBC छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति',
      slug: 'pre-matric-scholarship-obc',
      category: 'education',
      ministry: 'Ministry of Social Justice and Empowerment',
      description: 'Scholarship for OBC students studying in class 1 to 10. Covers day scholar and hostel students.',
      descriptionHi: 'कक्षा 1 से 10 में पढ़ने वाले OBC छात्रों के लिए छात्रवृत्ति।',
      benefitSummary: 'Monthly scholarship + book grant for OBC students',
      benefitSummaryHi: 'OBC छात्रों के लिए मासिक छात्रवृत्ति + पुस्तक अनुदान',
      benefitAmount: '₹100–₹300/month + book grant',
      applicationUrl: 'https://scholarships.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: obcScholarship.id,
        field: 'caste',
        operator: 'eq',
        value: 'OBC',
        description: 'Must belong to Other Backward Classes (OBC)',
        descriptionHi: 'अन्य पिछड़ा वर्ग (OBC) से होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: obcScholarship.id,
        field: 'isCurrentlyStudying',
        operator: 'is_true',
        value: true,
        description: 'Must currently be enrolled in school or college',
        descriptionHi: 'वर्तमान में स्कूल या कॉलेज में नामांकित होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: obcScholarship.id,
        field: 'age',
        operator: 'lte',
        value: 20,
        description: 'Must be 20 years or younger',
        descriptionHi: 'आयु 20 वर्ष या उससे कम होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: obcScholarship.id,
        field: 'annualIncome',
        operator: 'lte',
        value: 100000,
        description: 'Annual parental income must not exceed ₹1,00,000',
        descriptionHi: 'माता-पिता की वार्षिक आय ₹1,00,000 से अधिक नहीं होनी चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 13: MGNREGA (Job Guarantee)
  // ─────────────────────────────────────────────────
  const mgnrega = await prisma.scheme.create({
    data: {
      name: 'MGNREGA — Mahatma Gandhi National Rural Employment Guarantee',
      nameHi: 'मनरेगा — महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी',
      slug: 'mgnrega',
      category: 'employment',
      ministry: 'Ministry of Rural Development',
      description: 'Guarantees 100 days of wage employment per year to rural households willing to do unskilled manual work.',
      descriptionHi: 'ग्रामीण परिवारों को प्रति वर्ष 100 दिन का वेतन रोजगार की गारंटी।',
      benefitSummary: '100 days guaranteed employment per year',
      benefitSummaryHi: 'प्रति वर्ष 100 दिन का गारंटीड रोजगार',
      benefitAmount: '100 days work @ state minimum wage',
      applicationUrl: 'https://nrega.nic.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: mgnrega.id,
        field: 'age',
        operator: 'gte',
        value: 18,
        description: 'Must be at least 18 years old',
        descriptionHi: 'कम से कम 18 वर्ष की आयु होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: mgnrega.id,
        field: 'occupation',
        operator: 'in',
        value: ['worker', 'unemployed', 'farmer', 'other'],
        description: 'Must be a rural household adult willing to do unskilled work',
        descriptionHi: 'ग्रामीण परिवार का वयस्क सदस्य जो अकुशल कार्य करने को तैयार हो',
        isRequired: true,
      },
      {
        schemeId: mgnrega.id,
        field: 'hasRationCard',
        operator: 'is_true',
        value: true,
        description: 'Must have a ration card (job card is issued based on household)',
        descriptionHi: 'राशन कार्ड होना चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 14: Scholarship for ST Students (Central)
  // ─────────────────────────────────────────────────
  const stScholarship = await prisma.scheme.create({
    data: {
      name: 'Post Matric Scholarship for ST Students',
      nameHi: 'अनुसूचित जनजाति छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति',
      slug: 'post-matric-scholarship-st',
      category: 'education',
      ministry: 'Ministry of Tribal Affairs',
      description: 'Financial assistance to ST students for post-matriculation studies. Covers full tuition fees and provides maintenance allowance.',
      descriptionHi: 'पोस्ट मैट्रिकुलेशन पढ़ाई के लिए ST छात्रों को वित्तीय सहायता।',
      benefitSummary: 'Full tuition fees + maintenance allowance for ST students',
      benefitSummaryHi: 'ST छात्रों के लिए पूरी ट्यूशन फीस + रखरखाव भत्ता',
      benefitAmount: 'Full fees + up to ₹1,200/month',
      applicationUrl: 'https://scholarships.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: stScholarship.id,
        field: 'caste',
        operator: 'eq',
        value: 'ST',
        description: 'Must belong to Scheduled Tribe (ST) category',
        descriptionHi: 'अनुसूचित जनजाति (ST) से होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: stScholarship.id,
        field: 'isCurrentlyStudying',
        operator: 'is_true',
        value: true,
        description: 'Must currently be enrolled in a post-matriculation course',
        descriptionHi: 'वर्तमान में पोस्ट मैट्रिकुलेशन पाठ्यक्रम में नामांकित होना चाहिए',
        isRequired: true,
      },
      {
        schemeId: stScholarship.id,
        field: 'annualIncome',
        operator: 'lte',
        value: 250000,
        description: 'Annual family income must not exceed ₹2,50,000',
        descriptionHi: 'वार्षिक पारिवारिक आय ₹2,50,000 से अधिक नहीं होनी चाहिए',
        isRequired: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────
  // SCHEME 15: PM Jeevan Jyoti Bima Yojana
  // ─────────────────────────────────────────────────
  const pmjjby = await prisma.scheme.create({
    data: {
      name: 'PM Jeevan Jyoti Bima Yojana',
      nameHi: 'प्रधानमंत्री जीवन ज्योति बीमा योजना',
      slug: 'pm-jeevan-jyoti-bima-yojana',
      category: 'social_security',
      ministry: 'Ministry of Finance',
      description: 'Term life insurance scheme with ₹2 lakh death cover at just ₹436/year premium. Open to all bank account holders.',
      descriptionHi: 'मात्र ₹436/वर्ष प्रीमियम पर ₹2 लाख का जीवन बीमा।',
      benefitSummary: '₹2 lakh life insurance at ₹436/year',
      benefitSummaryHi: '₹436/वर्ष में ₹2 लाख का जीवन बीमा',
      benefitAmount: '₹2,00,000 on death',
      applicationUrl: 'https://jansuraksha.gov.in',
      isCentral: true,
      lastVerified: new Date('2024-12-01'),
    },
  });

  await prisma.eligibilityRule.createMany({
    data: [
      {
        schemeId: pmjjby.id,
        field: 'age',
        operator: 'between',
        value: { min: 18, max: 50 },
        description: 'Age must be between 18 and 50 years',
        descriptionHi: 'आयु 18 से 50 वर्ष के बीच होनी चाहिए',
        isRequired: true,
      },
      {
        schemeId: pmjjby.id,
        field: 'hasBankAccount',
        operator: 'is_true',
        value: true,
        description: 'Must have a bank account (for auto-debit of premium)',
        descriptionHi: 'बैंक खाता होना चाहिए (प्रीमियम के ऑटो-डेबिट के लिए)',
        isRequired: true,
      },
    ],
  });

  console.log('✅ Seeded 15 schemes with eligibility rules');
  console.log(`   Total schemes: 15`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });