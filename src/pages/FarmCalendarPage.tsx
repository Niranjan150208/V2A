import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Tag,
  ArrowRight,
  Layers,
  DollarSign,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const FarmCalendarPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();

  const [filterStage, setFilterStage] = useState("All");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState<any>("Fertilization");
  const [taskDate, setTaskDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [taskCost, setTaskCost] = useState("1200");

  const tasks = state.tasks.filter(
    (t) => filterStage === "All" || t.cropStage === filterStage,
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    AppStore.addTask({
      seasonId: activeSeasonId,
      title: taskTitle,
      tamilTitle: taskTitle,
      category: taskCategory,
      cropStage: "Vegetative Growth",
      scheduledDate: taskDate,
      status: "Pending",
      priority: "Normal",
      estimatedCost: parseFloat(taskCost) || 0,
    });

    setShowTaskModal(false);
    setTaskTitle("");
    triggerRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "பருவகால களச் செயல்பாடுகள்"
                : "Agronomic Timeline & Field Operations"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "விவசாய கள நாட்காட்டி"
              : "Farm Activity Calendar & Sowing Schedule"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "உழவு, விதைப்பு, களை எடுத்தல், உரம் இடுதல் மற்றும் அறுவடை பணிகள்"
              : "End-to-end task scheduling synchronized with Tamil Nadu agricultural package of practices"}
          </p>
        </div>

        <button
          onClick={() => setShowTaskModal(true)}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-harvest-400" />
          <span>
            {language === "ta" ? "புதிய பணி சேர்க்க" : "Create Farm Task"}
          </span>
        </button>
      </div>

      {/* Sowing Schedule Overview Banner */}
      <div className="bg-gradient-to-r from-forest-900 to-paddy-900 rounded-3xl p-6 text-cream-100 shadow-agro grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-sage-300">
            Sowing Date
          </span>
          <p className="font-display font-black text-xl text-cream-50 mt-0.5">
            Aug 28, 2025
          </p>
          <p className="text-xs text-harvest-300">Raised Bed Mat Nursery</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-sage-300">
            Transplanting Date
          </span>
          <p className="font-display font-black text-xl text-cream-50 mt-0.5">
            Sep 15, 2025
          </p>
          <p className="text-xs text-harvest-300">8-Row Machine Planting</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-sage-300">
            Harvest Window
          </span>
          <p className="font-display font-black text-xl text-cream-50 mt-0.5">
            Jan 10 - 15, 2026
          </p>
          <p className="text-xs text-harvest-300">110 Bags Harvested ✓</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-sage-300">
            Next Fallow Pulse
          </span>
          <p className="font-display font-black text-xl text-cream-50 mt-0.5">
            Jan 25, 2026
          </p>
          <p className="text-xs text-harvest-300">Blackgram Relay Sowing</p>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === "ta"
            ? "சாகுபடி பணிகள் பட்டியல்"
            : "Field Operations Task Log"}
        </h3>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-2xl border border-sage-200 bg-cream-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {task.status === "Completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-paddy-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-harvest-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-forest-900">
                    {language === "ta"
                      ? task.tamilTitle || task.title
                      : task.title}
                  </h4>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Stage:{" "}
                    <span className="font-semibold text-forest-800">
                      {task.cropStage}
                    </span>{" "}
                    • Scheduled: {task.scheduledDate}
                  </p>
                  {task.notes && (
                    <p className="text-xs text-ink-700 mt-1 italic">
                      "{task.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 text-right">
                {task.actualCost && (
                  <div>
                    <span className="text-[10px] font-bold text-ink-500 uppercase block">
                      Actual Cost
                    </span>
                    <span className="font-display font-black text-sm text-forest-900">
                      ₹{task.actualCost.toLocaleString()}
                    </span>
                  </div>
                )}
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    task.status === "Completed"
                      ? "bg-paddy-100 text-paddy-800"
                      : "bg-harvest-100 text-forest-900"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4">
            <h3 className="font-display font-extrabold text-lg text-forest-900">
              {language === "ta"
                ? "புதிய பண்ணை பணி உருவாக்கு"
                : "Create Farm Task"}
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  placeholder="e.g. Zinc Sulphate foliar spray"
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Fertilization">Fertilization</option>
                    <option value="Weeding">Weeding</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Harvesting">Harvesting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Estimated Cost (₹)
                </label>
                <input
                  type="number"
                  value={taskCost}
                  onChange={(e) => setTaskCost(e.target.value)}
                  className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
