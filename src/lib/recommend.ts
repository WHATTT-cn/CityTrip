import type { Activity, Prefs } from "@/types";

export interface ScoredActivity extends Activity {
  score: number; // 0 - 100
  reasons: string[];
}

/**
 * 推荐引擎：按 兴趣匹配(40) + 天气适配(25) + 预算适配(20) + 人数适配(15) 打分
 */
export function recommend(activities: Activity[], prefs: Prefs): ScoredActivity[] {
  return activities
    .map((a) => {
      let score = 0;
      const reasons: string[] = [];

      // 兴趣匹配
      if (prefs.interests.length === 0) {
        score += 24; // 未选兴趣时给基础分
      } else if (prefs.interests.includes(a.category)) {
        score += 40;
        reasons.push("命中你的兴趣");
      } else {
        score += 8;
      }

      // 天气适配
      if (a.bestWeather.includes(prefs.weather)) {
        score += 25;
        reasons.push(prefs.weather === "雨" ? "雨天也能去" : `适合${prefs.weather}天`);
      } else if (a.indoor) {
        score += 18;
        reasons.push("室内备选");
      } else {
        score += 4;
      }

      // 预算适配
      if (a.price === 0) {
        score += 20;
        reasons.push("免费");
      } else if (a.price <= prefs.budget) {
        score += 20;
        reasons.push(`人均 ¥${a.price} 在预算内`);
      } else if (a.price <= prefs.budget * 1.3) {
        score += 10;
      }

      // 人数适配
      const [min, max] = a.groupFit;
      if (prefs.groupSize >= min && prefs.groupSize <= max) {
        score += 15;
        reasons.push(prefs.groupSize === 1 ? "一个人也合适" : `适合 ${prefs.groupSize} 人同行`);
      } else {
        score += 5;
      }

      // 口碑微调
      score += (a.rating - 4.5) * 4;

      return { ...a, score: Math.round(Math.min(100, Math.max(0, score))), reasons };
    })
    .sort((x, y) => y.score - x.score);
}

/** 匹配度文案 */
export function matchLabel(score: number): string {
  if (score >= 85) return "强烈推荐";
  if (score >= 70) return "很适合你";
  if (score >= 55) return "可以考虑";
  return "备选";
}
