import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import kitchenBg from "figma:asset/b8118be33025dbb3df4723562d8454361766a717.png";
import { loadActivities } from "../utils/storage";
import { Activity } from "../types";
import { ChefHat, Sparkles, BookOpen } from "lucide-react";

export default function Kitchen() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nextActivity, setNextActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const activities = loadActivities();
    const pendingActivities = activities
      .filter((a) => a.status === "pending")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (pendingActivities.length > 0) {
      setNextActivity(pendingActivities[0]);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getDaysUntil = (date: string): number => {
    const target = new Date(date);
    const today = new Date();
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Kitchen Image */}
      <div className="absolute inset-0">
        <img 
          src={kitchenBg}
          alt="Kitchen Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 to-orange-100/40" />
      </div>

      {/* Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-200/60 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20,
              opacity: 0
            }}
            animate={{
              y: window.innerHeight + 20,
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Steam Effect */}
      <div className="absolute top-[30%] left-[20%]">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-16 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-md"
            initial={{ y: 0, opacity: 0.6, scale: 0.8 }}
            animate={{
              y: -80,
              opacity: 0,
              scale: 1.2,
              x: Math.sin(i) * 10
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Mouse Ripple Effect */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: mousePos.x - 50,
          top: mousePos.y - 50,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut"
        }}
      >
        <div className="w-24 h-24 rounded-full border-2 border-amber-300/50 blur-sm" />
      </motion.div>

      {/* Reminder Bubble */}
      {nextActivity && (
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl px-8 py-5 shadow-2xl max-w-md">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChefHat className="w-6 h-6 text-orange-500 flex-shrink-0" />
              </motion.div>
              <p className="text-gray-800 leading-relaxed">
                还有 <span className="font-bold text-orange-600">
                  {getDaysUntil(nextActivity.date)} 天
                </span> 就能见到 <span className="font-semibold">{nextActivity.name}</span> 啦，记得留好肚子（时间）哦！
              </p>
            </div>
            <div className="absolute -bottom-3 left-12 w-6 h-6 bg-white/95 rotate-45" />
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-amber-900 mb-4 drop-shadow-lg">
            食光盒
          </h1>
          <p className="text-xl text-amber-800/90">
            Vibe Bento
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-6 items-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/bento")}
            className="group relative bg-gradient-to-r from-orange-400 to-orange-500 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 to-orange-300/30"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="relative flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <span>活动灵感</span>
            </div>
          </motion.button>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/bento")}
              className="bg-white/90 backdrop-blur-sm text-amber-900 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              查看定食盒
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/balance")}
              className="bg-white/90 backdrop-blur-sm text-amber-900 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              生活平衡盘
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/archive")}
              className="bg-white/90 backdrop-blur-sm text-amber-900 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>橱柜</span>
            </motion.button>
          </div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute bottom-12 right-12"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-8xl opacity-60">🍳</div>
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-1/4"
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-6xl opacity-40">🥘</div>
        </motion.div>
      </div>
    </div>
  );
}