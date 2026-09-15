import re
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def normalize_skill(skill_name: str) -> str:
    """Normalize skill string for exact and fuzzy comparisons."""
    if not skill_name:
        return ""
    cleaned = skill_name.strip().lower()
    cleaned = re.sub(r'[\.\-\_\/]', '', cleaned)
    # Map common aliases
    alias_map = {
        'js': 'javascript',
        'py': 'python',
        'reactjs': 'react',
        'nodejs': 'node.js',
        'expressjs': 'express',
        'cpp': 'c++',
        'postgres': 'postgresql',
        'ml': 'machine learning',
        'ai': 'artificial intelligence',
        'tf': 'tensorflow'
    }
    return alias_map.get(cleaned, cleaned)

def extract_skill_names(skills_input):
    """Extract list of skill strings from strings or dict objects."""
    if not skills_input:
        return []
    skill_names = []
    for s in skills_input:
        if isinstance(s, dict):
            name = s.get('name') or s.get('skillName') or ''
        elif isinstance(s, str):
            name = s
        else:
            name = str(s)
        if name:
            skill_names.append(name.strip())
    return skill_names

def calculate_match(applicant_skills, career_interests, preferred_domain, internship_title, internship_requirements, required_skills):
    """
    Computes compatibility score, matched skills, missing skills, and why recommended.
    Uses TF-IDF Cosine Similarity combined with Normalized Skill Set Intersection.
    """
    app_skill_list = extract_skill_names(applicant_skills)
    req_skill_list = extract_skill_names(required_skills)

    app_norm_set = {normalize_skill(s) for s in app_skill_list if s}
    req_norm_set = {normalize_skill(s) for s in req_skill_list if s}

    # Identify matched and missing skills preserving original casing
    matched_skills = []
    missing_skills = []

    for req in req_skill_list:
        norm = normalize_skill(req)
        if norm in app_norm_set or any(norm in app_s for app_s in app_norm_set):
            if req not in matched_skills:
                matched_skills.append(req)
        else:
            if req not in missing_skills:
                missing_skills.append(req)

    # Calculate Skill Match Ratio (weight 60%)
    if req_norm_set:
        skill_score = len(matched_skills) / len(req_norm_set)
    else:
        skill_score = 0.5  # Neutral if no explicit required skills listed

    # TF-IDF Cosine Similarity between Applicant Profile Text and Internship Text (weight 40%)
    interests_str = " ".join(career_interests) if isinstance(career_interests, list) else str(career_interests or '')
    applicant_text = f"{' '.join(app_skill_list)} {interests_str} {preferred_domain or ''}".strip()
    internship_text = f"{internship_title or ''} {' '.join(req_skill_list)} {internship_requirements or ''}".strip()

    tf_idf_score = 0.0
    if applicant_text and internship_text:
        try:
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([applicant_text, internship_text])
            sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            tf_idf_score = float(sim)
        except Exception:
            tf_idf_score = 0.3

    # Domain bonus
    domain_bonus = 0.1 if preferred_domain and preferred_domain.lower() in (internship_title or '').lower() else 0.0

    # Final weighted score out of 100
    final_raw = (0.60 * skill_score) + (0.35 * tf_idf_score) + domain_bonus
    final_score = int(round(min(max(final_raw * 100, 15), 98)))  # Keep within realistic 15-98 range

    # Generate why recommended message
    if matched_skills:
        why = f"Matches your skills in {', '.join(matched_skills[:3])}."
        if domain_bonus > 0:
            why += f" Aligns with your preferred domain '{preferred_domain}'."
    else:
        why = f"Provides an opportunity to gain experience in {internship_title}."

    return {
        "compatibility_score": final_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "why_recommended": why,
        "skills_to_learn": missing_skills[:4]
    }

