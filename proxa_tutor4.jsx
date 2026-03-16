import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════════════════════
   PROXA TUTOR — Demo-Ready End-User Interface
   AI-Powered Intelligent Tutoring for Biopharma Sales

   Views: Home, My Pathway, AI Tutor, Certifications,
          Competencies, Content Library
   ════════════════════════════════════════════════════════════════ */

// ── Design Tokens ──
const T = {
  bg: "#F5F2EE",
  panel: "#FAF9F6",
  card: "#EFEDE9",
  cardRaised: "#E8E4DF",
  cardHover: "#E1DCD5",
  surface: "#D8D2C9",
  border: "#E5E1D9",
  borderLight: "#DCD8D0",
  borderFocus: "#427BBF",
  blue: "#427BBF",
  blueDim: "#3569A7",
  blueGlow: "rgba(66,123,191,0.05)",
  blueGlow2: "rgba(66,123,191,0.1)",
  emerald: "#0E9F6E",
  emeraldDim: "rgba(14,159,110,0.08)",
  amber: "#B45309",
  amberDim: "rgba(180,83,9,0.08)",
  rose: "#C81E1E",
  roseDim: "rgba(200,30,30,0.08)",
  violet: "#7E3AF2",
  violetDim: "rgba(126,58,242,0.08)",
  teal: "#0694A2",
  tealDim: "rgba(6,148,162,0.08)",
  orange: "#F58020",
  orangeDim: "rgba(245,128,32,0.08)",
  text: "#231F20",
  textSoft: "#353535",
  textMuted: "#4A4A4A",
  textFaint: "#808080",
  white: "#FFFFFF",
  glass: "rgba(0,0,0,0.02)",
};

// ── Global Styles ──
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{overflow:hidden}

    /* Global thin scrollbars */
    * {
      scrollbar-width: thin;
      scrollbar-color: ${T.borderLight} transparent;
    }

    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${T.borderLight};border-radius:10px}
    ::-webkit-scrollbar-thumb:hover{background:${T.textMuted}}

    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideR{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideL{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(74,124,255,0.3)}50%{box-shadow:0 0 16px 4px rgba(74,124,255,0.12)}}
    @keyframes breathe{0%,100%{opacity:.45}50%{opacity:1}}
    @keyframes progressFill{from{width:0%}}
    @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes typing{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
    .hlift{transition:transform .2s,box-shadow .2s,border-color .2s}
    .hlift:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.08);border-color:${T.borderLight}!important}
    .hbright{transition:background .12s}.hbright:hover{background:${T.cardHover}!important}
  `}</style>
);

// ── Shared Components ──
const Badge = ({ children, color = T.blue, bg, size = "sm", dot }) => {
  const s = { xs: [6, 2, 9.5], sm: [10, 3, 10.5], md: [12, 5, 12] }[size];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: `${s[1]}px ${s[0]}px`,
        borderRadius: 6,
        fontSize: s[2],
        fontWeight: 600,
        letterSpacing: 0.4,
        color,
        background: bg || `${color}14`,
        whiteSpace: "nowrap",
        fontFamily: "'Outfit',sans-serif",
      }}
    >
      {dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: color,
          }}
        />
      )}
      {children}
    </span>
  );
};

const Ring = ({ value, size = 44, stroke = 4, color = T.blue, children }) => {
  const r = (size - stroke) / 2,
    c = 2 * Math.PI * r,
    o = c - (value / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`${color}15`}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={o}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      {children && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const Bar = ({ value, color = T.blue, h = 5 }) => (
  <div
    style={{
      width: "100%",
      height: h,
      borderRadius: h,
      background: `${color}12`,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        borderRadius: h,
        background: `linear-gradient(90deg,${color}CC,${color})`,
        width: `${value}%`,
        animation: "progressFill 1s cubic-bezier(.4,0,.2,1)",
        transition: "width .6s ease",
      }}
    />
  </div>
);

const Ico = ({ d, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

// ── Icon paths ──
const icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  pathway: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 6v6l4 2",
  tutor: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  cert: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  comp: "M12 20V10 M6 20V4 M18 20v-6",
  lib: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  chev: "M6 9l6 6 6-6",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  target:
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  refresh:
    "M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 0 0 5.64 5.64L1 10 M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  trophy:
    "M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z",
  coaching:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 1-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  insights: "M18 20V10 M12 20V4 M6 20v-6",
  precall:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  achieve:
    "M12 15l-2 5L12 19l2 1-2-5z M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M18 2H6v7a6 6 0 0 0 12 0V2z",
  profile:
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  peer: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 1-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  search:
    "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5",
};

const navItems = [
  { id: "home", label: "Home", icon: icons.home },
  { id: "pathway", label: "My Pathway", icon: icons.pathway, alert: true },
  { id: "tutor", label: "AI Tutor", icon: icons.tutor },
  { id: "certs", label: "Certifications", icon: icons.cert },
  { id: "competencies", label: "Competencies", icon: icons.comp },
  { id: "library", label: "Content Library", icon: icons.lib },
  { id: "sep1", label: "sep", sep: true },
  { id: "coaching", label: "Coaching Hub", icon: icons.coaching },
  { id: "insights", label: "Performance", icon: icons.insights },
  { id: "precall", label: "Pre-Call Prep", icon: icons.precall },
  { id: "achievements", label: "Achievements", icon: icons.achieve },
  { id: "peer", label: "Peer Learning", icon: icons.peer },
  { id: "sep2", label: "sep", sep: true },
  { id: "profile", label: "My Profile", icon: icons.profile },
];

// ═══════════════════════════════════════════════
// HOME — Enhanced Dashboard
// ═══════════════════════════════════════════════
const HomeView = ({ go }) => {
  const [tipIdx, setTipIdx] = useState(0);
  const tips = [
    "Your MOA Differentiation gap score improved from 38 → 52 after completing 2 modules. Keep going!",
    "Reps who complete AI Tutor sessions before re-attempting Echo pass 35% more often.",
    "You're in the top 30% of your region for time-to-certify. Nice work.",
  ];
  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % tips.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 26,
        animation: "fadeUp .4s ease",
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${T.panel} 0%, ${T.card} 100%)`,
          borderRadius: 20,
          padding: "28px 30px",
          border: `1px solid ${T.border}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -30,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: `${T.blue}05`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: 100,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: `${T.violet}04`,
          }}
        />
        <div
          style={{
            fontSize: 13,
            color: T.textMuted,
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: T.text,
            margin: "0 0 6px",
            fontFamily: "'Outfit',sans-serif",
            letterSpacing: -0.5,
          }}
        >
          Good morning, Sarah
        </h1>
        <p
          style={{
            fontSize: 14,
            color: T.textSoft,
            margin: 0,
            lineHeight: 1.5,
            maxWidth: 500,
          }}
        >
          You have{" "}
          <span style={{ color: T.rose, fontWeight: 600 }}>
            1 active remediation
          </span>{" "}
          and{" "}
          <span style={{ color: T.amber, fontWeight: 600 }}>
            1 new assignment
          </span>{" "}
          requiring attention.
        </p>
      </div>

      {/* Action Alerts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          {
            color: T.rose,
            icon: "",
            title: "Remediation In Progress",
            sub: "Ozempic® Competitive Intelligence — 3/8 steps done",
            action: "Continue Pathway",
            nav: "pathway",
          },
          {
            color: T.amber,
            icon: "",
            title: "New Certification Assigned",
            sub: "Reyvow® Product Launch — due Mar 15. Prep modules available.",
            action: "View Details",
            nav: "certs",
          },
          {
            color: T.blue,
            icon: "",
            title: "AI Tutor Recommendation",
            sub: "Practice MOA differentiation before your next quiz — predicted to boost score by 12pts",
            action: "Start Session",
            nav: "tutor",
          },
        ].map((a, i) => (
          <div
            key={i}
            className="hlift"
            onClick={() => go(a.nav)}
            style={{
              background: T.card,
              borderRadius: 13,
              padding: "16px 20px",
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${a.color}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
              animation: `slideR .35s ease ${i * 0.06}s both`,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: `${a.color}10`,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: a.color,
                fontWeight: 700,
              }}
            >
              {a.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 2,
                }}
              >
                {a.title}
              </div>
              <div style={{ fontSize: 12.5, color: T.textSoft }}>{a.sub}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                go(a.nav);
              }}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: `1px solid ${a.color}25`,
                background: `${a.color}10`,
                color: a.color,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Outfit',sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {a.action}
            </button>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "Active Certifications",
            val: "4",
            sub: "2 due this month",
            color: T.blue,
            ring: null,
          },
          {
            label: "Echo Score (Avg)",
            val: "71%",
            sub: "+8pts vs. last quarter",
            color: T.emerald,
            ring: 71,
          },
          {
            label: "Time to Certify",
            val: "6.2d",
            sub: "Team avg: 9.1d",
            color: T.violet,
            ring: null,
          },
          {
            label: "AI Readiness Score",
            val: "82",
            sub: "Predicted pass likelihood",
            color: T.teal,
            ring: 82,
          },
        ].map((m, i) => (
          <div
            key={i}
            className="hlift"
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "18px 18px 16px",
              border: `1px solid ${T.border}`,
              position: "relative",
              overflow: "hidden",
              animation: `fadeUp .4s ease ${0.08 + i * 0.05}s both`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -25,
                right: -25,
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: `${m.color}05`,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: T.textMuted,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: T.text,
                    fontFamily: "'Outfit',sans-serif",
                    letterSpacing: -1,
                    lineHeight: 1,
                    animation: "countUp .5s ease",
                  }}
                >
                  {m.val}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: m.color,
                    fontWeight: 500,
                    marginTop: 5,
                  }}
                >
                  {m.sub}
                </div>
              </div>
              {m.ring && (
                <Ring value={m.ring} size={44} stroke={3.5} color={m.color}>
                  <span
                    style={{ fontSize: 10, fontWeight: 700, color: m.color }}
                  >
                    {m.ring}
                  </span>
                </Ring>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Two-Column: Cert Queue + Activity */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}
      >
        {/* Cert Queue */}
        <div style={{ animation: "fadeUp .4s ease .2s both" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: T.text,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              Certification Queue
            </h2>
            <button
              onClick={() => go("certs")}
              style={{
                background: "none",
                border: "none",
                color: T.blue,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              View all →
            </button>
          </div>
          {[
            {
              name: "Ozempic® Competitive Intel",
              ta: "Metabolic",
              s: "Remediation",
              sc: T.rose,
              score: 54,
            },
            {
              name: "SKYRIZI® Objection Handling",
              ta: "Immunology",
              s: "In Progress",
              sc: T.blue,
              score: 68,
            },
            {
              name: "Reyvow® Product Launch",
              ta: "Neuroscience",
              s: "Assigned",
              sc: T.amber,
              score: null,
            },
            {
              name: "Dupixent® Clinical Data",
              ta: "Dermatology",
              s: "Certified",
              sc: T.emerald,
              score: 92,
            },
          ].map((c, i) => (
            <div
              key={i}
              className="hbright"
              style={{
                background: T.card,
                borderRadius: 11,
                padding: "12px 16px",
                marginBottom: 6,
                border: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `${c.sc}10`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: c.sc,
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {c.s === "Certified"
                  ? ""
                  : c.s === "Remediation"
                    ? ""
                    : c.s === "Assigned"
                      ? ""
                      : ""}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.text,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.name}
                </div>
                <Badge color={T.violet} size="xs">
                  {c.ta}
                </Badge>
              </div>
              <Badge color={c.sc} size="xs">
                {c.s}
              </Badge>
              {c.score && (
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: c.score >= 70 ? T.emerald : T.rose,
                    fontFamily: "'Outfit',sans-serif",
                    minWidth: 36,
                    textAlign: "right",
                  }}
                >
                  {c.score}%
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Activity & AI Insight */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            animation: "fadeUp .4s ease .25s both",
          }}
        >
          {/* Weekly Activity */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "18px 20px",
              border: `1px solid ${T.border}`,
              flex: 1,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.text,
                marginBottom: 14,
              }}
            >
              This Week's Activity
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { day: "Mon", mins: 45, color: T.blue },
                { day: "Tue", mins: 30, color: T.blue },
                { day: "Wed", mins: 62, color: T.emerald },
                { day: "Thu", mins: 18, color: T.amber },
                { day: "Today", mins: 0, color: T.textFaint },
              ].map((d, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: T.textMuted,
                      width: 36,
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    {d.day}
                  </span>
                  <div style={{ flex: 1 }}>
                    <Bar
                      value={Math.min((d.mins / 60) * 100, 100)}
                      color={d.color}
                      h={6}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: T.textSoft,
                      fontWeight: 500,
                      width: 36,
                      textAlign: "right",
                    }}
                  >
                    {d.mins}m
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: T.textSoft }}>
              Total:{" "}
              <span style={{ color: T.blue, fontWeight: 600 }}>2h 35m</span>{" "}
              this week
            </div>
          </div>

          {/* AI Insight Carousel */}
          <div
            style={{
              background: `linear-gradient(135deg, ${T.cardRaised}, ${T.card})`,
              borderRadius: 14,
              padding: "16px 18px",
              border: `1px solid ${T.borderLight}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13, color: T.blue }}></span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  letterSpacing: 0.3,
                }}
              >
                AI INSIGHT
              </span>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: T.textSoft,
                lineHeight: 1.6,
                margin: 0,
                minHeight: 36,
                animation: "fadeIn .4s ease",
              }}
            >
              {tips[tipIdx]}
            </p>
            <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
              {tips.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === tipIdx ? 16 : 6,
                    height: 4,
                    borderRadius: 3,
                    background: i === tipIdx ? T.blue : T.border,
                    transition: "all .3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Widget */}
      <div style={{ animation: "fadeUp .5s ease .28s both" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: T.text,
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Team Leaderboard
          </h2>
          <div style={{ display: "flex", gap: 4 }}>
            <Badge color={T.orange} size="xs">
              This Week
            </Badge>
          </div>
        </div>
        <div
          style={{
            background: T.card,
            borderRadius: 14,
            overflow: "hidden",
            border: `1px solid ${T.border}`,
          }}
        >
          {[
            {
              rank: 1,
              name: "Lisa T.",
              xp: 2840,
              delta: "+320",
              streak: 7,
              badge: "",
              you: false,
            },
            {
              rank: 2,
              name: "Marcus R.",
              xp: 2510,
              delta: "+280",
              streak: 5,
              badge: "",
              you: false,
            },
            {
              rank: 3,
              name: "David P.",
              xp: 2180,
              delta: "+190",
              streak: 2,
              badge: "",
              you: false,
            },
            {
              rank: 4,
              name: "You (Sarah C.)",
              xp: 1960,
              delta: "+210",
              streak: 3,
              badge: "",
              you: true,
            },
            {
              rank: 5,
              name: "Emily W.",
              xp: 1420,
              delta: "+60",
              streak: 0,
              badge: "",
              you: false,
            },
            {
              rank: 6,
              name: "James M.",
              xp: 890,
              delta: "+30",
              streak: 0,
              badge: "",
              you: false,
            },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 18px",
                borderBottom: i < 5 ? `1px solid ${T.border}` : "none",
                background: r.you ? `${T.blue}06` : "transparent",
              }}
            >
              <span
                style={{
                  fontSize: r.badge ? 16 : 13,
                  width: 24,
                  textAlign: "center",
                  fontWeight: 700,
                  color: r.rank <= 3 ? T.amber : T.textMuted,
                }}
              >
                {r.badge || `#${r.rank}`}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: 12.5,
                  fontWeight: r.you ? 600 : 500,
                  color: r.you ? T.blue : T.text,
                }}
              >
                {r.name}
              </span>
              {r.streak > 0 && (
                <span style={{ fontSize: 10, color: T.orange }}>
                  {r.streak}
                </span>
              )}
              <span
                style={{
                  fontSize: 10.5,
                  color: T.emerald,
                  fontWeight: 600,
                  minWidth: 44,
                }}
              >
                {r.delta}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.orange,
                  fontFamily: "'Outfit',sans-serif",
                  minWidth: 50,
                  textAlign: "right",
                }}
              >
                {r.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Tutor Quick Launch */}
      <div
        className="hlift"
        onClick={() => go("tutor")}
        style={{
          background: `linear-gradient(135deg, #111530 0%, ${T.card} 100%)`,
          borderRadius: 16,
          padding: "22px 26px",
          border: `1px solid ${T.borderLight}`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          cursor: "pointer",
          animation: "fadeUp .5s ease .3s both",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: `linear-gradient(135deg,${T.blue},${T.violet})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
            animation: "pulseGlow 3s ease infinite",
            color: T.white,
          }}
        ></div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: T.text,
              marginBottom: 3,
            }}
          >
            AI Tutor — Ready to Help
          </div>
          <div style={{ fontSize: 12.5, color: T.textSoft }}>
            Deep dive into gap areas, practice HCP conversations, or take
            adaptive quizzes
          </div>
        </div>
        <div
          style={{
            padding: "9px 22px",
            borderRadius: 10,
            background: T.blue,
            color: T.white,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: `0 4px 16px ${T.blue}25`,
          }}
        >
          Open Tutor
        </div>
      </div>

      {/* Competency Snapshot */}
      <div style={{ animation: "fadeUp .5s ease .35s both" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: T.text,
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Competency Snapshot
          </h2>
          <button
            onClick={() => go("competencies")}
            style={{
              background: "none",
              border: "none",
              color: T.blue,
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Full view →
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
          }}
        >
          {[
            { name: "Clinical Knowledge", val: 78, color: T.emerald },
            { name: "Competitive Positioning", val: 52, color: T.amber },
            { name: "Objection Handling", val: 65, color: T.amber },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                background: T.card,
                borderRadius: 12,
                padding: "16px 18px",
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}
                >
                  {c.name}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: c.color,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {c.val}%
                </span>
              </div>
              <Bar value={c.val} color={c.color} h={5} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// MY PATHWAY — Remediation from Echo Failure
// ═══════════════════════════════════════════════
const PathwayView = ({ go }) => {
  const [expandedGap, setExpandedGap] = useState(null);
  const [activeStep, setActiveStep] = useState(null);

  const echoResult = {
    cert: "Ozempic® Competitive Intelligence",
    therapy: "Metabolic / GLP-1",
    echoDate: "Feb 28, 2026",
    echoScore: 54,
    passing: 75,
    attempt: 2,
  };

  const gaps = [
    {
      id: "moa",
      name: "Competitor MOA Differentiation",
      score: 38,
      w: "High",
      detail:
        "Unable to articulate the mechanistic difference between semaglutide (GLP-1 RA) and tirzepatide (dual GIP/GLP-1 RA). Missed opportunity to position CV outcomes data as key differentiator.",
      improvement: "+14pts since pathway start",
    },
    {
      id: "payer",
      name: "Payer Objection Handling",
      score: 45,
      w: "High",
      detail:
        "Did not address formulary access concerns effectively. Failed to pivot from cost discussion to long-term outcomes value. No mention of RWE supporting adherence benefits.",
      improvement: null,
    },
    {
      id: "rwe",
      name: "Real-World Evidence Fluency",
      score: 62,
      w: "Medium",
      detail:
        "Referenced SUSTAIN trials but could not cite specific endpoints. Did not mention SELECT CV outcomes trial. Needs deeper comfort with data storytelling.",
      improvement: "+4pts since pathway start",
    },
  ];

  const steps = [
    {
      id: 1,
      title: "GLP-1 Receptor Agonist MOA Deep Dive",
      type: "Course",
      icon: "",
      color: T.blue,
      dur: "25 min",
      status: "complete",
      score: 88,
      gap: "moa",
      detail:
        "Comprehensive module covering GLP-1 receptor agonist pharmacology, mechanism of action, and the incretin effect. Includes interactive diagrams comparing single vs. dual agonist pathways.",
    },
    {
      id: 2,
      title: "Competitive Landscape: Mounjaro vs Ozempic",
      type: "AI Module",
      icon: "",
      color: T.violet,
      dur: "18 min",
      status: "complete",
      score: 91,
      gap: "moa",
      detail:
        "AI-generated comparative analysis including trial data, market positioning, and key messaging frameworks for HCP conversations.",
    },
    {
      id: 3,
      title: "Knowledge Check — MOA Differentiation",
      type: "Adaptive Quiz",
      icon: "",
      color: T.teal,
      dur: "~10 min",
      status: "current",
      score: null,
      gap: "moa",
      detail:
        "10-question adaptive quiz that adjusts difficulty based on your responses. Covers MOA differences, clinical trial endpoints, and positioning.",
    },
    {
      id: 4,
      title: "Payer Objection Handling Workshop",
      type: "Course",
      icon: "",
      color: T.blue,
      dur: "30 min",
      status: "locked",
      score: null,
      gap: "payer",
      detail:
        "Interactive workshop on handling formulary, prior authorization, and cost objections. Includes video scenarios and practice frameworks.",
    },
    {
      id: 5,
      title: "AI Tutor: Simulated Payer Conversation",
      type: "AI Tutor",
      icon: "",
      color: T.emerald,
      dur: "~15 min",
      status: "locked",
      score: null,
      gap: "payer",
      detail:
        "Practice a full payer dialogue with the AI Tutor. The conversation adapts to your responses and scores you on objection handling, value communication, and pivoting.",
    },
    {
      id: 6,
      title: "SUSTAIN & SELECT Trial Evidence Review",
      type: "AI Module",
      icon: "",
      color: T.violet,
      dur: "20 min",
      status: "locked",
      score: null,
      gap: "rwe",
      detail:
        "Deep dive into Novo Nordisk's landmark clinical programs. Covers trial design, primary endpoints, key results, and how to translate data into HCP talking points.",
    },
    {
      id: 7,
      title: "Clinical Data Storytelling for Cardiologists",
      type: "Course",
      icon: "",
      color: T.blue,
      dur: "22 min",
      status: "locked",
      score: null,
      gap: "rwe",
      detail:
        "Learn to frame clinical evidence for cardiology-focused HCPs. Emphasis on CV outcomes, MACE reduction, and patient selection narratives.",
    },
    {
      id: 8,
      title: "Comprehensive Knowledge Assessment",
      type: "Final Quiz",
      icon: "",
      color: T.amber,
      dur: "~20 min",
      status: "locked",
      score: null,
      gap: null,
      detail:
        "Full-spectrum assessment covering all remediated competency areas. Must score ≥80% to unlock Echo re-certification.",
    },
    {
      id: 9,
      title: "Return to Echo — Re-Certification",
      type: "Echo Roleplay",
      icon: "",
      color: T.rose,
      dur: "~15 min",
      status: "locked",
      score: null,
      gap: null,
      detail:
        "Re-attempt the Ozempic® Competitive Intelligence certification in Echo. Your AI avatar roleplay will assess all three competency areas.",
    },
  ];

  const done = steps.filter((s) => s.status === "complete").length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      {/* Echo Failure Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${T.white} 0%, ${T.card} 100%)`,
          borderRadius: 18,
          padding: "24px 26px",
          border: `1px solid ${T.border}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg,${T.rose},${T.amber},transparent)`,
          }}
        />
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              <Badge color={T.rose} size="md">
                Echo Attempt #{echoResult.attempt} — Did Not Pass
              </Badge>
              <Badge color={T.violet} size="sm">
                {echoResult.therapy}
              </Badge>
            </div>
            <h2
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: T.text,
                margin: "0 0 6px",
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {echoResult.cert}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: T.textSoft,
                margin: 0,
                lineHeight: 1.55,
                maxWidth: 520,
              }}
            >
              Proxa Tutor has analyzed your Echo performance and generated a
              personalized remediation pathway targeting {gaps.length} specific
              competency gaps.
            </p>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 10 }}>
              Echo session: {echoResult.echoDate} · AI-generated pathway
            </div>
          </div>
          <Ring
            value={echoResult.echoScore}
            size={80}
            stroke={6}
            color={T.rose}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: T.rose,
                fontFamily: "'Outfit',sans-serif",
                lineHeight: 1,
              }}
            >
              {echoResult.echoScore}
            </span>
            <span style={{ fontSize: 9, color: T.textMuted, fontWeight: 500 }}>
              /{echoResult.passing}
            </span>
          </Ring>
        </div>
      </div>

      {/* Gap Cards */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 10,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Competency Gap Analysis
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {gaps.map((g, i) => (
            <div
              key={g.id}
              onClick={() => setExpandedGap(expandedGap === g.id ? null : g.id)}
              style={{
                background: T.card,
                borderRadius: 12,
                overflow: "hidden",
                border: `1px solid ${expandedGap === g.id ? T.borderLight : T.border}`,
                cursor: "pointer",
                transition: "border-color .2s",
                animation: `slideR .3s ease ${i * 0.05}s both`,
              }}
            >
              <div
                style={{
                  padding: "13px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Ring
                  value={g.score}
                  size={36}
                  stroke={3}
                  color={g.score < 50 ? T.rose : T.amber}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: g.score < 50 ? T.rose : T.amber,
                    }}
                  >
                    {g.score}
                  </span>
                </Ring>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                    {g.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Badge color={g.w === "High" ? T.rose : T.amber} size="xs">
                      {g.w} Priority
                    </Badge>
                    {g.improvement && (
                      <span
                        style={{
                          fontSize: 10.5,
                          color: T.emerald,
                          fontWeight: 500,
                        }}
                      >
                        {g.improvement}
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.textMuted}
                  strokeWidth="2.5"
                  style={{
                    transform:
                      expandedGap === g.id ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform .2s",
                    flexShrink: 0,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {expandedGap === g.id && (
                <div
                  style={{
                    padding: "0 16px 14px 64px",
                    animation: "fadeIn .2s ease",
                  }}
                >
                  <div
                    style={{
                      borderLeft: `2px solid ${T.border}`,
                      paddingLeft: 12,
                      fontSize: 12,
                      color: T.textMuted,
                      lineHeight: 1.6,
                      fontStyle: "italic",
                    }}
                  >
                    {g.detail}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          background: T.card,
          borderRadius: 12,
          padding: "16px 20px",
          border: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
              Remediation Progress
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: T.blue,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {done}/{steps.length} · {pct}%
            </span>
          </div>
          <Bar value={pct} color={T.blue} h={7} />
        </div>
        <div style={{ fontSize: 11, color: T.textMuted, whiteSpace: "nowrap" }}>
          Est. {Math.ceil((steps.length - done) * 0.8)}h remaining
        </div>
      </div>

      {/* Pathway Steps */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Personalized Learning Pathway
        </h3>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 19,
              top: 20,
              bottom: 20,
              width: 2,
              background: `linear-gradient(180deg,${T.emerald},${T.blue},${T.border})`,
              borderRadius: 2,
              zIndex: 0,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              position: "relative",
              zIndex: 1,
            }}
          >
            {steps.map((s, i) => {
              const done = s.status === "complete",
                cur = s.status === "current",
                lock = s.status === "locked";
              const gapObj = gaps.find((g) => g.id === s.gap);
              const expanded = activeStep === s.id;
              return (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    animation: `fadeUp .3s ease ${0.04 + i * 0.03}s both`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      display: "flex",
                      justifyContent: "center",
                      flexShrink: 0,
                      paddingTop: 14,
                    }}
                  >
                    <div
                      style={{
                        width: cur ? 28 : 22,
                        height: cur ? 28 : 22,
                        borderRadius: "50%",
                        background: done ? T.emerald : cur ? T.blue : T.card,
                        border: done
                          ? "none"
                          : `2px solid ${cur ? T.blue : T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: done ? 11 : 9.5,
                        color: done || cur ? T.white : T.textFaint,
                        fontWeight: 700,
                        boxShadow: cur ? `0 0 14px ${T.blue}30` : "none",
                        animation: cur
                          ? "pulseGlow 2.5s ease infinite"
                          : "none",
                        transition: "all .3s",
                      }}
                    >
                      {done ? "" : s.id}
                    </div>
                  </div>
                  <div style={{ flex: 1, marginBottom: 2 }}>
                    <div
                      onClick={() =>
                        !lock && setActiveStep(expanded ? null : s.id)
                      }
                      className={cur ? "hlift" : ""}
                      style={{
                        background: cur ? T.cardRaised : T.card,
                        borderRadius: 12,
                        padding: "13px 16px",
                        border: `1px solid ${cur ? T.blue + "30" : expanded ? T.borderLight : T.border}`,
                        opacity: lock ? 0.4 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        cursor: lock ? "default" : "pointer",
                        transition: "all .2s",
                      }}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0 }}>
                        {s.icon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.text,
                            marginBottom: 3,
                          }}
                        >
                          {s.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 5,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <Badge color={s.color} size="xs">
                            {s.type}
                          </Badge>
                          <span style={{ fontSize: 10.5, color: T.textMuted }}>
                            {s.dur}
                          </span>
                          {gapObj && (
                            <Badge color={T.textMuted} bg={T.glass} size="xs">
                              → {gapObj.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {done && s.score && (
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: T.emerald,
                              fontFamily: "'Outfit',sans-serif",
                            }}
                          >
                            {s.score}%
                          </div>
                        </div>
                      )}
                      {cur && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          style={{
                            padding: "7px 16px",
                            borderRadius: 8,
                            border: "none",
                            background: T.blue,
                            color: T.white,
                            fontSize: 11.5,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'Outfit',sans-serif",
                            flexShrink: 0,
                            boxShadow: `0 4px 14px ${T.blue}25`,
                          }}
                        >
                          Continue
                        </button>
                      )}
                      {lock && (
                        <span
                          style={{
                            fontSize: 13,
                            color: T.textFaint,
                            flexShrink: 0,
                          }}
                        ></span>
                      )}
                    </div>
                    {/* Expanded Detail */}
                    {expanded && !lock && (
                      <div
                        style={{
                          margin: "6px 0 0",
                          padding: "14px 16px",
                          background: T.cardRaised,
                          borderRadius: 10,
                          border: `1px solid ${T.border}`,
                          animation: "scaleIn .2s ease",
                          fontSize: 12.5,
                          color: T.textSoft,
                          lineHeight: 1.6,
                        }}
                      >
                        {s.detail}
                        {done && (
                          <div
                            style={{
                              marginTop: 10,
                              padding: "10px 14px",
                              background: T.emeraldDim,
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                color: T.emerald,
                                fontWeight: 700,
                                fontSize: 12,
                              }}
                            >
                              Completed
                            </span>
                            <span style={{ color: T.textMuted, fontSize: 11 }}>
                              Score: {s.score}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// AI TUTOR — Deep Conversational Interface
// ═══════════════════════════════════════════════
const TutorView = () => {
  const [mode, setMode] = useState("chat");
  const [input, setInput] = useState("");
  const [selectedA, setSelectedA] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gapAware, setGapAware] = useState(true);
  const [adaptive, setAdaptive] = useState(true);
  const [showToggleInfo, setShowToggleInfo] = useState(null);

  // Full conversation flow
  const [msgs, setMsgs] = useState([
    {
      role: "system",
      text: "Session: Ozempic® CI Remediation · Gap: MOA Differentiation",
    },
    {
      role: "ai",
      text: "Hi Sarah — I'm your AI Tutor. I've reviewed your Echo scorecard and can see MOA differentiation is your highest priority gap.\n\nWhat would you like to do?\n• **Deep dive** into semaglutide vs tirzepatide mechanisms\n• **Quiz yourself** on competitive positioning\n• **Practice** a simulated HCP dialogue\n• **Review** your progress across all gaps",
    },
    {
      role: "user",
      text: "Deep dive on the MOA differences — I keep confusing the dual agonist part.",
    },
    {
      role: "ai",
      text: 'Great — this is exactly where Echo flagged the gap. Let me give you a clear framework.\n\n**Ozempic (semaglutide)** — Single-target GLP-1 RA\n→ Mimics natural GLP-1 hormone\n→ Stimulates insulin secretion only when glucose is elevated\n→ Slows gastric emptying, reduces appetite\n\n**Mounjaro (tirzepatide)** — Dual GIP + GLP-1 RA\n→ Activates **both** incretin pathways simultaneously\n→ GIP receptor activation adds complementary glucose-lowering\n→ Dual mechanism → stronger A1C reduction (~2.4% vs ~1.8%)\n\n**Your key HCP talking point:**\n*"While tirzepatide\'s dual mechanism may show stronger glycemic control, Ozempic has the most extensive CV outcomes evidence — including SELECT showing 20% MACE reduction. For patients with CV risk, this evidence is unmatched."*\n\nWant me to quiz you on this, or would you rather practice delivering this message to a simulated cardiologist?',
    },
    { role: "user", text: "Quiz me first." },
    { role: "ai", type: "quiz" },
    {
      role: "user",
      text: "Great — I got it right. But what if the HCP pushes back and says the CV data doesn't matter for their non-CV patients?",
    },
    {
      role: "ai",
      text: 'Excellent follow-up — this is actually one of the most common objections you\'ll face, and it came up in your Echo session too.\n\nWhen an HCP says *"My patient doesn\'t have CV disease, so the SELECT data isn\'t relevant"* — here\'s a three-step framework:\n\n**1. Acknowledge & validate**\n*"That\'s a fair point, Doctor. SELECT was specifically designed for patients with established CV disease or high risk."*\n\n**2. Bridge to broader evidence**\n*"For your non-CV patients, the SUSTAIN program is more directly applicable — SUSTAIN 7 showed significant A1C reductions across a broad T2D population, and the weight loss benefit averaged 4.5kg, which many patients value."*\n\n**3. Plant the future seed**\n*"And as your patient\'s CV risk profile evolves over time, having them established on a therapy with robust CV outcomes data provides a long-term safety net."*\n\nThis **Acknowledge → Bridge → Seed** framework works across most competitive objections. Your Echo feedback specifically noted you jumped straight to defending the data without validating the HCP\'s perspective first.\n\nWant to try role-playing this scenario so you can practice the delivery?',
    },
    {
      role: "user",
      text: "Yes, let's practice. Pretend you're an endocrinologist.",
    },
    { role: "ai", type: "hcp_sim", text: "hcp_sim" },
    {
      role: "user",
      text: "Doctor, based on your patient's A1C of 8.2 and BMI of 34, semaglutide could be a strong fit — the SUSTAIN trials showed meaningful A1C reductions and significant weight loss across a broad population.",
    },
    {
      role: "ai",
      text: "*[As Dr. Patel, Endocrinologist]*\n\nI appreciate you bringing that up. I've actually been looking at tirzepatide more closely. The SURPASS data shows superior A1C reduction — sometimes getting patients below 5.7%. Can you tell me why I shouldn't just go with Mounjaro if glycemic control is my primary goal?\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n**Coaching Sidebar** *(only you see this)*\n━━━━━━━━━━━━━━━━━━━━━━━━━\nThis is a direct competitive challenge. Use the **Acknowledge → Bridge → Seed** framework:\n→ **Don't** dismiss the SURPASS data — it IS strong\n→ **Do** acknowledge, then bridge to Ozempic's broader evidence base\n→ Consider mentioning: real-world adherence data, injection device convenience, long-term safety profile, and CV protection as a bonus\n\n*Your gap profile suggests leading with evidence rather than getting defensive. Take your time.*",
    },
    {
      role: "user",
      text: "That's a great question. The SURPASS data is impressive for glycemic control — tirzepatide does show strong A1C reductions. But when I think about the complete picture for your patient, Ozempic brings a few additional considerations. The SUSTAIN program has the broadest body of real-world evidence, with over 5 years of post-market data. And while your patient may not have CV disease today, the SELECT trial gives you long-term confidence that semaglutide is actively cardioprotective. That's a safety net you can't get with tirzepatide yet.",
    },
    { role: "ai", type: "coaching_feedback", text: "coaching_feedback" },
  ]);
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, showResult]);

  const quiz = {
    ctx: gapAware
      ? "Adaptive Quiz — MOA Differentiation (Gap-Targeted)"
      : "General Quiz — GLP-1 Receptor Agonists",
    q: 'A cardiologist asks: "Mounjaro shows stronger A1C reduction — why should I consider Ozempic for my patients with T2D and established cardiovascular disease?"',
    opts: [
      {
        id: "A",
        text: "Ozempic is available in more dosage strengths, offering greater flexibility.",
        ok: false,
      },
      {
        id: "B",
        text: "Ozempic has the broadest CV outcomes evidence, including SELECT, demonstrating a 20% MACE reduction — data tirzepatide does not yet have.",
        ok: true,
      },
      {
        id: "C",
        text: "Ozempic is more affordable on most commercial formularies.",
        ok: false,
      },
      {
        id: "D",
        text: "Both drugs work through identical mechanisms, so it doesn't matter which one you prescribe.",
        ok: false,
      },
    ],
    correct: "B",
    expl: adaptive
      ? "**Correct!** For cardiologists, CV evidence is Ozempic's primary differentiator. The SELECT trial (2023) is landmark — 20% MACE reduction with semaglutide. Tirzepatide's SURPASS-CVOT hasn't yet reported full results. Lead with outcomes, not mechanism, for this audience.\n\n*Because you got this right, your next question will increase in difficulty — focusing on handling the counter-objection when HCPs challenge the CV data's relevance for non-CV patients.*"
      : "**Correct!** For cardiologists, CV evidence is Ozempic's primary differentiator. The SELECT trial (2023) is landmark — 20% MACE reduction with semaglutide. Tirzepatide's SURPASS-CVOT hasn't yet reported full results.",
  };

  const modes = [
    { id: "chat", label: "Deep Dive", icon: "" },
    { id: "quiz", label: "Quiz Mode", icon: "" },
    { id: "practice", label: "HCP Practice", icon: "" },
    { id: "review", label: "Progress Review", icon: "" },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    setMsgs((p) => [...p, { role: "user", text: msg }]);
    setTimeout(() => {
      const aiResponse = gapAware
        ? "Based on your Echo gap profile, let me tailor this to your specific weak spots.\n\n*Pulling from your remediation context: Competitive Positioning (38%), Payer Objection Handling (45%), and RWE Fluency (62%)...*\n\nHere's what I'd focus on for that scenario:\n\n**1. Lead with the SELECT trial** — your Echo scorecard showed you referenced SUSTAIN but missed SELECT entirely. The 20% MACE reduction is the single strongest data point for cardiologists.\n\n**2. Use the \"evidence breadth\" framing** — don't compare MOA to MOA. Instead, compare *evidence confidence*: Ozempic has 10+ completed outcomes trials vs. tirzepatide's still-maturing dataset.\n\n**3. Pre-empt the glycemic control objection** — acknowledge SURPASS head-on rather than waiting for the HCP to raise it. Your Echo session showed you got defensive when challenged on this.\n\nWant me to generate a quiz on this specific framing, or practice delivering it live?"
        : "That's a good question about the clinical landscape.\n\nGLP-1 receptor agonists have become a major therapeutic class. Semaglutide and tirzepatide are the two leading options. The key differences come down to mechanism of action, clinical trial data, and real-world evidence.\n\nSemaglutide is a selective GLP-1 RA, while tirzepatide is a dual GIP/GLP-1 RA. Both show strong efficacy in A1C reduction and weight loss.\n\nWould you like me to go deeper on any of these areas?";
      setMsgs((p) => [...p, { role: "ai", text: aiResponse }]);
    }, 1500);
  };

  const handleAnswer = (id) => {
    setSelectedA(id);
    setTimeout(() => setShowResult(true), 300);
  };

  // Toggle info panels
  const toggleInfoContent = {
    gapAware: {
      title: "Gap-Aware Mode",
      color: T.emerald,
      onDesc:
        "The AI Tutor has full access to your Echo performance data, competency gap scores, and remediation context. Every response is personalized to your specific weaknesses — it knows your MOA score is 38%, your payer objection score is 45%, and where exactly you struggled in the roleplay.",
      offDesc:
        "The AI Tutor operates as a general-purpose learning assistant without access to your Echo scorecard or gap analysis. Responses cover broad topic areas without targeting your specific weak points. Useful for exploring new topics outside your remediation pathway.",
      onFeatures: [
        "References your specific Echo scorecard data",
        "Targets identified competency gaps",
        "Connects advice to your roleplay mistakes",
        "Prioritizes content by gap severity",
      ],
      offFeatures: [
        "General topic exploration",
        "Broad knowledge base access",
        "No personalization to your gaps",
        "Standard learning assistant behavior",
      ],
    },
    adaptive: {
      title: "Adaptive Difficulty",
      color: T.violet,
      onDesc:
        "Quiz difficulty, conversation complexity, and coaching depth dynamically adjust based on your real-time performance within this session. Get a question right — the next one gets harder. Struggle — the tutor breaks concepts down further and provides scaffolding.",
      offDesc:
        "All content is delivered at a consistent, standard difficulty level regardless of your responses. Questions don't escalate, explanations maintain the same depth, and the tutor doesn't modify its approach based on your answers.",
      onFeatures: [
        "Quiz difficulty scales with performance",
        "Explanations deepen when you struggle",
        "Coaching complexity increases as you improve",
        "Predicts when you're ready for Echo re-attempt",
      ],
      offFeatures: [
        "Fixed difficulty level throughout",
        "Consistent explanation depth",
        "No performance-based adjustments",
        "Standard quiz progression",
      ],
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        animation: "fadeUp .3s ease",
        padding: "22px 0 20px",
      }}
    >
      {/* Mode Selector */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 12,
          flexShrink: 0,
          padding: "0 26px",
        }}
      >
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              flex: 1,
              padding: "10px 10px",
              borderRadius: 10,
              border: `1px solid ${mode === m.id ? T.blue + "30" : T.border}`,
              background: mode === m.id ? T.blueGlow : T.card,
              cursor: "pointer",
              textAlign: "center",
              transition: "all .15s",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 2 }}>{m.icon}</div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: mode === m.id ? 600 : 500,
                color: mode === m.id ? T.blue : T.textMuted,
              }}
            >
              {m.label}
            </div>
          </button>
        ))}
      </div>

      {/* Context Bar with Toggles */}
      <div style={{ padding: "0 26px", marginBottom: 0, flexShrink: 0 }}>
        <div
          style={{
            background: T.card,
            borderRadius: 12,
            padding: "12px 16px",
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: `linear-gradient(135deg,${T.blue},${T.violet})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: T.white,
              flexShrink: 0,
              animation: "pulseGlow 3s ease infinite",
              fontWeight: 700,
            }}
          >
            P
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
              AI Tutor — {modes.find((m) => m.id === mode)?.label} Mode
            </div>
            <div style={{ fontSize: 11, color: T.textMuted }}>
              Ozempic® CI · Gap: MOA Differentiation
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {/* Gap-Aware Toggle */}
            <div
              onClick={() =>
                setShowToggleInfo(
                  showToggleInfo === "gapAware" ? null : "gapAware",
                )
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: 7,
                cursor: "pointer",
                background: gapAware ? `${T.emerald}10` : `${T.textMuted}08`,
                border: `1px solid ${gapAware ? T.emerald + "25" : T.border}`,
                transition: "all .2s",
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setGapAware(!gapAware);
                }}
                style={{
                  width: 28,
                  height: 16,
                  borderRadius: 8,
                  background: gapAware ? T.emerald : `${T.textMuted}40`,
                  position: "relative",
                  cursor: "pointer",
                  transition: "background .2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: T.white,
                    position: "absolute",
                    top: 2,
                    left: gapAware ? 14 : 2,
                    transition: "left .2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,.3)",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: gapAware ? T.emerald : T.textMuted,
                  whiteSpace: "nowrap",
                }}
              >
                Gap-Aware
              </span>
            </div>
            {/* Adaptive Toggle */}
            <div
              onClick={() =>
                setShowToggleInfo(
                  showToggleInfo === "adaptive" ? null : "adaptive",
                )
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: 7,
                cursor: "pointer",
                background: adaptive ? `${T.violet}10` : `${T.textMuted}08`,
                border: `1px solid ${adaptive ? T.violet + "25" : T.border}`,
                transition: "all .2s",
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setAdaptive(!adaptive);
                }}
                style={{
                  width: 28,
                  height: 16,
                  borderRadius: 8,
                  background: adaptive ? T.violet : `${T.textMuted}40`,
                  position: "relative",
                  cursor: "pointer",
                  transition: "background .2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: T.white,
                    position: "absolute",
                    top: 2,
                    left: adaptive ? 14 : 2,
                    transition: "left .2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,.3)",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: adaptive ? T.violet : T.textMuted,
                  whiteSpace: "nowrap",
                }}
              >
                Adaptive
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Info Panel — slides open below context bar */}
      {showToggleInfo && (
        <div style={{ padding: "0 26px", flexShrink: 0, zIndex: 10 }}>
          <div
            style={{
              background: T.cardRaised,
              borderRadius: "0 0 12px 12px",
              padding: "16px 18px",
              border: `1px solid ${T.borderLight}`,
              borderTop: "none",
              marginBottom: 0,
              animation: "scaleIn .2s ease",
            }}
          >
            {(() => {
              const info = toggleInfoContent[showToggleInfo];
              const isOn = showToggleInfo === "gapAware" ? gapAware : adaptive;
              return (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: isOn ? info.color : T.textMuted,
                        animation: isOn ? "breathe 2s ease infinite" : "none",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: info.color,
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      {info.title}
                    </span>
                    <Badge color={isOn ? info.color : T.textMuted} size="xs">
                      {isOn ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: T.textSoft,
                      lineHeight: 1.6,
                      margin: "0 0 12px",
                    }}
                  >
                    {isOn ? info.onDesc : info.offDesc}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        background: `${info.color}08`,
                        borderRadius: 8,
                        padding: "10px 12px",
                        border: `1px solid ${info.color}15`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: info.color,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          marginBottom: 6,
                        }}
                      >
                        When Enabled
                      </div>
                      {info.onFeatures.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 11,
                            color: T.textSoft,
                            lineHeight: 1.5,
                            display: "flex",
                            gap: 5,
                            marginBottom: 3,
                          }}
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        background: T.glass,
                        borderRadius: 8,
                        padding: "10px 12px",
                        border: `1px solid ${T.border}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: T.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          marginBottom: 6,
                        }}
                      >
                        When Disabled
                      </div>
                      {info.offFeatures.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 11,
                            color: T.textMuted,
                            lineHeight: 1.5,
                            display: "flex",
                            gap: 5,
                            marginBottom: 3,
                          }}
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Spacer after context bar / toggle panel */}
      <div style={{ height: 12, flexShrink: 0 }} />

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBottom: 24,
          minHeight: 0,
          paddingLeft: 26,
          paddingRight: 26,
        }}
      >
        {msgs.map((m, i) => {
          if (m.role === "system")
            return (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  fontSize: 10.5,
                  color: T.textFaint,
                  padding: "6px 0",
                  letterSpacing: 0.3,
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                — {m.text} —
              </div>
            );
          // Quiz block
          if (m.type === "quiz")
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  animation: "fadeUp .3s ease",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: `linear-gradient(135deg,${T.blue},${T.violet})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: T.white,
                    flexShrink: 0,
                    marginTop: 2,
                    fontWeight: 700,
                  }}
                >
                  P
                </div>
                <div
                  style={{
                    maxWidth: "88%",
                    borderRadius: 14,
                    overflow: "hidden",
                    border: `1px solid ${T.borderLight}`,
                    background: T.card,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      background: `linear-gradient(135deg,${T.blue}08,${T.violet}06)`,
                      borderBottom: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: T.blue,
                        letterSpacing: 0.3,
                      }}
                    >
                      {quiz.ctx}
                    </span>
                    {adaptive && (
                      <Badge color={T.violet} size="xs">
                        Adaptive
                      </Badge>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: T.text,
                        lineHeight: 1.6,
                        margin: "0 0 12px",
                        fontStyle: "italic",
                      }}
                    >
                      {quiz.q}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      {quiz.opts.map((o) => {
                        const sel = selectedA === o.id,
                          correct = o.ok,
                          show = showResult;
                        let bc = T.border,
                          bg = T.cardRaised;
                        if (show && correct) {
                          bc = T.emerald;
                          bg = T.emeraldDim;
                        } else if (show && sel && !correct) {
                          bc = T.rose;
                          bg = T.roseDim;
                        } else if (sel && !show) {
                          bc = T.blue;
                          bg = T.blueGlow2;
                        }
                        return (
                          <button
                            key={o.id}
                            onClick={() => !showResult && handleAnswer(o.id)}
                            disabled={showResult}
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "flex-start",
                              padding: "10px 12px",
                              borderRadius: 9,
                              border: `1.5px solid ${bc}`,
                              background: bg,
                              cursor: showResult ? "default" : "pointer",
                              transition: "all .15s",
                              textAlign: "left",
                              width: "100%",
                              fontFamily: "'Outfit',sans-serif",
                            }}
                          >
                            <span
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                flexShrink: 0,
                                background:
                                  show && correct
                                    ? T.emerald
                                    : show && sel
                                      ? T.rose
                                      : sel
                                        ? T.blue
                                        : T.surface,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 700,
                                color:
                                  sel || (show && correct)
                                    ? T.white
                                    : T.textMuted,
                              }}
                            >
                              {o.id}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: T.text,
                                lineHeight: 1.45,
                              }}
                            >
                              {o.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {showResult && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: "12px 14px",
                          background:
                            selectedA === quiz.correct
                              ? T.emeraldDim
                              : T.roseDim,
                          borderRadius: 9,
                          animation: "fadeUp .3s ease",
                          borderLeft: `3px solid ${selectedA === quiz.correct ? T.emerald : T.rose}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color:
                              selectedA === quiz.correct ? T.emerald : T.rose,
                            marginBottom: 5,
                          }}
                        >
                          {selectedA === quiz.correct
                            ? "Correct!"
                            : "Not quite."}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: T.textSoft,
                            lineHeight: 1.6,
                          }}
                          dangerouslySetInnerHTML={{
                            __html: quiz.expl
                              .replace(
                                /\*\*(.*?)\*\*/g,
                                `<strong style="color:${T.text}">$1</strong>`,
                              )
                              .replace(/\n/g, "<br/>"),
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          // HCP Simulation intro
          if (m.type === "hcp_sim")
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  animation: "fadeUp .3s ease",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: `linear-gradient(135deg,${T.blue},${T.violet})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: T.white,
                    flexShrink: 0,
                    marginTop: 2,
                    fontWeight: 700,
                  }}
                >
                  P
                </div>
                <div
                  style={{
                    maxWidth: "88%",
                    borderRadius: 14,
                    overflow: "hidden",
                    border: `1px solid ${T.borderLight}`,
                    background: T.card,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      background: `linear-gradient(135deg,${T.emerald}08,${T.teal}06)`,
                      borderBottom: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: T.emerald,
                        letterSpacing: 0.3,
                      }}
                    >
                      HCP Simulation — Practice Mode
                    </span>
                    {gapAware && (
                      <Badge color={T.emerald} size="xs">
                        Gap-Aware
                      </Badge>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: T.text,
                        lineHeight: 1.6,
                        margin: "0 0 10px",
                      }}
                    >
                      Entering roleplay mode. I'll act as{" "}
                      <strong style={{ color: T.text }}>
                        Dr. Raj Patel, Endocrinologist
                      </strong>{" "}
                      at a large academic medical center. He's a high-prescriber
                      who currently favors tirzepatide.
                    </p>
                    <div
                      style={{
                        background: T.cardRaised,
                        borderRadius: 8,
                        padding: "10px 12px",
                        border: `1px solid ${T.border}`,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: T.teal,
                          textTransform: "uppercase",
                          letterSpacing: 0.6,
                          marginBottom: 4,
                        }}
                      >
                        Scenario Context
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: T.textSoft,
                          lineHeight: 1.55,
                        }}
                      >
                        Dr. Patel has a 52-year-old patient with T2D (A1C 8.2),
                        obesity (BMI 34), and no established CV disease. He's
                        leaning toward Mounjaro. Your goal: position Ozempic as
                        a strong alternative.
                      </div>
                    </div>
                    {gapAware && (
                      <div
                        style={{
                          background: `${T.emerald}08`,
                          borderRadius: 8,
                          padding: "10px 12px",
                          border: `1px solid ${T.emerald}15`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: T.emerald,
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                            marginBottom: 4,
                          }}
                        >
                          Gap-Aware Coaching Tips
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: T.textSoft,
                            lineHeight: 1.55,
                          }}
                        >
                          Based on your Echo feedback:{" "}
                          <span style={{ color: T.amber }}>
                            avoid leading with mechanism
                          </span>{" "}
                          (you over-indexed on this last time). Instead, lead
                          with{" "}
                          <span style={{ color: T.emerald }}>
                            real-world evidence and patient outcomes
                          </span>
                          . Use the Acknowledge → Bridge → Seed framework.
                        </div>
                      </div>
                    )}
                    <p
                      style={{
                        fontSize: 12.5,
                        color: T.textSoft,
                        lineHeight: 1.6,
                        margin: "10px 0 0",
                        fontStyle: "italic",
                      }}
                    >
                      *Dr. Patel is ready. Start the conversation as you would
                      in a real detailing visit.*
                    </p>
                  </div>
                </div>
              </div>
            );
          // Coaching Feedback
          if (m.type === "coaching_feedback")
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  animation: "fadeUp .3s ease",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: `linear-gradient(135deg,${T.blue},${T.violet})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: T.white,
                    flexShrink: 0,
                    marginTop: 2,
                    fontWeight: 700,
                  }}
                >
                  P
                </div>
                <div
                  style={{
                    maxWidth: "88%",
                    borderRadius: 14,
                    overflow: "hidden",
                    border: `1px solid ${T.borderLight}`,
                    background: T.card,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      background: `linear-gradient(135deg,${T.amber}08,${T.emerald}06)`,
                      borderBottom: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: T.amber,
                        letterSpacing: 0.3,
                      }}
                    >
                      AI Performance Coaching
                    </span>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: T.text,
                        lineHeight: 1.6,
                        margin: "0 0 12px",
                        fontWeight: 600,
                      }}
                    >
                      Great response, Sarah. Here's my analysis:
                    </p>
                    {/* Scoring */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 8,
                        marginBottom: 14,
                      }}
                    >
                      {[
                        {
                          label: "Acknowledge",
                          score: 9,
                          max: 10,
                          color: T.emerald,
                          note: "Strong — you validated SURPASS data",
                        },
                        {
                          label: "Bridge",
                          score: 8,
                          max: 10,
                          color: T.emerald,
                          note: "Good pivot to real-world evidence",
                        },
                        {
                          label: "Seed",
                          score: 7,
                          max: 10,
                          color: T.amber,
                          note: "CV seed was good but could be stronger",
                        },
                      ].map((s, j) => (
                        <div
                          key={j}
                          style={{
                            background: T.cardRaised,
                            borderRadius: 8,
                            padding: "10px 12px",
                            border: `1px solid ${T.border}`,
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 800,
                              color: s.color,
                              fontFamily: "'Outfit',sans-serif",
                            }}
                          >
                            {s.score}
                            <span style={{ fontSize: 11, color: T.textMuted }}>
                              /{s.max}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: 10.5,
                              fontWeight: 600,
                              color: T.text,
                              marginTop: 2,
                            }}
                          >
                            {s.label}
                          </div>
                          <div
                            style={{
                              fontSize: 9.5,
                              color: T.textMuted,
                              marginTop: 3,
                            }}
                          >
                            {s.note}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Detailed feedback */}
                    <div
                      style={{
                        background: `${T.emerald}08`,
                        borderRadius: 8,
                        padding: "10px 12px",
                        border: `1px solid ${T.emerald}15`,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: T.emerald,
                          textTransform: "uppercase",
                          letterSpacing: 0.6,
                          marginBottom: 4,
                        }}
                      >
                        What Went Well
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: T.textSoft,
                          lineHeight: 1.6,
                        }}
                      >
                        You acknowledged the competitive data head-on instead of
                        being defensive — this was your #1 Echo feedback item
                        and you nailed it. The bridge to "broadest body of
                        real-world evidence" was strong framing.
                      </div>
                    </div>
                    <div
                      style={{
                        background: `${T.amber}08`,
                        borderRadius: 8,
                        padding: "10px 12px",
                        border: `1px solid ${T.amber}15`,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: T.amber,
                          textTransform: "uppercase",
                          letterSpacing: 0.6,
                          marginBottom: 4,
                        }}
                      >
                        Opportunity
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: T.textSoft,
                          lineHeight: 1.6,
                        }}
                      >
                        Your CV "safety net" message is good, but could be more
                        specific. Try: *"The SELECT trial showed a 20% reduction
                        in major adverse cardiovascular events — that's a level
                        of cardioprotection your patient gets as a built-in
                        benefit, even before CV risk fully manifests."* Numbers
                        land better than abstractions.
                      </div>
                    </div>
                    {gapAware && (
                      <div
                        style={{
                          background: T.cardRaised,
                          borderRadius: 8,
                          padding: "10px 12px",
                          border: `1px solid ${T.border}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: T.violet,
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                            marginBottom: 4,
                          }}
                        >
                          Gap Progress Update
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: T.textSoft,
                            lineHeight: 1.6,
                          }}
                        >
                          <span style={{ color: T.emerald, fontWeight: 600 }}>
                            MOA Differentiation:
                          </span>{" "}
                          This response shows significant improvement from your
                          Echo session. Estimated gap score:{" "}
                          <span style={{ color: T.emerald, fontWeight: 700 }}>
                            38 → 58
                          </span>{" "}
                          (+20pts). Two more successful practice rounds should
                          bring you to re-certification readiness.
                        </div>
                      </div>
                    )}
                    {adaptive && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: "8px 12px",
                          background: `${T.violet}08`,
                          borderRadius: 8,
                          border: `1px solid ${T.violet}15`,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: T.violet,
                            fontWeight: 500,
                          }}
                        >
                          Adaptive: Increasing difficulty for next scenario —
                          Dr. Patel will now push back harder on real-world data
                          and ask about payer coverage.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          // Regular messages
          const isAI = m.role === "ai";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                flexDirection: isAI ? "row" : "row-reverse",
                animation: "fadeUp .25s ease",
              }}
            >
              {isAI && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: `linear-gradient(135deg,${T.blue},${T.violet})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: T.white,
                    flexShrink: 0,
                    marginTop: 2,
                    fontWeight: 700,
                  }}
                >
                  P
                </div>
              )}
              <div
                style={{
                  maxWidth: "82%",
                  padding: "13px 16px",
                  borderRadius: 14,
                  background: isAI ? T.card : `${T.blue}10`,
                  border: `1px solid ${isAI ? T.border : T.blue + "20"}`,
                  fontSize: 12.5,
                  color: T.text,
                  lineHeight: 1.65,
                }}
                dangerouslySetInnerHTML={{
                  __html: m.text
                    .replace(/\n/g, "<br/>")
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      `<strong style="color:${T.text}">$1</strong>`,
                    )
                    .replace(
                      /\*(.*?)\*/g,
                      `<em style="color:${T.textMuted}">$1</em>`,
                    )
                    .replace(/→/g, `<span style="color:${T.blue}">→</span>`)
                    .replace(
                      /•/g,
                      `<span style="color:${T.blue};margin-right:4px">•</span>`,
                    ),
                }}
              />
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "12px 26px 0",
          borderTop: `1px solid ${T.border}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: T.card,
            borderRadius: 11,
            border: `1px solid ${T.border}`,
            padding: "0 14px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              mode === "practice"
                ? "Respond as if speaking to the HCP..."
                : "Ask a question, request a quiz, or explore a topic..."
            }
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: T.text,
              fontSize: 12.5,
              padding: "13px 0",
              fontFamily: "'Outfit',sans-serif",
            }}
          />
        </div>
        <button
          onClick={handleSend}
          style={{
            padding: "0 20px",
            borderRadius: 11,
            border: "none",
            background: T.blue,
            color: T.white,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
            boxShadow: `0 4px 14px ${T.blue}20`,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// CERTIFICATIONS VIEW
// ═══════════════════════════════════════════════
const CertsView = ({ go }) => {
  const certs = [
    {
      name: "Dupixent® Clinical Data Mastery",
      ta: "Dermatology",
      s: "Certified",
      sc: T.emerald,
      echo: 92,
      dt: "Feb 12",
      att: 1,
      ttc: "4.2d",
    },
    {
      name: "Keytruda® Indication Expansion",
      ta: "Oncology",
      s: "Certified",
      sc: T.emerald,
      echo: 95,
      dt: "Dec 5",
      att: 1,
      ttc: "3.8d",
    },
    {
      name: "Entresto® Cardiology Positioning",
      ta: "Cardiology",
      s: "Certified",
      sc: T.emerald,
      echo: 88,
      dt: "Jan 18",
      att: 2,
      ttc: "8.1d",
    },
    {
      name: "SKYRIZI® Objection Handling",
      ta: "Immunology",
      s: "In Progress",
      sc: T.blue,
      echo: 68,
      dt: "Mar 1",
      att: 1,
      ttc: "—",
    },
    {
      name: "Ozempic® Competitive Intel",
      ta: "Metabolic",
      s: "Remediation",
      sc: T.rose,
      echo: 54,
      dt: "Feb 28",
      att: 2,
      ttc: "—",
    },
    {
      name: "Reyvow® Product Launch",
      ta: "Neuroscience",
      s: "Assigned",
      sc: T.amber,
      echo: null,
      dt: "—",
      att: 0,
      ttc: "—",
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          { l: "Total Certifications", v: "6", s: "All time", c: T.blue },
          { l: "Certified", v: "3", s: "Passed Echo", c: T.emerald },
          { l: "In Progress", v: "2", s: "Active / Remediation", c: T.amber },
          { l: "Avg Attempts", v: "1.4", s: "Target ≤ 2", c: T.violet },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: T.card,
              borderRadius: 13,
              padding: "16px 18px",
              border: `1px solid ${T.border}`,
              animation: `fadeUp .35s ease ${i * 0.04}s both`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: T.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 6,
              }}
            >
              {m.l}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: T.text,
                fontFamily: "'Outfit',sans-serif",
                lineHeight: 1,
              }}
            >
              {m.v}
            </div>
            <div
              style={{
                fontSize: 11,
                color: m.c,
                fontWeight: 500,
                marginTop: 5,
              }}
            >
              {m.s}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 10,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          All Certifications
        </h3>
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.5fr 1fr .9fr .7fr .5fr .6fr",
            padding: "8px 18px",
            gap: 10,
            marginBottom: 4,
          }}
        >
          {["Certification", "Status", "Echo Score", "Date", "Att.", "TTC"].map(
            (h) => (
              <div
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.textFaint,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                {h}
              </div>
            ),
          )}
        </div>
        {certs.map((c, i) => (
          <div
            key={i}
            className="hbright"
            onClick={() => c.s === "Remediation" && go("pathway")}
            style={{
              background: T.card,
              borderRadius: 11,
              padding: "14px 18px",
              marginBottom: 5,
              border: `1px solid ${T.border}`,
              display: "grid",
              gridTemplateColumns: "2.5fr 1fr .9fr .7fr .5fr .6fr",
              alignItems: "center",
              gap: 10,
              cursor: c.s === "Remediation" ? "pointer" : "default",
              animation: `fadeUp .3s ease ${i * 0.04}s both`,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 2,
                }}
              >
                {c.name}
              </div>
              <Badge color={T.violet} size="xs">
                {c.ta}
              </Badge>
            </div>
            <Badge color={c.sc} size="sm">
              {c.s}
            </Badge>
            <div>
              {c.echo ? (
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: c.echo >= 70 ? T.emerald : T.rose,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {c.echo}%
                </span>
              ) : (
                <span style={{ color: T.textFaint }}>—</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: T.textSoft }}>{c.dt}</div>
            <div style={{ fontSize: 12, color: T.textSoft }}>
              {c.att || "—"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: c.ttc !== "—" ? T.emerald : T.textMuted,
                fontWeight: c.ttc !== "—" ? 600 : 400,
              }}
            >
              {c.ttc}
            </div>
          </div>
        ))}
      </div>

      {/* Echo Loop Stats */}
      <div
        style={{
          background: T.card,
          borderRadius: 13,
          padding: "18px 22px",
          border: `1px solid ${T.border}`,
          animation: "fadeUp .4s ease .25s both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 14 }}></span>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
            Echo ↔ Tutor Certification Loop
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
          }}
        >
          {[
            { l: "Echo Attempts", v: "7", c: T.blue },
            { l: "Gap Analyses", v: "4", c: T.violet },
            { l: "Remediations Done", v: "1", c: T.emerald },
            { l: "Avg Score Lift", v: "+18pts", c: T.teal },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: T.cardRaised,
                borderRadius: 10,
                padding: "14px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: s.c,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 3 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// COMPETENCIES VIEW — NEW
// ═══════════════════════════════════════════════
const CompetenciesView = () => {
  const [expanded, setExpanded] = useState(null);
  // Quiz state
  const [quizComp, setQuizComp] = useState(null); // which competency is being quizzed
  const [quizStep, setQuizStep] = useState(0); // 0-4 = questions, 5 = results
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [selectedQuizA, setSelectedQuizA] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const competencies = [
    {
      id: "clinical",
      name: "Clinical Knowledge",
      score: 78,
      trend: "+6",
      color: T.emerald,
      desc: "Depth and accuracy of product and disease-state knowledge across assigned therapy areas.",
      subs: [
        {
          name: "Mechanism of Action",
          score: 62,
          src: "Echo + Quiz",
          note: "Gap flagged in Ozempic® CI",
        },
        {
          name: "Clinical Trial Data",
          score: 81,
          src: "Course + Quiz",
          note: null,
        },
        {
          name: "Safety & Tolerability",
          score: 88,
          src: "Compliance Module",
          note: null,
        },
        {
          name: "Disease State Knowledge",
          score: 79,
          src: "AI Module",
          note: null,
        },
      ],
      quiz: [
        {
          q: "A patient on semaglutide reports persistent nausea. Which mechanism most directly explains this side effect?",
          opts: [
            {
              id: "A",
              t: "GLP-1 mediated delay in gastric emptying",
              ok: true,
            },
            {
              id: "B",
              t: "Direct CNS stimulation of the chemoreceptor trigger zone",
              ok: false,
            },
            {
              id: "C",
              t: "GIP receptor cross-reactivity causing vagal stimulation",
              ok: false,
            },
            {
              id: "D",
              t: "Pancreatic enzyme inhibition reducing nutrient absorption",
              ok: false,
            },
          ],
          correct: "A",
          expl: "GLP-1 receptor agonists slow gastric emptying, which is a primary driver of nausea, especially during dose titration. This is a class effect, not unique to semaglutide.",
        },
        {
          q: "In the SUSTAIN-6 cardiovascular outcomes trial, what was the primary composite endpoint?",
          opts: [
            {
              id: "A",
              t: "All-cause mortality, non-fatal MI, and hospitalization for heart failure",
              ok: false,
            },
            {
              id: "B",
              t: "First occurrence of CV death, non-fatal MI, or non-fatal stroke (3-point MACE)",
              ok: true,
            },
            { id: "C", t: "Time to first major hypoglycemic event", ok: false },
            {
              id: "D",
              t: "Composite of A1C reduction >1% and weight loss >5%",
              ok: false,
            },
          ],
          correct: "B",
          expl: "SUSTAIN-6 used the standard 3-point MACE composite. Semaglutide demonstrated a 26% reduction in this endpoint vs placebo — foundational data for the CV benefit narrative.",
        },
        {
          q: "Which of the following best describes the relationship between GLP-1 and insulin secretion?",
          opts: [
            {
              id: "A",
              t: "GLP-1 stimulates insulin secretion regardless of blood glucose levels",
              ok: false,
            },
            {
              id: "B",
              t: "GLP-1 stimulates insulin only when blood glucose is elevated (glucose-dependent)",
              ok: true,
            },
            {
              id: "C",
              t: "GLP-1 directly replaces endogenous insulin production",
              ok: false,
            },
            {
              id: "D",
              t: "GLP-1 blocks glucagon but has no effect on insulin",
              ok: false,
            },
          ],
          correct: "B",
          expl: "The glucose-dependent mechanism is a critical safety differentiator — it means GLP-1 RAs carry significantly lower hypoglycemia risk than sulfonylureas or exogenous insulin.",
        },
        {
          q: "An HCP asks about the weight loss mechanism of semaglutide. Which combination of effects is most accurate?",
          opts: [
            {
              id: "A",
              t: "Reduced appetite via hypothalamic signaling + delayed gastric emptying + increased basal metabolic rate",
              ok: false,
            },
            {
              id: "B",
              t: "Reduced appetite via hypothalamic signaling + delayed gastric emptying + reduced food reward signaling",
              ok: true,
            },
            {
              id: "C",
              t: "Fat malabsorption + appetite suppression + increased thermogenesis",
              ok: false,
            },
            {
              id: "D",
              t: "Leptin sensitization + reduced ghrelin + direct lipolysis",
              ok: false,
            },
          ],
          correct: "B",
          expl: "Semaglutide's weight effects come from central appetite suppression (hypothalamus), delayed gastric emptying (feeling full longer), and emerging evidence of reduced food reward/craving pathways. It does NOT increase metabolic rate or cause malabsorption.",
        },
        {
          q: "What is the most clinically significant difference between the SUSTAIN and STEP trial programs?",
          opts: [
            {
              id: "A",
              t: "SUSTAIN studied T2D patients; STEP studied obesity/overweight patients (with and without T2D)",
              ok: true,
            },
            {
              id: "B",
              t: "SUSTAIN used subcutaneous dosing; STEP used oral dosing",
              ok: false,
            },
            {
              id: "C",
              t: "SUSTAIN measured A1C; STEP measured only blood pressure",
              ok: false,
            },
            {
              id: "D",
              t: "SUSTAIN was placebo-controlled; STEP was open-label only",
              ok: false,
            },
          ],
          correct: "A",
          expl: "The SUSTAIN program established semaglutide's efficacy in T2D, while STEP expanded the evidence to obesity/overweight (higher dose, 2.4mg). Knowing which program to cite for which HCP audience is critical for credibility.",
        },
      ],
      recs: [
        {
          title: "GLP-1 Receptor Agonist MOA Deep Dive",
          type: "Course",
          dur: "25 min",
          match: "High",
          reason:
            "Directly addresses mechanism knowledge gaps identified in quiz",
        },
        {
          title: "SUSTAIN & SELECT Trial Evidence Review",
          type: "AI Module",
          dur: "20 min",
          match: "High",
          reason:
            "Strengthen trial data fluency — quiz showed uncertainty on endpoints",
        },
        {
          title: "Safety & Tolerability: Managing GI Side Effects",
          type: "Course",
          dur: "15 min",
          match: "Medium",
          reason:
            "Reinforce GI mechanism understanding for patient conversations",
        },
      ],
    },
    {
      id: "competitive",
      name: "Competitive Positioning",
      score: 52,
      trend: "+14",
      color: T.amber,
      desc: "Ability to differentiate your products against competitors using evidence-based messaging.",
      subs: [
        {
          name: "MOA Differentiation",
          score: 38,
          src: "Echo",
          note: "High priority gap — actively remediating",
        },
        {
          name: "Head-to-Head Data Fluency",
          score: 55,
          src: "AI Module",
          note: "Improving",
        },
        {
          name: "Formulary & Access Strategy",
          score: 48,
          src: "Echo + Course",
          note: "Payer objection gap",
        },
        { name: "Competitive Messaging", score: 65, src: "Course", note: null },
      ],
      quiz: [
        {
          q: 'An endocrinologist says: "Mounjaro gives better A1C control — why would I prescribe Ozempic?" What is the strongest evidence-based response?',
          opts: [
            {
              id: "A",
              t: "Ozempic has more dosing flexibility with 0.25, 0.5, 1.0, and 2.0mg options",
              ok: false,
            },
            {
              id: "B",
              t: "Lead with Ozempic's unmatched CV outcomes data (SELECT trial, 20% MACE reduction) as a differentiator tirzepatide lacks",
              ok: true,
            },
            {
              id: "C",
              t: "Ozempic was first-to-market so it has more patient familiarity",
              ok: false,
            },
            {
              id: "D",
              t: "Recommend the HCP prescribe both medications alternately",
              ok: false,
            },
          ],
          correct: "B",
          expl: "The SELECT trial is Ozempic's strongest competitive differentiator. Tirzepatide's SURPASS-CVOT hasn't reported full results yet. For physicians who value CV protection, this is a compelling advantage.",
        },
        {
          q: 'A payer pushes back: "Tirzepatide is on our preferred formulary. Why should we add semaglutide?" Which approach is most effective?',
          opts: [
            {
              id: "A",
              t: "Argue that semaglutide is clinically superior to tirzepatide across all endpoints",
              ok: false,
            },
            {
              id: "B",
              t: "Offer a significant rebate discount to secure formulary placement",
              ok: false,
            },
            {
              id: "C",
              t: "Present real-world evidence on long-term adherence, the broader outcomes dataset, and total cost-of-care reduction including CV event prevention",
              ok: true,
            },
            {
              id: "D",
              t: "Suggest the payer remove tirzepatide and replace it with semaglutide",
              ok: false,
            },
          ],
          correct: "C",
          expl: "Payer conversations require a value-based approach. Leading with RWE, long-term adherence data, and total cost-of-care (including downstream CV event savings) is more effective than head-to-head clinical arguments.",
        },
        {
          q: "Which data point is MOST relevant when positioning Ozempic against Mounjaro for a cardiologist?",
          opts: [
            {
              id: "A",
              t: "Ozempic's weight loss data from STEP trials",
              ok: false,
            },
            {
              id: "B",
              t: "Ozempic's injection pen design and patient satisfaction scores",
              ok: false,
            },
            {
              id: "C",
              t: "SELECT trial: 20% reduction in MACE in patients with established CV disease",
              ok: true,
            },
            {
              id: "D",
              t: "Ozempic's longer time on market since approval",
              ok: false,
            },
          ],
          correct: "C",
          expl: "Cardiologists care about cardiovascular outcomes above all else. The SELECT trial is the definitive talking point. Weight data is secondary; device design is irrelevant for this audience.",
        },
        {
          q: "When an HCP acknowledges tirzepatide's superior glycemic control, what is the best next step in your messaging?",
          opts: [
            {
              id: "A",
              t: "Disagree and present data showing semaglutide has equivalent A1C reduction",
              ok: false,
            },
            {
              id: "B",
              t: "Validate their point, then bridge to Ozempic's broader evidence base and CV protection as complementary value",
              ok: true,
            },
            {
              id: "C",
              t: "Change the subject to patient assistance programs and affordability",
              ok: false,
            },
            {
              id: "D",
              t: "Concede the point and end the discussion",
              ok: false,
            },
          ],
          correct: "B",
          expl: "The Acknowledge → Bridge → Seed framework. Never dismiss valid competitive data — it destroys credibility. Instead, validate, then bridge to where Ozempic has the advantage (CV outcomes, evidence breadth, long-term data).",
        },
        {
          q: "A regional health system is evaluating GLP-1 RAs for their formulary. What competitive positioning strategy would be most effective?",
          opts: [
            {
              id: "A",
              t: "Focus exclusively on clinical trial data comparisons",
              ok: false,
            },
            { id: "B", t: "Offer the lowest price guarantee", ok: false },
            {
              id: "C",
              t: "Present a multi-dimensional value story: CV outcomes data, real-world adherence, total cost-of-care modeling, and patient support infrastructure",
              ok: true,
            },
            {
              id: "D",
              t: "Emphasize that Ozempic is the most prescribed GLP-1 RA by volume",
              ok: false,
            },
          ],
          correct: "C",
          expl: "Health system decisions are multi-factorial. A comprehensive value story that includes clinical, economic, and operational dimensions is far more compelling than any single data point.",
        },
      ],
      recs: [
        {
          title: "Competitive Landscape: Mounjaro vs Ozempic",
          type: "AI Module",
          dur: "18 min",
          match: "High",
          reason:
            "Head-to-head comparison framework directly addressing your weakest sub-competency",
        },
        {
          title: "Payer Objection Handling Workshop",
          type: "Workshop",
          dur: "35 min",
          match: "High",
          reason:
            "Quiz revealed gaps in formulary and access strategy messaging",
        },
        {
          title: "Acknowledge → Bridge → Seed Framework",
          type: "AI Tutor Session",
          dur: "~15 min",
          match: "High",
          reason:
            "Practice the competitive messaging framework with real-time AI coaching",
        },
        {
          title: "Real-World Evidence: Building the Value Story",
          type: "Course",
          dur: "22 min",
          match: "Medium",
          reason:
            "Strengthen your RWE fluency for payer and health system conversations",
        },
      ],
    },
    {
      id: "objection",
      name: "Objection Handling",
      score: 65,
      trend: "+3",
      color: T.amber,
      desc: "Effectiveness in addressing HCP concerns, payer objections, and clinical pushback.",
      subs: [
        { name: "HCP Clinical Objections", score: 72, src: "Echo", note: null },
        {
          name: "Payer / Access Objections",
          score: 45,
          src: "Echo",
          note: "Gap flagged — remediation pending",
        },
        {
          name: "Competitive Objections",
          score: 68,
          src: "AI Tutor",
          note: null,
        },
        {
          name: "Patient Compliance Concerns",
          score: 74,
          src: "Course",
          note: null,
        },
      ],
      quiz: [
        {
          q: "An HCP says: \"My patients can't afford GLP-1s and most insurers won't cover them.\" What's the most effective response?",
          opts: [
            {
              id: "A",
              t: "Acknowledge the cost concern, then provide specific information on patient assistance programs, co-pay cards, and prior authorization support services",
              ok: true,
            },
            {
              id: "B",
              t: "Explain that the long-term cost savings outweigh the short-term expense",
              ok: false,
            },
            {
              id: "C",
              t: "Suggest the patient switch to a cheaper medication class instead",
              ok: false,
            },
            {
              id: "D",
              t: "Tell the HCP that most insurers do cover it and they should check again",
              ok: false,
            },
          ],
          correct: "A",
          expl: "Cost objections require immediate practical solutions, not economic arguments. Lead with specific support resources, then layer in the value narrative.",
        },
        {
          q: "A cardiologist says: \"I don't prescribe diabetes drugs — that's the endocrinologist's job.\" How do you handle this?",
          opts: [
            {
              id: "A",
              t: "Agree and ask for a referral to their endocrinology colleagues",
              ok: false,
            },
            {
              id: "B",
              t: "Reframe semaglutide as a cardioprotective therapy with SELECT data, positioning it in their clinical wheelhouse as a CV risk reduction tool",
              ok: true,
            },
            {
              id: "C",
              t: "Explain the full mechanism of action to educate them on diabetes management",
              ok: false,
            },
            {
              id: "D",
              t: "Leave behind clinical literature and follow up next quarter",
              ok: false,
            },
          ],
          correct: "B",
          expl: "Reframing is key. You're not asking a cardiologist to manage diabetes — you're presenting a CV risk reduction tool supported by outcomes data they already value.",
        },
        {
          q: "An HCP objects: \"I've seen too many GI side effects with GLP-1s. My patients can't tolerate them.\" Best approach?",
          opts: [
            {
              id: "A",
              t: "Minimize the side effects by saying most patients tolerate it well",
              ok: false,
            },
            {
              id: "B",
              t: "Validate the concern, then discuss the slow-titration protocol that reduces GI events, and share data showing most GI effects are transient and mild",
              ok: true,
            },
            {
              id: "C",
              t: "Suggest an alternative medication without GI side effects",
              ok: false,
            },
            {
              id: "D",
              t: "Show them the overall adverse event data from pivotal trials",
              ok: false,
            },
          ],
          correct: "B",
          expl: "Validating before problem-solving builds trust. The slow-titration approach (start low, go slow) significantly reduces GI side effects, and most resolve within weeks of continued therapy.",
        },
        {
          q: 'A payer says: "We already have two GLP-1s on formulary. There\'s no room for another." Your best strategy?',
          opts: [
            {
              id: "A",
              t: "Accept the decision and ask when the next formulary review cycle opens",
              ok: false,
            },
            {
              id: "B",
              t: "Argue that your product is clinically superior to both existing options",
              ok: false,
            },
            {
              id: "C",
              t: "Present differentiated value: unique CV data, real-world adherence advantages, and a total cost-of-care analysis that shows downstream savings",
              ok: true,
            },
            {
              id: "D",
              t: "Offer the largest rebate possible to secure formulary access",
              ok: false,
            },
          ],
          correct: "C",
          expl: "\"No room\" means you haven't differentiated enough. Formulary decisions aren't just clinical — present unique value across clinical, economic, and real-world dimensions that the existing options don't cover.",
        },
        {
          q: "During a group presentation, an influential HCP publicly challenges your data. How should you respond?",
          opts: [
            {
              id: "A",
              t: "Firmly defend every data point to establish authority",
              ok: false,
            },
            {
              id: "B",
              t: "Acknowledge their expertise, ask a clarifying question, address the specific concern with data, and offer to follow up with additional resources",
              ok: true,
            },
            {
              id: "C",
              t: "Redirect to a different topic to avoid conflict",
              ok: false,
            },
            {
              id: "D",
              t: "Defer entirely to their clinical judgment",
              ok: false,
            },
          ],
          correct: "B",
          expl: "In public settings, managing the relationship is as important as the data. Acknowledge expertise (respect), clarify (understand), address (respond with data), and offer follow-up (sustain the relationship).",
        },
      ],
      recs: [
        {
          title: "Objection Handling: Payer Conversations",
          type: "Workshop",
          dur: "35 min",
          match: "High",
          reason:
            "Your weakest sub-competency is payer objection handling at 45%",
        },
        {
          title: "AI Tutor: Simulated HCP Objection Practice",
          type: "AI Tutor Session",
          dur: "~15 min",
          match: "High",
          reason: "Practice live objection handling with adaptive AI feedback",
        },
        {
          title: "Clinical Storytelling for Difficult Conversations",
          type: "Course",
          dur: "22 min",
          match: "Medium",
          reason: "Build confidence framing clinical data under pressure",
        },
      ],
    },
    {
      id: "selling",
      name: "Selling Skills",
      score: 74,
      trend: "+2",
      color: T.blue,
      desc: "Core sales execution capabilities: opening, probing, presenting, closing.",
      subs: [
        {
          name: "Needs Assessment / Probing",
          score: 82,
          src: "Echo",
          note: null,
        },
        {
          name: "Clinical Storytelling",
          score: 68,
          src: "AI Module",
          note: "Improving",
        },
        { name: "Closing & Commitment", score: 71, src: "Echo", note: null },
        { name: "Call Planning & Prep", score: 76, src: "Course", note: null },
      ],
      quiz: [
        {
          q: "You have 3 minutes with a busy HCP between patients. What's the most effective opening?",
          opts: [
            {
              id: "A",
              t: "Ask about their patient population and what challenges they're facing with current T2D management, then tailor your message to their response",
              ok: true,
            },
            {
              id: "B",
              t: "Immediately present the top 3 clinical data points for your product",
              ok: false,
            },
            {
              id: "C",
              t: "Start with a personal anecdote to build rapport",
              ok: false,
            },
            {
              id: "D",
              t: "Ask if they've heard about your product's latest indication approval",
              ok: false,
            },
          ],
          correct: "A",
          expl: "Needs-based openings outperform product-first openings in short interactions. A targeted question gets the HCP talking about their challenges, allowing you to align your message to their specific needs.",
        },
        {
          q: "Which closing technique is most effective after presenting clinical data to an HCP who seems interested but uncommitted?",
          opts: [
            {
              id: "A",
              t: 'Ask directly: "Will you prescribe Ozempic for your next appropriate patient?"',
              ok: false,
            },
            {
              id: "B",
              t: "Summarize the key value points, connect them to a specific patient the HCP mentioned, and ask about next steps for that patient",
              ok: true,
            },
            {
              id: "C",
              t: "Offer to leave samples and follow up next month",
              ok: false,
            },
            {
              id: "D",
              t: "Present additional data until they make a commitment",
              ok: false,
            },
          ],
          correct: "B",
          expl: 'Connecting value to a specific patient scenario makes the commitment concrete and actionable. Abstract asks ("will you prescribe?") are easy to deflect. Patient-specific closes drive real behavior change.',
        },
        {
          q: "You notice an HCP's body language becoming disengaged during your presentation. What's the best response?",
          opts: [
            {
              id: "A",
              t: "Speed up to cover all your key points before they leave",
              ok: false,
            },
            {
              id: "B",
              t: "Pause, acknowledge their time is valuable, and ask what's most relevant to their practice right now",
              ok: true,
            },
            {
              id: "C",
              t: "Switch to a different product to recapture interest",
              ok: false,
            },
            {
              id: "D",
              t: "Continue as planned — they may re-engage",
              ok: false,
            },
          ],
          correct: "B",
          expl: "Reading and responding to non-verbal cues is a high-value selling skill. Pausing and redirecting shows respect for the HCP's time and often re-engages them in a more focused conversation.",
        },
        {
          q: 'An HCP says "send me some literature" at the end of your call. How should you interpret and respond?',
          opts: [
            {
              id: "A",
              t: "Great — send everything you have and follow up in two weeks",
              ok: false,
            },
            {
              id: "B",
              t: "Recognize this may be a polite dismissal, probe for specific interest areas, offer to bring one targeted resource at next visit, and confirm a follow-up date",
              ok: true,
            },
            {
              id: "C",
              t: "Take it at face value and mail a complete product kit",
              ok: false,
            },
            {
              id: "D",
              t: "Push for a stronger commitment before agreeing to send literature",
              ok: false,
            },
          ],
          correct: "B",
          expl: '"Send me literature" is often a soft close. Probing for specifics differentiates genuine interest from a polite brush-off, and committing to a targeted follow-up maintains momentum.',
        },
        {
          q: "How should you structure a 15-minute product presentation to maximize impact?",
          opts: [
            {
              id: "A",
              t: "5 min clinical data, 5 min competitive comparison, 5 min Q&A",
              ok: false,
            },
            {
              id: "B",
              t: "2 min needs assessment, 8 min tailored clinical narrative based on HCP's stated needs, 3 min patient case discussion, 2 min close with specific next step",
              ok: true,
            },
            {
              id: "C",
              t: "15 min comprehensive review of all clinical trial data",
              ok: false,
            },
            {
              id: "D",
              t: "7 min relationship building, 5 min product overview, 3 min close",
              ok: false,
            },
          ],
          correct: "B",
          expl: "The most effective presentations are front-loaded with needs assessment so the clinical narrative is tailored, not generic. Ending with a patient case and concrete next step converts interest into action.",
        },
      ],
      recs: [
        {
          title: "Clinical Storytelling for Cardiologists",
          type: "Course",
          dur: "22 min",
          match: "High",
          reason:
            "Your clinical storytelling sub-competency is at 68% — this directly builds that skill",
        },
        {
          title: "AI Tutor: Closing Technique Practice",
          type: "AI Tutor Session",
          dur: "~15 min",
          match: "Medium",
          reason: "Strengthen your closing from 71% with adaptive simulations",
        },
        {
          title: "Call Planning & Territory Strategy",
          type: "Course",
          dur: "28 min",
          match: "Medium",
          reason:
            "Optimize pre-call preparation to improve overall selling efficiency",
        },
      ],
    },
    {
      id: "compliance",
      name: "Regulatory Compliance",
      score: 91,
      trend: "+1",
      color: T.emerald,
      desc: "Adherence to on-label communication, adverse event reporting, and industry regulations.",
      subs: [
        {
          name: "On-Label Messaging",
          score: 94,
          src: "Compliance Module",
          note: null,
        },
        {
          name: "Adverse Event Reporting",
          score: 90,
          src: "Compliance Module",
          note: null,
        },
        { name: "Fair Balance", score: 88, src: "Echo", note: null },
        { name: "Transparency & Ethics", score: 92, src: "Course", note: null },
      ],
      quiz: [
        {
          q: "An HCP asks you about an off-label use of semaglutide they read about in a journal. What is the compliant response?",
          opts: [
            {
              id: "A",
              t: "Discuss the off-label data since the HCP brought it up first (reactive request)",
              ok: false,
            },
            {
              id: "B",
              t: "Acknowledge their interest, explain you can only discuss FDA-approved indications, and offer to connect them with Medical Affairs for unsolicited medical inquiries",
              ok: true,
            },
            {
              id: "C",
              t: "Share the journal article from your iPad since it's third-party published data",
              ok: false,
            },
            {
              id: "D",
              t: "Tell them you'll look into it and discuss next visit",
              ok: false,
            },
          ],
          correct: "B",
          expl: "Even when an HCP initiates the conversation, field reps must stay on-label. The compliant path is to redirect to Medical Affairs for off-label inquiries — they have a process for handling unsolicited requests.",
        },
        {
          q: "You hear a colleague at a dinner event making efficacy claims without mentioning safety information. What should you do?",
          opts: [
            {
              id: "A",
              t: "Nothing — they're responsible for their own compliance",
              ok: false,
            },
            {
              id: "B",
              t: "Privately remind them of the requirement for fair balance and offer to help them frame the message correctly",
              ok: true,
            },
            {
              id: "C",
              t: "Report them to compliance immediately without saying anything to them first",
              ok: false,
            },
            {
              id: "D",
              t: "Jump into the conversation to add the safety information yourself",
              ok: false,
            },
          ],
          correct: "B",
          expl: "Fair balance is everyone's responsibility. The best first step is peer-to-peer correction. Escalation to compliance is appropriate if the behavior continues, but the collegial approach preserves the relationship and usually resolves the issue.",
        },
        {
          q: "During a presentation, you accidentally overstate a clinical claim. What's the appropriate immediate action?",
          opts: [
            {
              id: "A",
              t: "Correct yourself immediately, provide the accurate data, and report the incident to your compliance team",
              ok: true,
            },
            {
              id: "B",
              t: "Continue the presentation and correct it next visit",
              ok: false,
            },
            { id: "C", t: "Hope nobody noticed and move on", ok: false },
            {
              id: "D",
              t: "Stop the presentation entirely and apologize profusely",
              ok: false,
            },
          ],
          correct: "A",
          expl: "Immediate self-correction demonstrates integrity and limits potential regulatory exposure. Reporting to compliance is required — they'll assess whether additional corrective action is needed.",
        },
        {
          q: "Which of the following constitutes a reportable adverse event?",
          opts: [
            {
              id: "A",
              t: "Only serious, life-threatening events requiring hospitalization",
              ok: false,
            },
            {
              id: "B",
              t: "Any undesirable medical occurrence in a patient using the product, regardless of causality or severity, that comes to your knowledge",
              ok: true,
            },
            {
              id: "C",
              t: "Only events that the HCP specifically attributes to your product",
              ok: false,
            },
            {
              id: "D",
              t: "Only events that are listed in the product's prescribing information",
              ok: false,
            },
          ],
          correct: "B",
          expl: "The regulatory standard is broad: ANY adverse event you become aware of must be reported within 24 hours, regardless of severity, expectedness, or whether the HCP believes it's drug-related.",
        },
        {
          q: 'An HCP says: "I use semaglutide off-label for my PCOS patients with great results. You should tell other doctors about this." How do you respond?',
          opts: [
            {
              id: "A",
              t: "Thank them for sharing, agree it's promising, but explain you cannot promote off-label use; offer to connect them with Medical Affairs if they'd like to share their clinical experience formally",
              ok: true,
            },
            {
              id: "B",
              t: "Agree to share their experience with other HCPs since it's their clinical opinion, not yours",
              ok: false,
            },
            {
              id: "C",
              t: "Ask for more details so you can share anonymous case studies",
              ok: false,
            },
            {
              id: "D",
              t: "Tell them off-label use is dangerous and they should stop",
              ok: false,
            },
          ],
          correct: "A",
          expl: "You must never facilitate off-label promotion, even when initiated by an HCP. The correct path is to redirect to Medical Affairs, who can handle HCP-to-HCP knowledge sharing through compliant channels.",
        },
      ],
      recs: [
        {
          title: "Compliance Essentials: Off-Label Communication",
          type: "Compliance Module",
          dur: "20 min",
          match: "Medium",
          reason:
            "Reinforce boundaries around off-label inquiries — always a high-stakes area",
        },
        {
          title: "Adverse Event Reporting: Annual Refresher",
          type: "Compliance Module",
          dur: "15 min",
          match: "Low",
          reason:
            "Your AE reporting score is strong at 90% — quick refresher to maintain excellence",
        },
      ],
    },
    {
      id: "territory",
      name: "Territory & Account Management",
      score: 70,
      trend: "+5",
      color: T.blue,
      desc: "Strategic planning, account prioritization, and effective territory coverage.",
      subs: [
        {
          name: "Account Prioritization",
          score: 75,
          src: "Analytics",
          note: null,
        },
        { name: "Pre-Call Planning", score: 72, src: "Course", note: null },
        {
          name: "KOL Engagement Strategy",
          score: 60,
          src: "AI Module",
          note: "Growth area",
        },
        { name: "Omnichannel Execution", score: 68, src: "Course", note: null },
      ],
      quiz: [
        {
          q: "You have 40 target HCPs in your territory but only capacity for 25 high-touch engagements per quarter. How should you prioritize?",
          opts: [
            {
              id: "A",
              t: "Prioritize by prescribing volume — see the highest prescribers most often",
              ok: false,
            },
            {
              id: "B",
              t: "Segment by a combination of prescribing potential, competitive share opportunity, and responsiveness to engagement, then tier your call plan accordingly",
              ok: true,
            },
            {
              id: "C",
              t: "Rotate equally through all 40 HCPs to ensure fair coverage",
              ok: false,
            },
            {
              id: "D",
              t: "Focus exclusively on the 10 HCPs who have the best relationships with you",
              ok: false,
            },
          ],
          correct: "B",
          expl: "Multi-dimensional segmentation outperforms volume-only prioritization. A physician with moderate current volume but high potential and low competitive loyalty may be a better investment than a high-volume loyalist.",
        },
        {
          q: "What is the most effective approach to engaging a Key Opinion Leader (KOL) who currently champions a competitor product?",
          opts: [
            {
              id: "A",
              t: "Present data showing your product is superior to change their mind",
              ok: false,
            },
            {
              id: "B",
              t: "Build a long-term relationship by offering speaker bureau opportunities",
              ok: false,
            },
            {
              id: "C",
              t: "Understand their clinical perspective, acknowledge the competitor's strengths, and introduce your product's differentiated data over multiple interactions as a complement to their current practice",
              ok: true,
            },
            {
              id: "D",
              t: "Focus your efforts on non-KOL prescribers instead",
              ok: false,
            },
          ],
          correct: "C",
          expl: "KOL conversion is a marathon, not a sprint. Understanding their clinical perspective first, then introducing differentiated value over time, is more effective than confrontational data presentations.",
        },
        {
          q: "Your territory data shows that 60% of your Ozempic prescriptions come from 15% of your HCPs. What strategic action is most valuable?",
          opts: [
            {
              id: "A",
              t: "Increase call frequency to your top 15% to protect and grow their volume",
              ok: false,
            },
            {
              id: "B",
              t: "Analyze the remaining 85% to identify under-penetrated high-potential accounts, while maintaining regular touchpoints with top prescribers",
              ok: true,
            },
            {
              id: "C",
              t: "Distribute your time equally across all HCPs",
              ok: false,
            },
            {
              id: "D",
              t: "Focus only on new HCPs not currently prescribing",
              ok: false,
            },
          ],
          correct: "B",
          expl: "The 80/20 rule is a starting point, not a strategy. While protecting your top prescribers, the biggest growth often comes from identifying and converting mid-tier HCPs with untapped potential.",
        },
        {
          q: "How should you leverage omnichannel touchpoints between in-person visits?",
          opts: [
            {
              id: "A",
              t: "Send the same clinical message across email, phone, and digital to maximize frequency",
              ok: false,
            },
            {
              id: "B",
              t: "Coordinate channel-specific content that builds a progressive narrative — use digital for data awareness, email for clinical resources, and save complex discussions for in-person visits",
              ok: true,
            },
            {
              id: "C",
              t: "Use digital channels only for appointment reminders and scheduling",
              ok: false,
            },
            {
              id: "D",
              t: "Avoid digital channels as they feel impersonal",
              ok: false,
            },
          ],
          correct: "B",
          expl: "Omnichannel is about orchestration, not repetition. Each channel should play a distinct role in the narrative arc, with in-person visits reserved for the highest-value interactions.",
        },
        {
          q: "Before an important HCP visit, what pre-call planning elements have the highest impact on call effectiveness?",
          opts: [
            {
              id: "A",
              t: "Memorizing the latest clinical data points to present",
              ok: false,
            },
            {
              id: "B",
              t: "Reviewing the HCP's prescribing history, last call notes, recent publications, and preparing a tailored objective with a specific ask",
              ok: true,
            },
            {
              id: "C",
              t: "Preparing a standard detail aid and samples",
              ok: false,
            },
            {
              id: "D",
              t: "Checking the HCP's availability and preferred meeting time",
              ok: false,
            },
          ],
          correct: "B",
          expl: "The best pre-call plans are HCP-specific: reviewing their history tells you what was discussed, their publications reveal what they care about, and a tailored objective ensures every call has purpose and a measurable next step.",
        },
      ],
      recs: [
        {
          title: "KOL Engagement Strategy: Building Influence",
          type: "AI Module",
          dur: "20 min",
          match: "High",
          reason:
            "Your KOL engagement score is 60% — the lowest in this competency area",
        },
        {
          title: "Omnichannel Selling: Coordinating Digital + In-Person",
          type: "Course",
          dur: "25 min",
          match: "High",
          reason:
            "Build omnichannel execution skills from 68% to above benchmark",
        },
        {
          title: "Territory Analytics: Data-Driven Call Planning",
          type: "AI Module",
          dur: "18 min",
          match: "Medium",
          reason: "Leverage analytics to improve account prioritization",
        },
      ],
    },
  ];

  const avgScore = Math.round(
    competencies.reduce((a, c) => a + c.score, 0) / competencies.length,
  );

  // Quiz logic
  const startQuiz = (compId) => {
    setQuizComp(compId);
    setQuizStep(0);
    setQuizAnswers([]);
    setSelectedQuizA(null);
    setShowQuizResult(false);
  };

  const handleQuizAnswer = (id) => {
    setSelectedQuizA(id);
    setTimeout(() => setShowQuizResult(true), 300);
  };

  const nextQuestion = () => {
    const comp = competencies.find((c) => c.id === quizComp);
    const currentQ = comp.quiz[quizStep];
    const wasCorrect = selectedQuizA === currentQ.correct;
    const newAnswers = [
      ...quizAnswers,
      { qIdx: quizStep, selected: selectedQuizA, correct: wasCorrect },
    ];
    setQuizAnswers(newAnswers);
    setSelectedQuizA(null);
    setShowQuizResult(false);
    if (quizStep < 4) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep(5); // results screen
    }
  };

  const closeQuiz = () => {
    setQuizComp(null);
    setQuizStep(0);
    setQuizAnswers([]);
    setSelectedQuizA(null);
    setShowQuizResult(false);
  };

  // Quiz overlay
  const activeComp = quizComp
    ? competencies.find((c) => c.id === quizComp)
    : null;

  if (quizComp && activeComp) {
    const totalCorrect = quizAnswers.filter((a) => a.correct).length;
    const quizScore = Math.round((totalCorrect / 5) * 100);

    // Results screen
    if (quizStep === 5) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            animation: "fadeUp .3s ease",
          }}
        >
          {/* Results Header */}
          <div
            style={{
              background: `linear-gradient(135deg,${T.card} 0%,${quizScore >= 80 ? "#0F1A14" : quizScore >= 60 ? "#1A1710" : "#1A1012"} 100%)`,
              borderRadius: 18,
              padding: "28px 28px",
              border: `1px solid ${quizScore >= 80 ? T.emerald : quizScore >= 60 ? T.amber : T.rose}15`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg,${quizScore >= 80 ? T.emerald : quizScore >= 60 ? T.amber : T.rose},transparent)`,
              }}
            />
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <Ring
                value={quizScore}
                size={90}
                stroke={6}
                color={
                  quizScore >= 80
                    ? T.emerald
                    : quizScore >= 60
                      ? T.amber
                      : T.rose
                }
              >
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color:
                      quizScore >= 80
                        ? T.emerald
                        : quizScore >= 60
                          ? T.amber
                          : T.rose,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {quizScore}%
                </span>
              </Ring>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color:
                      quizScore >= 80
                        ? T.emerald
                        : quizScore >= 60
                          ? T.amber
                          : T.rose,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 4,
                  }}
                >
                  {quizScore >= 80
                    ? "Strong Performance"
                    : quizScore >= 60
                      ? "Developing"
                      : "Needs Improvement"}
                </div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: T.text,
                    margin: "0 0 6px",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {activeComp.name} Quiz Complete
                </h2>
                <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
                  You answered {totalCorrect} of 5 questions correctly.{" "}
                  {quizScore >= 80
                    ? "Excellent depth in this competency area."
                    : quizScore >= 60
                      ? "Some areas to strengthen — see recommendations below."
                      : "AI Tutor has identified targeted content to help close the gaps."}
                </p>
              </div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
                marginBottom: 10,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              Question Breakdown
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {quizAnswers.map((a, i) => {
                const q = activeComp.quiz[i];
                return (
                  <div
                    key={i}
                    style={{
                      background: T.card,
                      borderRadius: 11,
                      padding: "12px 16px",
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        flexShrink: 0,
                        background: a.correct ? T.emeraldDim : T.roseDim,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: a.correct ? T.emerald : T.rose,
                      }}
                    >
                      {a.correct ? "" : ""}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: 12.5,
                        color: T.text,
                        lineHeight: 1.45,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {q.q}
                    </div>
                    <Badge color={a.correct ? T.emerald : T.rose} size="xs">
                      {a.correct ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI-Recommended Content */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 14 }}>⚡</span>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: T.text,
                  fontFamily: "'Outfit',sans-serif",
                  margin: 0,
                }}
              >
                AI-Recommended Development Content
              </h3>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: T.textSoft,
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              Based on your quiz performance, the AI has identified the
              following content to strengthen your{" "}
              {activeComp.name.toLowerCase()} competency.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activeComp.recs.map((r, i) => {
                const matchColor =
                  r.match === "High"
                    ? T.rose
                    : r.match === "Medium"
                      ? T.amber
                      : T.emerald;
                return (
                  <div
                    key={i}
                    className="hlift"
                    style={{
                      background: T.card,
                      borderRadius: 13,
                      padding: "16px 20px",
                      border: `1px solid ${T.border}`,
                      cursor: "pointer",
                      animation: `slideR .3s ease ${i * 0.06}s both`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          flexShrink: 0,
                          background: `${activeComp.color}10`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                        }}
                      >
                        {r.type === "Course"
                          ? "📖"
                          : r.type === "AI Module"
                            ? "🧠"
                            : r.type.includes("AI Tutor")
                              ? "⚡"
                              : r.type === "Workshop"
                                ? "🎯"
                                : "📋"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: T.text,
                            marginBottom: 4,
                          }}
                        >
                          {r.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                            flexWrap: "wrap",
                            marginBottom: 6,
                          }}
                        >
                          <Badge color={T.violet} size="xs">
                            {r.type}
                          </Badge>
                          <span style={{ fontSize: 10.5, color: T.textMuted }}>
                            {r.dur}
                          </span>
                          <Badge color={matchColor} size="xs">
                            Relevance: {r.match}
                          </Badge>
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: T.textMuted,
                            lineHeight: 1.5,
                            fontStyle: "italic",
                          }}
                        >
                          {r.reason}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "7px 16px",
                          borderRadius: 8,
                          border: `1px solid ${activeComp.color}25`,
                          background: `${activeComp.color}10`,
                          color: activeComp.color,
                          fontSize: 11.5,
                          fontWeight: 600,
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Start
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={closeQuiz}
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: T.card,
              color: T.textSoft,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              alignSelf: "flex-start",
            }}
          >
            ← Back to Competencies
          </button>
        </div>
      );
    }

    // Active quiz question
    const currentQ = activeComp.quiz[quizStep];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          animation: "fadeUp .3s ease",
        }}
      >
        {/* Quiz Header */}
        <div
          style={{
            background: T.card,
            borderRadius: 16,
            padding: "20px 24px",
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <button
            onClick={closeQuiz}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.cardRaised,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.textMuted,
              fontSize: 14,
            }}
          >
            ←
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {activeComp.name} — AI Quiz
            </div>
            <div style={{ fontSize: 11.5, color: T.textMuted }}>
              Question {quizStep + 1} of 5 · AI-generated adaptive assessment
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: i === quizStep ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    i < quizStep
                      ? quizAnswers[i]?.correct
                        ? T.emerald
                        : T.rose
                      : i === quizStep
                        ? activeComp.color
                        : T.border,
                  transition: "all .3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div
          style={{
            background: T.card,
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${T.borderLight}`,
            animation: "scaleIn .3s ease",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              background: `linear-gradient(135deg,${activeComp.color}08,${T.violet}05)`,
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14 }}>✎</span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: activeComp.color,
              }}
            >
              Adaptive Assessment
            </span>
            <Badge color={T.violet} size="xs">
              AI-Generated
            </Badge>
          </div>
          <div style={{ padding: "22px 24px" }}>
            <p
              style={{
                fontSize: 14,
                color: T.text,
                lineHeight: 1.65,
                margin: "0 0 20px",
              }}
            >
              {currentQ.q}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {currentQ.opts.map((o) => {
                const sel = selectedQuizA === o.id,
                  correct = o.ok,
                  show = showQuizResult;
                let bc = T.border,
                  bg = T.cardRaised;
                if (show && correct) {
                  bc = T.emerald;
                  bg = T.emeraldDim;
                } else if (show && sel && !correct) {
                  bc = T.rose;
                  bg = T.roseDim;
                } else if (sel && !show) {
                  bc = T.blue;
                  bg = T.blueGlow2;
                }
                return (
                  <button
                    key={o.id}
                    onClick={() => !showQuizResult && handleQuizAnswer(o.id)}
                    disabled={showQuizResult}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      padding: "13px 16px",
                      borderRadius: 10,
                      border: `1.5px solid ${bc}`,
                      background: bg,
                      cursor: showQuizResult ? "default" : "pointer",
                      transition: "all .15s",
                      textAlign: "left",
                      width: "100%",
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        flexShrink: 0,
                        background:
                          show && correct
                            ? T.emerald
                            : show && sel
                              ? T.rose
                              : sel
                                ? T.blue
                                : T.surface,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: sel || (show && correct) ? T.white : T.textMuted,
                        transition: "all .2s",
                      }}
                    >
                      {show && correct ? "✓" : show && sel ? "✗" : o.id}
                    </span>
                    <span
                      style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}
                    >
                      {o.t}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showQuizResult && (
              <div
                style={{
                  marginTop: 16,
                  padding: "14px 18px",
                  background:
                    selectedQuizA === currentQ.correct
                      ? T.emeraldDim
                      : T.roseDim,
                  borderRadius: 10,
                  animation: "fadeUp .3s ease",
                  borderLeft: `3px solid ${selectedQuizA === currentQ.correct ? T.emerald : T.rose}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color:
                      selectedQuizA === currentQ.correct ? T.emerald : T.rose,
                    marginBottom: 6,
                  }}
                >
                  {selectedQuizA === currentQ.correct
                    ? "✓ Correct!"
                    : "✗ Incorrect"}
                </div>
                <div
                  style={{ fontSize: 12.5, color: T.textSoft, lineHeight: 1.6 }}
                >
                  {currentQ.expl}
                </div>
              </div>
            )}

            {/* Next button */}
            {showQuizResult && (
              <button
                onClick={nextQuestion}
                style={{
                  marginTop: 16,
                  padding: "11px 28px",
                  borderRadius: 10,
                  border: "none",
                  background: activeComp.color,
                  color: T.white,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                  boxShadow: `0 4px 14px ${activeComp.color}25`,
                }}
              >
                {quizStep < 4
                  ? "Next Question →"
                  : "See Results & Recommendations"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default competencies list view (unchanged structure, added quiz button)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      {/* Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <div
          style={{
            background: T.card,
            borderRadius: 14,
            padding: "20px",
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Ring
            value={avgScore}
            size={60}
            stroke={5}
            color={avgScore >= 70 ? T.emerald : T.amber}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: avgScore >= 70 ? T.emerald : T.amber,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {avgScore}
            </span>
          </Ring>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: T.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 3,
              }}
            >
              Overall Score
            </div>
            <div style={{ fontSize: 12.5, color: T.emerald, fontWeight: 500 }}>
              +5 pts this quarter
            </div>
          </div>
        </div>
        {[
          { l: "Competency Areas", v: "6", s: "Tracked", c: T.blue },
          { l: "Sub-Competencies", v: "24", s: "Assessed", c: T.violet },
          { l: "Gaps Identified", v: "3", s: "Active remediation", c: T.rose },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "18px 20px",
              border: `1px solid ${T.border}`,
              animation: `fadeUp .3s ease ${i * 0.04}s both`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: T.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 6,
              }}
            >
              {m.l}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: T.text,
                fontFamily: "'Outfit',sans-serif",
                lineHeight: 1,
              }}
            >
              {m.v}
            </div>
            <div
              style={{
                fontSize: 11,
                color: m.c,
                fontWeight: 500,
                marginTop: 5,
              }}
            >
              {m.s}
            </div>
          </div>
        ))}
      </div>

      {/* Competency Cards */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Competency Framework
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {competencies.map((c, i) => {
            const open = expanded === c.id;
            return (
              <div
                key={c.id}
                style={{
                  background: T.card,
                  borderRadius: 13,
                  overflow: "hidden",
                  border: `1px solid ${open ? T.borderLight : T.border}`,
                  animation: `fadeUp .3s ease ${i * 0.04}s both`,
                  transition: "border-color .2s",
                }}
              >
                {/* Header */}
                <div
                  onClick={() => setExpanded(open ? null : c.id)}
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                  }}
                >
                  <Ring value={c.score} size={44} stroke={4} color={c.color}>
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: c.color }}
                    >
                      {c.score}
                    </span>
                  </Ring>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{ fontSize: 14, fontWeight: 600, color: T.text }}
                      >
                        {c.name}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: T.emerald,
                          fontWeight: 500,
                        }}
                      >
                        {c.trend} pts
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}
                    >
                      {c.desc}
                    </div>
                  </div>
                  <div style={{ width: 100, flexShrink: 0 }}>
                    <Bar value={c.score} color={c.color} h={5} />
                  </div>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={T.textMuted}
                    strokeWidth="2.5"
                    style={{
                      transform: open ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform .2s",
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded: Sub-competencies + Quiz Launch */}
                {open && (
                  <div
                    style={{
                      padding: "0 20px 16px",
                      animation: "fadeIn .2s ease",
                    }}
                  >
                    <div
                      style={{
                        background: T.cardRaised,
                        borderRadius: 10,
                        overflow: "hidden",
                        border: `1px solid ${T.border}`,
                      }}
                    >
                      {/* Sub header */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr .6fr .8fr 1fr",
                          padding: "8px 14px",
                          gap: 8,
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        {["Sub-Competency", "Score", "Source", "Notes"].map(
                          (h) => (
                            <div
                              key={h}
                              style={{
                                fontSize: 9.5,
                                fontWeight: 600,
                                color: T.textFaint,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              {h}
                            </div>
                          ),
                        )}
                      </div>
                      {c.subs.map((s, j) => (
                        <div
                          key={j}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "2fr .6fr .8fr 1fr",
                            padding: "10px 14px",
                            gap: 8,
                            alignItems: "center",
                            borderBottom:
                              j < c.subs.length - 1
                                ? `1px solid ${T.border}`
                                : "none",
                            background:
                              s.score < 50 ? `${T.rose}04` : "transparent",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: T.text,
                            }}
                          >
                            {s.name}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color:
                                  s.score >= 75
                                    ? T.emerald
                                    : s.score >= 50
                                      ? T.amber
                                      : T.rose,
                                fontFamily: "'Outfit',sans-serif",
                              }}
                            >
                              {s.score}
                            </span>
                          </div>
                          <Badge color={T.textMuted} bg={T.glass} size="xs">
                            {s.src}
                          </Badge>
                          {s.note ? (
                            <span
                              style={{
                                fontSize: 10.5,
                                color: s.score < 50 ? T.rose : T.amber,
                                fontWeight: 500,
                              }}
                            >
                              {s.note}
                            </span>
                          ) : (
                            <span
                              style={{ color: T.textFaint, fontSize: 10.5 }}
                            >
                              —
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Scoring Rubric Info */}
                    <div
                      style={{
                        marginTop: 10,
                        background: T.cardRaised,
                        borderRadius: 9,
                        overflow: "hidden",
                        border: `1px solid ${T.border}`,
                      }}
                    >
                      <div
                        style={{
                          padding: "10px 14px",
                          borderBottom: `1px solid ${T.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: `${T.teal}04`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: T.teal,
                          }}
                        >
                          Scoring Scale — What Each Level Means
                        </span>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4,1fr)",
                          gap: 0,
                        }}
                      >
                        {[
                          {
                            level: "Expert",
                            range: "90-100%",
                            color: T.emerald,
                            desc: "Demonstrates mastery in live scenarios. Handles unexpected challenges with confidence.",
                          },
                          {
                            level: "Proficient",
                            range: "70-89%",
                            color: T.blue,
                            desc: "Solid understanding and consistent execution. Minor gaps in complex situations.",
                          },
                          {
                            level: "Developing",
                            range: "50-69%",
                            color: T.amber,
                            desc: "Basic competency present. Struggles under pressure or with nuanced scenarios.",
                          },
                          {
                            level: "Gap",
                            range: "<50%",
                            color: T.rose,
                            desc: "Critical improvement needed. Active remediation required before certification.",
                          },
                        ].map((r, ri) => (
                          <div
                            key={ri}
                            style={{
                              padding: "10px 12px",
                              borderRight:
                                ri < 3 ? `1px solid ${T.border}` : "none",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: r.color,
                                marginBottom: 2,
                              }}
                            >
                              {r.level}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: T.textMuted,
                                marginBottom: 4,
                              }}
                            >
                              {r.range}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: T.textFaint,
                                lineHeight: 1.4,
                              }}
                            >
                              {r.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quiz Launch Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startQuiz(c.id);
                      }}
                      className="hlift"
                      style={{
                        marginTop: 10,
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: 10,
                        border: `1px solid ${c.color}25`,
                        background: `${c.color}08`,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        cursor: "pointer",
                        fontFamily: "'Outfit',sans-serif",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          background: `linear-gradient(135deg,${c.color},${T.violet})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          color: T.white,
                          flexShrink: 0,
                        }}
                      >
                        ✎
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.text,
                          }}
                        >
                          Take AI Quiz — {c.name}
                        </div>
                        <div style={{ fontSize: 11, color: T.textMuted }}>
                          5 adaptive questions · AI-generated · Get personalized
                          content recommendations
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "7px 16px",
                          borderRadius: 8,
                          background: c.color,
                          color: T.white,
                          fontSize: 11.5,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        Start Quiz
                      </div>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Competency Gap Heatmap */}
      <div
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "20px 22px",
          border: `1px solid ${T.border}`,
          animation: "fadeUp .4s ease .3s both",
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.text,
            marginBottom: 14,
          }}
        >
          Competency Gap Heatmap
        </h3>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {competencies
            .flatMap((c) => c.subs)
            .sort((a, b) => a.score - b.score)
            .slice(0, 8)
            .map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  background:
                    s.score < 50
                      ? T.roseDim
                      : s.score < 65
                        ? T.amberDim
                        : T.emeraldDim,
                  border: `1px solid ${s.score < 50 ? T.rose + "20" : s.score < 65 ? T.amber + "20" : T.emerald + "20"}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color:
                      s.score < 50
                        ? T.rose
                        : s.score < 65
                          ? T.amber
                          : T.emerald,
                  }}
                >
                  {s.name}
                </div>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>
                  Score: {s.score}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// CONTENT LIBRARY
// ═══════════════════════════════════════════════
const LibraryView = () => {
  const [filter, setFilter] = useState("all");
  const [openContent, setOpenContent] = useState(null); // null or content id
  const [courseSection, setCourseSection] = useState(0);
  const [complianceStep, setComplianceStep] = useState(0);
  const [aiModuleStep, setAiModuleStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizRevealed, setQuizRevealed] = useState(false);

  const content = [
    {
      id: "glp1_moa",
      t: "GLP-1 Receptor Agonist MOA Deep Dive",
      type: "Course",
      ta: "Metabolic",
      dur: "25 min",
      r: 4.8,
      rec: true,
      viewable: true,
      gamified: true,
      xp: 150,
    },
    {
      id: "select_trial",
      t: "SELECT Trial Outcomes Summary",
      type: "AI Module",
      ta: "Metabolic",
      dur: "12 min",
      r: 4.9,
      rec: true,
      viewable: true,
      gamified: true,
      xp: 100,
    },
    {
      id: "dupixent_rinvoq",
      t: "Competitive Positioning: Dupixent vs Rinvoq",
      type: "AI Module",
      ta: "Dermatology",
      dur: "15 min",
      r: 4.8,
      rec: true,
      viewable: true,
      gamified: false,
      xp: 80,
    },
    {
      id: "payer_obj",
      t: "Objection Handling: Payer Conversations",
      type: "Workshop",
      ta: "Cross-TA",
      dur: "35 min",
      r: 4.5,
      rec: false,
      viewable: true,
      gamified: true,
      xp: 200,
    },
    {
      id: "immuno_2026",
      t: "Immunology Landscape 2026",
      type: "Course",
      ta: "Immunology",
      dur: "40 min",
      r: 4.6,
      rec: false,
      viewable: true,
      gamified: false,
      xp: 120,
    },
    {
      id: "pcsk9",
      t: "PCSK9 Inhibitors in Cardiology",
      type: "Course",
      ta: "Cardiology",
      dur: "30 min",
      r: 4.7,
      rec: false,
      viewable: true,
      gamified: true,
      xp: 150,
    },
    {
      id: "onc_biomarker",
      t: "Oncology Biomarker Testing Primer",
      type: "AI Module",
      ta: "Oncology",
      dur: "18 min",
      r: 4.4,
      rec: false,
      viewable: true,
      gamified: false,
      xp: 80,
    },
    {
      id: "compliance_offlabel",
      t: "Compliance: Off-Label Communication",
      type: "Compliance",
      ta: "Cross-TA",
      dur: "20 min",
      r: 4.2,
      rec: false,
      viewable: true,
      gamified: false,
      xp: 60,
    },
  ];
  const tc = {
    Course: T.blue,
    "AI Module": T.violet,
    Workshop: T.teal,
    Compliance: T.amber,
  };
  const filters = [
    "all",
    "Recommended",
    "Course",
    "AI Module",
    "Workshop",
    "Compliance",
  ];
  const filtered =
    filter === "all"
      ? content
      : filter === "Recommended"
        ? content.filter((c) => c.rec)
        : content.filter((c) => c.type === filter);

  // ── COURSE VIEWER: GLP-1 MOA Deep Dive ──
  const courseSections = [
    {
      title: "Introduction: The Incretin System",
      content: [
        {
          type: "text",
          body: "The incretin system plays a central role in glucose homeostasis. When you eat, your gut releases two key hormones: **GLP-1 (glucagon-like peptide-1)** and **GIP (glucose-dependent insulinotropic polypeptide)**. Together, these hormones account for approximately 50-70% of the insulin response after a meal.",
        },
        {
          type: "text",
          body: "Understanding this system is foundational to positioning GLP-1 receptor agonists effectively with HCPs. Let's break down each component.",
        },
        {
          type: "diagram",
          title: "Incretin Effect Overview",
          items: [
            "Food intake triggers GLP-1 + GIP release from gut",
            "GLP-1 binds receptors on pancreatic beta cells",
            "Insulin secretion increases (glucose-dependent)",
            "Glucagon secretion decreases",
            "Gastric emptying slows → satiety increases",
            "Central appetite suppression via hypothalamus",
          ],
        },
        {
          type: "keypoint",
          body: "Critical HCP talking point: GLP-1 receptor agonists stimulate insulin secretion only when glucose is elevated. This glucose-dependent mechanism means significantly lower hypoglycemia risk compared to sulfonylureas or exogenous insulin.",
        },
      ],
    },
    {
      title: "Semaglutide: Mechanism of Action",
      content: [
        {
          type: "text",
          body: "**Semaglutide (Ozempic®)** is a selective GLP-1 receptor agonist with 94% structural homology to native human GLP-1. Key modifications include an amino acid substitution at position 8 and a C-18 fatty di-acid chain, which enables albumin binding and extends the half-life to approximately 7 days — allowing once-weekly dosing.",
        },
        {
          type: "diagram",
          title: "Semaglutide — Mechanism Pathways",
          items: [
            "Selective GLP-1 receptor agonism (single target)",
            "Glucose-dependent insulin secretion ↑",
            "Glucagon secretion ↓ (when glucose elevated)",
            "Gastric emptying delay → prolonged satiety",
            "Hypothalamic appetite suppression",
            "Reduced food reward signaling in brain",
          ],
        },
        {
          type: "text",
          body: "The result is a multi-pathway effect: improved glycemic control (A1C reduction ~1.5-1.8%), significant weight loss (typically 4-6 kg), and — uniquely — demonstrated cardiovascular benefit.",
        },
        {
          type: "keypoint",
          body: "For your HCP conversations: Semaglutide is NOT just a diabetes drug. The SELECT trial established it as a cardioprotective therapy. This reframing is critical when speaking to cardiologists.",
        },
      ],
    },
    {
      title: "Tirzepatide: The Dual Agonist",
      content: [
        {
          type: "text",
          body: "**Tirzepatide (Mounjaro®)** represents a different approach: it's a dual GIP and GLP-1 receptor agonist. This means it activates both incretin pathways simultaneously.",
        },
        {
          type: "diagram",
          title: "Dual vs Single Agonism",
          items: [
            "GLP-1 pathway: Same effects as semaglutide",
            "GIP pathway: Additional glucose-lowering via complementary mechanism",
            "GIP + GLP-1 synergy → stronger A1C reduction (~2.0-2.4%)",
            "Greater weight loss in clinical trials (up to 12-15 kg)",
            "BUT: Less CV outcomes data compared to semaglutide",
          ],
        },
        {
          type: "text",
          body: "The SURPASS trial program demonstrated tirzepatide's superior glycemic and weight outcomes. Head-to-head, tirzepatide shows approximately 0.5% greater A1C reduction than semaglutide at comparable doses.",
        },
        {
          type: "keypoint",
          body: "DO NOT dismiss tirzepatide's clinical data — it IS strong. Your competitive advantage is not in denying SURPASS results but in bridging to Ozempic's superior CV outcomes evidence. Acknowledge → Bridge → Seed.",
        },
      ],
    },
    {
      title: "Clinical Differentiation Framework",
      content: [
        {
          type: "text",
          body: "When positioning Ozempic against Mounjaro, use this evidence-based differentiation framework:",
        },
        {
          type: "diagram",
          title: "Ozempic Competitive Advantages",
          items: [
            "CV Outcomes: SELECT trial — 20% MACE reduction (tirzepatide lacks this data)",
            "Evidence Breadth: 10+ completed outcomes trials vs maturing tirzepatide dataset",
            "Real-World Data: 5+ years post-market experience",
            "Safety Profile: Longest track record in the GLP-1 class",
            "Dose Flexibility: 0.25/0.5/1.0/2.0 mg options",
          ],
        },
        {
          type: "diagram",
          title: "Where Tirzepatide Leads",
          items: [
            "Glycemic Control: ~0.5% greater A1C reduction",
            "Weight Loss: Superior weight outcomes in SURPASS",
            "Mechanism: Dual pathway may offer additional metabolic benefits",
            "Novelty: Newer agent with strong clinical interest",
          ],
        },
        {
          type: "keypoint",
          body: "Your strategy: Lead with Ozempic's strengths (CV evidence), acknowledge tirzepatide's strengths (glycemic control), and seed the long-term value of established cardiovascular protection. This is the Acknowledge → Bridge → Seed framework in action.",
        },
      ],
    },
    {
      title: "Knowledge Check",
      content: [
        {
          type: "quiz",
          question:
            'An endocrinologist says: "Tirzepatide gives my patients better A1C control. Why should I consider semaglutide?" What is the most evidence-based response?',
          options: [
            {
              id: "A",
              text: "Semaglutide is more affordable for most patients.",
              correct: false,
            },
            {
              id: "B",
              text: "Acknowledge the glycemic data, then bridge to semaglutide's unmatched CV outcomes evidence — the SELECT trial showed a 20% MACE reduction, data tirzepatide doesn't yet have.",
              correct: true,
            },
            {
              id: "C",
              text: "Semaglutide and tirzepatide have identical mechanisms, so it doesn't matter.",
              correct: false,
            },
            {
              id: "D",
              text: "Dismiss the SURPASS data as industry-funded and therefore unreliable.",
              correct: false,
            },
          ],
          explanation:
            "Option B demonstrates the Acknowledge → Bridge → Seed framework. Never dismiss valid competitive data (Option D) — it destroys your credibility. The CV outcomes story is Ozempic's strongest differentiator for physicians who manage patients with or at risk for cardiovascular disease.",
        },
      ],
    },
  ];

  // ── AI MODULE VIEWER: SELECT Trial Outcomes ──
  const aiModuleSections = [
    {
      title: "What is the SELECT Trial?",
      content: [
        {
          type: "ai_intro",
          body: "I've analyzed the SELECT trial data and prepared an interactive summary tailored to your competency gaps. This module focuses on the data points most relevant to your HCP conversations.",
        },
        {
          type: "text",
          body: "**SELECT** (Semaglutide Effects on Cardiovascular Outcomes in People with Overweight or Obesity) was a landmark cardiovascular outcomes trial. It enrolled **17,604 patients** aged ≥45 with established cardiovascular disease or ≥50 with cardiovascular disease plus obesity, but without diabetes.",
        },
        {
          type: "diagram",
          title: "SELECT Trial Design",
          items: [
            "Randomized, double-blind, placebo-controlled",
            "Semaglutide 2.4mg weekly vs placebo",
            "Median follow-up: 39.8 months (3.3 years)",
            "Primary endpoint: 3-point MACE (CV death, non-fatal MI, non-fatal stroke)",
            "Key secondary: Individual MACE components + all-cause mortality",
          ],
        },
        {
          type: "keypoint",
          body: "Why SELECT matters: It's the FIRST trial to show a GLP-1 RA reduces cardiovascular events in patients WITHOUT diabetes. This expands the clinical narrative beyond glycemic control.",
        },
      ],
    },
    {
      title: "Key Results — The Numbers That Matter",
      content: [
        {
          type: "ai_intro",
          body: "Based on your Echo feedback, I'm highlighting the specific endpoints you'll need for cardiologist conversations. These are the numbers that will build your clinical credibility.",
        },
        {
          type: "diagram",
          title: "SELECT Primary Results",
          items: [
            "Primary Endpoint (3-point MACE): 20% relative risk reduction (HR 0.80, 95% CI 0.72-0.90, p<0.001)",
            "CV Death: 15% reduction",
            "Non-fatal MI: 28% reduction",
            "Non-fatal Stroke: 7% reduction (not statistically significant)",
            "All-cause Mortality: 19% reduction (p=0.01)",
          ],
        },
        {
          type: "text",
          body: "The **Number Needed to Treat (NNT)** over 3.3 years was approximately **67** — meaning for every 67 patients treated with semaglutide, one major cardiovascular event was prevented.",
        },
        {
          type: "keypoint",
          body: 'Your key talking point for cardiologists: "The SELECT trial demonstrated that semaglutide reduces major adverse cardiovascular events by 20% — independent of glycemic control. This is cardioprotection that your patients get as a built-in benefit of the therapy."',
        },
      ],
    },
    {
      title: "Competitive Context",
      content: [
        {
          type: "ai_intro",
          body: "This is where your gap profile comes in. Understanding how SELECT positions against the competitive landscape is critical for your Competitive Positioning competency.",
        },
        {
          type: "text",
          body: "**Tirzepatide's CV Story:**\nThe SURPASS-CVOT trial is ongoing. Preliminary data suggests potential CV benefit but full results are not yet available. This means semaglutide currently has the only completed, positive CV outcomes trial for a GLP-1 RA in non-diabetic patients.",
        },
        {
          type: "diagram",
          title: "CV Evidence Comparison",
          items: [
            "Semaglutide: SUSTAIN-6 (T2D) + SELECT (non-diabetic obesity) = Complete",
            "Tirzepatide: SURPASS-CVOT = Ongoing, results pending",
            "Liraglutide: LEADER (T2D only) = Positive but smaller effect",
            "Dulaglutide: REWIND (T2D only) = Positive",
            "No other GLP-1 RA has data in non-diabetic CV patients",
          ],
        },
        {
          type: "keypoint",
          body: "When an HCP says \"I'll wait for tirzepatide's CV data\" — your response: \"Your patients with CV risk can't wait. SELECT data is available now and shows a 20% MACE reduction. That's actionable evidence today.\"",
        },
      ],
    },
  ];

  // ── COMPLIANCE MODULE: Off-Label Communication ──
  const complianceSections = [
    {
      title: "What is Off-Label Communication?",
      content: [
        {
          type: "compliance_header",
          body: "This module is required for all field-facing personnel. Completion is tracked for regulatory compliance. You must score ≥90% on the assessment to pass.",
        },
        {
          type: "text",
          body: "**Off-label use** refers to the use of an approved drug for an unapproved indication, in an unapproved age group, at an unapproved dosage, or via an unapproved route of administration. While HCPs can legally prescribe off-label, **pharmaceutical companies and their representatives are prohibited from promoting off-label uses**.",
        },
        {
          type: "diagram",
          title: "What You CAN and CANNOT Do",
          items: [
            "✓ CAN: Discuss FDA-approved indications, dosing, and safety data",
            "✓ CAN: Provide the FDA-approved prescribing information",
            "✓ CAN: Redirect off-label inquiries to Medical Affairs",
            "✗ CANNOT: Proactively discuss off-label uses",
            "✗ CANNOT: Share off-label data, even from published journals",
            "✗ CANNOT: Respond to off-label questions directly, even if HCP-initiated",
          ],
        },
        {
          type: "keypoint",
          body: 'The key principle: Even when an HCP asks about off-label use, you must redirect to Medical Affairs. "Reactive" requests from HCPs do NOT authorize field reps to discuss off-label data.',
        },
      ],
    },
    {
      title: "Scenario: HCP Asks About Off-Label Use",
      content: [
        {
          type: "text",
          body: "You're detailing Ozempic to an endocrinologist when she asks:\n\n*\"I've been reading about semaglutide for PCOS. Some of my patients with PCOS and insulin resistance have been asking about it. What data can you share?\"*",
        },
        {
          type: "text",
          body: "**The compliant response:**\n\n\"Thank you for your interest, Dr. Martinez. I appreciate you sharing what you're hearing from patients. I'm only able to discuss semaglutide within its FDA-approved indications. However, I can connect you with our Medical Affairs team — they have a process for addressing unsolicited medical inquiries and can provide relevant clinical information through the appropriate channels. Would you like me to set that up?\"",
        },
        {
          type: "diagram",
          title: "The Compliant Response Framework",
          items: [
            "1. ACKNOWLEDGE: Thank the HCP for their interest",
            "2. BOUNDARY: State clearly that you can only discuss approved indications",
            "3. REDIRECT: Offer to connect them with Medical Affairs",
            "4. FACILITATE: Provide the Medical Affairs contact or submit the inquiry",
            "5. DOCUMENT: Log the interaction per your company's SOP",
          ],
        },
        {
          type: "keypoint",
          body: 'Never say "I can\'t talk about that" without offering an alternative path. The redirect to Medical Affairs maintains the relationship while keeping you compliant.',
        },
      ],
    },
    {
      title: "Adverse Event Reporting Refresher",
      content: [
        {
          type: "text",
          body: "Any time you become aware of an adverse event — whether from an HCP, a patient, or even overheard in a waiting room — you are **required to report it within 24 hours** through your company's pharmacovigilance system.",
        },
        {
          type: "diagram",
          title: "What Constitutes a Reportable AE?",
          items: [
            "ANY undesirable medical occurrence in a patient using the product",
            "Regardless of severity (mild, moderate, or serious)",
            "Regardless of causality (even if unlikely to be drug-related)",
            "Regardless of expectedness (even if listed in the PI)",
            "Regardless of source (HCP, patient, caregiver, overheard)",
            "Including: lack of efficacy, medication errors, overdose, misuse",
          ],
        },
        {
          type: "text",
          body: "**Common mistake:** Reps sometimes only report serious events. The regulatory standard is broad — ALL adverse events must be reported, including mild GI symptoms, injection site reactions, or any other undesirable experience the patient has while on the product.",
        },
        {
          type: "keypoint",
          body: "When in doubt, report. There is no penalty for over-reporting, but failure to report an AE is a serious regulatory violation that can result in disciplinary action and company liability.",
        },
      ],
    },
    {
      title: "Attestation & Assessment",
      content: [
        {
          type: "compliance_header",
          body: "Please confirm that you have read and understand the off-label communication and adverse event reporting requirements. Your completion will be recorded for compliance audit purposes.",
        },
        {
          type: "quiz",
          question:
            "An HCP mentions that a colleague has been using your product off-label with good results and suggests you share this with other doctors. What is the correct response?",
          options: [
            {
              id: "A",
              text: "Share the colleague's experience since it's their clinical opinion, not yours.",
              correct: false,
            },
            {
              id: "B",
              text: "Acknowledge their interest, explain you can only discuss approved indications, and offer to connect them with Medical Affairs to share clinical experiences through proper channels.",
              correct: true,
            },
            {
              id: "C",
              text: "Ask for more details so you can create an anonymous case study.",
              correct: false,
            },
            {
              id: "D",
              text: "Tell them off-label use is dangerous and they should stop immediately.",
              correct: false,
            },
          ],
          explanation:
            "Even when an HCP shares off-label success stories, you must not participate in promoting those uses. The compliant path is to redirect to Medical Affairs, who can facilitate HCP-to-HCP knowledge sharing through appropriate scientific exchange channels.",
        },
        { type: "attestation" },
      ],
    },
  ];

  // ── AI MODULE: Dupixent vs Rinvoq Competitive Positioning ──
  const dupixentRinvoqSections = [
    {
      title: "Market Context: Atopic Dermatitis",
      content: [
        {
          type: "ai_intro",
          body: "This AI-generated module focuses on the competitive dynamics between Dupixent (dupilumab) and Rinvoq (upadacitinib) in moderate-to-severe atopic dermatitis. I've tailored the content to your Competitive Positioning gap areas.",
        },
        {
          type: "text",
          body: "**Atopic dermatitis (AD)** is a chronic, relapsing inflammatory skin disease affecting approximately 7-10% of adults globally. The treatment landscape has transformed with the introduction of biologics and JAK inhibitors.",
        },
        {
          type: "diagram",
          title: "Key Players in Moderate-to-Severe AD",
          items: [
            "Dupixent (dupilumab) — IL-4/IL-13 inhibitor (biologic)",
            "Rinvoq (upadacitinib) — JAK1 selective inhibitor (oral small molecule)",
            "Cibinqo (abrocitinib) — JAK1 selective inhibitor (oral)",
            "Adbry (tralokinumab) — IL-13 inhibitor (biologic)",
            "Opzelura (ruxolitinib) — JAK1/JAK2 inhibitor (topical)",
          ],
        },
        {
          type: "keypoint",
          body: "The fundamental competitive dynamic: Rinvoq may show faster onset and stronger short-term efficacy in some measures, but Dupixent has the broader safety profile, longer track record, and pediatric data that many dermatologists prioritize.",
        },
      ],
    },
    {
      title: "Dupixent: Strengths & Evidence",
      content: [
        {
          type: "ai_intro",
          body: "Understanding Dupixent's competitive advantages is essential for positioning conversations with dermatologists who may be considering JAK inhibitors.",
        },
        {
          type: "diagram",
          title: "Dupixent Clinical Advantages",
          items: [
            "First-in-class IL-4/IL-13 inhibitor — targets the Type 2 inflammatory pathway",
            "FDA approved: AD (adults + peds 6mo+), asthma, CRSwNP, EoE, PN, COPD",
            "LIBERTY AD trials: Robust, long-term data (5+ years safety data)",
            "Clean safety profile: No boxed warning (unlike JAK inhibitors)",
            "No lab monitoring required — simpler for patients and HCPs",
            "Pediatric approval down to 6 months — broadest age range in class",
          ],
        },
        {
          type: "text",
          body: "**Key trial data:** In LIBERTY AD CHRONOS, dupilumab achieved EASI-75 in **65%** of patients at Week 16 (vs 22% placebo). Long-term data through 4 years shows sustained efficacy with no new safety signals.",
        },
        {
          type: "keypoint",
          body: "For dermatologists: Lead with the safety conversation. Dupixent has NO boxed warning, no lab monitoring requirement, and the longest safety track record in moderate-to-severe AD. This is especially compelling for patients who need long-term treatment.",
        },
      ],
    },
    {
      title: "Rinvoq: Competitive Strengths & Risks",
      content: [
        {
          type: "text",
          body: "**Rinvoq (upadacitinib)** is a selective JAK1 inhibitor approved for AD at 15mg and 30mg doses. It offers a different mechanism and delivery (oral vs injection).",
        },
        {
          type: "diagram",
          title: "Rinvoq Advantages to Acknowledge",
          items: [
            "Oral dosing — patient convenience vs biweekly injection",
            "Faster onset: Some patients see improvement in 1-2 weeks",
            "Heads Up trial: Upadacitinib 30mg showed superiority to dupilumab on EASI-75 at Week 16 (71% vs 61%)",
            "May show stronger itch relief (NRS improvement) at early timepoints",
            "Dual indication convenience for patients with AD + RA or AD + UC",
          ],
        },
        {
          type: "diagram",
          title: "Rinvoq Risks / Vulnerabilities",
          items: [
            "Boxed Warning: Serious infections, malignancy, thrombosis, CV events, mortality (class effect)",
            "Requires lab monitoring: CBC, liver function, lipids at baseline and ongoing",
            "Contraindications: Not recommended with strong CYP3A4 inhibitors",
            "30mg dose comparison: The Heads Up trial used the higher dose — risk/benefit shifts",
            "No pediatric approval below 12 years (Dupixent approved down to 6 months)",
            "Long-term safety data is still maturing vs Dupixent's 8+ year track record",
          ],
        },
        {
          type: "keypoint",
          body: 'Acknowledge Rinvoq\'s speed and convenience, then bridge: "For patients needing long-term management of a chronic disease, the safety profile and track record matter enormously. Dupixent offers that confidence — no boxed warning, no lab monitoring, and the broadest pediatric approvals in the class."',
        },
      ],
    },
    {
      title: "Knowledge Check",
      content: [
        {
          type: "quiz",
          question:
            'A dermatologist says: "The Heads Up trial showed upadacitinib beat dupilumab. Why should I keep prescribing Dupixent?" What\'s the strongest response?',
          options: [
            {
              id: "A",
              text: "The Heads Up trial wasn't properly designed — you should ignore it.",
              correct: false,
            },
            {
              id: "B",
              text: "Acknowledge the efficacy data, then highlight that for chronic, long-term disease, Dupixent's clean safety profile (no boxed warning, no lab monitoring) and 8+ years of real-world data provide confidence that JAK inhibitors can't yet match.",
              correct: true,
            },
            {
              id: "C",
              text: "Dupixent is more affordable than Rinvoq on most formularies.",
              correct: false,
            },
            {
              id: "D",
              text: "Recommend using both drugs together for maximum benefit.",
              correct: false,
            },
          ],
          explanation:
            "Never dismiss valid competitive trial data. Acknowledge the Heads Up results, then bridge to Dupixent's differentiated value: the safety profile advantage. For a chronic disease requiring years of treatment, safety confidence is often the deciding factor for dermatologists — especially for their younger patients.",
        },
      ],
    },
  ];

  // ── WORKSHOP: Payer Objection Handling ──
  const payerObjSections = [
    {
      title: "The Payer Conversation Challenge",
      content: [
        {
          type: "text",
          body: "Payer objections are consistently the most challenging conversations for pharmaceutical sales representatives. Unlike clinical discussions where data speaks for itself, payer conversations require you to bridge **clinical value** with **economic reality**.",
        },
        {
          type: "diagram",
          title: "Top 5 Payer Objections You'll Face",
          items: [
            '"It\'s not on our formulary" — Access objection',
            '"The prior authorization process is too burdensome" — Process objection',
            '"It\'s too expensive compared to alternatives" — Cost objection',
            '"We already have two drugs in this class" — Category saturation objection',
            '"Show me the real-world cost-effectiveness data" — Evidence objection',
          ],
        },
        {
          type: "keypoint",
          body: "The single biggest mistake reps make with payer objections: leading with clinical data. Payers already know the clinical story. They need the VALUE story — total cost of care, adherence benefits, downstream savings, and operational efficiency.",
        },
      ],
    },
    {
      title: "Framework: The Value Bridge",
      content: [
        {
          type: "text",
          body: "The **Value Bridge** framework is specifically designed for payer conversations. It moves you from reactive defense to proactive value positioning.",
        },
        {
          type: "diagram",
          title: "The Value Bridge — 4 Steps",
          items: [
            "1. VALIDATE: Acknowledge the payer's concern as legitimate and business-rational",
            "2. REFRAME: Shift from drug cost to total cost of care",
            "3. EVIDENCE: Present RWE, adherence data, and downstream savings",
            "4. QUANTIFY: Provide specific numbers — cost per patient, hospitalizations avoided, ER visits prevented",
          ],
        },
        {
          type: "text",
          body: '**Example in practice:**\n\nPayer says: *"This drug costs 3x more than the generic alternative."*\n\n**Validate:** "You\'re right that the acquisition cost is higher, and I understand formulary budget pressure is real."\n\n**Reframe:** "When we look at total cost of care over 12 months, the picture changes significantly."\n\n**Evidence:** "Real-world data from 14,000 patients shows 38% fewer hospitalizations and 52% fewer ER visits compared to the generic pathway."\n\n**Quantify:** "That translates to approximately $4,200 in savings per patient per year in downstream costs — more than offsetting the acquisition cost difference."',
        },
        {
          type: "keypoint",
          body: "Practice this framework until it feels natural. The transition from VALIDATE to REFRAME is the critical moment — that's where most reps stumble by getting defensive instead of redirecting.",
        },
      ],
    },
    {
      title: "Prior Authorization Strategy",
      content: [
        {
          type: "text",
          body: "Prior authorization is one of the biggest barriers to patient access. Rather than viewing PA as an obstacle, position yourself as the **solution provider** who helps the HCP office navigate the process.",
        },
        {
          type: "diagram",
          title: "PA Support Strategy",
          items: [
            "Know the PA requirements for your top 10 payers by territory",
            "Pre-populate PA forms with clinical data before the HCP asks",
            "Connect the HCP office with your company's access support team",
            "Offer to train office staff on the PA submission process",
            "Follow up within 48 hours to check PA status",
            "If denied: Know the appeals process and help coordinate it",
          ],
        },
        {
          type: "text",
          body: "**The office manager is your ally.** In many practices, the office manager or PA coordinator is more influential than the physician in determining which drugs get prescribed. Build a relationship with them — make their job easier, and prescribing patterns will follow.",
        },
        {
          type: "keypoint",
          body: "Your competitive advantage isn't just the drug — it's the access support ecosystem. If your PA support is faster and easier than the competitor's, HCPs will prescribe your product because it's less work for their staff.",
        },
      ],
    },
    {
      title: "Practice Scenario",
      content: [
        {
          type: "text",
          body: 'A regional health plan pharmacy director says to you:\n\n*"We already have two GLP-1s on our preferred formulary. Our utilization management committee has no plans to add a third. What could possibly change our mind?"*',
        },
        {
          type: "diagram",
          title: "Strong Response Framework",
          items: [
            'VALIDATE: "I understand — formulary space is competitive and you\'ve made thoughtful choices."',
            'REFRAME: "Rather than asking you to add a third, I\'d like to show you data that might make you reconsider which two you prefer."',
            "DIFFERENTIATE: Present unique CV outcomes data (SELECT trial) that existing formulary options lack",
            'QUANTIFY: "For your 12,000 members with T2D and CV risk, the modeled MACE reduction could prevent ~18 events per year at $45,000 per event — that\'s $810,000 in potentially avoidable costs."',
            "PROPOSE: Suggest a pilot program or medical exception pathway rather than full formulary addition",
          ],
        },
        {
          type: "keypoint",
          body: "Notice the strategy: you're NOT asking them to add a third drug. You're asking them to reconsider their current two. And you're NOT leading with clinical data — you're leading with economic modeling specific to THEIR member population.",
        },
      ],
    },
  ];

  // ── COURSE: Immunology Landscape 2026 ──
  const immunoSections = [
    {
      title: "The Immunology Revolution",
      content: [
        {
          type: "text",
          body: "The immunology therapeutic landscape has undergone a dramatic transformation over the past decade. What was once dominated by broad immunosuppressants has evolved into an era of **targeted biologics and precision small molecules** that selectively modulate specific immune pathways.",
        },
        {
          type: "diagram",
          title: "Key Immunology Therapeutic Areas",
          items: [
            "Psoriasis / Psoriatic Arthritis — IL-17, IL-23, TNF-α, PDE4, JAK",
            "Atopic Dermatitis — IL-4/IL-13, IL-13, JAK",
            "Inflammatory Bowel Disease — TNF-α, IL-12/23, IL-23, α4β7 integrin, JAK, S1P",
            "Rheumatoid Arthritis — TNF-α, IL-6, JAK, CTLA-4, CD20",
            "Asthma — IL-4/IL-13, IL-5, IL-5Rα, TSLP, IgE",
            "Lupus — BLyS, IFN-α, CD20, calcineurin",
          ],
        },
        {
          type: "keypoint",
          body: 'The trend in 2026: treatment paradigms are shifting from "step therapy" (try generics first) to "treat-to-target" approaches where biologic and advanced therapies are initiated earlier based on disease severity and biomarkers.',
        },
      ],
    },
    {
      title: "IL-23 Inhibitors: The Rising Class",
      content: [
        {
          type: "text",
          body: "**IL-23 inhibitors** have emerged as a cornerstone of immunology treatment, particularly in psoriasis and IBD. By selectively targeting the p19 subunit of IL-23, these agents disrupt a key driver of chronic inflammation while leaving other immune pathways relatively intact.",
        },
        {
          type: "diagram",
          title: "IL-23 Inhibitors in the Market",
          items: [
            "SKYRIZI (risankizumab) — Approved: PsO, PsA, Crohn's disease",
            "Tremfya (guselkumab) — Approved: PsO, PsA, UC (2025)",
            "Omvoh (mirikizumab) — Approved: UC, Crohn's (2025)",
            "Pipeline: Multiple IL-23 agents in late-stage development",
          ],
        },
        {
          type: "text",
          body: "**SKYRIZI** has established a strong position with data showing durable responses — in the IMMvent trial, **82% of psoriasis patients** achieved PASI 90 at Week 16, with sustained responses through 2+ years. The Crohn's disease data (ADVANCE/MOTIVATE trials) further expands its therapeutic footprint.",
        },
        {
          type: "keypoint",
          body: "For your HCP conversations: IL-23 inhibitors offer the ideal balance of strong efficacy and a favorable safety profile. Unlike JAK inhibitors, they don't carry boxed warnings — a key differentiator when discussing treatment choices with gastroenterologists and dermatologists.",
        },
      ],
    },
    {
      title: "JAK Inhibitors: Opportunity & Risk",
      content: [
        {
          type: "text",
          body: "**JAK inhibitors** (Janus kinase inhibitors) represent one of immunology's most debated therapeutic classes. They offer the convenience of oral dosing with broad immunomodulatory effects, but their safety profile has generated significant discussion since the ORAL Surveillance study.",
        },
        {
          type: "diagram",
          title: "JAK Inhibitors — Benefit vs Risk Balance",
          items: [
            "✓ Oral dosing — major patient convenience advantage over injectables",
            "✓ Rapid onset of action — many patients respond within 1-2 weeks",
            "✓ Broad indication coverage — RA, PsA, AD, UC, AS",
            "✗ Boxed Warning (class-wide): Serious infections, malignancy, thrombosis, MACE, mortality",
            "✗ Lab monitoring required: CBC, hepatic function, lipids",
            "✗ ORAL Surveillance: Tofacitinib showed increased CV and malignancy risk vs TNF-α inhibitors",
            "✗ Regulatory restrictions: FDA limits JAK use to patients who have failed TNF-α inhibitors",
          ],
        },
        {
          type: "keypoint",
          body: "The JAK inhibitor safety conversation is a competitive opportunity for biologic representatives. When dermatologists or rheumatologists are considering JAK inhibitors for convenience, the safety data gives you a compelling reason to position your biologic as the first-choice therapy.",
        },
      ],
    },
    {
      title: "Knowledge Check",
      content: [
        {
          type: "quiz",
          question:
            "A rheumatologist is considering switching a patient from a biologic to a JAK inhibitor for convenience. What's the most evidence-based response?",
          options: [
            {
              id: "A",
              text: "JAK inhibitors are dangerous and should never be used.",
              correct: false,
            },
            {
              id: "B",
              text: "Acknowledge the oral convenience, then discuss the ORAL Surveillance findings and FDA's post-market restrictions. Suggest evaluating whether the convenience benefit outweighs the increased CV and malignancy risk for this specific patient.",
              correct: true,
            },
            {
              id: "C",
              text: "Tell them that biologics and JAK inhibitors work exactly the same way.",
              correct: false,
            },
            {
              id: "D",
              text: "Agree that the switch makes sense since oral dosing is always better for patients.",
              correct: false,
            },
          ],
          explanation:
            "The evidence-based approach: validate the legitimate appeal of oral dosing, then bring the ORAL Surveillance data into the conversation. Position the discussion as a patient-specific risk/benefit analysis rather than a blanket recommendation. This builds credibility because you're showing clinical nuance, not just promoting your product.",
        },
      ],
    },
  ];

  // ── COURSE: PCSK9 Inhibitors in Cardiology ──
  const pcsk9Sections = [
    {
      title: "The LDL Challenge",
      content: [
        {
          type: "text",
          body: "Despite widespread statin use, many patients with atherosclerotic cardiovascular disease (ASCVD) fail to achieve recommended LDL-C targets. Approximately **30-40% of patients on maximally tolerated statin therapy** still have LDL-C levels above guideline thresholds — creating a significant unmet need.",
        },
        {
          type: "diagram",
          title: "The Treatment Gap",
          items: [
            "Target LDL-C for very high-risk ASCVD patients: <55 mg/dL (ESC) or <70 mg/dL (ACC/AHA)",
            "~70% of high-risk patients don't reach target on statins alone",
            "Statin intolerance affects 5-10% of patients (myalgia, elevated CK)",
            "Each 1 mmol/L (39 mg/dL) LDL-C reduction → ~22% reduction in major vascular events",
            "PCSK9 inhibitors can reduce LDL-C by 50-60% on top of statin therapy",
          ],
        },
        {
          type: "keypoint",
          body: "The opportunity for PCSK9 inhibitors: they address the residual risk gap that statins alone can't close. For cardiologists managing high-risk ASCVD patients, this isn't about replacing statins — it's about augmenting them to reach targets that dramatically reduce event risk.",
        },
      ],
    },
    {
      title: "PCSK9 Mechanism & Agents",
      content: [
        {
          type: "text",
          body: "**PCSK9 (proprotein convertase subtilisin/kexin type 9)** is a protein that regulates LDL receptor recycling on hepatocytes. When PCSK9 binds to LDL receptors, it promotes their degradation, reducing the liver's ability to clear LDL from the blood. By inhibiting PCSK9, these therapies increase LDL receptor availability and dramatically lower LDL-C.",
        },
        {
          type: "diagram",
          title: "PCSK9 Inhibitors on the Market",
          items: [
            "Repatha (evolocumab) — Fully human monoclonal antibody, biweekly or monthly SC injection",
            "Praluent (alirocumab) — Fully human monoclonal antibody, biweekly SC injection",
            "Leqvio (inclisiran) — siRNA therapy, twice-yearly SC injection (administered by HCP)",
            "Key difference: Leqvio's twice-yearly dosing transforms the adherence conversation",
          ],
        },
        {
          type: "text",
          body: "**Inclisiran (Leqvio)** represents a paradigm shift: as a small interfering RNA (siRNA), it silences the PCSK9 gene in the liver rather than blocking the protein extracellularly. The result is sustained LDL-C lowering with just two injections per year, administered in the physician's office — essentially eliminating the adherence problem.",
        },
        {
          type: "keypoint",
          body: 'When speaking to cardiologists: frame the PCSK9 class as "the second pillar of LDL management after statins." The choice between agents comes down to patient preference, administration setting, and payer coverage.',
        },
      ],
    },
    {
      title: "Clinical Evidence",
      content: [
        {
          type: "text",
          body: "The PCSK9 class has robust cardiovascular outcomes evidence establishing not just LDL reduction but actual event reduction:",
        },
        {
          type: "diagram",
          title: "Landmark PCSK9 Outcomes Trials",
          items: [
            "FOURIER (evolocumab): 15% MACE reduction, 27,564 patients, LDL-C reduced to median 30 mg/dL",
            "ODYSSEY OUTCOMES (alirocumab): 15% MACE reduction, 18,924 post-ACS patients",
            "ORION-4 (inclisiran): Phase III outcomes trial — 15% MACE reduction in 15,968 patients with ASCVD",
            "Consistent LDL-C reduction: 50-60% on top of statin therapy across all agents",
            "Safety: No signal for neurocognitive effects despite very low LDL-C levels",
          ],
        },
        {
          type: "keypoint",
          body: "All three agents show remarkably consistent outcomes (~15% MACE reduction). The differentiation is in dosing, administration, and access — not efficacy. Lead your conversations with the shared outcomes story, then differentiate on convenience and patient fit.",
        },
      ],
    },
    {
      title: "Knowledge Check",
      content: [
        {
          type: "quiz",
          question:
            "A cardiologist says her ASCVD patients are already on high-intensity statins and she doesn't see the value of adding more lipid therapy. What's the strongest evidence-based response?",
          options: [
            {
              id: "A",
              text: "Statins are outdated — PCSK9 inhibitors should replace them.",
              correct: false,
            },
            {
              id: "B",
              text: "Present the residual risk data: 30-40% of patients on maximum statins still don't reach LDL targets. Then cite FOURIER/ODYSSEY showing that adding PCSK9 inhibition reduces MACE by 15% on top of statin therapy.",
              correct: true,
            },
            {
              id: "C",
              text: "Suggest she switch patients from statins to PCSK9 inhibitors to simplify their regimen.",
              correct: false,
            },
            {
              id: "D",
              text: "Agree that statins alone are sufficient for most patients.",
              correct: false,
            },
          ],
          explanation:
            "The key is framing PCSK9 as additive, not replacement. The residual risk conversation is powerful: despite best statin therapy, many high-risk patients remain above target and continue to have events. PCSK9 inhibition closes that gap with a 15% further MACE reduction — supported by three major outcomes trials.",
        },
      ],
    },
  ];

  // ── AI MODULE: Oncology Biomarker Testing Primer ──
  const oncBiomarkerSections = [
    {
      title: "Why Biomarkers Matter in Oncology",
      content: [
        {
          type: "ai_intro",
          body: "This AI module covers the essential biomarker testing landscape that oncology sales representatives need to understand. I've focused on the biomarkers most relevant to current therapies and emerging treatment paradigms.",
        },
        {
          type: "text",
          body: "**Biomarker testing** has transformed oncology from a tissue-of-origin treatment model to a precision medicine approach. Today, treatment decisions in many tumor types are driven by the molecular profile of the tumor rather than (or in addition to) where the cancer originated.",
        },
        {
          type: "diagram",
          title: "Critical Biomarkers by Tumor Type",
          items: [
            "NSCLC: EGFR, ALK, ROS1, BRAF, KRAS G12C, MET, RET, NTRK, PD-L1, TMB",
            "Breast: HER2, ER/PR, BRCA1/2, PIK3CA, PD-L1",
            "Colorectal: KRAS/NRAS, BRAF V600E, MSI-H/dMMR, HER2",
            "Melanoma: BRAF V600, PD-L1, TMB",
            "Prostate: BRCA1/2, ATM, MSI-H, PSMA",
            "Pan-tumor: MSI-H/dMMR, NTRK fusions, TMB-High",
          ],
        },
        {
          type: "keypoint",
          body: "For sales conversations: Many oncologists still don't order comprehensive biomarker testing at diagnosis. Every unordered test is a potential missed treatment opportunity. Your role is to advocate for comprehensive testing that identifies ALL actionable targets — not just the ones relevant to your product.",
        },
      ],
    },
    {
      title: "PD-L1 & TMB: Immunotherapy Biomarkers",
      content: [
        {
          type: "ai_intro",
          body: "Given that Keytruda (pembrolizumab) is in your product portfolio, understanding PD-L1 and TMB testing is critical for your certification. This section focuses on the nuances that HCPs frequently ask about.",
        },
        {
          type: "text",
          body: "**PD-L1 (Programmed Death-Ligand 1)** expression is the most widely used biomarker for immunotherapy patient selection, but it's an imperfect predictor. Some PD-L1-negative patients respond to immunotherapy, and some PD-L1-high patients don't.",
        },
        {
          type: "diagram",
          title: "PD-L1 Testing Nuances",
          items: [
            "TPS (Tumor Proportion Score): % of tumor cells with PD-L1 staining — used in NSCLC",
            "CPS (Combined Positive Score): Includes tumor + immune + stromal cells — used in many solid tumors",
            "Different assays: 22C3 (Dako), SP263 (Ventana), SP142 (Ventana), 28-8 (Dako)",
            "Cutoffs vary by indication: NSCLC uses TPS ≥50% or ≥1%, gastric uses CPS ≥1",
            "TMB (Tumor Mutational Burden): High TMB (≥10 mut/Mb) predicts immunotherapy response across tumor types",
            "TMB-High is a tissue-agnostic biomarker for pembrolizumab (FDA approved)",
          ],
        },
        {
          type: "keypoint",
          body: "When speaking to oncologists: Don't oversimplify PD-L1 testing. The most credible approach is acknowledging its limitations while explaining how it helps guide treatment decisions in the context of the complete clinical picture.",
        },
      ],
    },
    {
      title: "Next-Generation Sequencing (NGS)",
      content: [
        {
          type: "ai_intro",
          body: "NGS is increasingly replacing single-gene testing. Understanding NGS helps you advocate for comprehensive testing that benefits patients regardless of which therapy they ultimately receive.",
        },
        {
          type: "text",
          body: "**Next-Generation Sequencing (NGS)** platforms analyze hundreds of genes simultaneously from a single tissue sample. This is more efficient and often more cost-effective than running multiple individual tests sequentially.",
        },
        {
          type: "diagram",
          title: "NGS in Practice",
          items: [
            "FoundationOne CDx — 324 genes, FDA-approved companion diagnostic for multiple therapies",
            "Tempus xT — 648 genes, integrates clinical and molecular data",
            "Guardant360 CDx — Liquid biopsy (blood-based), detects ctDNA mutations",
            "MSK-IMPACT — 505 genes, academic-origin, FDA-authorized",
            "Turnaround time: Tissue-based NGS ~2-3 weeks, liquid biopsy ~7-10 days",
            "Medicare covers NGS for advanced cancer patients with FDA-approved diagnostics",
          ],
        },
        {
          type: "keypoint",
          body: 'Advocate for NGS at diagnosis rather than sequential single-gene testing. It\'s faster, finds more actionable targets, and is often covered by insurance. Frame it as: "Comprehensive testing at diagnosis gives your patient the best chance of matching to the right therapy from the start."',
        },
      ],
    },
  ];

  // Content map for routing
  const allContentMap = {
    glp1_moa: { sections: courseSections, type: "Course", color: T.blue },
    select_trial: {
      sections: aiModuleSections,
      type: "AI Module",
      color: T.violet,
    },
    compliance_offlabel: {
      sections: complianceSections,
      type: "Compliance",
      color: T.amber,
    },
    dupixent_rinvoq: {
      sections: dupixentRinvoqSections,
      type: "AI Module",
      color: T.violet,
    },
    payer_obj: { sections: payerObjSections, type: "Workshop", color: T.teal },
    immuno_2026: { sections: immunoSections, type: "Course", color: T.blue },
    pcsk9: { sections: pcsk9Sections, type: "Course", color: T.blue },
    onc_biomarker: {
      sections: oncBiomarkerSections,
      type: "AI Module",
      color: T.violet,
    },
  };

  // Content viewer rendering helpers
  const renderContentBlock = (block, i) => {
    if (block.type === "text")
      return (
        <div
          key={i}
          style={{
            fontSize: 13,
            color: T.textSoft,
            lineHeight: 1.75,
            margin: "12px 0",
          }}
          dangerouslySetInnerHTML={{
            __html: block.body
              .replace(
                /\*\*(.*?)\*\*/g,
                `<strong style="color:${T.text}">$1</strong>`,
              )
              .replace(/\*(.*?)\*/g, `<em style="color:${T.textMuted}">$1</em>`)
              .replace(/\n/g, "<br/>"),
          }}
        />
      );
    if (block.type === "diagram")
      return (
        <div
          key={i}
          style={{
            background: T.cardRaised,
            borderRadius: 12,
            padding: "16px 18px",
            border: `1px solid ${T.border}`,
            margin: "14px 0",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.blue,
              marginBottom: 10,
            }}
          >
            {block.title}
          </div>
          {block.items.map((item, j) => (
            <div
              key={j}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  color: item.startsWith("✗")
                    ? T.rose
                    : item.startsWith("✓")
                      ? T.emerald
                      : T.blue,
                  fontSize: 10,
                  marginTop: 3,
                  flexShrink: 0,
                }}
              >
                {item.startsWith("✗") ? "" : item.startsWith("✓") ? "" : "●"}
              </span>
              <span
                style={{ fontSize: 12.5, color: T.textSoft, lineHeight: 1.5 }}
              >
                {item.replace(/^[✓✗] /, "")}
              </span>
            </div>
          ))}
        </div>
      );
    if (block.type === "keypoint")
      return (
        <div
          key={i}
          style={{
            background: `${T.emerald}08`,
            borderRadius: 10,
            padding: "14px 16px",
            border: `1px solid ${T.emerald}15`,
            borderLeft: `3px solid ${T.emerald}`,
            margin: "14px 0",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: T.emerald,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 4,
            }}
          >
            Key Takeaway
          </div>
          <div
            style={{ fontSize: 12.5, color: T.textSoft, lineHeight: 1.65 }}
            dangerouslySetInnerHTML={{
              __html: block.body.replace(
                /\*\*(.*?)\*\*/g,
                `<strong style="color:${T.text}">$1</strong>`,
              ),
            }}
          />
        </div>
      );
    if (block.type === "ai_intro")
      return (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 10,
            margin: "12px 0",
            padding: "12px 14px",
            background: `${T.violet}06`,
            borderRadius: 10,
            border: `1px solid ${T.violet}15`,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: `linear-gradient(135deg,${T.blue},${T.violet})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: T.white,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            ⚡
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.textSoft,
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            {block.body}
          </div>
        </div>
      );
    if (block.type === "compliance_header")
      return (
        <div
          key={i}
          style={{
            background: `${T.amber}08`,
            borderRadius: 10,
            padding: "12px 16px",
            border: `1px solid ${T.amber}20`,
            margin: "12px 0",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
          <div
            style={{
              fontSize: 12,
              color: T.amber,
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            {block.body}
          </div>
        </div>
      );
    if (block.type === "quiz")
      return (
        <div
          key={i}
          style={{
            background: T.cardRaised,
            borderRadius: 12,
            overflow: "hidden",
            border: `1px solid ${T.borderLight}`,
            margin: "14px 0",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: `${T.blue}06`,
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 13 }}>✎</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.blue }}>
              Knowledge Check
            </span>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p
              style={{
                fontSize: 13,
                color: T.text,
                lineHeight: 1.6,
                margin: "0 0 14px",
              }}
            >
              {block.question}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {block.options.map((o) => {
                const sel = quizAnswer === o.id,
                  show = quizRevealed;
                let bc = T.border,
                  bg = T.card;
                if (show && o.correct) {
                  bc = T.emerald;
                  bg = T.emeraldDim;
                } else if (show && sel && !o.correct) {
                  bc = T.rose;
                  bg = T.roseDim;
                } else if (sel && !show) {
                  bc = T.blue;
                  bg = T.blueGlow2;
                }
                return (
                  <button
                    key={o.id}
                    onClick={() => {
                      if (!quizRevealed) {
                        setQuizAnswer(o.id);
                        setTimeout(() => setQuizRevealed(true), 300);
                      }
                    }}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                      padding: "11px 14px",
                      borderRadius: 9,
                      border: `1.5px solid ${bc}`,
                      background: bg,
                      cursor: show ? "default" : "pointer",
                      textAlign: "left",
                      width: "100%",
                      fontFamily: "'Outfit',sans-serif",
                      transition: "all .15s",
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        flexShrink: 0,
                        background:
                          show && o.correct
                            ? T.emerald
                            : show && sel
                              ? T.rose
                              : sel
                                ? T.blue
                                : T.surface,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color:
                          sel || (show && o.correct) ? T.white : T.textMuted,
                      }}
                    >
                      {show && o.correct ? "✓" : show && sel ? "✗" : o.id}
                    </span>
                    <span
                      style={{
                        fontSize: 12.5,
                        color: T.text,
                        lineHeight: 1.45,
                      }}
                    >
                      {o.text}
                    </span>
                  </button>
                );
              })}
            </div>
            {quizRevealed && (
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 16px",
                  background:
                    quizAnswer === block.options.find((o) => o.correct)?.id
                      ? T.emeraldDim
                      : T.roseDim,
                  borderRadius: 9,
                  borderLeft: `3px solid ${quizAnswer === block.options.find((o) => o.correct)?.id ? T.emerald : T.rose}`,
                  animation: "fadeUp .3s ease",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color:
                      quizAnswer === block.options.find((o) => o.correct)?.id
                        ? T.emerald
                        : T.rose,
                    marginBottom: 4,
                  }}
                >
                  {quizAnswer === block.options.find((o) => o.correct)?.id
                    ? "✓ Correct!"
                    : "✗ Incorrect"}
                </div>
                <div
                  style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.6 }}
                >
                  {block.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    if (block.type === "attestation")
      return (
        <div
          key={i}
          style={{
            background: T.cardRaised,
            borderRadius: 12,
            padding: "18px 20px",
            border: `1px solid ${T.border}`,
            margin: "14px 0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: T.text,
              marginBottom: 8,
            }}
          >
            Compliance Attestation
          </div>
          <p
            style={{
              fontSize: 12,
              color: T.textMuted,
              margin: "0 0 14px",
              lineHeight: 1.5,
            }}
          >
            By clicking below, I confirm that I have read, understood, and will
            comply with the off-label communication and adverse event reporting
            policies.
          </p>
          <button
            style={{
              padding: "12px 32px",
              borderRadius: 10,
              border: "none",
              background: T.emerald,
              color: T.white,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              boxShadow: `0 4px 16px ${T.emerald}25`,
            }}
          >
            I Attest & Complete Module
          </button>
        </div>
      );
    return null;
  };

  // ── If content is open, show the viewer ──
  if (openContent) {
    const item = content.find((c) => c.id === openContent);
    const mapped = allContentMap[openContent];
    if (!mapped) {
      setOpenContent(null);
      return null;
    }
    const isAiModule = mapped.type === "AI Module";
    const isCompliance = mapped.type === "Compliance";
    const isWorkshop = mapped.type === "Workshop";
    const sections = mapped.sections;
    const step =
      openContent === "glp1_moa"
        ? courseSection
        : isAiModule
          ? aiModuleStep
          : isCompliance
            ? complianceStep
            : courseSection;
    const setStep =
      openContent === "glp1_moa"
        ? setCourseSection
        : isAiModule
          ? setAiModuleStep
          : isCompliance
            ? setComplianceStep
            : setCourseSection;
    const typeColor = mapped.color;
    const contentItem = content.find((c) => c.id === openContent);
    const isGamified = contentItem?.gamified;
    const xpReward = contentItem?.xp || 0;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          animation: "fadeUp .3s ease",
        }}
      >
        {/* Back + Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => {
              setOpenContent(null);
              setQuizAnswer(null);
              setQuizRevealed(false);
              setCourseSection(0);
              setAiModuleStep(0);
              setComplianceStep(0);
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: T.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.textMuted,
              fontSize: 16,
            }}
          >
            ←
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: T.text,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {item?.t}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <Badge color={typeColor} size="sm">
                {item?.type}
              </Badge>
              <Badge color={T.violet} size="sm">
                {item?.ta}
              </Badge>
              <span style={{ fontSize: 11, color: T.textMuted }}>
                {item?.dur}
              </span>
              {isAiModule && (
                <Badge color={T.violet} size="xs">
                  ⚡ AI-Generated
                </Badge>
              )}
              {isCompliance && (
                <Badge color={T.amber} size="xs">
                  ⚠️ Required
                </Badge>
              )}
              {isWorkshop && (
                <Badge color={T.teal} size="xs">
                  🎯 Interactive
                </Badge>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: T.textMuted }}>
              Section {step + 1} of {sections.length}
            </div>
            <Bar
              value={((step + 1) / sections.length) * 100}
              color={typeColor}
              h={4}
            />
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setStep(i);
                setQuizAnswer(null);
                setQuizRevealed(false);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                whiteSpace: "nowrap",
                border: `1px solid ${step === i ? typeColor + "30" : T.border}`,
                background: step === i ? `${typeColor}12` : T.card,
                color: step === i ? typeColor : T.textMuted,
                fontSize: 11,
                fontWeight: step === i ? 600 : 500,
                cursor: "pointer",
                fontFamily: "'Outfit',sans-serif",
                transition: "all .15s",
              }}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>

        {/* Gamification Bar (for gamified content) */}
        {isGamified && (
          <div
            style={{
              background: `linear-gradient(135deg, ${T.card} 0%, #1A1510 100%)`,
              borderRadius: 12,
              padding: "12px 18px",
              border: `1px solid ${T.orange}18`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              animation: "fadeUp .3s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>🎮</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.orange }}>
                Gamified Content
              </span>
            </div>
            <div style={{ width: 1, height: 20, background: T.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10.5, color: T.textMuted }}>
                Completion Reward:
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.orange,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                +{xpReward} XP
              </span>
            </div>
            <div style={{ width: 1, height: 20, background: T.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10.5, color: T.textMuted }}>
                Section Bonus:
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.emerald }}>
                +{Math.round(xpReward / sections.length)} XP per section
              </span>
            </div>
            <div style={{ width: 1, height: 20, background: T.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10.5, color: T.textMuted }}>
                Quiz Bonus:
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.violet }}>
                2× XP for first-attempt correct
              </span>
            </div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                background: `${T.orange}12`,
                borderRadius: 8,
                padding: "6px 12px",
                border: `1px solid ${T.orange}20`,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.orange,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {Math.round((xpReward * (step + 1)) / sections.length)}/
                {xpReward} XP
              </span>
            </div>
          </div>
        )}

        {/* Section Content */}
        <div
          style={{
            background: T.card,
            borderRadius: 16,
            padding: "24px 28px",
            border: `1px solid ${T.border}`,
            animation: "fadeIn .25s ease",
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: T.text,
              marginBottom: 4,
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            {sections[step].title}
          </h3>
          <div
            style={{
              width: 40,
              height: 3,
              borderRadius: 2,
              background: typeColor,
              marginBottom: 16,
            }}
          />
          {sections[step].content.map((block, i) =>
            renderContentBlock(block, i),
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => {
              if (step > 0) {
                setStep(step - 1);
                setQuizAnswer(null);
                setQuizRevealed(false);
              }
            }}
            disabled={step === 0}
            style={{
              padding: "10px 20px",
              borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: step > 0 ? T.card : "transparent",
              color: step > 0 ? T.textSoft : T.textFaint,
              fontSize: 12,
              fontWeight: 600,
              cursor: step > 0 ? "pointer" : "default",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            ← Previous
          </button>
          {step < sections.length - 1 ? (
            <button
              onClick={() => {
                setStep(step + 1);
                setQuizAnswer(null);
                setQuizRevealed(false);
              }}
              style={{
                padding: "10px 24px",
                borderRadius: 9,
                border: "none",
                background: typeColor,
                color: T.white,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Outfit',sans-serif",
                boxShadow: `0 4px 14px ${typeColor}25`,
              }}
            >
              Next Section →
            </button>
          ) : (
            <button
              onClick={() => {
                setOpenContent(null);
                setQuizAnswer(null);
                setQuizRevealed(false);
                setCourseSection(0);
                setAiModuleStep(0);
                setComplianceStep(0);
              }}
              style={{
                padding: "10px 24px",
                borderRadius: 9,
                border: "none",
                background: T.emerald,
                color: T.white,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Outfit',sans-serif",
                boxShadow: `0 4px 14px ${T.emerald}25`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Complete & Return ✓
              {isGamified && (
                <span
                  style={{
                    background: "rgba(255,255,255,.2)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                  }}
                >
                  +{xpReward} XP
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Default Library Grid ──
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: T.text,
            margin: "0 0 4px",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Content Library
        </h2>
        <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
          Courses, AI modules, and workshops — AI-recommended items are
          personalized to your gap profile.
        </p>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: `1px solid ${filter === f ? T.blue + "30" : T.border}`,
              background: filter === f ? T.blueGlow2 : T.card,
              color: filter === f ? T.blue : T.textMuted,
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            {f === "all" ? "All Content" : f}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10,
        }}
      >
        {filtered.map((c, i) => (
          <div
            key={i}
            className="hlift"
            onClick={() => c.viewable && setOpenContent(c.id)}
            style={{
              background: T.card,
              borderRadius: 13,
              padding: "16px 18px",
              border: `1px solid ${T.border}`,
              cursor: c.viewable ? "pointer" : "default",
              animation: `fadeUp .3s ease ${i * 0.04}s both`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {c.rec && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: T.emeraldDim,
                  color: T.emerald,
                  fontSize: 9.5,
                  fontWeight: 600,
                }}
              >
                AI Recommended
              </div>
            )}
            {c.gamified && !c.rec && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: `${T.orange}12`,
                  color: T.orange,
                  fontSize: 9.5,
                  fontWeight: 600,
                }}
              >
                🎮 Gamified
              </div>
            )}
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: T.text,
                marginBottom: 8,
                paddingRight: c.rec || c.gamified ? 90 : 0,
              }}
            >
              {c.t}
            </div>
            <div
              style={{
                display: "flex",
                gap: 5,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <Badge color={tc[c.type] || T.blue} size="xs">
                {c.type}
              </Badge>
              <Badge color={T.violet} size="xs">
                {c.ta}
              </Badge>
              <span style={{ fontSize: 10.5, color: T.textMuted }}>
                {c.dur}
              </span>
              {c.xp && (
                <span
                  style={{ fontSize: 10, fontWeight: 600, color: T.orange }}
                >
                  +{c.xp} XP
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, color: T.amber }}>★</span>
                <span
                  style={{ fontSize: 11.5, color: T.textSoft, fontWeight: 500 }}
                >
                  {c.r}
                </span>
              </div>
              {c.viewable && (
                <span
                  style={{ fontSize: 10.5, color: T.blue, fontWeight: 600 }}
                >
                  Open →
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// COACHING HUB — Personal Development Center
// ═══════════════════════════════════════════════
const CoachingView = () => {
  const [expandedWeek, setExpandedWeek] = useState("current");

  const devPlan = {
    focus: "Competitive Positioning & Objection Handling",
    goal: "Achieve Ozempic® CI re-certification by Mar 30",
    weeks: [
      {
        id: "current",
        label: "This Week (Mar 10–14)",
        status: "active",
        items: [
          {
            type: "focus",
            text: "Complete MOA Differentiation adaptive quiz (Step 3 of pathway)",
            done: false,
          },
          {
            type: "behavior",
            text: "In your next 3 HCP calls, practice leading with CV outcomes data instead of mechanism",
            done: false,
          },
          {
            type: "tutor",
            text: "Run 1 AI Tutor HCP simulation focused on payer objections",
            done: false,
          },
          {
            type: "reflect",
            text: "Journal reflection: What's your biggest remaining uncertainty about Ozempic positioning?",
            done: false,
          },
        ],
      },
      {
        id: "last",
        label: "Last Week (Mar 3–7)",
        status: "complete",
        items: [
          {
            type: "focus",
            text: "Complete GLP-1 MOA Deep Dive course",
            done: true,
          },
          {
            type: "focus",
            text: "Complete Competitive Landscape AI Module",
            done: true,
          },
          {
            type: "behavior",
            text: "Practice Acknowledge → Bridge → Seed framework in 2 HCP calls",
            done: true,
          },
          {
            type: "reflect",
            text: "Reflection: What clicked about the dual agonist mechanism?",
            done: true,
          },
        ],
      },
    ],
  };

  const strengths = [
    {
      name: "Regulatory Compliance",
      score: 91,
      insight:
        "You consistently maintain fair balance and on-label messaging. This is a trust-builder with HCPs — keep leveraging it.",
    },
    {
      name: "Needs Assessment",
      score: 82,
      insight:
        "Your probing skills are above team average. HCPs respond well when you ask before presenting — lean into this strength.",
    },
    {
      name: "Clinical Trial Data",
      score: 81,
      insight:
        "Strong recall of trial endpoints. Next step: translate data into patient stories for more impact.",
    },
  ];

  const coachingInsights = [
    {
      date: "Mar 7",
      source: "Echo Session",
      type: "observation",
      text: "You acknowledged the competitor's SURPASS data before defending Ozempic — a significant improvement from your Feb 28 attempt where you immediately got defensive. The Acknowledge → Bridge → Seed framework is working.",
      color: T.emerald,
    },
    {
      date: "Mar 5",
      source: "AI Tutor Quiz",
      type: "gap",
      text: "You correctly identified SELECT as the key CV differentiator but struggled when asked about SUSTAIN endpoint specifics. Recommend reviewing SUSTAIN-6 and SUSTAIN-7 primary and secondary endpoints.",
      color: T.amber,
    },
    {
      date: "Mar 3",
      source: "Course Completion",
      type: "milestone",
      text: "Completed Competitive Landscape: Mounjaro vs Ozempic with 91% score. Your understanding of dual vs single agonist mechanism has improved significantly.",
      color: T.blue,
    },
    {
      date: "Feb 28",
      source: "Echo Attempt #2",
      type: "gap",
      text: "Three competency gaps identified: MOA Differentiation (38%), Payer Objection Handling (45%), Real-World Evidence Fluency (62%). Personalized remediation pathway generated.",
      color: T.rose,
    },
  ];

  const typeIcons = { focus: "", behavior: "", tutor: "", reflect: "" };
  const typeLabels = {
    focus: "Learning Focus",
    behavior: "Field Behavior",
    tutor: "AI Tutor",
    reflect: "Reflection",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${T.panel} 0%, ${T.card} 100%)`,
          borderRadius: 18,
          padding: "24px 26px",
          border: `1px solid ${T.border}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -20,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `${T.blue}04`,
          }}
        />
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: T.blue,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          Personal Development Plan
        </div>
        <h2
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: T.text,
            margin: "0 0 6px",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          {devPlan.focus}
        </h2>
        <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
          Goal: {devPlan.goal}
        </p>
      </div>

      {/* Weekly Plans */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Weekly Coaching Plan
        </h3>
        {devPlan.weeks.map((w, wi) => (
          <div
            key={w.id}
            style={{
              background: T.card,
              borderRadius: 13,
              overflow: "hidden",
              marginBottom: 8,
              border: `1px solid ${expandedWeek === w.id ? T.borderLight : T.border}`,
              animation: `fadeUp .3s ease ${wi * 0.05}s both`,
            }}
          >
            <div
              onClick={() =>
                setExpandedWeek(expandedWeek === w.id ? null : w.id)
              }
              style={{
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: w.status === "active" ? T.blue : T.emerald,
                  flexShrink: 0,
                  animation:
                    w.status === "active" ? "breathe 2s ease infinite" : "none",
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: T.text,
                }}
              >
                {w.label}
              </span>
              <Badge
                color={w.status === "active" ? T.blue : T.emerald}
                size="xs"
              >
                {w.status === "active" ? "In Progress" : "Completed"}
              </Badge>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={T.textMuted}
                strokeWidth="2.5"
                style={{
                  transform:
                    expandedWeek === w.id ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform .2s",
                  flexShrink: 0,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {expandedWeek === w.id && (
              <div
                style={{ padding: "0 18px 16px", animation: "fadeIn .2s ease" }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {w.items.map((item, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 14px",
                        background: T.cardRaised,
                        borderRadius: 9,
                        border: `1px solid ${T.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          flexShrink: 0,
                          marginTop: 1,
                          background: item.done ? T.emeraldDim : T.glass,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: item.done ? 10 : 12,
                          color: item.done ? T.emerald : T.textFaint,
                          fontWeight: 700,
                        }}
                      >
                        {item.done ? "" : typeIcons[item.type]}
                      </div>{" "}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 12.5,
                            color: item.done ? T.textMuted : T.text,
                            lineHeight: 1.5,
                            textDecoration: item.done ? "line-through" : "none",
                          }}
                        >
                          {item.text}
                        </div>
                        <Badge color={T.textMuted} bg={T.glass} size="xs">
                          {typeLabels[item.type]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strengths to Leverage */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Your Strengths — Double Down
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {strengths.map((s, i) => (
            <div
              key={i}
              style={{
                background: T.card,
                borderRadius: 12,
                padding: "14px 18px",
                border: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                animation: `slideR .3s ease ${i * 0.05}s both`,
              }}
            >
              <Ring value={s.score} size={40} stroke={3.5} color={T.emerald}>
                <span
                  style={{ fontSize: 10, fontWeight: 700, color: T.emerald }}
                >
                  {s.score}
                </span>
              </Ring>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.text,
                    marginBottom: 3,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.55 }}
                >
                  {s.insight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coaching Timeline */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Coaching Journal & AI Insights
        </h3>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 15,
              top: 10,
              bottom: 10,
              width: 2,
              background: T.border,
              borderRadius: 2,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {coachingInsights.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  animation: `fadeUp .3s ease ${i * 0.04}s both`,
                }}
              >
                <div
                  style={{
                    width: 32,
                    display: "flex",
                    justifyContent: "center",
                    flexShrink: 0,
                    paddingTop: 12,
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: c.color,
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    background: T.card,
                    borderRadius: 11,
                    padding: "12px 16px",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: T.textMuted,
                        fontFamily: "'JetBrains Mono',monospace",
                      }}
                    >
                      {c.date}
                    </span>
                    <Badge color={c.color} size="xs">
                      {c.source}
                    </Badge>
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: T.textSoft,
                      lineHeight: 1.6,
                    }}
                  >
                    {c.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// PERFORMANCE INSIGHTS — Rep-Facing Analytics
// ═══════════════════════════════════════════════
const InsightsView = () => {
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const echoTrend = [62, 58, 71, 74, 54, null]; // null = not yet
  const compTrend = [40, 42, 48, 50, 52, 58];
  const learningMins = [120, 95, 180, 210, 155, 96];

  const readinessFactors = [
    { name: "Clinical Knowledge", val: 78, w: 25 },
    { name: "Competitive Positioning", val: 52, w: 30 },
    { name: "Objection Handling", val: 65, w: 20 },
    { name: "Selling Skills", val: 74, w: 15 },
    { name: "Compliance", val: 91, w: 10 },
  ];
  const readinessScore = Math.round(
    readinessFactors.reduce((a, f) => a + f.val * (f.w / 100), 0),
  );

  const peerBench = [
    { metric: "Avg Echo Score", you: 71, team: 68, top: 89 },
    {
      metric: "Time to Certify",
      you: 6.2,
      team: 9.1,
      top: 4.1,
      unit: "days",
      invert: true,
    },
    { metric: "AI Tutor Sessions/Wk", you: 3.2, team: 1.8, top: 4.5 },
    { metric: "Content Completed", you: 12, team: 8, top: 18, unit: "items" },
    { metric: "Competency Avg", you: 72, team: 65, top: 84 },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      {/* Readiness Radar */}
      <div
        style={{
          background: `linear-gradient(135deg, ${T.panel} 0%, ${T.card} 100%)`,
          borderRadius: 18,
          padding: "24px 26px",
          border: `1px solid ${T.border}`,
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
      >
        <Ring
          value={readinessScore}
          size={100}
          stroke={7}
          color={
            readinessScore >= 75
              ? T.emerald
              : readinessScore >= 60
                ? T.amber
                : T.rose
          }
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color:
                readinessScore >= 75
                  ? T.emerald
                  : readinessScore >= 60
                    ? T.amber
                    : T.rose,
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            {readinessScore}
          </span>
          <span style={{ fontSize: 9, color: T.textMuted }}>/ 100</span>
        </Ring>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: T.amber,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            AI Readiness Prediction
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: T.text,
              margin: "0 0 6px",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Not Yet Ready for Re-Certification
          </h2>
          <p
            style={{
              fontSize: 12.5,
              color: T.textSoft,
              margin: "0 0 12px",
              lineHeight: 1.5,
            }}
          >
            Based on your current trajectory, the AI predicts you'll reach
            re-certification readiness by approximately{" "}
            <strong style={{ color: T.text }}>March 24</strong>. Continue your
            pathway and your Competitive Positioning score needs to reach ~65.
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {readinessFactors.map((f, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: T.cardRaised,
                  borderRadius: 8,
                  padding: "8px 10px",
                  textAlign: "center",
                  border: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color:
                      f.val >= 75 ? T.emerald : f.val >= 60 ? T.amber : T.rose,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {f.val}
                </div>
                <div
                  style={{
                    fontSize: 8.5,
                    color: T.textMuted,
                    marginTop: 2,
                    lineHeight: 1.2,
                  }}
                >
                  {f.name}
                </div>
                <div style={{ fontSize: 8, color: T.textFaint }}>
                  wt: {f.w}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Echo Score Trend */}
        <div
          style={{
            background: T.card,
            borderRadius: 14,
            padding: "18px 20px",
            border: `1px solid ${T.border}`,
          }}
        >
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.text,
              marginBottom: 14,
            }}
          >
            Echo Score Trend
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 100,
            }}
          >
            {echoTrend.map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {v !== null ? (
                  <>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: v >= 70 ? T.emerald : T.rose,
                      }}
                    >
                      {v}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        borderRadius: 4,
                        background: v >= 70 ? `${T.emerald}30` : `${T.rose}30`,
                        height: `${v}%`,
                        minHeight: 8,
                        transition: "height .6s ease",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 4,
                          background: v >= 70 ? T.emerald : T.rose,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 20,
                      borderRadius: 4,
                      background: `${T.textFaint}20`,
                      border: `1px dashed ${T.textFaint}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 8, color: T.textFaint }}>TBD</span>
                  </div>
                )}
                <span style={{ fontSize: 9.5, color: T.textMuted }}>
                  {months[i]}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
            Passing threshold:{" "}
            <span style={{ color: T.amber, fontWeight: 600 }}>75%</span>
          </div>
        </div>

        {/* Learning Activity */}
        <div
          style={{
            background: T.card,
            borderRadius: 14,
            padding: "18px 20px",
            border: `1px solid ${T.border}`,
          }}
        >
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.text,
              marginBottom: 14,
            }}
          >
            Monthly Learning Activity
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 100,
            }}
          >
            {learningMins.map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, color: T.blue }}>
                  {v}m
                </span>
                <div
                  style={{
                    width: "100%",
                    borderRadius: 4,
                    height: `${(v / 210) * 100}%`,
                    minHeight: 8,
                    background: `${T.blue}30`,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 4,
                      background: T.blue,
                      opacity: 0.5,
                    }}
                  />
                </div>
                <span style={{ fontSize: 9.5, color: T.textMuted }}>
                  {months[i]}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
            Total this quarter:{" "}
            <span style={{ color: T.blue, fontWeight: 600 }}>8h 41m</span>
          </div>
        </div>
      </div>

      {/* Peer Benchmarking */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Peer Benchmarking (Anonymized)
        </h3>
        <div
          style={{
            background: T.card,
            borderRadius: 13,
            overflow: "hidden",
            border: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
              padding: "10px 18px",
              gap: 10,
              borderBottom: `1px solid ${T.border}`,
              background: T.cardRaised,
            }}
          >
            {["Metric", "You", "Team Avg", "Top Performer"].map((h) => (
              <div
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.textFaint,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {h}
              </div>
            ))}
          </div>
          {peerBench.map((p, i) => {
            const youBetter = p.invert ? p.you < p.team : p.you > p.team;
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                  padding: "12px 18px",
                  gap: 10,
                  alignItems: "center",
                  borderBottom:
                    i < peerBench.length - 1 ? `1px solid ${T.border}` : "none",
                }}
              >
                <span
                  style={{ fontSize: 12.5, fontWeight: 500, color: T.text }}
                >
                  {p.metric}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: youBetter ? T.emerald : T.amber,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {p.you}
                  {p.unit
                    ? ` ${p.unit}`
                    : p.metric.includes("Score") || p.metric.includes("Avg")
                      ? "%"
                      : ""}
                </span>
                <span style={{ fontSize: 13, color: T.textMuted }}>
                  {p.team}
                  {p.unit
                    ? ` ${p.unit}`
                    : p.metric.includes("Score") || p.metric.includes("Avg")
                      ? "%"
                      : ""}
                </span>
                <span
                  style={{ fontSize: 13, color: T.violet, fontWeight: 600 }}
                >
                  {p.top}
                  {p.unit
                    ? ` ${p.unit}`
                    : p.metric.includes("Score") || p.metric.includes("Avg")
                      ? "%"
                      : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Competency Trajectory */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Competency Growth Over Time
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
          }}
        >
          {[
            {
              name: "Clinical Knowledge",
              start: 65,
              now: 78,
              color: T.emerald,
            },
            {
              name: "Competitive Positioning",
              start: 32,
              now: 52,
              color: T.amber,
            },
            { name: "Objection Handling", start: 58, now: 65, color: T.amber },
            { name: "Selling Skills", start: 68, now: 74, color: T.blue },
            { name: "Compliance", start: 87, now: 91, color: T.emerald },
            { name: "Territory Mgmt", start: 60, now: 70, color: T.blue },
          ].map((c, i) => {
            const delta = c.now - c.start;
            return (
              <div
                key={i}
                style={{
                  background: T.card,
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: `1px solid ${T.border}`,
                  animation: `fadeUp .3s ease ${i * 0.04}s both`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: T.text }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: T.emerald }}
                  >
                    +{delta}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, color: T.textMuted }}>
                    {c.start}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      position: "relative",
                      height: 6,
                      borderRadius: 3,
                      background: `${c.color}12`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        height: "100%",
                        borderRadius: 3,
                        width: `${c.start}%`,
                        background: `${c.color}30`,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        height: "100%",
                        borderRadius: 3,
                        width: `${c.now}%`,
                        background: c.color,
                        animation: "progressFill 1s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: c.color }}
                  >
                    {c.now}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// PRE-CALL PREP — Field Performance Tool
// ═══════════════════════════════════════════════
const PreCallView = () => {
  const [selectedHCP, setSelectedHCP] = useState(null);

  const hcps = [
    {
      id: 1,
      name: "Dr. Raj Patel",
      specialty: "Endocrinology",
      setting: "Academic Medical Center",
      lastVisit: "Feb 22",
      nextVisit: "Mar 14",
      priority: "High",
      prescribing: "Favors tirzepatide; moderate Ozempic volume",
      intel:
        "Published recent paper on dual agonist mechanisms. Challenges reps on clinical data. Responds to CV outcomes evidence.",
      yourGaps: ["MOA Differentiation", "Head-to-Head Data Fluency"],
      objections: [
        '"Mounjaro shows better A1C — why Ozempic?"',
        "\"My patients don't have CV disease, so SELECT isn't relevant\"",
      ],
      talkingPoints: [
        "Lead with SELECT CV outcomes — 20% MACE reduction",
        "Bridge to real-world evidence breadth (5+ years post-market)",
        "Acknowledge SURPASS data, then seed CV protection as long-term advantage",
        "Use Acknowledge → Bridge → Seed framework",
      ],
      approach:
        "Dr. Patel values data depth — come prepared with specific endpoints. He respects reps who acknowledge competitive strengths honestly rather than dismissing them.",
    },
    {
      id: 2,
      name: "Dr. Sarah Kim",
      specialty: "Cardiology",
      setting: "Community Hospital",
      lastVisit: "Mar 3",
      nextVisit: "Mar 17",
      priority: "Medium",
      prescribing: "Heavy statin prescriber; new to GLP-1 class",
      intel:
        "Interested in cardiovascular risk reduction but unfamiliar with GLP-1 mechanisms. Prefers concise, outcomes-focused presentations.",
      yourGaps: ["Clinical Storytelling"],
      objections: [
        '"I\'m not comfortable prescribing diabetes drugs"',
        '"How does this fit with my patients\' existing statin therapy?"',
      ],
      talkingPoints: [
        "Reframe Ozempic as a CV risk reduction therapy, not a diabetes drug",
        "Lead with SELECT: designed specifically for CV patients",
        "Position as complementary to statins — different mechanism, additive benefit",
        "Keep it concise — she has 5-minute windows between patients",
      ],
      approach:
        "Dr. Kim is open to learning but needs simple framing. Avoid deep MOA discussion — focus on outcomes and patient selection criteria she can act on immediately.",
    },
    {
      id: 3,
      name: "Dr. Michael Torres",
      specialty: "Primary Care",
      setting: "Multi-physician Practice",
      lastVisit: "Feb 15",
      nextVisit: "Mar 13",
      priority: "High",
      prescribing:
        "High volume T2D patients; currently splits between Ozempic and Jardiance",
      intel:
        "Pragmatic prescriber focused on patient affordability and insurance coverage. Responds to real-world convenience arguments.",
      yourGaps: ["Formulary & Access Strategy", "Payer Objection Handling"],
      objections: [
        '"My patients can\'t afford GLP-1s"',
        '"Insurance keeps denying prior authorizations"',
      ],
      talkingPoints: [
        "Lead with patient support programs and co-pay card details",
        "Address PA process: offer to connect office staff with Novo Nordisk access team",
        "Present real-world adherence data — once-weekly dosing improves compliance",
        "Share formulary access updates for his top 3 insurance plans",
      ],
      approach:
        "Dr. Torres makes decisions based on what's practical for his patients. Come with specific access solutions, not just clinical data. His office manager is a key influencer.",
    },
  ];

  const selected = hcps.find((h) => h.id === selectedHCP);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: T.text,
            margin: "0 0 4px",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Pre-Call Prep
        </h2>
        <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
          AI-generated briefings tailored to each HCP, your competency profile,
          and recent learning. Select an upcoming visit to prepare.
        </p>
      </div>

      {/* HCP Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {hcps.map((h, i) => (
          <div
            key={h.id}
            className="hlift"
            onClick={() => setSelectedHCP(selectedHCP === h.id ? null : h.id)}
            style={{
              background: selectedHCP === h.id ? T.cardRaised : T.card,
              borderRadius: 14,
              padding: "18px 20px",
              border: `1px solid ${selectedHCP === h.id ? T.blue + "30" : T.border}`,
              cursor: "pointer",
              animation: `fadeUp .3s ease ${i * 0.05}s both`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: `${T.blue}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: T.blue,
                }}
              >
                {h.name
                  .split(" ")
                  .slice(1)
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>
                  {h.name}
                </div>
                <div style={{ fontSize: 11, color: T.textMuted }}>
                  {h.specialty}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <Badge color={T.violet} size="xs">
                {h.setting}
              </Badge>
              <Badge color={h.priority === "High" ? T.rose : T.amber} size="xs">
                {h.priority} Priority
              </Badge>
            </div>
            <div style={{ fontSize: 11.5, color: T.textSoft, marginBottom: 6 }}>
              Next visit:{" "}
              <strong style={{ color: T.text }}>{h.nextVisit}</strong>
            </div>
            <div style={{ fontSize: 11, color: T.textMuted }}>
              {h.prescribing}
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Prep Brief */}
      {selected && (
        <div style={{ animation: "scaleIn .25s ease" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${T.card} 0%, #101525 100%)`,
              borderRadius: 16,
              padding: "24px 26px",
              border: `1px solid ${T.borderLight}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 18 }}>⚡</span>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: T.text,
                  fontFamily: "'Outfit',sans-serif",
                  margin: 0,
                }}
              >
                AI Prep Brief — {selected.name}
              </h3>
              <Badge color={T.blue} size="sm">
                AI-Generated
              </Badge>
            </div>

            {/* Approach */}
            <div
              style={{
                background: `${T.blue}08`,
                borderRadius: 10,
                padding: "14px 16px",
                border: `1px solid ${T.blue}15`,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 4,
                }}
              >
                Recommended Approach
              </div>
              <div
                style={{ fontSize: 12.5, color: T.textSoft, lineHeight: 1.6 }}
              >
                {selected.approach}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 14,
              }}
            >
              {/* Likely Objections */}
              <div
                style={{
                  background: T.cardRaised,
                  borderRadius: 10,
                  padding: "14px 16px",
                  border: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: T.rose,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 8,
                  }}
                >
                  Likely Objections
                </div>
                {selected.objections.map((o, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        color: T.rose,
                        fontSize: 10,
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    >
                      ●
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: T.textSoft,
                        lineHeight: 1.5,
                        fontStyle: "italic",
                      }}
                    >
                      {o}
                    </span>
                  </div>
                ))}
              </div>

              {/* Talking Points */}
              <div
                style={{
                  background: T.cardRaised,
                  borderRadius: 10,
                  padding: "14px 16px",
                  border: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: T.emerald,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 8,
                  }}
                >
                  Key Talking Points
                </div>
                {selected.talkingPoints.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        color: T.emerald,
                        fontSize: 10,
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    >
                      ●
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: T.textSoft,
                        lineHeight: 1.5,
                      }}
                    >
                      {p}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Gaps Relevant to This Call */}
            <div
              style={{
                background: `${T.amber}08`,
                borderRadius: 10,
                padding: "14px 16px",
                border: `1px solid ${T.amber}15`,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.amber,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 6,
                }}
              >
                Your Competency Gaps Relevant to This Call
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {selected.yourGaps.map((g, i) => (
                  <Badge key={i} color={T.amber} size="sm">
                    {g}
                  </Badge>
                ))}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: T.textMuted,
                  marginTop: 8,
                  lineHeight: 1.5,
                }}
              >
                The AI Tutor recommends reviewing these areas before your visit.
                Consider running a quick HCP simulation in AI Tutor → HCP
                Practice mode.
              </div>
            </div>

            {/* Intel */}
            <div
              style={{
                background: T.cardRaised,
                borderRadius: 10,
                padding: "14px 16px",
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.violet,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 4,
                }}
              >
                HCP Intelligence
              </div>
              <div
                style={{ fontSize: 12.5, color: T.textSoft, lineHeight: 1.6 }}
              >
                {selected.intel}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════
// ACHIEVEMENTS — Motivation & Milestones
// ═══════════════════════════════════════════════
const AchievementsView = () => {
  const milestones = [
    {
      name: "First Certification",
      desc: "Earned your first Echo certification",
      date: "Dec 5, 2025",
      icon: "",
      color: T.emerald,
      earned: true,
    },
    {
      name: "Triple Certified",
      desc: "Passed 3 certifications across different therapy areas",
      date: "Feb 12, 2026",
      icon: "",
      color: T.emerald,
      earned: true,
    },
    {
      name: "AI Tutor Power User",
      desc: "Completed 10+ AI Tutor sessions",
      date: "Mar 3, 2026",
      icon: "",
      color: T.emerald,
      earned: true,
    },
    {
      name: "Comeback Story",
      desc: "Failed an Echo attempt, completed remediation, and re-certified",
      date: null,
      icon: "",
      color: T.amber,
      earned: false,
      progress: 75,
      progressLabel: "3/4 steps — complete remediation + re-certify",
    },
    {
      name: "Perfect Score",
      desc: "Score 95%+ on an Echo certification attempt",
      date: null,
      icon: "",
      color: T.amber,
      earned: false,
      progress: 50,
      progressLabel: "Best so far: 92%",
    },
    {
      name: "Full Competency",
      desc: "Achieve 80%+ across all 6 competency areas",
      date: null,
      icon: "",
      color: T.rose,
      earned: false,
      progress: 33,
      progressLabel: "2 of 6 areas at 80%+",
    },
    {
      name: "Streak Master",
      desc: "Complete learning activity 5 consecutive days",
      date: null,
      icon: "",
      color: T.rose,
      earned: false,
      progress: 60,
      progressLabel: "3 of 5 days this streak",
    },
    {
      name: "Knowledge Leader",
      desc: "Score in the top 10% of your region across all competencies",
      date: null,
      icon: "",
      color: T.rose,
      earned: false,
      progress: 20,
      progressLabel: "Currently top 30%",
    },
  ];

  const streakDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const streakDone = [true, true, true, false, false];

  const timeline = [
    {
      date: "Mar 7",
      event: "Scored 91% on Competitive Landscape AI Module",
      type: "score",
      color: T.emerald,
    },
    {
      date: "Mar 5",
      event: "Completed 3rd AI Tutor session this week",
      type: "streak",
      color: T.blue,
    },
    {
      date: "Mar 3",
      event: "Unlocked: AI Tutor Power User milestone",
      type: "milestone",
      color: T.violet,
    },
    {
      date: "Feb 28",
      event: "Echo Attempt #2 — Ozempic® CI (54%)",
      type: "attempt",
      color: T.rose,
    },
    {
      date: "Feb 12",
      event: "Certified: Dupixent® Clinical Data Mastery (92%)",
      type: "cert",
      color: T.emerald,
    },
    {
      date: "Jan 18",
      event: "Certified: Entresto® Cardiology Positioning (88%, 2nd attempt)",
      type: "cert",
      color: T.emerald,
    },
    {
      date: "Dec 5",
      event: "First Certification! Keytruda® Indication Expansion (95%)",
      type: "milestone",
      color: T.violet,
    },
  ];

  const earned = milestones.filter((m) => m.earned).length;
  const total = milestones.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 12,
        }}
      >
        {[
          {
            l: "Milestones Earned",
            v: `${earned}/${total}`,
            s: `${total - earned} in progress`,
            c: T.emerald,
          },
          { l: "Current Streak", v: "3 days", s: "Best: 7 days", c: T.orange },
          {
            l: "Total Learning Time",
            v: "18.5h",
            s: "Since Oct 2025",
            c: T.blue,
          },
          {
            l: "Echo Attempts",
            v: "7",
            s: "3 certifications earned",
            c: T.violet,
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "18px 20px",
              border: `1px solid ${T.border}`,
              animation: `fadeUp .3s ease ${i * 0.04}s both`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: T.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 6,
              }}
            >
              {m.l}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: T.text,
                fontFamily: "'Outfit',sans-serif",
                lineHeight: 1,
              }}
            >
              {m.v}
            </div>
            <div
              style={{
                fontSize: 11,
                color: m.c,
                fontWeight: 500,
                marginTop: 5,
              }}
            >
              {m.s}
            </div>
          </div>
        ))}
      </div>

      {/* Active Streak */}
      <div
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "18px 22px",
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 18 }}>🔥</span>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.text,
              fontFamily: "'Outfit',sans-serif",
              margin: 0,
            }}
          >
            Weekly Learning Streak
          </h3>
          <Badge color={T.orange} size="sm">
            3 Days Active
          </Badge>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {streakDays.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  margin: "0 auto 6px",
                  background: streakDone[i] ? `${T.orange}15` : T.cardRaised,
                  border: `2px solid ${streakDone[i] ? T.orange : T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: streakDone[i] ? 16 : 14,
                  color: streakDone[i] ? T.orange : T.textFaint,
                  transition: "all .3s",
                }}
              >
                {streakDone[i] ? "🔥" : "○"}
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: streakDone[i] ? T.text : T.textMuted,
                  fontWeight: streakDone[i] ? 600 : 400,
                }}
              >
                {d}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Milestones
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 10,
          }}
        >
          {milestones.map((m, i) => (
            <div
              key={i}
              style={{
                background: m.earned ? T.card : T.cardRaised,
                borderRadius: 13,
                padding: "16px 18px",
                border: `1px solid ${m.earned ? T.border : T.border}`,
                opacity: m.earned ? 1 : 0.85,
                animation: `fadeUp .3s ease ${i * 0.03}s both`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {m.earned && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: m.color,
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: m.earned ? `${m.color}12` : T.glass,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  {m.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: m.earned ? T.text : T.textSoft,
                    }}
                  >
                    {m.name}
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>
                    {m.desc}
                  </div>
                </div>
                {m.earned && (
                  <Badge color={T.emerald} size="xs">
                    Earned
                  </Badge>
                )}
              </div>
              {m.earned && m.date && (
                <div style={{ fontSize: 10.5, color: T.textMuted }}>
                  {m.date}
                </div>
              )}
              {!m.earned && m.progress !== undefined && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 10.5, color: T.textMuted }}>
                      {m.progressLabel}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        color: m.color,
                        fontWeight: 600,
                      }}
                    >
                      {m.progress}%
                    </span>
                  </div>
                  <Bar value={m.progress} color={m.color} h={4} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* XP Leaderboard */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          XP Leaderboard — Your Region
        </h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {/* Weekly */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: `1px solid ${T.border}`,
                background: T.cardRaised,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
                This Week
              </span>
              <Badge color={T.orange} size="xs">
                Active
              </Badge>
            </div>
            {[
              {
                rank: 1,
                name: "Lisa Thompson",
                xp: 320,
                badge: "",
                you: false,
              },
              {
                rank: 2,
                name: "Marcus Rivera",
                xp: 280,
                badge: "",
                you: false,
              },
              {
                rank: 3,
                name: "You (Sarah Chen)",
                xp: 210,
                badge: "",
                you: true,
              },
              { rank: 4, name: "David Park", xp: 190, badge: "", you: false },
              { rank: 5, name: "Emily Watson", xp: 60, badge: "", you: false },
              {
                rank: 6,
                name: "James Morrison",
                xp: 30,
                badge: "",
                you: false,
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 18px",
                  borderBottom: i < 5 ? `1px solid ${T.border}` : "none",
                  background: r.you ? `${T.blue}06` : "transparent",
                }}
              >
                <span
                  style={{
                    fontSize: r.badge ? 14 : 11,
                    width: 22,
                    textAlign: "center",
                    fontWeight: 700,
                    color: r.rank <= 3 ? T.amber : T.textMuted,
                  }}
                >
                  {r.badge || `#${r.rank}`}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    fontWeight: r.you ? 600 : 400,
                    color: r.you ? T.blue : T.text,
                  }}
                >
                  {r.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.orange,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  +{r.xp}
                </span>
              </div>
            ))}
          </div>

          {/* All Time */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: `1px solid ${T.border}`,
                background: T.cardRaised,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
                All Time
              </span>
              <Badge color={T.violet} size="xs">
                Since Oct 2025
              </Badge>
            </div>
            {[
              {
                rank: 1,
                name: "Lisa Thompson",
                xp: 4250,
                badge: "",
                you: false,
              },
              {
                rank: 2,
                name: "Marcus Rivera",
                xp: 3680,
                badge: "",
                you: false,
              },
              {
                rank: 3,
                name: "David Park",
                xp: 2890,
                badge: "",
                you: false,
              },
              {
                rank: 4,
                name: "You (Sarah Chen)",
                xp: 1960,
                badge: "",
                you: true,
              },
              {
                rank: 5,
                name: "Emily Watson",
                xp: 1420,
                badge: "",
                you: false,
              },
              {
                rank: 6,
                name: "James Morrison",
                xp: 890,
                badge: "",
                you: false,
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 18px",
                  borderBottom: i < 5 ? `1px solid ${T.border}` : "none",
                  background: r.you ? `${T.blue}06` : "transparent",
                }}
              >
                <span
                  style={{
                    fontSize: r.badge ? 14 : 11,
                    width: 22,
                    textAlign: "center",
                    fontWeight: 700,
                    color: r.rank <= 3 ? T.amber : T.textMuted,
                  }}
                >
                  {r.badge || `#${r.rank}`}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    fontWeight: r.you ? 600 : 400,
                    color: r.you ? T.blue : T.text,
                  }}
                >
                  {r.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.orange,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {r.xp.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* XP Breakdown */}
        <div
          style={{
            background: T.card,
            borderRadius: 14,
            padding: "18px 22px",
            border: `1px solid ${T.border}`,
            marginTop: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
              Your XP Breakdown
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: T.orange,
                fontFamily: "'Outfit',sans-serif",
                marginLeft: "auto",
              }}
            >
              1,960 XP
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 8,
            }}
          >
            {[
              { source: "Courses", xp: 680, icon: "", color: T.blue },
              { source: "AI Modules", xp: 420, icon: "", color: T.violet },
              { source: "Quizzes", xp: 340, icon: "", color: T.teal },
              { source: "AI Tutor", xp: 310, icon: "", color: T.emerald },
              {
                source: "Streaks & Bonuses",
                xp: 210,
                icon: "",
                color: T.orange,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: T.cardRaised,
                  borderRadius: 10,
                  padding: "12px",
                  textAlign: "center",
                  border: `1px solid ${T.border}`,
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: s.color,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {s.xp}
                </div>
                <div
                  style={{ fontSize: 9.5, color: T.textMuted, marginTop: 2 }}
                >
                  {s.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Development Timeline */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 12,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Your Development Journey
        </h3>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 15,
              top: 8,
              bottom: 8,
              width: 2,
              background: T.border,
              borderRadius: 2,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {timeline.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  animation: `fadeUp .25s ease ${i * 0.03}s both`,
                }}
              >
                <div
                  style={{
                    width: 32,
                    display: "flex",
                    justifyContent: "center",
                    flexShrink: 0,
                    paddingTop: 10,
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: t.color,
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    background: T.card,
                    borderRadius: 10,
                    padding: "10px 14px",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 10.5,
                        color: T.textMuted,
                        fontFamily: "'JetBrains Mono',monospace",
                      }}
                    >
                      {t.date}
                    </span>
                    <span
                      style={{ fontSize: 12, color: T.text, fontWeight: 500 }}
                    >
                      {t.event}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// PROFILE — Sarah Chen
// ═══════════════════════════════════════════════
const ProfileView = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const profile = {
    name: "Sarah Chen",
    title: "Specialty Sales Representative",
    region: "East Region — Mid-Atlantic",
    territory: "Philadelphia Metro / Southern NJ",
    manager: "David Marchetti, Regional Sales Director",
    team: "Oncology & Metabolic East",
    startDate: "June 2024",
    tenure: "1 year, 9 months",
    email: "sarah.chen@company.com",
    employeeId: "EMP-04821",
    therapyAreas: [
      "Metabolic / GLP-1",
      "Oncology",
      "Cardiology",
      "Immunology",
      "Dermatology",
      "Neuroscience",
    ],
    products: [
      "Ozempic®",
      "Keytruda®",
      "Entresto®",
      "Dupixent®",
      "SKYRIZI®",
      "Reyvow®",
    ],
  };

  const certHistory = [
    {
      name: "Keytruda® Indication Expansion",
      date: "Dec 5, 2025",
      score: 95,
      attempts: 1,
      status: "Active",
    },
    {
      name: "Entresto® Cardiology Positioning",
      date: "Jan 18, 2026",
      score: 88,
      attempts: 2,
      status: "Active",
    },
    {
      name: "Dupixent® Clinical Data Mastery",
      date: "Feb 12, 2026",
      score: 92,
      attempts: 1,
      status: "Active",
    },
  ];

  const competencySummary = [
    { name: "Clinical Knowledge", score: 78, color: T.emerald },
    { name: "Competitive Positioning", score: 52, color: T.amber },
    { name: "Objection Handling", score: 65, color: T.amber },
    { name: "Selling Skills", score: 74, color: T.blue },
    { name: "Regulatory Compliance", score: 91, color: T.emerald },
    { name: "Territory Management", score: 70, color: T.blue },
  ];
  const avgComp = Math.round(
    competencySummary.reduce((a, c) => a + c.score, 0) /
      competencySummary.length,
  );

  const activityStats = [
    { label: "Total Learning Hours", value: "18.5h", period: "Since Oct 2025" },
    {
      label: "AI Tutor Sessions",
      value: "14",
      period: "Across 3 certifications",
    },
    { label: "Echo Attempts", value: "7", period: "3 passed, 2 in progress" },
    {
      label: "Courses Completed",
      value: "12",
      period: "8 required, 4 elective",
    },
    { label: "Quizzes Taken", value: "23", period: "Avg score: 81%" },
    {
      label: "HCP Simulations",
      value: "6",
      period: "Avg coaching score: 7.8/10",
    },
  ];

  const milestones = [
    { icon: "🏆", label: "First Certification", date: "Dec 2025" },
    { icon: "⭐", label: "Triple Certified", date: "Feb 2026" },
    { icon: "⚡", label: "AI Tutor Power User", date: "Mar 2026" },
  ];

  const preferences = [
    {
      label: "Learning Style",
      value: "Visual + Interactive",
      note: "Based on engagement patterns",
    },
    {
      label: "Preferred Session Length",
      value: "15–25 min",
      note: "Highest completion rate",
    },
    {
      label: "Peak Learning Time",
      value: "8:00–10:00 AM",
      note: "Tue–Thu most active",
    },
    {
      label: "AI Tutor Mode Preference",
      value: "Deep Dive + HCP Practice",
      note: "Most time spent in these modes",
    },
    {
      label: "Content Format",
      value: "AI Modules > Courses > Workshops",
      note: "By engagement score",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity & Stats" },
    { id: "preferences", label: "AI Learning Profile" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      {/* Profile Header */}
      <div
        style={{
          background: `linear-gradient(135deg, #101430 0%, ${T.card} 60%, #0F1520 100%)`,
          borderRadius: 20,
          padding: "28px 30px",
          border: `1px solid ${T.border}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -30,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: `${T.blue}04`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: 60,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `${T.violet}03`,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 22,
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              flexShrink: 0,
              background: `linear-gradient(135deg,${T.blue}25,${T.violet}25)`,
              border: `2px solid ${T.borderLight}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: T.blue,
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            SC
          </div>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: T.text,
                margin: "0 0 2px",
                fontFamily: "'Outfit',sans-serif",
                letterSpacing: -0.3,
              }}
            >
              {profile.name}
            </h1>
            <div style={{ fontSize: 14, color: T.textSoft, marginBottom: 8 }}>
              {profile.title}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge color={T.blue} size="sm">
                {profile.region}
              </Badge>
              <Badge color={T.violet} size="sm">
                {profile.team}
              </Badge>
              <Badge color={T.emerald} size="sm">
                Tenure: {profile.tenure}
              </Badge>
            </div>
          </div>
          {/* Overall Score */}
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <Ring
              value={avgComp}
              size={70}
              stroke={5}
              color={avgComp >= 70 ? T.emerald : T.amber}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: avgComp >= 70 ? T.emerald : T.amber,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {avgComp}
              </span>
            </Ring>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>
              Competency Avg
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "9px 18px",
              borderRadius: 9,
              border: `1px solid ${activeTab === t.id ? T.blue + "30" : T.border}`,
              background: activeTab === t.id ? T.blueGlow : T.card,
              color: activeTab === t.id ? T.blue : T.textMuted,
              fontSize: 12.5,
              fontWeight: activeTab === t.id ? 600 : 500,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              transition: "all .15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            animation: "fadeIn .25s ease",
          }}
        >
          {/* Info Grid */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div
              style={{
                background: T.card,
                borderRadius: 14,
                padding: "20px 22px",
                border: `1px solid ${T.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 14,
                }}
              >
                Role Details
              </h3>
              {[
                { l: "Territory", v: profile.territory },
                { l: "Manager", v: profile.manager },
                { l: "Start Date", v: profile.startDate },
                { l: "Employee ID", v: profile.employeeId },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: i < 3 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <span style={{ fontSize: 12, color: T.textMuted }}>
                    {r.l}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 500, color: T.text }}
                  >
                    {r.v}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                background: T.card,
                borderRadius: 14,
                padding: "20px 22px",
                border: `1px solid ${T.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 14,
                }}
              >
                Assigned Therapy Areas
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                {profile.therapyAreas.map((ta, i) => (
                  <Badge key={i} color={T.violet} size="sm">
                    {ta}
                  </Badge>
                ))}
              </div>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 10,
                }}
              >
                Assigned Products
              </h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {profile.products.map((p, i) => (
                  <Badge key={i} color={T.blue} size="sm">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Competency Heatmap */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "20px 22px",
              border: `1px solid ${T.border}`,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.text,
                marginBottom: 14,
              }}
            >
              Competency Profile
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {competencySummary.map((c, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: T.text,
                      width: 160,
                      flexShrink: 0,
                    }}
                  >
                    {c.name}
                  </span>
                  <div style={{ flex: 1 }}>
                    <Bar value={c.score} color={c.color} h={8} />
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: c.color,
                      fontFamily: "'Outfit',sans-serif",
                      minWidth: 36,
                      textAlign: "right",
                    }}
                  >
                    {c.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Earned */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "20px 22px",
              border: `1px solid ${T.border}`,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.text,
                marginBottom: 14,
              }}
            >
              Certifications Earned
            </h3>
            {certHistory.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 0",
                  borderBottom:
                    i < certHistory.length - 1
                      ? `1px solid ${T.border}`
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: T.emeraldDim,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: T.emerald,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>
                    {c.date} · {c.attempts} attempt{c.attempts > 1 ? "s" : ""}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: T.emerald,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {c.score}%
                </span>
                <Badge color={T.emerald} size="xs">
                  {c.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Milestones */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "20px 22px",
              border: `1px solid ${T.border}`,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.text,
                marginBottom: 14,
              }}
            >
              Milestones Earned
            </h3>
            <div style={{ display: "flex", gap: 12 }}>
              {milestones.map((m, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: T.cardRaised,
                    borderRadius: 10,
                    padding: "14px",
                    textAlign: "center",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
                    {m.label}
                  </div>
                  <div
                    style={{ fontSize: 10.5, color: T.textMuted, marginTop: 2 }}
                  >
                    {m.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            animation: "fadeIn .25s ease",
          }}
        >
          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
            }}
          >
            {activityStats.map((s, i) => (
              <div
                key={i}
                style={{
                  background: T.card,
                  borderRadius: 13,
                  padding: "18px 20px",
                  border: `1px solid ${T.border}`,
                  animation: `fadeUp .3s ease ${i * 0.04}s both`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: T.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: T.text,
                    fontFamily: "'Outfit',sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: T.blue,
                    fontWeight: 500,
                    marginTop: 5,
                  }}
                >
                  {s.period}
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Breakdown */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "20px 22px",
              border: `1px solid ${T.border}`,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.text,
                marginBottom: 14,
              }}
            >
              Monthly Activity Breakdown
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6,1fr)",
                gap: 10,
              }}
            >
              {[
                { month: "Oct", hours: 2.0, courses: 2, quizzes: 3, echo: 1 },
                { month: "Nov", hours: 1.6, courses: 1, quizzes: 2, echo: 1 },
                { month: "Dec", hours: 3.0, courses: 3, quizzes: 5, echo: 2 },
                { month: "Jan", hours: 3.5, courses: 2, quizzes: 4, echo: 1 },
                { month: "Feb", hours: 4.8, courses: 3, quizzes: 6, echo: 2 },
                { month: "Mar", hours: 1.6, courses: 1, quizzes: 3, echo: 0 },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: T.cardRaised,
                    borderRadius: 10,
                    padding: "12px 10px",
                    textAlign: "center",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.text,
                      marginBottom: 8,
                    }}
                  >
                    {m.month}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: T.blue,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    {m.hours}h
                  </div>
                  <div
                    style={{
                      fontSize: 9.5,
                      color: T.textMuted,
                      marginTop: 6,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.courses} courses
                    <br />
                    {m.quizzes} quizzes
                    <br />
                    {m.echo} Echo
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Echo Performance History */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "20px 22px",
              border: `1px solid ${T.border}`,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.text,
                marginBottom: 14,
              }}
            >
              Echo Performance History
            </h3>
            {[
              {
                cert: "Keytruda® Indication Expansion",
                date: "Dec 5",
                score: 95,
                result: "Pass",
                att: 1,
              },
              {
                cert: "Entresto® Cardiology Positioning",
                date: "Dec 20",
                score: 62,
                result: "Fail",
                att: 1,
              },
              {
                cert: "Entresto® Cardiology Positioning",
                date: "Jan 18",
                score: 88,
                result: "Pass",
                att: 2,
              },
              {
                cert: "Dupixent® Clinical Data Mastery",
                date: "Feb 12",
                score: 92,
                result: "Pass",
                att: 1,
              },
              {
                cert: "SKYRIZI® Objection Handling",
                date: "Feb 20",
                score: 68,
                result: "Fail",
                att: 1,
              },
              {
                cert: "Ozempic® Competitive Intel",
                date: "Feb 22",
                score: 48,
                result: "Fail",
                att: 1,
              },
              {
                cert: "Ozempic® Competitive Intel",
                date: "Feb 28",
                score: 54,
                result: "Fail",
                att: 2,
              },
            ].map((e, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr .8fr .6fr .6fr .5fr",
                  padding: "10px 0",
                  gap: 10,
                  alignItems: "center",
                  borderBottom: i < 6 ? `1px solid ${T.border}` : "none",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 500, color: T.text }}>
                  {e.cert}
                </span>
                <span style={{ fontSize: 11, color: T.textMuted }}>
                  {e.date}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: e.score >= 70 ? T.emerald : T.rose,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {e.score}%
                </span>
                <Badge
                  color={e.result === "Pass" ? T.emerald : T.rose}
                  size="xs"
                >
                  {e.result}
                </Badge>
                <span style={{ fontSize: 11, color: T.textMuted }}>
                  Att #{e.att}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Learning Profile Tab */}
      {activeTab === "preferences" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            animation: "fadeIn .25s ease",
          }}
        >
          {/* AI Profile Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${T.cardRaised} 0%, ${T.card} 100%)`,
              borderRadius: 14,
              padding: "20px 22px",
              border: `1px solid ${T.borderLight}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 14 }}>⚡</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.blue,
                  letterSpacing: 0.3,
                }}
              >
                AI-GENERATED LEARNING PROFILE
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: T.textSoft,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              This profile is automatically generated by the AI based on your
              engagement patterns, quiz performance, session timing, and content
              preferences. It's used to personalize your AI Tutor sessions,
              content recommendations, and adaptive quiz difficulty.
            </p>
          </div>

          {/* Preferences */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "20px 22px",
              border: `1px solid ${T.border}`,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.text,
                marginBottom: 14,
              }}
            >
              Detected Learning Preferences
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {preferences.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 16px",
                    background: T.cardRaised,
                    borderRadius: 10,
                    border: `1px solid ${T.border}`,
                    animation: `slideR .3s ease ${i * 0.04}s both`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}
                    >
                      {p.label}
                    </div>
                    <div
                      style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}
                    >
                      {p.note}
                    </div>
                  </div>
                  <Badge color={T.blue} size="md">
                    {p.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Growth */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div
              style={{
                background: T.card,
                borderRadius: 14,
                padding: "20px 22px",
                border: `1px solid ${T.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.emerald,
                  marginBottom: 12,
                }}
              >
                AI-Identified Strengths
              </h3>
              {[
                "Strong at applying frameworks when coached (Ack→Bridge→Seed)",
                "Excellent compliance instincts — rarely needs correction",
                "High engagement with AI Tutor HCP simulations",
                "Quick to self-correct after receiving quiz feedback",
                "Consistent daily learning habit (8–10 AM window)",
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "flex-start",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      color: T.emerald,
                      fontSize: 10,
                      marginTop: 3,
                      flexShrink: 0,
                    }}
                  >
                    ●
                  </span>
                  <span
                    style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.5 }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                background: T.card,
                borderRadius: 14,
                padding: "20px 22px",
                border: `1px solid ${T.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.amber,
                  marginBottom: 12,
                }}
              >
                AI-Identified Growth Areas
              </h3>
              {[
                "Tends to get defensive when challenged on competitive data",
                "Struggles to pivot from mechanism to outcomes in time-pressured calls",
                "Under-utilizes real-world evidence in payer conversations",
                "Needs more practice with formulary/access objection scenarios",
                "Could benefit from more peer learning engagement",
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "flex-start",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      color: T.amber,
                      fontSize: 10,
                      marginTop: 3,
                      flexShrink: 0,
                    }}
                  >
                    ●
                  </span>
                  <span
                    style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.5 }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tutor Adaptation Settings */}
          <div
            style={{
              background: T.card,
              borderRadius: 14,
              padding: "20px 22px",
              border: `1px solid ${T.border}`,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.text,
                marginBottom: 14,
              }}
            >
              AI Tutor Personalization Settings
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 10,
              }}
            >
              {[
                {
                  label: "Quiz Difficulty",
                  value: "Adaptive (currently Level 3/5)",
                  desc: "Auto-adjusts based on your real-time performance",
                },
                {
                  label: "Coaching Tone",
                  value: "Direct & Evidence-Based",
                  desc: "Matches your preference for data-driven feedback",
                },
                {
                  label: "Session Pacing",
                  value: "Moderate",
                  desc: "Balanced between depth and time efficiency",
                },
                {
                  label: "Feedback Detail",
                  value: "High",
                  desc: "Detailed explanations after every quiz and simulation",
                },
                {
                  label: "Gap Prioritization",
                  value: "Auto (AI-ranked)",
                  desc: "AI determines which gaps to address first by impact",
                },
                {
                  label: "Content Modality",
                  value: "Mixed (visual + interactive)",
                  desc: "Optimized based on your highest completion rates",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: T.cardRaised,
                    borderRadius: 10,
                    padding: "12px 14px",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{ fontSize: 12, fontWeight: 600, color: T.text }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.blue,
                      fontWeight: 500,
                      marginBottom: 3,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 10.5, color: T.textMuted }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════
// MANAGER VIEWS
// ═══════════════════════════════════════════════

const mgrNavItems = [
  { id: "mgr_dash", label: "Team Dashboard", icon: icons.home },
  { id: "mgr_reps", label: "My Reps", icon: icons.coaching },
  { id: "mgr_certs", label: "Cert Management", icon: icons.cert },
  { id: "mgr_competencies", label: "Team Competencies", icon: icons.comp },
  { id: "mgr_insights", label: "Predictive Insights", icon: icons.insights },
  { id: "sep_m1", label: "sep", sep: true },
  { id: "mgr_coaching", label: "Coaching Planner", icon: icons.tutor },
  { id: "mgr_reports", label: "Reports & Export", icon: icons.lib },
];

// Team data used across manager views
const teamData = [
  {
    id: 1,
    name: "Sarah Chen",
    init: "SC",
    role: "Specialty Rep",
    certs: 6,
    certified: 3,
    avg: 71,
    ttc: "6.2d",
    readiness: 68,
    trend: "up",
    risk: false,
    gaps: ["MOA Differentiation", "Payer Objections"],
    activeCert: "Ozempic® CI",
    status: "Remediation",
    streak: 3,
    tutorSessions: 14,
    lastEcho: "Feb 28",
    xp: 1960,
    xpWeek: 210,
  },
  {
    id: 2,
    name: "Marcus Rivera",
    init: "MR",
    role: "Senior Rep",
    certs: 5,
    certified: 4,
    avg: 85,
    ttc: "5.1d",
    readiness: 91,
    trend: "up",
    risk: false,
    gaps: [],
    activeCert: "SKYRIZI® Launch",
    status: "In Progress",
    streak: 5,
    tutorSessions: 8,
    lastEcho: "Mar 5",
    xp: 3680,
    xpWeek: 280,
  },
  {
    id: 3,
    name: "Emily Watson",
    init: "EW",
    role: "Specialty Rep",
    certs: 6,
    certified: 2,
    avg: 64,
    ttc: "11.3d",
    readiness: 48,
    trend: "down",
    risk: true,
    gaps: ["Clinical Trial Data", "Competitive Messaging", "Closing"],
    activeCert: "Ozempic® CI",
    status: "Remediation",
    streak: 0,
    tutorSessions: 3,
    lastEcho: "Mar 1",
    xp: 1420,
    xpWeek: 60,
  },
  {
    id: 4,
    name: "David Park",
    init: "DP",
    role: "Specialty Rep",
    certs: 4,
    certified: 3,
    avg: 81,
    ttc: "7.0d",
    readiness: 76,
    trend: "stable",
    risk: false,
    gaps: ["KOL Engagement"],
    activeCert: "Entresto® Cardio",
    status: "In Progress",
    streak: 2,
    tutorSessions: 9,
    lastEcho: "Mar 6",
    xp: 2890,
    xpWeek: 190,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    init: "LT",
    role: "Senior Rep",
    certs: 5,
    certified: 5,
    avg: 91,
    ttc: "3.9d",
    readiness: 95,
    trend: "up",
    risk: false,
    gaps: [],
    activeCert: null,
    status: "All Certified",
    streak: 7,
    tutorSessions: 11,
    lastEcho: "Mar 2",
    xp: 4250,
    xpWeek: 320,
  },
  {
    id: 6,
    name: "James Morrison",
    init: "JM",
    role: "Specialty Rep",
    certs: 6,
    certified: 1,
    avg: 56,
    ttc: "14.2d",
    readiness: 32,
    trend: "down",
    risk: true,
    gaps: [
      "MOA Differentiation",
      "Payer Objections",
      "Clinical Storytelling",
      "Needs Assessment",
    ],
    activeCert: "Dupixent® Clinical",
    status: "Remediation",
    streak: 0,
    tutorSessions: 2,
    lastEcho: "Feb 25",
    xp: 890,
    xpWeek: 30,
  },
];

// ── Manager Dashboard ──
const MgrDashView = () => {
  const atRisk = teamData.filter((r) => r.risk).length;
  const avgReadiness = Math.round(
    teamData.reduce((a, r) => a + r.readiness, 0) / teamData.length,
  );
  const totalCertified = teamData.reduce((a, r) => a + r.certified, 0);
  const totalCerts = teamData.reduce((a, r) => a + r.certs, 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      {/* Welcome */}
      <div
        style={{
          background: `linear-gradient(135deg, #0E1230 0%, ${T.card} 100%)`,
          borderRadius: 18,
          padding: "24px 28px",
          border: `1px solid ${T.border}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -20,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `${T.violet}04`,
          }}
        />
        <div
          style={{
            fontSize: 13,
            color: T.textMuted,
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: T.text,
            margin: "0 0 6px",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Team Overview — Oncology & Metabolic East
        </h1>
        <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
          <span style={{ color: T.rose, fontWeight: 600 }}>
            {atRisk} reps at risk
          </span>{" "}
          · {totalCertified}/{totalCerts} certifications completed · Team
          readiness:{" "}
          <span
            style={{
              color: avgReadiness >= 70 ? T.emerald : T.amber,
              fontWeight: 600,
            }}
          >
            {avgReadiness}%
          </span>
        </p>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 12,
        }}
      >
        {[
          { l: "Team Size", v: "6", s: "2 Senior, 4 Specialty", c: T.blue },
          {
            l: "Avg Readiness",
            v: `${avgReadiness}%`,
            s: avgReadiness >= 70 ? "On track" : "Below target",
            c: avgReadiness >= 70 ? T.emerald : T.amber,
          },
          {
            l: "Avg Time to Certify",
            v: "7.9d",
            s: "Target: ≤7.0d",
            c: T.amber,
          },
          {
            l: "At-Risk Reps",
            v: String(atRisk),
            s: "Readiness < 50",
            c: T.rose,
          },
          {
            l: "Cert Completion",
            v: `${Math.round((totalCertified / totalCerts) * 100)}%`,
            s: `${totalCertified}/${totalCerts} total`,
            c: T.violet,
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: T.card,
              borderRadius: 13,
              padding: "16px 18px",
              border: `1px solid ${T.border}`,
              animation: `fadeUp .3s ease ${i * 0.04}s both`,
            }}
          >
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 500,
                color: T.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 6,
              }}
            >
              {m.l}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: T.text,
                fontFamily: "'Outfit',sans-serif",
                lineHeight: 1,
              }}
            >
              {m.v}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: m.c,
                fontWeight: 500,
                marginTop: 5,
              }}
            >
              {m.s}
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 10,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Action Required
        </h3>
        {[
          {
            color: T.rose,
            title: "At-Risk: James Morrison",
            desc: "Readiness score 32%. Only 1 certification passed. AI Tutor engagement critically low (2 sessions total). Recommend immediate coaching intervention.",
            icon: "⚠️",
          },
          {
            color: T.rose,
            title: "At-Risk: Emily Watson",
            desc: "Readiness score 48%, trending down. Time-to-certify 2.3x above team average. Streak broken — 0 learning days this week.",
            icon: "⚠️",
          },
          {
            color: T.amber,
            title: "Team Gap: Payer Objection Handling",
            desc: "4 of 6 reps scored below 60% on payer-related competencies. Consider team workshop or Echo scenario refresh.",
            icon: "📊",
          },
          {
            color: T.emerald,
            title: "Top Performer: Lisa Thompson",
            desc: "100% certification rate, lowest TTC (3.9d), highest readiness (95%). Candidate for peer mentoring or SME content contributor.",
            icon: "⭐",
          },
        ].map((a, i) => (
          <div
            key={i}
            style={{
              background: T.card,
              borderRadius: 11,
              padding: "14px 18px",
              marginBottom: 6,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${a.color}`,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              animation: `slideR .3s ease ${i * 0.05}s both`,
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>
              {a.icon}
            </span>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: a.color,
                  marginBottom: 2,
                }}
              >
                {a.title}
              </div>
              <div style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.5 }}>
                {a.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Team View */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 10,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Team at a Glance
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
          }}
        >
          {teamData.map((r, i) => (
            <div
              key={r.id}
              className="hlift"
              style={{
                background: r.risk ? `${T.card}` : `${T.card}`,
                borderRadius: 12,
                padding: "16px 18px",
                border: `1px solid ${r.risk ? T.rose + "20" : T.border}`,
                animation: `fadeUp .3s ease ${i * 0.04}s both`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {r.risk && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: T.rose,
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: `${T.blue}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.blue,
                  }}
                >
                  {r.init}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: 10.5, color: T.textMuted }}>
                    {r.role}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 10.5, color: T.textMuted }}>
                  Readiness
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color:
                      r.readiness >= 75
                        ? T.emerald
                        : r.readiness >= 50
                          ? T.amber
                          : T.rose,
                  }}
                >
                  {r.readiness}%
                </span>
              </div>
              <Bar
                value={r.readiness}
                color={
                  r.readiness >= 75
                    ? T.emerald
                    : r.readiness >= 50
                      ? T.amber
                      : T.rose
                }
                h={5}
              />
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                <Badge
                  color={
                    r.status === "All Certified"
                      ? T.emerald
                      : r.status === "Remediation"
                        ? T.rose
                        : T.blue
                  }
                  size="xs"
                >
                  {r.status}
                </Badge>
                {r.streak > 0 && (
                  <Badge color={T.orange} size="xs">
                    🔥 {r.streak}d streak
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Engagement & XP */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* XP Leaderboard */}
        <div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.text,
              marginBottom: 10,
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Team XP Leaderboard
          </h3>
          <div
            style={{
              background: T.card,
              borderRadius: 13,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
            }}
          >
            {[...teamData]
              .sort((a, b) => b.xp - a.xp)
              .map((r, i) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    borderBottom:
                      i < teamData.length - 1
                        ? `1px solid ${T.border}`
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: i < 3 ? 15 : 11,
                      width: 22,
                      textAlign: "center",
                      fontWeight: 700,
                      color: i < 3 ? T.amber : T.textMuted,
                    }}
                  >
                    {i === 0
                      ? "🥇"
                      : i === 1
                        ? "🥈"
                        : i === 2
                          ? "🥉"
                          : `#${i + 1}`}
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: `${T.blue}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: T.blue,
                    }}
                  >
                    {r.init}
                  </div>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontWeight: 500,
                      color: T.text,
                    }}
                  >
                    {r.name}
                  </span>
                  {r.streak > 0 && (
                    <span style={{ fontSize: 10, color: T.orange }}>
                      🔥{r.streak}
                    </span>
                  )}
                  <span
                    style={{ fontSize: 10, color: T.emerald, fontWeight: 600 }}
                  >
                    +{r.xpWeek}/wk
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: T.orange,
                      fontFamily: "'Outfit',sans-serif",
                      minWidth: 48,
                      textAlign: "right",
                    }}
                  >
                    {r.xp.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Gamification Engagement */}
        <div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.text,
              marginBottom: 10,
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Gamification Engagement
          </h3>
          <div
            style={{
              background: T.card,
              borderRadius: 13,
              padding: "18px 20px",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                { l: "Total Team XP", v: "15,090", c: T.orange },
                { l: "Avg XP / Rep", v: "2,515", c: T.blue },
                {
                  l: "Gamified Content",
                  v: "4 of 8",
                  s: "50% gamified",
                  c: T.violet,
                },
                {
                  l: "Leaderboard Active",
                  v: "5 of 6",
                  s: "83% participating",
                  c: T.emerald,
                },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: T.cardRaised,
                    borderRadius: 9,
                    padding: "10px 12px",
                    textAlign: "center",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: m.c,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    {m.v}
                  </div>
                  <div
                    style={{ fontSize: 9.5, color: T.textMuted, marginTop: 2 }}
                  >
                    {m.l}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.6 }}>
              <span style={{ color: T.emerald, fontWeight: 600 }}>
                ⚡ AI Insight:
              </span>{" "}
              Reps with active streaks (3+ days) have{" "}
              <span style={{ color: T.emerald, fontWeight: 600 }}>
                23% higher
              </span>{" "}
              Echo pass rates. James Morrison and Emily Watson have 0-day
              streaks — gamification engagement correlates with their at-risk
              status.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const MgrRepsView = () => {
  const [selectedRep, setSelectedRep] = useState(null);
  const sel = teamData.find((r) => r.id === selectedRep);
  const trendIcons = { up: "↗", down: "↘", stable: "→" };
  const trendColors = { up: T.emerald, down: T.rose, stable: T.amber };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: T.text,
            margin: "0 0 4px",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          My Representatives
        </h2>
        <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
          Click any rep to see their detailed development profile, gaps, and
          coaching recommendations.
        </p>
      </div>

      {/* Rep Table */}
      <div
        style={{
          background: T.card,
          borderRadius: 13,
          overflow: "hidden",
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr .7fr .7fr .7fr .8fr .6fr .6fr .5fr",
            padding: "10px 18px",
            gap: 8,
            borderBottom: `1px solid ${T.border}`,
            background: T.cardRaised,
          }}
        >
          {[
            "Representative",
            "Certified",
            "Avg Echo",
            "TTC",
            "Readiness",
            "XP",
            "Tutor",
            "Trend",
          ].map((h) => (
            <div
              key={h}
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                color: T.textFaint,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {h}
            </div>
          ))}
        </div>
        {teamData.map((r, i) => (
          <div
            key={r.id}
            onClick={() => setSelectedRep(selectedRep === r.id ? null : r.id)}
            className="hbright"
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr .7fr .7fr .7fr .8fr .6fr .6fr .5fr",
              padding: "12px 18px",
              gap: 8,
              alignItems: "center",
              cursor: "pointer",
              borderBottom:
                i < teamData.length - 1 ? `1px solid ${T.border}` : "none",
              background: r.risk
                ? `${T.rose}04`
                : selectedRep === r.id
                  ? T.cardRaised
                  : "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: `${T.blue}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.blue,
                }}
              >
                {r.init}
              </div>
              <div>
                <span
                  style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}
                >
                  {r.name}
                </span>
                {r.risk && (
                  <Badge color={T.rose} size="xs" bg={T.roseDim}>
                    At Risk
                  </Badge>
                )}
              </div>
            </div>
            <span style={{ fontSize: 12, color: T.text }}>
              {r.certified}/{r.certs}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: r.avg >= 75 ? T.emerald : r.avg >= 60 ? T.amber : T.rose,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {r.avg}%
            </span>
            <span style={{ fontSize: 12, color: T.textSoft }}>{r.ttc}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Bar
                value={r.readiness}
                color={
                  r.readiness >= 75
                    ? T.emerald
                    : r.readiness >= 50
                      ? T.amber
                      : T.rose
                }
                h={5}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color:
                    r.readiness >= 75
                      ? T.emerald
                      : r.readiness >= 50
                        ? T.amber
                        : T.rose,
                  minWidth: 26,
                }}
              >
                {r.readiness}
              </span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.orange }}>
              {r.xp.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: T.textSoft }}>
              {r.tutorSessions}
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: trendColors[r.trend],
              }}
            >
              {trendIcons[r.trend]}
            </span>
          </div>
        ))}
      </div>

      {/* Expanded Rep Detail */}
      {sel && (
        <div
          style={{
            animation: "scaleIn .25s ease",
            background: T.card,
            borderRadius: 14,
            padding: "22px 24px",
            border: `1px solid ${T.borderLight}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${T.blue}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                color: T.blue,
              }}
            >
              {sel.init}
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: T.text,
                  margin: 0,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {sel.name}
              </h3>
              <div style={{ fontSize: 12, color: T.textMuted }}>
                {sel.role} · Last Echo: {sel.lastEcho} · Streak: {sel.streak}{" "}
                days
              </div>
            </div>
            <Ring
              value={sel.readiness}
              size={56}
              stroke={4}
              color={
                sel.readiness >= 75
                  ? T.emerald
                  : sel.readiness >= 50
                    ? T.amber
                    : T.rose
              }
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color:
                    sel.readiness >= 75
                      ? T.emerald
                      : sel.readiness >= 50
                        ? T.amber
                        : T.rose,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {sel.readiness}
              </span>
            </Ring>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {/* Gaps */}
            <div
              style={{
                background: T.cardRaised,
                borderRadius: 10,
                padding: "14px 16px",
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.rose,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 8,
                }}
              >
                Active Competency Gaps
              </div>
              {sel.gaps.length ? (
                sel.gaps.map((g, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ color: T.rose, fontSize: 9, flexShrink: 0 }}>
                      ●
                    </span>
                    <span style={{ fontSize: 12, color: T.textSoft }}>{g}</span>
                  </div>
                ))
              ) : (
                <span style={{ fontSize: 12, color: T.emerald }}>
                  No active gaps — all competencies above threshold
                </span>
              )}
            </div>

            {/* AI Coaching Recommendation */}
            <div
              style={{
                background: `${T.blue}06`,
                borderRadius: 10,
                padding: "14px 16px",
                border: `1px solid ${T.blue}15`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 8,
                }}
              >
                AI Coaching Recommendation
              </div>
              <div style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.6 }}>
                {sel.risk
                  ? `${sel.name.split(" ")[0]} is significantly behind peers. Schedule a dedicated 1:1 coaching session focused on ${sel.gaps.slice(0, 2).join(" and ")}. Consider assigning AI Tutor practice sessions as mandatory prerequisites before next Echo attempt.`
                  : sel.readiness >= 90
                    ? `${sel.name.split(" ")[0]} is performing exceptionally. Consider nominating for peer mentoring role or SME content contributor to leverage their expertise.`
                    : `${sel.name.split(" ")[0]} is progressing well. Focus next 1:1 on ${sel.gaps.length ? sel.gaps[0] : "maintaining momentum"} and review their AI Tutor session insights for coaching opportunities.`}
              </div>
            </div>
          </div>

          {/* Manager Actions — Assessment + Coaching Note */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginTop: 14,
            }}
          >
            {/* Field Observation Assessment */}
            <div
              style={{
                background: T.cardRaised,
                borderRadius: 10,
                padding: "14px 16px",
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.violet,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 8,
                }}
              >
                Manager Field Observation
              </div>
              <p
                style={{ fontSize: 11, color: T.textMuted, margin: "0 0 10px" }}
              >
                Rate this rep from a recent ride-along or observed HCP
                interaction.
              </p>
              {[
                "Clinical Credibility",
                "Message Delivery",
                "Objection Response",
                "Closing Effectiveness",
                "Compliance Adherence",
              ].map((dim, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: T.text,
                      width: 140,
                      flexShrink: 0,
                    }}
                  >
                    {dim}
                  </span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: n <= 3 ? `${T.violet}20` : T.glass,
                          border: `1px solid ${n <= 3 ? T.violet + "30" : T.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 600,
                          color: n <= 3 ? T.violet : T.textFaint,
                          cursor: "pointer",
                        }}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                style={{
                  marginTop: 8,
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: T.violet,
                  color: T.white,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                  width: "100%",
                }}
              >
                Submit Field Observation
              </button>
            </div>

            {/* Send Coaching Note */}
            <div
              style={{
                background: T.cardRaised,
                borderRadius: 10,
                padding: "14px 16px",
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.emerald,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 8,
                }}
              >
                Send Coaching Note to {sel.name.split(" ")[0]}
              </div>
              <p
                style={{ fontSize: 11, color: T.textMuted, margin: "0 0 10px" }}
              >
                This will appear in {sel.name.split(" ")[0]}'s Coaching Hub and
                Notification Center.
              </p>
              <textarea
                placeholder={`Write a coaching note for ${sel.name.split(" ")[0]}... e.g., "Great progress on MOA differentiation. For your next HCP sim, try leading with the SELECT endpoint."`}
                style={{
                  width: "100%",
                  height: 80,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.card,
                  color: T.text,
                  fontSize: 11.5,
                  fontFamily: "'Outfit',sans-serif",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                  lineHeight: 1.5,
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: T.emerald,
                    color: T.white,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  Send Coaching Note
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.card,
                    color: T.textSoft,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  Assign AI Tutor Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Manager Cert Management ──
const MgrCertsView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 4px",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        Certification Management
      </h2>
      <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
        Monitor certification progress across your team. Assign new
        certifications and track the Echo → Tutor remediation loop.
      </p>
    </div>

    {/* Cert Pipeline */}
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}
    >
      {[
        {
          l: "Assigned",
          v: "8",
          s: "Awaiting first attempt",
          c: T.amber,
          reps: ["Sarah Chen", "James Morrison", "Emily Watson"],
        },
        {
          l: "In Progress",
          v: "6",
          s: "Echo attempted, not yet passed",
          c: T.blue,
          reps: ["Sarah Chen", "David Park", "Emily Watson"],
        },
        {
          l: "In Remediation",
          v: "4",
          s: "Active Tutor pathways",
          c: T.rose,
          reps: ["Sarah Chen", "Emily Watson", "James Morrison"],
        },
        {
          l: "Certified",
          v: "18",
          s: "Passed Echo threshold",
          c: T.emerald,
          reps: ["Lisa Thompson (5)", "Marcus Rivera (4)", "David Park (3)"],
        },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            background: T.card,
            borderRadius: 13,
            padding: "18px 20px",
            border: `1px solid ${T.border}`,
            borderTop: `3px solid ${s.c}`,
            animation: `fadeUp .3s ease ${i * 0.04}s both`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: T.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 6,
            }}
          >
            {s.l}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: T.text,
              fontFamily: "'Outfit',sans-serif",
              lineHeight: 1,
            }}
          >
            {s.v}
          </div>
          <div
            style={{
              fontSize: 10.5,
              color: s.c,
              fontWeight: 500,
              marginTop: 5,
              marginBottom: 10,
            }}
          >
            {s.s}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {s.reps.map((r, j) => (
              <span key={j} style={{ fontSize: 10.5, color: T.textMuted }}>
                {r}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* By Certification */}
    <div>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: T.text,
          marginBottom: 10,
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        Certification Status by Product
      </h3>
      {[
        {
          cert: "Ozempic® Competitive Intel",
          ta: "Metabolic",
          assigned: 6,
          passed: 1,
          remediation: 2,
          avg: 58,
          ttc: "9.4d",
        },
        {
          cert: "SKYRIZI® Objection Handling",
          ta: "Immunology",
          assigned: 5,
          passed: 2,
          remediation: 1,
          avg: 72,
          ttc: "6.8d",
        },
        {
          cert: "Dupixent® Clinical Data Mastery",
          ta: "Dermatology",
          assigned: 6,
          passed: 4,
          remediation: 1,
          avg: 81,
          ttc: "5.2d",
        },
        {
          cert: "Keytruda® Indication Expansion",
          ta: "Oncology",
          assigned: 5,
          passed: 4,
          remediation: 0,
          avg: 86,
          ttc: "4.5d",
        },
        {
          cert: "Entresto® Cardiology Positioning",
          ta: "Cardiology",
          assigned: 4,
          passed: 3,
          remediation: 0,
          avg: 79,
          ttc: "7.1d",
        },
        {
          cert: "Reyvow® Product Launch",
          ta: "Neuroscience",
          assigned: 6,
          passed: 0,
          remediation: 0,
          avg: 0,
          ttc: "—",
        },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            background: T.card,
            borderRadius: 11,
            padding: "14px 18px",
            marginBottom: 6,
            border: `1px solid ${T.border}`,
            display: "grid",
            gridTemplateColumns: "2.5fr 1fr .6fr .6fr .6fr .7fr .6fr",
            alignItems: "center",
            gap: 8,
            animation: `fadeUp .3s ease ${i * 0.03}s both`,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
              {c.cert}
            </div>
            <Badge color={T.violet} size="xs">
              {c.ta}
            </Badge>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Bar
                value={c.assigned ? (c.passed / c.assigned) * 100 : 0}
                color={T.emerald}
                h={5}
              />
              <span
                style={{
                  fontSize: 11,
                  color: T.textSoft,
                  whiteSpace: "nowrap",
                }}
              >
                {c.passed}/{c.assigned}
              </span>
            </div>
          </div>
          <Badge color={T.emerald} size="xs">
            {c.passed} Pass
          </Badge>
          <Badge color={T.rose} size="xs">
            {c.remediation} Rem
          </Badge>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color:
                c.avg >= 75
                  ? T.emerald
                  : c.avg >= 60
                    ? T.amber
                    : c.avg
                      ? T.rose
                      : T.textFaint,
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            {c.avg || "—"}%
          </span>
          <span style={{ fontSize: 12, color: T.textSoft }}>{c.ttc}</span>
          <button
            style={{
              padding: "5px 12px",
              borderRadius: 7,
              border: `1px solid ${T.border}`,
              background: T.cardRaised,
              color: T.textSoft,
              fontSize: 10.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Details
          </button>
        </div>
      ))}
    </div>
  </div>
);

// ── Manager Team Competencies ──
const MgrCompView = () => {
  const compAreas = [
    {
      name: "Clinical Knowledge",
      scores: [78, 82, 60, 80, 90, 52],
      avg: 74,
      color: T.emerald,
    },
    {
      name: "Competitive Positioning",
      scores: [52, 78, 42, 65, 88, 38],
      avg: 60,
      color: T.amber,
    },
    {
      name: "Objection Handling",
      scores: [65, 80, 55, 70, 85, 48],
      avg: 67,
      color: T.amber,
    },
    {
      name: "Selling Skills",
      scores: [74, 86, 62, 76, 89, 54],
      avg: 73,
      color: T.blue,
    },
    {
      name: "Regulatory Compliance",
      scores: [91, 88, 82, 86, 94, 78],
      avg: 87,
      color: T.emerald,
    },
    {
      name: "Territory Management",
      scores: [70, 75, 58, 72, 82, 55],
      avg: 69,
      color: T.amber,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: T.text,
            margin: "0 0 4px",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Team Competency Analysis
        </h2>
        <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
          Aggregate view across all reps. Identify systemic gaps and coaching
          priorities.
        </p>
      </div>

      {/* Team Competency Heatmap */}
      <div
        style={{
          background: T.card,
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr repeat(6,.7fr) .6fr",
            padding: "10px 18px",
            gap: 6,
            borderBottom: `1px solid ${T.border}`,
            background: T.cardRaised,
          }}
        >
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              color: T.textFaint,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Competency
          </div>
          {teamData.map((r) => (
            <div
              key={r.id}
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: T.textFaint,
                textAlign: "center",
              }}
            >
              {r.init}
            </div>
          ))}
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              color: T.textFaint,
              textAlign: "center",
            }}
          >
            AVG
          </div>
        </div>
        {compAreas.map((comp, ci) => (
          <div
            key={ci}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr repeat(6,.7fr) .6fr",
              padding: "12px 18px",
              gap: 6,
              alignItems: "center",
              borderBottom:
                ci < compAreas.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: T.text }}>
                {comp.name}
              </span>
            </div>
            {comp.scores.map((s, si) => (
              <div
                key={si}
                style={{
                  textAlign: "center",
                  padding: "4px 0",
                  borderRadius: 6,
                  background:
                    s >= 80 ? T.emeraldDim : s >= 60 ? T.amberDim : T.roseDim,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: s >= 80 ? T.emerald : s >= 60 ? T.amber : T.rose,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {s}
                </span>
              </div>
            ))}
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: comp.color,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {comp.avg}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Systemic Gaps */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 10,
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Systemic Team Gaps (Below 60% for 3+ Reps)
        </h3>
        {[
          {
            gap: "Competitive Positioning — MOA Differentiation",
            reps: "Sarah Chen, Emily Watson, James Morrison",
            avg: 44,
            action:
              "Recommend team Echo scenario refresh + group AI Tutor workshop",
          },
          {
            gap: "Objection Handling — Payer / Access",
            reps: "Sarah Chen, Emily Watson, James Morrison, David Park",
            avg: 48,
            action:
              "Schedule payer objection team training. Consider inviting Market Access colleague as guest SME.",
          },
          {
            gap: "Territory Management — KOL Engagement",
            reps: "Emily Watson, James Morrison",
            avg: 52,
            action:
              "Pair with Lisa Thompson (score: 82) for peer mentoring on KOL strategy",
          },
        ].map((g, i) => (
          <div
            key={i}
            style={{
              background: T.card,
              borderRadius: 11,
              padding: "14px 18px",
              marginBottom: 8,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${T.rose}`,
              animation: `slideR .3s ease ${i * 0.05}s both`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>
                {g.gap}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.rose,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {g.avg}% avg
              </span>
            </div>
            <div
              style={{ fontSize: 11.5, color: T.textMuted, marginBottom: 6 }}
            >
              Affected reps: {g.reps}
            </div>
            <div style={{ fontSize: 12, color: T.blue, fontWeight: 500 }}>
              ⚡ AI Recommendation: {g.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Manager Predictive Insights ──
const MgrInsightsView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 4px",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        AI Predictive Insights
      </h2>
      <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
        Machine learning–generated predictions, risk alerts, and coaching
        recommendations for your team.
      </p>
    </div>

    {/* Prediction Cards */}
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        {
          severity: "critical",
          color: T.rose,
          icon: "🚨",
          title: "James Morrison — Predicted to fail next Echo attempt",
          detail:
            "Based on current trajectory (readiness 32%, declining trend, only 2 AI Tutor sessions), the model predicts a 15% pass probability for Dupixent® Clinical certification. Without intervention, estimated time-to-certify exceeds 30 days.",
          action:
            "Schedule coaching intervention this week. Consider mandatory AI Tutor sessions (minimum 3/week) and Echo prep modules before next attempt.",
        },
        {
          severity: "warning",
          color: T.amber,
          icon: "⚠️",
          title: "Emily Watson — Engagement declining",
          detail:
            "Learning streak broken. AI Tutor usage dropped 70% this month vs last. She's in remediation for Ozempic® CI but hasn't opened Tutor in 5 days. Readiness trending from 58 → 48 over past 3 weeks.",
          action:
            "Check in on potential burnout or motivation issues. The data pattern suggests disengagement rather than inability — she scores well when she engages.",
        },
        {
          severity: "positive",
          color: T.emerald,
          icon: "✅",
          title: "Sarah Chen — On track for re-certification by Mar 24",
          detail:
            "Remediation pathway 37% complete with strong quiz scores (88%, 91%). AI Tutor engagement is high (14 sessions). MOA Differentiation gap improved from 38 → 58. Model predicts 78% pass probability on next Echo attempt.",
          action:
            "Maintain current trajectory. Encourage completion of payer objection modules before Echo re-attempt.",
        },
        {
          severity: "positive",
          color: T.emerald,
          icon: "✅",
          title: "Marcus Rivera — Ready for advanced certification",
          detail:
            "Readiness score 91% with upward trend. 4 of 5 certifications complete. High AI Tutor engagement. Consistently scores 80%+ across all competencies.",
          action:
            "Consider assigning advanced-level certifications or stretch assignments. Strong candidate for peer coaching role.",
        },
        {
          severity: "info",
          color: T.blue,
          icon: "📊",
          title: "Team Forecast: Ozempic® CI certification completion",
          detail:
            "At current pace, estimated full team certification for Ozempic® Competitive Intelligence: 4 of 6 reps by April 15. James Morrison and Emily Watson are the primary blockers. Without intervention, James is unlikely to certify before May.",
          action:
            "Prioritize coaching for James and Emily. If both improve engagement, full team certification is achievable by April 30.",
        },
        {
          severity: "info",
          color: T.violet,
          icon: "🧠",
          title: "Content Effectiveness Signal",
          detail:
            "Reps who complete the 'Competitive Landscape: Mounjaro vs Ozempic' AI Module show an average 23-point improvement in Echo scores for MOA-related competencies. This module has the highest learning-to-performance correlation on the platform.",
          action:
            "Ensure all reps in remediation have this module in their pathway. Consider making it a prerequisite for Ozempic® CI certification attempts.",
        },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            background: T.card,
            borderRadius: 13,
            padding: "18px 22px",
            border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${p.color}`,
            animation: `slideR .3s ease ${i * 0.04}s both`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 16 }}>{p.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: p.color }}>
              {p.title}
            </span>
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: T.textSoft,
              lineHeight: 1.6,
              marginBottom: 10,
            }}
          >
            {p.detail}
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${p.color}08`,
              borderRadius: 8,
              border: `1px solid ${p.color}12`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: p.color,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 3,
              }}
            >
              Recommended Action
            </div>
            <div style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.5 }}>
              {p.action}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Manager Coaching Planner ──
const MgrCoachingView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 4px",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        Coaching Planner
      </h2>
      <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
        AI-generated coaching agendas for your upcoming 1:1s. Each plan is
        tailored to the rep's current gaps, Echo performance, and Tutor
        engagement.
      </p>
    </div>

    {teamData.map((r, i) => (
      <div
        key={r.id}
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "20px 22px",
          border: `1px solid ${r.risk ? T.rose + "20" : T.border}`,
          animation: `fadeUp .3s ease ${i * 0.04}s both`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: `${T.blue}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: T.blue,
            }}
          >
            {r.init}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>
              {r.name}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted }}>
              {r.role} · Readiness: {r.readiness}% · Streak: {r.streak}d
            </div>
          </div>
          <Ring
            value={r.readiness}
            size={40}
            stroke={3}
            color={
              r.readiness >= 75
                ? T.emerald
                : r.readiness >= 50
                  ? T.amber
                  : T.rose
            }
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color:
                  r.readiness >= 75
                    ? T.emerald
                    : r.readiness >= 50
                      ? T.amber
                      : T.rose,
              }}
            >
              {r.readiness}
            </span>
          </Ring>
          <Badge
            color={r.risk ? T.rose : r.readiness >= 90 ? T.emerald : T.blue}
            size="sm"
          >
            {r.risk ? "Priority" : r.readiness >= 90 ? "Low Touch" : "Standard"}
          </Badge>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <div
            style={{
              background: T.cardRaised,
              borderRadius: 9,
              padding: "12px 14px",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: T.violet,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 6,
              }}
            >
              Suggested 1:1 Agenda
            </div>
            {(r.risk
              ? [
                  `Review ${r.activeCert} remediation progress and barriers`,
                  `Address ${r.gaps[0]} gap — identify specific confusion points`,
                  "Set minimum AI Tutor engagement targets (3 sessions/week)",
                  "Discuss motivation and support needs — check for burnout signals",
                  "Agree on Echo re-attempt timeline with prerequisites",
                ]
              : r.readiness >= 90
                ? [
                    "Celebrate certification achievements and recent scores",
                    "Discuss peer mentoring or SME content contributor interest",
                    "Explore advanced certification or stretch assignments",
                    "Gather feedback on platform effectiveness for team insights",
                  ]
                : [
                    `Review ${r.activeCert || "current"} certification progress`,
                    ...(r.gaps.length
                      ? [`Focus on ${r.gaps[0]} development strategy`]
                      : []),
                    "Review AI Tutor session insights for coaching opportunities",
                    "Set goals for upcoming week and Echo attempt timing",
                  ]
            ).map((item, j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "flex-start",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    color: T.violet,
                    fontSize: 9,
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                >
                  ●
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    color: T.textSoft,
                    lineHeight: 1.45,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: T.cardRaised,
              borderRadius: 9,
              padding: "12px 14px",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: T.blue,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 6,
              }}
            >
              Data Points to Reference
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                {
                  l: "Last Echo Score",
                  v: `${r.avg}%`,
                  c: r.avg >= 75 ? T.emerald : r.avg >= 60 ? T.amber : T.rose,
                },
                {
                  l: "Active Gaps",
                  v: r.gaps.length ? r.gaps.join(", ") : "None",
                  c: r.gaps.length ? T.amber : T.emerald,
                },
                {
                  l: "AI Tutor Sessions",
                  v: String(r.tutorSessions),
                  c:
                    r.tutorSessions >= 8
                      ? T.emerald
                      : r.tutorSessions >= 4
                        ? T.amber
                        : T.rose,
                },
                {
                  l: "Learning Streak",
                  v: `${r.streak} days`,
                  c:
                    r.streak >= 3
                      ? T.emerald
                      : r.streak >= 1
                        ? T.amber
                        : T.rose,
                },
              ].map((d, j) => (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 11, color: T.textMuted }}>
                    {d.l}
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: d.c }}>
                    {d.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ── Manager Reports ──
const MgrReportsView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 4px",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        Reports & Export
      </h2>
      <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
        Generate and export team reports for leadership reviews, QBRs, and
        compliance audits.
      </p>
    </div>

    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}
    >
      {[
        {
          title: "Team Certification Status",
          desc: "Complete team certification matrix showing all reps, all certifications, pass/fail status, attempt counts, and time-to-certify metrics.",
          icon: "📋",
          type: "Auto-generated",
          freq: "Real-time",
        },
        {
          title: "Competency Gap Analysis",
          desc: "Heatmap view of competency scores across all reps with systemic gap identification and trend analysis.",
          icon: "📊",
          type: "Auto-generated",
          freq: "Weekly",
        },
        {
          title: "Echo Performance Summary",
          desc: "All Echo attempt scores, pass rates, and score improvement trends across the team. Includes per-certification breakdowns.",
          icon: "🎯",
          type: "Auto-generated",
          freq: "Real-time",
        },
        {
          title: "AI Tutor Engagement Report",
          desc: "Session counts, modes used, topics covered, and learning time per rep. Identifies under-engaged reps for coaching.",
          icon: "⚡",
          type: "Auto-generated",
          freq: "Weekly",
        },
        {
          title: "Remediation Pipeline Report",
          desc: "Active remediation pathways, progress percentages, estimated completion dates, and predicted re-certification outcomes.",
          icon: "↻",
          type: "AI-Predicted",
          freq: "Daily",
        },
        {
          title: "Readiness Forecast",
          desc: "AI-predicted certification readiness scores for all reps with projected pass dates and risk flags.",
          icon: "🔮",
          type: "AI-Predicted",
          freq: "Daily",
        },
        {
          title: "Compliance Training Audit",
          desc: "Compliance module completion status, expiration dates, and regulatory training requirements for audit readiness.",
          icon: "🛡",
          type: "Compliance",
          freq: "Monthly",
        },
        {
          title: "QBR Executive Summary",
          desc: "Automated quarterly business review deck with team performance trends, ROI metrics, and strategic recommendations.",
          icon: "📈",
          type: "Executive",
          freq: "Quarterly",
        },
      ].map((r, i) => (
        <div
          key={i}
          className="hlift"
          style={{
            background: T.card,
            borderRadius: 13,
            padding: "18px 20px",
            border: `1px solid ${T.border}`,
            cursor: "pointer",
            animation: `fadeUp .3s ease ${i * 0.04}s both`,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: T.cardRaised,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {r.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 4,
                }}
              >
                {r.title}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: T.textMuted,
                  lineHeight: 1.5,
                  marginBottom: 8,
                }}
              >
                {r.desc}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge color={T.violet} size="xs">
                  {r.type}
                </Badge>
                <Badge color={T.textMuted} bg={T.glass} size="xs">
                  Updated: {r.freq}
                </Badge>
              </div>
            </div>
            <button
              style={{
                padding: "7px 14px",
                borderRadius: 7,
                border: `1px solid ${T.blue}25`,
                background: `${T.blue}10`,
                color: T.blue,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Outfit',sans-serif",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Export
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Regional Rollup Reporting */}
    <div>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: T.text,
          marginBottom: 12,
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        Regional & Country Performance Rollup
      </h3>
      <div
        style={{
          background: T.card,
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr .8fr .8fr .8fr .8fr .8fr .6fr",
            padding: "10px 18px",
            gap: 8,
            borderBottom: `1px solid ${T.border}`,
            background: T.cardRaised,
          }}
        >
          {[
            "Region / Country",
            "Reps",
            "Cert Rate",
            "Avg Echo",
            "Avg Readiness",
            "Avg TTC",
            "Trend",
          ].map((h) => (
            <div
              key={h}
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                color: T.textFaint,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {h}
            </div>
          ))}
        </div>
        {[
          {
            region: "United States",
            sub: null,
            reps: 612,
            certRate: 72,
            echo: 74,
            readiness: 71,
            ttc: "7.8d",
            trend: "up",
          },
          {
            region: "  East Region",
            sub: true,
            reps: 156,
            certRate: 68,
            echo: 71,
            readiness: 68,
            ttc: "7.9d",
            trend: "stable",
          },
          {
            region: "  West Region",
            sub: true,
            reps: 148,
            certRate: 78,
            echo: 78,
            readiness: 76,
            ttc: "6.9d",
            trend: "up",
          },
          {
            region: "  Central Region",
            sub: true,
            reps: 164,
            certRate: 71,
            echo: 73,
            readiness: 70,
            ttc: "8.1d",
            trend: "stable",
          },
          {
            region: "  South Region",
            sub: true,
            reps: 144,
            certRate: 70,
            echo: 72,
            readiness: 69,
            ttc: "8.2d",
            trend: "down",
          },
          {
            region: "Europe",
            sub: null,
            reps: 156,
            certRate: 75,
            echo: 76,
            readiness: 73,
            ttc: "7.2d",
            trend: "up",
          },
          {
            region: "  UK & Ireland",
            sub: true,
            reps: 48,
            certRate: 79,
            echo: 80,
            readiness: 77,
            ttc: "6.5d",
            trend: "up",
          },
          {
            region: "  DACH",
            sub: true,
            reps: 42,
            certRate: 74,
            echo: 75,
            readiness: 72,
            ttc: "7.4d",
            trend: "stable",
          },
          {
            region: "  France",
            sub: true,
            reps: 38,
            certRate: 71,
            echo: 73,
            readiness: 70,
            ttc: "7.8d",
            trend: "stable",
          },
          {
            region: "  Nordics",
            sub: true,
            reps: 28,
            certRate: 78,
            echo: 77,
            readiness: 75,
            ttc: "7.0d",
            trend: "up",
          },
          {
            region: "Asia-Pacific",
            sub: null,
            reps: 79,
            certRate: 69,
            echo: 70,
            readiness: 66,
            ttc: "8.9d",
            trend: "up",
          },
          {
            region: "  Japan",
            sub: true,
            reps: 34,
            certRate: 72,
            echo: 74,
            readiness: 70,
            ttc: "8.2d",
            trend: "up",
          },
          {
            region: "  Australia/NZ",
            sub: true,
            reps: 26,
            certRate: 68,
            echo: 68,
            readiness: 64,
            ttc: "9.1d",
            trend: "stable",
          },
          {
            region: "  Southeast Asia",
            sub: true,
            reps: 19,
            certRate: 64,
            echo: 66,
            readiness: 61,
            ttc: "10.2d",
            trend: "up",
          },
        ].map((r, i) => {
          const trendI = { up: "↗", down: "↘", stable: "→" };
          const trendC = { up: T.emerald, down: T.rose, stable: T.amber };
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr .8fr .8fr .8fr .8fr .8fr .6fr",
                padding: `${r.sub ? "8px" : "11px"} 18px`,
                gap: 8,
                alignItems: "center",
                borderBottom: i < 13 ? `1px solid ${T.border}` : "none",
                background: r.sub ? "transparent" : `${T.blue}04`,
              }}
            >
              <span
                style={{
                  fontSize: r.sub ? 11.5 : 12.5,
                  fontWeight: r.sub ? 400 : 600,
                  color: r.sub ? T.textSoft : T.text,
                }}
              >
                {r.region}
              </span>
              <span style={{ fontSize: 12, color: T.textSoft }}>{r.reps}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Bar
                  value={r.certRate}
                  color={
                    r.certRate >= 75
                      ? T.emerald
                      : r.certRate >= 65
                        ? T.amber
                        : T.rose
                  }
                  h={4}
                />
                <span style={{ fontSize: 11, color: T.textSoft, minWidth: 26 }}>
                  {r.certRate}%
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: r.sub ? 400 : 600,
                  color:
                    r.echo >= 75 ? T.emerald : r.echo >= 65 ? T.amber : T.rose,
                }}
              >
                {r.echo}%
              </span>
              <span
                style={{
                  fontSize: 12,
                  color:
                    r.readiness >= 70
                      ? T.emerald
                      : r.readiness >= 60
                        ? T.amber
                        : T.rose,
                  fontWeight: r.sub ? 400 : 600,
                }}
              >
                {r.readiness}%
              </span>
              <span style={{ fontSize: 11.5, color: T.textSoft }}>{r.ttc}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: trendC[r.trend],
                }}
              >
                {trendI[r.trend]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════
// PEER LEARNING HUB
// ═══════════════════════════════════════════════
const PeerView = () => {
  const [tab, setTab] = useState("insights");

  const topPerformerInsights = [
    {
      id: 1,
      competency: "Competitive Positioning",
      insight:
        "Top performers acknowledge competitor data head-on before pivoting. They never dismiss SURPASS results — instead, they bridge to Ozempic's CV evidence breadth.",
      source: "AI-analyzed from 45 Echo sessions scoring 85%+",
      upvotes: 23,
    },
    {
      id: 2,
      competency: "Objection Handling",
      insight:
        "High-scoring reps spend 40% more time on needs assessment before presenting. The pattern: ask 2-3 targeted questions, then tailor the clinical narrative to the HCP's stated priorities.",
      source: "AI-analyzed from top quartile Echo sessions",
      upvotes: 18,
    },
    {
      id: 3,
      competency: "Clinical Storytelling",
      insight:
        "Instead of citing trial statistics directly, top reps frame data as patient stories: 'For a patient like yours with A1C of 8.2 and CV risk, here's what the evidence shows...'",
      source: "AI-analyzed from 30 Echo sessions with coaching score 9+/10",
      upvotes: 31,
    },
    {
      id: 4,
      competency: "Payer Conversations",
      insight:
        "Successful payer objection handling consistently leads with total cost-of-care, not drug cost. Top reps calculate downstream savings (CV event prevention) vs. monthly drug spend.",
      source: "AI-analyzed from reps who converted formulary objections",
      upvotes: 14,
    },
  ];

  const challenges = [
    {
      id: 1,
      title: "Competitive Positioning Sprint",
      desc: "Improve your Competitive Positioning competency score by the most points this week.",
      duration: "Mar 10–14",
      participants: 28,
      yourRank: 8,
      leader: "Anonymous (Region West)",
      leaderDelta: "+22pts",
      status: "active",
    },
    {
      id: 2,
      title: "AI Tutor Power Week",
      desc: "Complete the most AI Tutor sessions across any mode this week.",
      duration: "Mar 10–14",
      participants: 34,
      yourRank: 12,
      leader: "Anonymous (Region East)",
      leaderDelta: "8 sessions",
      status: "active",
    },
    {
      id: 3,
      title: "Echo First-Attempt Challenge",
      desc: "Pass your next Echo certification on the first attempt.",
      duration: "Ongoing",
      participants: 156,
      yourRank: null,
      leader: null,
      leaderDelta: "42 reps succeeded",
      status: "ongoing",
    },
  ];

  const tips = [
    {
      author: "Anonymous Rep · East Region",
      score: 92,
      cert: "Dupixent® Clinical Data",
      tip: "Before my Echo attempt, I ran 3 HCP simulations in AI Tutor targeting the specific objections from my gap analysis. Made a huge difference — I felt like I'd already had the conversation.",
      likes: 16,
      time: "2d ago",
    },
    {
      author: "Anonymous Rep · West Region",
      score: 88,
      cert: "Entresto® Cardiology",
      tip: "The Pre-Call Prep briefings are underrated. I started using them before every real HCP visit, not just for Echo prep. My manager noticed the improvement in my call quality within a week.",
      likes: 12,
      time: "4d ago",
    },
    {
      author: "Anonymous Rep · Central Region",
      score: 95,
      cert: "Keytruda® Indication Expansion",
      tip: "For oncology certs, I found the AI Tutor's Deep Dive mode was better than courses for understanding complex biomarker data. I'd do a Deep Dive first, then the course, then quiz myself.",
      likes: 22,
      time: "1w ago",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: T.text,
            margin: "0 0 4px",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Peer Learning Hub
        </h2>
        <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
          Learn from top performers, join team challenges, and share what's
          working. All contributions are anonymized.
        </p>
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        {[
          { id: "insights", label: "Top Performer Insights" },
          { id: "challenges", label: "Team Challenges" },
          { id: "tips", label: "Rep Tips" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "9px 18px",
              borderRadius: 9,
              border: `1px solid ${tab === t.id ? T.blue + "30" : T.border}`,
              background: tab === t.id ? T.blueGlow : T.card,
              color: tab === t.id ? T.blue : T.textMuted,
              fontSize: 12.5,
              fontWeight: tab === t.id ? 600 : 500,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "insights" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            animation: "fadeIn .25s ease",
          }}
        >
          <p style={{ fontSize: 12.5, color: T.textMuted, margin: 0 }}>
            AI-curated patterns from your organization's highest-scoring Echo
            sessions and certifications.
          </p>
          {topPerformerInsights.map((ins, i) => (
            <div
              key={ins.id}
              className="hlift"
              style={{
                background: T.card,
                borderRadius: 13,
                padding: "18px 20px",
                border: `1px solid ${T.border}`,
                animation: `slideR .3s ease ${i * 0.05}s both`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Badge color={T.emerald} size="sm">
                  Top Performer Pattern
                </Badge>
                <Badge color={T.violet} size="xs">
                  {ins.competency}
                </Badge>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: T.text,
                  lineHeight: 1.65,
                  margin: "0 0 10px",
                }}
              >
                {ins.insight}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 10.5,
                    color: T.textMuted,
                    fontStyle: "italic",
                  }}
                >
                  {ins.source}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: T.cardRaised,
                    border: `1px solid ${T.border}`,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: T.textSoft, fontWeight: 500 }}
                  >
                    Upvotes: {ins.upvotes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "challenges" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            animation: "fadeIn .25s ease",
          }}
        >
          {challenges.map((ch, i) => (
            <div
              key={ch.id}
              style={{
                background: T.card,
                borderRadius: 14,
                padding: "20px 22px",
                border: `1px solid ${ch.status === "active" ? T.blue + "20" : T.border}`,
                animation: `fadeUp .3s ease ${i * 0.05}s both`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>
                  {ch.title}
                </span>
                <Badge
                  color={ch.status === "active" ? T.emerald : T.blue}
                  size="xs"
                >
                  {ch.status === "active" ? "Active" : "Ongoing"}
                </Badge>
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: T.textSoft,
                  margin: "0 0 12px",
                }}
              >
                {ch.desc}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    background: T.cardRaised,
                    borderRadius: 8,
                    padding: "10px",
                    textAlign: "center",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.blue,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    {ch.participants}
                  </div>
                  <div style={{ fontSize: 9.5, color: T.textMuted }}>
                    Participants
                  </div>
                </div>
                <div
                  style={{
                    background: T.cardRaised,
                    borderRadius: 8,
                    padding: "10px",
                    textAlign: "center",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color:
                        ch.yourRank && ch.yourRank <= 10 ? T.emerald : T.amber,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    {ch.yourRank ? `#${ch.yourRank}` : "—"}
                  </div>
                  <div style={{ fontSize: 9.5, color: T.textMuted }}>
                    Your Rank
                  </div>
                </div>
                <div
                  style={{
                    background: T.cardRaised,
                    borderRadius: 8,
                    padding: "10px",
                    textAlign: "center",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{ fontSize: 12, fontWeight: 600, color: T.emerald }}
                  >
                    {ch.leader || "—"}
                  </div>
                  <div style={{ fontSize: 9.5, color: T.textMuted }}>
                    Leader
                  </div>
                </div>
                <div
                  style={{
                    background: T.cardRaised,
                    borderRadius: 8,
                    padding: "10px",
                    textAlign: "center",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: T.violet,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    {ch.leaderDelta}
                  </div>
                  <div style={{ fontSize: 9.5, color: T.textMuted }}>
                    Top Score
                  </div>
                </div>
              </div>
              <div
                style={{ fontSize: 10.5, color: T.textMuted, marginTop: 10 }}
              >
                {ch.duration}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "tips" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            animation: "fadeIn .25s ease",
          }}
        >
          <p style={{ fontSize: 12.5, color: T.textMuted, margin: 0 }}>
            Tips shared by reps who recently passed certifications. All
            identities are anonymized.
          </p>
          {tips.map((tip, i) => (
            <div
              key={i}
              style={{
                background: T.card,
                borderRadius: 13,
                padding: "16px 20px",
                border: `1px solid ${T.border}`,
                animation: `slideR .3s ease ${i * 0.05}s both`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: `${T.emerald}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: T.emerald,
                    fontWeight: 700,
                  }}
                ></div>
                <div>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: T.text }}
                  >
                    {tip.author}
                  </span>
                  <div
                    style={{ display: "flex", gap: 5, alignItems: "center" }}
                  >
                    <Badge color={T.emerald} size="xs">
                      Score: {tip.score}%
                    </Badge>
                    <Badge color={T.violet} size="xs">
                      {tip.cert}
                    </Badge>
                  </div>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 10.5,
                    color: T.textMuted,
                  }}
                >
                  {tip.time}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: T.textSoft,
                  lineHeight: 1.6,
                  margin: "0 0 8px",
                }}
              >
                {tip.tip}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 11, color: T.textSoft }}>
                  Likes: {tip.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════
// NOTIFICATIONS CENTER
// ═══════════════════════════════════════════════
const NotificationsView = () => {
  const [filter, setFilter] = useState("all");
  const notifs = [
    {
      id: 1,
      type: "coaching",
      title: "Coaching Note from David Marchetti",
      desc: "Great progress on the MOA differentiation gap. For your next HCP sim, try leading with the SELECT endpoint number (20% MACE reduction) within your first 30 seconds.",
      time: "1h ago",
      read: false,
      color: T.violet,
      action: "View in Coaching Hub",
    },
    {
      id: 2,
      type: "pathway",
      title: "Remediation Step 3 Unlocked",
      desc: "Knowledge Check — MOA Differentiation is now available. Complete this adaptive quiz to continue your Ozempic® CI remediation pathway.",
      time: "3h ago",
      read: false,
      color: T.blue,
      action: "Start Quiz",
    },
    {
      id: 3,
      type: "readiness",
      title: "AI Readiness Score Update",
      desc: "Your predicted readiness score increased from 68 to 72. Continue your current pace — the model estimates you'll reach re-certification readiness by March 24.",
      time: "6h ago",
      read: false,
      color: T.emerald,
      action: null,
    },
    {
      id: 4,
      type: "cert",
      title: "New Certification Assigned",
      desc: "Reyvow® Product Launch certification has been assigned to you. Due date: March 15. Prep modules are available now.",
      time: "1d ago",
      read: true,
      color: T.amber,
      action: "View Certification",
    },
    {
      id: 5,
      type: "coaching",
      title: "Coaching Assignment from David Marchetti",
      desc: "Your manager has assigned an AI Tutor HCP Practice session: 'Payer Objection Simulation — Formulary Access.' Complete before your next 1:1 on Friday.",
      time: "1d ago",
      read: true,
      color: T.violet,
      action: "Start AI Tutor Session",
    },
    {
      id: 6,
      type: "peer",
      title: "New Top Performer Insight",
      desc: "A new AI-curated insight on Clinical Storytelling is available in the Peer Learning Hub. 31 reps have found it helpful.",
      time: "2d ago",
      read: true,
      color: T.teal,
      action: "View Insight",
    },
    {
      id: 7,
      type: "achievement",
      title: "Milestone Progress: Comeback Story",
      desc: "You're 75% of the way to the Comeback Story milestone! Complete your remediation and re-certify to unlock it.",
      time: "2d ago",
      read: true,
      color: T.orange,
      action: null,
    },
    {
      id: 8,
      type: "echo",
      title: "Echo Re-Attempt Available in 12 Days",
      desc: "Based on your current pathway progress, you'll be eligible for an Echo re-attempt on approximately March 24. Keep up the momentum.",
      time: "3d ago",
      read: true,
      color: T.rose,
      action: null,
    },
    {
      id: 9,
      type: "compliance",
      title: "Compliance Training Due: HIPAA Privacy",
      desc: "HIPAA Privacy & Security refresher expires March 31. Complete before expiration to maintain compliance status.",
      time: "5d ago",
      read: true,
      color: T.amber,
      action: "Start Module",
    },
    {
      id: 10,
      type: "digest",
      title: "Weekly Learning Digest",
      desc: "Last week: 2h 35m learning time, 2 courses completed, 1 quiz passed (91%), AI Tutor engagement up 40%. Strong week, Sarah.",
      time: "5d ago",
      read: true,
      color: T.blue,
      action: null,
    },
  ];

  const typeLabels = {
    coaching: "Coaching",
    pathway: "Pathway",
    readiness: "AI Readiness",
    cert: "Certification",
    peer: "Peer Learning",
    achievement: "Achievement",
    echo: "Echo",
    compliance: "Compliance",
    digest: "Weekly Digest",
  };
  const filters = [
    "all",
    "unread",
    "coaching",
    "pathway",
    "cert",
    "compliance",
  ];
  const filtered =
    filter === "all"
      ? notifs
      : filter === "unread"
        ? notifs.filter((n) => !n.read)
        : notifs.filter((n) => n.type === filter);
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: T.text,
              margin: "0 0 4px",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Notifications
          </h2>
          <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
            {unreadCount} unread · {notifs.length} total
          </p>
        </div>
        <button
          style={{
            padding: "7px 16px",
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.card,
            color: T.textSoft,
            fontSize: 11.5,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Mark All Read
        </button>
      </div>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 12px",
              borderRadius: 7,
              border: `1px solid ${filter === f ? T.blue + "30" : T.border}`,
              background: filter === f ? T.blueGlow2 : T.card,
              color: filter === f ? T.blue : T.textMuted,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              textTransform: "capitalize",
            }}
          >
            {f === "all"
              ? `All (${notifs.length})`
              : f === "unread"
                ? `Unread (${unreadCount})`
                : f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((n, i) => (
          <div
            key={n.id}
            style={{
              background: n.read ? T.card : T.cardRaised,
              borderRadius: 12,
              padding: "14px 18px",
              border: `1px solid ${n.read ? T.border : n.color + "20"}`,
              borderLeft: `3px solid ${n.read ? T.border : n.color}`,
              animation: `slideR .25s ease ${i * 0.03}s both`,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {!n.read && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: n.color,
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: n.read ? 500 : 600,
                      color: n.read ? T.textSoft : T.text,
                    }}
                  >
                    {n.title}
                  </span>
                  <Badge color={n.color} size="xs">
                    {typeLabels[n.type]}
                  </Badge>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: T.textMuted,
                    lineHeight: 1.55,
                    margin: "0 0 6px",
                  }}
                >
                  {n.desc}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10.5, color: T.textFaint }}>
                    {n.time}
                  </span>
                  {n.action && (
                    <button
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: `1px solid ${n.color}20`,
                        background: `${n.color}08`,
                        color: n.color,
                        fontSize: 10.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      {n.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [showSSO, setShowSSO] = useState(false);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: T.bg,
        fontFamily: "'Outfit',sans-serif",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Styles />
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Background Texture & Orbs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${T.border}40 1px,transparent 1px),linear-gradient(90deg,${T.border}40 1px,transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `${T.blue}08`,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `${T.orange}05`,
          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          width: 420,
          animation: "fadeUp .5s ease",
          margin: "auto 0",
          padding: "60px 0",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <img
            src="/IH_horiz_full.png"
            alt="InsiteHUB"
            style={{
              width: 400,
              height: "auto",
              display: "inline-block",
              marginBottom: -30,
            }}
          />
          {/* <p
            style={{
              fontSize: 15,
              color: T.textMuted,
              margin: 0,
              fontWeight: 500,
            }}
          >
            The First Closed-Loop Capability Development Platform
          </p>*/}
        </div>

        {/* Login Card */}
        <div
          style={{
            background: T.panel,
            borderRadius: 24,
            padding: "40px 32px",
            border: `1px solid ${T.border}`,
            boxShadow: "0 30px 70px rgba(0,0,0,.06)",
          }}
        >
          {!showSSO ? (
            <>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: T.text,
                  margin: "0 0 6px",
                  textAlign: "center",
                }}
              >
                Welcome back
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: T.textMuted,
                  margin: "0 0 32px",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                Sign in to continue your learning journey
              </p>

              {/* SSO Button */}
              <button
                onClick={() => setShowSSO(true)}
                className="hlift"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 14,
                  border: `1px solid ${T.border}`,
                  background: T.white,
                  color: T.text,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  transition: "all .2s",
                }}
              >
                <span style={{ fontSize: 18 }}></span>
                Sign in with Okta SSO
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  margin: "24px 0",
                }}
              >
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <span
                  style={{
                    fontSize: 12,
                    color: T.textFaint,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  or email
                </span>
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.textSoft,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Email address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.chen@company.com"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `1px solid ${T.border}`,
                    background: T.white,
                    color: T.text,
                    fontSize: 14,
                    fontFamily: "'Outfit',sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color .2s",
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <label
                    style={{ fontSize: 13, fontWeight: 600, color: T.textSoft }}
                  >
                    Password
                  </label>
                  <span
                    style={{
                      fontSize: 12,
                      color: T.blue,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Forgot password?
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="••••••••••"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `1px solid ${T.border}`,
                    background: T.white,
                    color: T.text,
                    fontSize: 14,
                    fontFamily: "'Outfit',sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                onClick={() => onLogin()}
                className="hlift"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 14,
                  border: "none",
                  background: `linear-gradient(135deg,${T.blue},${T.blueDim})`,
                  color: T.white,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                  boxShadow: `0 8px 24px ${T.blue}30`,
                  transition: "all .2s",
                }}
              >
                Sign In
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", animation: "fadeUp .3s ease" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${T.emerald}15`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  marginBottom: 20,
                }}
              ></div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: T.text,
                  margin: "0 0 10px",
                }}
              >
                Redirecting to Okta
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: T.textMuted,
                  margin: "0 0 32px",
                  lineHeight: 1.6,
                }}
              >
                You'll be redirected to your organization's Okta SSO login page
                for secure authentication.
              </p>
              <button
                onClick={() => onLogin()}
                className="hlift"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 14,
                  border: "none",
                  background: `linear-gradient(135deg,${T.blue},${T.blueDim})`,
                  color: T.white,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                  boxShadow: `0 8px 24px ${T.blue}30`,
                }}
              >
                Continue to Okta →
              </button>
              <button
                onClick={() => setShowSSO(false)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 12,
                  border: "none",
                  marginTop: 12,
                  background: "transparent",
                  color: T.textMuted,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                ← Back to email sign in
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>
            InsiteHUB by Proxa Labs · Intelligent Capability Development
            Platform
          </p>
          <p style={{ fontSize: 11, color: T.textFaint, marginTop: 6 }}>
            SOC 2 Type II Certified · GDPR Compliant · TLS 1.3 Encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// LANDING PAGE — Post-login, first view
// ═══════════════════════════════════════════════
const LandingPage = ({ onContinue, userName }) => {
  const [hovBtn, setHovBtn] = useState(null);
  const [time] = useState(new Date());
  const hour = time.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: T.bg,
        fontFamily: "'Outfit',sans-serif",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Styles />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}}
        @keyframes gradientMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes orb1{0%{transform:translate(0,0)}33%{transform:translate(60px,-40px)}66%{transform:translate(-30px,20px)}100%{transform:translate(0,0)}}
        @keyframes orb2{0%{transform:translate(0,0)}33%{transform:translate(-50px,30px)}66%{transform:translate(40px,-20px)}100%{transform:translate(0,0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      `}</style>

      {/* Animated background orbs & Texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${T.border}40 1px,transparent 1px),linear-gradient(90deg,${T.border}40 1px,transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "18%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle,${T.blue}12,transparent 70%)`,
          animation: "orb1 20s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "12%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: `radial-gradient(circle,${T.orange}08,transparent 70%)`,
          animation: "orb2 25s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle,${T.teal}05,transparent 60%)`,
          animation: "orb1 30s ease-in-out infinite reverse",
        }}
      />

      <div
        style={{
          maxWidth: 840,
          width: "94%",
          position: "relative",
          zIndex: 1,
          padding: "60px 0",
          margin: "auto 0",
        }}
      >
        {/* Logo with glow */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            animation: "fadeUp .5s ease",
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                position: "absolute",
                inset: -12,
                borderRadius: 26,
                background: `radial-gradient(circle,${T.blue}20,transparent 70%)`,
                animation: "pulse 3s ease infinite",
              }}
            />
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                position: "relative",
                background: `linear-gradient(135deg,${T.blue},${T.blueDim})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 800,
                color: T.white,
                boxShadow: `0 8px 40px ${T.blue}30, 0 0 80px ${T.blue}10`,
              }}
            >
              P
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div
          style={{ textAlign: "center", animation: "fadeUp .5s ease .1s both" }}
        >
          <div
            style={{
              fontSize: 16,
              color: T.textMuted,
              fontWeight: 600,
              marginBottom: 8,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {greeting}, {userName}
          </div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: T.text,
              margin: "0 0 12px",
              letterSpacing: -1.8,
              lineHeight: 1.1,
            }}
          >
            Welcome to{" "}
            <span
              style={{
                background: `linear-gradient(135deg,${T.blue},${T.blueDim},${T.teal})`,
                backgroundSize: "200% 200%",
                animation: "gradientMove 4s ease infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              InsiteHUB
            </span>
          </h1>
          <p
            style={{
              fontSize: 17,
              color: T.textSoft,
              margin: "0 0 48px",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Your intelligent capability development platform. Pick up where you
            left off.
          </p>
        </div>

        {/* Quick Stats — clickable cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 14,
            marginBottom: 40,
          }}
        >
          {[
            {
              icon: "",
              label: "Active Remediation",
              val: "Ozempic® CI",
              sub: "3/8 steps complete",
              color: T.rose,
              nav: "pathway",
            },
            {
              icon: "",
              label: "Readiness Score",
              val: "68%",
              sub: "+4pts this week",
              color: T.amber,
              nav: "insights",
            },
            {
              icon: "",
              label: "Learning Streak",
              val: "3 days",
              sub: "Keep it going!",
              color: T.orange,
              nav: "achievements",
            },
            {
              icon: "",
              label: "AI Tutor Sessions",
              val: "14 total",
              sub: "3 this week",
              color: T.blue,
              nav: "tutor",
            },
          ].map((s, i) => (
            <div
              key={i}
              onClick={() => onContinue(s.nav)}
              style={{
                background: T.panel,
                borderRadius: 20,
                padding: "24px 20px",
                border: `1.5px solid ${hovBtn === `stat${i}` ? s.color + "40" : T.border}`,
                animation: `fadeUp .4s ease ${0.2 + i * 0.08}s both`,
                cursor: "pointer",
                transition: "all .25s",
                transform:
                  hovBtn === `stat${i}` ? "translateY(-6px)" : "translateY(0)",
                boxShadow:
                  hovBtn === `stat${i}`
                    ? `0 16px 40px ${s.color}15`
                    : "0 4px 20px rgba(0,0,0,.02)",
              }}
              onMouseEnter={() => setHovBtn(`stat${i}`)}
              onMouseLeave={() => setHovBtn(null)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  marginBottom: 16,
                  background: `${s.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  transition: "transform .2s",
                  transform: hovBtn === `stat${i}` ? "scale(1.1)" : "scale(1)",
                }}
              >
                {s.icon}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: s.color,
                  fontFamily: "'Outfit',sans-serif",
                  lineHeight: 1.2,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.textSoft,
                  marginTop: 8,
                  fontWeight: 500,
                }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            animation: "fadeUp .5s ease .55s both",
            marginBottom: 48,
          }}
        >
          <button
            onClick={() => onContinue("pathway")}
            onMouseEnter={() => setHovBtn("primary")}
            onMouseLeave={() => setHovBtn(null)}
            style={{
              padding: "16px 36px",
              borderRadius: 16,
              border: "none",
              background:
                hovBtn === "primary"
                  ? `linear-gradient(135deg,${T.blue},${T.blueDim})`
                  : T.blue,
              color: T.white,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              boxShadow:
                hovBtn === "primary"
                  ? `0 12px 32px ${T.blue}40`
                  : `0 8px 24px ${T.blue}25`,
              transform:
                hovBtn === "primary" ? "translateY(-3px)" : "translateY(0)",
              transition: "all .25s",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Continue Remediation
            <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 600 }}>
              Step 3/8
            </span>
          </button>
          <button
            onClick={() => onContinue("tutor")}
            onMouseEnter={() => setHovBtn("tutor")}
            onMouseLeave={() => setHovBtn(null)}
            style={{
              padding: "16px 28px",
              borderRadius: 16,
              border: `1.5px solid ${hovBtn === "tutor" ? T.blue + "40" : T.border}`,
              background: hovBtn === "tutor" ? `${T.blue}08` : T.panel,
              color: T.text,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              transition: "all .25s",
              boxShadow: "0 4px 20px rgba(0,0,0,.02)",
            }}
          >
            AI Tutor
          </button>
          <button
            onClick={() => onContinue("home")}
            onMouseEnter={() => setHovBtn("dash")}
            onMouseLeave={() => setHovBtn(null)}
            style={{
              padding: "16px 28px",
              borderRadius: 16,
              border: `1.5px solid ${hovBtn === "dash" ? T.text + "20" : T.border}`,
              background: hovBtn === "dash" ? `${T.text}05` : "transparent",
              color: T.textSoft,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              transition: "all .25s",
            }}
          >
            Dashboard →
          </button>
        </div>

        {/* ── Two-Column Widget Area ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
            animation: "fadeUp .5s ease .65s both",
          }}
        >
          {/* Quick Navigation */}
          <div
            style={{
              background: T.panel,
              borderRadius: 20,
              padding: "24px",
              border: `1.5px solid ${T.border}`,
              boxShadow: "0 10px 30px rgba(0,0,0,.02)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.blue,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 16,
              }}
            >
              Quick Navigation
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  label: "My Pathway",
                  icon: "",
                  nav: "pathway",
                  color: T.rose,
                },
                {
                  label: "Certifications",
                  icon: "",
                  nav: "certs",
                  color: T.emerald,
                },
                {
                  label: "Competencies",
                  icon: "",
                  nav: "competencies",
                  color: T.amber,
                },
                {
                  label: "Pre-Call Prep",
                  icon: "",
                  nav: "precall",
                  color: T.teal,
                },
                {
                  label: "Coaching Hub",
                  icon: "",
                  nav: "coaching",
                  color: T.violet,
                },
                {
                  label: "Peer Learning",
                  icon: "",
                  nav: "peer",
                  color: T.blue,
                },
                {
                  label: "Achievements",
                  icon: "",
                  nav: "achievements",
                  color: T.orange,
                },
                {
                  label: "My Profile",
                  icon: "",
                  nav: "profile",
                  color: T.textSoft,
                },
              ].map((q, i) => (
                <div
                  key={i}
                  onClick={() => onContinue(q.nav)}
                  onMouseEnter={() => setHovBtn(`qn${i}`)}
                  onMouseLeave={() => setHovBtn(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 12px",
                    borderRadius: 9,
                    cursor: "pointer",
                    transition: "all .15s",
                    background:
                      hovBtn === `qn${i}` ? `${q.color}10` : T.cardRaised,
                    border: `1px solid ${hovBtn === `qn${i}` ? q.color + "25" : T.border}`,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{q.icon}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: hovBtn === `qn${i}` ? q.color : T.textSoft,
                    }}
                  >
                    {q.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coaching & Manager Updates */}
          <div
            style={{
              background: `${T.card}CC`,
              borderRadius: 16,
              padding: "18px 20px",
              border: `1px solid ${T.border}`,
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.violet,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 12,
              }}
            >
              Recent Updates
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                {
                  icon: "",
                  title: "Coaching note from David Marchetti",
                  desc: '"Great progress on MOA differentiation..."',
                  time: "1h ago",
                  color: T.violet,
                },
                {
                  icon: "",
                  title: "Remediation Step 3 unlocked",
                  desc: "Knowledge Check — MOA Differentiation is ready",
                  time: "3h ago",
                  color: T.blue,
                },
                {
                  icon: "",
                  title: "Readiness score increased",
                  desc: "68 → 72 (+4pts this week)",
                  time: "6h ago",
                  color: T.emerald,
                },
                {
                  icon: "",
                  title: "New peer insight available",
                  desc: "Top performer pattern: Clinical Storytelling",
                  time: "2d ago",
                  color: T.amber,
                },
              ].map((u, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: T.cardRaised,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <span style={{ fontSize: 14, marginTop: 2 }}>{u.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 11.5, fontWeight: 600, color: T.text }}
                    >
                      {u.title}
                    </div>
                    <div style={{ fontSize: 10.5, color: T.textMuted }}>
                      {u.desc}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 9.5,
                      color: T.textFaint,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Connected Tools & Platforms ── */}
        <div
          style={{ animation: "fadeUp .5s ease .75s both", marginBottom: 20 }}
        >
          <div
            style={{
              background: `${T.card}CC`,
              borderRadius: 16,
              padding: "18px 20px",
              border: `1px solid ${T.border}`,
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.teal,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 12,
              }}
            >
              Connected Platforms & Tools
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 10,
              }}
            >
              {[
                {
                  name: "Proxa Echo",
                  desc: "AI Roleplay & Certification",
                  icon: "",
                  status: "Connected",
                  color: T.emerald,
                },
                {
                  name: "InsiteX LMS",
                  desc: "Enterprise Learning Hub",
                  icon: "",
                  status: "Connected",
                  color: T.emerald,
                },
                {
                  name: "Veeva CRM",
                  desc: "Customer Relationship Mgmt",
                  icon: "",
                  status: "Synced",
                  color: T.emerald,
                },
                {
                  name: "Workday",
                  desc: "HR & People Data",
                  icon: "",
                  status: "Connected",
                  color: T.emerald,
                },
                {
                  name: "MS Teams",
                  desc: "Notifications & Chat",
                  icon: "",
                  status: "Active",
                  color: T.emerald,
                },
              ].map((tool, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHovBtn(`tool${i}`)}
                  onMouseLeave={() => setHovBtn(null)}
                  style={{
                    padding: "14px 12px",
                    borderRadius: 12,
                    textAlign: "center",
                    cursor: "pointer",
                    background:
                      hovBtn === `tool${i}` ? T.cardHover : T.cardRaised,
                    border: `1px solid ${hovBtn === `tool${i}` ? T.borderLight : T.border}`,
                    transition: "all .15s",
                    transform:
                      hovBtn === `tool${i}`
                        ? "translateY(-2px)"
                        : "translateY(0)",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>
                    {tool.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: T.text,
                      marginBottom: 2,
                    }}
                  >
                    {tool.name}
                  </div>
                  <div
                    style={{
                      fontSize: 9.5,
                      color: T.textMuted,
                      marginBottom: 6,
                    }}
                  >
                    {tool.desc}
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "2px 7px",
                      borderRadius: 4,
                      background: `${tool.color}10`,
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: tool.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: tool.color,
                      }}
                    >
                      {tool.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Activity + AI Insight ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 14,
            animation: "fadeUp .5s ease .85s both",
          }}
        >
          {/* Recent Activity */}
          <div
            style={{
              background: `${T.card}CC`,
              borderRadius: 16,
              padding: "18px 20px",
              border: `1px solid ${T.border}`,
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.emerald,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 12,
              }}
            >
              This Week's Activity
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                height: 60,
                marginBottom: 10,
              }}
            >
              {[
                { day: "Mon", mins: 45 },
                { day: "Tue", mins: 30 },
                { day: "Wed", mins: 62 },
                { day: "Thu", mins: 18 },
                { day: "Fri", mins: 0 },
              ].map((d, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      borderRadius: 4,
                      minHeight: 4,
                      height: `${Math.max((d.mins / 62) * 100, 6)}%`,
                      background:
                        d.mins > 0
                          ? `${T.blue}${d.mins > 40 ? "60" : "35"}`
                          : T.border,
                      transition: "height .6s ease",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      color: d.mins ? T.textSoft : T.textFaint,
                    }}
                  >
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 11, color: T.textMuted }}>
                Total:{" "}
                <span style={{ color: T.blue, fontWeight: 600 }}>2h 35m</span>
              </span>
              <span
                onClick={() => onContinue("insights")}
                style={{
                  fontSize: 10.5,
                  color: T.blue,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Full analytics →
              </span>
            </div>
          </div>

          {/* AI Insight */}
          <div
            style={{
              background: `linear-gradient(135deg,${T.card}CC,${T.cardRaised}CC)`,
              borderRadius: 16,
              padding: "18px 20px",
              border: `1px solid ${T.borderLight}`,
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13 }}>⚡</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  letterSpacing: 0.3,
                }}
              >
                AI INSIGHT
              </span>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: T.textSoft,
                lineHeight: 1.6,
                margin: "0 0 12px",
              }}
            >
              Your MOA Differentiation gap score improved from{" "}
              <span style={{ color: T.emerald, fontWeight: 600 }}>38 → 58</span>{" "}
              after completing 2 modules. At this rate, the AI predicts you'll
              reach re-certification readiness by{" "}
              <span style={{ color: T.text, fontWeight: 600 }}>March 24</span>.
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              <span
                onClick={() => onContinue("tutor")}
                style={{
                  fontSize: 10.5,
                  color: T.blue,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${T.blue}08`,
                  border: `1px solid ${T.blue}15`,
                }}
              >
                Practice with AI Tutor
              </span>
              <span
                onClick={() => onContinue("insights")}
                style={{
                  fontSize: 10.5,
                  color: T.violet,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${T.violet}08`,
                  border: `1px solid ${T.violet}15`,
                }}
              >
                View Readiness
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            fontSize: 10.5,
            color: T.textFaint,
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Proxa Tutor · Intelligent Capability Development Platform by Proxa
          Labs
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// ADMIN VIEWS — System Administration
// ═══════════════════════════════════════════════

const adminNavItems = [
  { id: "adm_dash", label: "Admin Dashboard", icon: icons.home },
  { id: "adm_users", label: "User Management", icon: icons.coaching },
  { id: "adm_content", label: "Content Management", icon: icons.lib },
  { id: "adm_certs", label: "Cert Programs", icon: icons.cert },
  { id: "adm_comp_framework", label: "Competency Framework", icon: icons.comp },
  { id: "sep_a1", label: "sep", sep: true },
  { id: "adm_echo", label: "Echo Integration", icon: icons.refresh },
  { id: "adm_ai", label: "AI Configuration", icon: icons.bolt },
  { id: "adm_compliance", label: "Compliance & Audit", icon: icons.target },
  { id: "adm_settings", label: "System Settings", icon: icons.profile },
];

// Shared admin data
const orgData = {
  totalUsers: 847,
  activeUsers: 712,
  regions: 8,
  teams: 24,
  contentItems: 342,
  courses: 86,
  aiModules: 54,
  workshops: 28,
  compliance: 18,
  certPrograms: 12,
  activeCerts: 2847,
  passRate: 72,
};

// ── Admin Dashboard ──
const AdmDashView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 4px",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        System Administration
      </h1>
      <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
        Platform health, usage analytics, and system status for Proxa Tutor.
      </p>
    </div>

    {/* System Health */}
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}
    >
      {[
        { l: "Total Users", v: "847", s: "712 active (84%)", c: T.blue },
        { l: "Regions", v: "8", s: "24 teams", c: T.violet },
        {
          l: "Content Library",
          v: "342",
          s: "86 courses, 54 AI modules",
          c: T.teal,
        },
        { l: "Active Certs", v: "2,847", s: "72% pass rate", c: T.emerald },
        {
          l: "Echo Sessions (30d)",
          v: "4,218",
          s: "↑ 23% vs last month",
          c: T.amber,
        },
      ].map((m, i) => (
        <div
          key={i}
          style={{
            background: T.card,
            borderRadius: 13,
            padding: "16px 18px",
            border: `1px solid ${T.border}`,
            animation: `fadeUp .3s ease ${i * 0.04}s both`,
          }}
        >
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 500,
              color: T.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 6,
            }}
          >
            {m.l}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: T.text,
              fontFamily: "'Outfit',sans-serif",
              lineHeight: 1,
            }}
          >
            {m.v}
          </div>
          <div
            style={{
              fontSize: 10.5,
              color: m.c,
              fontWeight: 500,
              marginTop: 5,
            }}
          >
            {m.s}
          </div>
        </div>
      ))}
    </div>

    {/* System Status */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <div
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "20px 22px",
          border: `1px solid ${T.border}`,
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.text,
            marginBottom: 14,
          }}
        >
          System Status
        </h3>
        {[
          {
            service: "Proxa Tutor Platform",
            status: "Operational",
            uptime: "99.97%",
            c: T.emerald,
          },
          {
            service: "Echo Integration API",
            status: "Operational",
            uptime: "99.94%",
            c: T.emerald,
          },
          {
            service: "AI Tutor Engine",
            status: "Operational",
            uptime: "99.89%",
            c: T.emerald,
          },
          {
            service: "Content Delivery (CDN)",
            status: "Operational",
            uptime: "99.99%",
            c: T.emerald,
          },
          {
            service: "SCORM/xAPI Gateway",
            status: "Degraded",
            uptime: "98.2%",
            c: T.amber,
          },
          {
            service: "SSO / SAML Provider",
            status: "Operational",
            uptime: "99.95%",
            c: T.emerald,
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: i < 5 ? `1px solid ${T.border}` : "none",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: s.c,
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1, fontSize: 12, color: T.text }}>
              {s.service}
            </span>
            <Badge color={s.c} size="xs">
              {s.status}
            </Badge>
            <span
              style={{
                fontSize: 11,
                color: T.textMuted,
                minWidth: 50,
                textAlign: "right",
              }}
            >
              {s.uptime}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "20px 22px",
          border: `1px solid ${T.border}`,
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.text,
            marginBottom: 14,
          }}
        >
          Recent Admin Activity
        </h3>
        {[
          {
            action: "Published new course: Reyvow® Product Launch",
            user: "Admin J. Walsh",
            time: "2h ago",
            c: T.blue,
          },
          {
            action: "Updated competency framework: Added KOL sub-competency",
            user: "Admin S. Patel",
            time: "5h ago",
            c: T.violet,
          },
          {
            action: "Assigned Ozempic® CI cert to East Region (47 reps)",
            user: "Admin J. Walsh",
            time: "1d ago",
            c: T.emerald,
          },
          {
            action: "Refreshed Echo scoring rubric for Immunology certs",
            user: "Admin M. Torres",
            time: "1d ago",
            c: T.amber,
          },
          {
            action: "Added 12 new users (Q1 new hires cohort)",
            user: "System (SCIM Sync)",
            time: "2d ago",
            c: T.teal,
          },
          {
            action: "Compliance module expiration alert sent to 83 users",
            user: "System (Automated)",
            time: "3d ago",
            c: T.rose,
          },
        ].map((a, i) => (
          <div
            key={i}
            style={{
              padding: "8px 0",
              borderBottom: i < 5 ? `1px solid ${T.border}` : "none",
            }}
          >
            <div style={{ fontSize: 12, color: T.text, marginBottom: 2 }}>
              {a.action}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 10.5, color: a.c, fontWeight: 500 }}>
                {a.user}
              </span>
              <span style={{ fontSize: 10.5, color: T.textFaint }}>·</span>
              <span style={{ fontSize: 10.5, color: T.textMuted }}>
                {a.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Usage Analytics */}
    <div
      style={{
        background: T.card,
        borderRadius: 14,
        padding: "20px 22px",
        border: `1px solid ${T.border}`,
      }}
    >
      <h3
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: T.text,
          marginBottom: 14,
        }}
      >
        Platform Usage (Last 30 Days)
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          { l: "AI Tutor Sessions", v: "6,842", delta: "+31%", c: T.blue },
          { l: "Courses Completed", v: "2,156", delta: "+12%", c: T.emerald },
          { l: "Quizzes Taken", v: "8,934", delta: "+28%", c: T.violet },
          {
            l: "Avg Session Duration",
            v: "18.4 min",
            delta: "+2.1 min",
            c: T.teal,
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: T.cardRaised,
              borderRadius: 10,
              padding: "14px 16px",
              textAlign: "center",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: T.text,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {m.v}
            </div>
            <div style={{ fontSize: 10.5, color: T.textMuted, marginTop: 3 }}>
              {m.l}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: m.c,
                fontWeight: 600,
                marginTop: 3,
              }}
            >
              {m.delta} vs prior
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Gamification Analytics */}
    <div
      style={{
        background: T.card,
        borderRadius: 14,
        padding: "20px 22px",
        border: `1px solid ${T.border}`,
      }}
    >
      <h3
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: T.text,
          marginBottom: 14,
        }}
      >
        Gamification & Engagement Analytics
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 10,
        }}
      >
        {[
          { l: "Total XP Earned", v: "847K", delta: "+42%", c: T.orange },
          {
            l: "Gamified Content",
            v: "4 / 8",
            delta: "50% of library",
            c: T.violet,
          },
          {
            l: "Active Streaks",
            v: "412",
            delta: "49% of users",
            c: T.emerald,
          },
          {
            l: "Leaderboard Views",
            v: "3,218",
            delta: "+67% vs prior",
            c: T.blue,
          },
          {
            l: "XP → Cert Correlation",
            v: "r=0.84",
            delta: "Strong positive",
            c: T.teal,
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: T.cardRaised,
              borderRadius: 10,
              padding: "12px 14px",
              textAlign: "center",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: m.c,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {m.v}
            </div>
            <div style={{ fontSize: 9.5, color: T.textMuted, marginTop: 3 }}>
              {m.l}
            </div>
            <div
              style={{
                fontSize: 9.5,
                color: m.c,
                fontWeight: 500,
                marginTop: 3,
              }}
            >
              {m.delta}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── User Management ──
const AdmUsersView = () => {
  const [filter, setFilter] = useState("all");
  const users = [
    {
      name: "Sarah Chen",
      email: "sarah.chen@co.com",
      role: "Sales Rep",
      region: "East",
      team: "Onc & Metab East",
      status: "Active",
      lastLogin: "Today",
      mgr: "D. Marchetti",
    },
    {
      name: "Marcus Rivera",
      email: "marcus.r@co.com",
      role: "Sales Rep",
      region: "East",
      team: "Onc & Metab East",
      status: "Active",
      lastLogin: "Today",
      mgr: "D. Marchetti",
    },
    {
      name: "Emily Watson",
      email: "emily.w@co.com",
      role: "Sales Rep",
      region: "East",
      team: "Onc & Metab East",
      status: "Active",
      lastLogin: "3d ago",
      mgr: "D. Marchetti",
    },
    {
      name: "David Marchetti",
      email: "david.m@co.com",
      role: "Manager",
      region: "East",
      team: "Onc & Metab East",
      status: "Active",
      lastLogin: "Today",
      mgr: "VP R. Singh",
    },
    {
      name: "Lisa Thompson",
      email: "lisa.t@co.com",
      role: "Sales Rep",
      region: "East",
      team: "Onc & Metab East",
      status: "Active",
      lastLogin: "Yesterday",
      mgr: "D. Marchetti",
    },
    {
      name: "James Morrison",
      email: "james.m@co.com",
      role: "Sales Rep",
      region: "East",
      team: "Onc & Metab East",
      status: "Inactive",
      lastLogin: "5d ago",
      mgr: "D. Marchetti",
    },
    {
      name: "Rachel Kim",
      email: "rachel.k@co.com",
      role: "Sales Rep",
      region: "West",
      team: "Immunology West",
      status: "Active",
      lastLogin: "Today",
      mgr: "K. Okafor",
    },
    {
      name: "Brian Foster",
      email: "brian.f@co.com",
      role: "Manager",
      region: "West",
      team: "Immunology West",
      status: "Active",
      lastLogin: "Yesterday",
      mgr: "VP R. Singh",
    },
  ];
  const filtered =
    filter === "all"
      ? users
      : filter === "active"
        ? users.filter((u) => u.status === "Active")
        : filter === "inactive"
          ? users.filter((u) => u.status === "Inactive")
          : filter === "managers"
            ? users.filter((u) => u.role === "Manager")
            : users.filter((u) => u.role === "Sales Rep");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: T.text,
              margin: "0 0 4px",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            User Management
          </h2>
          <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
            Manage users, roles, team assignments, and access permissions.
          </p>
        </div>
        <button
          style={{
            padding: "9px 20px",
            borderRadius: 9,
            border: "none",
            background: T.blue,
            color: T.white,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
            boxShadow: `0 4px 14px ${T.blue}20`,
          }}
        >
          + Add User
        </button>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {["all", "active", "inactive", "managers", "reps"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: `1px solid ${filter === f ? T.blue + "30" : T.border}`,
              background: filter === f ? T.blueGlow2 : T.card,
              color: filter === f ? T.blue : T.textMuted,
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              textTransform: "capitalize",
            }}
          >
            {f === "reps" ? "Sales Reps" : f}
          </button>
        ))}
      </div>

      <div
        style={{
          background: T.card,
          borderRadius: 13,
          overflow: "hidden",
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1.5fr .7fr .8fr 1fr .7fr .6fr",
            padding: "10px 18px",
            gap: 8,
            borderBottom: `1px solid ${T.border}`,
            background: T.cardRaised,
          }}
        >
          {[
            "Name",
            "Email",
            "Role",
            "Region / Team",
            "Manager",
            "Last Login",
            "Status",
          ].map((h) => (
            <div
              key={h}
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                color: T.textFaint,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {h}
            </div>
          ))}
        </div>
        {filtered.map((u, i) => (
          <div
            key={i}
            className="hbright"
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1.5fr .7fr .8fr 1fr .7fr .6fr",
              padding: "11px 18px",
              gap: 8,
              alignItems: "center",
              cursor: "pointer",
              borderBottom:
                i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: `${u.role === "Manager" ? T.violet : T.blue}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: u.role === "Manager" ? T.violet : T.blue,
                }}
              >
                {u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>
                {u.name}
              </span>
            </div>
            <span
              style={{
                fontSize: 11.5,
                color: T.textMuted,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {u.email}
            </span>
            <Badge color={u.role === "Manager" ? T.violet : T.blue} size="xs">
              {u.role}
            </Badge>
            <span style={{ fontSize: 11, color: T.textSoft }}>{u.region}</span>
            <span style={{ fontSize: 11, color: T.textSoft }}>{u.mgr}</span>
            <span style={{ fontSize: 11, color: T.textMuted }}>
              {u.lastLogin}
            </span>
            <Badge color={u.status === "Active" ? T.emerald : T.rose} size="xs">
              {u.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Content Management ──
const AdmContentView = () => {
  const [tab, setTab] = useState("all");
  const content = [
    {
      title: "GLP-1 Receptor Agonist MOA Deep Dive",
      type: "Course",
      ta: "Metabolic",
      status: "Published",
      author: "J. Walsh",
      updated: "Mar 8",
      enrollments: 234,
      completion: 78,
      gamified: true,
      xp: 150,
    },
    {
      title: "Competitive Landscape: Mounjaro vs Ozempic",
      type: "AI Module",
      ta: "Metabolic",
      status: "Published",
      author: "AI Generated",
      updated: "Mar 5",
      enrollments: 189,
      completion: 84,
      gamified: true,
      xp: 100,
    },
    {
      title: "SUSTAIN & SELECT Trial Evidence Review",
      type: "AI Module",
      ta: "Metabolic",
      status: "Published",
      author: "AI Generated",
      updated: "Feb 28",
      enrollments: 156,
      completion: 71,
      gamified: false,
      xp: 80,
    },
    {
      title: "Payer Objection Handling Workshop",
      type: "Workshop",
      ta: "Cross-TA",
      status: "Published",
      author: "S. Patel",
      updated: "Feb 20",
      enrollments: 312,
      completion: 65,
      gamified: true,
      xp: 200,
    },
    {
      title: "Reyvow® Product Launch",
      type: "Course",
      ta: "Neuroscience",
      status: "Draft",
      author: "J. Walsh",
      updated: "Mar 10",
      enrollments: 0,
      completion: 0,
      gamified: false,
      xp: 120,
    },
    {
      title: "Compliance: Off-Label Communication 2026",
      type: "Compliance",
      ta: "Cross-TA",
      status: "Review",
      author: "Legal/Compliance",
      updated: "Mar 7",
      enrollments: 0,
      completion: 0,
      gamified: false,
      xp: 60,
    },
    {
      title: "Immunology Landscape 2026",
      type: "Course",
      ta: "Immunology",
      status: "Published",
      author: "M. Torres",
      updated: "Jan 15",
      enrollments: 278,
      completion: 82,
      gamified: false,
      xp: 120,
    },
    {
      title: "Clinical Storytelling for Cardiologists",
      type: "Course",
      ta: "Cardiology",
      status: "Published",
      author: "S. Patel",
      updated: "Feb 1",
      enrollments: 145,
      completion: 76,
      gamified: true,
      xp: 150,
    },
  ];
  const tc = {
    Course: T.blue,
    "AI Module": T.violet,
    Workshop: T.teal,
    Compliance: T.amber,
  };
  const sc = { Published: T.emerald, Draft: T.textMuted, Review: T.amber };
  const tabs = ["all", "Course", "AI Module", "Workshop", "Compliance"];
  const filtered =
    tab === "all" ? content : content.filter((c) => c.type === tab);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: T.text,
              margin: "0 0 4px",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Content Management
          </h2>
          <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
            {orgData.contentItems} items · {orgData.courses} courses ·{" "}
            {orgData.aiModules} AI modules · {orgData.workshops} workshops
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              padding: "9px 18px",
              borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: T.card,
              color: T.textSoft,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Import SCORM
          </button>
          <button
            style={{
              padding: "9px 18px",
              borderRadius: 9,
              border: "none",
              background: T.blue,
              color: T.white,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            + Create Content
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: `1px solid ${tab === t ? T.blue + "30" : T.border}`,
              background: tab === t ? T.blueGlow2 : T.card,
              color: tab === t ? T.blue : T.textMuted,
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            {t === "all" ? "All Content" : t}
          </button>
        ))}
      </div>

      {filtered.map((c, i) => (
        <div
          key={i}
          className="hbright"
          style={{
            background: T.card,
            borderRadius: 12,
            padding: "14px 18px",
            border: `1px solid ${T.border}`,
            display: "grid",
            gridTemplateColumns: "2.5fr .7fr .7fr .6fr .5fr .7fr .7fr .5fr",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            animation: `fadeUp .25s ease ${i * 0.03}s both`,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 3,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                {c.title}
              </span>
              {c.gamified && (
                <span style={{ fontSize: 9, color: T.orange, fontWeight: 600 }}>
                  🎮
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <Badge color={tc[c.type]} size="xs">
                {c.type}
              </Badge>
              <Badge color={T.violet} size="xs">
                {c.ta}
              </Badge>
              {c.xp && (
                <span
                  style={{ fontSize: 9.5, color: T.orange, fontWeight: 600 }}
                >
                  +{c.xp} XP
                </span>
              )}
            </div>
          </div>
          <Badge color={sc[c.status]} size="xs">
            {c.status}
          </Badge>
          <span style={{ fontSize: 11, color: T.textMuted }}>{c.author}</span>
          <span style={{ fontSize: 11, color: T.textMuted }}>{c.updated}</span>
          <Badge color={c.gamified ? T.orange : T.textMuted} size="xs">
            {c.gamified ? "Gamified" : "Standard"}
          </Badge>
          <span style={{ fontSize: 12, color: T.text }}>
            {c.enrollments.toLocaleString()}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Bar
              value={c.completion}
              color={
                c.completion >= 75
                  ? T.emerald
                  : c.completion >= 50
                    ? T.amber
                    : T.textMuted
              }
              h={4}
            />
            <span style={{ fontSize: 10.5, color: T.textMuted }}>
              {c.completion || "—"}%
            </span>
          </div>
          <button
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              border: `1px solid ${T.border}`,
              background: T.cardRaised,
              color: T.textSoft,
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

// ── Cert Programs Admin ──
const AdmCertsView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: T.text,
            margin: "0 0 4px",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Certification Programs
        </h2>
        <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
          Configure certification requirements, Echo scoring rubrics, and
          remediation pathway rules.
        </p>
      </div>
      <button
        style={{
          padding: "9px 18px",
          borderRadius: 9,
          border: "none",
          background: T.blue,
          color: T.white,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        + Create Program
      </button>
    </div>

    {[
      {
        name: "Ozempic® Competitive Intelligence",
        ta: "Metabolic",
        passingScore: 75,
        assigned: 234,
        passed: 168,
        inRemediation: 28,
        echoScenarios: 3,
        remSteps: 9,
        status: "Active",
        created: "Oct 2025",
      },
      {
        name: "SKYRIZI® Objection Handling",
        ta: "Immunology",
        passingScore: 75,
        assigned: 198,
        passed: 142,
        inRemediation: 22,
        echoScenarios: 2,
        remSteps: 7,
        status: "Active",
        created: "Nov 2025",
      },
      {
        name: "Dupixent® Clinical Data Mastery",
        ta: "Dermatology",
        passingScore: 70,
        assigned: 210,
        passed: 178,
        inRemediation: 12,
        echoScenarios: 2,
        remSteps: 6,
        status: "Active",
        created: "Sep 2025",
      },
      {
        name: "Keytruda® Indication Expansion",
        ta: "Oncology",
        passingScore: 75,
        assigned: 189,
        passed: 156,
        inRemediation: 8,
        echoScenarios: 3,
        remSteps: 8,
        status: "Active",
        created: "Aug 2025",
      },
      {
        name: "Entresto® Cardiology Positioning",
        ta: "Cardiology",
        passingScore: 70,
        assigned: 156,
        passed: 121,
        inRemediation: 14,
        echoScenarios: 2,
        remSteps: 7,
        status: "Active",
        created: "Oct 2025",
      },
      {
        name: "Reyvow® Product Launch",
        ta: "Neuroscience",
        passingScore: 75,
        assigned: 0,
        passed: 0,
        inRemediation: 0,
        echoScenarios: 2,
        remSteps: 8,
        status: "Draft",
        created: "Mar 2026",
      },
    ].map((p, i) => (
      <div
        key={i}
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "20px 22px",
          border: `1px solid ${T.border}`,
          animation: `fadeUp .3s ease ${i * 0.04}s both`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>
                {p.name}
              </span>
              <Badge
                color={p.status === "Active" ? T.emerald : T.textMuted}
                size="xs"
              >
                {p.status}
              </Badge>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Badge color={T.violet} size="xs">
                {p.ta}
              </Badge>
              <span style={{ fontSize: 11, color: T.textMuted }}>
                Created {p.created}
              </span>
            </div>
          </div>
          <button
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.cardRaised,
              color: T.textSoft,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Configure
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6,1fr)",
            gap: 10,
          }}
        >
          {[
            { l: "Passing Score", v: `${p.passingScore}%`, c: T.blue },
            { l: "Assigned", v: p.assigned.toLocaleString(), c: T.blue },
            { l: "Passed", v: p.passed.toLocaleString(), c: T.emerald },
            { l: "In Remediation", v: String(p.inRemediation), c: T.rose },
            { l: "Echo Scenarios", v: String(p.echoScenarios), c: T.violet },
            { l: "Remediation Steps", v: String(p.remSteps), c: T.teal },
          ].map((m, j) => (
            <div
              key={j}
              style={{
                background: T.cardRaised,
                borderRadius: 8,
                padding: "10px",
                textAlign: "center",
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: m.c,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {m.v}
              </div>
              <div style={{ fontSize: 9.5, color: T.textMuted, marginTop: 2 }}>
                {m.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ── Competency Framework Admin ──
const AdmCompFrameworkView = () => {
  const [selectedRole, setSelectedRole] = useState("specialty_rep");
  const [showRubric, setShowRubric] = useState(null);

  const roles = [
    {
      id: "specialty_rep",
      label: "Specialty Sales Rep",
      count: 612,
      frameworks: 6,
    },
    {
      id: "key_account",
      label: "Key Account Manager",
      count: 89,
      frameworks: 5,
    },
    { id: "msl", label: "Medical Science Liaison", count: 64, frameworks: 7 },
    { id: "field_trainer", label: "Field Trainer", count: 28, frameworks: 4 },
  ];

  const compData = {
    specialty_rep: [
      {
        name: "Clinical Knowledge",
        weight: 25,
        subs: 4,
        sources: ["Echo", "Quiz", "Course", "AI Module"],
        threshold: 70,
        color: T.emerald,
        rubric: [
          {
            level: "Expert (90-100%)",
            desc: "Articulates MOA, trial data, and safety profiles with precision. Translates complex data into compelling patient narratives. Handles unexpected clinical questions confidently.",
          },
          {
            level: "Proficient (70-89%)",
            desc: "Solid understanding of core clinical data. Can present key trial endpoints accurately. Occasionally hesitates on secondary endpoints or competitive comparisons.",
          },
          {
            level: "Developing (50-69%)",
            desc: "Knows basic MOA and headline trial results. Struggles with specific endpoints, safety nuances, or data from non-primary trials. Relies on leave-behinds.",
          },
          {
            level: "Needs Improvement (<50%)",
            desc: "Cannot accurately describe MOA or cite key trial data. Confuses endpoints or attributes data to wrong trials. Clinical credibility at risk with HCPs.",
          },
        ],
      },
      {
        name: "Competitive Positioning",
        weight: 30,
        subs: 4,
        sources: ["Echo", "AI Module", "Course"],
        threshold: 65,
        color: T.amber,
        rubric: [
          {
            level: "Expert (90-100%)",
            desc: "Proactively addresses competitive data. Uses Acknowledge→Bridge→Seed framework naturally. Leads with differentiated value without being prompted.",
          },
          {
            level: "Proficient (70-89%)",
            desc: "Can differentiate product vs competitors when asked. Acknowledges competitive strengths before pivoting. Occasionally misses optimal bridging opportunities.",
          },
          {
            level: "Developing (50-69%)",
            desc: "Knows key competitive differences but gets defensive when challenged. Avoids or dismisses competitor data rather than acknowledging it.",
          },
          {
            level: "Needs Improvement (<50%)",
            desc: "Cannot articulate meaningful differentiation. Gets flustered by competitive challenges. Defaults to price or availability arguments rather than clinical evidence.",
          },
        ],
      },
      {
        name: "Objection Handling",
        weight: 20,
        subs: 4,
        sources: ["Echo", "AI Tutor", "Course"],
        threshold: 65,
        color: T.amber,
        rubric: [
          {
            level: "Expert (90-100%)",
            desc: "Anticipates objections before they arise. Validates HCP concerns empathetically, then pivots with targeted evidence. Turns objections into opportunities.",
          },
          {
            level: "Proficient (70-89%)",
            desc: "Handles common objections with prepared frameworks. Validates before responding. May struggle with unexpected or multi-layered objections.",
          },
          {
            level: "Developing (50-69%)",
            desc: "Can address simple objections but loses composure with pushback. Skips validation step. Responses feel rehearsed rather than conversational.",
          },
          {
            level: "Needs Improvement (<50%)",
            desc: "Avoids or deflects objections. Becomes defensive or changes subject. Cannot recover when HCP challenges clinical claims.",
          },
        ],
      },
      {
        name: "Selling Skills",
        weight: 15,
        subs: 4,
        sources: ["Echo", "AI Module", "Course"],
        threshold: 70,
        color: T.blue,
        rubric: [],
      },
      {
        name: "Regulatory Compliance",
        weight: 10,
        subs: 4,
        sources: ["Compliance Module", "Echo", "Course"],
        threshold: 85,
        color: T.emerald,
        rubric: [],
      },
      {
        name: "Territory & Account Management",
        weight: 0,
        subs: 4,
        sources: ["Analytics", "AI Module", "Course"],
        threshold: 65,
        color: T.blue,
        note: "Supplemental — not weighted in readiness score",
        rubric: [],
      },
    ],
    key_account: [
      {
        name: "Strategic Account Planning",
        weight: 30,
        subs: 4,
        sources: ["Analytics", "Course", "AI Module"],
        threshold: 70,
        color: T.blue,
        rubric: [],
      },
      {
        name: "Clinical Knowledge",
        weight: 20,
        subs: 4,
        sources: ["Echo", "Quiz", "Course"],
        threshold: 70,
        color: T.emerald,
        rubric: [],
      },
      {
        name: "Formulary & Access Strategy",
        weight: 25,
        subs: 4,
        sources: ["Echo", "Course", "Workshop"],
        threshold: 70,
        color: T.amber,
        rubric: [],
      },
      {
        name: "Stakeholder Mapping",
        weight: 15,
        subs: 3,
        sources: ["Analytics", "AI Module"],
        threshold: 65,
        color: T.violet,
        rubric: [],
      },
      {
        name: "Regulatory Compliance",
        weight: 10,
        subs: 4,
        sources: ["Compliance Module"],
        threshold: 85,
        color: T.emerald,
        rubric: [],
      },
    ],
    msl: [
      {
        name: "Deep Scientific Knowledge",
        weight: 35,
        subs: 5,
        sources: ["Quiz", "Course", "AI Module", "Peer Review"],
        threshold: 80,
        color: T.emerald,
        rubric: [],
      },
      {
        name: "Clinical Data Communication",
        weight: 25,
        subs: 4,
        sources: ["Echo", "AI Tutor"],
        threshold: 75,
        color: T.blue,
        rubric: [],
      },
      {
        name: "KOL Engagement",
        weight: 20,
        subs: 3,
        sources: ["Echo", "Analytics"],
        threshold: 70,
        color: T.violet,
        rubric: [],
      },
      {
        name: "Medical Strategy",
        weight: 10,
        subs: 3,
        sources: ["AI Module", "Course"],
        threshold: 70,
        color: T.amber,
        rubric: [],
      },
      {
        name: "Regulatory Compliance",
        weight: 10,
        subs: 4,
        sources: ["Compliance Module"],
        threshold: 90,
        color: T.emerald,
        rubric: [],
      },
    ],
    field_trainer: [
      {
        name: "Training Delivery",
        weight: 30,
        subs: 4,
        sources: ["Echo", "Peer Review"],
        threshold: 75,
        color: T.blue,
        rubric: [],
      },
      {
        name: "Clinical Knowledge",
        weight: 25,
        subs: 4,
        sources: ["Quiz", "Course"],
        threshold: 80,
        color: T.emerald,
        rubric: [],
      },
      {
        name: "Coaching & Feedback",
        weight: 25,
        subs: 3,
        sources: ["Echo", "AI Tutor"],
        threshold: 75,
        color: T.violet,
        rubric: [],
      },
      {
        name: "Content Development",
        weight: 20,
        subs: 3,
        sources: ["Course", "AI Module"],
        threshold: 70,
        color: T.teal,
        rubric: [],
      },
    ],
  };

  const currentComps = compData[selectedRole] || compData.specialty_rep;
  const activeRole = roles.find((r) => r.id === selectedRole);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        animation: "fadeUp .4s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: T.text,
              margin: "0 0 4px",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Competency Framework Configuration
          </h2>
          <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
            Define role-specific competency maps, scoring weights, behavioral
            rubrics, and assessment sources.
          </p>
        </div>
        <button
          style={{
            padding: "9px 18px",
            borderRadius: 9,
            border: "none",
            background: T.blue,
            color: T.white,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          + Add Competency
        </button>
      </div>

      {/* Role Selector */}
      <div
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "16px 20px",
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: T.teal,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 10,
          }}
        >
          Select Role — Competency Framework
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${roles.length},1fr)`,
            gap: 8,
          }}
        >
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRole(r.id);
                setShowRubric(null);
              }}
              style={{
                padding: "12px",
                borderRadius: 10,
                textAlign: "center",
                cursor: "pointer",
                border: `1.5px solid ${selectedRole === r.id ? T.teal + "40" : T.border}`,
                background:
                  selectedRole === r.id ? `${T.teal}10` : T.cardRaised,
                fontFamily: "'Outfit',sans-serif",
                transition: "all .15s",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: selectedRole === r.id ? T.teal : T.text,
                }}
              >
                {r.label}
              </div>
              <div style={{ fontSize: 10.5, color: T.textMuted, marginTop: 3 }}>
                {r.count} users · {r.frameworks} competencies
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Framework Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            fontFamily: "'Outfit',sans-serif",
            margin: 0,
          }}
        >
          {activeRole?.label} — Competency Framework
        </h3>
        <Badge color={T.teal} size="xs">
          {currentComps.length} competencies
        </Badge>
      </div>

      {/* Competency Cards with Rubrics */}
      {currentComps.map((c, i) => (
        <div
          key={i}
          style={{
            background: T.card,
            borderRadius: 13,
            overflow: "hidden",
            border: `1px solid ${showRubric === i ? T.borderLight : T.border}`,
            animation: `fadeUp .3s ease ${i * 0.04}s both`,
            transition: "border-color .2s",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Ring value={c.weight || 5} size={44} stroke={3.5} color={c.color}>
              <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>
                {c.weight}%
              </span>
            </Ring>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 3,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 11, color: T.textMuted }}>
                  {c.subs} sub-competencies
                </span>
                <span style={{ color: T.textFaint }}>·</span>
                <span style={{ fontSize: 11, color: T.textMuted }}>
                  Threshold: {c.threshold}%
                </span>
                <span style={{ color: T.textFaint }}>·</span>
                {c.sources.map((s, j) => (
                  <Badge key={j} color={T.textMuted} bg={T.glass} size="xs">
                    {s}
                  </Badge>
                ))}
              </div>
              {c.note && (
                <div
                  style={{
                    fontSize: 10.5,
                    color: T.amber,
                    fontWeight: 500,
                    marginTop: 4,
                  }}
                >
                  {c.note}
                </div>
              )}
            </div>
            {c.rubric && c.rubric.length > 0 && (
              <button
                onClick={() => setShowRubric(showRubric === i ? null : i)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  border: `1px solid ${showRubric === i ? T.teal + "30" : T.border}`,
                  background: showRubric === i ? `${T.teal}10` : T.cardRaised,
                  color: showRubric === i ? T.teal : T.textSoft,
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                Scoring Rubric
              </button>
            )}
            <button
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                border: `1px solid ${T.border}`,
                background: T.cardRaised,
                color: T.textSoft,
                fontSize: 10.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              Edit
            </button>
          </div>

          {/* Behavioral Rubric */}
          {showRubric === i && c.rubric && c.rubric.length > 0 && (
            <div
              style={{ padding: "0 20px 16px", animation: "fadeIn .2s ease" }}
            >
              <div
                style={{
                  background: T.cardRaised,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderBottom: `1px solid ${T.border}`,
                    background: `${T.teal}06`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: T.teal,
                      letterSpacing: 0.3,
                    }}
                  >
                    Behavioral Scoring Rubric — {c.name}
                  </span>
                </div>
                {c.rubric.map((r, ri) => {
                  const lvlColor =
                    ri === 0
                      ? T.emerald
                      : ri === 1
                        ? T.blue
                        : ri === 2
                          ? T.amber
                          : T.rose;
                  return (
                    <div
                      key={ri}
                      style={{
                        padding: "12px 14px",
                        borderBottom:
                          ri < c.rubric.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <Badge color={lvlColor} size="sm" bg={`${lvlColor}12`}>
                        {r.level}
                      </Badge>
                      <span
                        style={{
                          fontSize: 12,
                          color: T.textSoft,
                          lineHeight: 1.6,
                          flex: 1,
                        }}
                      >
                        {r.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Echo Integration Admin ──
const AdmEchoView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 4px",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        Echo Integration Configuration
      </h2>
      <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
        Manage the Echo ↔ Tutor API connection, gap analysis ingestion, and
        certification loop rules.
      </p>
    </div>

    {/* Connection Status */}
    <div
      style={{
        background: T.card,
        borderRadius: 14,
        padding: "20px 22px",
        border: `1px solid ${T.emerald}15`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: T.emerald,
            animation: "breathe 2s ease infinite",
          }}
        />
        <h3
          style={{ fontSize: 14, fontWeight: 600, color: T.emerald, margin: 0 }}
        >
          Echo API — Connected & Healthy
        </h3>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
        }}
      >
        {[
          { l: "API Endpoint", v: "echo-api.proxalabs.com", c: T.text },
          { l: "API Version", v: "v2.4.1", c: T.blue },
          { l: "Last Sync", v: "2 min ago", c: T.emerald },
          { l: "Avg Latency", v: "142ms", c: T.emerald },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: T.cardRaised,
              borderRadius: 8,
              padding: "10px 12px",
              border: `1px solid ${T.border}`,
            }}
          >
            <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 3 }}>
              {m.l}
            </div>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: m.c,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {m.v}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Loop Configuration */}
    <div
      style={{
        background: T.card,
        borderRadius: 14,
        padding: "20px 22px",
        border: `1px solid ${T.border}`,
      }}
    >
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: T.text,
          marginBottom: 14,
        }}
      >
        Certification Loop Rules
      </h3>
      {[
        {
          rule: "Auto-generate remediation pathway on Echo failure",
          val: "Enabled",
          c: T.emerald,
        },
        {
          rule: "Maximum Echo re-attempts before manager escalation",
          val: "3 attempts",
          c: T.blue,
        },
        {
          rule: "Minimum remediation completion before re-attempt",
          val: "100%",
          c: T.blue,
        },
        {
          rule: "Gap analysis ingestion mode",
          val: "Real-time (webhook)",
          c: T.emerald,
        },
        {
          rule: "Remediation pathway generation",
          val: "AI-Adaptive (personalized)",
          c: T.violet,
        },
        {
          rule: "Cool-down period between Echo attempts",
          val: "48 hours",
          c: T.amber,
        },
        {
          rule: "Manager notification on 2nd failure",
          val: "Enabled",
          c: T.emerald,
        },
        {
          rule: "Auto-assign prep modules before first attempt",
          val: "Enabled",
          c: T.emerald,
        },
      ].map((r, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i < 7 ? `1px solid ${T.border}` : "none",
          }}
        >
          <span style={{ fontSize: 12.5, color: T.text }}>{r.rule}</span>
          <Badge color={r.c} size="sm">
            {r.val}
          </Badge>
        </div>
      ))}
    </div>

    {/* CRM Integration Triggers */}
    <div
      style={{
        background: T.card,
        borderRadius: 14,
        padding: "20px 22px",
        border: `1px solid ${T.border}`,
      }}
    >
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: T.text,
          marginBottom: 6,
        }}
      >
        CRM Integration — Bidirectional Triggers
      </h3>
      <p style={{ fontSize: 12, color: T.textMuted, margin: "0 0 14px" }}>
        Actions can be triggered from CRM into Proxa Tutor and vice versa.
        Configure which events flow between systems.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* CRM → Tutor */}
        <div
          style={{
            background: T.cardRaised,
            borderRadius: 10,
            padding: "14px 16px",
            border: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 13 }}>📥</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.blue }}>
              CRM → Proxa Tutor (Inbound)
            </span>
          </div>
          {[
            {
              trigger: "New product launch in CRM",
              action: "Auto-assign certification to all reps in territory",
              status: "Active",
              c: T.emerald,
            },
            {
              trigger: "Rep assigned new territory/accounts",
              action: "Trigger Pre-Call Prep generation for new HCPs",
              status: "Active",
              c: T.emerald,
            },
            {
              trigger: "HCP interaction logged in Veeva",
              action: "Update Pre-Call Prep intel + last visit date",
              status: "Active",
              c: T.emerald,
            },
            {
              trigger: "New hire onboarded in CRM",
              action: "Auto-enroll in onboarding certification pathway",
              status: "Active",
              c: T.emerald,
            },
            {
              trigger: "Manager change in HRIS",
              action: "Reassign coaching relationships in Tutor",
              status: "Active",
              c: T.emerald,
            },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                padding: "8px 0",
                borderBottom: i < 4 ? `1px solid ${T.border}` : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <span
                  style={{ fontSize: 11.5, fontWeight: 500, color: T.text }}
                >
                  {t.trigger}
                </span>
                <Badge color={t.c} size="xs">
                  {t.status}
                </Badge>
              </div>
              <span style={{ fontSize: 10.5, color: T.textMuted }}>
                → {t.action}
              </span>
            </div>
          ))}
        </div>

        {/* Tutor → CRM */}
        <div
          style={{
            background: T.cardRaised,
            borderRadius: 10,
            padding: "14px 16px",
            border: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 13 }}>📤</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.violet }}>
              Proxa Tutor → CRM (Outbound)
            </span>
          </div>
          {[
            {
              trigger: "Rep earns certification",
              action: "Update rep profile badge in Veeva/Salesforce",
              status: "Active",
              c: T.emerald,
            },
            {
              trigger: "Rep enters remediation",
              action: "Flag rep in CRM with 'Certification In Progress' status",
              status: "Active",
              c: T.emerald,
            },
            {
              trigger: "Readiness score drops below 50",
              action: "Create CRM alert for manager + L&D team",
              status: "Active",
              c: T.emerald,
            },
            {
              trigger: "Pre-Call Prep generated",
              action: "Attach briefing to next scheduled CRM activity",
              status: "Active",
              c: T.emerald,
            },
            {
              trigger: "Compliance training expired",
              action: "Flag non-compliant status in CRM, restrict HCP access",
              status: "Active",
              c: T.emerald,
            },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                padding: "8px 0",
                borderBottom: i < 4 ? `1px solid ${T.border}` : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <span
                  style={{ fontSize: 11.5, fontWeight: 500, color: T.text }}
                >
                  {t.trigger}
                </span>
                <Badge color={t.c} size="xs">
                  {t.status}
                </Badge>
              </div>
              <span style={{ fontSize: 10.5, color: T.textMuted }}>
                → {t.action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CRM Button Preview */}
      <div
        style={{
          marginTop: 14,
          background: `${T.violet}06`,
          borderRadius: 10,
          padding: "16px 18px",
          border: `1px solid ${T.violet}15`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: T.violet,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 8,
          }}
        >
          CRM-Side Experience — What Reps See in Veeva/Salesforce
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          {[
            {
              label: "Account Record",
              desc: '"Launch Proxa Tutor" button on HCP account page. Opens Pre-Call Prep for that specific HCP with AI-generated briefing.',
              icon: "👤",
            },
            {
              label: "Activity Feed",
              desc: "Certification status badges visible on rep profile. Managers see readiness scores and gap alerts directly in CRM dashboards.",
              icon: "📋",
            },
            {
              label: "Call Planning",
              desc: 'Before a scheduled HCP visit, CRM surfaces a notification: "AI Prep Brief available for Dr. Patel — open in Proxa Tutor."',
              icon: "📞",
            },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                background: T.card,
                borderRadius: 8,
                padding: "12px",
                border: `1px solid ${T.border}`,
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 6 }}>{p.icon}</div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 4,
                }}
              >
                {p.label}
              </div>
              <div
                style={{ fontSize: 10.5, color: T.textMuted, lineHeight: 1.5 }}
              >
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── AI Configuration Admin ──
const AdmAIView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 4px",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        AI Engine Configuration
      </h2>
      <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
        Configure AI Tutor behavior, adaptive quiz engine, predictive models,
        and content recommendation algorithms.
      </p>
    </div>

    {/* AI Models */}
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}
    >
      {[
        {
          name: "AI Tutor Conversation Engine",
          model: "GPT-4o Fine-tuned (Biopharma)",
          status: "Active",
          version: "v3.2",
          lastUpdate: "Mar 1, 2026",
          temp: "0.7",
          maxTokens: "4096",
          settings: [
            "Gap-Aware mode: Uses Echo scorecard data",
            "Adaptive difficulty: Scales with real-time performance",
            "Coaching framework: Acknowledge → Bridge → Seed",
            "HCP simulation: 14 persona archetypes configured",
          ],
        },
        {
          name: "Adaptive Quiz Generator",
          model: "Custom ML (Proxa)",
          status: "Active",
          version: "v2.1",
          lastUpdate: "Feb 15, 2026",
          temp: "—",
          maxTokens: "—",
          settings: [
            "Difficulty levels: 5 (auto-calibrated per user)",
            "Question bank: 850+ questions across 6 competencies",
            "Distractor quality: AI-generated, expert-validated",
            "Adaptive algorithm: Modified Item Response Theory (IRT)",
          ],
        },
        {
          name: "Predictive Readiness Model",
          model: "XGBoost Ensemble",
          status: "Active",
          version: "v1.8",
          lastUpdate: "Feb 28, 2026",
          temp: "—",
          maxTokens: "—",
          settings: [
            "Features: 24 signals (Echo scores, engagement, quiz performance, etc.)",
            "Prediction window: 14-day rolling forecast",
            "Accuracy: 87% for pass/fail prediction at 7-day horizon",
            "Retraining: Weekly on latest certification outcome data",
          ],
        },
        {
          name: "Content Recommendation Engine",
          model: "Collaborative Filtering + NLP",
          status: "Active",
          version: "v2.0",
          lastUpdate: "Mar 5, 2026",
          temp: "—",
          maxTokens: "—",
          settings: [
            "Signals: Gap profile, peer success patterns, content effectiveness",
            "Personalization: Per-user learning style and modality preference",
            "Effectiveness tracking: Pre/post competency score correlation",
            "Cold start: Role-based defaults for new users",
          ],
        },
      ].map((ai, i) => (
        <div
          key={i}
          style={{
            background: T.card,
            borderRadius: 14,
            padding: "18px 20px",
            border: `1px solid ${T.border}`,
            animation: `fadeUp .3s ease ${i * 0.04}s both`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: T.emerald,
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>
              {ai.name}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {[
              { l: "Model", v: ai.model },
              { l: "Version", v: ai.version },
              { l: "Status", v: ai.status },
              { l: "Last Updated", v: ai.lastUpdate },
            ].map((d, j) => (
              <div
                key={j}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span style={{ fontSize: 10.5, color: T.textMuted }}>
                  {d.l}
                </span>
                <span
                  style={{ fontSize: 10.5, color: T.text, fontWeight: 500 }}
                >
                  {d.v}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              background: T.cardRaised,
              borderRadius: 8,
              padding: "10px 12px",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                color: T.violet,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 6,
              }}
            >
              Configuration
            </div>
            {ai.settings.map((s, j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "flex-start",
                  marginBottom: 3,
                }}
              >
                <span
                  style={{
                    color: T.violet,
                    fontSize: 8,
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                >
                  ●
                </span>
                <span
                  style={{ fontSize: 11, color: T.textSoft, lineHeight: 1.45 }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Compliance & Audit ──
const AdmComplianceView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 4px",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        Compliance & Audit
      </h2>
      <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
        Compliance training status, audit logs, regulatory reporting, and data
        retention policies.
      </p>
    </div>

    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}
    >
      {[
        {
          l: "Compliance Modules",
          v: "18",
          s: "4 expiring this quarter",
          c: T.amber,
        },
        { l: "Completion Rate", v: "94%", s: "Target: 100%", c: T.emerald },
        { l: "Overdue Users", v: "23", s: "Notifications sent", c: T.rose },
        { l: "Audit Events (30d)", v: "12,847", s: "All logged", c: T.blue },
      ].map((m, i) => (
        <div
          key={i}
          style={{
            background: T.card,
            borderRadius: 13,
            padding: "16px 18px",
            border: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 500,
              color: T.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 6,
            }}
          >
            {m.l}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: T.text,
              fontFamily: "'Outfit',sans-serif",
              lineHeight: 1,
            }}
          >
            {m.v}
          </div>
          <div
            style={{
              fontSize: 10.5,
              color: m.c,
              fontWeight: 500,
              marginTop: 5,
            }}
          >
            {m.s}
          </div>
        </div>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* Compliance Modules */}
      <div
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "20px 22px",
          border: `1px solid ${T.border}`,
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.text,
            marginBottom: 14,
          }}
        >
          Active Compliance Modules
        </h3>
        {[
          {
            name: "Off-Label Communication",
            due: "Apr 30",
            completion: 91,
            status: "Active",
          },
          {
            name: "Adverse Event Reporting",
            due: "Jun 30",
            completion: 88,
            status: "Active",
          },
          {
            name: "HIPAA Privacy & Security",
            due: "Mar 31",
            completion: 96,
            status: "Expiring Soon",
          },
          {
            name: "Anti-Kickback Statute",
            due: "May 15",
            completion: 82,
            status: "Active",
          },
          {
            name: "Fair Balance Requirements",
            due: "Jul 31",
            completion: 79,
            status: "Active",
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: i < 4 ? `1px solid ${T.border}` : "none",
            }}
          >
            <span style={{ flex: 1, fontSize: 12, color: T.text }}>
              {m.name}
            </span>
            <Badge
              color={m.status === "Expiring Soon" ? T.amber : T.emerald}
              size="xs"
            >
              {m.status}
            </Badge>
            <span style={{ fontSize: 11, color: T.textMuted, minWidth: 50 }}>
              {m.due}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: m.completion >= 90 ? T.emerald : T.amber,
                minWidth: 30,
              }}
            >
              {m.completion}%
            </span>
          </div>
        ))}
      </div>

      {/* Audit Log */}
      <div
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "20px 22px",
          border: `1px solid ${T.border}`,
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.text,
            marginBottom: 14,
          }}
        >
          Recent Audit Log
        </h3>
        {[
          {
            event: "User login: D. Marchetti",
            type: "Auth",
            time: "2 min ago",
          },
          {
            event: "Course published: Reyvow® Launch (draft)",
            type: "Content",
            time: "2h ago",
          },
          {
            event: "Certification assigned: East Region batch",
            type: "Cert",
            time: "1d ago",
          },
          {
            event: "SCIM user sync: 12 users added",
            type: "User",
            time: "2d ago",
          },
          {
            event: "AI model retrained: Readiness predictor v1.8",
            type: "AI",
            time: "2d ago",
          },
          {
            event: "Compliance alert: 23 overdue users notified",
            type: "Compliance",
            time: "3d ago",
          },
          {
            event: "Data export: Q4 certification report",
            type: "Export",
            time: "3d ago",
          },
          {
            event: "Role change: B. Foster → Manager",
            type: "User",
            time: "5d ago",
          },
        ].map((a, i) => (
          <div
            key={i}
            style={{
              padding: "7px 0",
              borderBottom: i < 7 ? `1px solid ${T.border}` : "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Badge color={T.textMuted} bg={T.glass} size="xs">
              {a.type}
            </Badge>
            <span style={{ flex: 1, fontSize: 11.5, color: T.textSoft }}>
              {a.event}
            </span>
            <span style={{ fontSize: 10, color: T.textMuted }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── System Settings ──
const AdmSettingsView = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      animation: "fadeUp .4s ease",
    }}
  >
    <div>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 4px",
          fontFamily: "'Outfit',sans-serif",
        }}
      >
        System Settings
      </h2>
      <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>
        Platform configuration, integrations, security, branding, and data
        management.
      </p>
    </div>

    {/* Settings Groups */}
    {[
      {
        title: "Organization",
        icon: "🏢",
        settings: [
          { l: "Organization Name", v: "Acme Biopharma Inc.", type: "text" },
          {
            l: "Platform URL",
            v: "tutor.acmebiopharma.proxalabs.com",
            type: "text",
          },
          { l: "Default Timezone", v: "Eastern Time (ET)", type: "select" },
          { l: "Default Language", v: "English (US)", type: "select" },
          { l: "Fiscal Year Start", v: "January", type: "select" },
        ],
      },
      {
        title: "Authentication & Security",
        icon: "🔒",
        settings: [
          {
            l: "SSO Provider",
            v: "Okta (SAML 2.0)",
            type: "badge",
            bc: T.emerald,
          },
          {
            l: "SCIM User Provisioning",
            v: "Enabled — Okta",
            type: "badge",
            bc: T.emerald,
          },
          {
            l: "Multi-Factor Authentication",
            v: "Required for all users",
            type: "badge",
            bc: T.emerald,
          },
          { l: "Session Timeout", v: "8 hours", type: "text" },
          { l: "Password Policy", v: "Managed by SSO provider", type: "text" },
          {
            l: "IP Allowlisting",
            v: "Disabled",
            type: "badge",
            bc: T.textMuted,
          },
        ],
      },
      {
        title: "Integrations",
        icon: "🔗",
        settings: [
          {
            l: "Proxa Echo",
            v: "Connected (API v2.4.1)",
            type: "badge",
            bc: T.emerald,
          },
          {
            l: "Veeva CRM",
            v: "Connected (Sync: hourly)",
            type: "badge",
            bc: T.emerald,
          },
          {
            l: "Workday HRIS",
            v: "Connected (SCIM)",
            type: "badge",
            bc: T.emerald,
          },
          {
            l: "Salesforce",
            v: "Not configured",
            type: "badge",
            bc: T.textMuted,
          },
          {
            l: "Microsoft Teams",
            v: "Connected (Notifications)",
            type: "badge",
            bc: T.emerald,
          },
          {
            l: "SCORM/xAPI LRS",
            v: "Connected (xAPI endpoint)",
            type: "badge",
            bc: T.amber,
          },
        ],
      },
      {
        title: "Data & Privacy",
        icon: "🛡",
        settings: [
          { l: "Data Residency", v: "US-East (AWS us-east-1)", type: "text" },
          {
            l: "Encryption at Rest",
            v: "AES-256",
            type: "badge",
            bc: T.emerald,
          },
          {
            l: "Encryption in Transit",
            v: "TLS 1.3",
            type: "badge",
            bc: T.emerald,
          },
          {
            l: "Data Retention Policy",
            v: "3 years (configurable)",
            type: "text",
          },
          { l: "GDPR Compliance", v: "Enabled", type: "badge", bc: T.emerald },
          {
            l: "SOC 2 Type II",
            v: "Certified (Renewed Jan 2026)",
            type: "badge",
            bc: T.emerald,
          },
          {
            l: "Automated Backups",
            v: "Daily — 30-day retention",
            type: "text",
          },
        ],
      },
      {
        title: "Notifications",
        icon: "🔔",
        settings: [
          { l: "Certification Assignment", v: "Email + In-app", type: "text" },
          {
            l: "Echo Failure Alert",
            v: "Email + In-app + Manager notify",
            type: "text",
          },
          {
            l: "Remediation Pathway Created",
            v: "Email + In-app",
            type: "text",
          },
          {
            l: "Compliance Expiration Warning",
            v: "Email (30, 14, 7 days before)",
            type: "text",
          },
          {
            l: "Manager Escalation (3rd failure)",
            v: "Email to Manager + L&D Admin",
            type: "text",
          },
          {
            l: "Weekly Digest",
            v: "Enabled — Mondays 8:00 AM ET",
            type: "text",
          },
        ],
      },
    ].map((group, gi) => (
      <div
        key={gi}
        style={{
          background: T.card,
          borderRadius: 14,
          padding: "20px 22px",
          border: `1px solid ${T.border}`,
          animation: `fadeUp .3s ease ${gi * 0.04}s both`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 16 }}>{group.icon}</span>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.text,
              fontFamily: "'Outfit',sans-serif",
              margin: 0,
            }}
          >
            {group.title}
          </h3>
        </div>
        {group.settings.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 0",
              borderBottom:
                i < group.settings.length - 1
                  ? `1px solid ${T.border}`
                  : "none",
            }}
          >
            <span style={{ fontSize: 12.5, color: T.text }}>{s.l}</span>
            {s.type === "badge" ? (
              <Badge color={s.bc} size="sm">
                {s.v}
              </Badge>
            ) : (
              <span
                style={{ fontSize: 12.5, color: T.textSoft, fontWeight: 500 }}
              >
                {s.v}
              </span>
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════
// MAIN APPLICATION — with Login, Landing, 3-Role
// ═══════════════════════════════════════════════
export default function App() {
  const [appState, setAppState] = useState("login"); // "login", "landing", "app"
  const [view, setView] = useState("home");
  const [hov, setHov] = useState(null);
  const [role, setRole] = useState("rep");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [aiWidgetOpen, setAiWidgetOpen] = useState(false);
  const [aiWidgetInput, setAiWidgetInput] = useState("");
  const [aiWidgetMsgs, setAiWidgetMsgs] = useState([]);
  const [aiWidgetTyping, setAiWidgetTyping] = useState(false);

  // Login handler
  const handleLogin = () => setAppState("landing");
  const handleLandingContinue = (targetView) => {
    setView(targetView || "home");
    setAppState("app");
  };

  // Show login
  if (appState === "login") return <LoginPage onLogin={handleLogin} />;
  // Show landing
  if (appState === "landing")
    return <LandingPage onContinue={handleLandingContinue} userName="Sarah" />;

  const repViews = {
    home: <HomeView go={setView} />,
    pathway: <PathwayView go={setView} />,
    tutor: <TutorView />,
    certs: <CertsView go={setView} />,
    competencies: <CompetenciesView />,
    library: <LibraryView />,
    coaching: <CoachingView />,
    insights: <InsightsView />,
    precall: <PreCallView />,
    achievements: <AchievementsView />,
    profile: <ProfileView />,
    peer: <PeerView />,
    notifications: <NotificationsView />,
  };

  const mgrViews = {
    mgr_dash: <MgrDashView />,
    mgr_reps: <MgrRepsView />,
    mgr_certs: <MgrCertsView />,
    mgr_competencies: <MgrCompView />,
    mgr_insights: <MgrInsightsView />,
    mgr_coaching: <MgrCoachingView />,
    mgr_reports: <MgrReportsView />,
  };

  const adminViews = {
    adm_dash: <AdmDashView />,
    adm_users: <AdmUsersView />,
    adm_content: <AdmContentView />,
    adm_certs: <AdmCertsView />,
    adm_comp_framework: <AdmCompFrameworkView />,
    adm_echo: <AdmEchoView />,
    adm_ai: <AdmAIView />,
    adm_compliance: <AdmComplianceView />,
    adm_settings: <AdmSettingsView />,
  };

  const views = { ...repViews, ...mgrViews, ...adminViews };
  const currentNav =
    role === "rep" ? navItems : role === "mgr" ? mgrNavItems : adminNavItems;

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setView(
      newRole === "rep" ? "home" : newRole === "mgr" ? "mgr_dash" : "adm_dash",
    );
  };

  const users = {
    rep: {
      name: "Sarah Chen",
      init: "SC",
      title: "Specialty Sales Rep · East",
    },
    mgr: {
      name: "David Marchetti",
      init: "DM",
      title: "Regional Sales Director",
    },
    admin: {
      name: "Jessica Walsh",
      init: "JW",
      title: "Platform Administrator",
    },
  };

  const roleColors = { rep: T.blue, mgr: T.violet, admin: T.teal };
  const allNavItems = [...navItems, ...mgrNavItems, ...adminNavItems];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: T.bg,
        fontFamily: "'Outfit',sans-serif",
        color: T.text,
        overflow: "hidden",
      }}
    >
      <Styles />

      {/* Sidebar */}
      <div
        style={{
          width: 210,
          background: T.panel,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Brand — click to return to Welcome */}
        <div
          onClick={() => setAppState("landing")}
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${T.border}`,
            cursor: "pointer",
            transition: "background .15s",
          }}
        >
          <img
            src="/IH_horiz_full_ILE_left.png"
            alt="InsiteHUB Intelligent Learning Environment"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Role Switcher */}
        <div style={{ padding: "10px 8px 4px" }}>
          <div
            style={{
              display: "flex",
              borderRadius: 8,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
              background: T.card,
            }}
          >
            {[
              { id: "rep", label: "Rep" },
              { id: "mgr", label: "Manager" },
              { id: "admin", label: "Admin" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => handleRoleSwitch(r.id)}
                style={{
                  flex: 1,
                  padding: "7px 0",
                  border: "none",
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: "'Outfit',sans-serif",
                  cursor: "pointer",
                  transition: "all .15s",
                  background:
                    role === r.id ? `${roleColors[r.id]}12` : "transparent",
                  color: role === r.id ? roleColors[r.id] : T.textMuted,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "6px 6px", overflowY: "auto" }}>
          {currentNav.map((item) => {
            if (item.sep)
              return (
                <div
                  key={item.id}
                  style={{
                    height: 1,
                    background: T.border,
                    margin: "8px 12px",
                  }}
                />
              );
            const act = view === item.id,
              h = hov === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                onMouseEnter={() => setHov(item.id)}
                onMouseLeave={() => setHov(null)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 11px",
                  borderRadius: 9,
                  border: "none",
                  background: act
                    ? `${roleColors[role]}12`
                    : h
                      ? T.glass
                      : "transparent",
                  color: act ? roleColors[role] : h ? T.text : T.textSoft,
                  fontSize: 12.5,
                  fontWeight: act ? 600 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 1,
                  fontFamily: "'Outfit',sans-serif",
                  transition: "all .12s",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    opacity: act ? 1 : 0.75,
                    transition: "opacity .12s",
                  }}
                >
                  <Ico d={item.icon} size={17} />
                </span>
                {item.label}
                {item.alert && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: T.rose,
                      animation: "breathe 2s ease infinite",
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div
          onClick={() => role === "rep" && setView("profile")}
          style={{
            margin: "0 6px 4px",
            padding: "11px 12px",
            background: view === "profile" ? T.blueGlow : T.card,
            borderRadius: 9,
            border: `1px solid ${view === "profile" && role === "rep" ? T.blue + "25" : T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 9,
            cursor: role === "rep" ? "pointer" : "default",
            transition: "all .15s",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: `linear-gradient(135deg,${roleColors[role]}22,${T.violet}22)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: roleColors[role],
            }}
          >
            {users[role].init}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
              {users[role].name}
            </div>
            <div style={{ fontSize: 9.5, color: T.textMuted }}>
              {users[role].title}
            </div>
          </div>
        </div>
        {/* Logout */}
        <button
          onClick={() => setAppState("login")}
          style={{
            margin: "0 6px 10px",
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: "transparent",
            color: T.textMuted,
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all .15s",
            width: "calc(100% - 12px)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            height: 48,
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 26px",
            justifyContent: "space-between",
            flexShrink: 0,
            background: T.panel,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: T.text,
                margin: 0,
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {currentNav.find((n) => n.id === view)?.label ||
                (view === "profile"
                  ? "My Profile"
                  : view === "notifications"
                    ? "Notifications"
                    : view === "peer"
                      ? "Peer Learning"
                      : "Home")}
            </h1>
            {role === "mgr" && (
              <Badge color={T.violet} size="xs">
                Manager View
              </Badge>
            )}
            {role === "admin" && (
              <Badge color={T.teal} size="xs">
                Admin View
              </Badge>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              {searchOpen ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: T.card,
                    borderRadius: 8,
                    border: `1px solid ${T.borderLight}`,
                    padding: "0 10px",
                    animation: "fadeIn .15s ease",
                  }}
                >
                  <Ico d={icons.search} size={14} />
                  <input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    autoFocus
                    placeholder="Search content, certs, competencies..."
                    style={{
                      width: 200,
                      padding: "7px 8px",
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: T.text,
                      fontSize: 11.5,
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQ("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: T.textMuted,
                      cursor: "pointer",
                      fontSize: 14,
                      padding: "0 2px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.card,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: T.textMuted,
                    transition: "all .15s",
                  }}
                >
                  <Ico d={icons.search} size={14} />
                </button>
              )}
            </div>
            {/* Notification Bell */}
            {role === "rep" && (
              <button
                onClick={() => setView("notifications")}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${view === "notifications" ? T.blue + "30" : T.border}`,
                  background: view === "notifications" ? T.blueGlow : T.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: view === "notifications" ? T.blue : T.textMuted,
                  position: "relative",
                  transition: "all .15s",
                }}
              >
                <Ico d={icons.bell} size={14} />
                <div
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: T.rose,
                    border: `2px solid ${T.panel}`,
                  }}
                />
              </button>
            )}
            {/* Echo Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 7,
                background: `${T.emerald}0A`,
                border: `1px solid ${T.emerald}18`,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: T.emerald,
                }}
              />
              <span
                style={{ fontSize: 10.5, fontWeight: 500, color: T.emerald }}
              >
                Echo Connected
              </span>
            </div>
            <span
              style={{
                fontSize: 10.5,
                color: T.textMuted,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Content Area — Moved scrolling to outer for standard views, inner for special ones */}
        <div
          style={{
            flex: 1,
            overflowY: view === "tutor" ? "hidden" : "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
          key={view}
        >
          <div
            style={{
              flex: view === "tutor" ? 1 : "initial",
              padding: view === "tutor" ? 0 : "22px 26px 40px",
              display: view === "tutor" ? "flex" : "block",
              flexDirection: "column",
              minHeight: view === "tutor" ? 0 : "auto",
            }}
          >
            {views[view]}
          </div>
        </div>
      </div>

      {/* ═══ Floating AI Tutor Agent Widget ═══ */}
      {(() => {
        // Context-aware prompts based on current view
        const viewContext = {
          home: {
            label: "Dashboard",
            hint: "I can help you prioritize your next steps, explain your metrics, or start a learning session.",
            suggestions: [
              "What should I focus on today?",
              "Explain my readiness score",
              "Start a quick quiz",
            ],
          },
          pathway: {
            label: "Remediation Pathway",
            hint: "I can explain any step in your pathway, quiz you on gap areas, or help you prepare for your next module.",
            suggestions: [
              "Why is this step in my pathway?",
              "Quiz me on MOA differentiation",
              "What happens after I complete step 3?",
            ],
          },
          tutor: {
            label: "AI Tutor",
            hint: "You're already in a Tutor session! I'm here if you want to switch modes or ask about your learning context.",
            suggestions: [
              "Switch to HCP Practice mode",
              "Show my gap progress",
              "Recommend what to study next",
            ],
          },
          certs: {
            label: "Certifications",
            hint: "I can explain any certification status, predict when you'll be ready, or help you prep for an Echo attempt.",
            suggestions: [
              "When will I be ready to re-certify?",
              "What do I need to pass Ozempic® CI?",
              "How does the Echo scoring work?",
            ],
          },
          competencies: {
            label: "Competencies",
            hint: "I can explain any competency score, quiz you on specific areas, or recommend content to improve.",
            suggestions: [
              "Why is my Competitive Positioning score low?",
              "Quiz me on objection handling",
              "What's the fastest way to improve?",
            ],
          },
          library: {
            label: "Content Library",
            hint: "I can recommend the best content for your gaps, explain any module, or create a custom learning plan.",
            suggestions: [
              "What should I learn next?",
              "Explain the SELECT trial module",
              "Build me a study plan for this week",
            ],
          },
          coaching: {
            label: "Coaching Hub",
            hint: "I can help you reflect on coaching feedback, prepare for your next 1:1, or practice specific skills.",
            suggestions: [
              "Summarize my coaching feedback",
              "Help me prepare for my 1:1",
              "What are my top strengths?",
            ],
          },
          insights: {
            label: "Performance",
            hint: "I can interpret your analytics, explain trends, or suggest how to improve specific metrics.",
            suggestions: [
              "Why did my readiness score drop?",
              "How do I compare to peers?",
              "What's driving my Echo score trend?",
            ],
          },
          precall: {
            label: "Pre-Call Prep",
            hint: "I can help you prep for any HCP visit, practice objection handling, or refine your messaging.",
            suggestions: [
              "Help me prep for Dr. Patel",
              "Practice payer objections",
              "What should I lead with for a cardiologist?",
            ],
          },
          achievements: {
            label: "Achievements",
            hint: "I can explain milestone requirements, suggest how to unlock the next one, or celebrate your wins.",
            suggestions: [
              "How do I unlock Comeback Story?",
              "What's my closest milestone?",
              "How do I extend my streak?",
            ],
          },
          profile: {
            label: "Profile",
            hint: "I can explain your AI learning profile, suggest setting changes, or review your development journey.",
            suggestions: [
              "Explain my AI learning profile",
              "What does my quiz difficulty level mean?",
              "Summarize my growth this quarter",
            ],
          },
          peer: {
            label: "Peer Learning",
            hint: "I can help you apply top performer insights, find relevant tips, or suggest a team challenge to join.",
            suggestions: [
              "How do I apply the top performer patterns?",
              "What challenge should I join?",
              "Summarize the best tips for my gaps",
            ],
          },
          notifications: {
            label: "Notifications",
            hint: "I can help you prioritize your notifications, explain any alert, or take action on coaching assignments.",
            suggestions: [
              "What's most urgent?",
              "Explain this coaching assignment",
              "Mark everything as read",
            ],
          },
          // Manager views
          mgr_dash: {
            label: "Team Dashboard",
            hint: "I can analyze team trends, flag risks, or help you prioritize coaching interventions.",
            suggestions: [
              "Who needs coaching most urgently?",
              "Summarize team health",
              "What's driving the at-risk alerts?",
            ],
          },
          mgr_reps: {
            label: "My Reps",
            hint: "I can analyze any rep's performance, draft coaching notes, or suggest development strategies.",
            suggestions: [
              "Compare Sarah vs Emily's progress",
              "Draft a coaching note for James",
              "Who's ready for advanced certs?",
            ],
          },
          mgr_certs: {
            label: "Cert Management",
            hint: "I can forecast certification timelines, identify blockers, or recommend intervention strategies.",
            suggestions: [
              "When will the full team be certified?",
              "Who's blocking Ozempic® CI completion?",
              "Should I adjust the passing threshold?",
            ],
          },
          mgr_competencies: {
            label: "Team Competencies",
            hint: "I can identify systemic gaps, recommend team training, or compare regions.",
            suggestions: [
              "What's the biggest team-wide gap?",
              "Recommend a team workshop topic",
              "Which reps should peer mentor?",
            ],
          },
          mgr_insights: {
            label: "Predictive Insights",
            hint: "I can explain any prediction, suggest interventions, or model different scenarios.",
            suggestions: [
              "Explain James Morrison's risk prediction",
              "What if Emily increases her Tutor usage?",
              "Forecast Q2 certification rates",
            ],
          },
          mgr_coaching: {
            label: "Coaching Planner",
            hint: "I can refine coaching agendas, suggest talking points, or draft follow-up actions.",
            suggestions: [
              "What should I focus on with Sarah?",
              "Generate a coaching email for James",
              "What data should I bring to my 1:1s?",
            ],
          },
          mgr_reports: {
            label: "Reports",
            hint: "I can help interpret reports, build custom analyses, or prepare executive summaries.",
            suggestions: [
              "Summarize our regional performance",
              "Help me prep for the QBR",
              "What story does the data tell?",
            ],
          },
          // Admin views
          adm_dash: {
            label: "Admin Dashboard",
            hint: "I can analyze system health, usage trends, or flag operational issues.",
            suggestions: [
              "Any system issues to address?",
              "Summarize usage trends",
              "What's driving the engagement increase?",
            ],
          },
          adm_users: {
            label: "User Management",
            hint: "I can help with bulk operations, identify inactive users, or analyze role distributions.",
            suggestions: [
              "Who hasn't logged in this month?",
              "Analyze our role distribution",
              "Draft a re-engagement email",
            ],
          },
          adm_content: {
            label: "Content Management",
            hint: "I can analyze content effectiveness, identify gaps in the library, or suggest new modules to create.",
            suggestions: [
              "Which content has the highest impact?",
              "What content gaps exist?",
              "Suggest a new module topic",
            ],
          },
          adm_certs: {
            label: "Cert Programs",
            hint: "I can analyze program effectiveness, recommend threshold adjustments, or compare programs.",
            suggestions: [
              "Which cert has the lowest pass rate?",
              "Should we adjust any thresholds?",
              "Compare program effectiveness",
            ],
          },
          adm_comp_framework: {
            label: "Competency Framework",
            hint: "I can help configure frameworks, suggest weight adjustments, or review rubric quality.",
            suggestions: [
              "Are the weights balanced correctly?",
              "Suggest rubric improvements",
              "Compare frameworks across roles",
            ],
          },
          adm_echo: {
            label: "Echo Integration",
            hint: "I can check API health, analyze loop performance, or troubleshoot integration issues.",
            suggestions: [
              "Are there any sync issues?",
              "Analyze the remediation loop performance",
              "Review CRM trigger effectiveness",
            ],
          },
          adm_ai: {
            label: "AI Configuration",
            hint: "I can explain model performance, suggest tuning adjustments, or analyze prediction accuracy.",
            suggestions: [
              "How accurate is the readiness model?",
              "Should we retrain any models?",
              "Analyze quiz difficulty distribution",
            ],
          },
          adm_compliance: {
            label: "Compliance & Audit",
            hint: "I can identify compliance risks, generate audit reports, or flag overdue training.",
            suggestions: [
              "Who's overdue on compliance?",
              "Generate an audit summary",
              "What expires this month?",
            ],
          },
          adm_settings: {
            label: "System Settings",
            hint: "I can explain any setting, check integration health, or recommend configuration changes.",
            suggestions: [
              "Are all integrations healthy?",
              "Review our security posture",
              "Suggest notification improvements",
            ],
          },
        };

        const ctx = viewContext[view] || {
          label: "Platform",
          hint: "I'm your AI assistant. Ask me anything about the platform, your learning, or your team.",
          suggestions: [
            "What can you help with?",
            "Give me a summary",
            "Recommend next steps",
          ],
        };

        const handleAiSend = () => {
          if (!aiWidgetInput.trim()) return;
          const msg = aiWidgetInput;
          setAiWidgetInput("");
          setAiWidgetMsgs((p) => [...p, { role: "user", text: msg }]);
          setAiWidgetTyping(true);
          setTimeout(() => {
            setAiWidgetTyping(false);
            setAiWidgetMsgs((p) => [
              ...p,
              {
                role: "ai",
                text: `Based on your current context in **${ctx.label}**, here's what I'd suggest:\n\nI've analyzed the relevant data and can see a few key insights. Would you like me to go deeper on any of these, or would you prefer I take a specific action?\n\n*I'm context-aware — I know you're viewing ${ctx.label} and can help with anything related to this section.*`,
              },
            ]);
          }, 1800);
        };

        const handleSuggestion = (s) => {
          setAiWidgetMsgs((p) => [...p, { role: "user", text: s }]);
          setAiWidgetTyping(true);
          setTimeout(() => {
            setAiWidgetTyping(false);
            const responses = {
              "What should I focus on today?":
                "Based on your current status:\n\n**1.** Complete **Knowledge Check — MOA Differentiation** (Step 3 of your pathway) — this is your immediate next step.\n\n**2.** You have a coaching assignment from David Marchetti: run an HCP Practice simulation on payer objections.\n\n**3.** Your learning streak is at 3 days — one more day gets you closer to the Streak Master milestone.\n\nWant me to launch any of these?",
              "When will I be ready to re-certify?":
                "Based on your current trajectory, the AI Readiness Model predicts you'll reach re-certification readiness by approximately **March 24**.\n\nYour Competitive Positioning score needs to reach ~65 (currently 52). At your current improvement rate of +4pts/week, that's about 10 more days.\n\n**To accelerate:** Complete the payer objection modules and run 2 more AI Tutor HCP simulations. This could move your predicted date to **March 20**.",
              "Why is my Competitive Positioning score low?":
                "Your Competitive Positioning is at **52%**, driven by three sub-competency gaps:\n\n• **MOA Differentiation: 38%** — You struggled to articulate semaglutide vs tirzepatide differences in your Echo session\n• **Formulary & Access Strategy: 48%** — Payer objection handling was weak\n• **Head-to-Head Data Fluency: 55%** — Improving after recent AI Module completion\n\nThe good news: you've already improved from 32 → 52 this quarter. The remediation pathway is targeting these exact gaps.",
              "Who needs coaching most urgently?":
                "**James Morrison** is your highest priority.\n\n• Readiness score: **32%** (lowest on team, declining)\n• Only 2 AI Tutor sessions total\n• Learning streak: 0 days\n• Predicted to fail next Echo with 15% probability\n\n**Recommended action:** Schedule a coaching intervention this week. The data pattern suggests disengagement rather than inability. Consider assigning mandatory AI Tutor sessions (3/week minimum).\n\n**Emily Watson** is secondary priority — readiness 48% and trending down.",
            };
            const resp =
              responses[s] ||
              `Great question about "${s}". Let me analyze the data in your **${ctx.label}** view.\n\nBased on what I can see, here are the key points to consider. I can go deeper on any of these, generate a report, or take action directly.\n\n*Tip: You can ask me to quiz you, draft a coaching note, explain any metric, or navigate to a specific section.*`;
            setAiWidgetMsgs((p) => [...p, { role: "ai", text: resp }]);
          }, 1500);
        };

        return (
          <>
            {/* Floating Button */}
            {!aiWidgetOpen && (
              <div
                onClick={() => setAiWidgetOpen(true)}
                style={{
                  position: "fixed",
                  bottom: 24,
                  right: 24,
                  zIndex: 1000,
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  cursor: "pointer",
                  background: `linear-gradient(135deg,${T.blue},${T.violet})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 32px ${T.blue}35, 0 0 60px ${T.blue}10`,
                  animation: "pulseGlow 3s ease infinite",
                  transition: "transform .2s",
                }}
              >
                <span style={{ fontSize: 24, color: T.white }}>⚡</span>
              </div>
            )}

            {/* Expanded Widget */}
            {aiWidgetOpen && (
              <div
                style={{
                  position: "fixed",
                  bottom: 24,
                  right: 24,
                  zIndex: 1000,
                  width: 380,
                  height: 520,
                  borderRadius: 20,
                  overflow: "hidden",
                  background: T.panel,
                  border: `1px solid ${T.borderLight}`,
                  boxShadow: `0 20px 60px rgba(0,0,0,.5), 0 0 80px ${T.blue}08`,
                  display: "flex",
                  flexDirection: "column",
                  animation: "scaleIn .2s ease",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: `1px solid ${T.border}`,
                    background: `linear-gradient(135deg,${T.card},${T.cardRaised})`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: `linear-gradient(135deg,${T.blue},${T.violet})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: T.white,
                      fontWeight: 700,
                    }}
                  >
                    ⚡
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: T.text }}
                    >
                      AI Tutor Agent
                    </div>
                    <div style={{ fontSize: 10, color: T.textMuted }}>
                      Context: {ctx.label}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAiWidgetOpen(false);
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      border: `1px solid ${T.border}`,
                      background: T.card,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: T.textMuted,
                      fontSize: 14,
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Messages Area */}
                <div
                  style={{
                    flex: 1,
                    overflow: "auto",
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {aiWidgetMsgs.length === 0 ? (
                    <div style={{ animation: "fadeIn .3s ease" }}>
                      <div
                        style={{
                          padding: "14px 16px",
                          borderRadius: 12,
                          background: `linear-gradient(135deg,${T.blue}08,${T.violet}06)`,
                          border: `1px solid ${T.blue}15`,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12.5,
                            color: T.text,
                            lineHeight: 1.6,
                            marginBottom: 2,
                          }}
                        >
                          {ctx.hint}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: T.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          marginBottom: 8,
                        }}
                      >
                        Suggested for this view
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        {ctx.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestion(s)}
                            style={{
                              padding: "10px 14px",
                              borderRadius: 9,
                              textAlign: "left",
                              border: `1px solid ${T.border}`,
                              background: T.card,
                              color: T.text,
                              fontSize: 12,
                              cursor: "pointer",
                              fontFamily: "'Outfit',sans-serif",
                              transition: "all .15s",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span style={{ color: T.blue, fontSize: 11 }}>
                              →
                            </span>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {aiWidgetMsgs.map((m, i) => {
                        const isAI = m.role === "ai";
                        return (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: 8,
                              flexDirection: isAI ? "row" : "row-reverse",
                              animation: "fadeUp .2s ease",
                            }}
                          >
                            {isAI && (
                              <div
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  background: `linear-gradient(135deg,${T.blue},${T.violet})`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 10,
                                  color: T.white,
                                  flexShrink: 0,
                                  marginTop: 2,
                                  fontWeight: 700,
                                }}
                              >
                                ⚡
                              </div>
                            )}
                            <div
                              style={{
                                maxWidth: "85%",
                                padding: "10px 14px",
                                borderRadius: 12,
                                background: isAI ? T.card : `${T.blue}10`,
                                border: `1px solid ${isAI ? T.border : T.blue + "20"}`,
                                fontSize: 12,
                                color: T.text,
                                lineHeight: 1.6,
                              }}
                              dangerouslySetInnerHTML={{
                                __html: m.text
                                  .replace(/\n/g, "<br/>")
                                  .replace(
                                    /\*\*(.*?)\*\*/g,
                                    `<strong style="color:${T.text}">$1</strong>`,
                                  )
                                  .replace(
                                    /\*(.*?)\*/g,
                                    `<em style="color:${T.textMuted}">$1</em>`,
                                  )
                                  .replace(
                                    /•/g,
                                    `<span style="color:${T.blue};margin-right:4px">•</span>`,
                                  ),
                              }}
                            />
                          </div>
                        );
                      })}
                      {aiWidgetTyping && (
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            animation: "fadeIn .2s ease",
                          }}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              background: `linear-gradient(135deg,${T.blue},${T.violet})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              color: T.white,
                              flexShrink: 0,
                              fontWeight: 700,
                            }}
                          >
                            ⚡
                          </div>
                          <div
                            style={{
                              padding: "10px 14px",
                              borderRadius: 12,
                              background: T.card,
                              border: `1px solid ${T.border}`,
                            }}
                          >
                            <div style={{ display: "flex", gap: 4 }}>
                              {[0, 1, 2].map((d) => (
                                <div
                                  key={d}
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: T.blue,
                                    animation: `typing .8s ease ${d * 0.15}s infinite`,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Quick Suggestions (when in conversation) */}
                {aiWidgetMsgs.length > 0 && (
                  <div
                    style={{
                      padding: "6px 16px 0",
                      flexShrink: 0,
                      display: "flex",
                      gap: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    {ctx.suggestions.slice(0, 2).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(s)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          border: `1px solid ${T.border}`,
                          background: T.card,
                          color: T.textMuted,
                          fontSize: 10,
                          cursor: "pointer",
                          fontFamily: "'Outfit',sans-serif",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div
                  style={{
                    padding: "10px 14px",
                    borderTop: `1px solid ${T.border}`,
                    flexShrink: 0,
                    display: "flex",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      background: T.card,
                      borderRadius: 9,
                      border: `1px solid ${T.border}`,
                      padding: "0 12px",
                    }}
                  >
                    <input
                      value={aiWidgetInput}
                      onChange={(e) => setAiWidgetInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
                      placeholder="Ask the AI Tutor anything..."
                      style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        color: T.text,
                        fontSize: 12,
                        padding: "10px 0",
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleAiSend}
                    style={{
                      padding: "0 16px",
                      borderRadius: 9,
                      border: "none",
                      background: T.blue,
                      color: T.white,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Outfit',sans-serif",
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}
