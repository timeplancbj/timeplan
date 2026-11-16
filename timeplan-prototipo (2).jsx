import React, { useState, useEffect, useRef } from "react";
import {
  Clock, Home, Calendar, CheckSquare, Target, BarChart2, Bell, User,
  ChevronLeft, ChevronRight, Plus, Play, Pause, RotateCcw, Award,
  Settings, HelpCircle, LogOut, Circle, CheckCircle2, Flame
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip
} from "recharts";

// ---------- Design tokens ----------
// Color: #6C4BE0 (violeta), #4B37A8 (violeta profundo), #2AD9C6 (turquesa),
// #EAFBF8 (menta suave), #211B3D (tinta), #F7F6FC (fondo crema-lavanda)
// Tipografia: display "Sora"-like (usamos font-bold tracking-tight), cuerpo sans

const COLORS = {
  violet: "#6C4BE0",
  violetDeep: "#4B37A8",
  teal: "#2AD9C6",
  tealSoft: "#EAFBF8",
  ink: "#211B3D",
  bg: "#F7F6FC",
};

const weekData = [
  { d: "L", h: 3.5 }, { d: "M", h: 4.8 }, { d: "X", h: 2.1 },
  { d: "J", h: 5.2 }, { d: "V", h: 4.0 }, { d: "S", h: 1.5 }, { d: "D", h: 0.8 },
];
const progressData = [
  { d: "S1", v: 40 }, { d: "S2", v: 55 }, { d: "S3", v: 48 }, { d: "S4", v: 72 },
];

const initialTasks = [
  { id: 1, time: "08:00", text: "Planificar el dia de hoy", cat: "personal", done: true },
  { id: 2, time: "09:30", text: "Repasar tema de matematicas", cat: "estudio", done: true },
  { id: 3, time: "11:00", text: "Reunion de equipo", cat: "trabajo", done: false },
  { id: 4, time: "14:00", text: "Entregar informe semanal", cat: "trabajo", done: false },
  { id: 5, time: "17:30", text: "Revisar y actualizar el progreso", cat: "personal", done: false },
];

const catColor = {
  estudio: COLORS.violet,
  trabajo: COLORS.teal,
  personal: "#F2A950",
};
const catLabel = { estudio: "Estudio", trabajo: "Trabajo", personal: "Personal" };

const events = {
  12: [{ h: "09:00", t: "Clase de matematicas" }, { h: "16:00", t: "Gimnasio" }],
  15: [{ h: "11:00", t: "Reunion de equipo" }],
  20: [{ h: "10:00", t: "Entrega de proyecto" }, { h: "19:00", t: "Cena con amigos" }],
  27: [{ h: "08:30", t: "Clase de matematicas" }],
};

// ---------- Shell components ----------
function PhoneScreen({ children }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: COLORS.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {children}
    </div>
  );
}

function TopBar({ title }) {
  return (
    <div style={{ padding: "22px 20px 14px", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9, background: COLORS.violet,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Clock size={17} color="#fff" strokeWidth={2.4} />
      </div>
      <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.ink, letterSpacing: -0.3 }}>
        {title}
      </span>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { id: "home", icon: Home },
    { id: "cal", icon: Calendar },
    { id: "tasks", icon: CheckSquare },
    { id: "focus", icon: Target },
    { id: "stats", icon: BarChart2 },
  ];
  return (
    <div style={{
      position: "sticky", bottom: 0, background: "#fff",
      borderTop: `1px solid #ECEAF6`, display: "flex", justifyContent: "space-around",
      padding: "10px 4px 14px"
    }}>
      {items.map(({ id, icon: Icon }) => (
        <button key={id} onClick={() => onChange(id)}
          style={{
            background: "none", border: "none", padding: 8, borderRadius: 12,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: active === id ? COLORS.violet : "#A6A2BE", cursor: "pointer"
          }}>
          <Icon size={20} strokeWidth={active === id ? 2.6 : 2} />
          {active === id && <div style={{ width: 4, height: 4, borderRadius: 99, background: COLORS.violet }} />}
        </button>
      ))}
    </div>
  );
}

