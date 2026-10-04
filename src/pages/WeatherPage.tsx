import React from 'react';
import { CloudSun, CloudRain, Wind, Droplets, AlertTriangle, ShieldCheck, Calendar, Sun, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const WeatherPage: React.FC = () => {
  const { language, navigate } = useNavigation();

  const forecastDays = [
    { day: 'Today', temp: '29°C / 23°C', rain: '10%', condition: 'Sunny & Pleasant', icon: Sun },
    { day: 'Tomorrow', temp: '30°C / 24°C', rain: '15%', condition: 'Partly Cloudy', icon: CloudSun },
    { day: 'Wednesday', temp: '28°C / 23°C', rain: '25%', condition: 'Scattered Clouds', icon: CloudSun },
    { day: 'Thursday', temp: '29°C / 22°C', rain: '5%', condition: 'Dry Field Sun', icon: Sun },
    { day: 'Friday', temp: '31°C / 24°C', rain: '10%', condition: 'Clear Skies', icon: Sun },
    { day: 'Saturday', temp: '30°C / 23°C', rain: '20%', condition: 'Mild Breeze', icon: Wind },
    { day: 'Sunday', temp: '29°C / 23°C', rain: '30%', condition: 'Light Evening Mist', icon: CloudSun },
  ];

  const seasonalRiskCalendar = [
    {
      period: 'August - September',
      stage: 'Nursery & Early Transplanting',
      riskLevel: 'Low',
      riskDesc: language === 'ta' ? 'மேற்கு தொடர்ச்சி மலை தென்மேற்கு பருவமழை நீர் மேட்டூர் அணை மூலம் சீராக கிடைக்கும்.' : 'Favorable southwest monsoon inflow at Mettur dam ensures regulated canal water.',
      actionAdvice: language === 'ta' ? 'பாய் நாற்றங்கால் அமைத்து நடுவு பணிகளை விரைவுபடுத்தவும்.' : 'Optimal timing for SRI / mechanical transplanter planting.',
    },
    {
      period: 'October - November',
      stage: 'Active Tillering & Panicle Initiation',
      riskLevel: 'High',
      riskDesc: language === 'ta' ? 'வடகிழக்கு பருவமழை மற்றும் வங்கக்கடல் காற்றழுத்த தாழ்வு மண்டல கனமழை ஆபத்து.' : 'Northeast monsoon cyclonic depressions bring heavy rainfall and flash inundation.',
      actionAdvice: language === 'ta' ? 'வடிகால் வாய்க்கால்களை தூர்வாரி வைக்கவும். சிஆர் 1009 சப் 1 வெள்ளத்தை தாங்கும்.' : 'Clear field drainage channels. Submergence tolerant varieties (CR 1009 Sub 1) safeguard crop.',
    },
    {
      period: 'December - January',
      stage: 'Grain Filling & Maturity',
      riskLevel: 'Moderate',
      riskDesc: language === 'ta' ? 'அதிக காலை பனிப்பொழிவு மற்றும் ஈரப்பதம் இலை கருகல் நோயை தூண்டலாம்.' : 'High morning dew and fog favor blast / bacterial blight pathogen spores.',
      actionAdvice: language === 'ta' ? 'சூடோமோனாஸ் உயிரி மருந்து தெளித்து பயிரை பாதுகாக்கவும்.' : 'Prophylactic foliar spray of Pseudomonas fluorescens bio-fungicide.',
    },
    {
      period: 'Late January - February',
      stage: 'Harvest & Grain Drying',
      riskLevel: 'Low',
      riskDesc: language === 'ta' ? 'தெளிவான சூரிய வெளிச்சம் மற்றும் உலர்ந்த காற்று. தானிய ஈரப்பதம் விரைவாக குறையும்.' : 'Dry sunny conditions; rapid drop in grain moisture to standard 14%.',
      actionAdvice: language === 'ta' ? 'ஒருங்கிணைந்த அறுவடை இயந்திரத்தை முன்பதிவு செய்து அறுவடை முடிக்கவும்.' : 'Deploy combine harvesters directly and dispatch to millers with zero moisture cut.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'வேளாண் வானிலை & இடர் மேலாண்மை' : 'Agro-Meteorology & Weather Risk Intel'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'தஞ்சாவூர் டெல்டா வானிலை மையம்' : 'Thanjavur Delta Weather & Risk Calendar'}
          </h1>
          <p className="text-xs text-ink-500">
            Hyperlocal automated telemetry • Grand Anicut Basin
          </p>
        </div>

        <button
          onClick={() => navigate('/farm-calendar')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'பண்ணை நாட்காட்டி பார்க்க' : 'Open Field Calendar'}
        </button>
      </div>

      {/* Current Real-time Conditions Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">Current Observation</span>
            <span className="bg-paddy-100 text-paddy-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Optimal for Harvest</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cream-200 text-harvest-600 flex items-center justify-center border border-harvest-400/40">
              <Sun className="w-10 h-10" />
            </div>
            <div>
              <p className="font-display font-black text-4xl text-forest-900">29°C</p>
              <p className="text-xs text-ink-600 font-medium">Thiruvaiyaru, Thanjavur • Clear & Dry</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink-500 uppercase">
            <Droplets className="w-4 h-4 text-paddy-600" />
            <span>Relative Humidity</span>
          </div>
          <p className="font-display font-extrabold text-2xl text-forest-900">68%</p>
          <p className="text-[11px] text-ink-600">Dew point 21°C • Safe storage range</p>
        </div>

        <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink-500 uppercase">
            <Wind className="w-4 h-4 text-forest-700" />
            <span>Wind & Rain Risk</span>
          </div>
          <p className="font-display font-extrabold text-2xl text-forest-900">12 km/h</p>
          <p className="text-[11px] text-paddy-700 font-semibold">10% Rain chance • Zero storm alert</p>
        </div>
      </div>

      {/* 7-Day Forecast Row */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-lg text-forest-900">
          {language === 'ta' ? '7-நாள் வேளாண் முன்னறிவிப்பு' : '7-Day Agronomic Forecast Window'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecastDays.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-4 border border-sage-300 shadow-sm text-center space-y-2">
                <p className="text-xs font-bold text-ink-600">{f.day}</p>
                <div className="w-10 h-10 mx-auto rounded-xl bg-cream-100 flex items-center justify-center text-harvest-600">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm text-forest-900">{f.temp}</p>
                <span className="inline-block text-[10px] font-bold text-paddy-700 bg-paddy-50 px-2 py-0.5 rounded-full">
                  Rain: {f.rain}
                </span>
                <p className="text-[10px] text-ink-500 truncate">{f.condition}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weather Risk Calendar (Requirement A) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sage-200">
          <div>
            <h3 className="font-display font-bold text-xl text-forest-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-paddy-600" />
              <span>{language === 'ta' ? 'பருவகால வானிலை இடர் நாட்காட்டி' : 'Seasonal Agro-Weather Risk Calendar'}</span>
            </h3>
            <p className="text-xs text-ink-500">
              {language === 'ta' ? 'டெல்டா மண்டல சம்பா சாகுபடிக்கான இடர் பகுப்பாய்வு' : 'Predictive vulnerability mitigation matrix for Delta Samba crop'}
            </p>
          </div>
          <span className="text-xs font-bold text-forest-800 bg-cream-200 px-3 py-1 rounded-full">
            Cauvery Delta Cycle
          </span>
        </div>

        <div className="space-y-3">
          {seasonalRiskCalendar.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-sage-200 bg-cream-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-forest-900">{item.period}</span>
                  <span className="text-xs text-paddy-700 font-semibold">• {item.stage}</span>
                </div>
                <p className="text-xs text-ink-700">{item.riskDesc}</p>
                <p className="text-xs font-bold text-forest-800 pt-1">
                  💡 {language === 'ta' ? 'பரிந்துரை: ' : 'Remedy / Action: '} {item.actionAdvice}
                </p>
              </div>

              <div className="shrink-0">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider ${
                    item.riskLevel === 'High'
                      ? 'bg-terracotta-100 text-terracotta-800 border border-terracotta-300'
                      : item.riskLevel === 'Moderate'
                      ? 'bg-harvest-100 text-forest-900 border border-harvest-400'
                      : 'bg-paddy-100 text-paddy-800 border border-paddy-300'
                  }`}
                >
                  {item.riskLevel} Risk
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
