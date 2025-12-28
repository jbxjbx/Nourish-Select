# Modal AI 舌象分析服务 - 使用 Google Gemini Vision
# 部署命令: modal deploy modal_ai/main.py
# 本地测试: modal serve modal_ai/main.py

import modal
import os
import json
import re
from typing import Optional

# =============================================================================
# 1. 定义 Modal App 和 Image (环境)
# =============================================================================

app = modal.App("tongue-analyzer")

# 定义运行环境，安装 Google Generative AI SDK
image = modal.Image.debian_slim(python_version="3.11").pip_install(
    "google-generativeai",
    "Pillow",
    "requests",
    "fastapi",
)

# =============================================================================
# 2. 分析提示词 (TCM Tongue Diagnosis Prompt)
# =============================================================================

ANALYSIS_PROMPT = """You are an expert in Traditional Chinese Medicine (TCM) tongue diagnosis.

Analyze this tongue image and provide a structured assessment. Return ONLY a valid JSON object with the following structure (no markdown, no code blocks, just pure JSON):

{
    "constitution": "<one of: Qi Deficiency, Yang Deficiency, Yin Deficiency, Damp Heat, Qi Stagnation, Blood Stasis, Phlegm Dampness, Balanced>",
    "score": <integer 50-100 representing overall health score>,
    "tongue_features": {
        "teeth_marks": <true/false - bite marks on tongue edges indicate Qi deficiency>,
        "pale_white": <true/false - pale color indicates blood/Yang deficiency>,
        "red": <true/false - red color indicates heat/Yin deficiency>,
        "cracked": <true/false - cracks indicate Yin deficiency>,
        "peeling": <true/false - peeling coating indicates stomach Yin deficiency>
    },
    "symptoms": {
        "obesity": <0.0-1.0 probability>,
        "high_sugar": <0.0-1.0 probability>,
        "indigestion": <0.0-1.0 probability>,
        "fatigue": <0.0-1.0 probability>,
        "insomnia": <0.0-1.0 probability>,
        "acid_reflux": <0.0-1.0 probability>,
        "dry_mouth": <0.0-1.0 probability>,
        "constipation": <0.0-1.0 probability>,
        "irritability": <0.0-1.0 probability>
    },
    "issues": ["<issue 1>", "<issue 2>", "<issue 3>"]
}

Analyze the tongue color, shape, coating, moisture, and any special features. Base your assessment on TCM principles.
If the image doesn't show a tongue clearly, still provide reasonable estimates based on what you can see.
IMPORTANT: Return ONLY the JSON object, no other text."""

# =============================================================================
# 3. 定义 TongueAnalyzer 类
# =============================================================================

