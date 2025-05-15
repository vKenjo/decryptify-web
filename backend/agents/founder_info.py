"""
Founder Info Agent - Investigates founder and team credibility
"""
from typing import Dict, List
from langchain.tools import Tool
import re

# Mock database of known founders (in production, this would use real APIs)
FOUNDER_DATABASE = {
    "vitalik buterin": {
        "name": "Vitalik Buterin",
        "role": "Co-founder of Ethereum",
        "credibility_score": 10,
        "background": [
            "Co-founded Ethereum at age 19",
            "Received Thiel Fellowship in 2014",
            "Published Ethereum whitepaper in 2013",
            "Regular speaker at blockchain conferences",
            "Active on Twitter with verified account"
        ],
        "education": "Studied at University of Waterloo",
        "previous_projects": ["Bitcoin Magazine"],
        "social_presence": {
            "twitter": "@VitalikButerin",
            "github": "vbuterin",
            "verified": True
        },
        "red_flags": [],
        "achievements": [
            "TIME Magazine's 100 most influential people (2021)",
            "World Technology Award (2014)",
            "Created one of the largest blockchain platforms"
        ]
    },
    "changpeng zhao": {
        "name": "Changpeng Zhao (CZ)",
        "role": "Founder and CEO of Binance",
        "credibility_score": 9,
        "background": [
            "Former developer at Blockchain.info",
            "CTO at OKCoin",
            "Founded Binance in 2017",
            "Built largest crypto exchange by volume"
        ],
        "education": "McGill University - Computer Science",
        "previous_projects": ["Fusion Systems", "OKCoin"],
        "social_presence": {
            "twitter": "@cz_binance",
            "verified": True
        },
        "red_flags": ["Regulatory challenges in multiple countries"],
        "achievements": [
            "Built Binance to #1 exchange globally",
            "Forbes Crypto Billionaire",
            "Pioneered BNB token and BSC"
        ]
    }
}

def research_founder(founder_name: str, project_name: str = "") -> str:
    """Research founder and team credibility"""
    try:
        # Normalize founder name
        normalized_name = founder_name.lower().strip()
        
        # Check if we have data for this founder
        if normalized_name in FOUNDER_DATABASE:
            founder = FOUNDER_DATABASE[normalized_name]
            
            response = f"""
**Founder Analysis: {founder['name']}**

👤 Role: {founder['role']}
🎯 Credibility Score: {founder['credibility_score']}/10
🎓 Education: {founder['education']}

**Professional Background:**
"""
            for item in founder['background']:
                response += f"• {item}\n"
            
            response += "\n**Previous Projects:**\n"
            for project in founder['previous_projects']:
                response += f"• {project}\n"
            
            response += "\n**Achievements:**\n"
            for achievement in founder['achievements']:
                response += f"• {achievement}\n"
            
            response += f"""
**Social Media Presence:**
• Twitter: {founder['social_presence']['twitter']}
• Verified Account: {'Yes' if founder['social_presence']['verified'] else 'No'}
"""
            
            if founder['red_flags']:
                response += "\n**Potential Concerns:**\n"
                for flag in founder['red_flags']:
                    response += f"• {flag}\n"
            
            response += "\n**Assessment:**\n"
            if founder['credibility_score'] >= 8:
                response += "✅ HIGHLY CREDIBLE: Well-established figure with proven track record"
            elif founder['credibility_score'] >= 6:
                response += "✅ CREDIBLE: Legitimate background with some accomplishments"
            else:
                response += "⚠️ QUESTIONABLE: Limited track record or concerning factors"
                
        else:
            # Provide general guidance for unknown founders
            response = f"""
**Founder Analysis: {founder_name}**

❓ No specific information found for this founder.

**How to Research Unknown Founders:**

1. **Verify Identity**
   • Check LinkedIn profile
   • Look for verified social media accounts
   • Search for press mentions and interviews
   • Verify educational credentials
   • Check professional history

2. **Assess Track Record**
   • Previous blockchain projects
   • Traditional business experience
   • Technical contributions (GitHub, papers)
   • Speaking engagements
   • Industry recognition

3. **Red Flags to Watch For:**
   • No public presence or social media
   • Stock photos or fake profiles
   • Unverifiable claims
   • No previous work history
   • Anonymous or pseudonymous only
   • Involved in previous failed/scam projects

4. **Positive Indicators:**
   • Real name and photos
   • Verifiable work history
   • Active in crypto community
   • Technical contributions
   • Transparent communication
   • Regular updates and engagement

5. **Team Assessment:**
   • Check entire team, not just founder
   • Look for experienced advisors
   • Verify partnerships claims
   • Check if team is "doxxed" (publicly known)

**Due Diligence Checklist:**
□ Real identity verified
□ Professional background checked
□ Social media presence reviewed
□ No involvement in scams
□ Relevant experience
□ Active community engagement
□ Transparent communication

For project "{project_name}", ensure you:
• Research all key team members
• Verify advisor relationships
• Check for fake team members
• Look for team token allocations
• Assess long-term commitment
"""
        
        return response
        
    except Exception as e:
        return f"Error researching founder: {str(e)}"

# Create the tool
founder_info_tool = Tool(
    name="founder_research",
    func=research_founder,
    description="Research founder and team credibility, background, and track record"
)
