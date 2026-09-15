import { ALL_INTERESTS } from "@/data/activities";
import type { Interest, Prefs, Weather } from "@/types";
import { CloudRain, Cloudy, Minus, Plus, Sun, Users, Wallet } from "lucide-react";

const WEATHER_OPTIONS: { value: Weather; label: string; icon: typeof Sun; hint: string }[] = [
  { value: "晴", label: "周六 晴", icon: Sun, hint: "14~22°C" },
  { value: "阴", label: "周日 阴", icon: Cloudy, hint: "13~19°C" },
  { value: "雨", label: "周日夜间 雨", icon: CloudRain, hint: "11~16°C" },
];

interface Props {
  prefs: Prefs;
  onChange: (p: Prefs) => void;
}

/** 偏好面板：天气 / 兴趣 / 预算 / 同行人数 */
export default function PreferencePanel({ prefs, onChange }: Props) {
  const toggleInterest = (it: Interest) => {
    const has = prefs.interests.includes(it);
    onChange({
      ...prefs,
      interests: has
        ? prefs.interests.filter((i) => i !== it)
        : [...prefs.interests, it],
    });
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card/85 p-5 shadow-[0_10px_30px_-16px_rgba(70,50,30,0.25)] backdrop-blur-sm sm:p-6">
      {/* 周末天气 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">本周末天气</span>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
          点击切换，推荐会随之变化
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {WEATHER_OPTIONS.map(({ value, label, icon: Icon, hint }) => {
          const active = prefs.weather === value;
          return (
            <button
              key={value}
              onClick={() => onChange({ ...prefs, weather: value })}
              className={`chip flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 ${
                active
                  ? "border-[#d98e4a] bg-[#f6e3c8] shadow-[0_6px_16px_-8px_rgba(217,142,74,0.7)]"
                  : "border-border bg-background/60 hover:bg-secondary/70"
              }`}
            >
              <Icon
                className={`h-6 w-6 animate-float-soft ${
                  value === "晴" ? "text-[#d98e4a]" : value === "阴" ? "text-[#7a8b99]" : "text-[#5b7fa6]"
                }`}
                style={{ animationDelay: value === "晴" ? "0s" : value === "阴" ? "0.4s" : "0.8s" }}
              />
              <span className="text-xs font-semibold">{label}</span>
              <span className="text-[11px] text-muted-foreground">{hint}</span>
            </button>
          );
        })}
      </div>

      {/* 兴趣 */}
      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        想玩什么 <span className="text-xs font-normal">（可多选，不选则为你盲盒推荐）</span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {ALL_INTERESTS.map((it) => {
          const active = prefs.interests.includes(it);
          return (
            <button
              key={it}
              onClick={() => toggleInterest(it)}
              className={`chip rounded-full border px-3.5 py-1.5 text-sm ${
                active
                  ? "border-transparent bg-[#84a59d] text-white shadow-[0_5px_14px_-6px_rgba(132,165,157,0.9)]"
                  : "border-border bg-background/60 hover:bg-secondary"
              }`}
            >
              {it}
            </button>
          );
        })}
      </div>

      {/* 预算 + 人数 */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background/60 p-3.5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Wallet className="h-4 w-4" /> 人均预算
            </span>
            <span className="font-display text-lg font-bold text-[#c96f4a]">
              ¥{prefs.budget}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={300}
            step={10}
            value={prefs.budget}
            onChange={(e) => onChange({ ...prefs, budget: Number(e.target.value) })}
            className="mt-2.5 w-full accent-[#e2723d]"
            aria-label="人均预算"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>¥0 白嫖党</span>
            <span>¥300 小奢侈</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/60 p-3.5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Users className="h-4 w-4" /> 同行人数
            </span>
            <span className="font-display text-lg font-bold text-[#c96f4a]">
              {prefs.groupSize} 人
            </span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              onClick={() => onChange({ ...prefs, groupSize: Math.max(1, prefs.groupSize - 1) })}
              className="interactive flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
              aria-label="减少人数"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-16 text-center text-sm text-muted-foreground">
              {prefs.groupSize === 1 ? "独行侠" : prefs.groupSize <= 3 ? "小分队" : "一群人"}
            </span>
            <button
              onClick={() => onChange({ ...prefs, groupSize: Math.min(10, prefs.groupSize + 1) })}
              className="interactive flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
              aria-label="增加人数"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
