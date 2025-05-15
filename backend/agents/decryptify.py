from typing import Dict, List, Optional
from langchain.tools import Tool
from langchain.agents import create_react_agent
from langchain.llms.base import LLM
from langchain.prompts import PromptTemplate

# Import all other agents
from .coin_info import coin_info_tool
from .crypto_scam import crypto_scam_tool
from .certik import certik_tool
from .chainbroker import chainbroker_tool
from .founder_info import founder_info_tool
from .project_info import project_info_tool
from .related_projects import find_related_projects

def decryptify_analysis(query: str, llm: Optional[LLM] = None) -> str:
    """
    Main Decryptify orchestrator that coordinates all agents to provide comprehensive trust assessment
    """
    try:
        # Parse the query to extract project/coin name
        project_name = query.strip()
        
        # Initialize response sections
        sections = {
            "market_data": "",
            "scam_analysis": "",
            "security_audit": "",
            "exchange_analysis": "",
            "founder_analysis": "",
            "project_analysis": "",
            "related_projects": []
        }
        
        # 1. Get market data
        try:
            sections["market_data"] = coin_info_tool.func(project_name)
        except Exception as e:
            sections["market_data"] = f"Market data unavailable: {str(e)}"
        
        # 2. Perform scam analysis
        try:
            sections["scam_analysis"] = crypto_scam_tool.func(project_name)
        except Exception as e:
            sections["scam_analysis"] = f"Scam analysis unavailable: {str(e)}"
        
        # 3. Check security audits
        try:
            sections["security_audit"] = certik_tool.func(project_name)
        except Exception as e:
            sections["security_audit"] = f"Security audit unavailable: {str(e)}"
        
        # 4. Analyze exchanges (if applicable)
        try:
            if "exchange" in project_name.lower() or "binance" in project_name.lower() or "coinbase" in project_name.lower():
                sections["exchange_analysis"] = chainbroker_tool.func(project_name)
            else:
                sections["exchange_analysis"] = "Not an exchange - skipping exchange analysis"
        except Exception as e:
            sections["exchange_analysis"] = f"Exchange analysis unavailable: {str(e)}"
        
        # 5. Research founders
        try:
            sections["founder_analysis"] = founder_info_tool.func(project_name)
        except Exception as e:
            sections["founder_analysis"] = f"Founder analysis unavailable: {str(e)}"
        
        # 6. Gather project information
        try:
            sections["project_analysis"] = project_info_tool.func(project_name)
        except Exception as e:
            sections["project_analysis"] = f"Project analysis unavailable: {str(e)}"
        
        # 7. Find related projects/founders using the dedicated function (passing the LLM)
        try:
            sections["related_projects"] = find_related_projects(project_name, llm)
        except Exception as e:
            print(f"Error finding related projects: {str(e)}")
            sections["related_projects"] = []
        
        # 8. Let the LLM calculate the trust score
        trust_score = "Not available"
        if llm:
            try:
                # Combine all analysis for trust score calculation with LLM
                combined_analysis = f"""
                Market Data: {sections['market_data']}
                Scam Analysis: {sections['scam_analysis']}
                Security Audit: {sections['security_audit']}
                Founder Analysis: {sections['founder_analysis']}
                Project Analysis: {sections['project_analysis']}
                """
                
                # Prompt the LLM to calculate a trust score
                trust_prompt = f"""
                Based on the following analysis of the cryptocurrency project {project_name}, 
                calculate a trust score from 0-10 and provide a brief explanation.
                Higher scores indicate higher trustworthiness. Consider security, tokenomics,
                team credibility, code audits, and other risk factors.
                
                {combined_analysis}
                
                Return only a trust score section in this format:
                Overall Trust Score: [SCORE]/10
                Trust Level: [HIGH/MEDIUM/LOW]
                [Brief explanation of the score in 2-3 sentences]
                """
                
                trust_score = llm.predict(trust_prompt)
            except Exception as e:
                trust_score = f"Trust score calculation failed: {str(e)}"
        
        # Format the comprehensive response with simplified structure
        response = f"""
            # DECRYPTIFY ANALYSIS: {project_name.upper()}

            {trust_score}

            ---

            ## MARKET DATA & METRICS
            {sections['market_data']}

            ---

            ## SCAM RISK ASSESSMENT
            {sections['scam_analysis']}

            ---

            ## SECURITY AUDIT STATUS
            {sections['security_audit']}

            ---

            ## EXCHANGE ANALYSIS
            {sections['exchange_analysis']}

            ---

            ## FOUNDER & TEAM ANALYSIS
            {sections['founder_analysis']}

            ---

            ## PROJECT INFORMATION
            {sections['project_analysis']}

            ---

            ## RELATED PROJECTS
            """
        
        if sections["related_projects"]:
            for related in sections["related_projects"]:
                response += f"\n• {related}"
        else:
            response += "\nNo directly related projects identified."
        
        response += """

            ---

            ## KEY TAKEAWAYS

            1. Consider all factors before investing
            2. Always do your own research
            3. Evaluate based on your investment timeline
            4. Match investment to your risk profile

            ---

            DISCLAIMER: This analysis is for informational purposes only and should not be considered financial advice. Cryptocurrency investments carry significant risk.

            *Analysis by Decryptify AI*
        """
        
        return response
    except Exception as e:
        return f"Error performing Decryptify analysis: {str(e)}"

# Create the tool
decryptify_tool = Tool(
    name="decryptify_orchestrator",
    func=decryptify_analysis,
    description="Main Decryptify orchestrator that coordinates all agents to provide comprehensive crypto trust assessment, metrics, and related projects"
)