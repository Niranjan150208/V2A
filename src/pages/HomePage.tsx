import React from "react";
import {
  Sprout,
  ShieldCheck,
  Wheat,
  CircleDollarSign,
  ArrowRight,
  Sparkles,
  Activity,
  Layers,
  ScrollText,
  Play,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

export const HomePage: React.FC = () => {
  const { navigate, language } = useNavigation();
  const cycleSteps = [
    {
      num: "01",
      title:
        language === "ta"
          ? "மண் பரிசோதனை & திட்டமிடல்"
          : "Soil Health & Crop Planning",
      desc:
        language === "ta"
          ? "மண் பரிசோதனை அட்டை அடிப்படையில் உகந்த பயிர் பரிந்துரை"
          : "Nutrient-based crop suitability advisory and budget projection",
      icon: Activity,
      route: "/crop-planner",
      color: "bg-paddy-600",
    },
    {
      num: "02",
      title: language === "ta" ? "டெமோ விதை பாஸ்போர்ட்" : "Seed Passport Demo",
      desc:
        language === "ta"
          ? "விதை தொகுதி விவரங்களை QR வழியாகக் காணும் முன்மாதிரி"
          : "Prototype QR lookup for sample seed-batch information",
      icon: ShieldCheck,
      route: "/seed-passport",
      color: "bg-terracotta-600",
    },
    {
      num: "03",
      title:
        language === "ta"
          ? "பண்ணை செயல்பாடுகள் & கூலி"
          : "Field Operations & Machinery",
      desc:
        language === "ta"
          ? "வாடகை இயந்திரங்கள் மற்றும் நடுவு கூலி ஆட்கள் முன்பதிவு"
          : "Custom hiring centers, automated transplanters, labour booking",
      icon: Calendar,
      route: "/farm-calendar",
      color: "bg-forest-700",
    },
    {
      num: "04",
      title:
        language === "ta"
          ? "பயிர் அறிகுறி ஆலோசனை டெமோ"
          : "Crop Symptom Advisory Demo",
      desc:
        language === "ta"
          ? "அறிகுறி உள்ளீட்டின் அடிப்படையில் மாதிரி ஆலோசனை"
          : "Sample symptom-guidance flow; not an image-based diagnosis service",
      icon: Sprout,
      route: "/crop-doctor",
      color: "bg-paddy-700",
    },
    {
      num: "05",
      title:
        language === "ta"
          ? "அறுவடை & போக்குவரத்து டெமோ"
          : "Harvest & Logistics Demo",
      desc:
        language === "ta"
          ? "மாதிரி அறுவடைப் பதிவுகள் மற்றும் சேவை பட்டியல்"
          : "Sample harvest records and local service listings",
      icon: Wheat,
      route: "/harvest",
      color: "bg-harvest-600",
    },
    {
      num: "06",
      title:
        language === "ta"
          ? "வாங்குபவர் சலுகை & பணவரவு டெமோ"
          : "Buyer Offer & Payment Demo",
      desc:
        language === "ta"
          ? "மாதிரி சலுகை, விற்பனை கணக்கு மற்றும் உள்ளூர் பணவரவு பதிவு"
          : "Generated sample offers, sale calculations, and a local payment ledger",
      icon: CircleDollarSign,
      route: "/crop-journey",
      color: "bg-forest-900",
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Grand Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-paddy-900 text-cream-100 p-8 sm:p-12 lg:p-16 shadow-agro-lg border border-forest-700">
        {/* Abstract Paddy field lines */}
        <div className="absolute inset-0 opacity-10 bg-paddy-contour pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-harvest-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-700/60 border border-harvest-400/30 text-xs font-semibold text-harvest-300">
            <Sparkles className="w-4 h-4 text-harvest-400" />
            <span>
              {language === "ta"
                ? "முழுமையான விவசாய சுழற்சி இயங்குதளம்"
                : "Unified Agricultural Operating Platform"}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-50 leading-[1.15]">
            {language === "ta" ? (
              <>
                விதை முதல் அறுவடை வரை <br />
                <span className="text-harvest-400 font-tamil">
                  ஒவ்வொரு படியும் இணைக்கப்பட்டுள்ளது
                </span>
              </>
            ) : (
              <>
                From Seed to Harvest. <br />
                <span className="text-harvest-400 font-display">
                  Every Step Connected.
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-sage-100/90 leading-relaxed font-normal">
            {language === "ta"
              ? "விதை தேர்வு, இடுபொருட்கள் வாங்குதல், இயந்திர வாடகை, பயிர் பாதுகாப்பு, அறுவடை, கிடங்கு, நேரடி சந்தை விற்பனை மற்றும் வங்கி வரவு வரை அனைத்தையும் ஒரே இடத்தில் நிர்வகிக்கும் விவசாய தளம்."
              : "VITHAI TO ARUVADAI (V2A) is a Tamil-first prototype connecting crop-season records, harvest details, sample buyer offers, sale calculations, and a local payment ledger."}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/crop-journey")}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-harvest-400 hover:bg-harvest-500 text-forest-950 font-bold rounded-2xl shadow-gold hover:scale-105 transition-all text-sm"
            >
              <ScrollText className="w-5 h-5 text-forest-900" />
              <span>
                {language === "ta"
                  ? "முழு பயிர் பயணத்தை ஆராய்க"
                  : "Explore Signature Crop Journey"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-6 py-3.5 bg-forest-700/70 hover:bg-forest-600 text-cream-100 font-semibold rounded-2xl border border-forest-500/60 transition-all text-sm"
            >
              <Play className="w-4 h-4 text-harvest-400" />
              <span>
                {language === "ta"
                  ? "கட்டுப்பாட்டு மையம் திறக்க"
                  : "Enter Farm Command Center"}
              </span>
            </button>
          </div>

          {/* Trust Metrics Pill */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-forest-700/60">
            <div>
              <p className="text-2xl font-black text-harvest-300">EN / தமிழ்</p>
              <p className="text-xs text-sage-200">
                {language === "ta" ? "மொழி தேர்வு" : "Language Toggle"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-harvest-300">6 Steps</p>
              <p className="text-xs text-sage-200">
                {language === "ta"
                  ? "இணைக்கப்பட்ட பயிர் பயணம்"
                  : "Crop-Season Journey"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-harvest-300">QR</p>
              <p className="text-xs text-sage-200">
                {language === "ta"
                  ? "மாதிரி தொகுதி தேடல்"
                  : "Sample Batch Lookup"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-harvest-300">Local</p>
              <p className="text-xs text-sage-200">
                {language === "ta"
                  ? "உலாவியில் சேமிக்கப்படும் டெமோ"
                  : "Browser-Stored Demo"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 6-Stage Connected Farming Cycle */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-paddy-600" />
              <span>
                {language === "ta"
                  ? "ஒருங்கிணைந்த சுழற்சி"
                  : "The Connected Lifecycle"}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-forest-900">
              {language === "ta"
                ? "விதை முதல் அறுவடை வரை 6 முக்கிய நிலைகள்"
                : "Six Connected Stages of Modern Farming"}
            </h2>
          </div>
          <button
            onClick={() => navigate("/crop-planner")}
            className="text-xs font-bold text-paddy-700 hover:text-paddy-900 flex items-center gap-1 group"
          >
            <span>
              {language === "ta"
                ? "அனைத்து நிலைகளையும் காண்க"
                : "View all features"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cycleSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                onClick={() => navigate(step.route as any)}
                className="group relative bg-white rounded-3xl p-6 border border-sage-300 hover:border-paddy-500 shadow-agro hover:shadow-agro-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-sage-400 group-hover:text-paddy-700 transition-colors">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-forest-900 group-hover:text-paddy-700 transition-colors mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-ink-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-sage-200 flex items-center justify-between text-xs font-bold text-paddy-700">
                  <span>{language === "ta" ? "தொடங்குக" : "Open feature"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Signature Highlight Banner: Crop Journey Passport */}
      <section className="bg-gradient-to-r from-cream-100 via-harvest-50 to-sage-100 rounded-3xl p-8 border-2 border-harvest-400/40 shadow-agro flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <span className="inline-block bg-forest-800 text-harvest-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ★ {language === "ta" ? "முக்கிய அம்சம்" : "Signature V2A Feature"}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-forest-900">
            {language === "ta"
              ? "பயிர் பயண பாஸ்போர்ட் (Crop Journey Passport)"
              : "The Crop Season Journey Ledger (Prototype)"}
          </h3>
          <p className="text-sm text-ink-700 leading-relaxed">
            {language === "ta"
              ? "ஒவ்வொரு பருவங்களுக்கான விதை, உரம், உழவு செலவு, அறுவடை எடை, மில் விற்பனை ஒப்பந்தம் மற்றும் நிலுவைத் தொகையை ஒரே டிஜிட்டல் பாஸ்போர்ட்டில் இணைக்கிறது. நிலுவையில் உள்ள தொகை தனியாக காட்டப்படுகிறது."
              : "The prototype keeps sample crop-season events and expenses in a chronological local timeline. It separates amounts marked received from pending dues; records are stored in this browser and are not independently verified."}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-forest-800 bg-white px-3 py-1.5 rounded-xl border border-sage-300">
              <CheckCircle2 className="w-4 h-4 text-paddy-600" />
              {language === "ta"
                ? "நிகர லாபக் கணக்கீடு"
                : "Realized Net Margin"}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-forest-800 bg-white px-3 py-1.5 rounded-xl border border-sage-300">
              <CheckCircle2 className="w-4 h-4 text-paddy-600" />
              {language === "ta"
                ? "மாதிரி எடை பதிவு"
                : "Sample Weighment Summary"}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-forest-800 bg-white px-3 py-1.5 rounded-xl border border-sage-300">
              <CheckCircle2 className="w-4 h-4 text-paddy-600" />
              {language === "ta"
                ? "முன்மாதிரி ஆவண காட்சி"
                : "Prototype Document View"}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/crop-journey")}
            className="px-6 py-3.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold rounded-2xl shadow-agro transition-all text-sm"
          >
            {language === "ta" ? "பாஸ்போர்ட் பார்க்க" : "Open Crop Passport"}
          </button>
          <button
            onClick={() => navigate("/net-proceeds")}
            className="px-6 py-3.5 bg-white hover:bg-sage-50 text-forest-900 font-bold rounded-2xl border border-sage-400 transition-all text-sm"
          >
            {language === "ta"
              ? "நிகர வரவு கால்குலேட்டர்"
              : "Net Proceeds Calc"}
          </button>
        </div>
      </section>
    </div>
  );
};
