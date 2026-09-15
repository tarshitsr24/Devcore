import os
from typing import List, Optional, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from matcher import calculate_match, recommend_certifications

app = FastAPI(
    title="DevCore AI Service",
    description="Python AI Service providing skill matching, internship compatibility scoring, and certification gap analysis.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    applicant_skills: List[Any] = []
    career_interests: List[str] = []
    preferred_domain: Optional[str] = ""
    internship_title: str
    internship_requirements: Optional[str] = ""
    required_skills: List[Any] = []

class RecommendationBatchRequest(BaseModel):
    applicant_skills: List[Any] = []
    career_interests: List[str] = []
    preferred_domain: Optional[str] = ""
    internships: List[dict] = []

class CertificationRequest(BaseModel):
    applicant_skills: List[Any] = []
    career_interests: List[str] = []
    preferred_domain: Optional[str] = ""

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "DevCore Python AI Service",
        "engine": "FastAPI + Scikit-Learn TF-IDF Cosine Similarity"
    }

@app.get("/health")
def read_health():
    return {
        "status": "healthy",
        "service": "DevCore Python AI Service"
    }

@app.post("/api/match")
def match_single(payload: MatchRequest):
    try:
        res = calculate_match(
            applicant_skills=payload.applicant_skills,
            career_interests=payload.career_interests,
            preferred_domain=payload.preferred_domain,
            internship_title=payload.internship_title,
            internship_requirements=payload.internship_requirements,
            required_skills=payload.required_skills
        )
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommendations")
def recommend_internships(payload: RecommendationBatchRequest):
    try:
        results = []
        for item in payload.internships:
            internship_id = item.get("_id") or item.get("id")
            title = item.get("title", "")
            req_str = item.get("requirements") or item.get("description") or ""
            req_skills = item.get("requiredSkills") or item.get("required_skills") or []
            
            match_res = calculate_match(
                applicant_skills=payload.applicant_skills,
                career_interests=payload.career_interests,
                preferred_domain=payload.preferred_domain,
                internship_title=title,
                internship_requirements=req_str,
                required_skills=req_skills
            )

            results.append({
                "internship_id": str(internship_id),
                "internship": item,
                **match_res
            })

        # Sort by compatibility score descending
        results.sort(key=lambda x: x["compatibility_score"], reverse=True)
        return {"success": True, "count": len(results), "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/certifications")
def get_certifications(payload: CertificationRequest):
    try:
        certs = recommend_certifications(
            applicant_skills=payload.applicant_skills,
            career_interests=payload.career_interests,
            preferred_domain=payload.preferred_domain
        )
        return {"success": True, "data": certs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