def recommend_certifications(applicant_skills, career_interests, preferred_domain):
    """Generate certification recommendations based on applicant's current skills and career gap."""
    app_skill_list = extract_skill_names(applicant_skills)
    app_norm_set = {normalize_skill(s) for s in app_skill_list}

    all_catalog = [
        {
            "name": "Full Stack Web Development Professional",
            "provider": "freeCodeCamp / Meta",
            "description": "Master React, Node.js, Express, and MongoDB for scalable modern web apps.",
            "required_skills": ["JavaScript", "HTML/CSS"],
            "target_skills": ["React", "Node.js", "MongoDB"],
            "difficulty": "Intermediate",
            "duration": "6 Weeks",
            "domain": "Web Development",
            "link": "https://www.freecodecamp.org/learn/2022/responsive-web-design/"
        },
        {
            "name": "Python for Data Science & Machine Learning",
            "provider": "IBM / Coursera",
            "description": "Learn data analysis with Pandas, NumPy, and predictive modeling using Scikit-Learn.",
            "required_skills": ["Python"],
            "target_skills": ["Pandas", "NumPy", "Scikit-Learn"],
            "difficulty": "Intermediate",
            "duration": "8 Weeks",
            "domain": "Data Science",
            "link": "https://www.coursera.org/professional-certificates/ibm-data-science"
        },
        {
            "name": "Backend REST API Architecture with Node.js",
            "provider": "MongoDB University",
            "description": "Design secure, robust RESTful APIs, JWT authentication, and database indexing.",
            "required_skills": ["JavaScript"],
            "target_skills": ["Node.js", "Express", "REST API", "SQL"],
            "difficulty": "Intermediate",
            "duration": "4 Weeks",
            "domain": "Backend Development",
            "link": "https://learn.mongodb.com/"
        },
        {
            "name": "AWS Certified Cloud Practitioner",
            "provider": "Amazon Web Services",
            "description": "Understand cloud infrastructure, EC2, S3, Docker containers, and CI/CD pipelines.",
            "required_skills": ["Linux"],
            "target_skills": ["AWS", "Docker", "DevOps"],
            "difficulty": "Beginner",
            "duration": "5 Weeks",
            "domain": "Cloud Computing",
            "link": "https://aws.amazon.com/certification/certified-cloud-practitioner/"
        },
        {
            "name": "Google UX Design Professional Certificate",
            "provider": "Google / Coursera",
            "description": "Conduct user research, wireframing, interactive prototyping in Figma, and UI testing.",
            "required_skills": ["Design Thinking"],
            "target_skills": ["Figma", "UI/UX", "User Research"],
            "difficulty": "Beginner",
            "duration": "6 Weeks",
            "domain": "Design",
            "link": "https://www.coursera.org/professional-certificates/google-ux-design"
        },
        {
            "name": "Professional Communication & Leadership Essentials",
            "provider": "LinkedIn Learning",
            "description": "Elevate workplace collaboration, technical presentation, and team problem-solving.",
            "required_skills": [],
            "target_skills": ["Communication", "Teamwork", "Leadership"],
            "difficulty": "Beginner",
            "duration": "2 Weeks",
            "domain": "Soft Skills",
            "link": "https://www.linkedin.com/learning/"
        }
    ]

    recommendations = []
    for cert in all_catalog:
        target_norms = [normalize_skill(s) for s in cert["target_skills"]]
        already_has = [s for s in target_norms if s in app_norm_set]
        missing = [s for s in cert["target_skills"] if normalize_skill(s) not in app_norm_set]

        # Calculate relevance
        is_domain_match = False
        if preferred_domain and (preferred_domain.lower() in cert["domain"].lower() or cert["domain"].lower() in preferred_domain.lower()):
            is_domain_match = True

        reason = ""
        if missing and is_domain_match:
            reason = f"Fills target domain '{cert['domain']}' skill gaps in {', '.join(missing[:2])}."
        elif missing:
            reason = f"Helps you master in-demand industry skills: {', '.join(missing[:2])}."
        else:
            reason = f"Strengthens your expertise in {cert['name']}."

        recommendations.append({
            "name": cert["name"],
            "provider": cert["provider"],
            "description": cert["description"],
            "required_skills": cert["required_skills"],
            "difficulty": cert["difficulty"],
            "duration": cert["duration"],
            "domain": cert["domain"],
            "reason_for_recommendation": reason,
            "target_skills": cert["target_skills"],
            "missing_skills_covered": missing,
            "external_link": cert["link"]
        })

    return recommendations
