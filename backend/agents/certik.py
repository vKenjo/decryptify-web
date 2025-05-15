"""
CertiK Agent - Analyzes smart contract security audits
"""
import requests
from typing import Dict, Any
from langchain.tools import Tool

# Note: CertiK API requires authentication. This is a mock implementation
# In production, you would need to integrate with the actual CertiK API

def get_certik_audit(project_name: str) -> str:
    """Get smart contract security audit information from CertiK"""
    try:
        # This is a mock implementation since CertiK API requires authentication
        # In a real implementation, you would make API calls to CertiK
        
        # Mock data for demonstration
        mock_audits = {
            "uniswap": {
                "security_score": 95,
                "audit_date": "2023-05-15",
                "vulnerabilities": {
                    "critical": 0,
                    "major": 0,
                    "medium": 1,
                    "minor": 3,
                    "informational": 5
                },
                "contract_verified": True,
                "key_findings": [
                    "Well-structured codebase with comprehensive testing",
                    "Minor gas optimization opportunities identified",
                    "All critical functions properly access-controlled"
                ]
            },
            "pancakeswap": {
                "security_score": 92,
                "audit_date": "2023-06-20",
                "vulnerabilities": {
                    "critical": 0,
                    "major": 0,
                    "medium": 2,
                    "minor": 4,
                    "informational": 8
                },
                "contract_verified": True,
                "key_findings": [
                    "Robust security implementation",
                    "Medium-severity reentrancy risk in staking contract (fixed)",
                    "Comprehensive event logging for transparency"
                ]
            }
        }
        
        # Check if we have mock data for this project
        project_key = project_name.lower().replace(" ", "")
        
        if project_key in mock_audits:
            audit = mock_audits[project_key]
            
            response = f"""
**CertiK Security Audit for {project_name}:**

🛡️ Security Score: {audit['security_score']}/100
📅 Audit Date: {audit['audit_date']}
✅ Contract Verified: {'Yes' if audit['contract_verified'] else 'No'}

**Vulnerability Summary:**
• Critical: {audit['vulnerabilities']['critical']}
• Major: {audit['vulnerabilities']['major']}
• Medium: {audit['vulnerabilities']['medium']}
• Minor: {audit['vulnerabilities']['minor']}
• Informational: {audit['vulnerabilities']['informational']}

**Key Findings:**
"""
            for finding in audit['key_findings']:
                response += f"• {finding}\n"
                
            response += """
**Security Assessment:**
"""
            if audit['security_score'] >= 90:
                response += "✅ EXCELLENT: This project demonstrates strong security practices with minimal vulnerabilities."
            elif audit['security_score'] >= 80:
                response += "✅ GOOD: Security is well-implemented with some minor issues to address."
            elif audit['security_score'] >= 70:
                response += "⚠️ FAIR: Several security concerns that should be addressed."
            else:
                response += "❌ POOR: Significant security vulnerabilities detected. High risk."
                
        else:
            # Provide general guidance when no audit is found
            response = f"""
**CertiK Security Audit for {project_name}:**

❌ No CertiK audit found for this project.

**Security Recommendations:**
1. Check if the project has been audited by other reputable firms
2. Review the smart contract code on Etherscan/BSCScan
3. Look for bug bounty programs
4. Check if the contracts are verified and open-source
5. Assess the project's security practices and transparency

**Red Flags:**
• Unaudited smart contracts
• Closed-source code
• No bug bounty program
• Recent deployment with no security track record
• Upgradeable contracts without proper governance

**Alternative Security Resources:**
• OpenZeppelin audits
• Trail of Bits audits
• Quantstamp audits
• PeckShield audits
• Slowmist audits

Always prioritize projects with comprehensive security audits from reputable firms.
"""
        
        return response
        
    except Exception as e:
        return f"Error retrieving CertiK audit information: {str(e)}"

# Create the tool
certik_tool = Tool(
    name="certik_audit",
    func=get_certik_audit,
    description="Get smart contract security audit information from CertiK or provide security analysis"
)
