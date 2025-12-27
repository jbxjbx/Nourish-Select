from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random
import time

app = FastAPI()

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    image_url: str

class AnalysisResult(BaseModel):
    score: int
    constitution: str
    issues: list[str]
    recommendation: dict
    tongue_features: dict[str, bool]
    symptoms: dict[str, float]

# ---------------------------------------------------------
# [USER ACTION REQUIRED LATER]
# Replace this function with your actual Model Inference code
# ---------------------------------------------------------
def run_ai_model(image_url: str) -> dict:
    # Simulate processing time
    time.sleep(1.5)
    
    # Mock Logic: Randomly determine result to simulate AI
    constitutions = ["Damp Heat", "Yang Deficiency", "Yin Deficiency", "Qi Stagnation", "Balanced"]
    detected_constitution = random.choice(constitutions)
    
    # Generate random features based on constitution
    features = {
        "teeth_marks": random.choice([True, False]),
        "pale_white": random.choice([True, False]),
        "red": random.choice([True, False]),
        "cracked": random.choice([True, False]),
        "peeling": random.choice([True, False]),
    }

    # Generate random symptom probabilities (0.1 to 0.9)
    symptoms = {
        "obesity": round(random.uniform(0.1, 0.9), 2),
        "high_sugar": round(random.uniform(0.1, 0.7), 2),
        "indigestion": round(random.uniform(0.2, 0.8), 2),
        "fatigue": round(random.uniform(0.2, 0.9), 2),
        "insomnia": round(random.uniform(0.1, 0.8), 2),
        "acid_reflux": round(random.uniform(0.1, 0.6), 2),
        "dry_mouth": round(random.uniform(0.2, 0.8), 2),
        "constipation": round(random.uniform(0.1, 0.7), 2),
        "irritability": round(random.uniform(0.2, 0.9), 2),
    }

    # Refine probabilities based on constitution
    if detected_constitution == "Damp Heat":
        symptoms["acne"] = 0.8
        symptoms["irritability"] = 0.85
        features["red"] = True
        features["peeling"] = True
    elif detected_constitution == "Yang Deficiency":
        symptoms["fatigue"] = 0.9
        symptoms["obesity"] = 0.75
        features["pale_white"] = True
        features["teeth_marks"] = True
    
    # Logic map to simple rules
    results = {
        "Damp Heat": {
            "score": 65,
            "issues": ["Thick yellow coating", "Red body", "Sticky sensation"],
            "recommendation": {
                "productId": "drink-1", 
                "name": "Bamboo Detox Elixir",
                "desc": "Cooling herbs to clear heat and dampness."
            }
        },
        "Yang Deficiency": {
            "score": 55,
            "issues": ["Pale tongue", "Tooth marks", "White coating"],
            "recommendation": {
                "productId": "drink-3",
                "name": "Golden Ginger Vigor",
                "desc": "Warming ingredients to boost internal fire."
            }
        },
        "Yin Deficiency": {
            "score": 60,
            "issues": ["Red tongue", "No coating", "Cracks"],
            "recommendation": {
                "productId": "drink-1",
                "name": "Moonlight Chamomile", # Reusing for demo
                "desc": "Nourishing fluids to soothe the body."
            }
        },
        "Qi Stagnation": {
            "score": 70,
            "issues": ["Purple spots", "Tense tongue body"],
            "recommendation": {
                "productId": "drink-2",
                "name": "Lavender Dream",
                "desc": "Flowing energy herbs to release tension."
            }
        },
        "Balanced": {
            "score": 92,
            "issues": ["Light red body", "Thin white coating"],
            "recommendation": {
                "productId": "drink-2",
                "name": "Daily Harmony Blend",
                "desc": "Maintenance for your excellent health."
            }
        }
    }
    
    base_result = results[detected_constitution]
    base_result["constitution"] = detected_constitution
    base_result["tongue_features"] = features
    base_result["symptoms"] = symptoms
    
    return base_result

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_tongue(request: AnalysisRequest):
    print(f"Received analysis request for: {request.image_url}")
    
    try:
        # Call the AI model function
        result = run_ai_model(request.image_url)
        
        return AnalysisResult(
            score=result["score"],
            constitution=result["constitution"],
            issues=result["issues"],
            recommendation=result["recommendation"],
            tongue_features=result["tongue_features"],
            symptoms=result["symptoms"]
        )
    except Exception as e:
        print(f"Error analyzing image: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@app.get("/")
def read_root():
    return {"status": "AI Service Running"}
