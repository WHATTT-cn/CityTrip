import FallingLeaves from "@/components/FallingLeaves";
import { CheckInModal, GuideModal, TeamModal } from "@/components/Modals";
import { SEED_GUIDES, SEED_TEAMS } from "@/data/activities";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ScoredActivity } from "@/lib/recommend";
import CheckIns from "@/sections/CheckIns";
import DesignRationale from "@/sections/DesignRationale";
import Explore from "@/sections/Explore";
import Guides from "@/sections/Guides";
import TeamUp from "@/sections/TeamUp";
import type { Activity, CheckIn, Guide, Prefs, TeamPost } from "@/types";
import { Compass, Lightbulb, Map, Stamp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

type Tab = "explore" | "team" | "checkin" | "guide" | "design";

const TABS: { key: Tab; label: string; icon: typeof Map }[] = [
  { key: "explore", label: "探索", icon: Map },
  { key: "team", label: "组队", icon: Users },
  { key: "checkin", label: "打卡", icon: Stamp },
  { key: "guide", label: "攻略", icon: Lightbulb },
  { key: "design", label: "设计思路", icon: Compass },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("explore");

  const [prefs, setPrefs] = useLocalStorage<Prefs>("wknd.prefs", {
    interests: [],
    budget: 100,
    groupSize: 2,
    weather: "晴",
  });
  const [teams, setTeams] = useLocalStorage<TeamPost[]>("wknd.teams", SEED_TEAMS);
  const [checkIns, setCheckIns] = useLocalStorage<CheckIn[]>("wknd.checkins", []);
  const [guides, setGuides] = useLocalStorage<Guide[]>("wknd.guides", SEED_GUIDES);
  const [joinedIds, setJoinedIds] = useLocalStorage<string[]>("wknd.joined", []);

  const [teamModal, setTeamModal] = useState<{ open: boolean; preselect: Activity | null }>({ open: false, preselect: null });
  const [checkInTarget, setCheckInTarget] = useState<Activity | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  const checkedIds = useMemo(() => new Set(checkIns.map((c) => c.activityId)), [checkIns]);
  const joinedSet = useMemo(() => new Set(joinedIds), [joinedIds]);

  /* ---------- 动作 ---------- */
  const handleTeamUpFromCard = (a: ScoredActivity) => {
    setTeamModal({ open: true, preselect: a });
  };

  const handleCreateTeam = (t: TeamPost) => {
    setTeams((prev) => [t, ...prev]);
    setJoinedIds((prev) => [...prev, t.id]);
    toast.success("组队发布成功，等人来蹭队吧！");
    setTab("team");
  };

  const handleJoin = (id: string) => {
    if (joinedSet.has(id)) {
      // 再点一次退出小队
      setTeams((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, joined: Math.max(1, t.joined - 1), members: t.members.slice(0, -1) } : t,
        ),
      );
      setJoinedIds((prev) => prev.filter((x) => x !== id));
      toast("已退出小队");
      return;
    }
    setTeams((prev) =>
      prev.map((t) =>
        t.id === id && t.joined < t.capacity
          ? { ...t, joined: t.joined + 1, members: [...t.members, "我"] }
          : t,
      ),
    );
    setJoinedIds((prev) => [...prev, id]);
    toast.success("加入成功，记得按时到集合点！");
  };

  const handleCheckIn = (c: CheckIn) => {
    setCheckIns((prev) => [c, ...prev]);
    toast.success("打卡成功，又解锁一个周末！");
  };

  const handleGuide = (g: Guide) => {
    setGuides((prev) => [g, ...prev]);
    toast.success("攻略已发布，感谢分享！");
    setTab("guide");
  };

  const handleLike = (id: string) => {
    setGuides((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, likes: g.likedByMe ? g.likes - 1 : g.likes + 1, likedByMe: !g.likedByMe }
          : g,
      ),
    );
  };

  return (
    <div className="relative min-h-screen">
      <FallingLeaves />
      <Toaster position="top-center" richColors />

      {/* 顶部导航 */}
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-[#f7ede2]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <button onClick={() => setTab("explore")} className="interactive flex items-center gap-2 rounded-xl px-2 py-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e2723d] text-white shadow-[0_4px_12px_-4px_rgba(226,114,61,0.7)]">
              <Compass className="h-5 w-5 animate-spin-slow" />
            </span>
            <span className="font-display text-lg font-black tracking-wide">周末城市探索指南</span>
          </button>
          <div className="flex items-center gap-0.5 sm:gap-2">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`nav-link flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-semibold sm:px-3 ${
                  tab === key ? "active text-[#c94f2a]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {tab === "explore" && (
          <Explore
            prefs={prefs}
            onPrefsChange={setPrefs}
            onTeamUp={handleTeamUpFromCard}
            onCheckIn={(a) => setCheckInTarget(a)}
            checkedIds={checkedIds}
          />
        )}
        {tab === "team" && (
          <TeamUp
            teams={teams}
            onJoin={handleJoin}
            onCreate={() => setTeamModal({ open: true, preselect: null })}
            joinedIds={joinedSet}
          />
        )}
        {tab === "checkin" && (
          <CheckIns
            checkIns={checkIns}
            onRemove={(id) => setCheckIns((prev) => prev.filter((c) => c.id !== id))}
            onGoExplore={() => setTab("explore")}
          />
        )}
        {tab === "guide" && <Guides guides={guides} onLike={handleLike} onCreate={() => setGuideModalOpen(true)} />}
        {tab === "design" && <DesignRationale />}
      </main>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        周末城市探索指南 · 数据保存在本浏览器中，仅供演示
      </footer>

      {/* 弹窗 */}
      {teamModal.open && (
        <TeamModal
          preselect={teamModal.preselect}
          onClose={() => setTeamModal({ open: false, preselect: null })}
          onSubmit={handleCreateTeam}
        />
      )}
      {checkInTarget && (
        <CheckInModal
          activity={checkInTarget}
          weather={prefs.weather}
          onClose={() => setCheckInTarget(null)}
          onSubmit={handleCheckIn}
        />
      )}
      {guideModalOpen && <GuideModal onClose={() => setGuideModalOpen(false)} onSubmit={handleGuide} />}
    </div>
  );
}
