from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from services.extractor import extract_tender_criteria

# Load environment variables
load_dotenv()

app = FastAPI(title="Aura-Tender API", version="1.0.0")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for POC
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Aura-Tender API is running"}

@app.post("/api/extract-tender")
async def extract_tender(file: UploadFile = File(...)):
    if not file.filename.endswith('.txt'):
        # For the POC, we'll start with simple text files.
        # In full version, this would handle PDF/Images using Gemini Multimodal.
        raise HTTPException(status_code=400, detail="Only .txt files are supported for this basic POC step.")
    
    content = await file.read()
    text_content = content.decode('utf-8')
    
    extracted_data = extract_tender_criteria(text_content)
    
    return {"filename": file.filename, "extraction": extracted_data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
