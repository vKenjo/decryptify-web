"""
Enhanced function for finding related cryptocurrency projects and founders
"""
import os
import re
import requests
from typing import List, Optional
from langchain.llms.base import LLM

def find_related_projects(project_name: str, llm: Optional[LLM] = None) -> List[str]:
    """
    Find related cryptocurrency projects and founders based on multiple data sources:
    - CoinGecko API for real-time project data
    - Founder and project info analysis
    - LLM-based relationships when other methods fail
    """
    related = []
    
    # 1. Try to get data from CoinGecko API first
    try:
        # Get CoinGecko API key if available
        api_key = os.getenv("COINGECKO_API_KEY", "")
        api_url = "https://api.coingecko.com/api/v3"
        headers = {"x-cg-demo-api-key": api_key} if api_key else {}
        
        # Search for coin ID
        search_url = f"{api_url}/search"
        search_params = {"query": project_name}
        search_response = requests.get(search_url, params=search_params, headers=headers)
        search_data = search_response.json()
        
        if search_data.get("coins"):
            coin_id = search_data["coins"][0]["id"]
            
            # Get detailed coin data
            coin_url = f"{api_url}/coins/{coin_id}"
            coin_params = {
                "localization": "false",
                "tickers": "false",
                "market_data": "false",
                "community_data": "true",
                "developer_data": "false"
            }
            
            coin_response = requests.get(coin_url, params=coin_params, headers=headers)
            coin_data = coin_response.json()
            
            # Get categories for category-related projects
            if coin_data.get("categories"):
                categories = coin_data.get("categories", [])
                for category in categories[:2]:  # Limit to first 2 categories
                    related.append(f"Category: {category}")
                    
                # Try to get similar coins in the same category
                try:
                    category_url = f"{api_url}/coins/markets"
                    category_params = {
                        "vs_currency": "usd",
                        "category": categories[0].lower().replace(" ", "-") if categories else "",
                        "per_page": 5,
                        "page": 1
                    }
                    cat_response = requests.get(category_url, params=category_params, headers=headers)
                    cat_data = cat_response.json()
                    
                    for coin in cat_data:
                        if coin.get("id") != coin_id:  # Don't include the project itself
                            related.append(f"{coin.get('name')} (Same {categories[0]} category)")
                            break
                except Exception:
                    pass
            
            # Get blockchain platform if applicable
            if coin_data.get("asset_platform_id"):
                platform = coin_data.get("asset_platform_id")
                related.append(f"Built on {platform.title()}")
                
            # Get links data
            links = coin_data.get("links", {})
            
            # Get homepage for related projects
            if links.get("homepage") and links.get("homepage")[0]:
                domain = links.get("homepage")[0].replace("http://", "").replace("https://", "").split('/')[0]
                related.append(f"Website: {domain}")
            
            # Get Twitter info
            if links.get("twitter_screen_name"):
                related.append(f"Twitter: @{links.get('twitter_screen_name')}")
    
    except Exception as e:
        # If CoinGecko fails, we'll fall back to other methods
        print(f"Error fetching CoinGecko data: {str(e)}")
    
    # 2. Use LLM as a fallback when needed
    if llm and (len(related) < 3):
        try:
            prompt = f"""
            Based on your knowledge, list 5 cryptocurrency projects that are related to {project_name}.
            For each one, include a very brief explanation of how they're related in parentheses.
            Format each as a single line like this: "Project Name (explanation of relationship)"
            Example: "Arbitrum (Ethereum L2 scaling solution)"
            """
            
            llm_response = llm.predict(prompt)
            
            # Extract projects from LLM response
            for line in llm_response.split('\n'):
                if line.strip() and "(" in line and ")" in line:
                    related.append(line.strip())
        except Exception as e:
            print(f"Error using LLM for related projects: {str(e)}")
    
    # 3. De-duplicate and limit results
    unique_related = []
    for item in related:
        if item not in unique_related:
            unique_related.append(item)
    
    return unique_related[:8]  # Limit to 8 unique items
