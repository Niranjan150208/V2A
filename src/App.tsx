import React, { useEffect } from "react";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { VoiceAssistantModal } from "./components/modals/VoiceAssistantModal";
import { LoginPage } from "./pages/LoginPage";
import { LoaderCircle } from "lucide-react";

// All 36 Route Pages
import { HomePage } from "./pages/HomePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MyFarmPage } from "./pages/MyFarmPage";
import { CropPlannerPage } from "./pages/CropPlannerPage";
import { SoilHealthPage } from "./pages/SoilHealthPage";
import { WeatherPage } from "./pages/WeatherPage";
import { BudgetPlannerPage } from "./pages/BudgetPlannerPage";
import { SeedPassportPage } from "./pages/SeedPassportPage";
import { InputMarketplacePage } from "./pages/InputMarketplacePage";
import { InputLockerPage } from "./pages/InputLockerPage";
import { MachineryPage } from "./pages/MachineryPage";
import { LabourPage } from "./pages/LabourPage";
import { FarmCalendarPage } from "./pages/FarmCalendarPage";
import { IrrigationPage } from "./pages/IrrigationPage";
import { CropDoctorPage } from "./pages/CropDoctorPage";
import { ExpertAdvicePage } from "./pages/ExpertAdvicePage";
import { CropHealthPage } from "./pages/CropHealthPage";
import { InsurancePage } from "./pages/InsurancePage";
import { HarvestPage } from "./pages/HarvestPage";
import { BuyerDiscoveryPage } from "./pages/BuyerDiscoveryPage";
import { StoragePage } from "./pages/StoragePage";
import { LogisticsPage } from "./pages/LogisticsPage";
import { MarketPricesPage } from "./pages/MarketPricesPage";
import { BuyersPage } from "./pages/BuyersPage";
import { OffersPage } from "./pages/OffersPage";
import { NetProceedsPage } from "./pages/NetProceedsPage";
import { SalesPage } from "./pages/SalesPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { FinancePage } from "./pages/FinancePage";
import { SeasonComparisonPage } from "./pages/SeasonComparisonPage";
import { NextSeasonPage } from "./pages/NextSeasonPage";
import { SchemesPage } from "./pages/SchemesPage";
import { CropJourneyPage } from "./pages/CropJourneyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AppStore } from "./services/store";

const AppContent: React.FC = () => {
  const { currentRoute, navigate } = useNavigation();
  const {
    session,
    demoMode,
    passwordRecovery,
    authInitialized,
    ready,
    setupError,
  } = useAuth();
  const accountState = AppStore.getState();
  const needsPersonalSetup =
    Boolean(session) &&
    accountState.currentUser.id === session?.user.id &&
    (accountState.farm.parcels.length === 0 ||
      accountState.farmer.totalLandAcres <= 0);

  useEffect(() => {
    if (!authInitialized || !ready) return;
    const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

    if (passwordRecovery) {
      if (import.meta.env.DEV) console.debug("[ROUTE] Opening password recovery.");
      if (currentRoute !== "/reset-password") navigate("/reset-password");
      return;
    }

    if (needsPersonalSetup) {
      if (import.meta.env.DEV) console.debug("[ROUTE] Authenticated account needs farm setup.");
      if (currentRoute !== "/onboarding") navigate("/onboarding");
      return;
    }

    if (session || demoMode) {
      if (import.meta.env.DEV) console.debug("[ROUTE] Authenticated/demo access accepted.");
      if (authRoutes.includes(currentRoute)) {
        if (import.meta.env.DEV) console.debug("[ROUTE] Navigating to /dashboard.");
        navigate("/dashboard");
      }
    } else {
      if (!authRoutes.includes(currentRoute)) {
        if (import.meta.env.DEV) console.debug("[ROUTE] Unauthenticated; redirecting to /login.");
        navigate("/login");
      }
    }
  }, [
    currentRoute,
    authInitialized,
    demoMode,
    navigate,
    needsPersonalSetup,
    passwordRecovery,
    ready,
    session,
  ]);

  if (!authInitialized || !ready) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-3 text-forest-900">
        <LoaderCircle className="h-8 w-8 animate-spin text-paddy-600" />
        <span className="text-sm font-semibold tracking-wide">
          Connecting securely to V2A…
        </span>
      </div>
    );
  }

  if (setupError && !demoMode) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl border border-terracotta-300 bg-white p-6 shadow-agro">
          <h1 className="text-lg font-bold text-forest-900">
            {session ? "Account data is unavailable" : "Cloud setup needs attention"}
          </h1>
          <p className="mt-2 text-sm text-ink-700">{setupError}</p>
          <p className="mt-3 text-xs text-ink-600">
            Check the Supabase environment variables and run the SQL setup in
            the cloud sync guide, then reload this page.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-forest-800 px-4 py-2 text-sm font-bold text-white hover:bg-forest-900"
            >
              Reload app
            </button>
            {!session && (
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-sage-300 bg-white px-4 py-2 text-sm font-bold text-forest-900 hover:bg-cream-100"
              >
                Continue to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // When not signed in and not in demo mode, display the public login screen without farmer sidebar
  if (!session && !demoMode) {
    return (
      <div className="min-h-screen bg-organic-waves py-8 px-4 flex flex-col justify-center">
        <LoginPage />
      </div>
    );
  }

  const renderRoute = () => {
    switch (currentRoute) {
      case "/":
        return <HomePage />;
      case "/login":
      case "/signup":
      case "/forgot-password":
      case "/reset-password":
        return <LoginPage />;
      case "/onboarding":
        return <OnboardingPage />;
      case "/dashboard":
        return <DashboardPage />;
      case "/my-farm":
        return <MyFarmPage />;
      case "/crop-planner":
        return <CropPlannerPage />;
      case "/soil-health":
        return <SoilHealthPage />;
      case "/weather":
        return <WeatherPage />;
      case "/budget-planner":
        return <BudgetPlannerPage />;
      case "/seed-passport":
        return <SeedPassportPage />;
      case "/input-marketplace":
        return <InputMarketplacePage />;
      case "/input-locker":
        return <InputLockerPage />;
      case "/machinery":
        return <MachineryPage />;
      case "/labour":
        return <LabourPage />;
      case "/farm-calendar":
        return <FarmCalendarPage />;
      case "/irrigation":
        return <IrrigationPage />;
      case "/crop-doctor":
        return <CropDoctorPage />;
      case "/expert-advice":
        return <ExpertAdvicePage />;
      case "/crop-health":
        return <CropHealthPage />;
      case "/insurance":
        return <InsurancePage />;
      case "/harvest":
        return <HarvestPage />;
      case "/buyer-discovery":
        return <BuyerDiscoveryPage />;
      case "/storage":
        return <StoragePage />;
      case "/logistics":
        return <LogisticsPage />;
      case "/market-prices":
        return <MarketPricesPage />;
      case "/buyers":
        return <BuyersPage />;
      case "/offers":
        return <OffersPage />;
      case "/net-proceeds":
        return <NetProceedsPage />;
      case "/sales":
        return <SalesPage />;
      case "/payments":
        return <PaymentsPage />;
      case "/finance":
        return <FinancePage />;
      case "/season-comparison":
        return <SeasonComparisonPage />;
      case "/next-season":
        return <NextSeasonPage />;
      case "/schemes":
        return <SchemesPage />;
      case "/crop-journey":
        return <CropJourneyPage />;
      case "/profile":
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AppLayout>
      {renderRoute()}
      <VoiceAssistantModal />
    </AppLayout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;
