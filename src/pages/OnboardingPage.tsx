import React, { useState } from "react";
import {
  Sprout,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Layers,
  Droplets,
  ShieldCheck,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const OnboardingPage: React.FC = () => {
  const { navigate, language, triggerRefresh } = useNavigation();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "VIJAY",
    tamilFullName: "விஜய்",
    phone: "9000000421",
    village: "Thiruvaiyaru",
    taluk: "Budalur",
    district: "Thanjavur",
    pincode: "613204",
    totalAcres: 5.5,
    surveyNumber: "142/3B",
    pattaNumber: "PATTA-904",
    soilType: "Clay Loam",
    waterSource: "Canal",
    primaryCrop: "Paddy (Samba)",
    plannedVariety: "CR 1009 Sub 1",
    seasonName: "Samba (Main-Rabi)",
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const state = AppStore.getState();
    const existingParcel = state.farm.parcels[0];
    AppStore.updateFarmerAndFarm(
      {
        fullName: formData.fullName,
        tamilFullName: formData.tamilFullName,
        village: formData.village,
        taluk: formData.taluk,
        district: formData.district,
        pincode: formData.pincode,
        totalLandAcres: Number(formData.totalAcres),
        primaryCrops: [formData.primaryCrop],
        soilTypes: [formData.soilType],
        waterSources: [formData.waterSource],
      },
      {
        village: formData.village,
        district: formData.district,
        totalAreaAcres: Number(formData.totalAcres),
        parcels: existingParcel
          ? [
              {
                ...existingParcel,
                surveyNumber: formData.surveyNumber,
                pattaNumber: formData.pattaNumber,
                acres: Number(formData.totalAcres),
                soilType: formData.soilType as typeof existingParcel.soilType,
                irrigationType:
                  formData.waterSource as typeof existingParcel.irrigationType,
                locationName: `${formData.village} Field`,
              },
            ]
          : state.farm.parcels,
      },
    );
    AppStore.setCurrentUser({
      ...state.currentUser,
      phone: formData.phone,
      name: formData.fullName,
      tamilName: formData.tamilFullName,
      role: "farmer",
    });

    // Create new season and navigate to crop planner or dashboard
    AppStore.createSeason({
      farmerId: "FARMER-TN-0421",
      cropId: "CROP-PADDY-SAMBA",
      cropName: formData.primaryCrop,
      tamilCropName: "நெல் (சம்பா)",
      variety: formData.plannedVariety,
      seasonName: formData.seasonName as any,
      parcelId: "PARCEL-01",
      parcelName: `${formData.village} Field (${formData.totalAcres} Acres)`,
      areaAcres: Number(formData.totalAcres),
      startDate: new Date().toISOString().split("T")[0],
      sowingDate: new Date(Date.now() + 10 * 86400000)
        .toISOString()
        .split("T")[0],
      plannedHarvestDate: new Date(Date.now() + 130 * 86400000)
        .toISOString()
        .split("T")[0],
      stage: "Planning",
      targetYieldBags: Math.round(Number(formData.totalAcres) * 32),
      allocatedBudget: Number(formData.totalAcres) * 22000,
    });
    triggerRefresh();
    navigate("/crop-planner");
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-forest-900">
              {language === "ta"
                ? "விவசாயி பதிவு & நில விபரம்"
                : "Farmer Onboarding & Farm Setup"}
            </h2>
            <p className="text-xs text-ink-500">
              {language === "ta"
                ? "படி " + step + " / 4: "
                : "Step " + step + " of 4: "}
              {step === 1 &&
                (language === "ta"
                  ? "சுயவிவரம் & முகவரி"
                  : "Personal & Village Details")}
              {step === 2 &&
                (language === "ta"
                  ? "நிலம் & பட்டா விவரங்கள்"
                  : "Land Parcels & Patta")}
              {step === 3 &&
                (language === "ta"
                  ? "மண்வளம் & பாசன முறை"
                  : "Soil & Water Sources")}
              {step === 4 &&
                (language === "ta"
                  ? "பயிர் தேர்வு & புதிய பருவம்"
                  : "Season & Crop Planning")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-forest-800 text-harvest-300 font-bold flex items-center justify-center text-sm shadow-sm">
            {step}/4
          </div>
        </div>

        {/* Step indicator bar */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? "bg-paddy-600" : "bg-sage-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={
          step === 4
            ? handleSubmit
            : (e) => {
                e.preventDefault();
                handleNext();
              }
        }
        className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6"
      >
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-paddy-600" />
              <span>
                {language === "ta"
                  ? "1. விவசாயி பெயர் & இருப்பிடம்"
                  : "1. Personal & Location Information"}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Full Name (English)
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  முழு பெயர் (தமிழ்)
                </label>
                <input
                  type="text"
                  value={formData.tamilFullName}
                  onChange={(e) =>
                    setFormData({ ...formData, tamilFullName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-tamil font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta"
                    ? "தொலைபேசி எண் (டெமோ)"
                    : "Phone Number (Demo Profile)"}
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta" ? "கிராமம் (Village)" : "Village"}
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) =>
                    setFormData({ ...formData, village: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta" ? "மாவட்டம் (District)" : "District"}
                </label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                >
                  <option value="Thanjavur">Thanjavur (தஞ்சாவூர்)</option>
                  <option value="Tiruvarur">Tiruvarur (திருவாரூர்)</option>
                  <option value="Nagapattinam">
                    Nagapattinam (நாகப்பட்டினம்)
                  </option>
                  <option value="Mayiladuthurai">
                    Mayiladuthurai (மயிலாடுதுறை)
                  </option>
                  <option value="Madurai">Madurai (மதுரை)</option>
                  <option value="Tiruchirappalli">
                    Tiruchirappalli (திருச்சி)
                  </option>
                  <option value="Erode">Erode (ஈரோடு)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-paddy-600" />
              <span>
                {language === "ta"
                  ? "2. நிலம் & பட்டா விபரங்கள்"
                  : "2. Land Parcel & Patta Information"}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta"
                    ? "மொத்த சாகுபடி பரப்பு (ஏக்கர்)"
                    : "Total Land Area (Acres)"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.totalAcres}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalAcres: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta"
                    ? "சர்வே எண் (Survey Number)"
                    : "Survey Number"}
                </label>
                <input
                  type="text"
                  value={formData.surveyNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, surveyNumber: e.target.value })
                  }
                  placeholder="e.g. 142/3B"
                  required
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta"
                    ? "பட்டா எண் (Patta Number)"
                    : "Patta Number"}
                </label>
                <input
                  type="text"
                  value={formData.pattaNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, pattaNumber: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="p-3 bg-sage-100 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-paddy-600 shrink-0" />
                <p className="text-xs text-forest-800">
                  {language === "ta"
                    ? "அரசு நில ஆவண சரிபார்ப்பு (Tamil Nilam API) தானாக இணைக்கப்படும்."
                    : "Land records linkable with Tamil Nilam digital land repository."}
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-paddy-600" />
              <span>
                {language === "ta"
                  ? "3. மண்வளம் & பாசன முறை"
                  : "3. Soil Type & Water Sources"}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta" ? "மண் வகை (Soil Type)" : "Soil Type"}
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) =>
                    setFormData({ ...formData, soilType: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                >
                  <option value="Clay Loam">Clay Loam (களிமண் படிவு)</option>
                  <option value="Alluvial">Alluvial Delta (வண்டல் மண்)</option>
                  <option value="Red Sandy Loam">
                    Red Sandy Loam (செம்மண்)
                  </option>
                  <option value="Black Cotton">
                    Black Cotton (கரிசல் மண்)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta"
                    ? "முக்கிய பாசன ஆதாரம்"
                    : "Primary Irrigation Source"}
                </label>
                <select
                  value={formData.waterSource}
                  onChange={(e) =>
                    setFormData({ ...formData, waterSource: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                >
                  <option value="Canal">
                    Cauvery Canal Turn (கால்வாய் பாசனம்)
                  </option>
                  <option value="Borewell">
                    Solar / Grid Borewell (ஆழ்துளை கிணறு)
                  </option>
                  <option value="Drip Irrigation">
                    Drip Irrigation (சொட்டு நீர்)
                  </option>
                  <option value="Open Well">
                    Open Well (திறந்தவெளி கிணறு)
                  </option>
                  <option value="Rainfed">Rainfed (மானாவாரி)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-paddy-600" />
              <span>
                {language === "ta"
                  ? "4. சாகுபடி பயிர் & புதிய பருவம்"
                  : "4. Initial Crop Season Setup"}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta" ? "பருவம் (Season)" : "Season"}
                </label>
                <select
                  value={formData.seasonName}
                  onChange={(e) =>
                    setFormData({ ...formData, seasonName: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                >
                  <option value="Samba (Main-Rabi)">
                    Samba (Main-Rabi / சம்பா)
                  </option>
                  <option value="Kuruvai (Summer-Kharif)">
                    Kuruvai (Summer-Kharif / குறுவை)
                  </option>
                  <option value="Thaladi (Late-Rabi)">
                    Thaladi (Late-Rabi / தாளடி)
                  </option>
                  <option value="Navarai (Summer)">
                    Navarai (Summer / நவரை)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta"
                    ? "பயிர் & ரகம்"
                    : "Planned Crop & Variety"}
                </label>
                <input
                  type="text"
                  value={formData.plannedVariety}
                  onChange={(e) =>
                    setFormData({ ...formData, plannedVariety: e.target.value })
                  }
                  required
                  placeholder="e.g. CR 1009 Sub 1 / Ponni"
                  className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            <div className="p-4 bg-cream-100 rounded-2xl border border-harvest-400/40 space-y-2">
              <p className="text-xs font-bold text-forest-900">
                {language === "ta"
                  ? "இணைக்கப்பட்ட V2A சுழற்சி துவக்கம்:"
                  : "Ready to Launch Connected V2A Lifecycle:"}
              </p>
              <p className="text-xs text-ink-600">
                {language === "ta"
                  ? "பதிவு செய்தவுடன் உங்கள் நிலத்திற்கு மண் பரிசோதனை பரிந்துரைகள், விதை பாஸ்போர்ட் மற்றும் சாகுபடி வரவு-செலவு தானாக தயாராகும்."
                  : "Upon submission, your farm profile, soil advisory, seed passport generator, and cultivation budget calculator will be configured."}
              </p>
            </div>
          </div>
        )}

        {/* Form Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-sage-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-sage-300 text-ink-700 font-semibold text-xs hover:bg-sage-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === "ta" ? "முந்தைய படி" : "Back"}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold rounded-xl shadow-agro transition-all text-sm"
          >
            <span>
              {step === 4
                ? language === "ta"
                  ? "பதிவு செய்து தொடங்கு"
                  : "Finish & Start Crop Plan"
                : language === "ta"
                  ? "அடுத்த படி"
                  : "Next Step"}
            </span>
            <ArrowRight className="w-4 h-4 text-harvest-400" />
          </button>
        </div>
      </form>
    </div>
  );
};
