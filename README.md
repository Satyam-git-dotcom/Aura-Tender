# Aura-Tender: AI-Based Tender Evaluation Platform

## Executive Summary
Government procurement processes, particularly within the **Central Reserve Police Force (CRPF)**, are governed by stringent compliance standards (GFR 2017) and complex "Two-Bid" systems. The current manual evaluation of bidder eligibility is a bottleneck—prone to human error, inconsistency, and audit risks.

**Aura-Tender** is an AI-driven platform that automates the extraction of eligibility criteria and the evaluation of bidder submissions. By utilizing **Native Multimodal Large Language Models (LLMs)**, Aura-Tender can "read" scanned documents, stamps, and signatures directly, ensuring that no technicality is missed. The platform provides a transparent, explainable, and auditable trail for every decision, empowering procurement officers to make faster, more confident awards.

## Key Features
- **Zero-Shot Extraction**: Automatically extracts and categorizes mandatory, technical, and financial criteria from Tender Enquiry (TE) documents.
- **Constraint Modeling**: Converts human-readable text into mathematically validatable schemas.
- **Multimodal Parsing**: Uses Gemini 1.5 Pro to process bids as images, understanding both text and spatial context (like stamps and signatures) that traditional OCR misses.
- **Explainable Evaluation**: Generates criterion-level verdicts (Eligible, Not Eligible, Needs Review) with pinpointed evidence bounding boxes and direct source links.
- **Military-Grade Dashboard**: React-based UI providing officers with side-by-side verification to approve or override AI decisions.

## Architecture & Tech Stack
- **Backend**: Python, FastAPI, Uvicorn, Pydantic
- **AI/ML Engine**: Google Generative AI (Gemini 1.5 Pro Multimodal)
- **Frontend**: React 19, Vite, TailwindCSS, Lucide React
- **Proposed Additions**: LangGraph (Orchestration), ChromaDB/Pinecone (Vector DB)

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your `.env` file with your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run the FastAPI development server:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```

## Workflow (Two-Bid System)
1. **Phase A: Understanding the Tender**: The system ingests the TE document and generates a schema of all necessary criteria.
2. **Phase B: Understanding the Bidder**: Bidders upload their documents. The multimodal parser searches the digital folder to extract relevant evidence.
3. **Phase C: Evaluation & Explainability**: The system cross-references the bidder's evidence against the tender criteria and presents a consolidated report to the procurement officer.

## Security & Governance
- **No "Silent Disqualification"**: Documents with low confidence or ambiguity are flagged for human review.
- **Auditability**: Every AI decision is logged with the prompt, reasoning chain, and document hash for legal defensibility.

---
*Developed for the CRPF Hackathon*
