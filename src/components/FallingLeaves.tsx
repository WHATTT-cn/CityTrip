import { useEffect, useRef } from "react";

interface Leaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rot: number;
  rotSpeed: number;
  color: string;
  kind: "ginkgo" | "oval" | "maple";
  opacity: number;
}

/** 秋叶色板：银杏金 / 蜜橙 / 枫红 / 赭石 / 鼠尾草 */
const PALETTE = ["#E3B84E", "#D98E4A", "#C96F4A", "#B98A3C", "#A3B18A", "#E8C97A"];

function randomLeaf(w: number, h: number, fromTop: boolean): Leaf {
  const kindRoll = Math.random();
  return {
    x: Math.random() * w,
    y: fromTop ? -30 - Math.random() * 60 : Math.random() * h,
    size: 9 + Math.random() * 14,
    speedY: 0.5 + Math.random() * 1.1,
    swayAmp: 24 + Math.random() * 42,
    swayFreq: 0.4 + Math.random() * 0.7,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.03,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    kind: kindRoll < 0.45 ? "ginkgo" : kindRoll < 0.8 ? "oval" : "maple",
    opacity: 0.5 + Math.random() * 0.45,
  };
}

function drawGinkgo(ctx: CanvasRenderingContext2D, s: number) {
  // 银杏叶：扇形 + 叶柄
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, -s * 0.35, s * 0.72, Math.PI * 0.78, Math.PI * 2.22);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, s * 0.65);
  ctx.lineWidth = s * 0.09;
  ctx.stroke();
}

function drawOval(ctx: CanvasRenderingContext2D, s: number) {
  // 椭圆叶：两端尖 + 叶脉
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.8);
  ctx.quadraticCurveTo(s * 0.6, -s * 0.2, 0, s * 0.8);
  ctx.quadraticCurveTo(-s * 0.6, -s * 0.2, 0, -s * 0.8);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.7);
  ctx.lineTo(0, s * 0.7);
  ctx.lineWidth = s * 0.06;
  ctx.stroke();
}

function drawMaple(ctx: CanvasRenderingContext2D, s: number) {
  // 简化枫叶：五角裂片
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    const a1 = a - 0.32;
    const a2 = a + 0.32;
    ctx.lineTo(Math.cos(a1) * s * 0.28, Math.sin(a1) * s * 0.28);
    ctx.lineTo(Math.cos(a) * s * 0.85, Math.sin(a) * s * 0.85);
    ctx.lineTo(Math.cos(a2) * s * 0.28, Math.sin(a2) * s * 0.28);
  }
  ctx.closePath();
  ctx.fill();
}

/** 全屏落叶 canvas 背景（fixed，不拦截任何点击） */
export default function FallingLeaves({ density = 34 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let leaves: Leaf[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      leaves = Array.from({ length: density }, () => randomLeaf(w, h, false));
    };

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const leaf of leaves) {
        leaf.y += leaf.speedY;
        leaf.rot += leaf.rotSpeed;
        const swayX = Math.sin(t * leaf.swayFreq + leaf.phase) * leaf.swayAmp;

        if (leaf.y > h + 40) {
          Object.assign(leaf, randomLeaf(w, h, true));
          continue;
        }

        ctx.save();
        ctx.translate(leaf.x + swayX, leaf.y);
        ctx.rotate(leaf.rot + Math.sin(t * leaf.swayFreq + leaf.phase) * 0.35);
        ctx.globalAlpha = leaf.opacity;
        ctx.fillStyle = leaf.color;
        ctx.strokeStyle = leaf.color;
        if (leaf.kind === "ginkgo") drawGinkgo(ctx, leaf.size);
        else if (leaf.kind === "oval") drawOval(ctx, leaf.size);
        else drawMaple(ctx, leaf.size);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
