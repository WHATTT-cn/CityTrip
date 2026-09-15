import ActivityCard from "@/components/ActivityCard";
import PreferencePanel from "@/components/PreferencePanel";
import { recommend, type ScoredActivity } from "@/lib/recommend";
import { ACTIVITIES } from "@/data/activities";
import type { Prefs } from "@/types";
import { ArrowDown, Compass } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  prefs: Prefs;
  onPrefsChange: (p: Prefs) => void;
  onTeamUp: (a: ScoredActivity) => void;
  onCheckIn: (a: ScoredActivity) => void;
  checkedIds: Set<string>;
}

const FILTERS = ["全部", "室内", "户外", "免费"] as const;

export default function Explore({ prefs, onPrefsChange, onTeamUp, onCheckIn, checkedIds }: Props) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("全部");

  const scored = useMemo(() => recommend(ACTIVITIES, prefs), [prefs]);
  const list = useMemo(() => {
    if (filter === "室内") return scored.filter((a) => a.indoor);
    if (filter === "户外") return scored.filter((a) => !a.indoor);
    if (filter === "免费") return scored.filter((a) => a.price === 0);
    return scored;
  }, [scored, filter]);

  const weekend = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const sat = new Date(now);
    sat.setDate(now.getDate() + ((6 - day + 7) % 7));
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    const fmt = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;
    return `${fmt(sat)} - ${fmt(sun)}`;
  }, []);

  return (
    <div className="animate-rise">
      {/* Hero：图片位（主视觉）——金黄银杏大道，暖金色调 */}
      <header className="relative overflow-hidden rounded-[2rem] shadow-[0_24px_50px_-24px_rgba(70,50,30,0.5)]">
        <img
          src="/images/hero-ginkgo.jpg"
          alt="秋日银杏大道"
          className="h-[340px] w-full object-cover sm:h-[420px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12">
          <p className="animate-rise flex items-center gap-2 text-sm font-semibold tracking-widest text-[#f6e3c8]" style={{ animationDelay: "80ms" }}>
            <Compass className="h-4 w-4" /> 本周末 · {weekend}
          </p>
          <h1 className="animate-rise mt-3 max-w-xl font-display text-4xl font-black leading-tight text-white text-balance sm:text-5xl" style={{ animationDelay: "180ms" }}>
            别再纠结去哪玩，
            <br />
            这个城市替你安排好了
          </h1>
          <p className="animate-rise mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base" style={{ animationDelay: "280ms" }}>
            告诉我们你的天气、预算和同行人数，剩下的交给探索指南——展览、市集、演出、徒步，一键组队出发。
          </p>
          <div className="animate-rise mt-6" style={{ animationDelay: "380ms" }}>
            <a
              href="#prefs"
              className="interactive animate-cta-glow inline-flex items-center gap-2 rounded-full bg-[#e2723d] px-6 py-3 text-sm font-bold text-white"
            >
              开始定制我的周末 <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* 偏好面板 */}
      <div id="prefs" className="mt-8 scroll-mt-24">
        <PreferencePanel prefs={prefs} onChange={onPrefsChange} />
      </div>

      {/* 推荐列表 */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">
          为你推荐 <span className="text-sm font-normal text-muted-foreground">按匹配度排序</span>
        </h2>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`chip rounded-full border px-3.5 py-1.5 text-sm ${
                filter === f
                  ? "border-transparent bg-foreground text-background"
                  : "border-border bg-card/70 hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center text-muted-foreground">
          这个筛选条件下暂时没有活动，换个条件试试～
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <ActivityCard
              key={a.id}
              activity={a}
              index={i}
              onTeamUp={onTeamUp}
              onCheckIn={onCheckIn}
              checkedIn={checkedIds.has(a.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
