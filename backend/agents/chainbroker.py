"""
ChainBroker Agent - Analyzes cryptocurrency broker and exchange reliability
"""
from typing import Dict, List
from langchain.tools import Tool

# Mock data for exchanges (in production, this would connect to real APIs)
EXCHANGE_DATA = {
    "binance": {
        "name": "Binance",
        "trust_score": 9.5,
        "volume_24h": 15000000000,
        "established": 2017,
        "regulation": ["Malta", "Japan", "UK FCA"],
        "security_features": ["2FA", "Cold Storage", "SAFU Fund", "Whitelisting"],
        "user_rating": 4.5,
        "fees": {"maker": 0.1, "taker": 0.1},
        "supported_coins": 350,
        "incidents": ["2019 hack - 7000 BTC stolen, fully compensated users"]
    },
    "coinbase": {
        "name": "Coinbase",
        "trust_score": 9.8,
        "volume_24h": 8000000000,
        "established": 2012,
        "regulation": ["USA", "UK", "EU", "Japan"],
        "security_features": ["2FA", "Cold Storage", "Insurance", "Biometric Auth"],
        "user_rating": 4.3,
        "fees": {"maker": 0.5, "taker": 0.5},
        "supported_coins": 200,
        "incidents": ["No major security breaches"]
    },
    "kucoin": {
        "name": "KuCoin",
        "trust_score": 7.5,
        "volume_24h": 2000000000,
        "established": 2017,
        "regulation": ["Seychelles"],
        "security_features": ["2FA", "Cold Storage", "Trading Password"],
        "user_rating": 4.0,
        "fees": {"maker": 0.1, "taker": 0.1},
        "supported_coins": 600,
        "incidents": ["2020 hack - $280M stolen, insurance fund covered losses"]
    }
}

def analyze_exchange(exchange_name: str) -> str:
    """Analyze cryptocurrency exchange or broker reliability and trustworthiness"""
    try:
        # Normalize exchange name
        exchange_key = exchange_name.lower().replace(" ", "")
        
        # Check if we have data for this exchange
        if exchange_key in EXCHANGE_DATA:
            exchange = EXCHANGE_DATA[exchange_key]
            
            # Calculate risk assessment
            risk_factors = []
            trust_score = exchange["trust_score"]
            
            if trust_score < 7:
                risk_factors.append("Low trust score")
            if exchange["established"] > 2018:
                risk_factors.append("Relatively new exchange")
            if len(exchange["regulation"]) < 2:
                risk_factors.append("Limited regulatory compliance")
            if exchange["incidents"]:
                risk_factors.append("History of security incidents")
            
            risk_level = "Low" if trust_score >= 8 else "Medium" if trust_score >= 6 else "High"
            
            response = f"""
**Exchange Analysis: {exchange['name']}**

📊 Trust Score: {exchange['trust_score']}/10
💼 Established: {exchange['established']}
📈 24h Volume: ${exchange['volume_24h']:,.0f}
🪙 Supported Coins: {exchange['supported_coins']}
⭐ User Rating: {exchange['user_rating']}/5

**Regulatory Compliance:**
"""
            for reg in exchange['regulation']:
                response += f"• {reg}\n"
            
            response += "\n**Security Features:**\n"
            for feature in exchange['security_features']:
                response += f"• {feature}\n"
            
            response += f"""
**Trading Fees:**
• Maker: {exchange['fees']['maker']}%
• Taker: {exchange['fees']['taker']}%

**Security History:**
"""
            if exchange['incidents']:
                for incident in exchange['incidents']:
                    response += f"• {incident}\n"
            else:
                response += "• No major security incidents reported\n"
            
            response += f"""
**Risk Assessment: {risk_level} Risk**
"""
            if risk_factors:
                response += "Risk Factors:\n"
                for factor in risk_factors:
                    response += f"• {factor}\n"
            else:
                response += "• No significant risk factors identified\n"
            
            response += "\n**Recommendation:**\n"
            if trust_score >= 8:
                response += "✅ RECOMMENDED: This exchange has a strong reputation and security track record."
            elif trust_score >= 6:
                response += "⚠️ USE WITH CAUTION: Some risk factors present. Enable all security features."
            else:
                response += "❌ HIGH RISK: Consider using more established exchanges."
                
        else:
            response = f"""
**Exchange Analysis: {exchange_name}**

❓ No detailed data available for this exchange.

**General Exchange Evaluation Criteria:**

1. **Regulatory Compliance**
   • Check if licensed in major jurisdictions
   • Verify compliance with KYC/AML requirements
   • Look for financial audits

2. **Security Features**
   • Two-factor authentication (2FA)
   • Cold storage for majority of funds
   • Insurance coverage
   • Regular security audits

3. **Track Record**
   • Years in operation (prefer 3+ years)
   • History of hacks or security breaches
   • How incidents were handled
   • User compensation policies

4. **Trading Volume & Liquidity**
   • Higher volume generally means better liquidity
   • Check 24h trading volume
   • Number of trading pairs

5. **User Reviews**
   • Check multiple review platforms
   • Look for consistent complaints
   • Customer support responsiveness

**Red Flags to Avoid:**
• No regulatory licenses
• Anonymous team
• No physical address
• Poor security features
• Many unresolved complaints
• Unusually high returns promised
• Withdrawal restrictions

**Recommended Established Exchanges:**
• Binance (largest by volume)
• Coinbase (US-regulated)
• Kraken (strong security)
• Bitfinex (high liquidity)
• Huobi (Asian markets)
"""
        
        return response
        
    except Exception as e:
        return f"Error analyzing exchange: {str(e)}"

# Create the tool
chainbroker_tool = Tool(
    name="chainbroker",
    func=analyze_exchange,
    description="Analyze cryptocurrency exchanges and brokers for reliability, security, and trustworthiness"
)
