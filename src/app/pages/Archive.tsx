import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { loadActivities } from "../utils/storage";
import { Activity } from "../types";

export default function Archive() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "expired">("all");

  useEffect(() => {
    const data = loadActivities();
    setActivities(data.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  const filteredActivities = activities.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  const stats = {
    total: activities.length,
    completed: activities.filter((a) => a.status === "completed").length,
    pending: activities.filter((a) => a.status === "pending").length,
    expired: activities.filter((a) => a.status === "expired").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-amber-900" />
          </button>
          <h1 className="text-4xl font-bold text-amber-900">橱柜 - 历史记录</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-600">总活动数</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              <p className="text-sm text-gray-600">已完成</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              <p className="text-sm text-gray-600">进行中</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-gray-500" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.expired}</p>
              <p className="text-sm text-gray-600">已过期</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-lg inline-flex">
          {[
            { value: "all", label: "全部" },
            { value: "completed", label: "已完成" },
            { value: "expired", label: "已过期" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as typeof filter)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === tab.value
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="max-w-6xl mx-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600">暂无记录</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{activity.foodItem.icon}</div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      activity.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : activity.status === "expired"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {activity.status === "completed" && "已完成"}
                    {activity.status === "expired" && "已过期"}
                    {activity.status === "pending" && "进行中"}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {activity.name}
                </h3>

                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(activity.date).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {activity.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                      {activity.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">
                      {activity.type === "high" && "重要"}
                      {activity.type === "medium" && "学习"}
                      {activity.type === "social" && "社交"}
                      {activity.type === "low" && "日常"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {activity.foodItem.name}
                    </span>
                  </div>
                </div>

                {activity.completedAt && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      完成于{" "}
                      {new Date(activity.completedAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Shelf Decoration */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="grid grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="h-4 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full shadow-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
