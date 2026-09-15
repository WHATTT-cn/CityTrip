import { ACTIVITIES } from "@/data/activities";
import type { Activity, CheckIn, Guide, TeamPost, Weather } from "@/types";
import { X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-rise max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="interactive rounded-full p-1.5 hover:bg-secondary" aria-label="关闭">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background/70 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#84a59d] focus:ring-2 focus:ring-[#84a59d]/30";

/* ---------------- 发起组队 ---------------- */
export function TeamModal({
  preselect,
  onClose,
  onSubmit,
}: {
  preselect: Activity | null;
  onClose: () => void;
  onSubmit: (t: TeamPost) => void;
}) {
  const [activityId, setActivityId] = useState(preselect?.id ?? ACTIVITIES[0].id);
  const [creator, setCreator] = useState("");
  const [date, setDate] = useState("本周六 10:00");
  const [meetPoint, setMeetPoint] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [note, setNote] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `t${Date.now()}`,
      activityId,
      creator: creator.trim() || "匿名同学",
      date,
      meetPoint: meetPoint.trim() || "集合点待定",
      capacity,
      joined: 1,
      note: note.trim() || "一起出发吧！",
      members: [creator.trim() || "匿名同学"],
      createdAt: Date.now(),
    });
    onClose();
  };

  return (
    <ModalShell title="发起组队" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3.5">
        <label className="block text-sm font-semibold">
          选择活动
          <select value={activityId} onChange={(e) => setActivityId(e.target.value)} className={`${inputCls} mt-1.5`}>
            {ACTIVITIES.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}（{a.price === 0 ? "免费" : `¥${a.price}`}）
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold">
            你的昵称
            <input value={creator} onChange={(e) => setCreator(e.target.value)} placeholder="怎么称呼你" className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block text-sm font-semibold">
            出发时间
            <input value={date} onChange={(e) => setDate(e.target.value)} className={`${inputCls} mt-1.5`} />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          集合地点
          <input value={meetPoint} onChange={(e) => setMeetPoint(e.target.value)} placeholder="例：地铁 X 号线 XX 站 A 口" className={`${inputCls} mt-1.5`} />
        </label>
        <label className="block text-sm font-semibold">
          人数上限（含自己）：{capacity} 人
          <input type="range" min={2} max={10} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="mt-2 w-full accent-[#e2723d]" />
        </label>
        <label className="block text-sm font-semibold">
          想说的话
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="例：新手局，欢迎蹭队～" className={`${inputCls} mt-1.5 resize-none`} />
        </label>
        <button type="submit" className="interactive w-full rounded-xl bg-[#e2723d] py-3 text-sm font-bold text-white">
          发布组队
        </button>
      </form>
    </ModalShell>
  );
}

/* ---------------- 打卡 ---------------- */
export function CheckInModal({
  activity,
  weather,
  onClose,
  onSubmit,
}: {
  activity: Activity;
  weather: Weather;
  onClose: () => void;
  onSubmit: (c: CheckIn) => void;
}) {
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState("");
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `c${Date.now()}`,
      activityId: activity.id,
      date: dateStr,
      rating,
      note: note.trim(),
      weather,
      createdAt: Date.now(),
    });
    onClose();
  };

  return (
    <ModalShell title={`打卡 · ${activity.title}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <img src={activity.image} alt={activity.title} className="h-36 w-full rounded-2xl object-cover" />
        <div className="text-sm font-semibold">
          这次体验打几分？
          <div className="mt-2 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className={`chip text-2xl ${s <= rating ? "text-[#e2a13d]" : "text-border"}`}
                aria-label={`${s} 星`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <label className="block text-sm font-semibold">
          一句话感想
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="例：落叶比照片里还好看！" className={`${inputCls} mt-1.5 resize-none`} />
        </label>
        <button type="submit" className="interactive w-full rounded-xl bg-[#84a59d] py-3 text-sm font-bold text-white">
          盖下这个戳
        </button>
      </form>
    </ModalShell>
  );
}

/* ---------------- 发布攻略 ---------------- */
export function GuideModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (g: Guide) => void;
}) {
  const [activityId, setActivityId] = useState(ACTIVITIES[0].id);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [tips, setTips] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `g${Date.now()}`,
      activityId,
      title: title.trim() || "我的周末攻略",
      author: author.trim() || "匿名同学",
      content: content.trim() || "（还没来得及写正文）",
      tips: tips.split("\n").map((t) => t.trim()).filter(Boolean),
      likes: 0,
      createdAt: Date.now(),
    });
    onClose();
  };

  return (
    <ModalShell title="发布攻略" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3.5">
        <label className="block text-sm font-semibold">
          关联活动
          <select value={activityId} onChange={(e) => setActivityId(e.target.value)} className={`${inputCls} mt-1.5`}>
            {ACTIVITIES.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold">
            标题
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：三个私藏机位" className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block text-sm font-semibold">
            署名
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="你的昵称" className={`${inputCls} mt-1.5`} />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          正文
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="路线、时间线、花费、避雷……" className={`${inputCls} mt-1.5 resize-none`} />
        </label>
        <label className="block text-sm font-semibold">
          实用贴士（每行一条）
          <textarea value={tips} onChange={(e) => setTips(e.target.value)} rows={3} placeholder={"例：\n工作日人少一半\n带现金"} className={`${inputCls} mt-1.5 resize-none`} />
        </label>
        <button type="submit" className="interactive w-full rounded-xl bg-[#e2723d] py-3 text-sm font-bold text-white">
          分享给大家
        </button>
      </form>
    </ModalShell>
  );
}
