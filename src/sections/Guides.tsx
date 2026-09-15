import { ACTIVITIES } from "@/data/activities";
import type { Guide } from "@/types";
import { Heart, Lightbulb, PenLine } from "lucide-react";

interface Props {
  guides: Guide[];
  onLike: (id: string) => void;
  onCreate: () => void;
}

/** 攻略分享墙 */
export default function Guides({ guides, onLike, onCreate }: Props) {
  const activityOf = (id: string) => ACTIVITIES.find((a) => a.id === id);
  const sorted = [...guides].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="animate-rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">攻略分享</h2>
          <p className="mt-1 text-sm text-muted-foreground">踩过的坑和私藏机位，都写给大家。</p>
        </div>
        <button
          onClick={onCreate}
          className="interactive animate-cta-glow flex items-center gap-1.5 rounded-full bg-[#e2723d] px-5 py-2.5 text-sm font-bold text-white"
        >
          <PenLine className="h-4 w-4" /> 发布攻略
        </button>
      </div>

      <div className="mt-6 columns-1 gap-5 md:columns-2">
        {sorted.map((g, i) => {
          const a = activityOf(g.activityId);
          return (
            <article
              key={g.id}
              className="card-lift animate-rise mb-5 break-inside-avoid overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_8px_24px_-14px_rgba(70,50,30,0.3)]"
              style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}
            >
              {a && (
                <div className="relative h-36 overflow-hidden">
                  <img src={a.image} alt={a.title} loading="lazy" className="card-img h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
                    {a.title}
                  </span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-display text-lg font-bold leading-snug">{g.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">by {g.author}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{g.content}</p>
                {g.tips.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {g.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-1.5 text-xs text-[#4d6b60]">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#d9a84a]" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => onLike(g.id)}
                    className={`interactive flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold ${
                      g.likedByMe
                        ? "border-[#e2723d] bg-[#fbe3d8] text-[#c94f2a]"
                        : "border-border bg-background/70"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${g.likedByMe ? "fill-[#e2723d] text-[#e2723d]" : ""}`} />
                    {g.likes}
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
