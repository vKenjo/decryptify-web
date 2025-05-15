"""
Trust Score Agent - Calculates overall trust score based on all factors
"""
from typing import Dict, List
from langchain.tools import Tool
import json
import re

def calculate_trust_score(project_info: str) -> str:
    """Calculate overall trust score (0-10) based on all available project data"""
    try:
        # Initialize scoring components
        scores = {
            "team_credibility": 0,
            "technology": 0,
            "security": 0,
            "community": 0,
            "tokenomics": 0,
            "transparency": 0,
            "track_record": 0,
            "red_flags": 0
        }
        
        # Parse the project information to extract key metrics
        info_lower = project_info.lower()
        
        # Team credibility assessment
        if "anonymous" in info_lower or "unknown founder" in info_lower:
            scores["team_credibility"] = 2
        elif "verified" in info_lower or "doxxed" in info_lower:
            scores["team_credibility"] = 8
        elif "founder" in info_lower or "ceo" in info_lower:
            scores["team_credibility"] = 6
        else:
            scores["team_credibility"] = 4
        
        # Technology assessment
        if "open source" in info_lower or "github" in info_lower:
            scores["technology"] += 3
        if "mainnet" in info_lower or "launched" in info_lower:
            scores["technology"] += 3
        if "innovative" in info_lower or "unique" in info_lower:
            scores["technology"] += 2
        if "testnet" in info_lower:
            scores["technology"] += 1
        scores["technology"] = min(scores["technology"], 10)
        
        # Security assessment
        if "audit" in info_lower:
            if "certik" in info_lower or "quantstamp" in info_lower:
                scores["security"] = 9
            else:
                scores["security"] = 7
        elif "no audit" in info_lower:
            scores["security"] = 3
        else:
            scores["security"] = 5
            
        # Community assessment
        if "active community" in info_lower or "strong community" in info_lower:
            scores["community"] = 8
        elif "community" in info_lower:
            scores["community"] = 6
        else:
            scores["community"] = 4
            
        # Tokenomics assessment
        if "tokenomics" in info_lower:
            if "sustainable" in info_lower or "fair" in info_lower:
                scores["tokenomics"] = 8
            elif "questionable" in info_lower or "unclear" in info_lower:
                scores["tokenomics"] = 3
            else:
                scores["tokenomics"] = 6
        else:
            scores["tokenomics"] = 5
            
        # Transparency assessment
        if "transparent" in info_lower or "whitepaper" in info_lower:
            scores["transparency"] = 8
        elif "closed source" in info_lower or "no documentation" in info_lower:
            scores["transparency"] = 2
        else:
            scores["transparency"] = 5
            
        # Track record assessment
        if "established" in info_lower or "proven" in info_lower:
            scores["track_record"] = 9
        elif "new project" in info_lower or "recently launched" in info_lower:
            scores["track_record"] = 4
        else:
            scores["track_record"] = 6
            
        # Red flags assessment (negative scoring)
        red_flag_count = 0
        red_flags = []
        
        if "scam" in info_lower:
            red_flag_count += 3
            red_flags.append("Scam warnings detected")
        if "hack" in info_lower or "exploit" in info_lower:
            red_flag_count += 2
            red_flags.append("Security incidents reported")
        if "anonymous team" in info_lower:
            red_flag_count += 2
            red_flags.append("Anonymous team")
        if "no audit" in info_lower:
            red_flag_count += 1
            red_flags.append("No security audit")
        if "pump and dump" in info_lower:
            red_flag_count += 3
            red_flags.append("Pump and dump indicators")
        if "rug pull" in info_lower:
            red_flag_count += 3
            red_flags.append("Rug pull risk")
            
        scores["red_flags"] = max(0, 10 - red_flag_count)
        
        # Calculate weighted final score
        weights = {
            "team_credibility": 0.20,
            "technology": 0.15,
            "security": 0.20,
            "community": 0.10,
            "tokenomics": 0.10,
            "transparency": 0.10,
            "track_record": 0.10,
            "red_flags": 0.05
        }
        
        final_score = sum(scores[key] * weights[key] for key in scores)
        final_score = round(final_score, 1)
        
        # Determine trust level
        if final_score >= 8:
            trust_level = "VERY HIGH"
            emoji = "🟢"
            recommendation = "Highly trustworthy project with minimal risk indicators"
        elif final_score >= 6:
            trust_level = "HIGH"
            emoji = "🟢"
            recommendation = "Trustworthy project with good fundamentals"
        elif final_score >= 5:
            trust_level = "MODERATE"
            emoji = "🟡"
            recommendation = "Average trust level - proceed with caution"
        elif final_score >= 3:
            trust_level = "LOW"
            emoji = "🟠"
            recommendation = "Below average trust - significant risks present"
        else:
            trust_level = "VERY LOW"
            emoji = "🔴"
            recommendation = "High risk project - extreme caution advised"
        
        response = f"""
**DECRYPTIFY TRUST SCORE REPORT**

{emoji} **Overall Trust Score: {final_score}/10**
**Trust Level: {trust_level}**

**Scoring Breakdown:**
• Team Credibility: {scores['team_credibility']}/10 (Weight: {weights['team_credibility']*100}%)
• Technology: {scores['technology']}/10 (Weight: {weights['technology']*100}%)
• Security: {scores['security']}/10 (Weight: {weights['security']*100}%)
• Community: {scores['community']}/10 (Weight: {weights['community']*100}%)
• Tokenomics: {scores['tokenomics']}/10 (Weight: {weights['tokenomics']*100}%)
• Transparency: {scores['transparency']}/10 (Weight: {weights['transparency']*100}%)
• Track Record: {scores['track_record']}/10 (Weight: {weights['track_record']*100}%)
• Red Flags: {scores['red_flags']}/10 (Weight: {weights['red_flags']*100}%)

**Key Findings:**
"""
        
        # Add positive findings
        if scores['team_credibility'] >= 7:
            response += "✅ Strong team credibility and transparency\n"
        if scores['security'] >= 7:
            response += "✅ Comprehensive security audit completed\n"
        if scores['technology'] >= 7:
            response += "✅ Solid technology foundation\n"
        if scores['community'] >= 7:
            response += "✅ Active and engaged community\n"
            
        # Add concerns
        if red_flags:
            response += "\n**⚠️ Red Flags Detected:**\n"
            for flag in red_flags:
                response += f"• {flag}\n"
        
        response += f"""
**Recommendation:**
{recommendation}

**Investment Guidance:**
"""
        
        if final_score >= 7:
            response += """
• LOW RISK: Suitable for most investors
• Conduct standard due diligence
• Monitor project developments
• Consider for long-term holdings
"""
        elif final_score >= 5:
            response += """
• MEDIUM RISK: Suitable for experienced investors
• Perform thorough research
• Start with small positions
• Monitor closely for changes
"""
        else:
            response += """
• HIGH RISK: Only for risk-tolerant investors
• Extensive due diligence required
• Consider avoiding or minimal exposure
• High potential for loss
"""
        
        response += """
**Disclaimer:**
This trust score is based on available public information and automated analysis. It should not be considered financial advice. Always do your own research and consult with financial professionals before making investment decisions.

**Trust Score Methodology:**
Our scoring system evaluates multiple factors including team credibility, technology assessment, security audits, community strength, tokenomics, transparency, track record, and potential red flags. Each factor is weighted based on its importance to overall project trustworthiness.
"""
        
        return response
        
    except Exception as e:
        return f"Error calculating trust score: {str(e)}"

# Create the tool
trust_score_tool = Tool(
    name="trust_calculator",
    func=calculate_trust_score,
    description="Calculate comprehensive trust score (0-10) based on all available project data including team, technology, security, and red flags"
)