// ---------- Screens ----------
function WelcomeScreen({ goHome }) {
  const pending = initialTasks.filter(t => !t.done).length;
  return (
    <PhoneScreen>
      <div style={{
        background: `linear-gradient(160deg, ${COLORS.violet}, ${COLORS.violetDeep})`,
        padding: "34px 22px 26px", borderRadius: "0 0 28px 28px", color: "#fff"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Clock size={15} strokeWidth={2.4} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.2 }}>TimePlan</span>
        </div>
        <p style={{ fontSize: 13, opacity: 0.75, margin: "0 0 4px" }}>lunes, 27 de julio</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px", letterSpacing: -0.5 }}>¡Hola, Martina!</h1>
        <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>Tu tiempo, tu plan, tu mejor version.</p>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.14)", borderRadius: 14, padding: "12px 14px" }}>
            <p style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{pending}</p>
            <p style={{ fontSize: 11.5, opacity: 0.85, margin: "2px 0 0" }}>tareas pendientes</p>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.14)", borderRadius: 14, padding: "12px 14px" }}>
            <p style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>11:00</p>
            <p style={{ fontSize: 11.5, opacity: 0.85, margin: "2px 0 0" }}>proximo evento</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 8px" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, margin: "0 0 10px" }}>Resumen de hoy</p>
        {initialTasks.slice(0, 3).map(t => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 10, background: "#fff",
            borderRadius: 12, padding: "10px 12px", marginBottom: 8, border: "1px solid #EFEDF7"
          }}>
            {t.done ? <CheckCircle2 size={18} color={COLORS.teal} /> : <Circle size={18} color="#C9C6DE" />}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink, margin: 0, textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.5 : 1 }}>{t.text}</p>
            </div>
            <span style={{ fontSize: 11, color: "#9A96B5" }}>{t.time}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 20px 26px" }}>
        <button onClick={goHome} style={{
          width: "100%", background: COLORS.violet, color: "#fff", border: "none",
          borderRadius: 14, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer"
        }}>
          Empezar a planificar
        </button>
      </div>
    </PhoneScreen>
  );
}

function CalendarScreen() {
  const [month] = useState("Julio 2026");
  const [selected, setSelected] = useState(27);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const firstOffset = 2; // martes inicio ficticio
  const list = events[selected] || [];

  return (
    <PhoneScreen>
      <TopBar title="Calendario" />
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <ChevronLeft size={18} color={COLORS.ink} />
          <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.ink }}>{month}</span>
          <ChevronRight size={18} color={COLORS.ink} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6 }}>
          {["L", "M", "X", "J", "V", "S", "D"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10.5, color: "#A6A2BE", fontWeight: 700 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 20 }}>
          {Array.from({ length: firstOffset }).map((_, i) => <div key={"e" + i} />)}
          {days.map(d => {
            const hasEvent = !!events[d];
            const isSel = d === selected;
            return (
              <button key={d} onClick={() => setSelected(d)} style={{
                aspectRatio: "1", borderRadius: 10, border: "none", cursor: "pointer",
                background: isSel ? COLORS.violet : "#fff",
                color: isSel ? "#fff" : COLORS.ink,
                fontSize: 12, fontWeight: 600, position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {d}
                {hasEvent && !isSel && (
                  <div style={{ position: "absolute", bottom: 4, width: 4, height: 4, borderRadius: 99, background: COLORS.teal }} />
                )}
              </button>
            );
          })}
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, margin: "0 0 10px" }}>
          Eventos del {selected} de julio
        </p>
        {list.length === 0 && (
          <p style={{ fontSize: 12.5, color: "#9A96B5" }}>Sin eventos para este dia.</p>
        )}
        {list.map((e, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, alignItems: "center", background: "#fff",
            border: "1px solid #EFEDF7", borderRadius: 12, padding: "10px 12px", marginBottom: 8
          }}>
            <div style={{ width: 3, alignSelf: "stretch", background: COLORS.teal, borderRadius: 3 }} />
            <div>
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: COLORS.ink }}>{e.t}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9A96B5" }}>{e.h}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 16 }} />
    </PhoneScreen>
  );
}

function TasksScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const toggle = id => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));

  return (
    <PhoneScreen>
      <TopBar title="Mis tareas" />
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontSize: 12.5, color: "#9A96B5", margin: 0 }}>
            {tasks.filter(t => t.done).length} de {tasks.length} completadas
          </p>
          <button style={{
            background: COLORS.violet, border: "none", borderRadius: 10, width: 30, height: 30,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <Plus size={16} color="#fff" />
          </button>
        </div>

        {tasks.map(t => (
          <div key={t.id} onClick={() => toggle(t.id)} style={{
            display: "flex", alignItems: "center", gap: 10, background: "#fff",
            border: "1px solid #EFEDF7", borderRadius: 12, padding: "11px 12px", marginBottom: 8, cursor: "pointer"
          }}>
            {t.done ? <CheckCircle2 size={19} color={COLORS.teal} /> : <Circle size={19} color="#C9C6DE" />}
            <div style={{ flex: 1 }}>
              <p style={{
                margin: 0, fontSize: 12.5, fontWeight: 600, color: COLORS.ink,
                textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.5 : 1
              }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 10.5, color: "#9A96B5" }}>{t.time}</span>
                <span style={{
                  fontSize: 9.5, fontWeight: 700, padding: "1px 7px", borderRadius: 20,
                  background: catColor[t.cat] + "22", color: catColor[t.cat]
                }}>{catLabel[t.cat]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 16 }} />
    </PhoneScreen>
  );
}

function FocusScreen() {
  const TOTAL = 25 * 60;
  const [secs, setSecs] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(3);
  const ref = useRef();

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) { setRunning(false); setSessions(n => n + 1); return TOTAL; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(ref.current);
  }, [running]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = 1 - secs / TOTAL;
  const r = 78, c = 2 * Math.PI * r;

  return (
    <PhoneScreen>
      <TopBar title="Enfoque" />
      <div style={{ padding: "10px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: 190, height: 190, margin: "18px 0 22px" }}>
          <svg width="190" height="190" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="95" cy="95" r={r} stroke="#ECEAF6" strokeWidth="12" fill="none" />
            <circle cx="95" cy="95" r={r} stroke={COLORS.violet} strokeWidth="12" fill="none"
              strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round" />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: COLORS.ink, letterSpacing: -1 }}>{mm}:{ss}</span>
            <span style={{ fontSize: 11, color: "#9A96B5" }}>sesion de enfoque</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, marginBottom: 22 }}>
          <button onClick={() => setRunning(r => !r)} style={{
            width: 56, height: 56, borderRadius: 99, border: "none", cursor: "pointer",
            background: COLORS.violet, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {running ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
          </button>
          <button onClick={() => { setRunning(false); setSecs(TOTAL); }} style={{
            width: 56, height: 56, borderRadius: 99, border: "1px solid #ECEAF6", cursor: "pointer",
            background: "#fff", color: COLORS.ink, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <RotateCcw size={18} />
          </button>
        </div>

        <div style={{ width: "100%", display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: "#fff", border: "1px solid #EFEDF7", borderRadius: 14, padding: "12px 14px", textAlign: "center" }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: COLORS.ink, margin: 0 }}>{sessions}</p>
            <p style={{ fontSize: 10.5, color: "#9A96B5", margin: "2px 0 0" }}>sesiones hoy</p>
          </div>
          <div style={{ flex: 1, background: "#fff", border: "1px solid #EFEDF7", borderRadius: 14, padding: "12px 14px", textAlign: "center" }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: COLORS.ink, margin: 0 }}>9:30</p>
            <p style={{ fontSize: 10.5, color: "#9A96B5", margin: "2px 0 0" }}>proximo descanso</p>
          </div>
        </div>
      </div>
      <div style={{ height: 16 }} />
    </PhoneScreen>
  );
}

function StatsScreen() {
  return (
    <PhoneScreen>
      <TopBar title="Estadisticas" />
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: "#fff", border: "1px solid #EFEDF7", borderRadius: 14, padding: "14px 14px 4px", marginBottom: 14 }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.ink, margin: "0 0 8px" }}>Horas dedicadas por dia</p>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={weekData}>
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#9A96B5" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="h" fill={COLORS.violet} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", border: "1px solid #EFEDF7", borderRadius: 14, padding: "14px 14px 4px", marginBottom: 14 }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.ink, margin: "0 0 8px" }}>Progreso semanal</p>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={progressData}>
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#9A96B5" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Line type="monotone" dataKey="v" stroke={COLORS.teal} strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: COLORS.tealSoft, borderRadius: 14, padding: "12px 14px" }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#0F7A6D", margin: 0 }}>28</p>
            <p style={{ fontSize: 10.5, color: "#0F7A6D", margin: "2px 0 0" }}>tareas completadas</p>
          </div>
          <div style={{ flex: 1, background: "#F1EDFB", borderRadius: 14, padding: "12px 14px" }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: COLORS.violetDeep, margin: 0 }}>7h 40m</p>
            <p style={{ fontSize: 10.5, color: COLORS.violetDeep, margin: "2px 0 0" }}>disponible hoy</p>
          </div>
        </div>
      </div>
      <div style={{ height: 16 }} />
    </PhoneScreen>
  );
}

