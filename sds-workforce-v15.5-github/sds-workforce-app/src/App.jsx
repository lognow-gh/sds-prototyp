import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Calendar, Users, UserPlus, Clock, Contact, Bell, Search,
  Plus, ChevronRight, CheckCircle2, AlertTriangle, CircleDot, MapPin, Phone,
  Mail, Filter, ArrowRight, ArrowLeft, Settings, Briefcase, GraduationCap,
  Star, TrendingUp, Activity, CalendarDays, ChevronDown, X, Play, Pause,
  Square, MoreHorizontal, GripVertical,
  PanelLeftClose, PanelLeftOpen, Sparkles, Mic, MicOff, Send, Wand2, Bot,
  Sun, Moon, ImageIcon, Monitor, ChevronUp,
} from "lucide-react";

// =====================================================================
// THEME SYSTEM — Light (SDS Design System) + Dark (SDS Dark Mode)
// Auto-switches at 19:00 (Dusk) / 07:00 (Dawn)
// =====================================================================

const LIGHT = {
  navy: "#0B3A6E", navyDark: "#072A4F", navySoft: "#2F5F9B",
  red: "#E30613", redDark: "#A3000C", redSoft: "#FFE5E7",
  amber: "#F59E0B", green: "#22C55E", greenSoft: "#DCFCE7", info: "#3B82F6",
  ink: "#1F2A37", ink2: "#374151", muted: "#6B7280",
  line: "#E0E6ED", bg: "#F5F7FA", card: "#FFFFFF", hover: "#F0F4F8",
  sidebar: "#FFFFFF", topbar: "rgba(255,255,255,0.85)", topbarBorder: "#E0E6ED",
  radius: 8, radiusCard: 12, shadowCard: "0 4px 12px rgba(0,0,0,0.05)",
  pillSuccess: "#DCFCE7", pillSuccessFg: "#15803D",
  pillWarn: "#FEF3C7", pillWarnFg: "#92400E",
  pillInfo: "#DBEAFE", pillInfoFg: "#1E40AF",
  pillNeutral: "#F5F7FA", pillNeutralFg: "#374151",
};

const DARK = {
  // Accent
  navy: "#5B9BD5",
  navyDark: "#2563EB",      // vivid blue for buttons
  navySoft: "#7EB8E8",
  red: "#FC8181",
  redDark: "#F56565",
  redSoft: "rgba(252,129,129,0.20)",
  amber: "#FBBF24",
  green: "#34D399",
  greenSoft: "rgba(52,211,153,0.18)",
  info: "#60A5FA",
  // Text
  ink: "#F1F5F9",
  ink2: "#DCE4EF",          // slightly brighter ink2
  muted: "#B0BDD0",         // boosted — L=72% → ratio 5:1 on card
  // ── Surfaces — MUCH more contrast ──────────────────────────────────
  // bg is very dark, card is clearly lighter, sidebar is between the two
  line: "#334155",           // strong visible borders
  bg: "#080F1A",             // near-black navy page background
  card: "#1A2744",           // card clearly pops — delta vs bg = ~30 lightness
  hover: "#243356",          // hover = clear lift above card
  sidebar: "#0D1626",        // sidebar: between bg and card
  topbar: "rgba(8,15,26,0.96)",
  topbarBorder: "#334155",
  radius: 8, radiusCard: 12,
  shadowCard: "0 2px 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.7)",
  // Pills
  pillSuccess: "rgba(52,211,153,0.20)", pillSuccessFg: "#6EE7B7",
  pillWarn: "rgba(251,191,36,0.20)",    pillWarnFg: "#FCD34D",
  pillInfo: "rgba(96,165,250,0.20)",    pillInfoFg: "#93C5FD",
  pillNeutral: "#243356",               pillNeutralFg: "#CBD5E1",
};

// In dark mode, "label" text (uppercase headers, subtitles) should be
// ink2 level — not muted. Use this helper in components.
// Already handled by token boost above.

const SDS_BG_URL = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80&auto=format&fit=crop";

// =====================================================================
// FOOTER KONFIGURATION — nur hier ändern, nicht im UI sichtbar
// =====================================================================
const FOOTER_CONFIG = {
  logoUrl:       "/SDS_Footer_Logo.png",   // Pfad zum Logo
  logoAlt:       "SDS Baden-Württemberg",
  logoHeight:    64,                        // px
  links: [
    { label: "Impressum",   href: "https://www.sds-bw.de/impressum" },
    { label: "Datenschutz", href: "https://www.sds-bw.de/datenschutz" },
    { label: "Kontakt",     href: "https://www.sds-bw.de/kontakt" },
    { label: "www.sds-bw.de", href: "https://www.sds-bw.de" },
  ],
  copyright:     `© ${new Date().getFullYear()} SDS Baden-Württemberg. Alle Rechte vorbehalten.`,
  showLinks:     true,
  showCopyright: true,
};

function getAutoMode() {
  const h = new Date().getHours();
  return (h >= 19 || h < 7) ? "dark" : "light";
}

function useTheme() {
  const [mode, setModeState] = useState(() => {
    try { return localStorage.getItem("sds-theme") || "auto"; } catch { return "auto"; }
  });
  const [bgEnabled, setBgState] = useState(() => {
    try { return localStorage.getItem("sds-bg") !== "false"; } catch { return false; }
  });
  const [bgUrl, setBgUrlState] = useState(() => {
    try { return localStorage.getItem("sds-bg-url") || SDS_BG_URL; } catch { return SDS_BG_URL; }
  });
  const [autoResolved, setAutoResolved] = useState(getAutoMode);

  useEffect(() => {
    const t = setInterval(() => setAutoResolved(getAutoMode()), 30000);
    return () => clearInterval(t);
  }, []);

  const isDark = mode === "dark" || (mode === "auto" && autoResolved === "dark");
  const T = isDark ? DARK : LIGHT;

  const setMode = useCallback((m) => {
    setModeState(m);
    try { localStorage.setItem("sds-theme", m); } catch {}
  }, []);

  const setBgEnabled = useCallback((v) => {
    setBgState(v);
    try { localStorage.setItem("sds-bg", v ? "true" : "false"); } catch {}
  }, []);

  const setBgUrl = useCallback((url) => {
    setBgUrlState(url);
    try { localStorage.setItem("sds-bg-url", url); } catch {}
  }, []);

  return { T, isDark, mode, setMode, bgEnabled, setBgEnabled, bgUrl, setBgUrl, autoResolved };
}

const ThemeCtx = React.createContext(LIGHT);
const useT = () => React.useContext(ThemeCtx);

// Backwards-compat shim — components written with T.x still work
// because every render gets fresh T from context via useT()
const TOKENS = LIGHT; // static fallback only; real values come from useT()

const PEOPLE = [
  { id: "p1", first: "Lena", last: "Hofmann", role: "Eventleitung", quals: ["Eventleitung","Erste Hilfe","Sachkunde §34a"], status: "Aktiv", avail: "Verfügbar", phone: "+49 711 123 4501", email: "lena.hofmann@sds-bw.de", score: 4.9, since: "2021-03-12", city: "Stuttgart" },
  { id: "p2", first: "Tobias", last: "Krüger", role: "Sicherheitsdienst", quals: ["Sachkunde §34a","Erste Hilfe","Brandschutz"], status: "Aktiv", avail: "Verfügbar", phone: "+49 711 123 4502", email: "tobias.krueger@sds-bw.de", score: 4.7, since: "2019-08-01", city: "Karlsruhe" },
  { id: "p3", first: "Mara", last: "Schwarz", role: "Servicekraft", quals: ["Gastronomie","Erste Hilfe"], status: "Aktiv", avail: "Eingeplant", phone: "+49 711 123 4503", email: "mara.schwarz@sds-bw.de", score: 4.6, since: "2022-01-15", city: "Stuttgart" },
  { id: "p4", first: "David", last: "Weiß", role: "Sicherheitsdienst", quals: ["Sachkunde §34a"], status: "Aktiv", avail: "Verfügbar", phone: "+49 711 123 4504", email: "david.weiss@sds-bw.de", score: 4.4, since: "2023-04-09", city: "Mannheim" },
  { id: "p5", first: "Aylin", last: "Demir", role: "Servicekraft", quals: ["Gastronomie","Barista","Erste Hilfe"], status: "Aktiv", avail: "Verfügbar", phone: "+49 711 123 4505", email: "aylin.demir@sds-bw.de", score: 4.8, since: "2020-11-02", city: "Heidelberg" },
  { id: "p6", first: "Jonas", last: "Berger", role: "Eventleitung", quals: ["Eventleitung","Sachkunde §34a"], status: "Aktiv", avail: "Urlaub", phone: "+49 711 123 4506", email: "jonas.berger@sds-bw.de", score: 4.5, since: "2018-06-20", city: "Stuttgart" },
  { id: "p7", first: "Kira", last: "Lang", role: "Sicherheitsdienst", quals: ["Sachkunde §34a","Brandschutz","Erste Hilfe"], status: "Aktiv", avail: "Verfügbar", phone: "+49 711 123 4507", email: "kira.lang@sds-bw.de", score: 4.7, since: "2022-09-12", city: "Reutlingen" },
  { id: "p8", first: "Marco", last: "Fuchs", role: "Servicekraft", quals: ["Gastronomie"], status: "Inaktiv", avail: "Nicht verfügbar", phone: "+49 711 123 4508", email: "marco.fuchs@sds-bw.de", score: 4.1, since: "2023-08-01", city: "Tübingen" },
];

