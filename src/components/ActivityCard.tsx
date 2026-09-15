import { matchLabel, type ScoredActivity } from "@/lib/recommend";
import { Clock, MapPin, Sparkles, Stamp, Users } from "lucide-react";

interface Props {
  activity: ScoredActivity;
  index: number;
  onTeamUp: (a: ScoredActivity) => void;
  onCheckIn: (a: ScoredActivity) => void;
  checkedIn: boolean;
}

/** 活动推荐卡片 */
export default function ActivityCard({ activity: a, index, onTeamUp, onCheckIn, checkedIn }: Props) {
  const strong = a.score >= 70;
  return (
    <article
      className="card-lift animate-rise overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_8px_24px_-14px_rgba(70,50,30,0.3)]"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      {/* 图片位：替换 a.image 即可换图 */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={a.image}
          alt={a.title}
          loading="lazy"
          className="card-img h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div
          className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow ${
            strong ? "bg-[#e2723d]" : "bg-black/55 backdrop-blur-sm"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {matchLabel(a.score)} · {a.score}分
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="rounded-full bg-white/85 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur-sm">
            {a.category}
          </span>
          <span className="rounded-full bg-white/85 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur-sm">
            {a.indoor ? "室内" : "户外"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-snug">{a.title}</h3>
          <span className={`shrink-0 font-display text-lg font-bold ${a.price === 0 ? "text-[#84a59d]" : "text-[#c96f4a]"}`}>
            {a.price === 0 ? "免费" : `¥${a.price}`}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {a.location} · {a.distanceKm}km
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {a.durationH}h
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {a.groupFit[0]}-{a.groupFit[1]}人
          </span>
        </div>

        {a.reasons.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {a.reasons.slice(0, 3).map((r) => (
              <span key={r} className="rounded-full bg-[#eef3ef] px-2 py-0.5 text-[11px] text-[#4d6b60]">
                {r}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onTeamUp(a)}
            className="interactive flex-1 rounded-xl bg-[#84a59d] px-3 py-2 text-sm font-semibold text-white"
          >
            组队出发
          </button>
          <button
            onClick={() => onCheckIn(a)}
            className={`interactive flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold ${
              checkedIn
                ? "border-[#d98e4a] bg-[#f6e3c8] text-[#a55d1f]"
                : "border-border bg-background/70"
            }`}
          >
            <Stamp className={`h-4 w-4 ${checkedIn ? "animate-pop-leaf" : ""}`} />
            {checkedIn ? "已打卡" : "打卡"}
          </button>
        </div>
      </div>
    </article>
  );
}
