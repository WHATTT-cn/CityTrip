import { ACTIVITIES } from "@/data/activities";
import type { TeamPost } from "@/types";
import { CalendarDays, MapPin, Plus, Users } from "lucide-react";

interface Props {
  teams: TeamPost[];
  onJoin: (id: string) => void;
  onCreate: () => void;
  joinedIds: Set<string>;
}

/** 组队出发 */
export default function TeamUp({ teams, onJoin, onCreate, joinedIds }: Props) {
  const activityOf = (id: string) => ACTIVITIES.find((a) => a.id === id);

  return (
    <div className="animate-rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">组队出发</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            一个人不想动？加入别人的小队，或者自己发起一队。
          </p>
        </div>
        <button
          onClick={onCreate}
          className="interactive animate-cta-glow flex items-center gap-1.5 rounded-full bg-[#e2723d] px-5 py-2.5 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" /> 发起组队
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {teams.map((t, i) => {
          const a = activityOf(t.activityId);
          if (!a) return null;
          const full = t.joined >= t.capacity;
          const joined = joinedIds.has(t.id);
          return (
            <article
              key={t.id}
              className="card-lift animate-rise flex gap-4 rounded-3xl border border-border/70 bg-card p-4 shadow-[0_8px_24px_-14px_rgba(70,50,30,0.3)]"
              style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}
            >
              <img
                src={a.image}
                alt={a.title}
                loading="lazy"
                className="card-img h-28 w-24 shrink-0 rounded-2xl object-cover sm:h-32 sm:w-28"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-bold leading-snug">{a.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                      full ? "bg-muted text-muted-foreground" : "bg-[#eef3ef] text-[#4d6b60]"
                    }`}
                  >
                    {t.joined}/{t.capacity} 人
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{t.note}</p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-[#c96f4a]" /> {t.date}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#c96f4a]" /> {t.meetPoint}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex -space-x-2">
                    {t.members.slice(0, 4).map((m) => (
                      <span
                        key={m}
                        title={m}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-[#84a59d] text-[11px] font-bold text-white"
                      >
                        {m[0]}
                      </span>
                    ))}
                    {t.members.length > 4 && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-[11px] font-bold">
                        +{t.members.length - 4}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onJoin(t.id)}
                    disabled={full && !joined}
                    className={`interactive flex items-center gap-1 rounded-xl px-4 py-1.5 text-sm font-semibold ${
                      joined
                        ? "border border-[#d98e4a] bg-[#f6e3c8] text-[#a55d1f]"
                        : full
                          ? "cursor-not-allowed bg-muted text-muted-foreground"
                          : "bg-[#84a59d] text-white"
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    {joined ? "已加入" : full ? "已满员" : "加入小队"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