const EVENTS = [
  { id: "e1", name: "Cannstatter Volksfest — Schicht A", client: "Festwirt Müller GmbH", date: "2026-04-29", start: "16:00", end: "00:00", location: "Wasen, Stuttgart", status: "Vollständig besetzt", required: { "Eventleitung": 1, "Sicherheitsdienst": 4, "Servicekraft": 6 }, assigned: { "Eventleitung": ["p1"], "Sicherheitsdienst": ["p2","p4","p7"], "Servicekraft": ["p3","p5"] } },
  { id: "e2", name: "Mercedes-Benz Arena — Konzert", client: "Live Nation GmbH", date: "2026-05-02", start: "18:00", end: "01:00", location: "Bad Cannstatt, Stuttgart", status: "Offene Positionen", required: { "Eventleitung": 2, "Sicherheitsdienst": 8, "Servicekraft": 4 }, assigned: { "Eventleitung": ["p1"], "Sicherheitsdienst": ["p2","p7"], "Servicekraft": ["p5"] } },
  { id: "e3", name: "Messe Karlsruhe — Aufbau", client: "Messe Karlsruhe GmbH", date: "2026-04-30", start: "06:00", end: "14:00", location: "Messe Karlsruhe", status: "Konflikt", required: { "Eventleitung": 1, "Sicherheitsdienst": 2, "Servicekraft": 0 }, assigned: { "Eventleitung": [], "Sicherheitsdienst": ["p2"], "Servicekraft": [] } },
  { id: "e4", name: "Schlossplatz — Public Viewing", client: "Stadt Stuttgart", date: "2026-05-04", start: "19:00", end: "23:30", location: "Schlossplatz, Stuttgart", status: "In Planung", required: { "Eventleitung": 1, "Sicherheitsdienst": 6, "Servicekraft": 3 }, assigned: { "Eventleitung": [], "Sicherheitsdienst": ["p4"], "Servicekraft": [] } },
];

const APPLICANTS = [
  { id: "a1", first: "Sara", last: "Bauer", role: "Sicherheitsdienst", stage: "Bewerbung", since: "2026-04-22", score: null, city: "Stuttgart" },
  { id: "a2", first: "Mehmet", last: "Yılmaz", role: "Servicekraft", stage: "Bewerbung", since: "2026-04-23", score: null, city: "Karlsruhe" },
  { id: "a3", first: "Pia", last: "Neumann", role: "Eventleitung", stage: "Interview", since: "2026-04-19", score: 4.5, city: "Stuttgart" },
  { id: "a4", first: "Lukas", last: "Schmidt", role: "Sicherheitsdienst", stage: "Interview", since: "2026-04-18", score: 4.0, city: "Mannheim" },
  { id: "a5", first: "Nadine", last: "Klein", role: "Servicekraft", stage: "Angebot", since: "2026-04-16", score: 4.7, city: "Stuttgart" },
  { id: "a6", first: "Felix", last: "Wagner", role: "Sicherheitsdienst", stage: "Angebot", since: "2026-04-15", score: 4.3, city: "Heidelberg" },
  { id: "a7", first: "Elena", last: "Stark", role: "Eventleitung", stage: "Eingestellt", since: "2026-04-10", score: 4.8, city: "Stuttgart" },
];

const CONTACTS = [
  { id: "c1", first: "Anna", last: "Schubert", org: "Festwirt Müller GmbH", function: "Einkauf", type: "Kunde", phone: "+49 711 555 1010", email: "schubert@festwirt-mueller.de" },
  { id: "c2", first: "Markus", last: "Lehmann", org: "Live Nation GmbH", function: "Eventmanagement", type: "Kunde", phone: "+49 30 555 2020", email: "m.lehmann@livenation.de" },
  { id: "c3", first: "Sabine", last: "Roth", org: "Messe Karlsruhe GmbH", function: "Sicherheit", type: "Kunde", phone: "+49 721 555 3030", email: "s.roth@messe-karlsruhe.de" },
  { id: "c4", first: "Petra", last: "Meier", org: "Stadt Stuttgart", function: "Veranstaltungsbüro", type: "Kunde", phone: "+49 711 216 0", email: "meier@stuttgart.de" },
];

const TIMERECORDS = [
  { id: "t1", personId: "p1", event: "Cannstatter Volksfest — Schicht A", date: "2026-04-26", in: "16:02", out: "00:14", status: "Geprüft" },
  { id: "t2", personId: "p2", event: "Cannstatter Volksfest — Schicht A", date: "2026-04-26", in: "15:55", out: "00:08", status: "Geprüft" },
  { id: "t3", personId: "p5", event: "Mercedes-Benz Arena — Konzert", date: "2026-04-25", in: "17:48", out: "01:12", status: "Offen" },
  { id: "t4", personId: "p3", event: "Cannstatter Volksfest — Schicht A", date: "2026-04-26", in: "15:50", out: "00:05", status: "Geprüft" },
  { id: "t5", personId: "p7", event: "Mercedes-Benz Arena — Konzert", date: "2026-04-25", in: "17:55", out: "01:05", status: "Offen" },
];

const STAGES = ["Bewerbung", "Interview", "Angebot", "Eingestellt"];

const personById = (id) => PEOPLE.find(p => p.id === id);
const initials = (p) => (p.first[0] + p.last[0]).toUpperCase();

function StatusPill({ status }) {
  const T = useT();
  const map = {
    "Vollständig besetzt": { bg: T.pillSuccess, fg: T.pillSuccessFg, dot: T.green },
    "Offene Positionen":   { bg: T.pillWarn, fg: T.pillWarnFg, dot: T.amber },
    "Konflikt":            { bg: T.redSoft, fg: T.redDark, dot: T.red },
    "In Planung":          { bg: T.pillInfo, fg: T.pillInfoFg, dot: T.info },
    "Aktiv":               { bg: T.pillSuccess, fg: T.pillSuccessFg, dot: T.green },
    "Inaktiv":             { bg: T.pillNeutral, fg: T.muted, dot: T.muted },
    "Verfügbar":           { bg: T.pillSuccess, fg: T.pillSuccessFg, dot: T.green },
    "Eingeplant":          { bg: T.pillInfo, fg: T.pillInfoFg, dot: T.info },
    "Urlaub":              { bg: T.pillWarn, fg: T.pillWarnFg, dot: T.amber },
    "Nicht verfügbar":     { bg: T.pillNeutral, fg: T.muted, dot: T.muted },
    "Geprüft":             { bg: T.pillSuccess, fg: T.pillSuccessFg, dot: T.green },
    "Offen":               { bg: T.pillWarn, fg: T.pillWarnFg, dot: T.amber },
  };
  const s = map[status] || { bg: T.pillNeutral, fg: T.muted, dot: T.muted };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: s.bg, color: s.fg }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
}

function Avatar({ person, size = 36 }) {
  const T = useT();
  if (!person) return null;
  return (
    <div className="rounded-full flex items-center justify-center font-semibold text-white shrink-0" style={{ width: size, height: size, backgroundColor: T.navyDark, fontSize: size * 0.36 }}>
      {initials(person)}
    </div>
  );
}

function Card({ children, className = "", style = {} }) {
  const T = useT();
  return (
    <div className={className} style={{ borderRadius: T.radiusCard, border: `1px solid ${T.line}`, backgroundColor: T.card, boxShadow: T.shadowCard, transition: "background-color 0.2s, border-color 0.2s", ...style }}>
      {children}
    </div>
  );
}

function Button({ children, variant = "primary", size = "md", icon: Icon, onClick, className = "" }) {
  const T = useT();
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-all";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-base" };
  const variants = {
    primary: { backgroundColor: T.navy, color: "white" },
    danger:  { backgroundColor: T.red, color: "white" },
    ghost:   { backgroundColor: "transparent", color: T.ink2 },
    outline: { backgroundColor: T.card, color: T.ink, border: `1px solid ${T.line}` },
  };
  return (
    <button onClick={onClick} className={`${base} ${sizes[size]} hover:opacity-90 active:scale-[0.98] ${className}`} style={{ borderRadius: T.radius, transitionDuration: "150ms", ...variants[variant] }}>
      {Icon && <Icon size={16} strokeWidth={2.2} />}
      {children}
    </button>
  );
}

function SdsLogo() {
  const T = useT();
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative shrink-0" style={{ width: 36, height: 36 }}>
        <div className="absolute inset-0 rounded-md" style={{ backgroundColor: T.navyDark }} />
        <div className="absolute" style={{ right: 4, bottom: 4, width: 10, height: 10, backgroundColor: T.red }} />
        <div className="absolute inset-0 flex items-center justify-center font-bold text-white" style={{ fontSize: 14, letterSpacing: "0.5px", paddingRight: 4, paddingBottom: 4 }}>SDS</div>
      </div>
      <div className="leading-tight">
        <div className="font-semibold tracking-tight" style={{ color: T.ink, fontSize: 15 }}>SDS Workforce</div>
        <div className="text-[10px] uppercase tracking-[0.12em]" style={{ color: T.muted }}>Baden-Württemberg</div>
      </div>
    </div>
  );
}

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Veranstaltungen", icon: Calendar },
  { id: "staffing", label: "Einsatzplanung", icon: CalendarDays },
  { id: "employees", label: "Mitarbeiter", icon: Users },
  { id: "applicants", label: "Bewerber", icon: UserPlus },
  { id: "time", label: "Zeiterfassung", icon: Clock },
  { id: "contacts", label: "Kontakte", icon: Contact },
];

const ORG_NAV = [
  { id: "org-users",    label: "Benutzer",        icon: Users },
  { id: "org-roles",    label: "Rollen & Zugriff", icon: Settings },
  { id: "org-locations",label: "Standorte",        icon: MapPin },
  { id: "org-settings", label: "Einstellungen",    icon: Activity },
];

