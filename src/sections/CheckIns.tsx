import { ACTIVITIES } from "@/data/activities";
import type { CheckIn } from "@/types";
import { Award, Footprints, MapPin, Stamp, Trash2 } from "lucide-react";

interface Props {
  checkIns: CheckIn[];
  onRemove: (id: string) => void;
  onGoExplore: () => void;
}

const BADGES = [
  { need: 1, name: "初次出发" },
  { need: 3, name: "周末玩家" },
  { need: 5, name: "城市探索家" },
  { need: 10, name: "活地图" },
];

/** 打卡记录 */
export default function CheckIns({ checkIns, onRemove, onGoExplore }: Props) {
  const activityOf = (id: string) => ACTIVITIES.find((a) => a.id === id);
  const categories = new Set(checkIns.map((c) => activityOf(c.activityId)?.category)).size;
  const sorted = [...checkIns].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="animate-rise">
      <h2 className="font-display text-2xl font-bold">我的打卡</h2>
      <p className="mt-1 text-sm text-muted-foreground">每一次出发都值得被记住。</p>

      {/* 统计 + 徽章 */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card-lift rounded-3xl border border-border/70 bg-card p-5 text-center">
          <Stamp className="mx-auto h-6 w-6 text-[#e2723d]" />
          <p className="mt-2 font-display text-3xl font-black text-[#c96f4a]">{checkIns.length}</p>
          <p className="text-xs text-muted-foreground">累计打卡</p>
        </div>
        <div className="card-lift rounded-3xl border border-border/70 bg-card p-5 text-center">
          <Footprints className="mx-auto h-6 w-6 text-[#84a59d]" />
          <p className="mt-2 font-display text-3xl font-black text-[#4d6b60]">{categories}</p>
          <p className="text-xs text-muted-foreground">解锁玩法类型</p>
        </div>
        <div className="card-lift rounded-3xl border border-border/70 bg-card p-5 text-center">
          <Award className="mx-auto h-6 w-6 text-[#d9a84a]" />
          <p className="mt-2 font-display text-3xl font-black text-[#b98a3c]">
            {BADGES.filter((b) => checkIns.length >= b.need).length}/{BADGES.length}
          </p>
          <p className="text-xs text-muted-foreground">徽章进度</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {BADGES.map((b) => {
          const got = checkIns.length >= b.need;
          return (
            <span
              key={b.name}
              className={`chip flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm ${
                got
                  ? "border-[#d9a84a] bg-[#f8ead0] font-semibold text-[#8a6420]"
                  : "border-dashed border-border text-muted-foreground"
              }`}
            >
              <Award className="h-4 w-4" />
              {b.name} · {b.need}次
            </span>
          );
        })}
      </div>

      {/* 打卡时间线 */}
      {sorted.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <p className="text-muted-foreground">还没有打卡记录。这个周末，从第一个戳开始？</p>
          <button
            onClick={onGoExplore}
            className="interactive mt-4 rounded-full bg-[#84a59d] px-6 py-2.5 text-sm font-bold text-white"
          >
            去探索
          </button>
        </div>
      ) : (
        <ol className="mt-8 space-y-4 border-l-2 border-dashed border-[#d8c6ac] pl-5">
          {sorted.map((c, i) => {
            const a = activityOf(c.activityId);
            if (!a) return null;
            return (
              <li key={c.id} className="animate-rise relative" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                <span className="absolute -left-[27px] top-4 h-3 w-3 rounded-full bg-[#e2723d] ring-4 ring-[#f7ede2]" />
                <article className="card-lift flex gap-4 rounded-3xl border border-border/70 bg-card p-4">
                  <img src={a.image} alt={a.title} loading="lazy" className="card-img h-20 w-20 shrink-0 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-bold">{a.title}</h3>
                      <button
                        onClick={() => onRemove(c.id)}
                        className="interactive shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-[#c94f4f]"
                        aria-label="删除打卡"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {c.date} · {c.weather} · {"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}
                    </p>
                    {c.note && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">“{c.note}”</p>}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
