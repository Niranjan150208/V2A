import React, { useState } from "react";
import {
  HelpCircle,
  Send,
  CheckCircle2,
  Phone,
  Star,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const ExpertAdvicePage: React.FC = () => {
  const { language, navigate, triggerRefresh } = useNavigation();
  const state = AppStore.getState();

  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("Pest & Disease Control");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pendingRequests = state.expertRequests.filter((req) => req.status === "Pending Review");
  const answeredRequests = state.expertRequests.filter((req) => req.status === "Answered");
  const formatTimestamp = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    setIsSubmitting(true);
    setTimeout(() => {
      AppStore.addExpertRequest({
        farmerId: state.farmer.id,
        seasonId: state.activeSeasonId,
        expertName: "Dr. M. Soundararajan, Ph.D. (Agronomy)",
        institution:
          "Tamil Nadu Agricultural University (TNAU) Soil & Water Centre",
        topic,
        question,
        status: "Pending Review",
        date: new Date().toISOString(),
      });

      setIsSubmitting(false);
      setQuestion("");
      triggerRefresh();
      alert(
        language === "ta"
          ? "உங்கள் கேள்வி TNAU வேளாண் விஞ்ஞானிகளுக்கு சமர்ப்பிக்கப்பட்டது."
          : "Your inquiry has been submitted to TNAU Agronomy Scientists.",
      );
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "விஞ்ஞானிகள் நேரடி ஆலோசனை"
                : "Agronomist & Scientist Advisory Desk"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "KVK & TNAU வேளாண் விஞ்ஞானியிடம் கேளுங்கள்"
              : "Ask ICAR-KVK & TNAU Agronomists"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம் மற்றும் வேளாண் அறிவியல் நிலைய நிபுணர்கள்"
              : "Direct two-way advisory channel linking delta farmers with certified plant pathologists"}
          </p>
        </div>

        <button
          onClick={() => navigate("/crop-doctor")}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === "ta" ? "AI பயிர் மருத்துவர்" : "AI Crop Doctor"}
        </button>
      </div>

      {/* Query Submission Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-lg text-forest-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-paddy-600" />
          <span>
            {language === "ta"
              ? "புதிய கேள்வியை சமர்ப்பிக்கவும்"
              : "Post an Agricultural Inquiry"}
          </span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">
                Inquiry Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
              >
                <option value="Pest & Disease Control">
                  Pest & Disease Control (பூச்சி & நோய்)
                </option>
                <option value="Nutrient Deficiency">
                  Soil Nutrient Deficiency (ஊட்டச்சத்து குறைபாடு)
                </option>
                <option value="Water & Salinity Management">
                  Water & Salinity Management (நீர் & உவர்த்தன்மை)
                </option>
                <option value="Next Season Crop Rotation">
                  Next Season Crop Rotation (பயிர் சுழற்சி)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">
                Target Crop / Plot
              </label>
              <input
                type="text"
                disabled
                value="Paddy (CR 1009 Sub 1) • Keezha Theru Vayal (3.5 Acres)"
                className="w-full p-2.5 bg-cream-100 border border-sage-300 rounded-xl text-xs font-bold text-forest-900 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-700 mb-1">
              Your Detailed Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows={3}
              placeholder={
                language === "ta"
                  ? "உங்கள் கேள்வியை தமிழில் அல்லது ஆங்கிலத்தில் எழுதலாம்..."
                  : "Type your question clearly. Photos from Crop Doctor will automatically be attached."
              }
              className="w-full p-3 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold text-ink-900"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all"
            >
              <Send className="w-4 h-4 text-harvest-400" />
              <span>
                {isSubmitting
                  ? "Submitting..."
                  : language === "ta"
                    ? "கேள்வி அனுப்ப"
                    : "Submit to Agronomist"}
              </span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-4">
          <h3 className="font-display font-bold text-lg text-forest-900">
            {language === "ta" ? "நிலுவையில் உள்ள ஆலோசனைகள்" : "Pending Consultations"} ({pendingRequests.length})
          </h3>
          {pendingRequests.length === 0 ? <p className="text-xs text-ink-500">No pending consultation requests.</p> : pendingRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-2xl border border-harvest-300 bg-harvest-50 space-y-2">
              <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase text-paddy-700">{req.topic}</span><span className="text-[10px] font-bold text-harvest-800">Pending Review</span></div>
              <p className="text-xs font-bold text-forest-900">{req.question}</p>
              <p className="text-[10px] text-ink-500">Submitted: {formatTimestamp(req.date)}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-4">
          <h3 className="font-display font-bold text-lg text-forest-900">
            {language === "ta" ? "பதிலளிக்கப்பட்ட ஆலோசனைகள்" : "Answered Consultations"} ({answeredRequests.length})
          </h3>
          {answeredRequests.length === 0 ? <p className="text-xs text-ink-500">No answered consultation requests yet.</p> : answeredRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-2xl border border-sage-300 bg-cream-50 space-y-2">
              <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase text-paddy-700">{req.topic}</span><span className="text-[10px] font-bold text-paddy-800">Answered</span></div>
              <p className="text-xs font-bold text-forest-900">{req.question}</p>
              {req.answer && <p className="text-xs text-forest-900 leading-relaxed">“{req.answer}”</p>}
              <p className="text-[10px] text-ink-500">Submitted: {formatTimestamp(req.date)} • Expert: {req.expertName}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
