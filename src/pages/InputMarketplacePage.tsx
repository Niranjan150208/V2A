import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  ShieldCheck,
  Plus,
  CheckCircle2,
  ArrowRight,
  Star,
  Store,
  Layers,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { InputProduct } from "../types";

export const InputMarketplacePage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const categories = [
    "All",
    "Organic Bio-Fertilizer",
    "NPK & Micronutrients",
    "Bio-Pesticide",
    "Seeds",
  ];

  const filteredProducts = state.inputProducts.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tamilName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getQty = (id: string) => quantities[id] || 1;

  const handleQtyChange = (id: string, delta: number) => {
    const product = state.inputProducts.find((item) => item.id === id);
    if (!product || product.stockAvailable <= 0) return;
    const current = getQty(id);
    const next = Math.min(product.stockAvailable, Math.max(1, current + delta));
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [id]: next,
    }));
  };

  const handleBuyProduct = (product: InputProduct) => {
    const qty = getQty(product.id);
    if (product.stockAvailable < qty || product.stockAvailable <= 0) return;
    const totalCost = product.pricePerUnit * qty;
    const confirmed = window.confirm(
      `Place demo order for ${qty} ${product.unit} of ${product.name} for ₹${totalCost.toLocaleString()}? No payment will be taken.`,
    );
    if (!confirmed) return;

    // Add to input purchases
    AppStore.addInputPurchase({
      orderStatus: "Placed",
      seasonId: activeSeasonId,
      productId: product.id,
      productName: product.name,
      quantity: qty,
      unit: product.unit,
      unitPrice: product.pricePerUnit,
      totalCost,
      purchaseDate: new Date().toISOString().split("T")[0],
      batchNumber: `BATCH-${Date.now().toString().slice(-4)}`,
      supplier: product.supplierName,
      isUsedInField: false,
      notes: `Demo order placed. Payment is not processed.`,
    });

    // Also record expense automatically into season!
    AppStore.addExpense({
      seasonId: activeSeasonId,
      category: product.category.includes("Fertilizer")
        ? "Fertilizers"
        : "Bio-Inputs",
      description: `${product.name} (${qty} ${product.unit})`,
      amount: totalCost,
      date: new Date().toISOString().split("T")[0],
      paymentMode: "Credit / Due",
      paidTo: product.supplierName,
    });

    setAddedItemName(product.name);
    triggerRefresh();
    setTimeout(() => {
      setAddedItemName(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "உயிரி & சான்றளிக்கப்பட்ட இடுபொருட்கள்"
                : "Demo Agri-Inputs Shop"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "வேளாண் இடுபொருட்கள் அங்காடி"
              : "Agri Inputs Store & Pricing"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "மாதிரி பட்டியல் மட்டும். வாங்குதல் அல்லது பணம் செலுத்துதல் உண்மையில் நடைபெறாது."
              : "Sample catalog only. Orders are saved locally; no supplier, delivery, or payment is connected."}
          </p>
        </div>

        <button
          onClick={() => navigate("/input-locker")}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
        >
          <Store className="w-4 h-4 text-harvest-400" />
          <span>
            {language === "ta"
              ? "டிஜிட்டல் இடுபொருள் பெட்டகம்"
              : "Open Input Locker"}
          </span>
        </button>
      </div>

      {/* Added to locker alert */}
      {addedItemName && (
        <div className="p-4 bg-paddy-100 text-paddy-900 border border-paddy-300 rounded-2xl flex items-center justify-between text-xs font-bold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-paddy-700" />
            <span>
              "{addedItemName}"{" "}
              {language === "ta"
                ? "வெற்றிகரமாக இடுபொருள் பெட்டகத்தில் சேர்க்கப்பட்டு செலவு பதிவு செய்யப்பட்டது!"
                : "Order placed (demo). No payment was charged. Track it in Purchase History."}
            </span>
          </div>
          <button
            onClick={() => navigate("/input-locker")}
            className="underline font-bold text-forest-900"
          >
            {language === "ta" ? "பெட்டகம் காண்க" : "View Locker"}
          </button>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "ta"
                  ? "உரம், உயிர் பூச்சிக்கொல்லி அல்லது பிராண்ட் தேடவும்..."
                  : "Search bio-fertilizers, neem cake, zinc, or brand..."
              }
              className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-forest-800 text-harvest-300 shadow-sm"
                    : "bg-cream-50 text-ink-700 hover:bg-sage-100 border border-sage-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const qty = getQty(product.id);
          const totalCost = product.pricePerUnit * qty;
          const outOfStock = product.stockAvailable <= 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro flex flex-col justify-between hover:border-paddy-500 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  {product.certifiedOrganic && (
                    <span className="text-[9px] font-black text-forest-900 bg-harvest-300 px-2 py-0.5 rounded-full">
                      Organic tag · demo
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-forest-900 leading-snug">
                  {language === "ta" ? product.tamilName : product.name}
                </h3>
                <p className="text-[11px] text-ink-500 mt-0.5">
                  By {product.brand}
                </p>

                <p className="text-xs text-ink-600 my-3 leading-relaxed">
                  {product.description}
                </p>

                <div className="p-2.5 bg-cream-50 rounded-xl border border-sage-200 text-[11px] space-y-1 text-ink-700 mb-4">
                  <p className="font-bold text-forest-900">
                    Dosage: {product.dosageRecommendation}
                  </p>
                  <p className="text-ink-500">
                    Supplier: {product.supplierName}
                  </p>
                </div>
              </div>

              {/* Price & Quantity Selector */}
              <div className="pt-3 border-t border-sage-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-ink-500 block uppercase">
                      Price / {product.unit}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display font-black text-xl text-forest-900">
                        ₹{product.pricePerUnit}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-ink-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-cream-100 border border-sage-300 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(product.id, -1)}
                      aria-label={`Decrease ${product.name} quantity`}
                      className="w-6 h-6 rounded-lg bg-white text-forest-900 font-bold flex items-center justify-center hover:bg-sage-100"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-forest-900 px-1">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(product.id, 1)}
                      disabled={qty >= product.stockAvailable}
                      aria-label={`Increase ${product.name} quantity`}
                      className="w-6 h-6 rounded-lg bg-white text-forest-900 font-bold flex items-center justify-center hover:bg-sage-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-ink-700">
                  <span>Estimated Total:</span>
                  <span className="text-sm font-black text-paddy-700">
                    ₹{totalCost.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => handleBuyProduct(product)}
                  disabled={outOfStock || qty > product.stockAvailable}
                  className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 text-harvest-400" />
                  <span>
                    {language === "ta"
                      ? "பெட்டகத்தில் சேர்க்க"
                      : outOfStock
                        ? "Out of Stock"
                        : "Place Demo Order"}
                  </span>
                </button>
                <button
                  onClick={() => handleBuyProduct(product)}
                  disabled={outOfStock || qty > product.stockAvailable}
                  className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 text-harvest-400" />
                  <span>
                    {language === "ta"
                      ? "டெமோ ஆர்டர் செய்யவும்"
                      : outOfStock
                        ? "Out of Stock"
                        : "Place Demo Order"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
