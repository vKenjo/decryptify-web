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
                Reason: [1-2 sentence explanation]                """
                
                response = llm.invoke(trust_prompt)
                # Extract content based on the return type (could be message object or string)
                if hasattr(response, 'content'):
                    trust_score = response.content
                else:
                    trust_score = str(response)
            except Exception as e:
                trust_score = f"Trust score calculation failed: {str(e)}"
        
        # Extract current price from market data
        current_price = "Not available"
        market_cap = "Not available"
        try:
            import re
            price_match = re.search(r'Price: \$([\d,\.]+)', sections['market_data'])
            if price_match:
                current_price = f"${price_match.group(1)}"
            
            mcap_match = re.search(r'Market Cap: \$([\d,\.]+\w?)', sections['market_data'])
            if mcap_match:
                market_cap = f"${mcap_match.group(1)}"
        except Exception:
            pass

        # Extract founder info - just the basics
        founder_info = "No founder information available"
        try:
            # Try to extract just the key founder information
            founder_section = sections['founder_analysis'].split('\n')
            for i, line in enumerate(founder_section):
                if "Founder" in line or "Team" in line or "CEO" in line:
                    founder_info = '\n'.join(founder_section[i:i+3])
                    break
        except Exception:
            pass
          # Extract trust level
        trust_level = "UNKNOWN"
        if "Trust Level:" in trust_score:
            trust_level = trust_score.split("Trust Level:")[1].split("\n")[0].strip()
          # Extract reasoning
        reasoning = "Analysis based on market data, security audits, and project history."
        if "Reason:" in trust_score:
            reasoning = trust_score.split("Reason:")[1].strip()
            
        # Format a simplified concise response with separate string parts to avoid backslash issues
        project_remark = ""
        scam_remark = ""
        try:
            project_lines = sections['project_analysis'].split("\n")
            if project_lines and len(project_lines) > 0:
                project_remark = project_lines[0].strip()
        except:
            project_remark = "No project data available"
            
        try:
            scam_lines = sections['scam_analysis'].split("\n")
            if scam_lines and len(scam_lines) > 0:
                scam_remark = scam_lines[0].strip()
        except:
            scam_remark = "No scam analysis available"
        
        # Build response without problematic string operations
        trust_score_value = "N/A"
        if 'Overall Trust Score:' in trust_score:
            parts = trust_score.split('Overall Trust Score:')
            if len(parts) > 1:
                score_line = parts[1].split("\n")[0].strip()
                trust_score_value = score_line
        
        response = (f"{project_name.upper()}\n\n"
                   f"Trust Score: {trust_score_value} ({trust_level})\n"
                   f"Current Price: {current_price}\n"
                   f"Market Cap: {market_cap}\n\n"
                   f"Founder: {founder_info}\n\n"
                   f"Key Remarks:\n"
                   f"- {project_remark}\n"
                   f"- {scam_remark}\n\n"
                   f"Reasoning: {reasoning}")
        
        return response
    except Exception as e:
        return f"Error performing Decryptify analysis: {str(e)}"

# Create the tool
decryptify_tool = Tool(
    name="decryptify_orchestrator",
    func=decryptify_analysis,
    description="Main Decryptify orchestrator that coordinates all agents to provide comprehensive crypto trust assessment, metrics, and related projects"
)