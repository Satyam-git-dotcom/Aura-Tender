import os
import google.generativeai as genai
from pydantic import BaseModel, Field
import json
from typing import List

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY", ""))

class Criterion(BaseModel):
    category: str = Field(description="Mandatory, Technical, or Financial")
    description: str = Field(description="The full text of the criterion")
    is_mandatory: bool = Field(description="Whether this criterion is an absolute requirement")

class TenderExtraction(BaseModel):
    criteria: List[Criterion]

def extract_tender_criteria(text: str) -> dict:
    if not os.getenv("GOOGLE_API_KEY"):
        # Mock response if no API key is present for the POC to run
        return {
            "criteria": [
                {"category": "Financial", "description": "Minimum turnover of Rs 5 Crores in the last 3 years.", "is_mandatory": True},
                {"category": "Technical", "description": "ISO 9001:2015 certification required.", "is_mandatory": True},
                {"category": "Mandatory", "description": "Earnest Money Deposit (EMD) of Rs 2 Lakhs.", "is_mandatory": True}
            ]
        }

    try:
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        prompt = f"""
        Extract all eligibility criteria from the following tender document text.
        Categorize each criterion as Mandatory, Technical, or Financial.
        Format the output strictly as JSON matching this schema:
        {{
            "criteria": [
                {{"category": "string", "description": "string", "is_mandatory": boolean}}
            ]
        }}
        
        Tender Document Text:
        {text}
        """
        
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error during extraction: {e}")
        return {"error": str(e), "criteria": []}
