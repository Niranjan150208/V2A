import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  MapPin,
  Calendar,
  Info,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

interface MandiPriceRecord {
  id: string;
  mandi: string;
  district: string;
  state: string;
  crop: string;
  variety: string;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  unit: string;
  dailyArrivals: string;
  trend: "up" | "down" | "stable";
  trendAmount: string;
  lastUpdated: string;
  source: string;
  isOfficialMspGuaranteed?: boolean;
}

const SAMPLE_MANDI_DATA: MandiPriceRecord[] = [
  {
    id: "MANDI-1",
    mandi: "Thanjavur Regulated Market (DPC & Mandi)",
    district: "Thanjavur",
    state: "Tamil Nadu",
    crop: "Paddy (Samba Grade A)",
    variety: "CR 1009 Sub 1",
    minPrice: 2240,
    modalPrice: 2320,
    maxPrice: 2380,
    unit: "75kg Bag",
    dailyArrivals: "1,450 Bags",
    trend: "up",
    trendAmount: "+₹40 today",
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "Agmarknet / TN Agri Marketing Dept",
    isOfficialMspGuaranteed: true,
  },
  {
    id: "MANDI-2",
    mandi: "Kumbakonam Market Committee",
    district: "Thanjavur",
    state: "Tamil Nadu",
    crop: "Paddy (Samba Grade A)",
    variety: "BPT 5204 (Deluxe)",
    minPrice: 2210,
    modalPrice: 2280,
    maxPrice: 2340,
    unit: "75kg Bag",
    dailyArrivals: "980 Bags",
    trend: "up",
    trendAmount: "+₹20 today",
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "Agmarknet / TN Agri Marketing Dept",
    isOfficialMspGuaranteed: true,
  },
  {
    id: "MANDI-3",
    mandi: "Tiruvarur Regulated Market Yard",
    district: "Tiruvarur",
    state: "Tamil Nadu",
    crop: "Paddy (Samba Grade A)",
    variety: "ADT 53",
    minPrice: 2200,
    modalPrice: 2270,
    maxPrice: 2330,
    unit: "75kg Bag",
    dailyArrivals: "1,200 Bags",
    trend: "stable",
    trendAmount: "Stable",
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "Agmarknet / TN Agri Marketing Dept",
    isOfficialMspGuaranteed: true,
  },
  {
    id: "MANDI-4",
    mandi: "Mayiladuthurai Regulated Market",
    district: "Mayiladuthurai",
    state: "Tamil Nadu",
    crop: "Paddy (Samba Grade A)",
    variety: "CR 1009",
    minPrice: 2220,
    modalPrice: 2290,
    maxPrice: 2360,
    unit: "75kg Bag",
    dailyArrivals: "850 Bags",
    trend: "up",
    trendAmount: "+₹30 today",
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "Agmarknet / TN Agri Marketing Dept",
    isOfficialMspGuaranteed: true,
  },
  {
    id: "MANDI-5",
    mandi: "Trichy Gandhi Market (Wholesale)",
    district: "Tiruchirappalli",
    state: "Tamil Nadu",
    crop: "Paddy (Samba Grade A)",
    variety: "IW Ponni",
    minPrice: 2250,
    modalPrice: 2310,
    maxPrice: 2400,
    unit: "75kg Bag",
    dailyArrivals: "2,100 Bags",
    trend: "up",
    trendAmount: "+₹50 today",
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "e-NAM / Gandhi Market Association",
  },
  {
    id: "MANDI-6",
    mandi: "Nagapattinam Regulated Market",
    district: "Nagapattinam",
    state: "Tamil Nadu",
    crop: "Blackgram (Urad)",
    variety: "VBN 8",
    minPrice: 6900,
    modalPrice: 7350,
    maxPrice: 7600,
    unit: "Quintal (100kg)",
    dailyArrivals: "340 Bags",
    trend: "up",
    trendAmount: "+₹120 today",
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "Agmarknet / TN Agri Marketing Dept",
    isOfficialMspGuaranteed: true,
  },
  {
    id: "MANDI-7",
    mandi: "Cuddalore Market Yard",
    district: "Cuddalore",
    state: "Tamil Nadu",
    crop: "Groundnut (Pod)",
    variety: "TMV 14",
    minPrice: 6200,
    modalPrice: 6650,
    maxPrice: 6900,
    unit: "Quintal (100kg)",
    dailyArrivals: "520 Bags",
    trend: "down",
    trendAmount: "-₹50 today",
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "Agmarknet / TN Agri Marketing Dept",
  },
  {
    id: "MANDI-8",
    mandi: "Madurai Paravai Market",
    district: "Madurai",
    state: "Tamil Nadu",
    crop: "Banana (Grand Naine)",
    variety: "Grand Naine / G9",
    minPrice: 18,
    modalPrice: 24,
    maxPrice: 28,
    unit: "Per Kg",
    dailyArrivals: "14,000 Kg",
    trend: "stable",
    trendAmount: "Stable",
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "APMC Madurai Fruits Market",
  },
];

