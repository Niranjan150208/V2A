import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "../types";
import { AppStore } from "../services/store";

export type AppRoute =
  | "/"
  | "/login"
  | "/onboarding"
  | "/dashboard"
  | "/my-farm"
  | "/crop-planner"
  | "/soil-health"
  | "/weather"
  | "/budget-planner"
  | "/seed-passport"
  | "/input-marketplace"
  | "/input-locker"
  | "/machinery"
  | "/labour"
  | "/farm-calendar"
  | "/irrigation"
  | "/crop-doctor"
  | "/expert-advice"
  | "/crop-health"
  | "/insurance"
  | "/harvest"
  | "/buyer-discovery"
  | "/storage"
  | "/logistics"
  | "/market-prices"
  | "/buyers"
  | "/offers"
  | "/net-proceeds"
  | "/sales"
  | "/payments"
  | "/finance"
  | "/season-comparison"
  | "/next-season"
  | "/schemes"
  | "/crop-journey"
  | "/profile";

interface NavigationContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeSeasonId: string;
  setActiveSeasonId: (id: string) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Read initial route from location hash or pathname
  const getInitialRoute = (): AppRoute => {
    const hash = window.location.hash.replace("#", "");
    if (hash && hash.startsWith("/")) {
      return hash as AppRoute;
    }
    const path = window.location.pathname;
    if (path && path !== "/" && path.length > 1) {
      return path as AppRoute;
    }
    return "/dashboard"; // Default to central dashboard for quick access
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [language, setLanguageState] = useState<Language>(
    () => AppStore.getState().language,
  );
  const [activeSeasonId, setActiveSeasonIdState] = useState<string>(
    () => AppStore.getState().activeSeasonId,
  );
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const navigate = (route: AppRoute) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setLanguage = (lang: Language) => {
    AppStore.setLanguage(lang);
    setLanguageState(lang);
    triggerRefresh();
  };

  const setActiveSeasonId = (id: string) => {
    AppStore.setActiveSeason(id);
    setActiveSeasonIdState(id);
    triggerRefresh();
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && hash.startsWith("/")) {
        setCurrentRoute(hash as AppRoute);
      } else {
        const path = window.location.pathname;
        setCurrentRoute(
          (path && path !== "/" ? path : "/dashboard") as AppRoute,
        );
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        navigate,
        language,
        setLanguage,
        activeSeasonId,
        setActiveSeasonId,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
