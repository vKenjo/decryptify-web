"""
Coin Info Agent - Provides cryptocurrency market data and analysis
"""
import os
import requests
from typing import Dict, Any
from langchain.tools import Tool

COINGECKO_API_KEY = os.getenv("COINGECKO_API_KEY")
COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

def get_coin_info(coin_name: str) -> str:
    """Get comprehensive cryptocurrency market data and information"""
    try:
        # Search for coin ID
        search_url = f"{COINGECKO_API_URL}/search"
        search_params = {"query": coin_name}
        headers = {"x-cg-demo-api-key": COINGECKO_API_KEY} if COINGECKO_API_KEY else {}
        
        search_response = requests.get(search_url, params=search_params, headers=headers)
        search_data = search_response.json()
        
        if not search_data.get("coins"):
            return f"No cryptocurrency found with name '{coin_name}'"
        
        coin_id = search_data["coins"][0]["id"]
        coin_symbol = search_data["coins"][0]["symbol"]
        
        # Get detailed coin data
        coin_url = f"{COINGECKO_API_URL}/coins/{coin_id}"
        coin_params = {
            "localization": "false",
            "tickers": "false",
            "market_data": "true",
            "community_data": "true",
            "developer_data": "true",
            "sparkline": "false"
        }
        
        coin_response = requests.get(coin_url, params=coin_params, headers=headers)
        coin_data = coin_response.json()
        
        # Extract relevant information
        market_data = coin_data.get("market_data", {})
        
        info = {
            "name": coin_data.get("name"),
            "symbol": coin_symbol.upper(),
            "current_price": market_data.get("current_price", {}).get("usd"),
            "market_cap": market_data.get("market_cap", {}).get("usd"),
            "market_cap_rank": coin_data.get("market_cap_rank"),
            "total_volume": market_data.get("total_volume", {}).get("usd"),
            "price_change_24h": market_data.get("price_change_percentage_24h"),
            "price_change_7d": market_data.get("price_change_percentage_7d"),
            "price_change_30d": market_data.get("price_change_percentage_30d"),
            "all_time_high": market_data.get("ath", {}).get("usd"),
            "all_time_low": market_data.get("atl", {}).get("usd"),
            "total_supply": market_data.get("total_supply"),
            "circulating_supply": market_data.get("circulating_supply"),
            "description": coin_data.get("description", {}).get("en", "")[:500],
            "website": coin_data.get("links", {}).get("homepage", [""])[0],
            "whitepaper": coin_data.get("links", {}).get("whitepaper"),
            "github": coin_data.get("links", {}).get("repos_url", {}).get("github", [""])[0] if coin_data.get("links", {}).get("repos_url") else "",
            "twitter": coin_data.get("links", {}).get("twitter_screen_name"),
            "reddit": coin_data.get("links", {}).get("subreddit_url"),
        }
        
        # Format response
        response = f"""
**{info['name']} ({info['symbol']}) Market Data:**

🏆 Market Cap Rank: #{info['market_cap_rank']}
💰 Current Price: ${info['current_price']:,.2f} USD
📊 Market Cap: ${info['market_cap']:,.0f} USD
📈 24h Volume: ${info['total_volume']:,.0f} USD

**Price Changes:**
• 24h: {info['price_change_24h']:.2f}%
• 7d: {info['price_change_7d']:.2f}%
• 30d: {info['price_change_30d']:.2f}%

**Supply Information:**
• Circulating Supply: {info['circulating_supply']:,.0f} {info['symbol']}
• Total Supply: {info['total_supply']:,.0f} {info['symbol']} if info['total_supply'] else 'N/A'

**Historical Data:**
• All-Time High: ${info['all_time_high']:,.2f}
• All-Time Low: ${info['all_time_low']:,.2f}

**Project Links:**
• Website: {info['website']}
• Whitepaper: {info['whitepaper'] or 'Not available'}
• GitHub: {info['github'] or 'Not available'}
• Twitter: @{info['twitter'] if info['twitter'] else 'Not available'}
• Reddit: {info['reddit'] or 'Not available'}

**Description:**
{info['description'][:300]}...
"""
        return response
        
    except requests.exceptions.RequestException as e:
        return f"Error fetching coin data: {str(e)}"
    except Exception as e:
        return f"Error processing coin information: {str(e)}"

# Create the tool
coin_info_tool = Tool(
    name="coin_info",
    func=get_coin_info,
    description="Get comprehensive cryptocurrency market data including price, market cap, volume, supply, and project information"
)
