import { useState } from "react";
import { motion } from "motion/react";
import { X, Image as ImageIcon, Type, Mic, Sparkles } from "lucide-react";
import { Activity, ActivityType, FOOD_ITEMS } from "../types";
import { addActivity, loadActivities } from "../utils/storage";

interface PreparationZoneProps {
  onClose: () => void;
  onActivityCreated: () => void;
}

export default function PreparationZone({ onClose, onActivityCreated }: PreparationZoneProps) {
  const [step, setStep] = useState<"input" | "processing" | "confirm">("input");
  const [inputText, setInputText] = useState("");
  const [parsedActivity, setParsedActivity] = useState<Partial<Activity> | null>(null);

  const handleTextSubmit = () => {
    if (!inputText.trim()) return;
    
    setStep("processing");
    
    // Mock AI processing
    setTimeout(() => {
      const mockActivity = parseActivityFromText(inputText);
      setParsedActivity(mockActivity);
      setStep("confirm");
    }, 2000);
  };

  const parseActivityFromText = (text: string): Partial<Activity> => {
    // Simple mock AI parsing logic
    let type: ActivityType = "medium";
    
    if (text.includes("考试") || text.includes("重要") || text.includes("会议")) {
      type = "high";
    } else if (text.includes("电影") || text.includes("聚会") || text.includes("朋友")) {
      type = "social";
    } else if (text.includes("学习") || text.includes("阅读") || text.includes("课程")) {
      type = "medium";
    } else {
      type = "low";
    }

    const foods = FOOD_ITEMS[type];
    const randomFood = foods[Math.floor(Math.random() * foods.length)];

    // Extract date if possible (simplified)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      name: text.substring(0, 20),
      date: tomorrow.toISOString().split("T")[0],
      type,
      foodItem: randomFood,
      description: text,
    };
  };

  const handleConfirm = () => {
    if (!parsedActivity) return;

    const activities = loadActivities();
    const currentBentoActivities = activities.filter(a => a.layer && a.slot !== undefined);
    
    // Find next available slot
    let layer = 1;
    let slot = 0;
    
    for (let l = 1; l <= 3; l++) {
      for (let s = 0; s < 4; s++) {
        const occupied = currentBentoActivities.some(a => a.layer === l && a.slot === s);
        if (!occupied) {
          layer = l;
          slot = s;
          break;
        }
      }
      if (slot !== undefined) break;
    }

    const newActivity: Activity = {
      id: Date.now().toString(),
      name: parsedActivity.name || "新活动",
      date: parsedActivity.date || new Date().toISOString().split("T")[0],
      type: parsedActivity.type || "medium",
      status: "pending",
      createdAt: new Date().toISOString(),
      foodItem: parsedActivity.foodItem || FOOD_ITEMS.medium[0],
      layer,
      slot,
      description: parsedActivity.description,
    };

    addActivity(newActivity);
    onActivityCreated();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-gradient-to-br from-orange-50 to-amber-50 rounded-t-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-200">
          <h2 className="text-2xl font-bold text-amber-900">备菜间</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-amber-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "input" && (
            <div className="space-y-6">
              <div className="flex gap-4 mb-6">
                <button className="flex-1 flex items-center justify-center gap-2 p-4 bg-white rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-400 hover:bg-amber-50 transition-colors">
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-amber-800">上传图片</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 p-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors">
                  <Type className="w-5 h-5" />
                  <span className="text-sm">文字输入</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 p-4 bg-white rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-400 hover:bg-amber-50 transition-colors">
                  <Mic className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-amber-800">语音录入</span>
                </button>
              </div>

              <div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="描述你的活动，比如：下周五晚上和朋友看电影..."
                  className="w-full h-32 p-4 bg-white rounded-xl border-2 border-amber-200 focus:border-orange-400 focus:outline-none resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTextSubmit}
                disabled={!inputText.trim()}
                className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                开始备菜
              </motion.button>
            </div>
          )}

          {step === "processing" && (
            <div className="py-12 flex flex-col items-center gap-6">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
                className="text-8xl"
              >
                🔪
              </motion.div>
              <p className="text-xl text-amber-900 font-semibold">AI 正在处理中...</p>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-orange-400 rounded-full"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === "confirm" && parsedActivity && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-amber-900">点餐单</h3>
                  <div className="text-6xl">{parsedActivity.foodItem?.icon}</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">活动名称</label>
                    <input
                      type="text"
                      value={parsedActivity.name}
                      onChange={(e) => setParsedActivity({ ...parsedActivity, name: e.target.value })}
                      className="w-full mt-1 p-3 bg-amber-50 rounded-lg border border-amber-200 focus:border-orange-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">日期</label>
                    <input
                      type="date"
                      value={parsedActivity.date}
                      onChange={(e) => setParsedActivity({ ...parsedActivity, date: e.target.value })}
                      className="w-full mt-1 p-3 bg-amber-50 rounded-lg border border-amber-200 focus:border-orange-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">活动类型</label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {(["high", "medium", "social", "low"] as ActivityType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            const foods = FOOD_ITEMS[type];
                            const randomFood = foods[Math.floor(Math.random() * foods.length)];
                            setParsedActivity({ 
                              ...parsedActivity, 
                              type,
                              foodItem: randomFood 
                            });
                          }}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            parsedActivity.type === type
                              ? "border-orange-400 bg-orange-50"
                              : "border-amber-200 bg-white hover:border-amber-300"
                          }`}
                        >
                          <div className="text-sm font-semibold text-gray-700">
                            {type === "high" && "重要"}
                            {type === "medium" && "学习"}
                            {type === "social" && "社交"}
                            {type === "low" && "日常"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">AI 推荐食材</p>
                      <p className="text-xs text-gray-600">{parsedActivity.foodItem?.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("input")}
                  className="flex-1 py-3 bg-white border-2 border-amber-300 text-amber-900 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
                >
                  重新输入
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold shadow-lg"
                >
                  下单 ✨
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
