"""
Project Info Agent - Gathers comprehensive project information
"""
from typing import Dict, List
from langchain.tools import Tool
import re

# Mock project database (in production, this would aggregate from multiple sources)
PROJECT_DATABASE = {
    "ethereum": {
        "name": "Ethereum",
        "category": "Platform",
        "description": "Decentralized platform for smart contracts and dApps",
        "founded": 2015,
        "mainnet_launch": "July 30, 2015",
        "consensus": "Proof of Stake (previously Proof of Work)",
        "token": "ETH",
        "use_cases": [
            "Smart contract platform",
            "DeFi applications",
            "NFT marketplace",
            "DAOs",
            "Layer 2 scaling solutions"
        ],
        "technology": {
            "programming_language": "Solidity",
            "vm": "Ethereum Virtual Machine (EVM)",
            "tps": "15-30 (L1), 2000+ (L2)",
            "block_time": "12 seconds"
        },
        "ecosystem": {
            "dapps": "3000+",
            "developers": "200,000+",
            "wallets": "MetaMask, Trust Wallet, Ledger"
        },
        "partnerships": [
            "Microsoft",
            "JP Morgan",
            "ConsenSys",
            "Enterprise Ethereum Alliance"
        ],
        "roadmap": [
            "Shanghai upgrade (completed)",
            "Cancun-Deneb upgrade",
            "Sharding implementation",
            "Further scaling improvements"
        ],
        "github": "https://github.com/ethereum",
        "website": "https://ethereum.org"
    },
    "chainlink": {
        "name": "Chainlink",
        "category": "Oracle Network",
        "description": "Decentralized oracle network providing real-world data to smart contracts",
        "founded": 2017,
        "mainnet_launch": "May 30, 2019",
        "consensus": "N/A (Oracle Network)",
        "token": "LINK",
        "use_cases": [
            "Price feeds for DeFi",
            "VRF for gaming",
            "Proof of Reserve",
            "Cross-chain communication",
            "External API data"
        ],
        "technology": {
            "programming_language": "Go, Solidity",
            "architecture": "Decentralized Oracle Network",
            "integrations": "100+ blockchains",
            "data_providers": "Premium data providers"
        },
        "ecosystem": {
            "integrations": "1000+",
            "secured_value": "$75+ billion",
            "node_operators": "100+"
        },
        "partnerships": [
            "Google Cloud",
            "Oracle",
            "SWIFT",
            "Associated Press"
        ],
        "roadmap": [
            "CCIP expansion",
            "Staking v0.2",
            "Economics 2.0",
            "Cross-chain bridges"
        ],
        "github": "https://github.com/smartcontractkit/chainlink",
        "website": "https://chain.link"
    }
}

def gather_project_info(project_name: str) -> str:
    """Gather comprehensive information about a cryptocurrency project"""
    try:
        # Normalize project name
        project_key = project_name.lower().replace(" ", "")
        
        # Check if we have data for this project
        if project_key in PROJECT_DATABASE:
            project = PROJECT_DATABASE[project_key]
            
            response = f"""
**Project Analysis: {project['name']}**

📋 Category: {project['category']}
📅 Founded: {project['founded']}
🚀 Mainnet Launch: {project['mainnet_launch']}
🔐 Consensus: {project['consensus']}
🪙 Token: {project['token']}

**Description:**
{project['description']}

**Use Cases:**
"""
            for use_case in project['use_cases']:
                response += f"• {use_case}\n"
            
            response += "\n**Technology Stack:**\n"
            for key, value in project['technology'].items():
                response += f"• {key.replace('_', ' ').title()}: {value}\n"
            
            response += "\n**Ecosystem:**\n"
            for key, value in project['ecosystem'].items():
                response += f"• {key.replace('_', ' ').title()}: {value}\n"
            
            response += "\n**Key Partnerships:**\n"
            for partner in project['partnerships']:
                response += f"• {partner}\n"
            
            response += "\n**Roadmap:**\n"
            for milestone in project['roadmap']:
                response += f"• {milestone}\n"
            
            response += f"""
**Resources:**
• GitHub: {project['github']}
• Website: {project['website']}

**Project Assessment:**
"""
            # Simple assessment based on available data
            if len(project['partnerships']) > 3 and int(project['ecosystem'].get('dapps', '0').replace('+', '')) > 100:
                response += "✅ ESTABLISHED: Mature project with strong ecosystem and partnerships"
            elif project['mainnet_launch'] and len(project['use_cases']) > 2:
                response += "✅ DEVELOPING: Active project with clear use cases and growing adoption"
            else:
                response += "⚠️ EARLY STAGE: Project still in development phase"
                
        else:
            # Provide guidance for unknown projects
            response = f"""
**Project Analysis: {project_name}**

❓ No specific data available for this project.

**How to Research Crypto Projects:**

1. **Fundamental Analysis**
   • Whitepaper review
   • Technology assessment
   • Use case validation
   • Token economics
   • Team background

2. **Technical Evaluation**
   • GitHub activity
   • Code quality
   • Security audits
   • Testnet performance
   • Mainnet status

3. **Ecosystem Assessment**
   • Developer activity
   • DApp ecosystem
   • User adoption
   • Partnership quality
   • Community size

4. **Red Flags to Avoid:**
   • No whitepaper or technical documentation
   • Closed-source code
   • No clear use case
   • Unrealistic promises
   • Anonymous team
   • No development activity
   • Fake partnerships

5. **Key Questions to Ask:**
   • What problem does it solve?
   • Is the technology innovative?
   • Who are the competitors?
   • What's the token utility?
   • Is there real adoption?
   • What's the development roadmap?

**Research Checklist:**
□ Whitepaper thoroughly reviewed
□ Team verified and experienced
□ Technology validated
□ Use case makes sense
□ Tokenomics sustainable
□ Active development
□ Community engagement
□ Partnerships verified
□ Security audits completed
□ Regulatory compliance

**Information Sources:**
• Official website and documentation
• GitHub repository
• CoinGecko/CoinMarketCap
• Crypto news sites
• Reddit/Discord communities
• YouTube reviews (be cautious)
• LinkedIn profiles
• Medium articles
"""
        
        return response
        
    except Exception as e:
        return f"Error gathering project information: {str(e)}"

# Create the tool
project_info_tool = Tool(
    name="project_research",
    func=gather_project_info,
    description="Gather comprehensive information about cryptocurrency projects including technology, use cases, partnerships, and roadmap"
)
