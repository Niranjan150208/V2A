import React from "react";
import {
  User,
  ShieldCheck,
  MapPin,
  Phone,
  CreditCard,
  RotateCcw,
  Languages,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const ProfilePage: React.FC = () => {
  const { language, setLanguage, navigate, triggerRefresh } = useNavigation();
  const state = AppStore.getState();
  const farmer = state.farmer;
  const isDemoAccount = state.currentUser.id === "USER-VIJAY-DEMO";

  const handleResetDemo = () => {
    if (
      window.confirm(
        language === "ta"
          ? "அனைத்து மாதிரி தகவல்களையும் மீட்டமைக்கவா?"
          : "Reset entire platform to factory demo state?",
      )
    ) {
      AppStore.resetToDemo();
      triggerRefresh();
      navigate("/dashboard");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <User className="w-4 h-4 text-paddy-600" />
            <span>
              {isDemoAccount
                ? language === "ta"
                  ? "டெமோ விவசாயி சுயவிவரம்"
                  : "Demo Farmer Profile"
                : language === "ta"
                  ? "விவசாயி சுயவிவரம்"
                  : "Farmer Profile"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta" ? farmer.tamilFullName : farmer.fullName}
          </h1>
          <p className="text-xs text-ink-500">
            {isDemoAccount
              ? `Demo account: ${state.currentUser.name} • ${state.currentUser.phone} • Farmer`
              : `Signed in as: ${state.currentUser.name} • ${state.currentUser.phone}`}
          </p>
        </div>

        {isDemoAccount && (
          <button
            onClick={handleResetDemo}
            className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-ink-700 font-bold text-xs rounded-xl border border-sage-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-terracotta-600" />
            <span>
              {language === "ta"
                ? "மாதிரி நிலையை மீட்டமை"
                : "Reset Demo Data"}
            </span>
          </button>
        )}
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-paddy-600/40 shadow-agro space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-forest-800 text-harvest-300 font-black text-2xl flex items-center justify-center border-2 border-harvest-400 shadow-sm shrink-0">
              {state.currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-2xl text-forest-900">
                  {farmer.fullName}
                </h3>
                <span className="bg-paddy-100 text-paddy-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-paddy-600" />
                  {isDemoAccount
                    ? "Demo Only · Not KYC Verified"
                    : "Account signed in · Not KYC Verified"}
                </span>
              </div>
              <p className="text-xs text-ink-600 font-tamil mt-0.5">
                {farmer.tamilFullName} • Father/guardian: {farmer.fatherName}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-ink-500 uppercase block">
              Registered Land
            </span>
            <p className="font-display font-black text-2xl text-forest-900">
              {farmer.totalLandAcres}{" "}
              <span className="text-xs font-normal">Acres Wetland</span>
            </p>
          </div>
        </div>

        {/* User and farm details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
            <span className="text-ink-500 font-bold block uppercase text-[10px]">
              {isDemoAccount ? "Contact & Location" : "Account & Sample Location"}
            </span>
            <p className="font-bold text-forest-900">
              {isDemoAccount
                ? `${state.currentUser.phone} (demo number)`
                : state.currentUser.phone}
            </p>
            <p className="text-ink-600">
              {farmer.village}, {farmer.taluk}, {farmer.district},{" "}
              {farmer.state} {farmer.pincode}
            </p>
          </div>

          <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
            <span className="text-ink-500 font-bold block uppercase text-[10px]">
              Farm & Soil
            </span>
            <p className="font-bold text-forest-900">{state.farm.farmName}</p>
            <p className="text-ink-600">
              {farmer.totalLandAcres} acres · Soil:{" "}
              {farmer.soilTypes.join(", ")}
            </p>
          </div>

          <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
            <span className="text-ink-500 font-bold block uppercase text-[10px]">
              Farmer Preferences
            </span>
            <p className="font-bold text-forest-900">
              Crops: {farmer.primaryCrops.join(", ")}
            </p>
            <p className="text-ink-600">
              Water: {farmer.waterSources.join(", ")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <section className="rounded-2xl border border-sage-200 bg-cream-50 p-4 space-y-2">
            <h3 className="font-bold uppercase tracking-wide text-ink-600">
              {isDemoAccount
                ? "Land parcels (demo data)"
                : "Sample land parcels"}
            </h3>
            {state.farm.parcels.map((parcel) => (
              <div
                key={parcel.id}
                className="rounded-xl border border-sage-200 bg-white p-3"
              >
                <p className="font-bold text-forest-900">
                  {parcel.locationName} · {parcel.acres} acres
                </p>
                <p className="text-ink-600">
                  Survey {parcel.surveyNumber} · Patta {parcel.pattaNumber} ·{" "}
                  {parcel.soilType} · {parcel.irrigationType}
                </p>
              </div>
            ))}
          </section>
          <section className="rounded-2xl border border-sage-200 bg-cream-50 p-4 space-y-2">
            <h3 className="font-bold uppercase tracking-wide text-ink-600">
              Crop seasons
            </h3>
            {state.seasons.map((season) => (
              <div
                key={season.id}
                className="rounded-xl border border-sage-200 bg-white p-3"
              >
                <p className="font-bold text-forest-900">
                  {season.cropName} · {season.seasonName}
                </p>
                <p className="text-ink-600">
                  {season.areaAcres} acres · {season.stage} ·{" "}
                  {season.parcelName}
                </p>
              </div>
            ))}
          </section>
        </div>

        <p className="rounded-xl border border-harvest-300 bg-harvest-50 p-3 text-xs text-forest-900">
          {isDemoAccount
            ? "These are sample demo records stored only in this browser. Phone, land, card, and benefit identifiers are not authenticated or verified; do not enter sensitive real information."
            : "Your sign-in is connected to your personal account. Farm, land, crop, and financial details currently shown are sample starter records, not verified personal data. Replace them before use; do not enter sensitive real information."}
        </p>

        {/* Language Preference Section */}
        <div className="p-5 bg-cream-100 rounded-2xl border border-sage-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Languages className="w-6 h-6 text-paddy-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-forest-900">
                {language === "ta"
                  ? "மொழி விருப்பம் (Language Selection)"
                  : "Platform Language Preference"}
              </h4>
              <p className="text-xs text-ink-600">
                Switch effortlessly between English and தமிழ் across all
                modules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage("en")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                language === "en"
                  ? "bg-forest-800 text-harvest-300 shadow-sm"
                  : "bg-white text-ink-700 border border-sage-300"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("ta")}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-tamil transition-all ${
                language === "ta"
                  ? "bg-forest-800 text-harvest-300 shadow-sm"
                  : "bg-white text-ink-700 border border-sage-300"
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
