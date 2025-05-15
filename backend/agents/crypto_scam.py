"""
Crypto Scam Agent - Detects and analyzes cryptocurrency scam risks
"""
import re
from typing import List, Dict
from langchain.tools import Tool

# Common scam indicators
SCAM_KEYWORDS = [
    "guaranteed returns",
    "risk-free",
    "double your money",
    "act now",
    "limited time",
    "get rich quick",
    "pyramid",
    "ponzi",
    "mlm",
    "multi-level",
    "referral bonus",
    "exclusive opportunity",
    "secret method",
    "insider information",
    "pump and dump",
]

SUSPICIOUS_PATTERNS = [
    r"guaranteed.*\d+%.*returns?",
    r"earn.*\d+%.*daily",
    r"minimum.*investment.*required",
    r"recruit.*friends.*earn",
    r"no.*risk.*investment",
]

def analyze_scam_risk(project_name: str, additional_info: str = "") -> str:
    """Analyze cryptocurrency project for scam indicators and risks"""
    try:
        # Combine project name and additional info for analysis
        text_to_analyze = f"{project_name} {additional_info}".lower()
        
        # Initialize risk assessment
        risk_factors = []
        risk_score = 0
        
        # Check for scam keywords
        found_keywords = []
        for keyword in SCAM_KEYWORDS:
            if keyword in text_to_analyze:
                found_keywords.append(keyword)
                risk_score += 10
        
        if found_keywords:
            risk_factors.append(f"Suspicious keywords detected: {', '.join(found_keywords)}")
        
        # Check for suspicious patterns
        found_patterns = []
        for pattern in SUSPICIOUS_PATTERNS:
            if re.search(pattern, text_to_analyze):
                found_patterns.append(pattern)
                risk_score += 15
        
        if found_patterns:
            risk_factors.append(f"Suspicious patterns detected: {len(found_patterns)} patterns")
        
        # Check for common scam project name patterns
        if any(word in project_name.lower() for word in ["elon", "musk", "doge", "shiba", "moon", "safe"]):
            risk_factors.append("Project name contains commonly exploited terms")
            risk_score += 5
        
        # Check for unrealistic promises
        if re.search(r"\d{3,}%", text_to_analyze):  # 100%+ returns
            risk_factors.append("Unrealistic return promises detected")
            risk_score += 20
        
        # Check for urgency tactics
        urgency_words = ["hurry", "last chance", "ending soon", "act fast", "now or never"]
        if any(word in text_to_analyze for word in urgency_words):
            risk_factors.append("Urgency tactics detected")
            risk_score += 10
        
        # Check for anonymous team
        if "anonymous" in text_to_analyze or "doxxed" not in text_to_analyze:
            risk_factors.append("Potentially anonymous team")
            risk_score += 15
        
        # Calculate risk level
        if risk_score >= 50:
            risk_level = "HIGH RISK"
            recommendation = "⚠️ EXTREME CAUTION: Multiple red flags detected. High probability of scam."
        elif risk_score >= 30:
            risk_level = "MEDIUM-HIGH RISK"
            recommendation = "⚠️ CAUTION: Several warning signs present. Proceed with extreme caution."
        elif risk_score >= 15:
            risk_level = "MEDIUM RISK"
            recommendation = "⚠️ WARNING: Some suspicious indicators found. Research thoroughly before investing."
        elif risk_score > 0:
            risk_level = "LOW-MEDIUM RISK"
            recommendation = "ℹ️ NOTE: Minor concerns detected. Conduct due diligence."
        else:
            risk_level = "LOW RISK"
            recommendation = "✅ No major red flags detected, but always do your own research."
        
        # Format response
        response = f"""
**Scam Risk Assessment for {project_name}:**

🚨 Risk Level: {risk_level}
📊 Risk Score: {risk_score}/100

**Risk Factors Identified:**
"""
        
        if risk_factors:
            for factor in risk_factors:
                response += f"• {factor}\n"
        else:
            response += "• No specific risk factors identified\n"
        
        response += f"""
**Recommendation:**
{recommendation}

**General Scam Prevention Tips:**
1. Never invest more than you can afford to lose
2. Research the team - avoid anonymous projects
3. Check for audited smart contracts
4. Be wary of guaranteed returns
5. Verify all project claims independently
6. Check community discussions and reviews
7. Look for transparent tokenomics
8. Avoid FOMO and pressure tactics

**Red Flags to Watch For:**
• Promises of guaranteed returns
• Pressure to invest quickly
• Referral-based reward systems
• Anonymous or fake team members
• No clear use case or roadmap
• Copied whitepaper content
• Fake partnerships or endorsements
"""
        
        return response
        
    except Exception as e:
        return f"Error analyzing scam risk: {str(e)}"

# Create the tool
crypto_scam_tool = Tool(
    name="crypto_scam_detector",
    func=analyze_scam_risk,
    description="Analyze cryptocurrency projects for scam indicators and risk factors"
)
