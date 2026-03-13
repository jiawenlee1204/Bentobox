import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ChefHat } from "lucide-react";
import { loadActivities } from "../utils/storage";
import { ActivityType } from "../types";

export default function BalancePlate() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    high: 0,
    medium: 0,
    social: 0,
    low: 0,
  });
  const [aiAdvice, setAiAdvice] = useState("");

  useEffect(() => {
    const activities = loadActivities();
    const completed = activities.filter((a) => a.status === "completed");

    const counts = {
      high: completed.filter((a) => a.type === "high").length,
      medium: completed.filter((a) => a.type === "medium").length,
      social: completed.filter((a) => a.type === "social").length,
      low: completed.filter((a) => a.type === "low").length,
    };

    setStats(counts);
    generateAdvice(counts);
  }, []);

  const generateAdvice = (counts: Record<ActivityType, number>) => {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      setAiAdvice("还没有完成任何活动，开始你的美食之旅吧！");
      return;
    }

    const highPercent = (counts.high / total) * 100;
    const socialPercent = (counts.social / total) * 100;
    const mediumPercent = (counts.medium / total) * 100;

    if (highPercent > 50) {
      setAiAdvice("主厨发现你最近摄入太多高压食物了，下个盒子加点甜点（放松活动）吧！🍰");
    } else if (socialPercent > 60) {
      setAiAdvice("生活需要一点主食（学习）来支撑哦！不能只有娱乐~ 📚");
    } else if (mediumPercent < 20 && total > 5) {
      setAiAdvice("建议增加一些学习提升类活动，给自己充充电！⚡");
    } else {
      setAiAdvice("营养搭配很均衡！继续保持这样的生活节奏~ ✨");
    }
  };

  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const maxCount = Math.max(...Object.values(stats), 1);

  const categories = [
    { type: "high" as ActivityType, label: "重要硬菜", color: "#8B4513", icon: "🥩" },
    { type: "medium" as ActivityType, label: "学习轻食", color: "#90EE90", icon: "🥗" },
    { type: "social" as ActivityType, label: "快乐小吃", color: "#FFD700", icon: "🍕" },
    { type: "low" as ActivityType, label: "日常配菜", color: "#FF69B4", icon: "🍓" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-amber-900" />
          </button>
          <h1 className="text-4xl font-bold text-amber-900">生活平衡盘</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Circular Plate */}
        <div className="relative w-full max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="relative w-full aspect-square bg-white rounded-full shadow-2xl p-8"
          >
            {/* Center Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex flex-col items-center justify-center shadow-lg">
                <p className="text-3xl font-bold text-amber-900">{total}</p>
                <p className="text-sm text-gray-600">已完成</p>
              </div>
            </div>

            {/* Quadrants */}
            <svg className="w-full h-full" viewBox="0 0 400 400">
              {categories.map((category, index) => {
                const percentage = total > 0 ? stats[category.type] / total : 0;
                const startAngle = (index * 90 - 90) * (Math.PI / 180);
                const endAngle = ((index + 1) * 90 - 90) * (Math.PI / 180);
                
                const innerRadius = 80;
                const outerRadius = 80 + (percentage * 120);
                
                const x1 = 200 + innerRadius * Math.cos(startAngle);
                const y1 = 200 + innerRadius * Math.sin(startAngle);
                const x2 = 200 + outerRadius * Math.cos(startAngle);
                const y2 = 200 + outerRadius * Math.sin(startAngle);
                const x3 = 200 + outerRadius * Math.cos(endAngle);
                const y3 = 200 + outerRadius * Math.sin(endAngle);
                const x4 = 200 + innerRadius * Math.cos(endAngle);
                const y4 = 200 + innerRadius * Math.sin(endAngle);

                const path = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`;

                return (
                  <motion.path
                    key={category.type}
                    d={path}
                    fill={category.color}
                    opacity={0.6}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  />
                );
              })}
            </svg>

            {/* Labels */}
            {categories.map((category, index) => {
              const angle = (index * 90 + 45 - 90) * (Math.PI / 180);
              const radius = 150;
              const x = 50 + (radius * Math.cos(angle)) / 4;
              const y = 50 + (radius * Math.sin(angle)) / 4;

              return (
                <div
                  key={category.type}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="text-4xl mb-1">{category.icon}</div>
                  <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {category.label}
                  </div>
                  <div className="text-lg font-bold" style={{ color: category.color }}>
                    {stats[category.type]}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <motion.div
              key={category.type}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <p className="text-sm text-gray-600 mb-2">{category.label}</p>
              <div className="flex items-baseline justify-center gap-2">
                <p className="text-3xl font-bold" style={{ color: category.color }}>
                  {stats[category.type]}
                </p>
                {total > 0 && (
                  <p className="text-sm text-gray-500">
                    {((stats[category.type] / total) * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Chef Advice */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChefHat className="w-12 h-12 text-orange-600 flex-shrink-0" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-900 mb-2">主厨点评</h3>
              <p className="text-gray-700 leading-relaxed">{aiAdvice}</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bars */}
        <div className="mt-8 space-y-4">
          {categories.map((category) => (
            <div key={category.type} className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-semibold text-gray-800">{category.label}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {stats[category.type]} / {maxCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats[category.type] / maxCount) * 100}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
