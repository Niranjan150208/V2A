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
  Phone,
  MapPin,
  Tag,
  Trash2,
  Edit,
  X,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { InputProduct } from "../types";

const MARKETPLACE_CATEGORIES = [
  "All",
  "Seeds",
  "Fertilizers",
  "Organic inputs",
  "Farming tools",
  "Irrigation equipment",
  "Machinery",
  "Other agricultural products",
];

const LOCATIONS = [
  "All Locations",
  "Thanjavur",
  "Tiruvarur",
  "Mayiladuthurai",
  "Tiruchirappalli",
  "Madurai",
  "Coimbatore",
];

export const InputMarketplacePage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [sortOption, setSortOption] = useState<"default" | "lowToHigh" | "highToLow">("default");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState<InputProduct | null>(null);
  const [showEditModal, setShowEditModal] = useState<InputProduct | null>(null);

  // Form State
  const [productForm, setProductForm] = useState({
    name: "",
    tamilName: "",
    category: "Organic inputs" as any,
    brand: "",
    description: "",
    pricePerUnit: 450,
    unit: "kg" as any,
    stockAvailable: 25,
    supplierName: state.currentUser.name || "Agro Dealer",
    sellerContact: state.currentUser.phone || "9842100000",
    sellerLocation: state.farmer.district || "Thanjavur",
    dosageRecommendation: "Apply 2 kg per acre",
    certifiedOrganic: true,
  });

  // Filter & Sort
  const filteredProducts = state.inputProducts.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === "Organic inputs" && p.category.includes("Organic")) ||
      (selectedCategory === "Fertilizers" && (p.category.includes("Fertilizer") || p.category.includes("NPK")));

    const matchesLocation =
      selectedLocation === "All Locations" ||
      (p as any).sellerLocation?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tamilName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLocation && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "lowToHigh") return a.pricePerUnit - b.pricePerUnit;
    if (sortOption === "highToLow") return b.pricePerUnit - a.pricePerUnit;
    return 0;
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

  const handleOrderProduct = (product: InputProduct) => {
    const qty = getQty(product.id);
    if (product.stockAvailable < qty || product.stockAvailable <= 0) return;
    const totalCost = product.pricePerUnit * qty;
    const confirmed = window.confirm(
      `Confirm order request for ${qty} ${product.unit} of ${product.name} (₹${totalCost.toLocaleString()})? No online card deduction will occur. Payment is made on delivery.`,
    );
    if (!confirmed) return;

    // Record order in input purchases
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
      batchNumber: `INP-${Date.now().toString().slice(-6)}`,
      supplier: product.supplierName,
      isUsedInField: false,
      notes: "Ordered from Agro Input Marketplace. Settled on delivery.",
    });

    // Record expense in season ledger
    AppStore.addExpense({
      seasonId: activeSeasonId,
      category: product.category.includes("Fertilizer")
        ? "Fertilizers"
        : product.category.includes("Seeds")
          ? "Seeds"
          : "Bio-Inputs",
      description: `${product.name} (${qty} ${product.unit})`,
      amount: totalCost,
      date: new Date().toISOString().split("T")[0],
      paymentMode: "Credit / Due",
      paidTo: product.supplierName,
    });

    // Reduce stock
    AppStore.updateInputProduct(product.id, {
      stockAvailable: Math.max(0, product.stockAvailable - qty),
    });

    setAddedItemName(product.name);
    triggerRefresh();
    setTimeout(() => {
      setAddedItemName(null);
    }, 2500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    AppStore.addInputProduct({
      name: productForm.name.trim(),
      tamilName: productForm.tamilName.trim() || productForm.name.trim(),
      category: productForm.category,
      brand: productForm.brand.trim() || "Local Agro",
      dosageRecommendation: productForm.dosageRecommendation,
      suitableCrops: ["Paddy", "Pulses", "Millets"],
      unit: productForm.unit,
      pricePerUnit: Number(productForm.pricePerUnit),
      stockAvailable: Number(productForm.stockAvailable),
      certifiedOrganic: Boolean(productForm.certifiedOrganic),
      supplierName: productForm.supplierName.trim(),
      rating: 4.8,
      description: productForm.description.trim(),
    });

    setShowCreateModal(false);
    triggerRefresh();
  };

  const handleOpenEdit = (p: InputProduct) => {
    setShowEditModal(p);
    setProductForm({
      name: p.name,
      tamilName: p.tamilName,
      category: p.category as any,
      brand: p.brand,
      description: p.description,
      pricePerUnit: p.pricePerUnit,
      unit: p.unit as any,
      stockAvailable: p.stockAvailable,
      supplierName: p.supplierName,
      sellerContact: (p as any).sellerContact || "9842100000",
      sellerLocation: (p as any).sellerLocation || "Thanjavur",
      dosageRecommendation: p.dosageRecommendation,
      certifiedOrganic: p.certifiedOrganic,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;

    AppStore.updateInputProduct(showEditModal.id, {
      name: productForm.name,
      tamilName: productForm.tamilName,
      category: productForm.category,
      brand: productForm.brand,
      description: productForm.description,
      pricePerUnit: Number(productForm.pricePerUnit),
      unit: productForm.unit,
      stockAvailable: Number(productForm.stockAvailable),
      supplierName: productForm.supplierName,
      dosageRecommendation: productForm.dosageRecommendation,
      certifiedOrganic: Boolean(productForm.certifiedOrganic),
    });

    setShowEditModal(null);
    triggerRefresh();
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to remove this product listing?")) {
      AppStore.deleteInputProduct(id);
      triggerRefresh();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4 text-paddy-600" />
            <span>Agricultural Input Marketplace</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "விவசாய உள்ளீடுகள் அங்காடி"
              : "Agri Inputs, Bio-Fertilizers & Tools"}
          </h1>
          <p className="text-xs text-ink-500">
            Source bio-fertilizers, neem pesticides, seeds, and equipment directly from certified dealers and farmer collectives.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-paddy-700 hover:bg-paddy-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Supply Listing</span>
          </button>

          <button
            onClick={() => navigate("/input-locker")}
            className="px-4 py-2 bg-white border border-sage-300 text-forest-900 font-bold text-xs rounded-xl hover:bg-cream-100 shadow-sm"
          >
            Input Locker
          </button>
        </div>
      </div>

      {/* Honest Order Notice Banner */}
      <div className="p-4 bg-cream-100 rounded-2xl border-l-4 border-harvest-500 text-xs text-forest-900 flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-harvest-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Transparent Farm Procurement Notice:</p>
          <p className="text-ink-600 leading-relaxed">
            Placing an order reserves the input with the designated supplier and automatically itemizes the cost into your current season expense ledger. No automated bank debit or payment gateway fee occurs online.
          </p>
        </div>
      </div>

      {/* Search, Category, Location & Sort Filters */}
      <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by input name, brand, or crop..."
              className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs sm:text-sm font-semibold text-forest-900 focus:outline-none focus:border-paddy-600"
            />
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900 focus:outline-none"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Price */}
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900 focus:outline-none"
            >
              <option value="default">Sort: Recommended</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? "bg-forest-800 text-harvest-300 shadow-sm"
                  : "bg-cream-100 text-ink-700 hover:bg-cream-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification Banner */}
      {addedItemName && (
        <div className="p-4 bg-paddy-100 border border-paddy-400 text-paddy-900 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-paddy-700" />
          <span>
            Order placed for <strong>{addedItemName}</strong>! Added to your Input Locker and recorded in your seasonal expense ledger.
          </span>
        </div>
      )}

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-sage-300 shadow-agro space-y-3">
          <ShoppingBag className="w-10 h-10 text-sage-400 mx-auto" />
          <h4 className="font-bold text-base text-forest-900">No products match your criteria</h4>
          <p className="text-xs text-ink-500">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => {
            const qty = getQty(product.id);
            const inStock = product.stockAvailable > 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro flex flex-col justify-between space-y-4 hover:border-paddy-500 transition-all"
              >
                <div className="space-y-3">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2 py-0.5 rounded-lg border border-paddy-200">
                      {product.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {product.certifiedOrganic && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span>Organic</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="text-ink-400 hover:text-forest-900 p-1 rounded"
                        title="Edit Listing"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-ink-400 hover:text-red-700 p-1 rounded"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-extrabold text-lg text-forest-900">
                      {product.name}
                    </h3>
                    <p className="text-xs text-ink-500 font-tamil">{product.tamilName}</p>
                    <p className="text-xs text-ink-600 font-medium mt-1">Brand: {product.brand}</p>
                  </div>

                  <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200 text-xs space-y-1">
                    <p className="text-ink-500">
                      Dosage: <span className="font-bold text-forest-900">{product.dosageRecommendation}</span>
                    </p>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-sage-200">
                      <span className="text-ink-600 font-medium flex items-center gap-1">
                        <Store className="w-3 h-3 text-paddy-700" />
                        <span>{product.supplierName}</span>
                      </span>
                      <span className={`font-bold ${inStock ? "text-paddy-700" : "text-red-600"}`}>
                        {inStock ? `${product.stockAvailable} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price, Qty and Order Action */}
                <div className="pt-3 border-t border-sage-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-ink-500 uppercase block">Price</span>
                      <p className="font-display font-black text-xl text-forest-900">
                        ₹{product.pricePerUnit}
                        <span className="text-xs font-normal text-ink-500"> / {product.unit}</span>
                      </p>
                    </div>

                    {inStock && (
                      <div className="flex items-center gap-2 bg-cream-100 rounded-xl p-1 border border-sage-300">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, -1)}
                          disabled={qty <= 1}
                          className="w-7 h-7 flex items-center justify-center font-bold text-forest-900 hover:bg-white rounded-lg disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-forest-900 w-6 text-center">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, 1)}
                          disabled={qty >= product.stockAvailable}
                          className="w-7 h-7 flex items-center justify-center font-bold text-forest-900 hover:bg-white rounded-lg disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOrderProduct(product)}
                      disabled={!inStock}
                      className="flex-1 py-2.5 bg-forest-800 hover:bg-forest-900 disabled:bg-sage-200 disabled:text-ink-400 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all"
                    >
                      {inStock ? `Order ${qty} ${product.unit}` : "Sold Out"}
                    </button>

                    <button
                      onClick={() => setShowContactModal(product)}
                      className="px-3 py-2.5 bg-cream-100 hover:bg-cream-200 text-forest-900 border border-sage-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
                      title="Contact Supplier"
                    >
                      <Phone className="w-3.5 h-3.5 text-paddy-700" />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE LISTING MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sage-300 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <h3 className="font-display font-bold text-lg text-forest-900">Post Agricultural Supply Listing</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-ink-500 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-ink-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                    placeholder="e.g. Pseudomonas fluorescens Bio-Fungicide"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    {MARKETPLACE_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                    placeholder="e.g. TNAU Agri Biotech"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.pricePerUnit}
                    onChange={(e) => setProductForm({ ...productForm, pricePerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Unit</label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="bag (50kg)">bag (50kg)</option>
                    <option value="packet">packet</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.stockAvailable}
                    onChange={(e) => setProductForm({ ...productForm, stockAvailable: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Description & Usage</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  placeholder="Recommended dosage, application instructions, suitable crops..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.supplierName}
                    onChange={(e) => setProductForm({ ...productForm, supplierName: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={productForm.sellerContact}
                    onChange={(e) => setProductForm({ ...productForm, sellerContact: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organicCheck"
                  checked={productForm.certifiedOrganic}
                  onChange={(e) => setProductForm({ ...productForm, certifiedOrganic: e.target.checked })}
                  className="rounded text-paddy-600"
                />
                <label htmlFor="organicCheck" className="font-semibold text-ink-700">
                  Certified Organic / Bio-Input
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl text-ink-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-paddy-700 hover:bg-paddy-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sage-300 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <h3 className="font-display font-bold text-lg text-forest-900">Edit Supply Listing</h3>
              <button onClick={() => setShowEditModal(null)} className="text-ink-500 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.pricePerUnit}
                    onChange={(e) => setProductForm({ ...productForm, pricePerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Available Stock</label>
                  <input
                    type="number"
                    value={productForm.stockAvailable}
                    onChange={(e) => setProductForm({ ...productForm, stockAvailable: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2 border border-sage-300 rounded-xl text-ink-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold rounded-xl shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTACT SELLER MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-sage-300 shadow-2xl text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-sage-200">
              <h4 className="font-bold text-forest-900 text-sm">Seller Information</h4>
              <button onClick={() => setShowContactModal(null)} className="text-ink-400 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-16 h-16 rounded-full bg-paddy-100 text-paddy-800 font-black text-2xl mx-auto flex items-center justify-center border-2 border-paddy-300">
              {showContactModal.supplierName.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <h3 className="font-bold text-base text-forest-900">{showContactModal.supplierName}</h3>
              <p className="text-xs text-ink-500">{showContactModal.brand} Authorized Supplier</p>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 text-xs space-y-2 text-left">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-paddy-700" />
                <span className="font-bold text-forest-900">+91 {(showContactModal as any).sellerContact || "98421 04912"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-paddy-700" />
                <span className="text-ink-700">{(showContactModal as any).sellerLocation || "Thanjavur"}, Tamil Nadu</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${(showContactModal as any).sellerContact || "9842104912"}`}
                className="flex-1 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Seller</span>
              </a>
              <a
                href={`https://wa.me/91${(showContactModal as any).sellerContact || "9842104912"}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
