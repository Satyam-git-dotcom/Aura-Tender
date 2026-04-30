import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    
    setLoading(true);
    setResults(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/extract-tender", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      setResults(data.extraction);
    } catch (error) {
      console.error("Extraction failed", error);
      alert("Failed to connect to backend API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 md:p-12">
      {/* Header */}
      <header className="mb-12 border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={32} />
            Aura-Tender
          </h1>
          <p className="text-slate-400 mt-2 text-sm">AI-Powered Eligibility Extraction & Evaluation</p>
        </div>
        <div className="text-xs px-3 py-1 bg-slate-800 rounded-full text-slate-300 border border-slate-700">
          POC Environment
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="text-blue-400" size={20} />
              Tender Ingestion
            </h2>
            
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:bg-slate-800/50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept=".txt"
                onChange={handleFileChange}
              />
              <Upload className="mx-auto text-slate-500 mb-3" size={32} />
              <p className="text-sm text-slate-400">
                {file ? <span className="text-emerald-400 font-medium">{file.name}</span> : "Drag & drop tender document (.txt)"}
              </p>
            </div>

            <button 
              onClick={handleExtract}
              disabled={!file || loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Extract Criteria"}
            </button>
          </div>
        </div>

        {/* Right Column: Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="h-64 flex flex-col items-center justify-center border border-slate-800 rounded-xl bg-slate-900/50">
              <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
              <p className="text-slate-400 animate-pulse">Running Multimodal Analysis...</p>
            </div>
          )}

          {!loading && !results && (
            <div className="h-64 flex items-center justify-center border border-slate-800 rounded-xl bg-slate-900/30 border-dashed">
              <p className="text-slate-500 text-sm">Upload a document to view extracted criteria</p>
            </div>
          )}

          {!loading && results && results.criteria && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Extracted Eligibility Criteria</h2>
              
              <div className="grid gap-4">
                {results.criteria.map((crit, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex items-start gap-4 hover:border-slate-700 transition-colors">
                    <div className="mt-1">
                      {crit.category === 'Mandatory' && <AlertTriangle className="text-rose-400" size={24} />}
                      {crit.category === 'Technical' && <CheckCircle className="text-blue-400" size={24} />}
                      {crit.category === 'Financial' && <ShieldCheck className="text-amber-400" size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md
                          ${crit.category === 'Mandatory' ? 'bg-rose-500/10 text-rose-400' : ''}
                          ${crit.category === 'Technical' ? 'bg-blue-500/10 text-blue-400' : ''}
                          ${crit.category === 'Financial' ? 'bg-amber-500/10 text-amber-400' : ''}
                        `}>
                          {crit.category}
                        </span>
                        {crit.is_mandatory && <span className="text-xs text-rose-500 font-semibold">• Strict Compliance</span>}
                      </div>
                      <p className="text-slate-200 mt-2">{crit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