function Sidebar({ active, onChange, collapsed, onToggle }) {
  const T = useT();
  const width = collapsed ? 64 : 248;
  const isOrgActive = ORG_NAV.some(i => i.id === active);
  const [orgOpen, setOrgOpen] = useState(isOrgActive);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const flyoutRef = useRef(null);
  const triggerRef = useRef(null);

  React.useEffect(() => { if (collapsed) setOrgOpen(false); }, [collapsed]);
  React.useEffect(() => { if (isOrgActive) setOrgOpen(true); }, [isOrgActive]);

  // Close flyout on outside click
  React.useEffect(() => {
    if (!flyoutOpen) return;
    const handler = (e) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target) &&
          triggerRef.current && !triggerRef.current.contains(e.target)) {
        setFlyoutOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [flyoutOpen]);

  const navBtn = (item) => {
    const Icon = item.icon;
    const isActive = active === item.id;
    return (
      <button key={item.id} onClick={() => onChange(item.id)}
        title={collapsed ? item.label : undefined}
        className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors ${collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"}`}
        style={{ backgroundColor: isActive ? T.navy : "transparent", color: isActive ? "white" : T.ink2 }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = T.hover; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
        <Icon size={18} strokeWidth={2} />
        {!collapsed && <><span>{item.label}</span>{isActive && <ChevronRight size={14} className="ml-auto" />}</>}
      </button>
    );
  };

  return (
    <aside className="flex flex-col h-screen sticky top-0 border-r transition-all" style={{ width, backgroundColor: T.sidebar, borderColor: T.line, transitionDuration: "200ms" }}>

      {/* Logo */}
      <div className={collapsed ? "px-2 pt-5 pb-4 flex justify-center" : "px-5 pt-5 pb-4 flex items-center justify-between"}>
        {collapsed ? (
          <div className="relative" style={{ width: 36, height: 36 }}>
            <div className="absolute inset-0 rounded-md" style={{ backgroundColor: T.navy }} />
            <div className="absolute" style={{ right: 4, bottom: 4, width: 10, height: 10, backgroundColor: T.red }} />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-white" style={{ fontSize: 14, letterSpacing: "0.5px", paddingRight: 4, paddingBottom: 4 }}>SDS</div>
          </div>
        ) : <SdsLogo />}
      </div>

      {/* Collapse toggle */}
      <button onClick={onToggle} className="mx-3 mb-3 p-1.5 rounded-md flex items-center justify-center border" style={{ borderColor: T.line, color: T.muted }} title={collapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}>
        {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      {/* Main nav */}
      <nav className={`flex-1 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`} style={{ paddingBottom: 4 }}>
        <div className="space-y-0.5">
          {NAV.map(item => navBtn(item))}
        </div>
      </nav>

      {/* Organisation — pinned above profile */}
      <div className={collapsed ? "px-2 pb-1 relative" : "px-3 pb-1"}>
        <div style={{ height: "0.5px", backgroundColor: T.line, margin: "6px 0 8px" }} />

        {/* Trigger — accordion (expanded) or flyout-opener (collapsed) */}
        <button
          ref={triggerRef}
          onClick={() => collapsed ? setFlyoutOpen(o => !o) : setOrgOpen(o => !o)}
          className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors ${collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"}`}
          style={{ backgroundColor: isOrgActive || (collapsed && flyoutOpen) ? T.navy : "transparent", color: isOrgActive || (collapsed && flyoutOpen) ? "white" : T.ink2 }}
          onMouseEnter={(e) => { if (!isOrgActive && !(collapsed && flyoutOpen)) e.currentTarget.style.backgroundColor = T.hover; }}
          onMouseLeave={(e) => { if (!isOrgActive && !(collapsed && flyoutOpen)) e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <Briefcase size={18} strokeWidth={2} />
          {!collapsed && (
            <>
              <span>Organisation</span>
              <ChevronDown size={14} className="ml-auto" style={{
                opacity: 0.6,
                transform: orgOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.22s cubic-bezier(.4,0,.2,1)",
              }} />
            </>
          )}
        </button>

        {/* COLLAPSED: Flyout panel */}
        {collapsed && flyoutOpen && (
          <div
            ref={flyoutRef}
            style={{
              position: "fixed",
              left: width + 8,
              bottom: 56,
              width: 200,
              backgroundColor: T.card,
              border: `0.5px solid ${T.line}`,
              borderRadius: 10,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              overflow: "hidden",
              zIndex: 100,
              animation: "flyoutIn 0.15s cubic-bezier(.2,0,.2,1)",
            }}
          >
            <style>{`@keyframes flyoutIn { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }`}</style>
            <div style={{ padding: "8px 12px 6px", fontSize: 10, fontWeight: 600, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Organisation
            </div>
            {ORG_NAV.map(item => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button key={item.id}
                  onClick={() => { onChange(item.id); setFlyoutOpen(false); }}
                  className="w-full flex items-center gap-2.5 text-sm font-medium transition-colors"
                  style={{
                    padding: "8px 14px",
                    backgroundColor: isActive ? T.navy + "14" : "transparent",
                    color: isActive ? T.navy : T.ink2,
                    borderLeft: isActive ? `2px solid ${T.navy}` : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = T.hover; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <Icon size={14} strokeWidth={2} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div style={{ height: 6 }} />
          </div>
        )}

        {/* EXPANDED: Accordion submenu */}
        {!collapsed && (
          <div style={{
            overflow: "hidden",
            maxHeight: orgOpen ? `${ORG_NAV.length * 38}px` : "0px",
            opacity: orgOpen ? 1 : 0,
            transition: "max-height 0.26s cubic-bezier(.4,0,.2,1), opacity 0.18s",
          }}>
            {ORG_NAV.map(item => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button key={item.id} onClick={() => onChange(item.id)}
                  className="w-full flex items-center gap-2.5 text-xs font-medium transition-colors"
                  style={{
                    padding: "6px 12px 6px 38px",
                    borderRadius: 6,
                    backgroundColor: isActive ? (T.navy + "18") : "transparent",
                    color: isActive ? T.navy : T.muted,
                    borderLeft: isActive ? `2px solid ${T.navy}` : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = T.hover; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <Icon size={13} strokeWidth={2} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile */}
      <div className={`border-t py-3 ${collapsed ? "px-2" : "px-3"}`} style={{ borderColor: T.line }}>
        <div className={`flex items-center rounded-lg ${collapsed ? "justify-center p-1" : "gap-3 px-3 py-2"}`}>
          <div className="rounded-full flex items-center justify-center text-white font-semibold shrink-0" style={{ width: 36, height: 36, backgroundColor: T.navySoft, fontSize: 13 }}>DM</div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: T.ink }}>Daniela Maier</div>
                <div className="text-xs truncate" style={{ color: T.muted }}>Disposition</div>
              </div>
              <button className="p-1.5 rounded-md hover:bg-gray-100"><Settings size={16} style={{ color: T.muted }} /></button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

const BG_PRESETS = [
  { label: "SDS Event", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80&auto=format&fit=crop" },
  { label: "Konzert", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80&auto=format&fit=crop" },
  { label: "Sicherheit", url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=1920&q=80&auto=format&fit=crop" },
  { label: "Stuttgart", url: "https://images.unsplash.com/photo-1599982890963-3aabd60064d2?w=1920&q=80&auto=format&fit=crop" },
];

function Toggle({ value, onChange, T }) {
  return (
    <button onClick={() => onChange(!value)}
            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0"
            style={{ backgroundColor: value ? T.navyDark : T.line }}>
      <span className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
            style={{ transform: value ? "translateX(18px)" : "translateX(2px)" }} />
    </button>
  );
}

function ThemePopover({ mode, setMode, bgEnabled, setBgEnabled, bgUrl, setBgUrl, isDark, autoResolved, onClose }) {
  const T = useT();
  const ref = useRef(null);
  const fileRef = useRef(null);
  const [customUrl, setCustomUrl] = useState("");
  const [tab, setTab] = useState("presets"); // presets | url | upload

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setBgUrl(ev.target.result); setBgEnabled(true); };
    reader.readAsDataURL(file);
  }

  function handleCustomUrl() {
    if (customUrl.trim()) { setBgUrl(customUrl.trim()); setBgEnabled(true); setCustomUrl(""); }
  }

  const ModeBtn = ({ value, icon: Icon, label }) => (
    <button onClick={() => setMode(value)}
            className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-xs font-medium"
            style={{
              backgroundColor: mode === value ? T.navyDark : T.hover,
              borderColor: mode === value ? T.navyDark : T.line,
              color: mode === value ? "white" : T.ink2,
            }}>
      <Icon size={15} />{label}
    </button>
  );

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 z-50 rounded-xl border p-4 space-y-4"
         style={{ width: 300, backgroundColor: T.card, borderColor: T.line, boxShadow: T.shadowCard }}>

      {/* Dark / Light / Auto */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: T.muted }}>Darstellung</div>
        <div className="flex gap-2">
          <ModeBtn value="light" icon={Sun} label="Hell" />
          <ModeBtn value="dark" icon={Moon} label="Dunkel" />
          <ModeBtn value="auto" icon={Monitor} label="Auto" />
        </div>
        {mode === "auto" && (
          <div className="mt-1.5 text-xs text-center" style={{ color: T.muted }}>
            Jetzt: <span style={{ color: T.ink, fontWeight: 500 }}>{autoResolved === "dark" ? "Dunkel (19–07 Uhr)" : "Hell (07–19 Uhr)"}</span>
          </div>
        )}
      </div>

      {/* Background section */}
      <div className="border-t pt-3" style={{ borderColor: T.line }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: T.muted }}>Hintergrundbild</div>
          <Toggle value={bgEnabled} onChange={setBgEnabled} T={T} />
        </div>

        {/* Tab bar */}
        <div className="flex rounded-lg overflow-hidden border mb-3" style={{ borderColor: T.line }}>
          {[["presets","Vorlagen"],["url","URL"],["upload","Upload"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)}
                    className="flex-1 text-xs py-1.5 font-medium"
                    style={{
                      backgroundColor: tab === id ? T.navyDark : T.hover,
                      color: tab === id ? "white" : T.ink2,
                    }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Presets grid */}
        {tab === "presets" && (
          <div className="grid grid-cols-2 gap-2">
            {BG_PRESETS.map(p => (
              <button key={p.url} onClick={() => { setBgUrl(p.url); setBgEnabled(true); }}
                      className="relative rounded-lg overflow-hidden border-2 text-left"
                      style={{ borderColor: bgUrl === p.url ? T.navyDark : "transparent", height: 60 }}>
                <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-end p-1.5"
                     style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                  <span className="text-white text-[10px] font-semibold">{p.label}</span>
                </div>
                {bgUrl === p.url && bgEnabled && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: T.green }}>
                    <CheckCircle2 size={10} style={{ color: "white" }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Custom URL */}
        {tab === "url" && (
          <div className="space-y-2">
            <div className="text-xs" style={{ color: T.muted }}>Bild-URL einfügen (https://…)</div>
            <input
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCustomUrl()}
              placeholder="https://sds-bw.de/bild.jpg"
              className="w-full px-3 py-2 rounded-lg text-xs border outline-none"
              style={{ borderColor: T.line, backgroundColor: T.hover, color: T.ink }}
            />
            <button onClick={handleCustomUrl}
                    className="w-full py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: T.navyDark, color: "white" }}>
              Übernehmen
            </button>
            {bgUrl && bgUrl !== SDS_BG_URL && bgEnabled && (
              <div className="rounded-lg overflow-hidden border mt-1" style={{ borderColor: T.line }}>
                <img src={bgUrl} alt="Vorschau" className="w-full h-14 object-cover" onError={e => e.target.style.display="none"} />
              </div>
            )}
          </div>
        )}

        {/* File Upload */}
        {tab === "upload" && (
          <div className="space-y-2">
            <div className="text-xs" style={{ color: T.muted }}>Eigenes Bild von deinem Computer</div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button onClick={() => fileRef.current?.click()}
                    className="w-full py-3 rounded-lg border-2 border-dashed text-xs font-medium flex flex-col items-center gap-1.5"
                    style={{ borderColor: T.line, color: T.ink2, backgroundColor: T.hover }}>
              <ImageIcon size={18} style={{ color: T.muted }} />
              Bild auswählen
              <span style={{ color: T.muted, fontWeight: 400 }}>JPG, PNG, WebP</span>
            </button>
            {bgUrl && bgUrl.startsWith("data:") && (
              <div className="rounded-lg overflow-hidden border" style={{ borderColor: T.line }}>
                <img src={bgUrl} alt="Vorschau" className="w-full h-14 object-cover" />
                <div className="px-2 py-1 text-[10px]" style={{ color: T.muted }}>Eigenes Bild aktiv</div>
              </div>
            )}
          </div>
        )}

        {/* Reset */}
        {bgEnabled && (
          <button onClick={() => { setBgUrl(SDS_BG_URL); }}
                  className="mt-2 w-full text-xs py-1" style={{ color: T.muted }}>
            Zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}

function Topbar({ title, subtitle, action, themeProps }) {
  const T = useT();
  const [open, setOpen] = useState(false);
  const { mode, setMode, bgEnabled, setBgEnabled, bgUrl, setBgUrl, isDark, autoResolved } = themeProps;

  return (
    <div className="px-8 py-5 border-b flex items-center gap-6 sticky top-0 z-10" style={{ borderColor: T.topbarBorder, backgroundColor: T.topbar, backdropFilter: "blur(8px)" }}>
      <div className="flex-1 min-w-0">
        <h1 className="font-semibold tracking-tight truncate" style={{ color: T.ink, fontSize: 22 }}>{title}</h1>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: T.muted }}>{subtitle}</p>}
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
        <input placeholder="Suchen…" className="pl-9 pr-3 py-2 rounded-lg text-sm border outline-none w-56"
               style={{ borderColor: T.line, backgroundColor: T.card, color: T.ink }} />
      </div>
      <button className="relative p-2 rounded-lg border" style={{ borderColor: T.line, backgroundColor: T.card, color: T.ink2 }}>
        <Bell size={16} style={{ color: T.ink2 }} />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: T.red }} />
      </button>
      {/* Theme toggle button */}
      <div className="relative">
        <button onClick={() => setOpen(o => !o)} className="p-2 rounded-lg border flex items-center gap-1.5 text-sm font-medium" style={{ borderColor: T.line, backgroundColor: T.card, color: T.ink2 }}>
          {isDark ? <Moon size={15} /> : <Sun size={15} />}
          <ChevronUp size={12} className={`transition-transform ${open ? "" : "rotate-180"}`} />
        </button>
        {open && <ThemePopover mode={mode} setMode={setMode} bgEnabled={bgEnabled} setBgEnabled={setBgEnabled} bgUrl={bgUrl} setBgUrl={setBgUrl} isDark={isDark} autoResolved={autoResolved} onClose={() => setOpen(false)} />}
      </div>
      {action}
    </div>
  );
}


function KPI({ label, value, delta, icon: Icon, accent }) {
  const T = useT();
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: T.navy }}>{value}</div>
          {delta && (
            <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium" style={{ color: delta.positive ? T.green : T.red }}>
              <TrendingUp size={12} /> {delta.text}
            </div>
          )}
        </div>
        <div className="rounded-lg p-2" style={{ backgroundColor: accent || T.bg }}>
          <Icon size={18} style={{ color: T.navy }} />
        </div>
      </div>
    </Card>
  );
}

function Alert({ tone, title, text }) {
  const T = useT();  const colors = {
    red:   { bg: T.redSoft, fg: T.redDark, icon: AlertTriangle, dot: T.red },
    amber: { bg: T.pillWarn, fg: T.pillWarnFg, icon: AlertTriangle, dot: T.amber },
    navy:  { bg: T.pillInfo, fg: T.pillInfoFg, icon: CircleDot, dot: T.navy },
  }[tone];
  const Icon = colors.icon;
  return (
    <div className="p-3 rounded-lg flex gap-3" style={{ backgroundColor: colors.bg }}>
      <Icon size={16} className="mt-0.5 shrink-0" style={{ color: colors.dot }} />
      <div className="min-w-0">
        <div className="text-sm font-semibold" style={{ color: colors.fg }}>{title}</div>
        <div className="text-xs mt-0.5" style={{ color: colors.fg, opacity: 0.85 }}>{text}</div>
      </div>
    </div>
  );
}

function Dashboard({ goTo }) {
  const T = useT();  const openPositions = EVENTS.reduce((acc, e) => {
    const req = Object.values(e.required).reduce((a,b)=>a+b,0);
    const ass = Object.values(e.assigned).reduce((a,b)=>a+b.length,0);
    return acc + (req - ass);
  }, 0);
  const upcoming = [...EVENTS].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-4 gap-4">
        <KPI label="Veranstaltungen (7 Tage)" value="12" delta={{ positive: true, text: "+3 ggü. Vorwoche" }} icon={Calendar} />
        <KPI label="Offene Positionen" value={openPositions} delta={{ positive: false, text: "Aktion erforderlich" }} icon={AlertTriangle} accent={T.redSoft} />
        <KPI label="Aktive Mitarbeiter" value={PEOPLE.filter(p=>p.status==="Aktiv").length} icon={Users} />
        <KPI label="Bewerber im Prozess" value={APPLICANTS.filter(a=>a.stage!=="Eingestellt").length} icon={UserPlus} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold tracking-tight" style={{ color: T.navy, fontSize: 17 }}>Anstehende Veranstaltungen</h2>
              <p className="text-sm mt-0.5" style={{ color: T.muted }}>Die nächsten Einsätze auf einen Blick</p>
            </div>
            <button onClick={() => goTo("events")} className="text-sm font-medium inline-flex items-center gap-1" style={{ color: T.navy }}>
              Alle anzeigen <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {upcoming.map((e) => {
              const req = Object.values(e.required).reduce((a,b)=>a+b,0);
              const ass = Object.values(e.assigned).reduce((a,b)=>a+b.length,0);
              const pct = req === 0 ? 100 : Math.round((ass/req)*100);
              return (
                <div key={e.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => goTo("staffing")}>
                  <div className="rounded-lg flex flex-col items-center justify-center text-white shrink-0" style={{ width: 52, height: 52, backgroundColor: T.navy }}>
                    <div className="text-[10px] uppercase font-medium opacity-75">{new Date(e.date).toLocaleDateString("de-DE",{ month:"short" })}</div>
                    <div className="text-lg font-semibold leading-none">{new Date(e.date).getDate()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" style={{ color: T.ink }}>{e.name}</div>
                    <div className="text-xs mt-0.5 flex items-center gap-3" style={{ color: T.muted }}>
                      <span className="inline-flex items-center gap-1"><MapPin size={11}/>{e.location}</span>
                      <span>{e.start}–{e.end}</span>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="text-xs font-medium mb-1 flex justify-between" style={{ color: T.ink2 }}>
                      <span>{ass}/{req} besetzt</span><span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.line }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct===100? T.green : pct>=60? T.amber : T.red }} />
                    </div>
                  </div>
                  <StatusPill status={e.status} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold tracking-tight mb-1" style={{ color: T.navy, fontSize: 17 }}>Hinweise</h2>
          <p className="text-sm mb-5" style={{ color: T.muted }}>Was deine Aufmerksamkeit braucht</p>
          <div className="space-y-3">
            <Alert tone="red" title="Konflikt: Tobias Krüger" text="Doppelbuchung am 30.04. (Messe Karlsruhe & Volksfest)." />
            <Alert tone="amber" title="Qualifikation läuft aus" text="3× Erste-Hilfe-Schein in den nächsten 30 Tagen." />
            <Alert tone="amber" title="Offene Zeitnachweise" text="2 Einträge benötigen Freigabe." />
            <Alert tone="navy" title="Neue Bewerbung" text="Sara Bauer – Sicherheitsdienst." />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold tracking-tight" style={{ color: T.navy, fontSize: 17 }}>Aktivität</h2>
            <p className="text-sm mt-0.5" style={{ color: T.muted }}>System-Events der letzten Stunden</p>
          </div>
          <Activity size={18} style={{ color: T.muted }} />
        </div>
        <div className="space-y-3">
          {[
            { icon: CheckCircle2, color: T.green, text: "Aylin Demir dem Public Viewing zugewiesen", time: "vor 8 Min." },
            { icon: UserPlus, color: T.navy, text: "Neue Bewerbung von Sara Bauer eingegangen", time: "vor 42 Min." },
            { icon: Clock, color: T.amber, text: "Schicht von Mara Schwarz endet um 00:05", time: "vor 1 Std." },
            { icon: AlertTriangle, color: T.red, text: "Konflikt erkannt: Tobias Krüger doppelt geplant", time: "vor 2 Std." },
            { icon: Briefcase, color: T.green, text: "Elena Stark als Eventleitung eingestellt", time: "vor 5 Std." },
          ].map((row, i) => {
            const Icon = row.icon;
            return (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="rounded-full p-1.5" style={{ backgroundColor: row.color + "20" }}>
                  <Icon size={14} style={{ color: row.color }} />
                </div>
                <div className="flex-1" style={{ color: T.ink2 }}>{row.text}</div>
                <div style={{ color: T.muted }}>{row.time}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function EventsList({ goTo }) {
  const T = useT();
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Filter} size="sm">Filter</Button>
          <Button variant="outline" size="sm">Diese Woche <ChevronDown size={14} /></Button>
        </div>
        <Button variant="primary" icon={Plus}>Neue Veranstaltung</Button>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: T.line }}>
              {["Veranstaltung","Kunde","Datum & Zeit","Ort","Besetzung","Status",""].map((h)=>(
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((e) => {
              const req = Object.values(e.required).reduce((a,b)=>a+b,0);
              const ass = Object.values(e.assigned).reduce((a,b)=>a+b.length,0);
              return (
                <tr key={e.id} className="border-b hover:bg-gray-50 cursor-pointer" style={{ borderColor: T.line }} onClick={() => goTo("staffing")}>
                  <td className="px-4 py-3.5"><div className="font-medium" style={{ color: T.ink }}>{e.name}</div></td>
                  <td className="px-4 py-3.5" style={{ color: T.ink2 }}>{e.client}</td>
                  <td className="px-4 py-3.5" style={{ color: T.ink2 }}>
                    {new Date(e.date).toLocaleDateString("de-DE",{ day:"2-digit", month:"2-digit", year:"numeric" })}
                    <div className="text-xs" style={{ color: T.muted }}>{e.start}–{e.end}</div>
                  </td>
                  <td className="px-4 py-3.5" style={{ color: T.ink2 }}>{e.location}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: T.ink }}>{ass}/{req}</span>
                      <div className="w-20 h-1.5 rounded-full" style={{ backgroundColor: T.line }}>
                        <div className="h-full rounded-full" style={{ width: `${(ass/req)*100}%`, backgroundColor: ass===req? T.green : ass/req>=0.6? T.amber : T.red }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><StatusPill status={e.status} /></td>
                  <td className="px-4 py-3.5"><ChevronRight size={16} style={{ color: T.muted }} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function StaffingBoard() {
  const T = useT();  const [eventIdx, setEventIdx] = useState(1);
  const event = EVENTS[eventIdx];
  const [assigned, setAssigned] = useState(event.assigned);
  const [pool] = useState(PEOPLE.filter(p => p.status === "Aktiv" && p.avail !== "Urlaub"));
  const [dragging, setDragging] = useState(null);

  React.useEffect(() => { setAssigned(EVENTS[eventIdx].assigned); }, [eventIdx]);

  const assignedIds = useMemo(() => new Set(Object.values(assigned).flat()), [assigned]);
  const visiblePool = pool.filter(p => !assignedIds.has(p.id));

  function handleDrop(role) {
    if (!dragging) return;
    const next = {};
    for (const r of Object.keys(assigned)) next[r] = assigned[r].filter(id => id !== dragging);
    if (!next[role]) next[role] = [];
    if (next[role].length < event.required[role]) next[role] = [...next[role], dragging];
    setAssigned(next);
    setDragging(null);
  }

  function unassign(personId) {
    const next = {};
    for (const r of Object.keys(assigned)) next[r] = assigned[r].filter(id => id !== personId);
    setAssigned(next);
  }

  function qualifiedFor(person, role) {
    const map = { "Eventleitung": ["Eventleitung"], "Sicherheitsdienst": ["Sachkunde §34a"], "Servicekraft": ["Gastronomie"] };
    return (map[role] || []).every(q => person.quals.includes(q));
  }

  return (
    <div className="p-8">
      <Card className="p-5 mb-5">
        <div className="flex items-center gap-4">
          <button onClick={() => setEventIdx((eventIdx - 1 + EVENTS.length) % EVENTS.length)} className="p-2 rounded-lg border" style={{ borderColor: T.line }}>
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>Veranstaltung {eventIdx+1} von {EVENTS.length}</div>
            <div className="font-semibold tracking-tight mt-0.5" style={{ color: T.navy, fontSize: 20 }}>{event.name}</div>
            <div className="flex items-center gap-4 text-sm mt-1" style={{ color: T.muted }}>
              <span className="inline-flex items-center gap-1.5"><CalendarDays size={13}/>{new Date(event.date).toLocaleDateString("de-DE")} · {event.start}–{event.end}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={13}/>{event.location}</span>
              <span className="inline-flex items-center gap-1.5"><Briefcase size={13}/>{event.client}</span>
            </div>
          </div>
          <StatusPill status={event.status} />
          <button onClick={() => setEventIdx((eventIdx + 1) % EVENTS.length)} className="p-2 rounded-lg border" style={{ borderColor: T.line }}>
            <ArrowRight size={16} />
          </button>
        </div>
      </Card>

      <div className="grid gap-5" style={{ gridTemplateColumns: "320px 1fr" }}>
        <Card className="p-5 self-start sticky" style={{ top: 110 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold tracking-tight" style={{ color: T.navy, fontSize: 15 }}>Mitarbeiter</h3>
              <p className="text-xs mt-0.5" style={{ color: T.muted }}>{visiblePool.length} verfügbar · per Drag & Drop</p>
            </div>
            <Filter size={14} style={{ color: T.muted }} />
          </div>
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {(() => {
              const renderPerson = (p) => (
                <div key={p.id} draggable onDragStart={() => setDragging(p.id)} onDragEnd={() => setDragging(null)}
                  className="flex items-center gap-3 p-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all"
                  style={{ borderColor: T.line, backgroundColor: dragging === p.id ? T.hover : T.card }}>
                  <GripVertical size={14} style={{ color: T.muted }} />
                  <Avatar person={p} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: T.ink }}>{p.first} {p.last}</div>
                    <div className="text-xs truncate" style={{ color: T.muted }}>{p.role}</div>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs font-medium" style={{ color: T.amber }}>
                    <Star size={11} fill={T.amber} strokeWidth={0} />{p.score}
                  </div>
                </div>
              );

              const availOrder = ["Verfügbar", "Eingeplant"];
              const roleOrder  = ["Eventleitung", "Sicherheitsdienst", "Servicekraft"];

              // Group: Verfügbarkeit → Rolle
              const groups = {};
              for (const avail of availOrder) {
                for (const role of roleOrder) {
                  const members = visiblePool.filter(p => p.avail === avail && p.role === role);
                  if (members.length > 0) {
                    const key = `${avail}__${role}`;
                    groups[key] = { avail, role, members };
                  }
                }
              }

              const availLabels = {
                "Verfügbar":  "Verfügbar",
                "Eingeplant": "Umplanbar",
              };
              const availColors = {
                "Verfügbar":  { bg: T.greenSoft,   fg: "#15803D" },
                "Eingeplant": { bg: T.pillWarn,     fg: T.pillWarnFg },
              };

              return Object.values(groups).map(({ avail, role, members }, i) => {
                const col = availColors[avail] || { bg: T.hover, fg: T.muted };
                return (
                  <div key={`${avail}-${role}`} style={{ marginTop: i > 0 ? 4 : 0 }}>
                    <div className="flex items-center gap-2 px-2 py-1 rounded-md mb-1.5"
                      style={{ backgroundColor: col.bg }}>
                      <span className="text-xs font-semibold" style={{ color: col.fg }}>{availLabels[avail] || avail}</span>
                      <span className="text-xs" style={{ color: col.fg, opacity: 0.5 }}>·</span>
                      <span className="text-xs font-semibold" style={{ color: col.fg }}>{role}</span>
                      <span className="ml-auto text-xs font-semibold" style={{ color: col.fg }}>{members.length}</span>
                    </div>
                    {members.map(renderPerson)}
                  </div>
                );
              });
            })()}
          </div>
        </Card>

        <div className="space-y-4">
          {Object.entries(event.required).map(([role, count]) => {
            if (count === 0) return null;
            const filled = (assigned[role] || []).length;
            const isComplete = filled === count;
            const allQualified = isComplete && (assigned[role] || []).every(id => qualifiedFor(personById(id), role));
            const hasQualWarning = isComplete && !allQualified;
            const borderColor = hasQualWarning ? T.amber : isComplete ? T.green : filled === 0 ? T.red : T.redDark;
            const pillBg    = hasQualWarning ? T.pillWarn    : isComplete ? T.greenSoft  : T.redSoft;
            const pillFg    = hasQualWarning ? T.pillWarnFg  : isComplete ? "#15803D"    : T.redDark;
            return (
              <Card key={role} className="p-5" style={{ borderLeftWidth: 3, borderLeftColor: borderColor }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold tracking-tight" style={{ color: T.navy, fontSize: 16 }}>{role}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: pillBg, color: pillFg }}>
                        {filled}/{count} besetzt{hasQualWarning ? " · Qualifikation fehlt" : ""}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: T.muted }}>
                      Mindestqualifikation: {role==="Sicherheitsdienst"?"Sachkunde §34a": role==="Eventleitung"?"Eventleitung-Schein":"Gastronomie-Erfahrung"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" icon={Plus}>Position öffnen</Button>
                </div>
                <div onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(role)} className="grid gap-2 min-h-[88px] p-2 rounded-lg transition-colors" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", backgroundColor: dragging ? T.hover : T.bg, border: `1px dashed ${dragging ? T.navy : T.line}` }}>
                  {(assigned[role] || []).map(id => {
                    const person = personById(id);
                    const qok = qualifiedFor(person, role);
                    return (
                      <div key={id} className="flex items-center gap-3 p-2.5 rounded-lg border group" style={{ backgroundColor: T.card, borderColor: T.line }}>
                        <Avatar person={person} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: T.ink }}>{person.first} {person.last}</div>
                          <div className="text-xs flex items-center gap-1" style={{ color: qok ? T.green : T.red }}>
                            {qok ? <CheckCircle2 size={10}/> : <AlertTriangle size={10}/>}
                            {qok ? "Qualifikation OK" : "Qualifikation fehlt"}
                          </div>
                        </div>
                        <button onClick={() => unassign(id)} className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
                          <X size={14} style={{ color: T.muted }} />
                        </button>
                      </div>
                    );
                  })}
                  {Array.from({ length: count - filled }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center p-3 rounded-lg border-2 border-dashed text-xs font-medium" style={{ borderColor: T.line, color: T.muted }}>
                      Offene Position
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Employees() {
  const T = useT();  const [selected, setSelected] = useState(PEOPLE[0]);
  return (
    <div className="p-8">
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 380px" }}>
        <Card>
          <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: T.line }}>
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
              <input placeholder="Mitarbeiter suchen…" className="pl-9 pr-3 py-2 rounded-lg text-sm border outline-none w-full" style={{ borderColor: T.line }} />
            </div>
            <Button variant="outline" size="sm" icon={Filter}>Filter</Button>
            <div className="flex-1" />
            <Button variant="primary" size="sm" icon={Plus}>Neuer Mitarbeiter</Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: T.line }}>
                {["Name","Rolle","Verfügbarkeit","Bewertung","Stadt"].map(h=>(
                  <th key={h} className="text-left px-4 py-2.5 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PEOPLE.map(p => (
                <tr key={p.id} onClick={() => setSelected(p)} className="border-b cursor-pointer" style={{ borderColor: T.line, backgroundColor: selected.id === p.id ? T.hover : "transparent" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar person={p} size={32} />
                      <div>
                        <div className="font-medium" style={{ color: T.ink }}>{p.first} {p.last}</div>
                        <div className="text-xs" style={{ color: T.muted }}>{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: T.ink2 }}>{p.role}</td>
                  <td className="px-4 py-3"><StatusPill status={p.avail} /></td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: T.ink }}>
                      <Star size={12} fill={T.amber} strokeWidth={0} />
                      {p.score}
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: T.ink2 }}>{p.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="self-start sticky overflow-hidden" style={{ top: 110 }}>
          <div className="p-6 text-white relative overflow-hidden" style={{ backgroundColor: T.navy }}>
            <Avatar person={selected} size={56} />
            <div className="mt-3 text-xl font-semibold tracking-tight">{selected.first} {selected.last}</div>
            <div className="text-sm opacity-80 mt-0.5">{selected.role} · seit {new Date(selected.since).getFullYear()}</div>
            <div className="flex items-center gap-3 mt-3 text-xs opacity-90">
              <span className="inline-flex items-center gap-1.5"><Phone size={11}/>{selected.phone}</span>
              <span className="inline-flex items-center gap-1.5"><Mail size={11}/>{selected.email.split("@")[0]}</span>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: T.muted }}>Status</div>
              <div className="flex flex-wrap gap-2"><StatusPill status={selected.status} /><StatusPill status={selected.avail} /></div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: T.muted }}>Qualifikationen</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.quals.map(q => (
                  <span key={q} className="text-xs px-2.5 py-1 rounded-md font-medium border inline-flex items-center gap-1.5" style={{ borderColor: T.line, color: T.ink2 }}>
                    <GraduationCap size={11} /> {q}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: T.muted }}>Bewertung</div>
              <div className="flex items-center gap-2">
                <div className="flex">{[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} fill={i <= Math.round(selected.score) ? T.amber : "transparent"} strokeWidth={1.5} style={{ color: T.amber }} />
                ))}</div>
                <span className="text-sm font-semibold" style={{ color: T.ink }}>{selected.score}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="primary" size="sm" className="flex-1">Profil bearbeiten</Button>
              <Button variant="outline" size="sm" icon={Calendar}>Einplanen</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Applicants() {
  const T = useT();  const [items, setItems] = useState(APPLICANTS);
  const [dragId, setDragId] = useState(null);
  const stageColor = { "Bewerbung": T.navy, "Interview": T.info, "Angebot": T.amber, "Eingestellt": T.green };
  function moveTo(stage) {
    if (!dragId) return;
    setItems(items.map(a => a.id === dragId ? { ...a, stage } : a));
    setDragId(null);
  }
  return (
    <div className="p-8">
      <div className="flex items-center justify-end mb-5 gap-2">
        <Button variant="outline" icon={Filter} size="sm">Filter</Button>
        <Button variant="primary" icon={Plus}>Neue Bewerbung</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {STAGES.map(stage => {
          const list = items.filter(a => a.stage === stage);
          return (
            <div key={stage} onDragOver={(e) => e.preventDefault()} onDrop={() => moveTo(stage)}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stageColor[stage] }} />
                  <span className="text-sm font-semibold" style={{ color: T.navy }}>{stage}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: T.bg, color: T.muted }}>{list.length}</span>
                </div>
                <button className="p-1 rounded hover:bg-gray-100"><Plus size={14} style={{ color: T.muted }}/></button>
              </div>
              <div className="space-y-2 min-h-[400px] p-2 rounded-lg" style={{ backgroundColor: dragId ? T.hover : T.bg, border: `1px dashed ${T.line}` }}>
                {list.map(a => (
                  <Card key={a.id} draggable onDragStart={() => setDragId(a.id)} onDragEnd={() => setDragId(null)} className="p-3 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md" style={{ opacity: dragId === a.id ? 0.5 : 1 }}>
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-full flex items-center justify-center font-semibold text-white shrink-0" style={{ width: 32, height: 32, backgroundColor: stageColor[stage], fontSize: 12 }}>
                        {(a.first[0]+a.last[0]).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: T.ink }}>{a.first} {a.last}</div>
                        <div className="text-xs truncate" style={{ color: T.muted }}>{a.role}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: T.line }}>
                      <span style={{ color: T.muted }}>seit {new Date(a.since).toLocaleDateString("de-DE",{ day:"2-digit", month:"2-digit" })}</span>
                      {a.score && (
                        <span className="inline-flex items-center gap-0.5 font-medium" style={{ color: T.amber }}>
                          <Star size={11} fill={T.amber} strokeWidth={0} />{a.score}
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeTracking() {
  const T = useT();  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(2 * 3600 + 14 * 60 + 32);
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  const fmt = (s) => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };
  return (
    <div className="p-8">
      <div className="grid gap-5" style={{ gridTemplateColumns: "360px 1fr" }}>
        <div>
          <Card className="overflow-hidden">
            <div className="p-5 text-white relative" style={{ backgroundColor: T.navy }}>
              <div className="text-xs uppercase tracking-wider opacity-75 mb-1">Aktive Schicht</div>
              <div className="font-semibold tracking-tight" style={{ fontSize: 17 }}>Cannstatter Volksfest</div>
              <div className="text-xs opacity-80 mt-0.5">Schicht A · 16:00–00:00</div>
            </div>
            <div className="p-8 text-center">
              <div className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: T.muted }}>Erfasste Zeit</div>
              <div className="font-bold tracking-tight tabular-nums" style={{ color: T.navy, fontSize: 44 }}>{fmt(seconds)}</div>
              <div className="text-xs mt-1" style={{ color: T.muted }}>Eingestempelt: 16:02</div>
              <div className="mt-6 flex items-center justify-center gap-3">
                {!running ? (
                  <button onClick={() => setRunning(true)} className="rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105" style={{ width: 72, height: 72, backgroundColor: T.green }}>
                    <Play size={28} fill="white" strokeWidth={0} />
                  </button>
                ) : (
                  <button onClick={() => setRunning(false)} className="rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105" style={{ width: 72, height: 72, backgroundColor: T.amber }}>
                    <Pause size={28} fill="white" strokeWidth={0} />
                  </button>
                )}
                <button className="rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105" style={{ width: 72, height: 72, backgroundColor: T.red }}>
                  <Square size={24} fill="white" strokeWidth={0} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-6 text-[11px] uppercase tracking-wider font-medium" style={{ color: T.muted }}>
                <span>Pause</span><span>Ausstempeln</span>
              </div>
            </div>
          </Card>
          <Card className="mt-4 p-4">
            <div className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: T.muted }}>Heute</div>
            <div className="flex items-baseline gap-1">
              <div className="text-2xl font-semibold" style={{ color: T.navy }}>06:48</div>
              <div className="text-sm" style={{ color: T.muted }}>von 8 Stunden</div>
            </div>
            <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: T.line }}>
              <div className="h-full rounded-full" style={{ width: "85%", backgroundColor: T.green }} />
            </div>
          </Card>
        </div>
        <Card>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: T.line }}>
            <div>
              <h3 className="font-semibold tracking-tight" style={{ color: T.navy, fontSize: 16 }}>Zeitnachweise</h3>
              <p className="text-xs mt-0.5" style={{ color: T.muted }}>Letzte Erfassungen</p>
            </div>
            <Button variant="outline" size="sm" icon={CheckCircle2}>Alle freigeben</Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: T.line }}>
                {["Mitarbeiter","Veranstaltung","Datum","Ein","Aus","Dauer","Status"].map(h=>(
                  <th key={h} className="text-left px-4 py-2.5 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMERECORDS.map(t => {
                const p = personById(t.personId);
                const [ih, im] = t.in.split(":").map(Number);
                const [oh, om] = t.out.split(":").map(Number);
                let mins = (oh*60+om) - (ih*60+im);
                if (mins < 0) mins += 24*60;
                const h = Math.floor(mins/60), m = mins%60;
                return (
                  <tr key={t.id} className="border-b" style={{ borderColor: T.line }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar person={p} size={28} />
                        <span className="font-medium" style={{ color: T.ink }}>{p.first} {p.last}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: T.ink2 }}>{t.event}</td>
                    <td className="px-4 py-3" style={{ color: T.ink2 }}>{new Date(t.date).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})}</td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: T.ink2 }}>{t.in}</td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: T.ink2 }}>{t.out}</td>
                    <td className="px-4 py-3 tabular-nums font-medium" style={{ color: T.ink }}>{h}h {String(m).padStart(2,"0")}m</td>
                    <td className="px-4 py-3"><StatusPill status={t.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function Contacts() {
  const T = useT();
  return (
    <div className="p-8">
      <div className="flex items-center justify-end mb-5 gap-2">
        <Button variant="outline" icon={Filter} size="sm">Filter</Button>
        <Button variant="primary" icon={Plus}>Neuer Kontakt</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {CONTACTS.map(c => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-lg flex items-center justify-center font-semibold shrink-0" style={{ width: 48, height: 48, backgroundColor: T.bg, color: T.navy, fontSize: 16 }}>
                {(c.first[0]+c.last[0]).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold" style={{ color: T.ink, fontSize: 15 }}>{c.first} {c.last}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: T.hover, color: T.ink2, border: `1px solid ${T.line}` }}>{c.type}</span>
                </div>
                <div className="text-sm mt-0.5" style={{ color: T.muted }}>{c.function} · {c.org}</div>
                <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: T.ink2 }}>
                  <span className="inline-flex items-center gap-1.5"><Phone size={12} style={{ color: T.muted }}/>{c.phone}</span>
                  <span className="inline-flex items-center gap-1.5"><Mail size={12} style={{ color: T.muted }}/>{c.email}</span>
                </div>
              </div>
              <button className="p-1.5 rounded hover:bg-gray-100">
                <MoreHorizontal size={16} style={{ color: T.muted }} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// AI ASSISTANT — chat panel with voice input and intent parsing
// ---------------------------------------------------------------------
// In production, parseIntent() would call your LLM (e.g. Claude API)
// and return structured form-fill suggestions. For the prototype we
// use a regex-based mock NLU so the UX is tangible without a backend.
// =====================================================================

function parseIntent(text) {  const t = text.toLowerCase();

  // Intent: time tracking entry
  // e.g. "Lukas Schmidt hat heute von 8 bis 14 Uhr auf der Messe Karlsruhe gearbeitet"
  if (/(gearbeitet|geschuftet|stund|schicht|von \d+.*bis \d+|zeit erfass)/.test(t)) {
    const person = PEOPLE.find(p => t.includes(p.first.toLowerCase()) || t.includes(p.last.toLowerCase()));
    const eventMatch = EVENTS.find(e => t.includes(e.location.toLowerCase().split(",")[0]) || t.includes(e.name.toLowerCase().split("—")[0].trim().toLowerCase()));
    const timeRange = t.match(/(?:von\s+)?(\d{1,2})(?::(\d{2}))?\s*(?:uhr\s*)?bis\s+(\d{1,2})(?::(\d{2}))?/);
    if (person) {
      const startH = timeRange ? parseInt(timeRange[1]) : 8;
      const startM = timeRange && timeRange[2] ? timeRange[2] : "00";
      const endH = timeRange ? parseInt(timeRange[3]) : 16;
      const endM = timeRange && timeRange[4] ? timeRange[4] : "00";
      return {
        intent: "time_record",
        target: "time",
        confidence: 0.92,
        fields: {
          "Mitarbeiter": `${person.first} ${person.last}`,
          "Veranstaltung": eventMatch ? eventMatch.name : "— bitte wählen —",
          "Datum": t.includes("gestern")
            ? new Date(Date.now()-86400000).toLocaleDateString("de-DE")
            : new Date().toLocaleDateString("de-DE"),
          "Eingestempelt": `${String(startH).padStart(2,"0")}:${startM}`,
          "Ausgestempelt": `${String(endH).padStart(2,"0")}:${endM}`,
        },
      };
    }
  }

  // Intent: assign employee to event
  // e.g. "Weise Tobias dem Schlossplatz Public Viewing zu"
  if (/(weise|zuweisen|einplanen|einteilen|einsetzen)/.test(t)) {
    const person = PEOPLE.find(p => t.includes(p.first.toLowerCase()) || t.includes(p.last.toLowerCase()));
    const eventMatch = EVENTS.find(e => t.includes(e.location.toLowerCase().split(",")[0]) || t.includes(e.name.toLowerCase().split("—")[0].trim().toLowerCase()));
    if (person) {
      return {
        intent: "assign",
        target: "staffing",
        confidence: 0.88,
        fields: {
          "Mitarbeiter": `${person.first} ${person.last}`,
          "Rolle": person.role,
          "Veranstaltung": eventMatch ? eventMatch.name : "— bitte wählen —",
          "Qualifikation": person.quals.join(", "),
        },
      };
    }
  }

  // Intent: new applicant
  // e.g. "Neue Bewerbung von Max Mustermann als Servicekraft aus Stuttgart"
  if (/(bewerbung|bewerber|kandidat)/.test(t)) {
    const nameMatch = text.match(/(?:von|für)\s+([A-ZÄÖÜ][a-zäöüß]+)\s+([A-ZÄÖÜ][a-zäöüß]+)/);
    const role = /sicherheit/.test(t) ? "Sicherheitsdienst" : /event/.test(t) ? "Eventleitung" : /service|gastro/.test(t) ? "Servicekraft" : "—";
    const cityMatch = text.match(/aus\s+([A-ZÄÖÜ][a-zäöüß]+)/);
    return {
      intent: "applicant",
      target: "applicants",
      confidence: 0.85,
      fields: {
        "Vorname": nameMatch ? nameMatch[1] : "—",
        "Nachname": nameMatch ? nameMatch[2] : "—",
        "Position": role,
        "Stadt": cityMatch ? cityMatch[1] : "—",
        "Status": "Bewerbung",
      },
    };
  }

  // Intent: new event
  // e.g. "Neues Event am 15.05. im Schlossgarten, 4 Sicherheit, 2 Service"
  if (/(neue veranstaltung|neues event|event anlegen|veranstaltung anlegen)/.test(t)) {
    const dateMatch = text.match(/(\d{1,2})\.(\d{1,2})\.?/);
    const sec = text.match(/(\d+)\s*sicher/i);
    const svc = text.match(/(\d+)\s*service/i);
    return {
      intent: "event",
      target: "events",
      confidence: 0.80,
      fields: {
        "Bezeichnung": "— bitte ergänzen —",
        "Datum": dateMatch ? `${dateMatch[1].padStart(2,"0")}.${dateMatch[2].padStart(2,"0")}.2026` : "—",
        "Sicherheitsdienst": sec ? sec[1] : "—",
        "Servicekraft": svc ? svc[1] : "—",
      },
    };
  }

  return {
    intent: "unknown",
    confidence: 0,
    answer: 'Das habe ich noch nicht verstanden. Versuch es z.B. so: "Lukas hat heute von 8 bis 14 Uhr auf der Messe gearbeitet" oder "Weise Tobias dem Public Viewing zu".', 
  };
}

const SAMPLE_PROMPTS = [
  "Lukas hat heute von 8 bis 14 Uhr auf der Messe gearbeitet",
  "Weise Tobias dem Public Viewing zu",
  "Neue Bewerbung von Anna Krause als Servicekraft aus Tübingen",
  "Wer ist morgen in Stuttgart verfügbar?",
];

function FormFillPreview({ result, onConfirm, onDiscard }) {
  const T = useT();  if (result.intent === "unknown") {
    return <div className="text-sm" style={{ color: T.ink2 }}>{result.answer}</div>;
  }
  const labels = {
    time_record: "Zeitnachweis erfassen",
    assign: "Zuweisung vorschlagen",
    applicant: "Bewerbung anlegen",
    event: "Veranstaltung anlegen",
  };
  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: T.line, backgroundColor: T.card }}>
      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: T.line, backgroundColor: T.bg }}>
        <Wand2 size={13} style={{ color: T.navy }} />
        <span className="text-xs font-semibold" style={{ color: T.navy }}>{labels[result.intent]}</span>
        <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: T.greenSoft, color: "#15803D" }}>
          {Math.round(result.confidence * 100)}% sicher
        </span>
      </div>
      <div className="p-3 space-y-1.5">
        {Object.entries(result.fields).map(([key, val]) => (
          <div key={key} className="flex items-baseline gap-2 text-xs">
            <span className="font-medium shrink-0" style={{ color: T.muted, minWidth: 100 }}>{key}</span>
            <span className="font-medium" style={{ color: val.startsWith("—") ? T.amber : T.ink }}>{val}</span>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t flex gap-2" style={{ borderColor: T.line }}>
        <button onClick={onConfirm} className="flex-1 text-xs font-medium py-1.5 rounded" style={{ backgroundColor: T.navy, color: "white" }}>
          Übernehmen
        </button>
        <button onClick={onDiscard} className="text-xs font-medium py-1.5 px-3 rounded border" style={{ borderColor: T.line, color: T.ink2 }}>
          Verwerfen
        </button>
      </div>
    </div>
  );
}

function AIAssistant({ open, onClose, onNavigate }) {
  const T = useT();  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hallo Daniela. Ich kann Daten erfassen, Zuweisungen vorschlagen oder Fragen zu Einsätzen beantworten. Sag mir einfach was du brauchst — gern auch per Sprache." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [confirmedAt, setConfirmedAt] = useState(null);
  const recognitionRef = React.useRef(null);
  const scrollRef = React.useRef(null);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Web Speech API setup
  React.useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "de-DE";
    r.continuous = false;
    r.interimResults = true;
    r.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        setListening(false);
      }
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recognitionRef.current = r;
  }, []);

  const speechSupported = !!(typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition));

  function toggleMic() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setInput("");
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch { setListening(false); }
    }
  }

  function send(text) {
    const t = (text ?? input).trim();
    if (!t) return;
    const userMsg = { role: "user", text: t };
    const result = parseIntent(t);
    const aiMsg = { role: "assistant", result, text: result.intent === "unknown" ? result.answer : "" };
    setMessages([...messages, userMsg, aiMsg]);
    setInput("");
  }

  function handleConfirm(idx, target) {
    setMessages(msgs => msgs.map((m, i) => i === idx ? { ...m, confirmed: true } : m));
    setConfirmedAt(idx);
    setTimeout(() => {
      onNavigate(target);
      setConfirmedAt(null);
    }, 800);
  }

  function handleDiscard(idx) {
    setMessages(msgs => msgs.map((m, i) => i === idx ? { ...m, discarded: true } : m));
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col" style={{ width: 380, maxHeight: "calc(100vh - 48px)", borderRadius: T.radiusCard, backgroundColor: T.card, border: `1px solid ${T.line}`, boxShadow: "0 20px 50px rgba(0,0,0,0.18)" }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: T.line, backgroundColor: T.navy, borderTopLeftRadius: T.radiusCard, borderTopRightRadius: T.radiusCard }}>
        <div className="rounded-lg p-1.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
          <Sparkles size={16} style={{ color: "white" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">SDS Assistent</div>
          <div className="text-[11px] text-white opacity-75">Sprachsteuerung & intelligente Erfassung</div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
          <X size={16} style={{ color: "white" }} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: T.hover }}>
        {messages.map((m, idx) => {
          if (m.role === "user") {
            return (
              <div key={idx} className="flex justify-end">
                <div className="max-w-[85%] px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: T.navy, color: "white", borderRadius: "12px 12px 2px 12px" }}>
                  {m.text}
                </div>
              </div>
            );
          }
          return (
            <div key={idx} className="flex gap-2">
              <div className="rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ width: 24, height: 24, backgroundColor: T.navy }}>
                <Bot size={13} style={{ color: "white" }} />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                {m.text && (
                  <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: T.card, color: T.ink, border: `1px solid ${T.line}`, borderRadius: "12px 12px 12px 2px" }}>
                    {m.text}
                  </div>
                )}
                {m.result && m.result.intent !== "unknown" && !m.discarded && (
                  m.confirmed ? (
                    <div className="rounded-lg border p-3 flex items-center gap-2 text-xs font-medium" style={{ borderColor: T.green, backgroundColor: T.greenSoft, color: "#15803D" }}>
                      <CheckCircle2 size={14} />
                      {confirmedAt === idx ? "Wird übernommen…" : "Übernommen"}
                    </div>
                  ) : (
                    <FormFillPreview
                      result={m.result}
                      onConfirm={() => handleConfirm(idx, m.result.target)}
                      onDiscard={() => handleDiscard(idx)}
                    />
                  )
                )}
                {m.discarded && (
                  <div className="text-xs italic" style={{ color: T.muted }}>Vorschlag verworfen</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Sample prompts when only the greeting is shown */}
        {messages.length === 1 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] uppercase tracking-wider font-medium" style={{ color: T.muted }}>
              Beispiele zum Ausprobieren
            </div>
            {SAMPLE_PROMPTS.map(p => (
              <button key={p} onClick={() => send(p)} className="w-full text-left text-xs px-3 py-2 rounded-lg border hover:shadow-sm transition-all" style={{ borderColor: T.line, color: T.ink2, backgroundColor: T.card }}>
                "{p}"
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Listening indicator */}
      {listening && (
        <div className="px-4 py-2 border-t flex items-center gap-2 text-xs font-medium" style={{ borderColor: T.line, backgroundColor: T.redSoft, color: T.redDark }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: T.red }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: T.red }} />
          </span>
          Höre zu…
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: T.line }}>
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Frage stellen oder Daten diktieren…"
            rows={1}
            className="flex-1 resize-none px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: T.line, color: T.ink, maxHeight: 100 }}
          />
          <button
            onClick={toggleMic}
            disabled={!speechSupported}
            title={!speechSupported ? "Spracheingabe vom Browser nicht unterstützt" : listening ? "Aufnahme stoppen" : "Spracheingabe starten"}
            className="p-2.5 rounded-lg transition-all"
            style={{
              backgroundColor: listening ? T.red : speechSupported ? T.card : T.bg,
              border: `1px solid ${listening ? T.red : T.line}`,
              color: listening ? "white" : speechSupported ? T.ink2 : T.muted,
              cursor: speechSupported ? "pointer" : "not-allowed",
            }}>
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button onClick={() => send()} disabled={!input.trim()} className="p-2.5 rounded-lg" style={{ backgroundColor: input.trim() ? T.navy : T.bg, color: input.trim() ? "white" : T.muted, cursor: input.trim() ? "pointer" : "not-allowed" }}>
            <Send size={16} />
          </button>
        </div>
        {!speechSupported && (
          <div className="text-[10px] mt-1.5" style={{ color: T.muted }}>
            Tipp: Chrome / Edge / Safari unterstützen Spracheingabe nativ.
          </div>
        )}
      </div>
    </div>
  );
}

function AIFloatingButton({ onClick, hasUnread }) {
  const T = useT();
  return (
    <button onClick={onClick} className="fixed bottom-6 right-6 z-40 rounded-full flex items-center justify-center text-white transition-all hover:scale-105" style={{ width: 56, height: 56, backgroundColor: T.navy, boxShadow: "0 12px 30px rgba(11,58,110,0.35)" }} title="SDS Assistent öffnen">
      <Sparkles size={22} />
      {hasUnread && (
        <span className="absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: T.red }} />
      )}
    </button>
  );
}


// =====================================================================
// FOOTER KOMPONENTE — liest aus FOOTER_CONFIG, passt sich dem Theme an
// =====================================================================
function AppFooter() {
  const T = useT();
  const cfg = FOOTER_CONFIG;
  return (
    <footer style={{
      borderTop: `1.5px solid ${T.navy}`,
      backgroundColor: T.card,
      padding: "12px 24px 10px",
      transition: "background-color 0.3s, border-color 0.2s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <img
          src={cfg.logoUrl}
          alt={cfg.logoAlt}
          style={{ height: cfg.logoHeight, display: "block", filter: T.navy === DARK.navy ? "brightness(0) invert(1) opacity(0.85)" : "none", transition: "filter 0.3s" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        {cfg.showLinks && (
          <nav style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            {cfg.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                style={{ fontSize: 13, color: T.navy, textDecoration: "none", opacity: 0.75, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.75}
              >{l.label}</a>
            ))}
          </nav>
        )}
      </div>
      {cfg.showCopyright && (
        <div style={{
          maxWidth: 1200, margin: "8px auto 0",
          borderTop: `0.5px solid ${T.line}`, paddingTop: 6,
          fontSize: 11, color: T.muted,
        }}>{cfg.copyright}</div>
      )}
    </footer>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const { T, isDark, mode, setMode, bgEnabled, setBgEnabled, bgUrl, setBgUrl, autoResolved } = useTheme();
  const themeProps = { T, isDark, mode, setMode, bgEnabled, setBgEnabled, bgUrl, setBgUrl, autoResolved };

  const headers = {
    dashboard:    { title: "Übersicht",        subtitle: "Willkommen zurück, Daniela. Hier ist der Stand für heute." },
    events:       { title: "Veranstaltungen",  subtitle: "Alle geplanten und laufenden Einsätze" },
    staffing:     { title: "Einsatzplanung",   subtitle: "Mitarbeiter per Drag & Drop auf offene Positionen ziehen" },
    employees:    { title: "Mitarbeiter",      subtitle: "Stammdaten, Qualifikationen und Verfügbarkeiten" },
    applicants:   { title: "Bewerber-Pipeline",subtitle: "Status per Drag & Drop ändern" },
    time:         { title: "Zeiterfassung",    subtitle: "Schichten, Stempel-Vorgänge und Freigaben" },
    contacts:     { title: "Kontakte",         subtitle: "Kunden und Geschäftspartner" },
    "org-users":     { title: "Benutzer",         subtitle: "Benutzerkonten verwalten und einladen" },
    "org-roles":     { title: "Rollen & Zugriff", subtitle: "Berechtigungen und Zugriffsrechte konfigurieren" },
    "org-locations": { title: "Standorte",         subtitle: "Niederlassungen und Einsatzgebiete" },
    "org-settings":  { title: "Einstellungen",     subtitle: "Organisationsweite Konfiguration" },
  };
  const action = active === "events" ? null : active === "applicants" ? null : active === "contacts" ? null
    : <Button variant="primary" icon={Plus}>{active === "staffing" ? "Schicht hinzufügen" : active === "employees" ? "Mitarbeiter anlegen" : active === "time" ? "Zeit erfassen" : "Veranstaltung anlegen"}</Button>;

  return (
    <ThemeCtx.Provider value={T}>
      <div className="flex min-h-screen relative" style={{ fontFamily: '"Inter", Helvetica, Arial, sans-serif', color: T.ink, backgroundColor: T.bg, transition: "background-color 0.3s, color 0.2s" }}>
        {/* Solid base background */}
        <div className="fixed inset-0 z-[-1]" style={{ backgroundColor: T.bg, transition: "background-color 0.3s" }} />
        {/* Background image layer */}
        {bgEnabled && (
          <>
            <div className="fixed inset-0 z-0 pointer-events-none"
                 style={{
                   backgroundImage: `url(${bgUrl})`,
                   backgroundSize: "cover",
                   backgroundPosition: "center",
                   opacity: isDark ? 0.22 : 0.10,
                   transition: "opacity 0.5s",
                 }} />
            {/* Dark mode: extra dark gradient so cards stay readable */}
            {isDark && (
              <div className="fixed inset-0 z-0 pointer-events-none"
                   style={{
                     background: "linear-gradient(135deg, rgba(8,15,26,0.82) 0%, rgba(13,22,38,0.75) 100%)",
                   }} />
            )}
          </>
        )}

        <style>{`
          * { transition: background-color 0.2s, border-color 0.2s, color 0.15s; }
          body { background-color: ${T.bg}; color: ${T.ink}; }
          .hover\\:bg-gray-50:hover  { background-color: ${T.hover} !important; }
          .hover\\:bg-gray-100:hover { background-color: ${T.hover} !important; }
          input, textarea, select {
            background-color: ${T.card} !important;
            color: ${T.ink} !important;
            border-color: ${T.line} !important;
          }
          input::placeholder, textarea::placeholder { color: ${T.muted} !important; }
          input:focus, textarea:focus { border-color: ${T.navyDark} !important; outline: none !important; }
          table td, table th { color: ${T.ink2}; }
          /* Dark mode: boost all muted-color labels */
          ::selection { background-color: ${T.navyDark}; color: white; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: ${T.bg}; }
          ::-webkit-scrollbar-thumb { background: ${T.line}; border-radius: 3px; }
        `}</style>

        <div className="relative z-10 flex w-full min-h-screen">
          <Sidebar active={active} onChange={setActive} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
          <main className="flex-1 min-w-0" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", flex: 1 }}>
              <Topbar title={headers[active].title} subtitle={headers[active].subtitle} action={action} themeProps={themeProps} />
              {active === "dashboard"    && <Dashboard goTo={setActive} />}
              {active === "events"       && <EventsList goTo={setActive} />}
              {active === "staffing"     && <StaffingBoard />}
              {active === "employees"    && <Employees />}
              {active === "applicants"   && <Applicants />}
              {active === "time"         && <TimeTracking />}
              {active === "contacts"     && <Contacts />}
              {["org-users","org-roles","org-locations","org-settings"].includes(active) && (
                <div style={{ padding: "2rem 1.5rem" }}>
                  <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "rgba(11,58,110,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <Briefcase size={24} style={{ color: "#0B3A6E", opacity: 0.7 }} />
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", marginBottom: 8 }}>
                      {headers[active]?.title}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>
                      Dieser Bereich ist im Prototyp noch nicht ausgebaut.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <AppFooter />
          </main>
          {!aiOpen && <AIFloatingButton onClick={() => setAiOpen(true)} hasUnread />}
          <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} onNavigate={setActive} />
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}

