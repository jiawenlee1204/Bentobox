export type ActivityType = "high" | "medium" | "social" | "low";

export type ActivityStatus = "pending" | "completed" | "expired";

export interface Activity {
  id: string;
  name: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  type: ActivityType;
  status: ActivityStatus;
  createdAt: string;
  completedAt?: string;
  expiredAt?: string;
  foodItem: FoodItem;
  layer: number; // 1, 2, or 3
  slot: number; // 0-3
}

export interface FoodItem {
  name: string;
  icon: string;
  color: string;
  size: "large" | "medium" | "small";
}

export const FOOD_ITEMS: Record<ActivityType, FoodItem[]> = {
  high: [
    { name: "战斧牛排", icon: "🥩", color: "#8B4513", size: "large" },
    { name: "海鲜大餐", icon: "🦞", color: "#FF6347", size: "large" },
    { name: "烤全鸡", icon: "🍗", color: "#D2691E", size: "large" },
  ],
  medium: [
    { name: "牛油果吐司", icon: "🥑", color: "#90EE90", size: "medium" },
    { name: "沙拉碗", icon: "🥗", color: "#98FB98", size: "medium" },
    { name: "三文鱼", icon: "🍣", color: "#FFA07A", size: "medium" },
  ],
  social: [
    { name: "披萨", icon: "🍕", color: "#FFD700", size: "medium" },
    { name: "塔可", icon: "🌮", color: "#FF8C00", size: "medium" },
    { name: "甜甜圈", icon: "🍩", color: "#FF69B4", size: "medium" },
    { name: "草莓大福", icon: "🍓", color: "#FFB6C1", size: "small" },
  ],
  low: [
    { name: "蓝莓", icon: "🫐", color: "#6A5ACD", size: "small" },
    { name: "草莓", icon: "🍓", color: "#FF69B4", size: "small" },
    { name: "柠檬水", icon: "🍋", color: "#FFFFE0", size: "small" },
  ],
};
