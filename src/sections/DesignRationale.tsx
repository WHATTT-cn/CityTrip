import { CloudSun, Coins, Puzzle, Users } from "lucide-react";

const PAINS = [
  {
    icon: Puzzle,
    pain: "信息太分散",
    detail: "展览在公众号、市集在小红书、演出在票务 App——想找个活动要翻五六个平台，还经常刷到已结束的。",
    solution: "聚合本地活动信息流",
    solutionDetail: "把展览、市集、演出、徒步等周末活动统一成一张卡片流，时间、地点、价格、时长一屏看懂。",
  },
  {
    icon: CloudSun,
    pain: "计划总被天气打乱",
    detail: "约好了徒步结果下雨，临时改计划又不知道室内能去哪。",
    solution: "天气感知推荐",
    solutionDetail: "推荐引擎把天气作为核心因子：晴天优先户外，雨天自动把美术馆、Livehouse、手作课顶到前面。",
  },
  {
    icon: Coins,
    pain: "学生党预算有限",
    detail: "看中的活动动辄一两百，月底只能宿舍躺平。",
    solution: "预算硬过滤 + 免费优先",
    solutionDetail: "预算滑块直接参与打分，免费活动额外加权，「白嫖党」也能玩得好。",
  },
  {
    icon: Users,
    pain: "想出门但约不到人",
    detail: "室友各有各的安排，一个人去又觉得没意思。",
    solution: "组队出发 + 打卡社区",
    solutionDetail: "每个活动都能一键发起/加入小队；打卡和攻略机制让「去过的人」带「想去的人」。",
  },
];

/** 设计思路：痛点 → 设计决策 */
export default function DesignRationale() {
  return (
    <div className="animate-rise">
      <h2 className="font-display text-2xl font-bold">为什么这样设计</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        先搞清楚大学生周末出行的真实痛点，再决定做什么功能、界面长什么样。
      </p>

      <div className="mt-6 space-y-4">
        {PAINS.map((p, i) => (
          <div
            key={p.pain}
            className="card-lift animate-rise grid gap-4 rounded-3xl border border-border/70 bg-card p-5 sm:grid-cols-2 sm:p-6"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fbe3d8]">
                  <p.icon className="h-5 w-5 text-[#c94f2a]" />
                </span>
                <h3 className="font-display text-lg font-bold">痛点{i + 1}：{p.pain}</h3>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.detail}</p>
            </div>
            <div className="rounded-2xl bg-[#eef3ef] p-4">
              <p className="text-sm font-bold text-[#4d6b60]">→ {p.solution}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#4d6b60]/80">{p.solutionDetail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold">视觉与动效设计</h3>
        <ul className="mt-3 grid gap-2.5 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
          <li>· 暖纸色底 + 秋叶金 / 鼠尾草绿 / 珊瑚橙，呼应「秋日周末出门走走」的氛围；</li>
          <li>· 全屏银杏叶飘落动效做背景，弱化工具感、强化季节感；</li>
          <li>· 按钮悬停上浮、按压缩放，卡片悬停抬升 + 图片缓放，所有可点元素都有反馈；</li>
          <li>· 衬线中文标题 + 圆角大卡片，营造「手账拼贴」般的亲切感。</li>
        </ul>
      </div>
    </div>
  );
}
