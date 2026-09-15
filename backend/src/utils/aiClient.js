const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5000';

function fallbackMatch(applicantSkills = [], careerInterests = [], preferredDomain = '', internshipTitle = '', internshipRequirements = '', requiredSkills = []) {
  const appSkillNames = applicantSkills.map(s => (typeof s === 'string' ? s : (s.name || s.skillName || ''))).filter(Boolean);
  const reqSkillNames = requiredSkills.map(s => (typeof s === 'string' ? s : (s.name || s.skillName || ''))).filter(Boolean);

  const normalize = (str) => str.toLowerCase().replace(/[\.\-\_\/]/g, '').trim();

  const appSet = new Set(appSkillNames.map(normalize));
  const matched = [];
  const missing = [];

  reqSkillNames.forEach(req => {
    const norm = normalize(req);
    if (appSet.has(norm)) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });

  const skillScore = reqSkillNames.length > 0 ? matched.length / reqSkillNames.length : 0.5;
  const domainBonus = preferredDomain && internshipTitle.toLowerCase().includes(preferredDomain.toLowerCase()) ? 0.15 : 0;
  
  const rawScore = (skillScore * 0.7) + domainBonus + 0.15;
  const finalScore = Math.min(Math.max(Math.round(rawScore * 100), 20), 96);

  return {
    compatibility_score: finalScore,
    matched_skills: matched,
    missing_skills: missing,
    why_recommended: matched.length > 0
      ? `Matches your skills in ${matched.slice(0, 3).join(', ')}.`
      : `Offers valuable experience in ${internshipTitle}.`,
    skills_to_learn: missing.slice(0, 4)
  };
}

async function getMatchScore(payload) {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/api/match`, payload, { timeout: 3000 });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.log('[AI Client] Python AI service fallback engaged:', err.message);
  }
  return fallbackMatch(
    payload.applicant_skills,
    payload.career_interests,
    payload.preferred_domain,
    payload.internship_title,
    payload.internship_requirements,
    payload.required_skills
  );
}

async function getRecommendations(applicantSkills, careerInterests, preferredDomain, internships) {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/api/recommendations`, {
      applicant_skills: applicantSkills,
      career_interests: careerInterests,
      preferred_domain: preferredDomain,
      internships: internships
    }, { timeout: 4000 });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.log('[AI Client] Python AI recommendations fallback engaged:', err.message);
  }

  // Fallback calculations for batch
  return internships.map(item => {
    const match = fallbackMatch(
      applicantSkills,
      careerInterests,
      preferredDomain,
      item.title || '',
      item.requirements || item.description || '',
      item.requiredSkills || []
    );
    return {
      internship_id: item._id ? item._id.toString() : item.id,
      internship: item,
      ...match
    };
  }).sort((a, b) => b.compatibility_score - a.compatibility_score);
}

async function getCertificationRecommendations(applicantSkills, careerInterests, preferredDomain) {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/api/certifications`, {
      applicant_skills: applicantSkills,
      career_interests: careerInterests,
      preferred_domain: preferredDomain
    }, { timeout: 3000 });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.log('[AI Client] Python AI certifications fallback engaged:', err.message);
  }

  return [
    {
      name: "Full Stack Web Development Professional",
      provider: "freeCodeCamp / Meta",
      description: "Master React, Node.js, Express, and MongoDB for scalable modern web apps.",
      required_skills: ["JavaScript", "HTML/CSS"],
      difficulty: "Intermediate",
      duration: "6 Weeks",
      domain: "Web Development",
      reason_for_recommendation: "Fills target domain skill gaps in React, Node.js, MongoDB.",
      target_skills: ["React", "Node.js", "MongoDB"],
      external_link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/"
    },
    {
      name: "Python for Data Science & Machine Learning",
      provider: "IBM / Coursera",
      description: "Learn data analysis with Pandas, NumPy, and predictive modeling using Scikit-Learn.",
      required_skills: ["Python"],
      difficulty: "Intermediate",
      duration: "8 Weeks",
      domain: "Data Science",
      reason_for_recommendation: "Builds core analytics capability for AI and data-driven roles.",
      target_skills: ["Pandas", "NumPy", "Scikit-Learn"],
      external_link: "https://www.coursera.org/professional-certificates/ibm-data-science"
    },
    {
      name: "Backend REST API Architecture with Node.js",
      provider: "MongoDB University",
      description: "Design secure, robust RESTful APIs, JWT authentication, and database indexing.",
      required_skills: ["JavaScript"],
      difficulty: "Intermediate",
      duration: "4 Weeks",
      domain: "Backend Development",
      reason_for_recommendation: "Enhances backend development proficiency.",
      target_skills: ["Node.js", "Express", "REST API"],
      external_link: "https://learn.mongodb.com/"
    }
  ];
}

module.exports = {
  getMatchScore,
  getRecommendations,
  getCertificationRecommendations
};
