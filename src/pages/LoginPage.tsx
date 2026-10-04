import React, { useState } from "react";
import { ArrowRight, Lock, Phone } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { Logo } from "../components/brand/Logo";
import { AppStore } from "../services/store";

export const LoginPage: React.FC = () => {
  const { navigate, language } = useNavigation();
  const [phone, setPhone] = useState("9000000421");
  const [otp, setOtp] = useState("4210");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone !== "9000000421" || otp !== "4210") {
      setError(
        "Use the demo phone 9000000421 and demo OTP 4210. This is not production authentication.",
      );
      return;
    }
    AppStore.setCurrentUser({
      id: "USER-VIJAY-DEMO",
      phone,
      name: "VIJAY",
      tamilName: "விஜய்",
      role: "farmer",
    });
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 border border-sage-300 shadow-agro space-y-6">
        <div className="text-center space-y-2">
          <Logo size="md" showTamil={true} className="justify-center" />
          <h2 className="font-display font-extrabold text-2xl text-forest-900 pt-2">
            {language === "ta"
              ? "விஜய் டெமோ விவசாயி உள்நுழைவு"
              : "Demo Farmer Sign-In"}
          </h2>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "உங்கள் அலைபேசி எண் மூலம் OTP முறையில் பாதுகாப்பாக நுழையுங்கள்"
              : "Sign in to the local VIJAY demo account. No SMS or identity verification is performed."}
          </p>
        </div>

        <div className="p-3 bg-cream-100 rounded-2xl border border-sage-300 space-y-2">
          <p className="text-center text-sm font-bold text-forest-900">
            Demo user: VIJAY
          </p>
          <p className="text-center text-[11px] text-ink-600">
            Demo phone: 9000000421 · Demo OTP: 4210
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              {language === "ta"
                ? "அலைபேசி எண் (Mobile Number)"
                : "Registered Mobile Number"}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
                autoComplete="tel"
                required
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sage-300 rounded-xl text-sm font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              {language === "ta"
                ? "OTP கடவுச்சொல் (One-Time Password)"
                : "One-Time Password (OTP)"}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{4}"
                maxLength={4}
                required
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sage-300 rounded-xl text-sm font-bold tracking-widest text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
              />
            </div>
            <p className="text-[10px] text-paddy-700 font-medium mt-1">
              ✓ {language === "ta" ? "டெமோ OTP: 4210" : "Demo OTP: 4210"}
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-terracotta-300 bg-terracotta-50 p-3 text-xs font-semibold text-terracotta-800"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold rounded-xl shadow-agro transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>
              {language === "ta" ? "பாதுகாப்பாக நுழைக" : "Sign In to V2A"}
            </span>
            <ArrowRight className="w-4 h-4 text-harvest-400" />
          </button>
        </form>

        <div className="pt-2 border-t border-sage-200 text-center">
          <p className="text-xs text-ink-600">
            {language === "ta"
              ? "புதிய விவசாயியா?"
              : "New to VITHAI TO ARUVADAI?"}{" "}
            <button
              onClick={() => navigate("/onboarding")}
              className="font-bold text-paddy-700 hover:underline"
            >
              {language === "ta"
                ? "இப்போதே பதிவு செய்யுங்கள்"
                : "Start Farmer Onboarding"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
