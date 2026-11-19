import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  Mail,
  PlayCircle,
  Phone,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/brand/Logo";
import { AppStore } from "../services/store";

type AuthMode = "signin" | "signup" | "forgot" | "reset";

function friendlyAuthError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unable to connect right now. Please try again.";
  }

  const message = error.message.toLowerCase();
  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid_credentials")
  ) {
    return "Email or password is incorrect.";
  }
  if (
    message.includes("email not confirmed") ||
    message.includes("email_not_confirmed")
  ) {
    return "Please verify your email before signing in.";
  }
  if (
    message.includes("already registered") ||
    message.includes("user already registered")
  ) {
    return "An account with this email already exists. Sign in or reset your password.";
  }
  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("timeout")
  ) {
    return "Unable to connect right now. Please try again.";
  }
  if (message.includes("sync") || message.includes("offline")) {
    return "Your account was signed out, but changes may not have synced. Reconnect and sign in again to retry.";
  }
  if (
    message.includes("session") ||
    message.includes("recovery") ||
    message.includes("auth session missing")
  ) {
    return "This password reset link is invalid or has expired. Request a new one.";
  }
  return "We couldn't complete that request. Check your details and try again.";
}

export const LoginPage: React.FC = () => {
  const { navigate, language, currentRoute } = useNavigation();
  const {
    cloudEnabled,
    passwordRecovery,
    signIn,
    signUp,
    startDemo,
    sendPasswordReset,
    updatePassword,
  } = useAuth();
  const [selectedMode, setSelectedMode] = useState<AuthMode>("signin");
  const mode: AuthMode =
    passwordRecovery || currentRoute === "/reset-password"
      ? "reset"
      : currentRoute === "/forgot-password"
        ? "forgot"
        : currentRoute === "/signup"
          ? "signup"
          : selectedMode;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("9000000421");
  const [otp, setOtp] = useState("4210");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const changeMode = (nextMode: AuthMode) => {
    setSelectedMode(nextMode === "signup" ? "signup" : "signin");
    setError("");
    setNotice("");
    setPassword("");
    setConfirmPassword("");
    if (nextMode === "signup") navigate("/signup");
    else if (nextMode === "forgot") navigate("/forgot-password");
    else if (nextMode === "reset") navigate("/reset-password");
    else navigate("/login");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setNotice("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if ((mode === "signup" || mode === "reset") && password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (mode === "reset" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (cloudEnabled && mode === "signin") {
        await signIn(email.trim(), password);
        navigate("/dashboard");
      } else if (cloudEnabled && mode === "signup") {
        const { confirmationRequired } = await signUp(
          email.trim(),
          password,
          fullName.trim(),
        );
        if (confirmationRequired) {
          setNotice(
            "Account created successfully. Please check your email to verify your account.",
          );
          setSelectedMode("signin");
          navigate("/login");
        } else {
          navigate("/dashboard");
        }
      } else if (cloudEnabled && mode === "forgot") {
        await sendPasswordReset(email.trim());
        setNotice(
          "If an account exists for that email, a password reset link is on its way.",
        );
      } else if (cloudEnabled && mode === "reset") {
        await updatePassword(password);
        setNotice(
          "Password updated. You can now sign in with your new password.",
        );
        setPassword("");
        setConfirmPassword("");
        setSelectedMode("signin");
        setError("");
        navigate("/login");
      } else if (!cloudEnabled && mode === "signin") {
        if (phone !== "9000000421" || otp !== "4210") {
          setError(
            "Use the demo phone 9000000421 and demo OTP 4210. This is local demo access, not personal account authentication.",
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
      }
    } catch (authError) {
      if (import.meta.env.DEV) console.error("Authentication request failed", authError);
      setError(friendlyAuthError(authError));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    if (loading) return;
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await startDemo();
      AppStore.setCurrentUser({
        id: "USER-VIJAY-DEMO",
        phone: "9000000421",
        name: "VIJAY",
        tamilName: "விஜய்",
        role: "farmer",
      });
      navigate("/dashboard");
    } catch (demoError) {
      if (import.meta.env.DEV) console.error("Could not switch to demo", demoError);
      setError(friendlyAuthError(demoError));
    } finally {
      setLoading(false);
    }
  };

  const title = {
    signin: "Welcome back",
    signup: "Create your account",
    forgot: "Reset your password",
    reset: "Choose a new password",
  }[mode];
  const subtitle = {
    signin: "Sign in to continue to Vithai to Aruvadai.",
    signup: "Create a personal account for your farm workspace.",
    forgot: "Enter your account email and we’ll send a secure reset link.",
    reset: "Choose a new password for your V2A account.",
  }[mode];

  return (
    <div className="mx-auto max-w-5xl py-6 sm:py-10">
      <div className="overflow-hidden rounded-[2rem] border border-sage-200 bg-white shadow-agro md:grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-gradient-to-br from-forest-900 via-forest-900 to-paddy-800 p-10 text-white md:flex">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-5 -top-5 h-52 w-52 rounded-full border border-white/10" />
          <div className="relative">
            <Logo size="md" showTamil className="text-white" />
          </div>
          <div className="relative space-y-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-harvest-300">
              <Leaf className="h-7 w-7" />
            </div>
            <h1 className="max-w-sm font-display text-4xl font-extrabold leading-tight">
              From seed to harvest, all in one place.
            </h1>
            <p className="max-w-sm text-sm leading-6 text-sage-100">
              Plan crops, keep field records, and follow your harvest journey
              with a secure account.
            </p>
          </div>
          <p className="relative text-xs text-sage-200">
            VITHAI TO ARUVADAI · விதை முதல் அறுவடை வரை
          </p>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 md:hidden">
            <Logo size="md" showTamil />
          </div>
          <div className="mb-7">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-paddy-700">
              <Leaf className="h-4 w-4" />
              Secure farmer workspace
            </p>
            <h2 className="font-display text-3xl font-extrabold capitalize text-forest-950">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">{subtitle}</p>
          </div>

          {!cloudEnabled && (
            <div className="mb-5 rounded-2xl border border-harvest-300 bg-harvest-50 p-4">
              <p className="text-sm font-bold text-forest-900">
                Local demo mode
              </p>
              <p className="mt-1 text-xs leading-5 text-ink-600">
                Supabase is not configured here. Personal account sign-in and
                recovery are unavailable; use the separate demo account.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {cloudEnabled && mode === "signup" && (
              <div>
                <label
                  htmlFor="auth-full-name"
                  className="mb-1.5 block text-xs font-bold text-forest-900"
                >
                  Full name
                </label>
                <input
                  id="auth-full-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  minLength={2}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-sage-300 bg-cream-50 px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-paddy-600 focus:ring-2 focus:ring-paddy-200 disabled:opacity-60"
                />
              </div>
            )}

            {cloudEnabled && mode !== "reset" && (
              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-1.5 block text-xs font-bold text-forest-900"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-ink-400" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-sage-300 bg-cream-50 py-3 pl-10 pr-4 text-sm text-ink-900 outline-none transition focus:border-paddy-600 focus:ring-2 focus:ring-paddy-200 disabled:opacity-60"
                  />
                </div>
              </div>
            )}

            {!cloudEnabled && mode === "signin" && (
              <>
                <div>
                  <label
                    htmlFor="auth-demo-phone"
                    className="mb-1.5 block text-xs font-bold text-forest-900"
                  >
                    Demo phone number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-ink-400" />
                    <input
                      id="auth-demo-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="tel"
                      inputMode="numeric"
                      required
                      className="w-full rounded-xl border border-sage-300 bg-cream-50 py-3 pl-10 pr-4 text-sm text-ink-900 outline-none focus:border-paddy-600 focus:ring-2 focus:ring-paddy-200"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="auth-demo-otp"
                    className="mb-1.5 block text-xs font-bold text-forest-900"
                  >
                    Demo OTP
                  </label>
                  <input
                    id="auth-demo-otp"
                    type="text"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{4}"
                    maxLength={4}
                    required
                    className="w-full rounded-xl border border-sage-300 bg-cream-50 px-4 py-3 text-sm text-ink-900 outline-none focus:border-paddy-600 focus:ring-2 focus:ring-paddy-200"
                  />
                </div>
              </>
            )}

            {((cloudEnabled && ["signin", "signup", "reset"].includes(mode)) ||
              (!cloudEnabled && mode === "signin")) && (
              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-1.5 block text-xs font-bold text-forest-900"
                >
                  {mode === "reset" ? "New password" : "Password"}
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-ink-400" />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={
                      mode === "signin" ? "current-password" : "new-password"
                    }
                    minLength={cloudEnabled && mode !== "signin" ? 8 : undefined}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-sage-300 bg-cream-50 py-3 pl-10 pr-12 text-sm text-ink-900 outline-none transition focus:border-paddy-600 focus:ring-2 focus:ring-paddy-200 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-2.5 rounded-lg p-1.5 text-ink-500 hover:bg-sage-100 focus:outline-none focus:ring-2 focus:ring-paddy-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {cloudEnabled && mode === "signup" && (
                  <p className="mt-1.5 text-[11px] text-ink-500">
                    Use at least 8 characters.
                  </p>
                )}
              </div>
            )}

            {cloudEnabled && ["signup", "reset"].includes(mode) && (
              <div>
                <label
                  htmlFor="auth-confirm-password"
                  className="mb-1.5 block text-xs font-bold text-forest-900"
                >
                  Confirm {mode === "reset" ? "new " : ""}password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-ink-400" />
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-sage-300 bg-cream-50 py-3 pl-10 pr-12 text-sm text-ink-900 outline-none transition focus:border-paddy-600 focus:ring-2 focus:ring-paddy-200 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3 top-2.5 rounded-lg p-1.5 text-ink-500 hover:bg-sage-100 focus:outline-none focus:ring-2 focus:ring-paddy-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-terracotta-300 bg-terracotta-50 p-3 text-xs font-semibold text-terracotta-800"
              >
                {error}
              </p>
            )}
            {notice && (
              <p
                role="status"
                className="rounded-xl border border-paddy-300 bg-paddy-50 p-3 text-xs font-semibold text-paddy-800"
              >
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-forest-900 focus:outline-none focus:ring-2 focus:ring-paddy-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  {mode === "signin"
                    ? "Signing in..."
                    : mode === "signup"
                      ? "Creating account..."
                      : mode === "forgot"
                        ? "Sending reset link..."
                        : "Updating password..."}
                </>
              ) : (
                <>
                  {mode === "signin"
                    ? cloudEnabled
                      ? "Login"
                      : "Sign in to demo"
                    : mode === "signup"
                      ? "Create account"
                      : mode === "forgot"
                        ? "Send reset link"
                        : "Update password"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {cloudEnabled && mode === "signin" && (
            <button
              type="button"
              onClick={() => changeMode("forgot")}
              className="mt-4 w-full text-center text-xs font-semibold text-paddy-700 hover:underline focus:outline-none focus:ring-2 focus:ring-paddy-600"
            >
              Forgot password?
            </button>
          )}

          {cloudEnabled && (mode === "signin" || mode === "signup") && (
            <div className="mt-6 border-t border-sage-200 pt-5 text-center">
              <p className="mb-3 text-xs text-ink-500">
                Demo access is separate and uses local sample data.
              </p>
              <button
                type="button"
                onClick={() => void handleDemoAccess()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sage-400 bg-cream-100 px-4 py-3 text-sm font-bold text-forest-900 transition hover:bg-sage-100 focus:outline-none focus:ring-2 focus:ring-paddy-600 disabled:opacity-60"
              >
                <PlayCircle className="h-4 w-4" />
                Continue as demo user (VIJAY)
              </button>
            </div>
          )}

          <div className="mt-6 border-t border-sage-200 pt-5 text-center">
            {cloudEnabled && mode === "signin" && (
              <p className="text-xs text-ink-600">
                New to V2A?{" "}
                <button
                  type="button"
                  onClick={() => changeMode("signup")}
                  className="font-bold text-paddy-700 hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}
            {cloudEnabled && mode === "signup" && (
              <p className="text-xs text-ink-600">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => changeMode("signin")}
                  className="font-bold text-paddy-700 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {(mode === "forgot" || mode === "reset") && (
              <button
                type="button"
                onClick={() => changeMode("signin")}
                className="inline-flex items-center gap-1 text-xs font-bold text-paddy-700 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </button>
            )}
            {!cloudEnabled && (
              <p className="text-xs text-ink-600">
                {language === "ta"
                  ? "டெமோ விவசாயி: VIJAY · டெமோ OTP: 4210"
                  : "Demo farmer: VIJAY · Demo OTP: 4210"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