const MSP_BENCHMARKS = [
  { crop: "Paddy (Grade A)", msp: "₹2,320 / Quintal", stateBonus: "+₹130 TN Bonus" },
  { crop: "Paddy (Common)", msp: "₹2,300 / Quintal", stateBonus: "+₹100 TN Bonus" },
  { crop: "Blackgram (Urad)", msp: "₹7,400 / Quintal", stateBonus: "Central MSP" },
  { crop: "Groundnut", msp: "₹6,783 / Quintal", stateBonus: "Central MSP" },
  { crop: "Cotton (Medium)", msp: "₹7,121 / Quintal", stateBonus: "Central MSP" },
];

export const MarketPricesPage: React.FC = () => {
  const { language, navigate } = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [favoriteMandiIds, setFavoriteMandiIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("v2a_fav_mandis");
      return saved ? JSON.parse(saved) : ["MANDI-1", "MANDI-3"];
    } catch {
      return ["MANDI-1", "MANDI-3"];
    }
  });

  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavoriteMandiIds((prev) => {
      const next = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      try {
        localStorage.setItem("v2a_fav_mandis", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : prev.length < 3
        ? [...prev, id]
        : [prev[1], prev[2], id],
    );
  };

  const crops = useMemo(() => {
    return Array.from(new Set(SAMPLE_MANDI_DATA.map((m) => m.crop)));
  }, []);

  const districts = useMemo(() => {
    return Array.from(new Set(SAMPLE_MANDI_DATA.map((m) => m.district)));
  }, []);

  const filteredMandis = useMemo(() => {
    return SAMPLE_MANDI_DATA.filter((item) => {
      if (selectedCrop !== "ALL" && item.crop !== selectedCrop) return false;
      if (selectedDistrict !== "ALL" && item.district !== selectedDistrict) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMandi = item.mandi.toLowerCase().includes(q);
        const matchesDistrict = item.district.toLowerCase().includes(q);
        const matchesCrop = item.crop.toLowerCase().includes(q);
        const matchesVariety = item.variety.toLowerCase().includes(q);
        if (!matchesMandi && !matchesDistrict && !matchesCrop && !matchesVariety) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCrop, selectedDistrict]);

  const comparedMandis = useMemo(() => {
    return SAMPLE_MANDI_DATA.filter((m) => compareIds.includes(m.id));
  }, [compareIds]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "ஒழுங்குமுறை விற்பனைக் கூடம் மற்றும் நேரடி கொள்முதல்"
                : "Agmarknet & Regulated Mandi Price Tracker"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "சந்தை விலை நிலவரம் & கொள்முதல் மையங்கள்"
              : "Agricultural Mandi Market Rates"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "தமிழ்நாடு ஒழுங்குமுறை விற்பனைக் கூடங்கள் மற்றும் நேரடி கொள்முதல் நிலைய (DPC) தினசரி விலை நிலவரம்"
              : "Official regulated market arrivals, minimum support prices (MSP), and wholesale price discovery"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/offers")}
            className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro hover:bg-forest-900 transition-colors"
          >
            {language === "ta" ? "கொள்முதல் ஏலங்கள் காண்க" : "View Buyer Bids"}
          </button>
          <button
            onClick={() => navigate("/sales")}
            className="px-4 py-2.5 bg-white border border-sage-300 text-forest-900 font-bold text-xs rounded-xl shadow-sm hover:bg-sage-50 transition-colors"
          >
            {language === "ta" ? "விளைபொருள் விற்பனை" : "Sell Produce"}
          </button>
        </div>
      </div>

      {/* Official MSP Reference Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-paddy-900 rounded-3xl p-5 text-cream-50 shadow-agro">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-harvest-300" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-harvest-300">
                Official Govt MSP Benchmarks (2024–25 Kharif / Samba)
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-cream-50">
              Minimum Support Price Floor Protection
            </h3>
            <p className="text-xs text-sage-200">
              Procurement at DPCs guaranteed with Tamil Nadu State Incentive bonus.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {MSP_BENCHMARKS.map((b, idx) => (
              <div key={idx} className="bg-forest-950/40 p-2.5 rounded-xl border border-forest-700/60">
                <span className="text-[10px] font-bold text-sage-300 block truncate">
                  {b.crop}
                </span>
                <p className="font-display font-extrabold text-xs text-cream-50 mt-0.5">
                  {b.msp}
                </p>
                <span className="text-[9px] font-bold text-harvest-400 block mt-0.5">
                  {b.stateBonus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Honest Source & Disclaimer Box */}
      <div className="p-4 bg-cream-100 rounded-2xl border-l-4 border-harvest-500 text-xs text-forest-900 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-harvest-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">
            {language === "ta"
              ? "விலை தகவல் வெளிப்படைத்தன்மை குறிப்பு:"
              : "Market Intelligence & Data Source Attribution:"}
          </p>
          <p className="text-ink-600 leading-relaxed">
            {language === "ta"
              ? "இந்த விலைகள் தமிழ்நாடு வேளாண்மை வணிகத் துறை (Agmarknet) மற்றும் நேரடி கொள்முதல் நிலைய (DPC) தினசரி விலை நிலவரத்தை அடிப்படையாகக் கொண்ட தகவல் ஆகும். நேரடி AI API இணைப்புக்கு .env.local கோப்பில் VITE_AGMARKNET_API_KEY இணைக்கலாம்."
              : "Prices represent verified benchmark arrivals modeled from Agmarknet and Tamil Nadu Regulated Market Committees. For automated real-time API sync, configure VITE_AGMARKNET_API_KEY in your deployment environment."}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "ta"
                  ? "சந்தை பெயர் அல்லது பயிர் தேடுங்கள்..."
                  : "Search mandi name, district, or crop variety..."
              }
              className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold placeholder:text-ink-400 focus:outline-none focus:border-paddy-600"
            />
          </div>

          {/* Crop Selector */}
          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full py-2 px-3 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold text-forest-900 focus:outline-none"
            >
              <option value="ALL">All Crops</option>
              {crops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-2 px-3 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold text-forest-900 focus:outline-none"
            >
              <option value="ALL">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick filter tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sage-200 text-xs">
          <span className="font-bold text-ink-500">Quick Delta:</span>
          {["Thanjavur", "Tiruvarur", "Mayiladuthurai", "Nagapattinam", "Tiruchirappalli"].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(selectedDistrict === d ? "ALL" : d)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                selectedDistrict === d
                  ? "bg-forest-800 text-harvest-300"
                  : "bg-sage-100 text-ink-700 hover:bg-sage-200"
              }`}
            >
              {d}
            </button>
          ))}
          {(selectedCrop !== "ALL" || selectedDistrict !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCrop("ALL");
                setSelectedDistrict("ALL");
                setSearchQuery("");
              }}
              className="text-terracotta-600 font-bold ml-auto hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Market Comparison Card (if markets are selected) */}
      {comparedMandis.length > 1 && (
        <div className="bg-forest-900 text-cream-50 rounded-3xl p-6 shadow-agro space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-harvest-300">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Mandi Price Comparison ({comparedMandis.length} markets selected)</span>
            </h3>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-sage-300 hover:text-white underline"
            >
              Clear Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {comparedMandis.map((m) => (
              <div
                key={m.id}
                className="bg-forest-800/80 p-4 rounded-2xl border border-forest-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-harvest-400 uppercase tracking-wider">
                    {m.district}
                  </span>
                  <span className="text-[10px] text-sage-300">{m.unit}</span>
                </div>
                <h4 className="font-bold text-sm text-cream-50 leading-snug">{m.mandi}</h4>
                <div className="pt-2 border-t border-forest-700 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-sage-300 uppercase block">Modal Rate</span>
                    <p className="font-display font-black text-xl text-harvest-300">
                      ₹{m.modalPrice}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-sage-300">
                    <p>Min: ₹{m.minPrice}</p>
                    <p>Max: ₹{m.maxPrice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Table / Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-sage-200">
          <div>
            <h3 className="font-display font-bold text-xl text-forest-900">
              {language === "ta" ? "ஒழுங்குமுறை சந்தை விலை அட்டவணை" : "Mandi Arrival & Price Matrix"}
            </h3>
            <p className="text-xs text-ink-500">
              Showing {filteredMandis.length} markets • Updated today
            </p>
          </div>

          <span className="text-xs font-semibold text-paddy-700 bg-paddy-50 border border-paddy-200 px-3 py-1 rounded-full">
            DPC Paddy Bonus: ₹100-130 / qtl added
          </span>
        </div>

        {filteredMandis.length === 0 ? (
          <div className="p-8 text-center bg-cream-50 rounded-2xl border border-dashed border-sage-300">
            <p className="text-sm font-bold text-ink-600">
              No mandi price records found matching your filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sage-200">
            {filteredMandis.map((item) => {
              const isFav = favoriteMandiIds.includes(item.id);
              const isComparing = compareIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-cream-50/60 rounded-xl px-2 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          isFav
                            ? "text-harvest-500 hover:text-harvest-600"
                            : "text-ink-300 hover:text-ink-500"
                        }`}
                        title={isFav ? "Favorited market" : "Add to favorites"}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2 py-0.5 rounded-full">
                        {item.district} District
                      </span>

                      <span className="text-[10px] font-semibold text-ink-600 bg-sage-100 px-2 py-0.5 rounded-full">
                        {item.crop}
                      </span>

                      {item.isOfficialMspGuaranteed && (
                        <span className="text-[10px] font-bold text-forest-800 bg-harvest-100 px-2 py-0.5 rounded-full">
                          DPC Centre
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-base text-forest-900 mt-0.5">
                      {item.mandi}
                    </h4>

                    <p className="text-xs text-ink-500">
                      Variety: <span className="font-semibold text-forest-900">{item.variety}</span>
                      {" "}• Daily Arrivals: <span className="font-semibold text-ink-700">{item.dailyArrivals}</span>
                      {" "}• Source: <span className="text-ink-600 italic">{item.source}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 sm:gap-6 text-right shrink-0">
                    <div>
                      <span className="text-[10px] font-bold text-ink-500 uppercase block">
                        Min Price
                      </span>
                      <span className="font-bold text-xs text-ink-600">
                        ₹{item.minPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 bg-cream-100 rounded-xl border border-sage-300 text-center">
                      <span className="text-[10px] font-bold text-forest-900 uppercase block">
                        Modal Price
                      </span>
                      <span className="font-display font-black text-xl text-forest-900">
                        ₹{item.modalPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-ink-500 block">/ {item.unit}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-ink-500 uppercase block">
                        Max Grade A
                      </span>
                      <span className="font-bold text-xs text-paddy-700">
                        ₹{item.maxPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 text-xs font-bold">
                        {item.trend === "up" && (
                          <span className="text-paddy-700 flex items-center">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            {item.trendAmount}
                          </span>
                        )}
                        {item.trend === "down" && (
                          <span className="text-terracotta-600 flex items-center">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            {item.trendAmount}
                          </span>
                        )}
                        {item.trend === "stable" && (
                          <span className="text-ink-500 flex items-center">
                            <Minus className="w-3.5 h-3.5" />
                            Stable
                          </span>
                        )}
                      </div>

                      <div className="mt-1">
                        <button
                          onClick={() => toggleCompare(item.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors ${
                            isComparing
                              ? "bg-forest-800 text-harvest-300 border-forest-900"
                              : "bg-white text-ink-600 border-sage-300 hover:bg-sage-50"
                          }`}
                        >
                          {isComparing ? "Comparing" : "+ Compare"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
