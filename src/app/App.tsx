import React, { useState, useEffect, useRef } from "react";
import bookClubPoster from "@/imports/___________1__.jpg";
import LogoSvg from "@/imports/Group1-1/index";
import svgPaths from "@/imports/Group1-1/svg-yxzi5u9lke";
import JinhyeokAvatar from "@/imports/Layer1/index";
import EnoAvatar from "@/imports/Group12/index";
import SyndrogiAvatar from "@/imports/Group6-1/index";
import StaceyAvatar from "@/imports/Group8/index";
import JaewonAvatar from "@/imports/Group7-1/index";
import JunyoungAvatar from "@/imports/Group9-1/index";
import JunseoAvatar from "@/imports/Group11-1/index";
import HonggyuAvatar from "@/imports/Group10-1/index";
import ChaeminAvatar from "@/imports/Group4-2/index";
import QAvatar from "@/imports/Group2-1/index";
import DanaAvatar from "@/imports/Group3/index";
import HyunjuAvatar from "@/imports/Group13/index";
import MingyuAvatar from "@/imports/Group14/index";
import GwanhoAvatar from "@/imports/Group16/index";
import ddoazooLogo from "@/imports/image-1.png";
import DdoazooLogo from "@/imports/Vector/index";
import velfontLogo from "@/imports/vel_font_logo.png";
import enoLogo from "@/imports/image.png";
import enoAvatar from "@/imports/image-2.png";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':\",./<>?\\`~";
const HEX_CHARS = "0123456789ABCDEF";

const TZ = "Asia/Seoul" as const;
const COLOR_PALETTE = ["#00ff41","#ff0033","#ffcc00","#00ccff","#ff6600","#cc44ff","#ff44aa","#44ffcc"] as const;
const COLOR_PALETTE_FULL = [...COLOR_PALETTE, "#99ff66","#8844ff","#ffaa44","#ff88ff"] as const;

const PRIMARY = "#00ff41";
const DANGER = "#ff0033";
const AVATAR_FRAME = 200;

const PROJECT_STATUS_COLOR: Record<string, string> = { ACTIVE:"#00ff41", COMPLETED:"#ffcc00", ONGOING:"#ffcc00", DORMANT:"#ff6600" };
const EVENT_STATUS_COLOR: Record<string, string> = { CONFIRMED:"#ff6600", CANCELLED:"#ff0033", PAST:"#888888" };
const getStatusColor = (map: Record<string,string>, s: string, fallback = PRIMARY) => map[s] ?? fallback;
type CalEvent = { id: string; date: string; title: string; desc: string; color: string };

function buildEditLog(existing: EditLogEntry[], by: string): EditLogEntry[] {
  if (!by.trim()) return existing;
  const now = new Date().toLocaleString("ko-KR", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  return [...existing, { by: by.trim(), at: now }];
}

function editorStyles(c: string) {
  const base: React.CSSProperties = { background:"rgba(0,0,0,0.6)", border:`1px solid ${c}30`, color:c, fontFamily:"'Share Tech Mono',monospace", outline:"none", width:"100%", padding:"6px 10px", fontSize:"12px" };
  return {
    input: base,
    label: { color:c+"60", fontSize:"11px", fontFamily:"'Share Tech Mono',monospace", display:"block", marginBottom:"4px" } as React.CSSProperties,
    select: { ...base, cursor:"pointer", appearance:"none" as const } as React.CSSProperties,
  };
}

function useTypewriter(lines: string[], speed = 40) {
  const [output, setOutput] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    setOutput([]);
    setDone(false);
    const tick = setInterval(() => {
      if (lineIdx >= lines.length) { setDone(true); clearInterval(tick); return; }
      const current = lines[lineIdx];
      charIdx++;
      setOutput((prev) => {
        const next = [...prev];
        while (next.length <= lineIdx) next.push("");
        next[lineIdx] = current.slice(0, charIdx);
        return next;
      });
      if (charIdx >= current.length) { lineIdx++; charIdx = 0; }
    }, speed);
    return () => clearInterval(tick);
  }, [lines.join("|"), speed]);
  return { output, done };
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 13;
    let maskData: Uint8ClampedArray | null = null;
    let maskW = 0, maskH = 0, maskOX = 0, maskOY = 0;
    let animId = 0;
    let drops: number[] = [];
    let frameCount = 0;

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / fontSize);
      if (drops.length !== cols) drops = Array(cols).fill(1);
    };

    const buildMask = () => {
      if (!canvas.width || !canvas.height) return;
      const size = Math.min(canvas.width, canvas.height) * 0.65;
      maskW = Math.max(1, Math.ceil(size));
      maskH = Math.max(1, Math.ceil(size));
      maskOX = (canvas.width - maskW) / 2;
      maskOY = (canvas.height - maskH) / 2;
      const off = document.createElement("canvas");
      off.width = maskW; off.height = maskH;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;
      offCtx.fillStyle = "#fff";
      offCtx.fillRect(0, 0, maskW, maskH);
      const scale = maskW / 1398.58;
      offCtx.save();
      offCtx.scale(scale, scale);
      offCtx.fillStyle = "#000";
      Object.values(svgPaths).forEach((d) => {
        try {
          const p = new Path2D(d as string);
          offCtx.fill(p);
        } catch (_) {}
      });
      offCtx.restore();
      try {
        maskData = offCtx.getImageData(0, 0, maskW, maskH).data;
      } catch (_) {
        maskData = null;
      }
    };

    const isLogo = (x: number, y: number): boolean => {
      if (!maskData) return false;
      const lx = Math.floor(x - maskOX);
      const ly = Math.floor(y - maskOY);
      if (lx < 0 || ly < 0 || lx >= maskW || ly >= maskH) return false;
      return maskData[(ly * maskW + lx) * 4] < 100;
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const inLogo = isLogo(x, y);
        const ch = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        if (inLogo) {
          const alpha = Math.random() * 0.45 + 0.55;
          ctx.shadowColor = PRIMARY;
          ctx.shadowBlur = 12;
          ctx.fillStyle = drops[i] * fontSize < 40 ? `rgba(255,255,255,${alpha})` : `rgba(0,255,65,${alpha})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(0,255,65,${Math.random() * 0.08 + 0.02})`;
        }
        ctx.fillText(ch, x, y);
        ctx.shadowBlur = 0;
        if (frameCount % 6 === 0) {
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }
      frameCount++;
      animId = requestAnimationFrame(draw);
    };

    initCanvas();
    buildMask();
    animId = requestAnimationFrame(draw);

    const onResize = () => { initCanvas(); buildMask(); };
    window.addEventListener("resize", onResize);

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

function ScanlineOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
    }} />
  );
}

function GlitchLine({ text, size = "text-6xl md:text-8xl", spacing = "0.12em" }: { text: string; size?: string; spacing?: string }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.15) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 120 + Math.random() * 200);
      }
    }, 800 + Math.random() * 400);
    return () => clearInterval(id);
  }, []);
  const shared: React.CSSProperties = { letterSpacing: spacing, fontFamily: "'VT323', monospace" };
  return (
    <div className="relative inline-block select-none leading-none">
      <h1 className={`font-['VT323'] ${size}`} style={{
        ...shared, color: PRIMARY,
        textShadow: glitch ? `3px 0 ${DANGER}, -3px 0 #0033ff, 0 0 20px ${PRIMARY}` : `0 0 20px ${PRIMARY}, 0 0 40px ${PRIMARY}60`,
        transform: glitch ? `translate(${Math.random() * 6 - 3}px, ${Math.random() * 4 - 2}px)` : "none",
        transition: "transform 0.05s",
      }}>{text}</h1>
      {glitch && (<>
        <h1 className={`font-['VT323'] ${size} absolute inset-0`} style={{ ...shared, color: DANGER, clipPath: "polygon(0 30%, 100% 25%, 100% 40%, 0 45%)", transform: "translate(4px, 0)", opacity: 0.8 }}>{text}</h1>
        <h1 className={`font-['VT323'] ${size} absolute inset-0`} style={{ ...shared, color: "#0033ff", clipPath: "polygon(0 60%, 100% 55%, 100% 70%, 0 75%)", transform: "translate(-4px, 0)", opacity: 0.8 }}>{text}</h1>
      </>)}
    </div>
  );
}

function GlitchTitle() {
  return (
    <div className="flex flex-col gap-0 leading-none">
      <GlitchLine text="5th Ave" size="text-3xl md:text-4xl" spacing="0.2em" />
      <GlitchLine text="BIPOLAR KIDS" size="text-7xl md:text-9xl" spacing="0.08em" />
    </div>
  );
}

function Terminal({ lines, prompt }: { lines: string[]; prompt?: string }) {
  const { output, done } = useTypewriter(lines, 30);
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="rounded-none border p-4 font-['Share_Tech_Mono'] text-sm leading-relaxed" style={{
      background: "rgba(0,0,0,0.82)", borderColor: `${PRIMARY}30`,
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      boxShadow: `0 0 30px ${PRIMARY}15, inset 0 0 30px #00000080`,
    }}>
      <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: `1px solid ${PRIMARY}20` }}>
        <div className="w-3 h-3 rounded-full bg-red-600" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full" style={{ background: PRIMARY }} />
        <span className="text-xs ml-2" style={{ color: `${PRIMARY}50` }}>terminal — bash — 80×24</span>
      </div>
      {output.map((line, i) => (
        <div key={i} style={{ color: (line ?? "").startsWith(">>") ? DANGER : (line ?? "").startsWith("[") ? "#ffcc00" : PRIMARY }}>{line}</div>
      ))}
      {done && <div style={{ color: PRIMARY }}>{prompt ?? "root@darknet:~$"} {cursor ? "█" : " "}</div>}
    </div>
  );
}

