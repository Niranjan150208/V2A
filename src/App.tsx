import React from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AppLayout } from './components/layout/AppLayout';
import { VoiceAssistantModal } from './components/modals/VoiceAssistantModal';

// All 36 Route Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyFarmPage } from './pages/MyFarmPage';
import { CropPlannerPage } from './pages/CropPlannerPage';
import { SoilHealthPage } from './pages/SoilHealthPage';
import { WeatherPage } from './pages/WeatherPage';
import { BudgetPlannerPage } from './pages/BudgetPlannerPage';
import { SeedPassportPage } from './pages/SeedPassportPage';
import { InputMarketplacePage } from './pages/InputMarketplacePage';
import { InputLockerPage } from './pages/InputLockerPage';
import { MachineryPage } from './pages/MachineryPage';
import { LabourPage } from './pages/LabourPage';
import { FarmCalendarPage } from './pages/FarmCalendarPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { CropDoctorPage } from './pages/CropDoctorPage';
import { ExpertAdvicePage } from './pages/ExpertAdvicePage';
import { CropHealthPage } from './pages/CropHealthPage';
import { InsurancePage } from './pages/InsurancePage';
import { HarvestPage } from './pages/HarvestPage';
import { BuyerDiscoveryPage } from './pages/BuyerDiscoveryPage';
import { StoragePage } from './pages/StoragePage';
import { LogisticsPage } from './pages/LogisticsPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { BuyersPage } from './pages/BuyersPage';
import { OffersPage } from './pages/OffersPage';
import { NetProceedsPage } from './pages/NetProceedsPage';
import { SalesPage } from './pages/SalesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { FinancePage } from './pages/FinancePage';
import { SeasonComparisonPage } from './pages/SeasonComparisonPage';
import { NextSeasonPage } from './pages/NextSeasonPage';
import { SchemesPage } from './pages/SchemesPage';
import { CropJourneyPage } from './pages/CropJourneyPage';
import { ProfilePage } from './pages/ProfilePage';

const AppContent: React.FC = () => {
  const { currentRoute } = useNavigation();

  const renderRoute = () => {
    switch (currentRoute) {
      case '/':
        return <HomePage />;
      case '/login':
        return <LoginPage />;
      case '/onboarding':
        return <OnboardingPage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/my-farm':
        return <MyFarmPage />;
      case '/crop-planner':
        return <CropPlannerPage />;
      case '/soil-health':
        return <SoilHealthPage />;
      case '/weather':
        return <WeatherPage />;
      case '/budget-planner':
        return <BudgetPlannerPage />;
      case '/seed-passport':
        return <SeedPassportPage />;
      case '/input-marketplace':
        return <InputMarketplacePage />;
      case '/input-locker':
        return <InputLockerPage />;
      case '/machinery':
        return <MachineryPage />;
      case '/labour':
        return <LabourPage />;
      case '/farm-calendar':
        return <FarmCalendarPage />;
      case '/irrigation':
        return <IrrigationPage />;
      case '/crop-doctor':
        return <CropDoctorPage />;
      case '/expert-advice':
        return <ExpertAdvicePage />;
      case '/crop-health':
        return <CropHealthPage />;
      case '/insurance':
        return <InsurancePage />;
      case '/harvest':
        return <HarvestPage />;
      case '/buyer-discovery':
        return <BuyerDiscoveryPage />;
      case '/storage':
        return <StoragePage />;
      case '/logistics':
        return <LogisticsPage />;
      case '/market-prices':
        return <MarketPricesPage />;
      case '/buyers':
        return <BuyersPage />;
      case '/offers':
        return <OffersPage />;
      case '/net-proceeds':
        return <NetProceedsPage />;
      case '/sales':
        return <SalesPage />;
      case '/payments':
        return <PaymentsPage />;
      case '/finance':
        return <FinancePage />;
      case '/season-comparison':
        return <SeasonComparisonPage />;
      case '/next-season':
        return <NextSeasonPage />;
      case '/schemes':
        return <SchemesPage />;
      case '/crop-journey':
        return <CropJourneyPage />;
      case '/profile':
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
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;
