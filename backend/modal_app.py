import modal
from fastapi import HTTPException
from pydantic import BaseModel
import random
import time

# Define the Modal app
app = modal.App("nourish-select-api")

# Define the container image with dependencies
image = modal.Image.debian_slim(python_version="3.11").pip_install([
    "fastapi",
    "pydantic",
])

class AnalysisRequest(BaseModel):
    image_url: str

class AnalysisResult(BaseModel):
    score: int
    constitution: str
    issues: list[str]
    recommendation: dict
    tongue_features: dict
    symptoms: dict

def run_ai_model(image_url: str) -> dict:
    """
    Mock AI model function.
    TODO: Replace with your actual AI model inference code.
    """
    time.sleep(1.0)  # Simulated processing time
    
    constitutions = ["Damp Heat", "Yang Deficiency", "Yin Deficiency", "Qi Stagnation", "Balanced"]
    detected_constitution = random.choice(constitutions)
    
    features = {
        "teeth_marks": random.choice([True, False]),
        "pale_white": random.choice([True, False]),
        "red": random.choice([True, False]),
        "cracked": random.choice([True, False]),
        "peeling": random.choice([True, False]),
    }

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

    if detected_constitution == "Damp Heat":
        symptoms["irritability"] = 0.85
        features["red"] = True
    elif detected_constitution == "Yang Deficiency":
        symptoms["fatigue"] = 0.9
        features["pale_white"] = True
        features["teeth_marks"] = True
    
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
                "name": "Moonlight Chamomile",
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

# Create the FastAPI web endpoint
@app.function(image=image)
@modal.fastapi_endpoint(method="POST")
def analyze(request: AnalysisRequest) -> AnalysisResult:
    """Analyze tongue image and return health assessment."""
    print(f"Received analysis request for: {request.image_url}")
    
    try:
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

@app.function(image=image)
@modal.fastapi_endpoint(method="GET")
def health() -> dict:
    """Health check endpoint."""
    return {"status": "healthy", "service": "nourish-select-api"}