function AccessPanel({ onAccess, onDeny }: { onAccess: (isSecret: boolean) => void; onDeny: () => void }) {
  const [code, setCode] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [shake, setShake] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleSubmit = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const lower = code.toLowerCase().trim();
      if (lower === "bipolar kids") {
        onAccess(true);
      } else if (code === "0000") {
        onAccess(true);
      } else {
        setAttempt((a) => a + 1);
        setShake(true);
        setCode("");
        setTimeout(() => setShake(false), 500);
        if (attempt >= 2) onDeny();
      }
    }, 1500);
  };

  return (
    <div className={`border p-6 font-['Share_Tech_Mono'] ${shake ? "animate-pulse" : ""}`} style={{
      borderColor: attempt > 0 ? `${DANGER}80` : `${PRIMARY}30`,
      background: "rgba(0,5,0,0.85)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      boxShadow: attempt > 0 ? `0 0 30px ${DANGER}30` : `0 0 30px ${PRIMARY}10`,
    }}>
      <div className="text-xs mb-4" style={{ color: `${PRIMARY}60` }}>■ AUTHORIZATION REQUIRED ■</div>
      <div className="text-xs mb-6" style={{ color: attempt > 0 ? DANGER : `${PRIMARY}90` }}>
        {attempt === 0 && "ENTER ACCESS CODE TO CONTINUE"}
        {attempt === 1 && ">> INVALID CODE. 2 ATTEMPTS REMAINING"}
        {attempt === 2 && ">> SECURITY BREACH DETECTED. FINAL ATTEMPT"}
      </div>
      <input
        type="password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        maxLength={4}
        placeholder="_ _ _ _"
        className="w-full bg-transparent outline-none text-center text-2xl tracking-widest mb-6"
        style={{ color: PRIMARY, borderBottom: `1px solid ${PRIMARY}50`, fontFamily: "'VT323', monospace", caretColor: PRIMARY }}
      />
      {scanning ? (
        <div className="text-center animate-pulse font-['Share_Tech_Mono']" style={{ color: "#ffcc00", letterSpacing: "0.1em" }}>[ SCANNING... ]</div>
      ) : (
        <button onClick={handleSubmit} className="w-full py-2 font-['VT323'] text-xl tracking-widest transition-all duration-200"
          style={{ background: attempt > 1 ? `${DANGER}20` : `${PRIMARY}15`, border: `1px solid ${attempt > 1 ? `${DANGER}80` : `${PRIMARY}50`}`, color: attempt > 1 ? DANGER : PRIMARY }}
          onMouseEnter={(e) => { (e.currentTarget).style.background = attempt > 1 ? `${DANGER}40` : `${PRIMARY}30`; }}
          onMouseLeave={(e) => { (e.currentTarget).style.background = attempt > 1 ? `${DANGER}20` : `${PRIMARY}15`; }}
        >[ AUTHENTICATE ]</button>
      )}
      <div className="mt-4 text-center text-xs" style={{ color: `${PRIMARY}30` }}>ENTER NUMERIC CODE // WORDS ALSO ACCEPTED</div>
    </div>
  );
}

// ── Shared small components ───────────────────────────────────────────────────

function CornerBrackets({ color }: { color: string }) {
  return <>
    {(["tl","tr","bl","br"] as const).map(pos => (
      <div key={pos} className="absolute w-4 h-7" style={{
        top: pos[0]==="t" ? 8 : "auto", bottom: pos[0]==="b" ? 8 : "auto",
        left: pos[1]==="l" ? 8 : "auto", right: pos[1]==="r" ? 8 : "auto",
        borderTop: pos[0]==="t" ? `2px solid ${color}80` : "none",
        borderBottom: pos[0]==="b" ? `2px solid ${color}80` : "none",
        borderLeft: pos[1]==="l" ? `2px solid ${color}80` : "none",
        borderRight: pos[1]==="r" ? `2px solid ${color}80` : "none",
      }} />
    ))}
  </>;
}

function TagList({ tags, color }: { tags: string[]; color: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => <span key={tag} className="text-xs px-2 py-0.5" style={{ border: `1px solid ${color}30`, color: color+"70" }}>#{tag}</span>)}
    </div>
  );
}

function PosterPlaceholder({ code, color, label }: { code: string; color: string; label?: string }) {
  return (
    <div className="flex items-center justify-center" style={{ height: 300, border: `1px solid ${color}20`, background: color+"05" }}>
      <div className="text-center">
        <div className="font-['VT323'] text-6xl mb-2" style={{ color: color+"30" }}>{code}</div>
        <div className="text-xs" style={{ color: color+"30" }}>{label ?? "IMAGE TBD"}</div>
      </div>
    </div>
  );
}

function ModalOverlay({ color, code, onClose, children }: { color: string; code: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.92)" }} onClick={onClose}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)" }} />
      <div className="relative border font-['Share_Tech_Mono'] w-full max-w-3xl flex flex-col" style={{ borderColor: color+"50", background: "#020202", boxShadow: `0 0 60px ${color}25`, maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${color}25`, background: "#020202" }}>
          <span className="text-xs" style={{ color: color+"60" }}>{code} // DETAIL VIEW</span>
          <button onClick={onClose} className="text-xs px-3 py-1 transition-all" style={{ color, border: `1px solid ${color}40` }} onMouseEnter={e => (e.currentTarget.style.background = color+"20")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>[ CLOSE ]</button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function AddButton({ onClick, label = "+ ADD" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1 font-['VT323'] text-base tracking-widest transition-all hover:opacity-100 opacity-70"
      style={{ border:`1px solid ${PRIMARY}50`, color: PRIMARY, background:`${PRIMARY}10` }}
    >{label}</button>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function AvatarFrame({ member }: { member: Member }) {
  const Avatar = member.customAvatar;
  if (!Avatar && member.logoImage === enoAvatar) {
    return (
      <div
        role="img"
        aria-label={member.codename}
        style={{
          width: AVATAR_FRAME * 0.9,
          height: AVATAR_FRAME * 0.9,
          margin: AVATAR_FRAME * 0.05,
          backgroundColor: member.color,
          maskImage: `url("${member.logoImage}")`,
          maskSize: "contain",
          maskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskImage: `url("${member.logoImage}")`,
          WebkitMaskSize: "contain",
          WebkitMaskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    );
  }
  if (!Avatar && member.logoImage) {
    return (
      <div style={{ width: AVATAR_FRAME, height: AVATAR_FRAME, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={member.logoImage}
          alt={member.codename}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(0) invert(1) sepia(1) saturate(10) hue-rotate(${member.color === "#ff44aa" ? "290deg" : "90deg"})` }}
        />
      </div>
    );
  }
  if (!Avatar) return null;
  const aspect = member.avatarAspect ?? 1;
  const innerW = Math.round(aspect < 1 ? AVATAR_FRAME * aspect : AVATAR_FRAME);
  const innerH = Math.round(aspect < 1 ? AVATAR_FRAME : AVATAR_FRAME / aspect);
  const offsetX = (AVATAR_FRAME - innerW) / 2;
  const uid = member.codename.replace(/\s+/g, "_");
  return (
    <div style={{ width: AVATAR_FRAME, height: AVATAR_FRAME, position: "relative", overflow: "hidden" }}>
      <style>{`#av-${uid} svg{width:${innerW}px!important;height:${innerH}px!important;max-width:none!important;overflow:hidden!important;display:block!important;flex-shrink:0!important}#av-${uid} path,#av-${uid} rect,#av-${uid} circle,#av-${uid} ellipse,#av-${uid} polygon{fill:${member.color}!important}`}</style>
      <div id={`av-${uid}`} style={{ position: "absolute", left: offsetX, top: 0, width: innerW, height: innerH, overflow: "hidden", color: member.color, lineHeight: 0, fontSize: 0 } as React.CSSProperties}>
        <Avatar />
      </div>
    </div>
  );
}

