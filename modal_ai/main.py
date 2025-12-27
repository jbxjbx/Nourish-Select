# Modal AI 舌象分析服务
# 部署命令: modal deploy modal_ai/main.py
# 本地测试: modal serve modal_ai/main.py

import modal
import os
from typing import Optional

# =============================================================================
# 1. 定义 Modal App 和 Image (环境)
# =============================================================================

app = modal.App("tongue-analyzer")

# 定义运行环境，安装必要的 AI 库
image = modal.Image.debian_slim(python_version="3.11").pip_install(
    "torch",
    "torchvision", 
    "Pillow",
    "numpy",
    "requests",
    "transformers",  # 如果需要使用 HuggingFace 模型
)

# =============================================================================
# 2. 定义 TongueAnalyzer 类
# =============================================================================

@app.cls(
    image=image,
    secrets=[modal.Secret.from_name("tongue-analyzer-secrets")],  # 存储 API_TOKEN
    gpu="T4",  # 使用 GPU 加速推理，可选 "T4", "A10G", "A100"
    timeout=120,  # 2分钟超时
)
class TongueAnalyzer:
    """舌象分析器类 - 处理图片分析请求"""
    
    @modal.enter()
    def load_model(self):
        """容器启动时加载模型 (只执行一次)"""
        import torch
        from PIL import Image
        
        print("🔄 Loading AI model...")
        
        # TODO: 替换为你的真实模型加载逻辑
        # 示例: self.model = torch.load("path/to/model.pth")
        # 示例: self.model = YourCustomModel.from_pretrained("your-model")
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"✅ Model loaded on {self.device}")
        
        # 模拟模型加载 (实际部署时替换)
        self.model = None  # 替换为真实模型
    
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
        import numpy as np
        import random
        
        print(f"📸 Fetching image from: {image_url[:50]}...")
        
        try:
            # 下载图片
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            img = Image.open(BytesIO(response.content)).convert("RGB")
            
            # TODO: 替换为真实的模型推理逻辑
            # 示例:
            # img_tensor = self.transform(img).unsqueeze(0).to(self.device)
            # with torch.no_grad():
            #     output = self.model(img_tensor)
            # result = self.postprocess(output)
            
            # =====================================================
            # 模拟 AI 分析结果 (实际部署时替换为真实模型推理)
            # =====================================================
            
            constitutions = ["Qi Deficiency", "Yang Deficiency", "Yin Deficiency", 
                           "Phlegm-Dampness", "Damp-Heat", "Blood Stasis", 
                           "Qi Stagnation", "Balanced"]
            
            constitution = random.choice(constitutions)
            score = random.randint(55, 95)
            
            # 舌象特征
            tongue_features = {
                "teeth_marks": random.choice([True, False]),
                "pale_white": random.choice([True, False]),
                "red": random.choice([True, False]),
                "cracked": random.choice([True, False]),
                "peeling": random.choice([True, False]),
            }
            
            # 症状概率
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
            
            # 根据体质推荐产品
            recommendations = {
                "Qi Deficiency": {"name": "Ginseng Vitality Elixir", "productId": "drink-1"},
                "Yang Deficiency": {"name": "Warming Ginger Tonic", "productId": "drink-2"},
                "Yin Deficiency": {"name": "Cooling Chrysanthemum Tea", "productId": "drink-3"},
                "Phlegm-Dampness": {"name": "Bamboo Detox Elixir", "productId": "drink-1"},
                "Damp-Heat": {"name": "Cooling Mint Infusion", "productId": "drink-2"},
                "Blood Stasis": {"name": "Rose Circulation Blend", "productId": "drink-3"},
                "Qi Stagnation": {"name": "Jasmine Calm Tea", "productId": "drink-1"},
                "Balanced": {"name": "Daily Balance Elixir", "productId": "drink-2"},
            }
            
            rec = recommendations.get(constitution, recommendations["Balanced"])
            
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
            
            result = {
                "score": score,
                "constitution": constitution,
                "issues": issues[:3],
                "recommendation": {
                    "name": rec["name"],
                    "desc": f"Specially formulated for {constitution} constitution",
                    "productId": rec["productId"],
                },
                "tongue_features": tongue_features,
                "symptoms": symptoms,
            }
            
            print(f"✅ Analysis complete: {constitution} (score: {score})")
            return result
            
        except Exception as e:
            print(f"❌ Error analyzing image: {str(e)}")
            raise


# =============================================================================
# 3. Web Endpoint - 接收 Vercel 请求
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
    
    响应格式:
        {
            "success": true,
            "data": { ... analysis result ... }
        }
    """
    import os
    
    # ===========================================
    # 安全验证: 检查 Authorization Token
    # ===========================================
    
    # 从环境变量获取预设的 API Token
    expected_token = os.environ.get("API_TOKEN")
    
    # 从请求中获取 token
    auth_header = request.get("headers", {}).get("authorization", "")
    
    # 支持 "Bearer <token>" 格式
    if auth_header.startswith("Bearer "):
        provided_token = auth_header[7:]
    else:
        provided_token = auth_header
    
    # 验证 token
    if not expected_token:
        return {
            "success": False,
            "error": "Server configuration error: API_TOKEN not set"
        }
    
    if provided_token != expected_token:
        return {
            "success": False,
            "error": "Unauthorized: Invalid or missing API token"
        }
    
    # ===========================================
    # 处理分析请求
    # ===========================================
    
    image_url = request.get("body", {}).get("image_url")
    
    if not image_url:
        return {
            "success": False,
            "error": "Missing required field: image_url"
        }
    
    try:
        # 调用 TongueAnalyzer 类进行分析
        analyzer = TongueAnalyzer()
        result = analyzer.analyze.remote(image_url)
        
        return {
            "success": True,
            "data": result
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Analysis failed: {str(e)}"
        }


# =============================================================================
# 4. 健康检查端点 (可选)
# =============================================================================

@app.function(image=image)
@modal.web_endpoint(method="GET")
def health() -> dict:
    """健康检查端点"""
    return {
        "status": "healthy",
        "service": "tongue-analyzer",
        "version": "1.0.0"
    }


# =============================================================================
# 5. 本地测试入口
# =============================================================================

@app.local_entrypoint()
def main():
    """本地测试入口"""
    print("🚀 Testing Tongue Analyzer locally...")
    
    # 测试分析功能
    test_url = "https://via.placeholder.com/400x300"
    analyzer = TongueAnalyzer()
    result = analyzer.analyze.remote(test_url)
    
    print("\n📊 Analysis Result:")
    print(f"  Constitution: {result['constitution']}")
    print(f"  Score: {result['score']}")
    print(f"  Issues: {result['issues']}")
    print(f"  Recommendation: {result['recommendation']['name']}")
