const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApplicantProfile = require('../models/ApplicantProfile');
const OrganizationProfile = require('../models/OrganizationProfile');
const Skill = require('../models/Skill');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const JourneyRecord = require('../models/JourneyRecord');

async function seedDatabase() {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('[Seed] Database already contains records. Skipping seed.');
    return;
  }

  console.log('[Seed] Populating initial demo data for DevCore platform...');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 1. Create Demo Applicant
  const applicantUser = new User({
    fullName: 'Alex Morgan',
    email: 'applicant@devcore.com',
    password: passwordHash,
    role: 'applicant'
  });
  await applicantUser.save();

  const applicantProfile = new ApplicantProfile({
    user: applicantUser._id,
    bio: 'Passionate computer science undergrad specializing in full-stack web development, REST API design, and AI model integration.',
    phone: '+91 98765 43210',
    educationHistory: [
      {
        college: 'Indian Institute of Technology (IIT) Bombay',
        course: 'B.Tech in Computer Science & Engineering',
        graduationYear: '2026',
        grade: '8.8 CGPA',
        description: 'Core coursework in Algorithms, Database Systems, Web Engineering, and Machine Learning.'
      }
    ],
    links: {
      linkedin: 'https://linkedin.com/in/alex-morgan-dev',
      github: 'https://github.com/alexmorgan-dev',
      portfolio: 'https://alexmorgan.dev',
      resume: 'https://alexmorgan.dev/resume.pdf'
    },
    careerDetails: {
      interests: ['Full Stack Web Development', 'Backend Engineering', 'Cloud Infrastructure'],
      preferredDomain: 'Web Development',
      preferredJobRole: 'Full Stack Developer Intern',
      preferredWorkMode: 'Remote',
      locationPreference: 'Bengaluru / Remote'
    }
  });

  // Skills for Applicant
  const sampleSkills = [
    { name: 'Python', category: 'Technical', level: 'Advanced' },
    { name: 'JavaScript', category: 'Technical', level: 'Advanced' },
    { name: 'React', category: 'Technical', level: 'Intermediate' },
    { name: 'Node.js', category: 'Technical', level: 'Intermediate' },
    { name: 'SQL', category: 'Technical', level: 'Intermediate' },
    { name: 'MongoDB', category: 'Technical', level: 'Intermediate' },
    { name: 'Communication', category: 'Soft Skill', level: 'Advanced' },
    { name: 'Teamwork', category: 'Soft Skill', level: 'Advanced' },
    { name: 'Problem-solving', category: 'Soft Skill', level: 'Advanced' }
  ];

  const skillDocs = sampleSkills.map(s => ({ user: applicantUser._id, ...s }));
  await Skill.insertMany(skillDocs);

  applicantProfile.calculateCompletion(sampleSkills.length);
  await applicantProfile.save();

  // 2. Create Demo Organizations
  const org1User = new User({
    fullName: 'TechCorp Solutions',
    email: 'techcorp@devcore.com',
    password: passwordHash,
    role: 'organization'
  });
  await org1User.save();

  const org1Profile = new OrganizationProfile({
    user: org1User._id,
    orgName: 'TechCorp Solutions',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    officialEmail: 'techcorp@devcore.com',
    description: 'Leading enterprise software engineering house driving next-generation AI and Cloud solutions.',
    website: 'https://techcorp.example.com',
    linkedIn: 'https://linkedin.com/company/techcorp',
    industry: 'Software & Cloud Services',
    location: 'Bengaluru, India',
    contactPerson: 'Sarah Jenkins (HR Manager)',
    isVerified: true
  });
  await org1Profile.save();

  const org2User = new User({
    fullName: 'Innovate Labs',
    email: 'innovate@devcore.com',
    password: passwordHash,
    role: 'organization'
  });
  await org2User.save();

  const org2Profile = new OrganizationProfile({
    user: org2User._id,
    orgName: 'Innovate AI Labs',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150',
    officialEmail: 'innovate@devcore.com',
    description: 'Pioneering artificial intelligence research lab focused on NLP, Computer Vision, and Predictive Analytics.',
    website: 'https://innovatelabs.example.com',
    linkedIn: 'https://linkedin.com/company/innovatelabs',
    industry: 'Artificial Intelligence',
    location: 'Hyderabad / Remote',
    contactPerson: 'David Chen (Founder)',
    isVerified: true
  });
  await org2Profile.save();

  // 3. Create Admin User
  const adminUser = new User({
    fullName: 'DevCore Administrator',
    email: 'admin@devcore.com',
    password: passwordHash,
    role: 'admin'
  });
  await adminUser.save();

  // 4. Create Sample Internships
  const internship1 = new Internship({
    organization: org1User._id,
    orgName: 'TechCorp Solutions',
    orgLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    title: 'Full Stack Web Developer Intern',
    description: 'We are seeking an energetic Full Stack Intern to build modern web interfaces in React and robust REST backend services in Node.js and MongoDB.',
    responsibilities: 'Build interactive React components, implement secure API endpoints, optimize database queries, write unit tests.',
    requirements: 'Strong understanding of JavaScript/TypeScript, React.js, Express, HTML/CSS, REST API standards.',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API', 'SQL'],
    duration: '3 Months',
    location: 'Bengaluru / Hybrid',
    workMode: 'Hybrid',
    stipend: '₹25,000 / month',
    eligibility: 'Pre-final or Final Year B.Tech / M.Tech / MCA students.',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    openings: 3,
    benefits: 'Certificate of completion, PPO opportunity, Mentorship by senior architects.',
    contactDetails: 'careers@techcorp.example.com',
    status: 'published'
  });

  const internship2 = new Internship({
    organization: org2User._id,
    orgName: 'Innovate AI Labs',
    orgLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150',
    title: 'Python & AI Engineering Intern',
    description: 'Join our research engineering team to build data pipelines, train Scikit-Learn / PyTorch models, and deploy NLP APIs.',
    responsibilities: 'Clean and preprocess dataset features, implement TF-IDF and similarity metrics, containerize FastAPI microservices.',
    requirements: 'Proficiency in Python, Pandas, NumPy, Scikit-learn, and basic machine learning concepts.',
    requiredSkills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'SQL', 'FastAPI'],
    duration: '6 Months',
    location: 'Remote',
    workMode: 'Remote',
    stipend: '₹30,000 / month',
    eligibility: 'Passionate coders with experience in Python and Data Analytics.',
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    openings: 2,
    benefits: 'Remote work flexibility, Publication sponsorship, Competitive stipend.',
    contactDetails: 'jobs@innovatelabs.example.com',
    status: 'published'
  });

  const internship3 = new Internship({
    organization: org1User._id,
    orgName: 'TechCorp Solutions',
    orgLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    title: 'UI/UX Design & Frontend Intern',
    description: 'Create user journeys, design wireframes in Figma, and convert them into sleek React user interfaces with Tailwind CSS.',
    responsibilities: 'User flow research, wireframing, component styling, responsive mobile testing.',
    requirements: 'Figma expertise, HTML, Tailwind CSS, React basics, eye for design details.',
    requiredSkills: ['Figma', 'UI/UX', 'Tailwind CSS', 'JavaScript', 'Communication'],
    duration: '3 Months',
    location: 'Remote',
    workMode: 'Remote',
    stipend: '₹20,000 / month',
    eligibility: 'Any stream students with a design portfolio.',
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    openings: 1,
    benefits: 'Certificate, Portfolio expansion, Flexible hours.',
    contactDetails: 'design@techcorp.example.com',
    status: 'published'
  });

  await internship1.save();
  await internship2.save();
  await internship3.save();

  // 5. Create Application
  const application1 = new Application({
    internship: internship1._id,
    organization: org1User._id,
    applicant: applicantUser._id,
    fullName: 'Alex Morgan',
    email: 'applicant@devcore.com',
    phone: '+91 98765 43210',
    college: 'IIT Bombay',
    course: 'B.Tech CSE',
    resume: 'https://alexmorgan.dev/resume.pdf',
    github: 'https://github.com/alexmorgan-dev',
    linkedin: 'https://linkedin.com/in/alex-morgan-dev',
    portfolio: 'https://alexmorgan.dev',
    coverLetter: 'I am thrilled to apply for the Full Stack Web Developer Intern role. My background in React and Node.js aligns perfectly with your technology stack.',
    relevantSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
    availability: 'Immediate',
    status: 'Under Review',
    compatibilityScore: 92
  });
  await application1.save();

  // 6. Create Journey Records for Applicant
  const journeyEntries = [
    {
      user: applicantUser._id,
      type: 'Education',
      title: 'B.Tech in Computer Science',
      organizationOrInstitute: 'IIT Bombay',
      description: 'Maintained an 8.8 CGPA. Core projects in Distributed Systems and Web Architecture.',
      dateOrPeriod: '2022 - 2026',
      evidenceUrl: 'https://iitb.ac.in',
      isVerified: true
    },
    {
      user: applicantUser._id,
      type: 'Project',
      title: 'DevCore Full-Stack Platform',
      organizationOrInstitute: 'Smart India Hackathon Prototype',
      description: 'Designed and engineered an end-to-end platform for internship matching with Python TF-IDF AI Service, Node backend, and React UI.',
      dateOrPeriod: 'Sept 2026',
      evidenceUrl: 'https://github.com/alexmorgan-dev/devcore',
      isVerified: true
    },
    {
      user: applicantUser._id,
      type: 'Certification',
      title: 'Full Stack Web Development with Meta',
      organizationOrInstitute: 'Coursera / Meta',
      description: 'Completed 6-course specialization covering React, Node.js, REST APIs, and database security.',
      dateOrPeriod: 'July 2026',
      evidenceUrl: 'https://coursera.org/verify/example',
      isVerified: true
    },
    {
      user: applicantUser._id,
      type: 'Achievement',
      title: '1st Place - Inter-College Hackathon 2025',
      organizationOrInstitute: 'IIT Bombay TechFest',
      description: 'Awarded 1st place among 120+ teams for developing an automated skill gap assessment tool.',
      dateOrPeriod: 'Dec 2025',
      evidenceUrl: '',
      isVerified: false
    }
  ];
  await JourneyRecord.insertMany(journeyEntries);

  console.log('[Seed] Demo data successfully populated!');
  console.log('[Seed] Credentials summary:');
  console.log('   Applicant:    applicant@devcore.com  / password123');
  console.log('   Organization: techcorp@devcore.com   / password123');
  console.log('   Admin:        admin@devcore.com      / password123');
}

module.exports = { seedDatabase };
