import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Calendar,
  CloudSun,
  Store,
  AlertTriangle,
  Info,
  Settings,
  ExternalLink,
} from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";
import { AppStore } from "../../services/store";
import { AppNotification, NotificationType } from "../../types";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, navigate, triggerRefresh } = useNavigation();
  const state = AppStore.getState();

  const [activeTab, setActiveTab] = useState<"notifications" | "settings">("notifications");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [pushStatus, setPushStatus] = useState<string>("");

  if (!isOpen) return null;

  const notifications = state.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const preferences = state.notificationPreferences || {
    taskReminders: true,
    weatherAlerts: true,
    marketplaceEnquiries: true,
    cropUpdates: true,
  };

  const handleMarkAsRead = (id: string) => {
    AppStore.markNotificationRead(id);
    triggerRefresh();
  };

  const handleMarkAllRead = () => {
    AppStore.markAllNotificationsRead();
    triggerRefresh();
  };

  const handleDelete = (id: string) => {
    AppStore.deleteNotification(id);
    triggerRefresh();
  };

  const handleClearAll = () => {
    AppStore.clearAllNotifications();
    triggerRefresh();
  };

  const handleTogglePref = (key: keyof typeof preferences) => {
    AppStore.updateNotificationPreferences({
      [key]: !preferences[key],
    });
    triggerRefresh();
  };

  const handleRequestPush = async () => {
    if (!("Notification" in window)) {
      setPushStatus("Push notifications are not supported in this browser.");
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setPushStatus("Push notifications enabled successfully.");
      } else {
        setPushStatus("Push notification permission was denied or dismissed.");
      }
    } catch {
      setPushStatus("Could not request notification permission.");
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === "ALL") return true;
    if (selectedFilter === "UNREAD") return !n.read;
    if (selectedFilter === "WEATHER") return n.type === "weather_alert";
    if (selectedFilter === "TASKS") return n.type === "task_reminder" || n.type === "overdue_task";
    if (selectedFilter === "MARKET") return n.type === "marketplace_enquiry" || n.type === "listing_update";
    return true;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "weather_alert":
        return <CloudSun className="w-4 h-4 text-harvest-600" />;
      case "task_reminder":
      case "overdue_task":
        return <Calendar className="w-4 h-4 text-paddy-600" />;
      case "marketplace_enquiry":
      case "listing_update":
        return <Store className="w-4 h-4 text-forest-700" />;
      default:
        return <Info className="w-4 h-4 text-ink-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative my-auto w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sage-300 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-forest-900 to-forest-800 text-cream-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-harvest-400/20 rounded-xl text-harvest-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-cream-50">
                {language === "ta" ? "அறிவிப்புகள் & எச்சரிக்கைகள்" : "Notifications & Alerts"}
              </h3>
              <p className="text-[11px] text-sage-200">
                {unreadCount > 0
                  ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}`
                  : "All caught up"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setActiveTab(activeTab === "notifications" ? "settings" : "notifications")
              }
              className={`p-1.5 rounded-lg transition-colors ${
                activeTab === "settings"
                  ? "bg-harvest-400 text-forest-950 font-bold"
                  : "text-sage-300 hover:text-white hover:bg-forest-700/60"
              }`}
              title="Notification settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-sage-300 hover:text-white hover:bg-forest-700/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        {activeTab === "notifications" ? (
          <>
            {/* Filter & Action bar */}
            <div className="p-3 bg-cream-50 border-b border-sage-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
              <div className="flex items-center gap-1">
                {["ALL", "UNREAD", "TASKS", "WEATHER", "MARKET"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFilter(f)}
                    className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      selectedFilter === f
                        ? "bg-forest-800 text-harvest-300"
                        : "text-ink-600 hover:bg-sage-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-paddy-700 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-[11px] font-bold text-terracotta-600 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notification items list */}
            <div className="overflow-y-auto flex-1 divide-y divide-sage-100 p-2">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-ink-500 space-y-2">
                  <Bell className="w-8 h-8 text-sage-300 mx-auto" />
                  <p className="text-xs font-semibold">
                    {language === "ta"
                      ? "புதிய அறிவிப்புகள் எதுவும் இல்லை."
                      : "No notifications matching your filter."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-2xl transition-colors flex items-start gap-3 ${
                      !notif.read ? "bg-paddy-50/50" : "hover:bg-cream-50/80"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white border border-sage-200 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-xs ${
                            !notif.read ? "font-extrabold text-forest-900" : "font-bold text-ink-800"
                          }`}
                        >
                          {language === "ta" && notif.tamilTitle
                            ? notif.tamilTitle
                            : notif.title}
                        </h4>
                        <span className="text-[10px] text-ink-400 shrink-0">{notif.date}</span>
                      </div>

                      <p className="text-[11px] text-ink-600 leading-relaxed">
                        {language === "ta" && notif.tamilMessage
                          ? notif.tamilMessage
                          : notif.message}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px]">
                        {notif.link && (
                          <button
                            onClick={() => {
                              onClose();
                              navigate(notif.link as any);
                            }}
                            className="font-bold text-paddy-700 hover:underline flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="font-semibold text-ink-500 hover:text-forest-900"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="font-semibold text-ink-400 hover:text-terracotta-600 ml-auto"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Settings Tab */
          <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
            <div>
              <h4 className="font-bold text-forest-900 text-sm mb-1">
                Notification Categories
              </h4>
              <p className="text-ink-500">
                Choose which types of alerts you wish to receive in V2A.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-cream-50 rounded-2xl border border-sage-200 cursor-pointer">
                <div>
                  <span className="font-bold text-forest-900 block">Cultivation Task Reminders</span>
                  <span className="text-[10px] text-ink-500">Scheduled fertilizing, irrigation, and weeding tasks</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.taskReminders}
                  onChange={() => handleTogglePref("taskReminders")}
                  className="w-4 h-4 text-paddy-600 rounded border-sage-300"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-cream-50 rounded-2xl border border-sage-200 cursor-pointer">
                <div>
                  <span className="font-bold text-forest-900 block">Weather & Rainfall Warnings</span>
                  <span className="text-[10px] text-ink-500">Cyclonic rain, humidity spikes, and high wind advisories</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.weatherAlerts}
                  onChange={() => handleTogglePref("weatherAlerts")}
                  className="w-4 h-4 text-paddy-600 rounded border-sage-300"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-cream-50 rounded-2xl border border-sage-200 cursor-pointer">
                <div>
                  <span className="font-bold text-forest-900 block">Marketplace & Buyer Enquiries</span>
                  <span className="text-[10px] text-ink-500">Direct offers and procurement bids on your produce</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketplaceEnquiries}
                  onChange={() => handleTogglePref("marketplaceEnquiries")}
                  className="w-4 h-4 text-paddy-600 rounded border-sage-300"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-cream-50 rounded-2xl border border-sage-200 cursor-pointer">
                <div>
                  <span className="font-bold text-forest-900 block">Crop Health & Pest Updates</span>
                  <span className="text-[10px] text-ink-500">Regional pest surveillance alerts and KVK advisories</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.cropUpdates}
                  onChange={() => handleTogglePref("cropUpdates")}
                  className="w-4 h-4 text-paddy-600 rounded border-sage-300"
                />
              </label>
            </div>

            {/* Push notification setup */}
            <div className="p-4 bg-cream-100 rounded-2xl border border-sage-300 space-y-2">
              <span className="font-bold text-forest-900 block">Browser Push Notifications</span>
              <p className="text-[11px] text-ink-600 leading-relaxed">
                Enable device-level alerts even when V2A is running in the background.
              </p>
              <button
                onClick={handleRequestPush}
                className="px-3 py-1.5 bg-forest-800 text-harvest-300 font-bold rounded-xl text-xs hover:bg-forest-900 transition-colors"
              >
                Enable Push Notifications
              </button>
              {pushStatus && (
                <p className="text-[11px] font-semibold text-paddy-800 mt-1">{pushStatus}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
