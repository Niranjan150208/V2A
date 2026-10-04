import React, { useEffect, useState } from "react";
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Sun,
  ArrowRight,
  RefreshCw,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import {
  fetchLiveWeatherData,
  LiveWeatherData,
  DISTRICT_COORDINATES,
} from "../services/weather";

export const WeatherPage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();

  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    state.farm.district || "Thanjavur",
  );
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async (district: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLiveWeatherData(district);
      setWeatherData(data);
    } catch (err) {
      console.warn("Weather fetch failed:", err);
      setError(
        "Live meteorological data is currently unavailable. Please check your network connection or retry in a few moments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWeather(selectedDistrict);
  }, [selectedDistrict]);

  const seasonalRiskCalendar = [
    {
      period: "August - September",
      stage: "Nursery & Early Transplanting",
      riskLevel: "Low",
      riskDesc:
        language === "ta"
          ? "மேற்கு தொடர்ச்சி மலை தென்மேற்கு பருவமழை நீர் மேட்டூர் அணை மூலம் சீராக கிடைக்கும்."
          : "Favorable southwest monsoon inflow at Mettur dam ensures regulated canal water.",
      actionAdvice:
        language === "ta"
          ? "பாய் நாற்றங்கால் அமைத்து நடுவு பணிகளை விரைவுபடுத்தவும்."
          : "Optimal timing for SRI / mechanical transplanter planting.",
    },
    {
      period: "October - November",
      stage: "Active Tillering & Panicle Initiation",
      riskLevel: "High",
      riskDesc:
        language === "ta"
          ? "வடகிழக்கு பருவமழை மற்றும் வங்கக்கடல் காற்றழுத்த தாழ்வு மண்டல கனமழை ஆபத்து."
          : "Northeast monsoon cyclonic depressions bring heavy rainfall and flash inundation.",
      actionAdvice:
        language === "ta"
          ? "வடிகால் வாய்க்கால்களை தூர்வாரி வைக்கவும். சிஆர் 1009 சப் 1 வெள்ளத்தை தாங்கும்."
          : "Clear field drainage channels. Submergence tolerant varieties (CR 1009 Sub 1) safeguard crop.",
    },
    {
      period: "December - January",
      stage: "Grain Filling & Maturity",
      riskLevel: "Moderate",
      riskDesc:
        language === "ta"
          ? "அதிக காலை பனிப்பொழிவு மற்றும் ஈரப்பதம் இலை கருகல் நோயை தூண்டலாம்."
          : "High morning dew and fog favor blast / bacterial blight pathogen spores.",
      actionAdvice:
        language === "ta"
          ? "சூடோமோனாஸ் உயிரி மருந்து தெளித்து பயிரை பாதுகாக்கவும்."
          : "Prophylactic foliar spray of Pseudomonas fluorescens bio-fungicide.",
    },
    {
      period: "Late January - February",
      stage: "Harvest & Grain Drying",
      riskLevel: "Low",
      riskDesc:
        language === "ta"
          ? "தெளிவான சூரிய வெளிச்சம் மற்றும் உலர்ந்த காற்று. தானிய ஈரப்பதம் விரைவாக குறையும்."
          : "Dry sunny conditions; rapid drop in grain moisture to standard 14%.",
      actionAdvice:
        language === "ta"
          ? "ஒருங்கிணைந்த அறுவடை இயந்திரத்தை முன்பதிவு செய்து அறுவடை முடிக்கவும்."
          : "Deploy combine harvesters directly and dispatch to millers with zero moisture cut.",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "வேளாண் வானிலை & இடர் மேலாண்மை"
                : "Agro-Meteorology & Weather Risk Intel"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? `${weatherData ? weatherData.tamilLocationName : selectedDistrict} வானிலை மையம்`
              : `${weatherData ? weatherData.locationName : selectedDistrict} Agro Weather Center`}
          </h1>
          <p className="text-xs text-ink-500">
            {weatherData
              ? `Live Data • Source: ${weatherData.dataSource} • Updated: ${weatherData.lastUpdated}`
              : "Connecting to meteorological station network..."}
          </p>
        </div>

        {/* Location selector and Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-sage-300 rounded-xl px-3 py-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-paddy-700 shrink-0" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-bold text-forest-900 bg-transparent focus:outline-none"
            >
              {Object.keys(DISTRICT_COORDINATES).map((dist) => (
                <option key={dist} value={dist}>
                  {language === "ta" ? DISTRICT_COORDINATES[dist].tamilName : dist}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => loadWeather(selectedDistrict)}
            disabled={loading}
            className="p-2 bg-cream-100 hover:bg-cream-200 text-forest-900 border border-sage-300 rounded-xl shadow-sm transition-all"
            title="Refresh Live Weather"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-paddy-700" : ""}`} />
          </button>

          <button
            onClick={() => navigate("/farm-calendar")}
            className="px-4 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
          >
            {language === "ta" ? "பண்ணை நாட்காட்டி பார்க்க" : "Open Field Calendar"}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-terracotta-50 border border-terracotta-300 rounded-2xl flex items-start gap-3 text-xs text-terracotta-900">
          <AlertTriangle className="w-5 h-5 text-terracotta-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-bold">Weather Service Notice</p>
            <p className="text-ink-700">{error}</p>
          </div>
          <button
            onClick={() => loadWeather(selectedDistrict)}
            className="px-3 py-1 bg-terracotta-600 text-white font-bold rounded-lg hover:bg-terracotta-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Live Conditions Card */}
      {loading ? (
        <div className="bg-white rounded-3xl p-8 border border-sage-300 shadow-agro flex items-center justify-center gap-3 text-forest-900 py-16">
          <RefreshCw className="w-6 h-6 animate-spin text-paddy-600" />
          <span className="font-bold text-sm">Fetching live weather observation...</span>
        </div>
      ) : weatherData ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
                {language === "ta" ? "நேரடி அவதானிப்பு" : "Live Observation"}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  weatherData.farmingAdvisory.status === "Action Required"
                    ? "bg-red-100 text-red-800"
                    : weatherData.farmingAdvisory.status === "Caution"
                      ? "bg-harvest-100 text-harvest-800"
                      : "bg-paddy-100 text-paddy-800"
                }`}
              >
                {language === "ta"
                  ? weatherData.farmingAdvisory.tamilStatus
                  : weatherData.farmingAdvisory.status}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cream-200 text-harvest-600 flex items-center justify-center border border-harvest-400/40">
                {weatherData.condition.icon === "cloud-rain" ? (
                  <CloudRain className="w-10 h-10 text-blue-600" />
                ) : weatherData.condition.icon === "cloud-sun" ? (
                  <CloudSun className="w-10 h-10 text-harvest-600" />
                ) : weatherData.condition.icon === "wind" ? (
                  <Wind className="w-10 h-10 text-teal-600" />
                ) : (
                  <Sun className="w-10 h-10 text-amber-500" />
                )}
              </div>
              <div>
                <p className="font-display font-black text-4xl text-forest-900">
                  {weatherData.currentTemp}°C
                </p>
                <p className="text-xs text-ink-600 font-medium">
                  {weatherData.locationName} •{" "}
                  {language === "ta"
                    ? weatherData.condition.tamilLabel
                    : weatherData.condition.label}
                </p>
              </div>
            </div>

            <div className="p-3 bg-cream-50 rounded-xl border border-sage-200 text-xs text-forest-900">
              <span className="font-bold text-paddy-800 block mb-0.5">
                {language === "ta" ? "பயிர் பாதுகாப்பு ஆலோசனை:" : "Agronomic Advisory:"}
              </span>
              <p className="leading-relaxed">
                {language === "ta"
                  ? weatherData.farmingAdvisory.tamilAdvice
                  : weatherData.farmingAdvisory.advice}
              </p>
            </div>
          </div>

          <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-ink-500 uppercase">
              <Droplets className="w-4 h-4 text-paddy-600" />
              <span>{language === "ta" ? "காற்றின் ஈரப்பதம்" : "Relative Humidity"}</span>
            </div>
            <p className="font-display font-black text-3xl text-forest-900">
              {weatherData.relativeHumidity}%
            </p>
            <p className="text-[11px] text-ink-600">
              {weatherData.relativeHumidity > 80
                ? "High • Dew formation expected"
                : "Moderate • Good transpiration"}
            </p>
          </div>

          <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-ink-500 uppercase">
              <Wind className="w-4 h-4 text-paddy-600" />
              <span>{language === "ta" ? "காற்றின் வேகம்" : "Wind Velocity"}</span>
            </div>
            <p className="font-display font-black text-3xl text-forest-900">
              {weatherData.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
            </p>
            <p className="text-[11px] text-ink-600">
              Precipitation: {weatherData.precipitationMm} mm
            </p>
          </div>
        </div>
      ) : null}

      {/* 7-Day Live Weather Forecast */}
      {weatherData && weatherData.dailyForecast.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage-200">
            <h3 className="font-display font-bold text-lg text-forest-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-paddy-600" />
              <span>{language === "ta" ? "7 நாள் வானிலை முன்னறிவிப்பு" : "7-Day Meteorological Forecast"}</span>
            </h3>
            <span className="text-[10px] font-bold text-ink-500 uppercase">
              WMO Model Data
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weatherData.dailyForecast.map((day, idx) => (
              <div
                key={day.date}
                className={`p-3 rounded-2xl border text-center space-y-2 transition-all ${
                  idx === 0
                    ? "bg-forest-800 text-cream-50 border-forest-900 shadow-sm"
                    : "bg-cream-50 text-ink-900 border-sage-200 hover:border-paddy-400"
                }`}
              >
                <span className={`text-xs font-bold block ${idx === 0 ? "text-harvest-400" : "text-ink-600"}`}>
                  {language === "ta" ? day.tamilDayName : day.dayName}
                </span>

                <div className="w-8 h-8 mx-auto flex items-center justify-center">
                  {day.condition.icon === "cloud-rain" ? (
                    <CloudRain className={`w-6 h-6 ${idx === 0 ? "text-blue-300" : "text-blue-500"}`} />
                  ) : day.condition.icon === "cloud-sun" ? (
                    <CloudSun className={`w-6 h-6 ${idx === 0 ? "text-harvest-300" : "text-amber-500"}`} />
                  ) : (
                    <Sun className={`w-6 h-6 ${idx === 0 ? "text-harvest-300" : "text-amber-500"}`} />
                  )}
                </div>

                <p className="font-display font-black text-sm">
                  {day.tempMax}° / {day.tempMin}°
                </p>

                <div className="space-y-0.5">
                  <span className={`text-[10px] block font-bold ${day.precipitationProb > 40 ? "text-red-500" : "text-paddy-600"}`}>
                    💧 {day.precipitationProb}% rain
                  </span>
                  <span className={`text-[9px] block truncate ${idx === 0 ? "text-cream-200" : "text-ink-500"}`}>
                    {language === "ta" ? day.condition.tamilLabel : day.condition.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Risk Calendar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-lg text-forest-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-paddy-600" />
          <span>{language === "ta" ? "டெல்டா பருவகால காலநிலை இடர் நாட்காட்டி" : "Delta Agro-Climatic Seasonal Risk Calendar"}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seasonalRiskCalendar.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-cream-50 rounded-2xl border border-sage-200 space-y-2 hover:border-paddy-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">{item.period}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.riskLevel === "High"
                      ? "bg-red-100 text-red-800"
                      : item.riskLevel === "Moderate"
                        ? "bg-harvest-100 text-harvest-800"
                        : "bg-paddy-100 text-paddy-800"
                  }`}
                >
                  {item.riskLevel} Risk
                </span>
              </div>
              <h4 className="font-bold text-sm text-forest-900">{item.stage}</h4>
              <p className="text-xs text-ink-600 leading-relaxed">{item.riskDesc}</p>
              <div className="pt-2 border-t border-sage-200 text-xs font-semibold text-paddy-800 flex items-start gap-1.5">
                <span className="font-bold shrink-0">Advice:</span>
                <span>{item.actionAdvice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
