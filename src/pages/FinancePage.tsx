import React, { useState } from "react";
import {
  PieChart,
  TrendingUp,
  CircleDollarSign,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  DollarSign,
  Edit3,
  Trash2,
  Receipt,
  Eye,
  X,
  Printer,
  Upload,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { Expense, ExpenseCategory } from "../types";
import { compressImageToDataUrl } from "../utils/images";

export const FinancePage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();
  const financials = AppStore.calculateSeasonFinancials(activeSeasonId);

  // Modals state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  // Filter state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [selectedFarmFilter, setSelectedFarmFilter] = useState<string>("ALL");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>("ALL");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [category, setCategory] = useState<ExpenseCategory>("Labour");
  const [description, setDescription] = useState("");
  const [tamilDescription, setTamilDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMode, setPaymentMode] = useState<"Cash" | "UPI" | "Credit / Due">("Cash");
  const [paidTo, setPaidTo] = useState("");
  const [farmId, setFarmId] = useState(state.farms[0]?.id || "");
  const [receiptPhotoUrl, setReceiptPhotoUrl] = useState("");
  const [receiptPhotoName, setReceiptPhotoName] = useState("");
  const [uploadError, setUploadError] = useState("");

  const categories: ExpenseCategory[] = [
    "Seeds",
    "Fertilizers",
    "Bio-Inputs",
    "Pesticides",
    "Labour",
    "Machinery",
    "Irrigation",
    "Electricity",
    "Transport",
    "Storage",
    "Packaging",
    "Other",
  ];

  const categoryTamilMap: Record<ExpenseCategory, string> = {
    Seeds: "விதை",
    Fertilizers: "உரம்",
    "Bio-Inputs": "உயிரி உரங்கள்",
    Pesticides: "பூச்சிக்கொல்லி",
    Labour: "கூலி",
    Machinery: "இயந்திர வாடகை",
    Irrigation: "நீர்ப்பாசனம்",
    Electricity: "மின்சாரம்",
    Transport: "போக்குவரத்து",
    Storage: "கிடங்கு",
    Packaging: "சிப்பமிடுதல்",
    Other: "பிற செலவுகள்",
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setCategory("Labour");
    setDescription("");
    setTamilDescription("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setPaymentMode("Cash");
    setPaidTo("");
    setFarmId(state.farms[0]?.id || "");
    setReceiptPhotoUrl("");
    setReceiptPhotoName("");
    setUploadError("");
    setShowExpenseModal(true);
  };

  const handleOpenEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setCategory(exp.category);
    setDescription(exp.description);
    setTamilDescription(exp.tamilDescription || "");
    setAmount(exp.amount.toString());
    setDate(exp.date);
    setPaymentMode(exp.paymentMode);
    setPaidTo(exp.paidTo || "");
    setFarmId(exp.farmId || state.farms[0]?.id || "");
    setReceiptPhotoUrl(exp.receiptPhotoUrl || "");
    setReceiptPhotoName(exp.receiptPhotoUrl ? "Attached Receipt" : "");
    setUploadError("");
    setShowExpenseModal(true);
  };

  const handlePhotoUpload = async (file?: File) => {
    if (!file) return;
    setUploadError("");
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file (JPEG, PNG, WebP).");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File exceeds 5MB limit. Please choose a smaller photo.");
      }
      const compressed = await compressImageToDataUrl(file);
      setReceiptPhotoUrl(compressed);
      setReceiptPhotoName(file.name);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to process receipt photo.");
    }
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const selectedFarm = state.farms.find((f) => f.id === farmId);

    if (editingExpense) {
      AppStore.editExpense(editingExpense.id, {
        category,
        description: description.trim(),
        tamilDescription: tamilDescription.trim() || undefined,
        amount: parsedAmount,
        date,
        paymentMode,
        paidTo: paidTo.trim() || "Field Vendor",
        farmId: selectedFarm?.id,
        farmName: selectedFarm?.name,
        receiptPhotoUrl: receiptPhotoUrl || undefined,
      });
    } else {
      AppStore.addExpense({
        seasonId: activeSeasonId,
        category,
        description: description.trim(),
        tamilDescription: tamilDescription.trim() || undefined,
        amount: parsedAmount,
        date,
        paymentMode,
        paidTo: paidTo.trim() || "Field Vendor",
        farmId: selectedFarm?.id,
        farmName: selectedFarm?.name,
        receiptPhotoUrl: receiptPhotoUrl || undefined,
      });
    }

    setShowExpenseModal(false);
    setSaveSuccess(true);
    window.setTimeout(() => setSaveSuccess(false), 2500);
    triggerRefresh();
  };

  const handleDeleteExpenseConfirm = () => {
    if (!deletingExpenseId) return;
    AppStore.deleteExpense(deletingExpenseId);
    setDeletingExpenseId(null);
    triggerRefresh();
  };

  // Filtered expense list
  const filteredExpenses = state.expenses.filter((exp) => {
    if (exp.seasonId !== activeSeasonId) return false;
    if (selectedCategoryFilter !== "ALL" && exp.category !== selectedCategoryFilter) {
      return false;
    }
    if (selectedFarmFilter !== "ALL" && exp.farmId !== selectedFarmFilter) {
      return false;
    }
    if (selectedMonthFilter !== "ALL") {
      const expMonth = exp.date.substring(0, 7); // YYYY-MM
      if (expMonth !== selectedMonthFilter) return false;
    }
    return true;
  });

  // Calculate unique months from expenses for filter dropdown
  const uniqueMonths = Array.from(
    new Set(state.expenses.filter((e) => e.seasonId === activeSeasonId).map((e) => e.date.substring(0, 7))),
  ).sort().reverse();

  // Profit/Loss Calculation
  const netProfit = financials.grossSales - financials.totalExpenses;
  const isProfitable = netProfit >= 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <PieChart className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "பண்ணை நிதி நிலை & கணக்கியல்"
                : "Comprehensive Farm Financial Ledger & P&L"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "பண்ணை வரவு-செலவு & லாப-நஷ்ட அறிக்கை"
              : "Farm Balance Sheet & Cashflow Audit"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "விதை முதல் விற்பனை வரை வெளிப்படையான செலவு மற்றும் நிகர லாப பகுப்பாய்வு"
              : "Category-wise expenditures, realized bank cashflow, and segregated buyer receivables"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-white border border-sage-300 hover:bg-sage-50 text-forest-900 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-forest-700" />
            <span className="hidden sm:inline">
              {language === "ta" ? "அறிக்கை அச்சிடு" : "Print Ledger"}
            </span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === "ta" ? "செலவு சேர்க்க" : "Record Expense"}
            </span>
          </button>
          <button
            onClick={() => navigate("/crop-journey")}
            className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro hover:bg-forest-900 transition-colors"
          >
            {language === "ta" ? "பயிர் பயணம்" : "Crop Passport"}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="rounded-2xl border border-paddy-300 bg-paddy-100 px-4 py-3 text-xs font-bold text-paddy-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Expense saved successfully for the active crop season.
        </div>
      )}

      {/* Main 5 Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Gross Sales */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            {language === "ta" ? "மொத்த விற்பனை வரவு" : "Gross Sales Invoiced"}
          </span>
          <p className="font-display font-black text-2xl sm:text-3xl text-forest-900">
            ₹{financials.grossSales.toLocaleString()}
          </p>
          <p className="text-xs text-paddy-700 font-medium">
            110 Bags contracted
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            {language === "ta" ? "மொத்த களச் செலவுகள்" : "Total Field Expenses"}
          </span>
          <p className="font-display font-black text-2xl sm:text-3xl text-terracotta-600">
            ₹{financials.totalExpenses.toLocaleString()}
          </p>
          <p className="text-xs text-ink-500">
            {state.expenses.length} Itemized records
          </p>
        </div>

        {/* Net Farm Profit/Loss */}
        <div
          className={`rounded-3xl p-5 border shadow-agro space-y-1 ${
            isProfitable
              ? "bg-paddy-50/60 border-paddy-300"
              : "bg-terracotta-50/60 border-terracotta-300"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900">
            {language === "ta" ? "நிகர லாபம் / நஷ்டம்" : "Net Farm P&L"}
          </span>
          <p
            className={`font-display font-black text-2xl sm:text-3xl ${
              isProfitable ? "text-paddy-700" : "text-terracotta-700"
            }`}
          >
            {isProfitable ? "+" : ""}₹{netProfit.toLocaleString()}
          </p>
          <p className="text-xs font-semibold text-ink-600">
            Gross Sales - Expenses
          </p>
        </div>

        {/* Realized Bank Cashflow */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            {language === "ta" ? "வங்கி கணக்கில் வந்த தொகை" : "Realized Cashflow"}
          </span>
          <p className="font-display font-black text-2xl sm:text-3xl text-paddy-700">
            ₹{financials.realizedCashflow.toLocaleString()}
          </p>
          <p className="text-xs text-forest-800 font-semibold">
            Bank Settled - Expenses
          </p>
        </div>

        {/* Pending Receivables */}
        <div className="bg-white rounded-3xl p-5 border-2 border-harvest-400 shadow-agro space-y-1 bg-harvest-50/40">
          <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
            {language === "ta" ? "நிலுவையில் உள்ள தொகை" : "Pending Buyer Dues"}
          </span>
          <p className="font-display font-black text-2xl sm:text-3xl text-terracotta-700">
            ₹{financials.pendingPayments.toLocaleString()}
          </p>
          <p className="text-[10px] text-ink-600 font-bold">
            ⚠ Excluded from bank cashflow
          </p>
        </div>
      </div>

      {/* Category-wise Expense Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-xl text-forest-900">
            {language === "ta"
              ? "செலவு வகை வாரியான பகுப்பாய்வு"
              : "Category-Wise Expense Distribution"}
          </h3>
          <span className="text-xs font-bold text-ink-500">
            Total: ₹{financials.totalExpenses.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(financials.expenseByCategory).map(
            ([catName, amt]) => {
              const pct = financials.totalExpenses > 0
                ? Math.round((amt / financials.totalExpenses) * 100)
                : 0;

              return (
                <div
                  key={catName}
                  onClick={() =>
                    setSelectedCategoryFilter(
                      selectedCategoryFilter === catName ? "ALL" : catName,
                    )
                  }
                  className={`p-3.5 rounded-2xl border text-center space-y-1 cursor-pointer transition-all ${
                    selectedCategoryFilter === catName
                      ? "bg-forest-800 text-cream-50 border-forest-900 shadow-md"
                      : "bg-cream-50 hover:bg-cream-100 border-sage-200"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase block truncate ${
                      selectedCategoryFilter === catName
                        ? "text-harvest-300"
                        : "text-ink-500"
                    }`}
                  >
                    {language === "ta"
                      ? categoryTamilMap[catName as ExpenseCategory] || catName
                      : catName}
                  </span>
                  <p
                    className={`font-display font-black text-base ${
                      selectedCategoryFilter === catName
                        ? "text-cream-50"
                        : "text-forest-900"
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </p>
                  <p
                    className={`text-[10px] font-bold ${
                      selectedCategoryFilter === catName
                        ? "text-paddy-300"
                        : "text-paddy-700"
                    }`}
                  >
                    {pct}% of total
                  </p>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Itemized Expense History with Filter Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-sage-200">
          <div>
            <h3 className="font-display font-bold text-xl text-forest-900">
              {language === "ta"
                ? "பதிவான அனைத்து செலவுகள்"
                : "Itemized Cultivation Expenses"}
            </h3>
            <p className="text-xs text-ink-500">
              Showing {filteredExpenses.length} of {state.expenses.length} records
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-ink-600 bg-cream-50 px-2.5 py-1.5 rounded-xl border border-sage-200">
              <Filter className="w-3.5 h-3.5 text-ink-400" />
              <span>Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-transparent font-bold text-forest-900 outline-none"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {state.farms.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs text-ink-600 bg-cream-50 px-2.5 py-1.5 rounded-xl border border-sage-200">
                <span>Farm:</span>
                <select
                  value={selectedFarmFilter}
                  onChange={(e) => setSelectedFarmFilter(e.target.value)}
                  className="bg-transparent font-bold text-forest-900 outline-none"
                >
                  <option value="ALL">All Farms</option>
                  {state.farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {uniqueMonths.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-ink-600 bg-cream-50 px-2.5 py-1.5 rounded-xl border border-sage-200">
                <span>Month:</span>
                <select
                  value={selectedMonthFilter}
                  onChange={(e) => setSelectedMonthFilter(e.target.value)}
                  className="bg-transparent font-bold text-forest-900 outline-none"
                >
                  <option value="ALL">All Months</option>
                  {uniqueMonths.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedCategoryFilter !== "ALL" ||
              selectedFarmFilter !== "ALL" ||
              selectedMonthFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSelectedCategoryFilter("ALL");
                  setSelectedFarmFilter("ALL");
                  setSelectedMonthFilter("ALL");
                }}
                className="text-xs font-bold text-terracotta-600 hover:underline px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center bg-cream-50 rounded-2xl border border-dashed border-sage-300">
            <p className="text-sm font-bold text-ink-600">
              {language === "ta"
                ? "செலவுப் பதிவுகள் எதுவும் இல்லை."
                : "No expense records matching the selected filters."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sage-200 text-xs">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cream-50/50 transition-colors rounded-xl px-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest-900 text-sm">
                      {language === "ta"
                        ? exp.tamilDescription || exp.description
                        : exp.description}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sage-100 text-forest-800">
                      {exp.category}
                    </span>
                    {exp.receiptPhotoUrl && (
                      <button
                        onClick={() => setPreviewReceiptUrl(exp.receiptPhotoUrl!)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-paddy-700 bg-paddy-50 border border-paddy-200 px-2 py-0.5 rounded-full hover:bg-paddy-100 transition-colors"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    )}
                  </div>
                  <p className="text-ink-500">
                    Date: <span className="font-semibold text-ink-700">{exp.date}</span>
                    {exp.farmName && (
                      <>
                        {" "}• Farm: <span className="font-semibold text-ink-700">{exp.farmName}</span>
                      </>
                    )}
                    {" "}• Paid via <span className="font-semibold text-paddy-700">{exp.paymentMode}</span>
                    {" "}to <span className="font-semibold text-ink-700">{exp.paidTo}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className="font-display font-black text-base text-terracotta-600">
                    ₹{exp.amount.toLocaleString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(exp)}
                      className="p-1.5 text-ink-400 hover:text-forest-800 hover:bg-sage-100 rounded-lg transition-colors"
                      title="Edit expense"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingExpenseId(exp.id)}
                      className="p-1.5 text-ink-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record or Edit Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-sage-200">
              <h3 className="font-display font-extrabold text-lg text-forest-900">
                {editingExpense
                  ? language === "ta"
                    ? "செலவு திருத்தம்"
                    : "Edit Cultivation Expense"
                  : language === "ta"
                    ? "புதிய செலவு பதிவு"
                    : "Log Cultivation Expense"}
              </h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="text-ink-400 hover:text-ink-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitExpense} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Expense Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c} ({categoryTamilMap[c]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Description (English)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="e.g. 5 bags Neem cake for basal dressing"
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Tamil Description (விருப்பமானது)
                </label>
                <input
                  type="text"
                  value={tamilDescription}
                  onChange={(e) => setTamilDescription(e.target.value)}
                  placeholder="எ.கா. அடி உரத்திற்காக 5 மூட்டை வேப்பம் புண்ணாக்கு"
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    placeholder="e.g. 3500"
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) =>
                      setPaymentMode(e.target.value as "Cash" | "UPI" | "Credit / Due")
                    }
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / Online</option>
                    <option value="Credit / Due">Credit / Due</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Paid To / Vendor
                  </label>
                  <input
                    type="text"
                    value={paidTo}
                    onChange={(e) => setPaidTo(e.target.value)}
                    placeholder="e.g. Cauvery Agro Agency"
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Associated Farm
                  </label>
                  <select
                    value={farmId}
                    onChange={(e) => setFarmId(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  >
                    {state.farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.totalAreaAcres} Acres)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Receipt Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Receipt / Bill Photo (Optional)
                </label>
                <label className="block border-2 border-dashed border-sage-300 rounded-2xl p-3 text-center bg-cream-50 hover:bg-cream-100 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-paddy-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-forest-900">
                    {receiptPhotoName || "Click to upload receipt photo"}
                  </p>
                  <p className="text-[10px] text-ink-500">Max 5MB (JPEG, PNG, WebP)</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => void handlePhotoUpload(e.target.files?.[0])}
                  />
                </label>
                {uploadError && (
                  <p className="text-xs text-terracotta-600 mt-1">{uploadError}</p>
                )}
                {receiptPhotoUrl && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={receiptPhotoUrl}
                      alt="Receipt Preview"
                      className="h-16 w-16 object-cover rounded-xl border border-sage-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptPhotoUrl("");
                        setReceiptPhotoName("");
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-terracotta-500 text-white rounded-full p-0.5 hover:bg-terracotta-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600 hover:bg-sage-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro hover:bg-forest-900 transition-colors"
                >
                  {editingExpense ? "Update Expense" : "Save to Ledger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingExpenseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-sage-300 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-terracotta-100 text-terracotta-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-extrabold text-base text-forest-900">
              {language === "ta" ? "செலவை நீக்க வேண்டுமா?" : "Delete Expense Record?"}
            </h3>
            <p className="text-xs text-ink-600">
              {language === "ta"
                ? "இந்த செலவுப் பதிவு கணக்கிலிருந்து நிரந்தரமாக நீக்கப்படும். இதை திரும்பப் பெற முடியாது."
                : "This expense record will be permanently deleted from your farm ledger. This action cannot be undone."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingExpenseId(null)}
                className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-700 hover:bg-sage-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExpenseConfirm}
                className="px-5 py-2 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Photo Preview Modal */}
      {previewReceiptUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setPreviewReceiptUrl(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-4 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-sage-200">
              <h4 className="font-bold text-sm text-forest-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-paddy-600" />
                <span>Expense Receipt Preview</span>
              </h4>
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="text-ink-400 hover:text-ink-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewReceiptUrl}
              alt="Receipt Full Preview"
              className="max-h-[70vh] w-full object-contain rounded-2xl bg-cream-50 border border-sage-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};