function NotificationsScreen() {
  const items = [
    { icon: Award, text: "¡Excelente trabajo! Completaste 5 tareas seguidas.", time: "hace 1h", cat: "logro" },
    { icon: Bell, text: "Recordatorio: reunion de equipo en 30 minutos.", time: "hace 2h", cat: "recordatorio" },
    { icon: Flame, text: "Racha de 6 dias seguidos usando TimePlan.", time: "ayer", cat: "logro" },
    { icon: Bell, text: "No olvides entregar el informe semanal.", time: "ayer", cat: "recordatorio" },
  ];
  return (
    <PhoneScreen>
      <TopBar title="Notificaciones" />
      <div style={{ padding: "0 20px" }}>
        {items.map((n, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, background: "#fff", border: "1px solid #EFEDF7",
            borderRadius: 12, padding: "11px 12px", marginBottom: 8
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: n.cat === "logro" ? "#FFF3E4" : COLORS.tealSoft,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <n.icon size={16} color={n.cat === "logro" ? "#D8862A" : "#0F7A6D"} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: COLORS.ink, fontWeight: 600 }}>{n.text}</p>
              <p style={{ margin: "3px 0 0", fontSize: 10.5, color: "#9A96B5" }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 16 }} />
    </PhoneScreen>
  );
}

function ProfileScreen() {
  const rows = [
    { icon: Settings, label: "Configuracion" },
    { icon: HelpCircle, label: "Ayuda" },
    { icon: LogOut, label: "Cerrar sesion" },
  ];
  return (
    <PhoneScreen>
      <TopBar title="Perfil" />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 68, height: 68, borderRadius: 99, background: COLORS.violet,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10
        }}>
          <User size={30} color="#fff" />
        </div>
        <p style={{ fontWeight: 800, fontSize: 15, color: COLORS.ink, margin: 0 }}>Martina Garcia</p>
        <p style={{ fontSize: 12, color: "#9A96B5", margin: "2px 0 20px" }}>miembro desde 2026</p>

        <div style={{ width: "100%" }}>
          {rows.map(({ icon: Icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 10, background: "#fff",
              border: "1px solid #EFEDF7", borderRadius: 12, padding: "12px 14px", marginBottom: 8
            }}>
              <Icon size={17} color={COLORS.violet} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 16 }} />
    </PhoneScreen>
  );
}

// ---------- App shell ----------
export default function TimePlanPrototype() {
  const [tab, setTab] = useState("welcome");

  const screens = {
    welcome: <WelcomeScreen goHome={() => setTab("home")} />,
    home: <WelcomeScreen goHome={() => setTab("cal")} />,
    cal: <CalendarScreen />,
    tasks: <TasksScreen />,
    focus: <FocusScreen />,
    stats: <StatsScreen />,
    notif: <NotificationsScreen />,
    profile: <ProfileScreen />,
  };
  const bottomTabId = ["home", "cal", "tasks", "focus", "stats"].includes(tab) ? tab : null;

  return (
    <div style={{
      minHeight: "100vh", background: "#EDEBFA", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "24px 12px",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 340, height: 700, background: "#fff", borderRadius: 42,
          border: "10px solid " + COLORS.ink, boxShadow: "0 24px 60px rgba(33,27,61,0.25)",
          overflow: "hidden", display: "flex", flexDirection: "column", position: "relative"
        }}>
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 120, height: 22, background: COLORS.ink, borderRadius: "0 0 14px 14px", zIndex: 5
          }} />
          <div style={{ flex: 1, overflow: "hidden" }}>{screens[tab]}</div>
          {bottomTabId && <BottomNav active={bottomTabId} onChange={setTab} />}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 340 }}>
          {[
            ["welcome", "Bienvenida"], ["notif", "Notificaciones"], ["profile", "Perfil"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              fontSize: 11.5, fontWeight: 600, padding: "6px 12px", borderRadius: 99,
              border: "1px solid " + (tab === id ? COLORS.violet : "#D9D6EC"),
              background: tab === id ? COLORS.violet : "#fff",
              color: tab === id ? "#fff" : COLORS.ink, cursor: "pointer"
            }}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