@app.cls(
    image=image,
    secrets=[modal.Secret.from_name("tongue-analyzer-secrets")],
    timeout=120,
)
class TongueAnalyzer:
    """舌象分析器类 - 使用 Google Gemini Vision API"""
    
    @modal.enter()
    def load_model(self):
        """容器启动时初始化 Gemini 客户端"""
        import google.generativeai as genai
        
        print("🔄 Initializing Google Gemini Vision...")
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("⚠️ GEMINI_API_KEY not set, falling back to mock mode")
            self.model = None
            return
        
        genai.configure(api_key=api_key)
        
        # 使用 Gemini 2.0 Flash (最新快速模型)
        self.model = genai.GenerativeModel("gemini-2.0-flash-exp")
        print("✅ Gemini 2.0 Flash initialized successfully")
    
    @modal.method()
    def analyze(self, image_url: str) -> dict:
        """
        分析舌象图片
        
        Args:
            image_url: 图片的 URL 地址
            
        Returns:
            分析结果字典
        """
        import requests
        from PIL import Image
        from io import BytesIO
        import random
        
        print(f"📸 Fetching image from: {image_url[:80]}...")
        
        try:
            # 下载图片
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            img = Image.open(BytesIO(response.content)).convert("RGB")
            
            # 如果没有 Gemini API Key，使用模拟模式
            if self.model is None:
                print("⚠️ Using mock analysis (no API key)")
                return self._mock_analyze()
            
            # 使用 Gemini Vision 分析
            print("🧠 Analyzing with Gemini Vision...")
            
            response = self.model.generate_content([ANALYSIS_PROMPT, img])
            
            # 解析 JSON 响应
            result_text = response.text.strip()
            
            # 清理可能的 markdown 代码块
            if result_text.startswith("```"):
                result_text = re.sub(r'^```json?\s*', '', result_text)
                result_text = re.sub(r'\s*```$', '', result_text)
            
            result = json.loads(result_text)
            
            # 添加产品推荐
            result["recommendation"] = self._get_recommendation(result["constitution"])
            
            print(f"✅ Analysis complete: {result['constitution']} (score: {result['score']})")
            return result
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse error: {str(e)}")
            print(f"Raw response: {result_text[:500]}")
            # 返回模拟结果作为降级
            return self._mock_analyze()
            
        except Exception as e:
            print(f"❌ Error analyzing image: {str(e)}")
            raise
    
    def _get_recommendation(self, constitution: str) -> dict:
        """根据体质类型推荐产品"""
        recommendations = {
            "Qi Deficiency": {"name": "Ginseng Vitality Elixir", "productId": "drink-1", "desc": "Specially formulated to boost Qi and restore energy"},
            "Yang Deficiency": {"name": "Warming Ginger Tonic", "productId": "drink-2", "desc": "Warming herbs to strengthen Yang energy"},
            "Yin Deficiency": {"name": "Cooling Chrysanthemum Tea", "productId": "drink-3", "desc": "Nourishing blend to restore Yin balance"},
            "Damp Heat": {"name": "Bamboo Detox Elixir", "productId": "drink-1", "desc": "Clears heat and resolves dampness"},
            "Qi Stagnation": {"name": "Jasmine Calm Tea", "productId": "drink-2", "desc": "Promotes smooth Qi flow and emotional balance"},
            "Blood Stasis": {"name": "Rose Circulation Blend", "productId": "drink-3", "desc": "Invigorates blood circulation"},
            "Phlegm Dampness": {"name": "Bamboo Detox Elixir", "productId": "drink-1", "desc": "Resolves phlegm and eliminates dampness"},
            "Balanced": {"name": "Daily Balance Elixir", "productId": "drink-2", "desc": "Maintains overall harmony and wellness"},
        }
        return recommendations.get(constitution, recommendations["Balanced"])
    
    def _mock_analyze(self) -> dict:
        """模拟分析结果 (当没有 API Key 时使用)"""
        import random
        
        constitutions = ["Qi Deficiency", "Yang Deficiency", "Yin Deficiency", 
                        "Damp Heat", "Qi Stagnation", "Blood Stasis", 
                        "Phlegm Dampness", "Balanced"]
        
        constitution = random.choice(constitutions)
        score = random.randint(55, 95)
        
        tongue_features = {
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
        
        issues = []
        if tongue_features["teeth_marks"]:
            issues.append("Teeth marks indicate Qi deficiency")
        if tongue_features["pale_white"]:
            issues.append("Pale color suggests blood deficiency")
        if tongue_features["red"]:
            issues.append("Red color indicates excess heat")
        if tongue_features["cracked"]:
            issues.append("Cracks suggest Yin deficiency")
        if not issues:
            issues.append("Generally healthy tongue appearance")
        
        return {
            "score": score,
            "constitution": constitution,
            "issues": issues[:3],
            "recommendation": self._get_recommendation(constitution),
            "tongue_features": tongue_features,
            "symptoms": symptoms,
        }


# =============================================================================
# 4. Web Endpoint - 接收请求
# =============================================================================

@app.function(
    image=image,
    secrets=[modal.Secret.from_name("tongue-analyzer-secrets")],
)
@modal.web_endpoint(method="POST", docs=True)
def analyze_tongue(request: dict) -> dict:
    """
    Web API 端点 - 接收图片分析请求
    
    请求格式:
    POST /analyze_tongue
    Headers:
        Authorization: Bearer <YOUR_API_TOKEN>
        Content-Type: application/json
    Body:
        {
            "image_url": "https://example.com/image.jpg"
        }
    """
    import os
    
    # 安全验证
    expected_token = os.environ.get("API_TOKEN")
    auth_header = request.get("headers", {}).get("authorization", "")
    
    if auth_header.startswith("Bearer "):
        provided_token = auth_header[7:]
    else:
        provided_token = auth_header
    
    if not expected_token:
        return {"success": False, "error": "Server configuration error: API_TOKEN not set"}
    
    if provided_token != expected_token:
        return {"success": False, "error": "Unauthorized: Invalid or missing API token"}
    
    # 处理分析请求
    image_url = request.get("body", {}).get("image_url")
    
    if not image_url:
        return {"success": False, "error": "Missing required field: image_url"}
    
    try:
        analyzer = TongueAnalyzer()
        result = analyzer.analyze.remote(image_url)
        
        return {"success": True, "data": result}
        
    except Exception as e:
        return {"success": False, "error": f"Analysis failed: {str(e)}"}


# =============================================================================
# 5. 健康检查端点
# =============================================================================

@app.function(image=image)
@modal.web_endpoint(method="GET")
def health() -> dict:
    """健康检查端点"""
    return {
        "status": "healthy",
        "service": "tongue-analyzer",
        "version": "2.0.0",
        "model": "gemini-2.0-flash"
    }


# =============================================================================
# 6. 本地测试入口
# =============================================================================

@app.local_entrypoint()
def main():
    """本地测试入口"""
    print("🚀 Testing Tongue Analyzer with Gemini Vision...")
    
    test_url = "https://via.placeholder.com/400x300"
    analyzer = TongueAnalyzer()
    result = analyzer.analyze.remote(test_url)
    
    print("\n📊 Analysis Result:")
    print(f"  Constitution: {result['constitution']}")
    print(f"  Score: {result['score']}")
    print(f"  Issues: {result['issues']}")
    print(f"  Recommendation: {result['recommendation']['name']}")
