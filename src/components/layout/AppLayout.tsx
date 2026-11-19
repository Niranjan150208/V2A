import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Sprout,
  Calendar,
  Activity,
  Wheat,
  ShoppingBag,
  CircleDollarSign,
  ScrollText,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Languages,
  Mic,
  Wifi,
  CloudSun,
  ShieldCheck,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Tractor,
  Users,
  Droplets,
  Stethoscope,
  HelpCircle,
  Satellite,
  Warehouse,
  Truck,
  TrendingUp,
  Store,
  Tag,
  Receipt,
  CreditCard,
  PieChart,
  GitCompare,
  RotateCw,
  Landmark,
  LogIn,
  LogOut,
  UserPlus,
  PlayCircle,
  Bell,
} from "lucide-react";
import { useNavigation, AppRoute } from "../../context/NavigationContext";
import { Logo } from "../brand/Logo";
import { translations } from "../../translations";
import { AppStore } from "../../services/store";
import { useAuth } from "../../context/AuthContext";
import { NotificationsModal } from "./NotificationsModal";

interface NavItem {
  id: string;
  route: AppRoute;
  labelKey: keyof typeof translations.en.nav;
  icon: React.ElementType;
  badge?: string;
  highlight?: boolean;
}

interface NavGroup {
  groupKey: keyof typeof translations.en.sections;
  items: NavItem[];
}

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    currentRoute,
    navigate,
    language,
    setLanguage,
    activeSeasonId,
    setActiveSeasonId,
    setIsVoiceModalOpen,
  } = useNavigation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const { session, demoMode, signOut } = useAuth();
  const [syncStatus, setSyncStatus] = useState(AppStore.getSyncStatus());
  const [signOutError, setSignOutError] = useState("");
  const [syncRetrying, setSyncRetrying] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => AppStore.subscribeToSyncStatus(setSyncStatus), []);

  const handleSignOut = async () => {
    setSignOutError("");
    try {
      const warning = await signOut();
      navigate("/login");
      if (warning) setSignOutError(warning);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Sign out did not complete", error);
      setSignOutError(
        error instanceof Error ? error.message : "We couldn't complete sign-out. Please try again.",
      );
    }
  };

  const retryCloudSync = async () => {
    setSyncRetrying(true);
    setSignOutError("");
    try {
      await AppStore.flushCloudSync();
    } catch (error) {
      setSignOutError(
        error instanceof Error ? error.message : "Cloud sync failed. Please try again.",
      );
    } finally {
      setSyncRetrying(false);
    }
  };

  const t = translations[language];
  const state = AppStore.getState();
  const activeSeason =
    state.seasons.find((s) => s.id === activeSeasonId) ||
    state.seasons[0] || {
      id: "CR-DEFAULT",
      seasonCode: "CR-DEFAULT",
      cropName: "Paddy (Samba)",
      variety: "CR 1009 Sub 1",
      tamilCropName: "நெல்",
    };

  const navGroups: NavGroup[] = [
    {
      groupKey: "planning",
      items: [
        {
          id: "dash",
          route: "/dashboard",
          labelKey: "dashboard",
          icon: LayoutDashboard,
        },
        { id: "farm", route: "/my-farm", labelKey: "myFarm", icon: Layers },
        {
          id: "planner",
          route: "/crop-planner",
          labelKey: "cropPlanner",
          icon: Sprout,
        },
        {
          id: "soil",
          route: "/soil-health",
          labelKey: "soilHealth",
          icon: Activity,
          badge: "Demo",
        },
        {
          id: "weather",
          route: "/weather",
          labelKey: "weather",
          icon: CloudSun,
        },
        {
          id: "budget",
          route: "/budget-planner",
          labelKey: "budgetPlanner",
          icon: FileSpreadsheet,
        },
      ],
    },
    {
      groupKey: "inputs",
      items: [
        {
          id: "seed",
          route: "/seed-passport",
          labelKey: "seedPassport",
          icon: ShieldCheck,
          badge: "QR",
          highlight: true,
        },
        {
          id: "market",
          route: "/input-marketplace",
          labelKey: "inputMarketplace",
          icon: ShoppingBag,
        },
        {
          id: "locker",
          route: "/input-locker",
          labelKey: "inputLocker",
          icon: Store,
        },
      ],
    },
    {
      groupKey: "operations",
      items: [
        {
          id: "machinery",
          route: "/machinery",
          labelKey: "machinery",
          icon: Tractor,
        },
        { id: "labour", route: "/labour", labelKey: "labour", icon: Users },
        {
          id: "calendar",
          route: "/farm-calendar",
          labelKey: "farmCalendar",
          icon: Calendar,
        },
        {
          id: "irrigation",
          route: "/irrigation",
          labelKey: "irrigation",
          icon: Droplets,
        },
      ],
    },
    {
      groupKey: "cropCare",
      items: [
        {
          id: "doctor",
          route: "/crop-doctor",
          labelKey: "cropDoctor",
          icon: Stethoscope,
          badge: "Demo",
        },
        {
          id: "expert",
          route: "/expert-advice",
          labelKey: "expertAdvice",
          icon: HelpCircle,
        },
        {
          id: "health",
          route: "/crop-health",
          labelKey: "cropHealth",
          icon: Satellite,
        },
        {
          id: "insurance",
          route: "/insurance",
          labelKey: "insurance",
          icon: ShieldCheck,
        },
      ],
    },
    {
      groupKey: "harvest",
      items: [
        { id: "harvest", route: "/harvest", labelKey: "harvest", icon: Wheat },
        {
          id: "storage",
          route: "/storage",
          labelKey: "storage",
          icon: Warehouse,
        },
        {
          id: "logistics",
          route: "/logistics",
          labelKey: "logistics",
          icon: Truck,
        },
      ],
    },
    {
      groupKey: "market",
      items: [
        {
          id: "mandi",
          route: "/market-prices",
          labelKey: "marketPrices",
          icon: TrendingUp,
        },
        {
          id: "discovery",
          route: "/buyer-discovery",
          labelKey: "buyerDiscovery",
          icon: Store,
        },
        { id: "buyers", route: "/buyers", labelKey: "buyers", icon: UserCheck },
        {
          id: "offers",
          route: "/offers",
          labelKey: "offers",
          icon: Tag,
          badge: "Bids",
        },
        {
          id: "proceeds",
          route: "/net-proceeds",
          labelKey: "netProceeds",
          icon: CircleDollarSign,
        },
        { id: "sales", route: "/sales", labelKey: "sales", icon: Receipt },
        {
          id: "payments",
          route: "/payments",
          labelKey: "payments",
          icon: CreditCard,
          badge: "Dues",
        },
      ],
    },
    {
      groupKey: "finance",
      items: [
        {
          id: "finance",
          route: "/finance",
          labelKey: "finance",
          icon: PieChart,
        },
        {
          id: "compare",
          route: "/season-comparison",
          labelKey: "seasonComparison",
          icon: GitCompare,
        },
        {
          id: "next",
          route: "/next-season",
          labelKey: "nextSeason",
          icon: RotateCw,
        },
        {
          id: "schemes",
          route: "/schemes",
          labelKey: "schemes",
          icon: Landmark,
          badge: "Govt",
        },
      ],
    },
    {
      groupKey: "signature",
      items: [
        {
          id: "journey",
          route: "/crop-journey",
          labelKey: "cropJourney",
          icon: ScrollText,
          badge: "Signature",
          highlight: true,
        },
      ],
    },
  ];

  const handleNavClick = (route: AppRoute) => {
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-organic-waves">
      {/* Top Banner / Announcement */}
      <div className="bg-forest-900 text-cream-100 text-xs py-1.5 px-4 flex items-center justify-between border-b border-forest-800">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {demoMode ? (
            <span className="bg-amber-400 text-forest-950 font-extrabold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-forest-950" />
              DEMO MODE • VIJAY
            </span>
          ) : (
            <span className="bg-harvest-500 text-forest-950 font-bold px-1.5 py-0.2 rounded text-[10px]">
              {t.app.betaBadge}
            </span>
          )}
          <span className="hidden sm:inline font-medium">
            {demoMode
              ? language === "ta"
                ? "டெமோ முறை: மாதிரி தரவு மட்டுமே · கிளவுட் சேமிப்பு இல்லை"
                : "Hackathon Demonstration Mode • Local Browser Data Only • No Cloud Sync"
              : language === "ta"
                ? "விதை முதல் அறுவடை வரை: தமிழக விவசாயிகளுக்கான ஒருங்கிணைந்த தளம்"
                : "Cauvery Delta Pilot: Full Seed-to-Settlement Lifecycle Active"}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-sage-300 text-[11px]">
            <Wifi
              className={`w-3.5 h-3.5 ${
                demoMode
                  ? "text-amber-400"
                  : syncStatus === "error"
                    ? "text-terracotta-300"
                    : syncStatus === "offline"
                      ? "text-amber-300"
                      : "text-paddy-400"
              }`}
            />
            <span className="hidden md:inline font-medium">
              {demoMode
                ? "DEMO (Local only)"
                : syncStatus === "syncing"
                  ? "Saving to cloud…"
                  : syncStatus === "synced"
                    ? "Cloud Synced"
                    : syncStatus === "offline"
                      ? "Offline • Local cache active"
                      : syncStatus === "error"
                        ? "Sync Error"
                        : "Cloud Ready"}
            </span>
            {!demoMode && (syncStatus === "error" || syncStatus === "offline") && (
                        <button
                          type="button"
                          onClick={() => void retryCloudSync()}
                          disabled={syncRetrying}
                          className="inline-flex items-center gap-1 rounded-md border border-sage-500/40 px-2 py-1 text-[10px] font-bold text-cream-50 hover:bg-white/10 disabled:opacity-60"
                          aria-label="Retry cloud sync"
                        >
                          <RotateCw className={`h-3 w-3 ${syncRetrying ? "animate-spin" : ""}`} />
                          Retry
                        </button>
            )}
          </div>
          <button
            onClick={() => setLanguage(language === "en" ? "ta" : "en")}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-forest-800 hover:bg-forest-700 text-harvest-300 font-bold text-xs border border-forest-700 transition-colors"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === "en" ? "தமிழ்" : "English"}</span>
          </button>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sage-300 shadow-sm px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-forest-800 hover:bg-sage-100 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left focus:outline-none focus:ring-2 focus:ring-forest-600 rounded-xl p-1"
            >
              <Logo size="md" showTamil={true} />
            </button>
          </div>

          {/* Quick Actions & Header Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Active Season Dropdown */}
            <div className="hidden sm:flex items-center gap-2 bg-cream-200 border border-sage-400/80 rounded-2xl px-3 py-1.5 shadow-sm">
              <Sprout className="w-4 h-4 text-paddy-600" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider">
                  {language === "ta" ? "நடப்பு பருவம்" : "Active Season"}
                </span>
                <select
                  value={activeSeasonId}
                  onChange={(e) => setActiveSeasonId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-forest-900 border-none outline-none cursor-pointer pr-2"
                >
                  {state.seasons.length > 0 ? (
                    state.seasons.map((s) => (
                      <option key={s.id} value={s.id}>
                        {language === "ta"
                          ? s.tamilCropName || s.cropName
                          : s.cropName}{" "}
                        ({s.variety.split("(")[0]})
                      </option>
                    ))
                  ) : (
                    <option value="">No Active Seasons</option>
                  )}
                </select>
              </div>
            </div>

            {/* Voice Assistant Mic Button */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-forest-800 hover:bg-forest-700 text-harvest-400 font-semibold text-xs rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
              title={t.actions.voicePrompt}
            >
              <Mic className="w-4 h-4 text-harvest-400 animate-pulse" />
              <span className="hidden md:inline font-bold">
                {language === "ta" ? "குரல் உதவி" : "Voice Assistant"}
              </span>
            </button>

            {/* Quick Demo Walkthrough Button */}
            <button
              onClick={() => navigate("/crop-journey")}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-harvest-400 hover:bg-harvest-500 text-forest-950 font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <PlayCircle className="w-4 h-4 text-forest-900" />
              <span>{language === "ta" ? "முழு பயணம்" : "Full Journey"}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-forest-800 hover:bg-sage-100 rounded-xl transition-colors border border-sage-300"
              title="Notifications & Alerts"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-forest-800" />
              {(state.notifications || []).filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {(state.notifications || []).filter((n) => !n.read).length > 9
                    ? "9+"
                    : (state.notifications || []).filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {/* Farmer Avatar & Profile Link */}
            {(session || demoMode) && (
              <button
                onClick={() => void handleSignOut()}
                aria-label={demoMode ? "Exit demo mode" : "Sign out"}
                title={demoMode ? "Exit demo mode" : "Sign out"}
                className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold text-ink-600 hover:bg-sage-100 hover:text-forest-900 border border-sage-300 transition-colors"
              >
                {demoMode ? (
                  <>
                    <LogIn className="h-4 w-4 text-amber-600" />
                    <span className="hidden sm:inline">Exit Demo</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 text-ink-500" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 pl-2 border-l border-sage-300 hover:opacity-85 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-forest-800 text-harvest-300 font-bold flex items-center justify-center border-2 border-harvest-400 text-sm shadow-sm">
                {state.currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-forest-900">
                  {language === "ta"
                    ? state.currentUser.tamilName || state.currentUser.name
                    : state.currentUser.name}
                </span>
                <span className="text-[10px] text-paddy-700 font-medium">
                  {demoMode
                    ? "Demo account (VIJAY)"
                    : session?.user.email ||
                      `${state.farmer.village}, ${state.farmer.district}`}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {signOutError && (
        <p
          role="status"
          className="mx-auto mt-3 w-[calc(100%-2rem)] max-w-7xl rounded-xl border border-terracotta-300 bg-terracotta-50 px-4 py-2 text-xs font-semibold text-terracotta-800"
        >
          {signOutError}
        </p>
      )}

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-72 shrink-0 py-6 pr-6 border-r border-sage-300">
          <div className="sticky top-24 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            {/* Farmer Identity Badge in Sidebar */}
            <div className="p-4 bg-gradient-to-br from-forest-900 to-forest-800 text-cream-100 rounded-2xl shadow-agro border border-forest-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-harvest-400/20 text-harvest-300 border border-harvest-400/30 flex items-center justify-center font-bold text-base">
                  🌾
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight text-cream-50">
                    {language === "ta"
                      ? state.farmer.tamilFullName
                      : state.farmer.fullName}
                  </h4>
                  <p className="text-[11px] text-sage-300">
                    {state.farmer.totalLandAcres}{" "}
                    {language === "ta" ? "ஏக்கர் நன்செய்" : "Acres Wetland"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-forest-700/80">
                <span className="text-harvest-400 font-semibold">
                  {activeSeason.seasonCode}
                </span>
                <span className="bg-paddy-600/80 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {activeSeason.stage}
                </span>
              </div>
            </div>

            {/* Navigation Groups */}
            <nav className="space-y-4">
              {navGroups.map((group) => {
                const isCollapsed = collapsedGroups[group.groupKey];
                return (
                  <div key={group.groupKey} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(group.groupKey)}
                      className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-bold tracking-wider text-ink-500 uppercase hover:text-forest-800 transition-colors"
                    >
                      <span>{t.sections[group.groupKey]}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isCollapsed ? "-rotate-90" : "rotate-0"
                        }`}
                      />
                    </button>

                    {!isCollapsed && (
                      <div className="space-y-1 pl-1">
                        {group.items.map((item) => {
                          const isActive = currentRoute === item.route;
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavClick(item.route)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                isActive
                                  ? "bg-forest-800 text-harvest-300 shadow-sm font-bold"
                                  : item.highlight
                                    ? "bg-harvest-100/70 text-forest-900 hover:bg-harvest-200/70 border border-harvest-300"
                                    : "text-ink-800 hover:bg-sage-100 hover:text-forest-900"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon
                                  className={`w-4 h-4 shrink-0 ${
                                    isActive
                                      ? "text-harvest-400"
                                      : item.highlight
                                        ? "text-terracotta-600"
                                        : "text-forest-700"
                                  }`}
                                />
                                <span className="truncate">
                                  {t.nav[item.labelKey]}
                                </span>
                              </div>

                              {item.badge && (
                                <span
                                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                    isActive
                                      ? "bg-harvest-400 text-forest-950"
                                      : item.highlight
                                        ? "bg-terracotta-500 text-white"
                                        : "bg-sage-200 text-forest-800"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Quick System Links */}
            <div className="pt-4 border-t border-sage-300 space-y-1">
              <button
                onClick={() => handleNavClick("/onboarding")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink-600 hover:text-forest-800 hover:bg-sage-50 rounded-xl"
              >
                <UserPlus className="w-4 h-4 text-paddy-600" />
                <span>{t.nav.onboarding}</span>
              </button>
              <button
                onClick={() => handleNavClick("/login")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink-600 hover:text-forest-800 hover:bg-sage-50 rounded-xl"
              >
                <LogIn className="w-4 h-4 text-terracotta-600" />
                <span>{t.nav.login}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Full Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white">
            <div className="p-4 border-b border-sage-300 flex items-center justify-between bg-cream-100">
              <Logo size="sm" showTamil={true} />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-forest-800 hover:bg-sage-200 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
              {navGroups.map((group) => (
                <div key={group.groupKey}>
                  <h4 className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-2">
                    {t.sections[group.groupKey]}
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {group.items.map((item) => {
                      const isActive = currentRoute === item.route;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.route)}
                          className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                            isActive
                              ? "bg-forest-800 text-harvest-300 font-bold"
                              : "text-ink-800 hover:bg-sage-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-paddy-600" />
                            <span>{t.nav[item.labelKey]}</span>
                          </div>
                          {item.badge && (
                            <span className="text-xs bg-harvest-400 text-forest-950 font-bold px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 py-6 px-3 sm:px-6 lg:px-8 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sage-300 shadow-lg px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => handleNavClick("/dashboard")}
          className={`flex flex-col items-center p-1.5 rounded-xl text-[11px] font-bold ${
            currentRoute === "/dashboard" ? "text-forest-800" : "text-ink-500"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>{language === "ta" ? "மையம்" : "Dashboard"}</span>
        </button>

        <button
          onClick={() => handleNavClick("/seed-passport")}
          className={`flex flex-col items-center p-1.5 rounded-xl text-[11px] font-bold ${
            currentRoute === "/seed-passport"
              ? "text-forest-800"
              : "text-ink-500"
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span>{language === "ta" ? "விதை" : "Seed QR"}</span>
        </button>

        <button
          onClick={() => handleNavClick("/crop-journey")}
          className="relative -top-4 flex flex-col items-center bg-forest-800 text-harvest-300 p-3 rounded-full shadow-gold border-2 border-harvest-400"
        >
          <ScrollText className="w-6 h-6 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
            {language === "ta" ? "பயணம்" : "Journey"}
          </span>
        </button>

        <button
          onClick={() => handleNavClick("/market-prices")}
          className={`flex flex-col items-center p-1.5 rounded-xl text-[11px] font-bold ${
            currentRoute === "/market-prices"
              ? "text-forest-800"
              : "text-ink-500"
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span>{language === "ta" ? "சந்தை" : "Market"}</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center p-1.5 rounded-xl text-[11px] font-bold text-ink-500 hover:text-forest-800"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>{language === "ta" ? "மெனு" : "All (36)"}</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="mt-auto bg-forest-900 text-cream-100 py-8 px-4 border-t border-forest-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="md" showTamil={true} theme="dark" />
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-sage-300">
            <button
              onClick={() => navigate("/crop-journey")}
              className="hover:text-harvest-400"
            >
              {t.nav.cropJourney}
            </button>
            <button
              onClick={() => navigate("/schemes")}
              className="hover:text-harvest-400"
            >
              {t.nav.schemes}
            </button>
            <button
              onClick={() => navigate("/crop-doctor")}
              className="hover:text-harvest-400"
            >
              {t.nav.cropDoctor}
            </button>
            <button
              onClick={() => navigate("/soil-health")}
              className="hover:text-harvest-400"
            >
              {t.nav.soilHealth}
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="hover:text-harvest-400"
            >
              {t.nav.profile}
            </button>
          </div>
          <div className="text-center md:text-right text-[11px] text-sage-400">
            <p>VITHAI TO ARUVADAI (V2A) — Tamil Nadu Agro Innovation</p>
            <p className="text-harvest-400/90 font-medium">
              விதை முதல் அறுவடை வரை • Delta AgriOS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
