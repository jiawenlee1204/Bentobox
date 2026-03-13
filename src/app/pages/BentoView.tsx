import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Activity, FOOD_ITEMS, ActivityType } from "../types";
import { loadActivities, updateActivity } from "../utils/storage";
import { ArrowLeft, Plus } from "lucide-react";
import PreparationZone from "../components/PreparationZone";

export default function BentoView() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showPreparation, setShowPreparation] = useState(false);

  useEffect(() => {
    loadData();
    checkExpiredActivities();
  }, []);

  const loadData = () => {
    const data = loadActivities();
    setActivities(data);
  };

  const checkExpiredActivities = () => {
    const today = new Date();
    const data = loadActivities();
    
    data.forEach((activity) => {
      const activityDate = new Date(activity.date);
      const diffDays = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (activity.status === "pending" && diffDays > 0) {
        updateActivity(activity.id, { 
          status: "expired",
          expiredAt: new Date().toISOString()
        });
      }
    });
  };

  const handleComplete = (activity: Activity) => {
    updateActivity(activity.id, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
    loadData();
  };

  const getActivityStyle = (activity: Activity) => {
    if (activity.status === "completed") {
      return "brightness-110 saturate-150 shadow-lg shadow-yellow-300/50";
    }
    if (activity.status === "expired") {
      return "grayscale brightness-75";
    }
    return "";
  };

  const renderLayer = (layerNum: number) => {
    const layerActivities = activities.filter((a) => a.layer === layerNum);
    const slots = Array(4).fill(null);
    
    layerActivities.forEach((activity) => {
      slots[activity.slot] = activity;
    });

    return (
      <div className="relative">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {layerNum}
        </div>
        
        <div className="bg-gradient-to-br from-amber-100 to-orange-50 rounded-2xl p-8 shadow-xl border-4 border-amber-300/50">
          <div className="grid grid-cols-4 gap-6">
            {slots.map((activity, index) => (
              <motion.div
                key={`${layerNum}-${index}`}
                className="aspect-square bg-white/80 rounded-xl shadow-inner border-2 border-amber-200/50 flex items-center justify-center relative overflow-hidden"
                whileHover={activity && activity.status === "pending" ? { scale: 1.05 } : {}}
              >
                {activity ? (
                  <motion.div
                    initial={{ scale: 0, y: -100 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2 ${getActivityStyle(activity)}`}
                    onClick={() => activity.status === "pending" && handleComplete(activity)}
                  >
                    <motion.div
                      className="text-6xl"
                      animate={
                        activity.status === "pending"
                          ? {
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {activity.foodItem.icon}
                    </motion.div>
                    
                    <div className="text-xs text-center px-2">
                      <p className="font-semibold text-gray-800 truncate">
                        {activity.name}
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        {new Date(activity.date).toLocaleDateString("zh-CN")}
                      </p>
                    </div>

                    {activity.status === "pending" && (
                      <motion.div
                        className="absolute top-2 right-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                      </motion.div>
                    )}

                    {activity.status === "completed" && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="absolute top-2 right-2 text-2xl">✨</div>
                      </motion.div>
                    )}

                    {/* Leaf decoration for medium type */}
                    {activity.type === "medium" && activity.status === "pending" && (
                      <motion.div
                        className="absolute -top-1 -right-1 text-xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🌿
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-4xl text-gray-300">+</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <ArrowLeft className="w-6 h-6 text-amber-900" />
            </button>
            <h1 className="text-4xl font-bold text-amber-900">定食盒</h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreparation(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>新建活动</span>
          </motion.button>
        </div>
      </div>

      {/* Bento Box */}
      <div className="max-w-6xl mx-auto">
        <div className="relative pl-16 space-y-8">
          {renderLayer(1)}
          {renderLayer(2)}
          {renderLayer(3)}
        </div>

        {/* Info Text */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            点击亮着的食材表示已完成该活动 ✨
          </p>
          <p className="text-xs mt-2 text-gray-400">
            每个盒子可容纳 12 个活动，装满后会自动打包入库
          </p>
        </div>
      </div>

      {/* Preparation Zone Modal */}
      <AnimatePresence>
        {showPreparation && (
          <PreparationZone
            onClose={() => setShowPreparation(false)}
            onActivityCreated={loadData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