// ── Member editor modal ───────────────────────────────────────────────────────
function MemberEditor({ member, onSave, onClose }: { member: Member; onSave: (m: Member) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<Member>({ ...member });
  const c = draft.color;
  const s = editorStyles(c);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.88)", backdropFilter:"blur(8px)" }}>
      <div className="w-full max-w-lg border font-['Share_Tech_Mono'] flex flex-col" style={{ maxHeight:"90vh", borderColor:c+"50", background:"rgba(2,8,2,0.97)", boxShadow:`0 0 60px ${c}20` }}>
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3" style={{ borderBottom:`1px solid ${c}20`, background:"rgba(0,0,0,0.6)" }}>
          <div className="font-['VT323'] text-xl tracking-widest" style={{ color:c }}>[ EDIT ENTITY ]</div>
          <button onClick={onClose} className="font-['VT323'] text-2xl leading-none opacity-50 hover:opacity-100" style={{ color:c }}>✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="mb-4">
            <div className="text-xs tracking-widest mb-3" style={{ color:c+"60" }}>KEY COLOR</div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-9 h-7 overflow-hidden rounded-sm cursor-pointer flex-shrink-0" style={{ border:`1px solid ${c}50` }}>
                <input type="color" value={draft.color} onChange={e => setDraft(d=>({...d,color:e.target.value}))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" style={{ transform:"scale(2)" }} />
                <div className="w-full h-full" style={{ background:c }} />
              </div>
              {COLOR_PALETTE_FULL.map(pc => (
                <button key={pc} onClick={() => setDraft(d=>({...d,color:pc}))} className="w-6 h-6 rounded-sm transition-transform hover:scale-125 flex-shrink-0"
                  style={{ background:pc, border:draft.color===pc?"2px solid #fff":"1px solid transparent", boxShadow:draft.color===pc?`0 0 8px ${pc}`:"none" }} />
              ))}
            </div>
          </div>
          {([
            { label:"NAME",    key:"codename" as const, type:"input" },
            { label:"ROLE",    key:"role"     as const, type:"input" },
            { label:"BIO",     key:"bio"      as const, type:"textarea" },
            { label:"IG",      key:"instagram" as const, type:"input" },
            { label:"CONTACT", key:"contact"  as const, type:"input" },
          ]).map(({ label, key, type }) => (
            <div key={key}>
              <label style={s.label}>{label}</label>
              {type === "textarea"
                ? <textarea value={draft[key] as string} onChange={e => setDraft(d=>({...d,[key]:e.target.value}))} rows={2} style={{ ...s.input, resize:"none" }} />
                : <input value={draft[key] as string} onChange={e => setDraft(d=>({...d,[key]:e.target.value}))} style={s.input} />}
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 flex gap-3 px-5 py-3" style={{ borderTop:`1px solid ${c}20`, background:"rgba(0,0,0,0.5)" }}>
          <button onClick={onClose} className="flex-1 py-2 font-['VT323'] text-lg tracking-widest" style={{ border:`1px solid ${c}30`, color:c+"60" }}>[ CANCEL ]</button>
          <button onClick={() => onSave(draft)} className="flex-1 py-2 font-['VT323'] text-lg tracking-widest" style={{ border:`1px solid ${c}80`, color:c, background:c+"15" }}>[ SAVE ]</button>
        </div>
      </div>
    </div>
  );
}

// ── Interfaces ────────────────────────────────────────────────────────────────
interface Member {
  codename: string;
  role: string;
  instagram: string;
  contact: string;
  bio: string;
  color: string;
  portfolioUrl?: string;
  customAvatar?: React.ComponentType;
  avatarAspect?: number;
  logoImage?: string;
}

interface EditLogEntry { by: string; at: string; }

interface Project {
  code: string;
  title: string;
  category: string;
  desc: string;
  status: string;
  year: string;
  color: string;
  tags: string[];
  poster: string | null;
  details: { label: string; value: string }[];
  author: string;
  organizer: string;
  editLog: EditLogEntry[];
}

interface EventData {
  code: string;
  title: string;
  date: string;
  location: string;
  desc: string;
  status: string;
  color: string;
  tags: string[];
  poster: string | null;
  details: { label: string; value: string }[];
  author: string;
  organizer: string;
  editLog: EditLogEntry[];
}

// ── Member card ───────────────────────────────────────────────────────────────
function MemberCard({ member, onEdit, onDelete }: { member: Member; onEdit: () => void; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };

  // mouse is tracked for future tilt effects
  void mouse;

  return (
    <div
      ref={containerRef}
      className="relative border p-0 overflow-hidden transition-all duration-500 cursor-pointer flex flex-col h-full"
      style={{ borderColor: hovered ? member.color+"60" : member.color+"20", background: hovered ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.65)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", boxShadow: hovered ? `0 0 40px ${member.color}20` : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMouse({ x:0.5, y:0.5 }); }}
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-center justify-between px-4 py-2 text-xs" style={{ borderBottom:`1px solid ${member.color}20` }}>
        <span className="font-['VT323'] text-base tracking-wider" style={{ color: member.color }}>{member.codename}</span>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-xs px-2 py-0.5 transition-all hover:opacity-100 opacity-40" style={{ border:`1px solid ${member.color}50`, color: member.color, fontFamily:"'Share Tech Mono',monospace" }} title="Edit member">EDIT</button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="text-xs px-2 py-0.5 transition-all hover:opacity-100 opacity-40" style={{ border:`1px solid ${DANGER}50`, color: DANGER, fontFamily:"'Share Tech Mono',monospace" }}>DEL</button>
        </div>
      </div>

      <div className="flex flex-col items-center p-4 gap-4 flex-1">
        <div className="relative" style={{ filter: hovered ? `drop-shadow(0 0 12px ${member.color}60)` : "none", transition:"filter 0.4s", width: AVATAR_FRAME, height: AVATAR_FRAME, overflow: "hidden", flexShrink: 0 }}>
          <AvatarFrame member={member} />
          <CornerBrackets color={member.color} />
        </div>

        <div className="w-full font-['Share_Tech_Mono'] text-center flex flex-col flex-1">
          <div className="font-['VT323'] text-3xl mb-1 leading-tight break-words" style={{ color: member.color, textShadow:`0 0 15px ${member.color}80`, wordBreak:"break-word" }}>
            {member.codename}
          </div>
          <div className="text-xs mb-2 leading-snug" style={{ color: member.color+"80" }}>{member.role}</div>
          <div className="text-xs leading-relaxed mb-3 flex-1" style={{ color: member.color+"90" }}>{member.bio}</div>

          <div className="space-y-1 text-xs mt-auto">
            <div className="flex justify-between items-center px-2 py-1 gap-2" style={{ borderTop:`1px solid ${member.color}15`, borderBottom:`1px solid ${member.color}15` }}>
              <span className="flex-shrink-0" style={{ color: member.color+"50" }}>IG</span>
              <span className="text-right truncate" style={{ color: member.color }}>@{member.instagram}</span>
            </div>
            <div className="flex justify-between items-start px-2 py-1 gap-2" style={{ borderBottom:`1px solid ${member.color}15` }}>
              <span className="flex-shrink-0" style={{ color: member.color+"50" }}>CONTACT</span>
              <button onClick={() => setRevealed(r=>!r)} className="transition-all duration-300 text-right break-all text-xs" style={{ color: revealed ? member.color : member.color+"40" }}>
                {revealed ? member.contact : "[ REVEAL ]"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared display components ─────────────────────────────────────────────────
function DetailGrid({ details, color }: { details: { label: string; value: string }[]; color: string }) {
  return (
    <div className="space-y-2 pt-2" style={{ borderTop:`1px solid ${color}20` }}>
      {details.map((d) => (
        <div key={d.label} className="grid grid-cols-3 gap-2 text-xs py-1" style={{ borderBottom:`1px solid ${color}10` }}>
          <span style={{ color:color+"50" }}>{d.label}</span>
          <span className="col-span-2" style={{ color }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function CreditsBlock({ author, organizer, editLog, color }: { author: string; organizer: string; editLog: EditLogEntry[]; color: string }) {
  if (!author && !organizer && !editLog.length) return null;
  return (
    <div className="space-y-1 pt-3" style={{ borderTop:`1px solid ${color}15` }}>
      {author && <div className="flex gap-2 text-xs"><span style={{ color:color+"45", minWidth:80 }}>AUTHOR</span><span style={{ color:color+"90" }}>{author}</span></div>}
      {organizer && <div className="flex gap-2 text-xs"><span style={{ color:color+"45", minWidth:80 }}>ORGANIZER</span><span style={{ color:color+"90" }}>{organizer}</span></div>}
      {editLog.length > 0 && (
        <div className="pt-2">
          <div className="text-xs mb-1" style={{ color:color+"40" }}>// EDIT LOG</div>
          {editLog.map((e, i) => (
            <div key={i} className="flex gap-2 text-xs py-0.5" style={{ borderBottom:`1px solid ${color}08` }}>
              <span style={{ color:color+"50", minWidth:130 }}>{e.at}</span>
              <span style={{ color:color+"80" }}>{e.by}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        className="border transition-all duration-300 cursor-pointer font-['Share_Tech_Mono']"
        style={{
          borderColor: hovered ? project.color + "70" : project.color + "25",
          background: hovered ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.6)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          boxShadow: hovered ? `0 0 30px ${project.color}15` : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs mb-1" style={{ color: project.color + "60" }}>{project.code} // {project.category}</div>
              <div className="text-2xl" style={{ fontFamily: "'Galmuri11', monospace", color: project.color, textShadow: `0 0 10px ${project.color}60` }}>{project.title}</div>
            </div>
            <div className="text-right">
              <div className="text-xs" style={{ color: project.color + "50" }}>{project.year}</div>
              <div className="text-xs mt-1 px-2 py-0.5" style={{
                color: getStatusColor(PROJECT_STATUS_COLOR, project.status),
                border: `1px solid ${getStatusColor(PROJECT_STATUS_COLOR, project.status)}40`,
              }}>{project.status}</div>
            </div>
          </div>
          <div className="text-xs leading-relaxed mb-3" style={{ color: project.color + "90" }}>{project.desc}</div>
          <TagList tags={project.tags} color={project.color} />
          <div className="text-xs mt-3" style={{ color: project.color + "40" }}>[ 클릭하여 상세 보기 ▼ ]</div>
        </div>
      </div>

      {open && (
        <ModalOverlay color={project.color} code={project.code} onClose={() => setOpen(false)}>
          <div className="p-5 grid md:grid-cols-2 gap-6">
            <div>
              {project.poster ? (
                <div className="relative" style={{ border: `1px solid ${project.color}30` }}>
                  <img src={project.poster} alt={project.title} className="w-full object-contain" />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)" }} />
                </div>
              ) : (
                <PosterPlaceholder code={project.code} color={project.color} />
              )}
            </div>
            <div className="space-y-4">
              <div className="text-4xl leading-snug" style={{ fontFamily: "'Galmuri11', monospace", color: project.color, textShadow: `0 0 20px ${project.color}60` }}>
                {project.title}
              </div>
              <div className="flex gap-3 text-xs">
                <span style={{ color: project.color + "60" }}>{project.year}</span>
                <span style={{ color: getStatusColor(PROJECT_STATUS_COLOR, project.status), border: "1px solid currentColor", padding: "0 6px" }}>{project.status}</span>
              </div>
              <div className="text-xs leading-relaxed" style={{ color: project.color + "90" }}>{project.desc}</div>
              <DetailGrid details={project.details} color={project.color}/>
              <div className="pt-2"><TagList tags={project.tags} color={project.color} /></div>
              <CreditsBlock author={project.author} organizer={project.organizer} editLog={project.editLog||[]} color={project.color}/>
            </div>
          </div>
        </ModalOverlay>
      )}
    </>
  );
}

function EventCard({ event }: { event: EventData }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        className="border font-['Share_Tech_Mono'] transition-all duration-300 cursor-pointer"
        style={{
          borderColor: hovered ? event.color + "70" : event.color + "30",
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          boxShadow: hovered ? `0 0 30px ${event.color}15` : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-between px-4 py-2 text-xs" style={{ borderBottom: `1px solid ${event.color}20` }}>
          <span style={{ color: event.color + "60" }}>{event.code} // EVENT</span>
          <span className="px-2 py-0.5" style={{
            color: getStatusColor(EVENT_STATUS_COLOR, event.status),
            border: `1px solid ${getStatusColor(EVENT_STATUS_COLOR, event.status)}40`,
          }}>{event.status}</span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="text-2xl" style={{ fontFamily: "'Galmuri11', monospace", color: event.color, textShadow: `0 0 12px ${event.color}60` }}>
              {event.title}
            </div>
            <div className="text-right text-xs space-y-1" style={{ color: event.color + "60" }}>
              <div>{event.date}</div>
              <div>{event.location}</div>
            </div>
          </div>
          <div className="text-xs leading-relaxed mb-4" style={{ color: event.color + "90" }}>{event.desc}</div>
          <TagList tags={event.tags} color={event.color} />
          <div className="text-xs mt-3" style={{ color: event.color + "50" }}>[ 클릭하여 상세 보기 ▼ ]</div>
        </div>
      </div>

      {open && (
        <ModalOverlay color={event.color} code={event.code} onClose={() => setOpen(false)}>
          <div className="p-5 grid md:grid-cols-2 gap-6">
            <div>
              {event.poster ? (
                <div className="relative" style={{ border: `1px solid ${event.color}30` }}>
                  <img src={event.poster} alt={event.title + " 포스터"} className="w-full object-contain" />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)" }} />
                </div>
              ) : (
                <PosterPlaceholder code="?" color={event.color} label="POSTER TBD" />
              )}
            </div>
            <div className="space-y-4">
              <div className="text-4xl leading-snug" style={{ fontFamily: "'Galmuri11', monospace", color: event.color, textShadow: `0 0 20px ${event.color}60` }}>
                {event.title}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: event.color + "90" }}>{event.desc}</div>
              <DetailGrid details={event.details} color={event.color}/>
              <div className="pt-2"><TagList tags={event.tags} color={event.color} /></div>
              <CreditsBlock author={event.author} organizer={event.organizer} editLog={event.editLog||[]} color={event.color}/>
            </div>
          </div>
        </ModalOverlay>
      )}
    </>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    code: "PRJ-001",
    title: "기린대학교",
    category: "INSTITUTION",
    desc: "비인가 교육기관으로, 커리큘럼을 제공하지 않습니다.",
    status: "ACTIVE",
    year: "2026—",
    color: "#00ff41",
    tags: ["collective", "school", "experiment", "underground"],
    poster: null,
    details: [
      { label: "성격", value: "비공식 집단 학교 — 커리큘럼 없음, 출석 없음, 졸업 없음" },
      { label: "구성원", value: "5th Ave Bipolar Kids 전 멤버" },
      { label: "활동", value: "독서모임, 영화감상회, 리스닝 파티, 비정기 세션" },
      { label: "상태", value: "상시 운영 중" },
    ],
    author: "5th Ave Bipolar Kids",
    organizer: "",
    editLog: [],
  },
  {
    code: "PRJ-002",
    title: "Business Class",
    category: "MUSIC RELEASE",
    desc: "비행 3부작 중 두번째 작품. Economy Class 이후 4년만의 음원 프로젝트.",
    status: "ACTIVE",
    year: "2026",
    color: "#ffcc00",
    tags: ["music", "release", "hiphop", "experimental"],
    poster: null,
    details: [
      { label: "형식", value: "EP / 싱글 시리즈" },
      { label: "장르", value: "Hip-Hop / Experimental / R&B" },
      { label: "공개", value: "2025년 — 순차 릴리즈 예정" },
      { label: "프로듀서", value: "5th Ave Bipolar Kids 자체 제작" },
    ],
    author: "5th Ave Bipolar Kids",
    organizer: "",
    editLog: [],
  },
  {
    code: "PRJ-003",
    title: "Static Motel",
    category: "PROJECT",
    desc: "이방인의 하루.",
    status: "ONGOING",
    year: "2026—",
    color: "#ff6600",
    tags: ["multimedia", "visual", "sound", "installation"],
    poster: null,
    details: [
      { label: "형식", value: "멀티미디어 프로젝트" },
      { label: "매체", value: "사운드, 비주얼, 텍스트, 설치" },
      { label: "컨셉", value: "정지와 움직임의 공존 — 모텔이라는 중간 상태의 공간" },
      { label: "상태", value: "진행 중 — 공개 일정 미정" },
    ],
    author: "5th Ave Bipolar Kids",
    organizer: "",
    editLog: [],
  },
  {
    code: "PRJ-004",
    title: "VOID ARCHIVE",
    category: "ARCHIVE",
    desc: "옛날에 만들다가 덜만들고 버린거 다시 주워다 재활용하는 아이디어 집합소.",
    status: "DORMANT",
    year: "2026—",
    color: "#8844ff",
    tags: ["archive", "unreleased", "wip", "vault"],
    poster: null,
    details: [
      { label: "내용", value: "미발표 비트, 초고 가사, 비주얼 스케치, 폐기된 아이디어" },
      { label: "접근", value: "멤버 전용 — 외부 공개 미정" },
      { label: "규모", value: "2023년 이후 누적 중" },
      { label: "상태", value: "휴면 중 — 언젠가 깨어날 것" },
    ],
    author: "5th Ave Bipolar Kids",
    organizer: "",
    editLog: [],
  },
];

const INITIAL_MEMBERS: Member[] = [
  {
    codename: "Jinhyeok Jang",
    role: "PRODUCER / DESIGNER",
    instagram: "ddoazoo",
    contact: "ddoazoo@gmail.com",
    bio: "DDOAZOO",
    color: "#00ff41",
    customAvatar: JinhyeokAvatar,
    avatarAspect: 0.912,
    logoImage: ddoazooLogo,
  },
  {
    codename: "Q",
    role: "CREATIVE DIRECTOR",
    instagram: "q_gyuna",
    contact: "qgyuna@gmail.com",
    bio: "Guilty pleasure",
    color: "#ff0033",
    customAvatar: QAvatar,
  },
  {
    codename: "Eno",
    role: "DESIGNER",
    instagram: "eeeno.jpg",
    contact: "N/A",
    bio: "Be My Kiss",
    color: "#ff44aa",
    logoImage: enoAvatar,
    avatarAspect: 0.718,
  },
  {
    codename: "Syndrogi",
    role: "HUMAN",
    instagram: "velfontoffice",
    contact: "velfont0000@gmail.com",
    bio: "All for vel",
    color: "#00ccff",
    customAvatar: SyndrogiAvatar,
    avatarAspect: 0.842,
  },
  {
    codename: "Stacey Nah",
    role: "FASHION PHOTOGRAPHER",
    instagram: "staceynah",
    contact: "stacey100407@gmail.com",
    bio: "Alleged Fashion Photographer Certified Bad bitch",
    color: "#ffaa44",
    customAvatar: StaceyAvatar,
    avatarAspect: 0.811,
  },
  {
    codename: "Jaewon Lim",
    role: "SCIENTIST",
    instagram: "jwlim_00",
    contact: "jaewonlim.21@gmail.com",
    bio: "New York Based Biologist",
    color: "#44ffcc",
    customAvatar: JaewonAvatar,
    avatarAspect: 0.935,
  },
  {
    codename: "Honggyu Kim",
    role: "SAMPLER / SOUND DESIGNER",
    instagram: "nostalgyu",
    contact: "hg5639@naver.com",
    bio: "Lifeguard · Team YE Leader",
    color: "#cc44ff",
    customAvatar: HonggyuAvatar,
    avatarAspect: 0.988,
  },
  {
    codename: "Chaemin Song",
    role: "MANAGER / STRATEGIST",
    instagram: "cha_m_2sl2",
    contact: "N/A",
    bio: "Instagram and Social Media Communications Manager",
    color: "#ffcc00",
    customAvatar: ChaeminAvatar,
    avatarAspect: 0.931,
  },
  {
    codename: "Hyunju Park",
    role: "WRITER",
    instagram: "prufroxk",
    contact: "N/A",
    bio: "Mayocheeze the Best Cat",
    color: "#88ddff",
    customAvatar: HyunjuAvatar,
    avatarAspect: 0.549,
  },
  {
    codename: "Junseo Jang",
    role: "PRODUCER / ENGINEER",
    instagram: "je5b179",
    contact: "N/A",
    bio: "팀장님 또 바뀜",
    color: "#ff6600",
    customAvatar: JunseoAvatar,
    avatarAspect: 1.012,
  },
  {
    codename: "Mingyu Kim",
    role: "STYLIST / ART DIRECTOR",
    instagram: "mingyuboi",
    contact: "N/A",
    bio: "남친 크롬하츠로 우빵잡지마라",
    color: "#ff88ff",
    customAvatar: MingyuAvatar,
    avatarAspect: 0.865,
  },
  {
    codename: "Gwanho Baek",
    role: "CHEERLEADER",
    instagram: "gwann_bag",
    contact: "N/A",
    bio: "Handsome guy Based in Daegu",
    color: "#99ff66",
    customAvatar: GwanhoAvatar,
    avatarAspect: 0.806,
  },
  {
    codename: "Dana Kim",
    role: "NAHYUNG KIM",
    instagram: "nauunz",
    contact: "N/A",
    bio: "8월에 실습나감",
    color: "#ff88aa",
    customAvatar: DanaAvatar,
  },
  {
    codename: "Junyoung Kim",
    role: "LISTENER",
    instagram: "keemjunyoung",
    contact: "wnsals0565@naver.com",
    bio: "Whiskey Lover",
    color: "#8844ff",
    customAvatar: JunyoungAvatar,
    avatarAspect: 1.010,
  },
];

const INITIAL_EVENTS: EventData[] = [
  {
    code: "EVT-001",
    title: "제 1회 독서클럽",
    date: "2026.08.09 (일)",
    location: "온라인 (Zoom) — 추후 링크 안내",
    desc: "5th Ave Bipolar Kids 첫 번째 독서 모임. 각자 책을 읽고 느낀 생각과 감정을 자유롭게 나눈다. 텍스트와 텍스트가 충돌하는 자리.",
    status: "SCHEDULED",
    color: "#00ff41",
    tags: ["reading", "club", "collective", "1st"],
    poster: bookClubPoster,
    details: [
      { label: "이번 책", value: "인간실격 — 다자이 오사무 (人間失格)" },
      { label: "모임 일시", value: "2026.08.09 (일) 한국시간 기준 오후 10시 / 일정 변동시 공지" },
      { label: "모임 장소", value: "온라인 (Zoom) — 추후 링크 안내" },
      { label: "모임 내용", value: "각자 책을 읽고 느낀 생각과 감정을 자유롭게 나눕니다." },
      { label: "참여 대상", value: "바이폴라 키즈, 팀 내 소속 멤버 또는 독서모임에 참여를 원하는 누구나" },
    ],
    author: "5th Ave Bipolar Kids",
    organizer: "",
    editLog: [],
  },
  {
    code: "EVT-002",
    title: "영화감상회",
    date: "TBD",
    location: "LOCATION: [UNDISCLOSED]",
    desc: "함께 보고, 함께 해석한다. 장르 불문. 한 편의 영화가 끝난 뒤 남는 것들을 이야기하는 자리. 감상은 개인적이지만 나누면 달라진다.",
    status: "SCHEDULED",
    color: "#ffcc00",
    tags: ["film", "screening", "discussion", "collective"],
    poster: null,
    details: [
      { label: "형식", value: "함께 같은 영화를 보고, 이후 자유로운 감상 공유" },
      { label: "장르", value: "불문 — 매 회 다른 작품 선정" },
      { label: "일시", value: "추후 공지" },
      { label: "참여 대상", value: "바이폴라 키즈 멤버 및 초대된 게스트" },
    ],
    author: "5th Ave Bipolar Kids",
    organizer: "",
    editLog: [],
  },
  {
    code: "EVT-003",
    title: "LISTENING PARTY",
    date: "2025.08 // BUSAN",
    location: "송정, 부산",
    desc: "8월 중 부산 송정에서 열리는 리스닝 파티. 파도 소리와 우리 소리가 만나는 밤. Business Class 및 신작 트랙들을 처음으로 공개하는 자리. 초대된 자만 입장 가능.",
    status: "CONFIRMED",
    color: "#ff6600",
    tags: ["listening-party", "busan", "songjung", "live", "exclusive"],
    poster: null,
    details: [
      { label: "장소", value: "부산 송정" },
      { label: "일정", value: "2025년 8월 중 (정확한 날짜 추후 공지)" },
      { label: "내용", value: "Business Class 및 신작 트랙 최초 공개 리스닝" },
      { label: "입장", value: "초대된 자만 입장 가능 — INVITE ONLY" },
    ],
    author: "5th Ave Bipolar Kids",
    organizer: "",
    editLog: [],
  },
];

// ── Shared image uploader ─────────────────────────────────────────────────────
function ImageUploader({ current, color, onChange }: { current: string | null; color: string; onChange: (url: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <div className="text-xs mb-2" style={{ color: color + "60", fontFamily: "'Share Tech Mono',monospace" }}>IMAGE / POSTER</div>
      <div className="flex gap-2 items-start">
        {current ? (
          <div className="relative flex-1" style={{ border: `1px solid ${color}30` }}>
            <img src={current} alt="preview" className="w-full object-contain" style={{ maxHeight: 160 }} />
            <button
              onClick={() => onChange(null)}
              className="absolute top-1 right-1 text-xs px-2 py-0.5"
              style={{ background: "rgba(0,0,0,0.85)", border: `1px solid ${DANGER}60`, color: DANGER, fontFamily: "'Share Tech Mono',monospace" }}
            >✕ REMOVE</button>
          </div>
        ) : (
          <div
            className="flex-1 flex items-center justify-center cursor-pointer transition-all"
            style={{ height: 80, border: `1px dashed ${color}40`, background: color + "05" }}
            onClick={() => inputRef.current?.click()}
          >
            <span className="text-xs" style={{ color: color + "60", fontFamily: "'Share Tech Mono',monospace" }}>[ CLICK TO UPLOAD IMAGE ]</span>
          </div>
        )}
        {!current && (
          <button
            onClick={() => inputRef.current?.click()}
            className="text-xs px-3 py-2 flex-shrink-0"
            style={{ border: `1px solid ${color}50`, color, background: color + "10", fontFamily: "'Share Tech Mono',monospace" }}
          >UPLOAD</button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

function CreditsFormSection({ draft, editedBy, c, s, setDraft, setEditedBy }: {
  draft: { author: string; organizer: string };
  editedBy: string; c: string;
  s: ReturnType<typeof editorStyles>;
  setDraft: (fn: (d: Record<string, unknown>) => Record<string, unknown>) => void;
  setEditedBy: (v: string) => void;
}) {
  return (
    <>
      <div style={{ borderTop:`1px solid ${c}15`, paddingTop:"12px" }}>
        <div className="text-xs mb-3" style={{ color:c+"40" }}>// CREDITS</div>
        <div className="space-y-3">
          <div><label style={s.label}>AUTHOR (작성자)</label><input value={draft.author||""} onChange={e=>setDraft(d=>({...d,author:e.target.value}))} style={s.input} placeholder="이름"/></div>
          <div><label style={s.label}>ORGANIZER (주최자)</label><input value={draft.organizer||""} onChange={e=>setDraft(d=>({...d,organizer:e.target.value}))} style={s.input} placeholder="이름 또는 단체"/></div>
        </div>
      </div>
      <div style={{ borderTop:`1px solid ${c}15`, paddingTop:"12px" }}>
        <div className="text-xs mb-3" style={{ color:c+"40" }}>// EDIT LOG — 저장 시 기록됩니다</div>
        <div><label style={s.label}>EDITED BY</label><input value={editedBy} onChange={e=>setEditedBy(e.target.value)} style={s.input} placeholder="수정한 사람 이름 (비워두면 기록 안됨)"/></div>
      </div>
    </>
  );
}

const PROJECT_STATUS_OPTIONS_LIST = ["ACTIVE","ONGOING","COMPLETED","DORMANT","CANCELLED"];
const EVENT_STATUS_OPTIONS = ["SCHEDULED", "CONFIRMED", "ONGOING", "PAST", "CANCELLED"];

function ProjectEditor({ project, onSave, onClose }: { project: Project; onSave: (p: Project) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<Project>({ ...project });
  const [editedBy, setEditedBy] = useState("");
  const c = draft.color || PRIMARY;
  const s = editorStyles(c);
  const up = (key: keyof Project, val: string) => setDraft(d => ({ ...d, [key]: val }));
  const handleSave = () => onSave({ ...draft, editLog: buildEditLog(draft.editLog || [], editedBy) });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.88)", backdropFilter:"blur(8px)" }}>
      <div className="w-full max-w-lg border font-['Share_Tech_Mono'] flex flex-col" style={{ maxHeight:"88vh", borderColor:c+"50", background:"rgba(2,8,2,0.97)" }}>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom:`1px solid ${c}20` }}>
          <span className="text-sm" style={{ color:c }}>// {draft.code || "NEW PROJECT"}</span>
          <button onClick={onClose} style={{ color:c+"60" }}>✕</button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <ImageUploader current={draft.poster} color={c} onChange={url=>setDraft(d=>({...d,poster:url}))}/>
          {([{key:"title",label:"TITLE"},{key:"category",label:"CATEGORY"},{key:"year",label:"YEAR"},{key:"color",label:"COLOR (hex)"}] as {key:keyof Project;label:string}[]).map(({key,label})=>(
            <div key={key}><label style={s.label}>{label}</label><input value={(draft[key] as string)||""} onChange={e=>up(key,e.target.value)} style={s.input}/></div>
          ))}
          <div>
            <label style={s.label}>STATUS</label>
            <select value={draft.status} onChange={e=>up("status",e.target.value)} style={s.select}>
              {PROJECT_STATUS_OPTIONS_LIST.map(o=><option key={o} value={o} style={{background:"#020202",color:c}}>{o}</option>)}
            </select>
          </div>
          <div><label style={s.label}>DESC</label><textarea value={draft.desc||""} onChange={e=>setDraft(d=>({...d,desc:e.target.value}))} rows={3} style={{...s.input,resize:"vertical"}}/></div>
          <div><label style={s.label}>TAGS (comma separated)</label><input value={draft.tags?.join(", ")||""} onChange={e=>setDraft(d=>({...d,tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)}))} style={s.input}/></div>
          <CreditsFormSection draft={draft} editedBy={editedBy} c={c} s={s} setDraft={setDraft as Parameters<typeof CreditsFormSection>[0]["setDraft"]} setEditedBy={setEditedBy}/>
        </div>
        <div className="flex-shrink-0 flex gap-3 px-5 py-3" style={{ borderTop:`1px solid ${c}20` }}>
          <button onClick={onClose} className="flex-1 py-2 font-['VT323'] text-lg tracking-widest" style={{ border:`1px solid ${c}30`, color:c+"60" }}>[ CANCEL ]</button>
          <button onClick={handleSave} className="flex-1 py-2 font-['VT323'] text-lg tracking-widest" style={{ border:`1px solid ${c}80`, color:c, background:c+"15" }}>[ SAVE ]</button>
        </div>
      </div>
    </div>
  );
}

function EventEditor({ event, onSave, onClose }: { event: EventData; onSave: (e: EventData) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<EventData>({ ...event });
  const [editedBy, setEditedBy] = useState("");
  const c = draft.color || PRIMARY;
  const s = editorStyles(c);
  const up = (key: keyof EventData, val: string) => setDraft(d => ({ ...d, [key]: val }));
  const handleSave = () => onSave({ ...draft, editLog: buildEditLog(draft.editLog || [], editedBy) });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.88)", backdropFilter:"blur(8px)" }}>
      <div className="w-full max-w-lg border font-['Share_Tech_Mono'] flex flex-col" style={{ maxHeight:"88vh", borderColor:c+"50", background:"rgba(2,8,2,0.97)" }}>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom:`1px solid ${c}20` }}>
          <span className="text-sm" style={{ color:c }}>// {draft.code || "NEW EVENT"}</span>
          <button onClick={onClose} style={{ color:c+"60" }}>✕</button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <ImageUploader current={draft.poster} color={c} onChange={url=>setDraft(d=>({...d,poster:url}))}/>
          {(["title","date","location","color"] as (keyof EventData)[]).map(key=>(
            <div key={key}><label style={s.label}>{String(key).toUpperCase()}</label><input value={(draft[key] as string)||""} onChange={e=>up(key,e.target.value)} style={s.input}/></div>
          ))}
          <div>
            <label style={s.label}>STATUS</label>
            <select value={draft.status} onChange={e=>up("status",e.target.value)} style={s.select}>
              {EVENT_STATUS_OPTIONS.map(o=><option key={o} value={o} style={{background:"#020202",color:c}}>{o}</option>)}
            </select>
          </div>
          <div><label style={s.label}>DESC</label><textarea value={draft.desc||""} onChange={e=>setDraft(d=>({...d,desc:e.target.value}))} rows={3} style={{...s.input,resize:"vertical"}}/></div>
          <div><label style={s.label}>TAGS (comma separated)</label><input value={draft.tags?.join(", ")||""} onChange={e=>setDraft(d=>({...d,tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)}))} style={s.input}/></div>
          <CreditsFormSection draft={draft} editedBy={editedBy} c={c} s={s} setDraft={setDraft as Parameters<typeof CreditsFormSection>[0]["setDraft"]} setEditedBy={setEditedBy}/>
        </div>
        <div className="flex-shrink-0 flex gap-3 px-5 py-3" style={{ borderTop:`1px solid ${c}20` }}>
          <button onClick={onClose} className="flex-1 py-2 font-['VT323'] text-lg tracking-widest" style={{ border:`1px solid ${c}30`, color:c+"60" }}>[ CANCEL ]</button>
          <button onClick={handleSave} className="flex-1 py-2 font-['VT323'] text-lg tracking-widest" style={{ border:`1px solid ${c}80`, color:c, background:c+"15" }}>[ SAVE ]</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab content components ────────────────────────────────────────────────────

function ProjectsTab({ projects, setProjects }: { projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>> }) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs" style={{ color: `${PRIMARY}40` }}>// {projects.length} PROJECTS FOUND IN MANIFEST</div>
        <AddButton onClick={() => { setEditingProject({ code: `PRJ-${String(projects.length+1).padStart(3,"0")}`, title:"", category:"", desc:"", status:"ACTIVE", year:"2026", color: PRIMARY, tags:[], poster:null, details:[], author:"", organizer:"", editLog:[] }); setIsAddingProject(true); }} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[...projects].reverse().map((p) => (
          <div key={p.code} className="relative group flex flex-col">
            <ProjectCard project={p} />
            <div className="flex gap-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderTop: `1px solid ${p.color}20` }}>
              <button
                onClick={e => { e.stopPropagation(); setEditingProject(p); setIsAddingProject(false); }}
                className="flex-1 py-1.5 text-xs font-['Share_Tech_Mono'] transition-all"
                style={{ border: "none", borderRight: `1px solid ${p.color}20`, color: p.color + "80", background: p.color + "08" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = p.color + "18"; (e.currentTarget as HTMLButtonElement).style.color = p.color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = p.color + "08"; (e.currentTarget as HTMLButtonElement).style.color = p.color + "80"; }}
              >[ EDIT ]</button>
              <button
                onClick={e => { e.stopPropagation(); if(confirm("Delete this project?")) setProjects(ps => ps.filter(x => x.code !== p.code)); }}
                className="flex-1 py-1.5 text-xs font-['Share_Tech_Mono'] transition-all"
                style={{ border: "none", color: `${DANGER}70`, background: "#ff000308" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ff003318"; (e.currentTarget as HTMLButtonElement).style.color = DANGER; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ff000308"; (e.currentTarget as HTMLButtonElement).style.color = `${DANGER}70`; }}
              >[ DEL ]</button>
            </div>
          </div>
        ))}
      </div>
      {editingProject && (
        <ProjectEditor
          project={editingProject}
          onClose={() => { setEditingProject(null); setIsAddingProject(false); }}
          onSave={updated => {
            if (isAddingProject) setProjects(ps => [...ps, updated]);
            else setProjects(ps => ps.map(p => p.code === updated.code ? updated : p));
            setEditingProject(null);
            setIsAddingProject(false);
          }}
        />
      )}
    </div>
  );
}

function MembersTab({ members, setMembers, editingMemberIdx, setEditingMemberIdx, isAddingMember, setIsAddingMember }: {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  editingMemberIdx: number | null;
  setEditingMemberIdx: React.Dispatch<React.SetStateAction<number | null>>;
  isAddingMember: boolean;
  setIsAddingMember: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs" style={{ color: `${PRIMARY}40` }}>// {members.length} ENTITIES IDENTIFIED — HOVER TO INTERACT</div>
        <AddButton onClick={() => {
          const newIdx = members.length;
          setMembers(ms => [...ms, { codename:"NEW_MEMBER", role:"", instagram:"", contact:"N/A", bio:"", color: PRIMARY }]);
          setIsAddingMember(true);
          setEditingMemberIdx(newIdx);
        }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {members.map((m, idx) => (
          <MemberCard
            key={m.codename + idx}
            member={m}
            onEdit={() => setEditingMemberIdx(idx)}
            onDelete={() => { if(confirm("Remove this member?")) setMembers(ms => ms.filter((_,i)=>i!==idx)); }}
          />
        ))}
      </div>
      <div className="text-xs text-center mt-6" style={{ color: `${PRIMARY}30` }}>
        ※ 인스타그램 ID 및 연락처는 실제 정보로 교체하세요
      </div>
      {editingMemberIdx !== null && (
        <MemberEditor
          member={members[editingMemberIdx]}
          onSave={(updated) => { setMembers(ms => ms.map((x, i) => i === editingMemberIdx ? updated : x)); setEditingMemberIdx(null); setIsAddingMember(false); }}
          onClose={() => { if (isAddingMember) setMembers(ms => ms.filter((_, i) => i !== editingMemberIdx)); setEditingMemberIdx(null); setIsAddingMember(false); }}
        />
      )}
    </div>
  );
}

function EventsTab({ events, setEvents }: { events: EventData[]; setEvents: React.Dispatch<React.SetStateAction<EventData[]>> }) {
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs" style={{ color: `${PRIMARY}40` }}>// {events.length} EVENTS SCHEDULED — COORDINATES CONFIRMED</div>
        <AddButton onClick={() => { setEditingEvent({ code: `EVT-${String(events.length+1).padStart(3,"0")}`, title:"", date:"TBD", location:"", desc:"", status:"SCHEDULED", color: PRIMARY, tags:[], poster:null, details:[], author:"", organizer:"", editLog:[] }); setIsAddingEvent(true); }} />
      </div>
      <div className="grid md:grid-cols-1 gap-4 max-w-2xl">
        {[...events].reverse().map((event) => (
          <div key={event.code} className="relative group flex flex-col">
            <EventCard event={event} />
            <div className="flex gap-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderTop: `1px solid ${event.color}20` }}>
              <button
                onClick={e => { e.stopPropagation(); setEditingEvent(event); setIsAddingEvent(false); }}
                className="flex-1 py-1.5 text-xs font-['Share_Tech_Mono'] transition-all"
                style={{ border: "none", borderRight: `1px solid ${event.color}20`, color: event.color + "80", background: event.color + "08" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = event.color + "18"; (e.currentTarget as HTMLButtonElement).style.color = event.color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = event.color + "08"; (e.currentTarget as HTMLButtonElement).style.color = event.color + "80"; }}
              >[ EDIT ]</button>
              <button
                onClick={e => { e.stopPropagation(); if(confirm("Delete this event?")) setEvents(evs => evs.filter(x => x.code !== event.code)); }}
                className="flex-1 py-1.5 text-xs font-['Share_Tech_Mono'] transition-all"
                style={{ border: "none", color: `${DANGER}70`, background: "#ff000308" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ff003318"; (e.currentTarget as HTMLButtonElement).style.color = DANGER; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ff000308"; (e.currentTarget as HTMLButtonElement).style.color = `${DANGER}70`; }}
              >[ DEL ]</button>
            </div>
          </div>
        ))}
      </div>
      {editingEvent && (
        <EventEditor
          event={editingEvent}
          onClose={() => { setEditingEvent(null); setIsAddingEvent(false); }}
          onSave={updated => {
            if (isAddingEvent) setEvents(evs => [...evs, updated]);
            else setEvents(evs => evs.map(e => e.code === updated.code ? updated : e));
            setEditingEvent(null);
            setIsAddingEvent(false);
          }}
        />
      )}
    </div>
  );
}

function AboutTab() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0" style={{ width: 110, height: 110, filter: "invert(1) sepia(1) saturate(5) hue-rotate(90deg)", opacity: 0.85 }}>
          <LogoSvg />
        </div>
        <div>
          <div className="text-xs mb-1 font-['Share_Tech_Mono']" style={{ color: `${PRIMARY}50` }}>
            ENTITY // COLLECTIVE
          </div>
          <div className="font-['VT323'] text-5xl leading-none" style={{ color: PRIMARY, textShadow: `0 0 20px ${PRIMARY}80` }}>
            5th Ave
          </div>
          <div className="font-['VT323'] text-4xl leading-none tracking-widest" style={{ color: PRIMARY, textShadow: `0 0 15px ${PRIMARY}60` }}>
            BIPOLAR KIDS
          </div>
        </div>
      </div>

      <div className="space-y-3 font-['Share_Tech_Mono'] text-xs leading-relaxed" style={{ borderLeft: `2px solid ${PRIMARY}25`, paddingLeft: "1.25rem" }}>
        <p style={{ color: PRIMARY }}>
          5th Ave Bipolar Kids는 서울, 대구, 뉴욕을 거점으로 활동하는 언더그라운드 크리에이티브 콜렉티브다.
          음악, 시각예술, 텍스트, 디자인, 퍼포먼스 등 장르의 경계를 넘나들며 다양한 형태의 작업을 이어간다.
        </p>
        <p style={{ color: `${PRIMARY}80` }}>
          2026년 밴드로 결성되었다. 그러나 저조한 플레이어 참여와 악기 연주자의 부재로, 어느새 연주자보다 스태프가 더 많은 밴드가 되었다.
          결성 3개월이 지난 지금도 제대로 된 EP는 없고, 스태프는 여전히 연주자보다 많다.
          굿즈는 꾸준히 제작하지만 구매자는 없으며, 판매자 역시 판매할 생각이 없다.
        </p>
        <p style={{ color: `${PRIMARY}60` }}>
          그럼에도 활동은 멈추지 않는다. 5th Ave Bipolar Kids는 밴드라는 정체성을 출발점으로 삼아
          음악과 시각예술, 디자인, 출판, 퍼포먼스를 아우르는 종합예술 커뮤니티로 스스로의 영역을 확장해 나가고 있다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 font-['Share_Tech_Mono']">
        {[
          { label: "LOCATION", value: "Seoul / Daegu / New York" },
          { label: "FOUNDED", value: "2026" },
          { label: "STATUS", value: "ACTIVE" },
          { label: "MEMBERS", value: "15" },
        ].map((item) => (
          <div key={item.label} className="p-3 border" style={{ borderColor: `${PRIMARY}20`, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
            <div className="text-xs mb-1" style={{ color: `${PRIMARY}40` }}>{item.label}</div>
            <div className="text-base" style={{ color: PRIMARY, textShadow: `0 0 8px ${PRIMARY}60` }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="border p-5 font-['Share_Tech_Mono']" style={{ borderColor: `${PRIMARY}30`, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="text-xs mb-4" style={{ color: `${PRIMARY}60` }}>■ CONTACT // SECURE CHANNEL</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs mb-1" style={{ color: `${PRIMARY}50` }}>EMAIL</div>
            <a
              href="mailto:ddoazoo@gmail.com"
              className="text-lg transition-all duration-200"
              style={{ color: PRIMARY, textShadow: `0 0 10px ${PRIMARY}80`, textDecoration: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textShadow = `0 0 20px ${PRIMARY}`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textShadow = `0 0 10px ${PRIMARY}80`; }}
            >
              ddoazoo@gmail.com
            </a>
          </div>
          <div className="text-xs" style={{ color: `${PRIMARY}30` }}>
            <div>RESPONSE TIME</div>
            <div style={{ color: `${PRIMARY}60` }}>UNKNOWN</div>
          </div>
        </div>
        <div className="mt-4 text-xs" style={{ color: `${PRIMARY}30`, borderTop: `1px solid ${PRIMARY}15`, paddingTop: "0.75rem" }}>
          // 비즈니스 문의, 콜라보레이션, 그 외 모든 것
        </div>
      </div>
    </div>
  );
}

function CalendarTab({ events, calEvents, setCalEvents }: { events: EventData[]; calEvents: CalEvent[]; setCalEvents: React.Dispatch<React.SetStateAction<CalEvent[]>> }) {
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calModal, setCalModal] = useState<{ date: string; event?: CalEvent } | null>(null);
  const [calDraft, setCalDraft] = useState({ title: "", desc: "", color: PRIMARY });

  const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  const openAddCal = (date: string) => { setCalDraft({ title: "", desc: "", color: PRIMARY }); setCalModal({ date }); };
  const openEditCal = (ev: CalEvent) => { setCalDraft({ title: ev.title, desc: ev.desc, color: ev.color }); setCalModal({ date: ev.date, event: ev }); };
  const saveCal = () => {
    if (!calModal || !calDraft.title.trim()) return;
    if (calModal.event) {
      setCalEvents(es => es.map(e => e.id === calModal.event!.id ? { ...e, ...calDraft } : e));
    } else {
      setCalEvents(es => [...es, { id: Date.now().toString(), date: calModal.date, ...calDraft }]);
    }
    setCalModal(null);
  };
  const deleteCal = (id: string) => setCalEvents(es => es.filter(e => e.id !== id));

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({length: daysInMonth}, (_,i) => i+1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const dateStr = (d: number) => `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const parseEventDate = (s: string): string | null => {
    const m = s.match(/(\d{4})\.(\d{2})\.(\d{2})/);
    return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
  };
  const eventsFor = (d: number) => {
    const ds = dateStr(d);
    const cal = calEvents.filter(e => e.date === ds).map(e => ({ id: e.id, title: e.title, color: e.color, isScheduled: false, ev: null as EventData | null }));
    const sched = events.filter(e => parseEventDate(e.date) === ds).map(e => ({ id: e.code, title: e.title, color: e.color, isScheduled: true, ev: e }));
    return [...sched, ...cal];
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); }}
          className="px-4 py-2 font-['VT323'] text-2xl transition-all hover:opacity-100 opacity-70"
          style={{ border:`1px solid ${PRIMARY}50`, color: PRIMARY, background:`rgba(0,255,65,0.06)` }}>◄</button>
        <div className="font-['VT323'] text-3xl tracking-widest" style={{ color: PRIMARY, textShadow:`0 0 20px ${PRIMARY}90` }}>
          {MONTHS[calMonth]} {calYear}
        </div>
        <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); }}
          className="px-4 py-2 font-['VT323'] text-2xl transition-all hover:opacity-100 opacity-70"
          style={{ border:`1px solid ${PRIMARY}50`, color: PRIMARY, background:`rgba(0,255,65,0.06)` }}>►</button>
      </div>

      <div className="grid grid-cols-7 mb-1" style={{ borderBottom:`1px solid ${PRIMARY}30` }}>
        {DAYS.map(d => (
          <div key={d} className="text-center py-2 font-['Share_Tech_Mono'] text-xs tracking-widest" style={{ color:`${PRIMARY}80` }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7" style={{ border:`1px solid ${PRIMARY}25`, borderTop:"none" }}>
        {cells.map((day, i) => {
          const ds = day ? dateStr(day) : "";
          const evs = day ? eventsFor(day) : [];
          const isToday = ds === todayStr;
          const col = i % 7;
          const row = Math.floor(i / 7);
          const totalRows = cells.length / 7;
          return (
            <div key={i}
              className="min-h-[88px] p-2 flex flex-col transition-colors duration-150"
              style={{
                background: isToday ? "rgba(0,255,65,0.10)" : day ? "rgba(0,255,65,0.02)" : "transparent",
                borderRight: col < 6 ? `1px solid ${PRIMARY}20` : "none",
                borderBottom: row < totalRows - 1 ? `1px solid ${PRIMARY}20` : "none",
                cursor: day ? "pointer" : "default",
              }}
              onClick={() => day && openAddCal(ds)}
              onMouseEnter={e => { if (day) (e.currentTarget as HTMLDivElement).style.background = isToday ? "rgba(0,255,65,0.15)" : "rgba(0,255,65,0.05)"; }}
              onMouseLeave={e => { if (day) (e.currentTarget as HTMLDivElement).style.background = isToday ? "rgba(0,255,65,0.10)" : "rgba(0,255,65,0.02)"; }}
            >
              {day && (
                <>
                  <div className="font-['VT323'] text-lg leading-none mb-1.5" style={{
                    color: isToday ? PRIMARY : `${PRIMARY}aa`,
                    textShadow: isToday ? `0 0 12px ${PRIMARY}` : "none",
                  }}>
                    {isToday ? <span style={{ background: PRIMARY, color:"#000", padding:"0 4px", fontSize:"14px" }}>{day}</span> : day}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    {evs.map(ev => (
                      <div key={ev.id}
                        className="px-1.5 py-0.5 truncate leading-tight cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ background: ev.color+"28", color: ev.color, borderLeft:`2px solid ${ev.color}`, fontFamily:"'Share Tech Mono',monospace", fontSize:"11px" }}
                        onClick={e => { e.stopPropagation(); if (!ev.isScheduled) { const c = calEvents.find(ce => ce.id === ev.id); if (c) openEditCal(c); } }}
                        title={ev.isScheduled ? "Events 탭에서 확인" : "클릭하여 수정"}
                      >
                        {ev.isScheduled && <span style={{ opacity:0.6, marginRight:3 }}>◆</span>}{ev.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-xs" style={{ color:`${PRIMARY}40`, fontFamily:"'Share Tech Mono',monospace" }}>// 날짜 클릭하여 일정 추가 · 일정 클릭하여 수정/삭제</div>

      {calModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.85)" }} onClick={() => setCalModal(null)}>
          <div className="w-full max-w-sm border p-5 flex flex-col gap-4" style={{ borderColor:`${PRIMARY}40`, background:"rgba(2,8,2,0.97)", boxShadow:`0 0 40px ${PRIMARY}20` }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="font-['VT323'] text-xl tracking-widest" style={{ color: PRIMARY }}>
                {calModal.event ? "[ EDIT EVENT ]" : "[ ADD EVENT ]"}
              </div>
              <div className="text-xs font-['Share_Tech_Mono']" style={{ color:`${PRIMARY}60` }}>{calModal.date}</div>
            </div>

            <div>
              <div className="text-xs tracking-widest mb-1 font-['Share_Tech_Mono']" style={{ color:`${PRIMARY}55` }}>TITLE</div>
              <input
                autoFocus
                value={calDraft.title}
                onChange={e => setCalDraft(d => ({ ...d, title: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && saveCal()}
                className="w-full bg-transparent outline-none py-1.5 font-['VT323'] text-xl tracking-wider"
                style={{ borderBottom:`1px solid ${PRIMARY}35`, color: PRIMARY, caretColor: PRIMARY }}
                placeholder="일정 제목"
              />
            </div>

            <div>
              <div className="text-xs tracking-widest mb-1 font-['Share_Tech_Mono']" style={{ color:`${PRIMARY}55` }}>NOTE</div>
              <textarea
                value={calDraft.desc}
                onChange={e => setCalDraft(d => ({ ...d, desc: e.target.value }))}
                rows={2}
                className="w-full bg-transparent outline-none py-1.5 font-['Share_Tech_Mono'] text-sm resize-none"
                style={{ borderBottom:`1px solid ${PRIMARY}20`, color:`${PRIMARY}90`, caretColor: PRIMARY }}
                placeholder="메모 (선택)"
              />
            </div>

            <div>
              <div className="text-xs tracking-widest mb-2 font-['Share_Tech_Mono']" style={{ color:`${PRIMARY}55` }}>COLOR</div>
              <div className="flex gap-2 flex-wrap">
                {[...COLOR_PALETTE].map(c => (
                  <button key={c} onClick={() => setCalDraft(d => ({ ...d, color: c }))}
                    className="w-6 h-6 rounded-sm transition-transform hover:scale-125"
                    style={{ background:c, border: calDraft.color===c ? "2px solid #fff" : "1px solid transparent", boxShadow: calDraft.color===c ? `0 0 8px ${c}` : "none" }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={saveCal} className="flex-1 py-2 font-['VT323'] text-lg tracking-widest transition-all"
                style={{ border:`1px solid ${calDraft.color}60`, color:calDraft.color, background:calDraft.color+"15" }}>SAVE</button>
              {calModal.event && (
                <button onClick={() => { deleteCal(calModal.event!.id); setCalModal(null); }}
                  className="px-4 py-2 font-['VT323'] text-lg tracking-widest transition-all"
                  style={{ border:`1px solid ${DANGER}50`, color: DANGER, background:`${DANGER}10` }}>DEL</button>
              )}
              <button onClick={() => setCalModal(null)} className="px-4 py-2 font-['VT323'] text-lg tracking-widest opacity-50 hover:opacity-80 transition-all"
                style={{ border:`1px solid ${PRIMARY}30`, color: PRIMARY }}>✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExploreLogoLink({ href, children, aspectRatio }: { href: string; children: React.ReactNode; aspectRatio: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block", width: "min(420px, 75vw)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative transition-all duration-300"
        style={{
          width: "100%",
          height: `calc(min(420px, 75vw) / ${aspectRatio})`,
          filter: hovered
            ? "brightness(0) invert(1) sepia(1) saturate(8) hue-rotate(90deg) drop-shadow(0 0 18px #00ff41)"
            : "brightness(0) invert(1)",
        }}
      >
        {children}
      </div>
    </a>
  );
}

function VelfontIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1514.28 938.71" style={{ width: "100%", height: "100%" }}>
      <path d="M892.69,383.74c-6.33,8.95-20.51,8.86-27.31,2.52-9.32-8.69-9.39-24.21-.31-33.04,6.68-6.5,20.72-6.13,27.35,2.23,2.73-5.87.63-13.72-5.68-16.41-4.95-2.12-12.44-2.05-17.11.43-1.85.98-3.62,2.31-4.89,2.4-1.46.11-4.52-3.37-3.46-4.42,7.38-6.59,17.93-6.42,27.19-4.26,8.33,1.95,13.15,9.38,13.19,18.15l.14,28.53.84,10.39-9.03-.15-.9-6.39ZM888.41,382.6c7.17-6.64,6.82-18.58.26-25.45-1.2-1.26-4.97-3.18-6.98-3.41-8.75-.98-16.11,6.98-15.42,16.09.45,5.91,1.83,10.78,6.85,13.56,4.56,2.53,10.44,3.7,15.29-.8Z" fill="currentColor"/>
      <path d="M1192.06,250.65v-48.83c.01-1.68-3.24-4.09-4.77-4-1.95.12-3.77,1.08-6.22,2.6-1.86,1.15-5.85-1.18-7.54-3.56,5.79-5.39,12.91-5.75,19.72-3.33,5,1.77,6.91,5.01,6.91,10.37l.06,46.52-8.17.23Z" fill="currentColor"/>
      <path d="M1514.23,0l.05,938.63L.05,938.71,0,.08l1514.23-.08ZM1484.65,227.91l23.29-.07-.03-222-277.53.1-3.17.69c-.65.14-.45,2.94.2,3.06l11.65,2.08c18.26,5.21,35.57,10.64,52.84,18.27,27.34,12.07,52.62,26.38,76.17,44.71,53.76,41.82,90.93,90.44,116.58,153.18ZM263.1,7.85l-151.93.04,76.49,158.72L263.1,7.85ZM924.66,7.51h-161.57s0,166.6,0,166.6h161.57s0-166.6,0-166.6ZM938.01,152.27c19.04-55.24,58.46-100.77,110.18-127.07,9.76-4.96,19.03-9.42,29.36-12.75,3.22-1.04,7.59-.94,8.86-4.61l-156.6-.02.07,77.09-.4,93.3c.19.55,1.54,2.49,1.92,2.01s1.36-2,1.47-2.78l1.72-12.58c.61-4.5,1.77-7.81,3.42-12.58ZM950.87,140.75c-6.73,16.13-12.06,32.44-14.27,49.66l-1.86,14.46-.38,22.49,219.18-.1.02-213.16-.3-6.4-12.54,1.41-23.75,1.91-8.27,1.56c-11.31,2.13-22.5,4.43-33.06,8.97l-18.39,7.91c-20.11,8.64-38.04,21.54-54.04,36.66-22.57,21.33-40.39,46.01-52.35,74.66ZM1319.89,361.13v-133.2s156.02-.1,156.02-.1c-38.51-93.85-113.35-164.32-207.22-198.61-22.94-8.05-45.18-14.01-69.09-16.99l-15.18-1.89-20.41-1.33c-.92-.06-3.52-1.23-3.8-.42s-.46,2.35-.46,3.84l.07,228.97c16.4,18.47,28.37,53.78,33.08,77.52l8.4,42.31,13.03-.26v-133.07s45.45.04,45.45.04l20.3,133.28,39.81-.08ZM540.18,849.44l28.57,12.78c43.03,17.87,86.47,32.75,131.72,44.22l81.21,16.76,41.3,5.79,38.89,3.53,57.11.13c2.32,0,3.66.01,5.65-1.62l-.1-582.63.04-120.14H370.38s-.35-220.6-.35-220.6l-126.36,220.61-114.02.05L7.05,18.13l.13,96.65,2.03,12.77,1.56,11.47c6.54,48.16,17.75,94.65,31.76,141.18,22.47,74.65,62.05,160.52,104.43,225.49l10.44,16c39.24,58.3,83.71,112.54,135.44,160.08l16.39,15.06c63.84,58.66,152,117.27,230.96,152.61ZM475.67,134.26l.06,44.1h182.16s0-124.34,0-124.34h-182.16s0,35.41,0,35.41h164.23s0,44.81,0,44.81l-164.29.03ZM504.42,840.79c-36.8-18.01-70.85-39.09-104.22-62.16-47.05-32.54-90.51-68.6-131.07-108.79l-35.58-37.44-13.1-15.22c-48-55.77-89.14-116.21-122.94-181.62l-16.89-34.38c-15.85-32.27-28.81-64.99-39.51-99.27l-11.46-36.72c-5.94-19.04-10.66-37.88-14.57-57.49l-6.13-30.78-.4-2.1c-.08-.43-1.38.45-2.01.9-1.28,3.54.13,6.74.13,10.83l.13,745.98,728.9.04,36.89.14,2.57-1.32c.34-.17-.36-1.43-.72-1.54l-1.99-.6-22.02-3.51-29.36-6.12-51.46-13.45c-38.85-11.23-76.21-24.34-113.09-40.71l-17.43-7.74-34.64-16.96ZM1092.34,248.05l.59-16.38-10.86-.06c-5.77,4.59-10.25,10.35-9.66,18l16.37.26c.51,0,2.31.59,2.8.74s.74-1.97.76-2.57ZM1097.16,252.92c6.7-9.11,11.73-14.25,19.74-21.06l-20.28-.44.54,21.5ZM1085.83,277.1l4.75-10.73c1.64-3.7,2.41-8.64,1.78-12.34l-22.87-.12-.66,14.01c-.15,3.14-1.6,6.68.88,9.53l16.12-.35ZM1068.42,338.9l15.95-58.14-15.19-.42-1,13.48.24,45.09ZM1213,514.43l.89.03.28-47.66.18-102.14-12.51-.35c5,36.62,8.14,73.17,10.19,110.45l.62,11.22.36,28.45ZM1492.58,468.37c4.94-26.07,7.99-51.34,9.16-77.64l.9-20.16c.06-1.32.21-4.18-.46-5.1s-2.78-.9-4.41-.89l-33.87.21.23,202.87c13.58-33.09,21.97-65.6,28.47-99.3ZM1033.43,925.76l45.37-10.02,16.51-5c-17.3-32.97-24.94-71.91-30.68-108.64-5.98-38.34-9.32-76.15-11.11-115.04-3.73-78.3-3.02-155.74,1.41-234.1l9.13-87.57-86.36.1v126.51s55.85.07,55.85.07v147.09s-55.85,0-55.85,0v293.36c8.84.32,16.67-.71,24.86-1.98l30.86-4.78ZM1165.51,431.59c-3.74,5.06-11.21,2.25-14.31-.85-2.02-2.02-4.19-4-6.9-2.42l.32,21.71c-2.38.15-5.63,0-8.39-.58v-58.13s8.69.05,8.69.05l-.57,21.22c-.14,5.13,2.88,9.78,6.51,12.93s8.16,3.18,14.06,2.86c-3.14-17.59-16.31-64.98-33.24-63.3-9.63.96-17.2,17.15-21.37,28.23-6.16,16.37-9.59,32.79-12.71,50.25-9.5,53.17-11.36,106.22-10.03,160.28.99,40.13,2.72,78.95,10.12,118.26,3.61,19.19,7.1,37.52,14.64,55.39,4.19,9.94,11.33,22.75,20.15,22.78,16.46.05,27.44-40.03,31.46-58.47,7.65-35.09,11.27-69.85,13.42-105.82,4.1-68.38.51-142.84-11.85-204.39ZM1319.91,364.5h-39.37s39.05,254.66,39.05,254.66l.32-254.66ZM1415.17,666.69l-.02-301.99-49.1.03.07,368.35c18.94-21.77,34.37-43.52,49.06-66.39ZM1463.92,592.57l-.02,340.02,44.03-.08v-455.33c.26-5.77.05-10.74-1.98-15.4l-2.66-6.12-3.89,19.63-4.68,21.21-5.69,22.35-17.5,52.59-7.6,21.13ZM1270.68,823.02l28.34-22.87-38.64-250.62-.35,280.51,10.65-7.02ZM1214.96,566.88h-1v33.5h1v-33.5ZM1185.74,874.99l28.58-15.23-.17-166.73-.3-53.24-.81.59-.53,32.25c-1.02,62.57-9.4,141.52-26.78,202.36ZM1366.06,932.59l49.11-.08-.05-250.7-22.32,30.92-26.72,32.68-.02,187.18ZM1260.03,932.55l59.13-.03-18.81-122.99-16.08,12.77-24.21,17.8-.03,92.45ZM1152.88,932.56l61.47-.02-.05-63.67-32.53,16.91c-4.59,12.24-9.76,23.83-17.46,34.56l-11.43,12.22ZM1061.53,932.72l52.9-.23-14.74-14.77-41.23,10.84c-3.05.8-5.67-.42-7.09,3.44l10.16.72Z" fill="currentColor"/>
      <polygon points="1200.59 266.77 1191.44 266.68 1191.52 258.99 1200.43 258.83 1200.59 266.77" fill="currentColor"/>
    </svg>
  );
}

function ExploreTab() {
  return (
    <div className="flex flex-col items-center gap-12 w-full">
      <ExploreLogoLink href="https://jangj864.github.io/ddoazoo/index.html" aspectRatio={5.21}>
        <DdoazooLogo />
      </ExploreLogoLink>
      <ExploreLogoLink href="https://velfontoffice.com/" aspectRatio={1514.28 / 938.71}>
        <VelfontIcon />
      </ExploreLogoLink>
      <ExploreLogoLink href="https://e-no.art/" aspectRatio={1522 / 522}>
        <img src={enoLogo} alt="eno" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </ExploreLogoLink>
    </div>
  );
}

// ── Page types ────────────────────────────────────────────────────────────────
type Page = "boot" | "auth" | "denied" | "dashboard" | "crew";

export default function App() {
  const [page, setPage] = useState<Page>("boot");
  const [activeTab, setActiveTab] = useState("projects");
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [editingMemberIdx, setEditingMemberIdx] = useState<number | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [events, setEvents] = useState<EventData[]>(INITIAL_EVENTS);
  const [calEvents, setCalEvents] = useState<CalEvent[]>([]);

  const bootLines = [
    "BIOS v2.6.31-darknet :: POST CHECK...",
    "RAM: 32768MB [OK]",
    "Loading encrypted partition... [OK]",
    "Initializing TOR relay [7 hops] ... [OK]",
    "Spoofing MAC address: DE:AD:BE:EF:00:13",
    ">> WARNING: Unauthorized access is monitored.",
    ">> THIS SYSTEM IS NOT WHAT IT SEEMS.",
    "Authentication module loaded.",
    "",
    "READY. AWAITING USER.",
  ];

  const { done: bootDone } = useTypewriter(bootLines, 28);

  useEffect(() => {
    if (bootDone) {
      const t = setTimeout(() => setPage("auth"), 800);
      return () => clearTimeout(t);
    }
  }, [bootDone]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-['Share_Tech_Mono'] relative">
      <MatrixRain />
      <ScanlineOverlay />

      <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.03]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "150px",
      }} />

      <div className="relative z-20 max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8 flex items-start justify-between">
          <div onClick={() => page !== "boot" && setPage("auth")} className={page !== "boot" ? "cursor-pointer" : ""}>
            <GlitchTitle />
            <div className="text-xs mt-2" style={{ color: `${PRIMARY}50` }}>
              {page === "crew" ? "CREW // CLASSIFIED MANIFEST" : "ANONYMOUS NETWORK ACCESS POINT v0.0.1-SHADOW"}
            </div>
          </div>
          <div className="text-right text-xs space-y-1" style={{ color: `${PRIMARY}40` }}>
            <div>[ENCRYPTED]</div>
            <div>TOR: ACTIVE</div>
            <div className="animate-pulse" style={{ color: DANGER }}>● LIVE</div>
          </div>
        </header>

        {page === "boot" && <Terminal lines={bootLines} prompt="root@void:~$" />}

        {page === "auth" && (
          <div className="max-w-md mx-auto space-y-4">
            <Terminal lines={[
              "root@void:~$ ./authenticate --mode=shadow",
              "[SYS] Auth module initialized",
              "[SYS] Checking identity vectors...",
              "[SYS] Enter access code to proceed.",
            ]} prompt="root@void:~$" />
            <AccessPanel
              onAccess={(isSecret) => setPage(isSecret ? "crew" : "dashboard")}
              onDeny={() => setPage("denied")}
            />
          </div>
        )}

        {page === "denied" && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="font-['VT323'] text-7xl animate-pulse" style={{ color: DANGER, textShadow: `0 0 30px ${DANGER}` }}>ACCESS DENIED</div>
            <Terminal lines={[
              ">> SECURITY VIOLATION DETECTED",
              ">> IP LOGGED: 192.168.███.███",
              ">> REPORTING TO AUTHORITIES...",
              ">> SYSTEM LOCKDOWN INITIATED",
              ">> THIS INCIDENT HAS BEEN RECORDED",
            ]} />
            <button onClick={() => setPage("boot")} className="text-xs px-6 py-2"
              style={{ border: `1px solid ${DANGER}50`, color: `${DANGER}80`, background: "transparent" }}>
              [ RETRY — YOU HAVE BEEN WARNED ]
            </button>
          </div>
        )}

        {page === "dashboard" && (
          <div className="space-y-6">
            <div className="p-3 text-center font-['VT323'] text-2xl tracking-widest" style={{
              background: `rgba(0,255,65,0.05)`, border: `1px solid ${PRIMARY}30`,
              color: PRIMARY, textShadow: `0 0 15px ${PRIMARY}`,
            }}>
              ■■■ ACCESS GRANTED — WELCOME BACK, GHOST ■■■
            </div>
            <Terminal lines={[
              "[INIT] Shadow protocol engaged",
              "[NET] Routing through 7 anonymous relays",
              "[SYS] No logs retained beyond 60s",
              "[OK] Identity: VOID",
              "[HINT] You are close. Try a different key.",
            ]} />
            <div className="pt-4 text-xs flex justify-between" style={{ borderTop: `1px solid ${PRIMARY}15`, color: `${PRIMARY}30` }}>
              <span>VOID//NET — NO LOGS. NO TRACE. NO MERCY.</span>
              <span className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setPage("boot")}>[ PURGE SESSION ]</span>
            </div>
          </div>
        )}

        {page === "crew" && (
          <div className="space-y-8">
            <div className="p-4 text-center" style={{
              background: "rgba(0,0,0,0.6)",
              border: `1px solid ${PRIMARY}25`,
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            }}>
              <div className="font-['VT323'] text-4xl mb-1" style={{ color: PRIMARY, textShadow: `0 0 20px ${PRIMARY}` }}>
                [ CLASSIFIED ACCESS GRANTED ]
              </div>
              <div className="text-xs" style={{ color: `${PRIMARY}50` }}>
                IDENTITY CONFIRMED: BIPOLAR KIDS // CLEARANCE LEVEL: FULL
              </div>
            </div>

            <div className="flex border-b" style={{
              borderColor: `${PRIMARY}30`,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 4px 30px rgba(0,0,0,0.6)",
            }}>
              {[
                { id: "projects", label: "PROJECTS" },
                { id: "members", label: "MEMBERS" },
                { id: "events", label: "EVENTS" },
                { id: "calendar", label: "CALENDAR" },
                { id: "about", label: "ABOUT" },
                { id: "explore", label: "EXPLORE" },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="px-6 py-2 text-xs tracking-widest transition-all duration-200"
                  style={{
                    color: activeTab === tab.id ? PRIMARY : `${PRIMARY}55`,
                    borderBottom: activeTab === tab.id ? `2px solid ${PRIMARY}` : "2px solid transparent",
                    background: activeTab === tab.id ? `rgba(0,255,65,0.12)` : "transparent",
                    textShadow: activeTab === tab.id ? `0 0 10px ${PRIMARY}` : "none",
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "projects" && <ProjectsTab projects={projects} setProjects={setProjects} />}
            {activeTab === "members" && (
              <MembersTab
                members={members}
                setMembers={setMembers}
                editingMemberIdx={editingMemberIdx}
                setEditingMemberIdx={setEditingMemberIdx}
                isAddingMember={isAddingMember}
                setIsAddingMember={setIsAddingMember}
              />
            )}
            {activeTab === "events" && <EventsTab events={events} setEvents={setEvents} />}
            {activeTab === "calendar" && <CalendarTab events={events} calEvents={calEvents} setCalEvents={setCalEvents} />}
            {activeTab === "about" && <AboutTab />}
            {activeTab === "explore" && <ExploreTab />}

            <div className="pt-4 text-xs flex justify-between" style={{ borderTop: `1px solid ${PRIMARY}15`, color: `${PRIMARY}30` }}>
              <span>5TH AVE BIPOLAR KIDS // ALL RIGHTS RESERVED. ALL WRONGS TOO.</span>
              <span className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setPage("boot")}>[ EXIT ]</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
