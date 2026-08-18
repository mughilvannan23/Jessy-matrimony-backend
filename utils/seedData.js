const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Membership = require('../models/Membership');
const SuccessStory = require('../models/SuccessStory');
const Interest = require('../models/Interest');

const sampleProfiles = [
  // BRIDES
  {
    name: 'Janani Soundar',
    email: 'janani.chennai@gmail.com',
    password: 'password123',
    gender: 'Bride',
    age: 25,
    height: "5'4\" (162 cm)",
    weight: '54 kg',
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Vanniyar',
    subCaste: 'Padayatchi',
    motherTongue: 'Tamil',
    district: 'Chennai',
    city: 'Anna Nagar, Chennai',
    education: 'B.E Computer Science (CEG Guindy)',
    occupation: 'Senior Software Engineer at TCS',
    income: '₹12 - ₹15 Lakhs PA',
    familyType: 'Nuclear Family',
    fatherOccupation: 'Government Servant (Retired)',
    motherOccupation: 'Homemaker',
    siblings: '1 Younger Brother (Studying)',
    horoscope: { raasi: 'Simmam (Leo)', nakshatra: 'Magam', dosham: 'No Dosham', birthTime: '06:15 AM', birthPlace: 'Chennai' },
    aboutMe: 'Warm, cultured Tamil girl living in Chennai. Enjoy classical music, carnatic singing, and software development.',
    expectations: 'Looking for an educated, well-settled Tamil groom from Chennai or nearby districts.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
    ],
    profileVerified: true,
    premiumMember: true,
    membershipPlan: 'Premium',
    mobile: '+91 98401 23456'
  },
  {
    name: 'Priyanka Gounder',
    email: 'priyanka.kovai@gmail.com',
    password: 'password123',
    gender: 'Bride',
    age: 26,
    height: "5'5\" (165 cm)",
    weight: '56 kg',
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Gounder',
    subCaste: 'Kongu Vellalar',
    motherTongue: 'Tamil',
    district: 'Coimbatore',
    city: 'RS Puram, Coimbatore',
    education: 'M.Sc Food Technology (PSG Tech)',
    occupation: 'Quality Assurance Lead',
    income: '₹8 - ₹10 Lakhs PA',
    familyType: 'Joint Family',
    fatherOccupation: 'Textile Business Owner',
    motherOccupation: 'Homemaker',
    siblings: '1 Elder Sister (Married)',
    horoscope: { raasi: 'Kanni (Virgo)', nakshatra: 'Uthiram', dosham: 'Sevvai Dosham Light', birthTime: '10:45 AM', birthPlace: 'Coimbatore' },
    aboutMe: 'Friendly and family-oriented girl from Kongu region. Deep respect for Tamil values and family traditions.',
    expectations: 'Looking for a decent Kongu Gounder groom from Coimbatore, Erode or Tiruppur.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    ],
    profileVerified: true,
    premiumMember: false,
    membershipPlan: 'Classic',
    mobile: '+91 94432 98765'
  },
  {
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.madurai@gmail.com',
    password: 'password123',
    gender: 'Bride',
    age: 24,
    height: "5'3\" (160 cm)",
    weight: '50 kg',
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Thevar',
    subCaste: 'Kallar',
    motherTongue: 'Tamil',
    district: 'Madurai',
    city: 'KK Nagar, Madurai',
    education: 'MBBS (Madurai Medical College)',
    occupation: 'Doctor / Resident',
    income: '₹10 - ₹12 Lakhs PA',
    familyType: 'Nuclear Family',
    fatherOccupation: 'Advocate',
    motherOccupation: 'High School Teacher',
    siblings: 'Single Child',
    horoscope: { raasi: 'Rishabam (Taurus)', nakshatra: 'Rohini', dosham: 'No Dosham', birthTime: '04:20 PM', birthPlace: 'Madurai' },
    aboutMe: 'Doctor by profession with a passion for healthcare and Tamil literature.',
    expectations: 'Looking for a Doctor or Engineer groom from Madurai or South TN.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    ],
    profileVerified: true,
    premiumMember: true,
    membershipPlan: 'Premium',
    mobile: '+91 97890 54321'
  },
  {
    name: 'Kavitha Pillai',
    email: 'kavitha.trichy@gmail.com',
    password: 'password123',
    gender: 'Bride',
    age: 27,
    height: "5'6\" (167 cm)",
    weight: '58 kg',
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Pillai',
    subCaste: 'Saiva Pillai',
    motherTongue: 'Tamil',
    district: 'Tiruchirappalli (Trichy)',
    city: 'Thillai Nagar, Trichy',
    education: 'M.Com, ACA (Chartered Accountant)',
    occupation: 'Senior Financial Analyst',
    income: '₹15 - ₹18 Lakhs PA',
    familyType: 'Nuclear Family',
    fatherOccupation: 'Bank Manager (Retired)',
    motherOccupation: 'Homemaker',
    siblings: '1 Brother (Software Engineer)',
    horoscope: { raasi: 'Thulam (Libra)', nakshatra: 'Swathi', dosham: 'No Dosham', birthTime: '07:10 AM', birthPlace: 'Trichy' },
    aboutMe: 'CA working in MNC. Balanced, traditional yet independent thinking.',
    expectations: 'Looking for a professional groom settled in Trichy, Chennai or Bangalore.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
    ],
    profileVerified: true,
    premiumMember: false,
    membershipPlan: 'Free',
    mobile: '+91 98424 11223'
  },

  // GROOMS
  {
    name: 'Karthik Raja V.',
    email: 'karthik.trichy@gmail.com',
    password: 'password123',
    gender: 'Groom',
    age: 28,
    height: "5'11\" (180 cm)",
    weight: '75 kg',
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Vanniyar',
    subCaste: 'Gounder',
    motherTongue: 'Tamil',
    district: 'Tiruchirappalli (Trichy)',
    city: 'Cantonment, Trichy',
    education: 'M.Tech AI (NIT Trichy)',
    occupation: 'Tech Lead / AI Architect',
    income: '₹22 - ₹25 Lakhs PA',
    familyType: 'Nuclear Family',
    fatherOccupation: 'Civil Contractor',
    motherOccupation: 'School Principal',
    siblings: '1 Sister (Physiotherapist)',
    horoscope: { raasi: 'Dhanusu (Sagittarius)', nakshatra: 'Moolam', dosham: 'No Dosham', birthTime: '09:00 AM', birthPlace: 'Trichy' },
    aboutMe: 'Tech Lead at an AI startup. Outdoor enthusiast, loves badminton and long drives in Tamil Nadu.',
    expectations: 'Looking for an educated Tamil bride with good family background.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
    ],
    profileVerified: true,
    premiumMember: true,
    membershipPlan: 'Premium',
    mobile: '+91 99940 88776'
  },
  {
    name: 'Senthil Kumar',
    email: 'senthil.salem@gmail.com',
    password: 'password123',
    gender: 'Groom',
    age: 29,
    height: "5'9\" (175 cm)",
    weight: '70 kg',
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Gounder',
    subCaste: 'Vellalar',
    motherTongue: 'Tamil',
    district: 'Salem',
    city: 'Fairlands, Salem',
    education: 'B.E Mechanical Engineering',
    occupation: 'Manufacturing Manager',
    income: '₹14 - ₹16 Lakhs PA',
    familyType: 'Joint Family',
    fatherOccupation: 'Agriculturalist & Business',
    motherOccupation: 'Homemaker',
    siblings: '2 Brothers (In Business)',
    horoscope: { raasi: 'Magaram (Capricorn)', nakshatra: 'Thiruvonam', dosham: 'No Dosham', birthTime: '02:15 PM', birthPlace: 'Salem' },
    aboutMe: 'Working in auto-component manufacturing near Salem. Family values and fitness oriented.',
    expectations: 'Looking for a bride from Salem, Namakkal, Erode or Kovai.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
    ],
    profileVerified: true,
    premiumMember: false,
    membershipPlan: 'Classic',
    mobile: '+91 94421 77665'
  },
  {
    name: 'Vigneshwaran Nadar',
    email: 'vignesh.nellai@gmail.com',
    password: 'password123',
    gender: 'Groom',
    age: 27,
    height: "5'10\" (178 cm)",
    weight: '72 kg',
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Nadar',
    subCaste: 'Karikku Mara Nadar',
    motherTongue: 'Tamil',
    district: 'Tirunelveli',
    city: 'Palayamkottai, Tirunelveli',
    education: 'MBA Marketing (IIM Trichy)',
    occupation: 'Brand Manager',
    income: '₹18 - ₹20 Lakhs PA',
    familyType: 'Nuclear Family',
    fatherOccupation: 'Retail Merchant',
    motherOccupation: 'Professor',
    siblings: '1 Sister',
    horoscope: { raasi: 'Kumbam (Aquarius)', nakshatra: 'Sadayam', dosham: 'No Dosham', birthTime: '11:20 AM', birthPlace: 'Tirunelveli' },
    aboutMe: 'Passionate about brand strategy and Tamil cinema. Rooted in Tirunelveli values.',
    expectations: 'Educated Tamil bride from South TN districts.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80'
    ],
    profileVerified: true,
    premiumMember: true,
    membershipPlan: 'Premium',
    mobile: '+91 98942 33445'
  },
  {
    name: 'Aravind Swamy',
    email: 'aravind.vellore@gmail.com',
    password: 'password123',
    gender: 'Groom',
    age: 30,
    height: "6'0\" (183 cm)",
    weight: '78 kg',
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Mudaliar',
    subCaste: 'Arcot Mudaliar',
    motherTongue: 'Tamil',
    district: 'Vellore',
    city: 'Sathuvachari, Vellore',
    education: 'MS Biomedical (VIT Vellore)',
    occupation: 'Medical Device Specialist',
    income: '₹20 - ₹24 Lakhs PA',
    familyType: 'Nuclear Family',
    fatherOccupation: 'Doctor (Retd CMC Vellore)',
    motherOccupation: 'Doctor',
    siblings: '1 Sister (US settled)',
    horoscope: { raasi: 'Meenam (Pisces)', nakshatra: 'Revathi', dosham: 'No Dosham', birthTime: '05:40 AM', birthPlace: 'Vellore' },
    aboutMe: 'Biomedical specialist working at CMC area. Calm, caring and passionate about healthcare.',
    expectations: 'Graduate bride from Vellore, Ranipet or Chennai.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    photos: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80'
    ],
    profileVerified: false,
    premiumMember: false,
    membershipPlan: 'Free',
    mobile: '+91 97910 66778'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jessy_matrimony');
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Membership.deleteMany({});
    await SuccessStory.deleteMany({});
    await Interest.deleteMany({});

    console.log('[Seed] Existing collections cleared.');

    // 1. Create Admin
    const admin = await User.create({
      name: 'Jessy Matrimony Admin',
      email: 'admin@jessymatrimony.com',
      password: 'admin123',
      role: 'admin',
      mobile: '+91 98400 00000',
      gender: 'Groom',
      age: 35,
      district: 'Chennai',
      status: 'active',
      membership: 'premium',
      profileVerified: true,
      premiumMember: true,
      membershipPlan: 'Premium'
    });
    console.log('[Seed] Admin user created (admin@jessymatrimony.com / admin123)');

    // 2. Insert User Profiles
    const formattedProfiles = sampleProfiles.map(p => ({
      ...p,
      status: 'active',
      membership: p.premiumMember ? 'premium' : 'free',
      role: 'user'
    }));
    const createdUsers = await User.insertMany(formattedProfiles);
    console.log(`[Seed] Successfully inserted ${createdUsers.length} bride & groom profiles.`);

    // 3. Create Default Memberships
    await Membership.insertMany([
      {
        name: 'Free',
        duration: 'Unlimited',
        price: 0,
        isPopular: false,
        description: 'Basic access to start searching for your match in Tamil Nadu.',
        features: [
          'Create Complete Profile',
          'Browse Profiles in 38 Districts',
          'Send up to 5 Express Interests',
          'Basic Search Filters'
        ]
      },
      {
        name: 'Classic',
        duration: '3 Months',
        price: 2499,
        discountPrice: 1999,
        isPopular: true,
        description: 'Popular choice for active bride & groom searchers.',
        features: [
          'Unlimited Profile Search & Filters',
          'View Verified Contact Numbers & Email',
          'Send Unlimited Express Interests',
          'Direct Horoscope Compatibility View',
          'WhatsApp Instant Match Alerts'
        ]
      },
      {
        name: 'Premium',
        duration: '6 Months',
        price: 4999,
        discountPrice: 3999,
        isPopular: false,
        description: 'VIP matchmaking experience with profile boost & dedicated manager.',
        features: [
          'Priority Listing & Profile Boost',
          'Dedicated Relationship Manager',
          'Unlimited Contact & Address Access',
          'Verified Badge & Trust Shield',
          'Horoscope Matching Certificate',
          'Direct WhatsApp Assistance'
        ]
      }
    ]);
    console.log('[Seed] Membership plans created.');

    // 4. Create Success Stories
    await SuccessStory.insertMany([
      {
        brideName: 'Kavitha S.',
        groomName: 'Karthik Raja',
        district: 'Trichy',
        story: 'We met through Jessy Matrimony in Trichy. Our families connected instantly due to transparent horoscope and background details. We got happily married in January 2026!',
        photos: ['https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'],
        weddingDate: 'Jan 2026'
      },
      {
        brideName: 'Divya M.',
        groomName: 'Senthil Kumar',
        district: 'Coimbatore',
        story: 'Finding a Kongu Vellalar groom in Kovai was so smooth on Jessy Matrimony. Filter by district helped us narrow down verified profiles within days.',
        photos: ['https://images.unsplash.com/photo-1609151162377-794faf68b02f?auto=format&fit=crop&w=600&q=80'],
        weddingDate: 'Feb 2026'
      },
      {
        brideName: 'Priya Dharshini',
        groomName: 'Vigneshwaran R.',
        district: 'Madurai',
        story: 'Special thanks to Jessy Matrimony premium membership service. Our relationship manager assisted us throughout the matchmaking process.',
        photos: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'],
        weddingDate: 'Mar 2026'
      }
    ]);
    console.log('[Seed] Success stories inserted.');

    console.log('[Seed] Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDB();
