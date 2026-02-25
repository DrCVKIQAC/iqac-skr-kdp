import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — IQAC Coordinator fills this once
// ─────────────────────────────────────────────────────────────────────────────
const COLLEGE_CONFIG = {
  name: "SKR & SKR Government College for Women (Autonomous), Kadapa",
  principal: "Dr. V. Saleem Basha",
  iqacCoordinator: "Dr. C.V. Krishnaveni",
  naacGrade: "B",
  naacScore: "2.46",
  naacValidity: "07/07/2028",
  established: "1973",
  // ── PASTE YOUR GOOGLE FORM URL HERE after creating it ──
  googleFormURL: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform",
  // ── PASTE YOUR PUBLISHED GOOGLE SHEET CSV URL HERE ──
  googleSheetCSV: "",
};

const DEPARTMENTS = [
  "IQAC","Chemistry","Physics","Mathematics","Botany","Zoology","Biotechnology",
  "Computer Science","Commerce","Economics","History","Telugu","Hindi","English",
  "Urdu","Political Science","Library & Information Science","Physical Education",
];
const ACTIVITY_TYPES = [
  "Workshop / Seminar","Guest Lecture","NSS / NCC Activity","Certificate Course",
  "Placement Drive","Sports / Cultural Event","Research Publication","Faculty Development Programme",
  "Industry / Educational Visit","Community Service Project","Webinar","Alumni Activity",
  "Skill Development","Extension Activity","Gender Awareness","Environmental Activity",
  "Career Guidance","Induction Programme","NAAC / NIRF Activity",
];
const ACADEMIC_YEARS = ["2020-21","2021-22","2022-23","2023-24","2024-25","2025-26"];
const LEVELS = ["Institution","Department","State","National","International"];

const PALETTE = {
  navy:    "#1A3A5C",
  gold:    "#C8860A",
  crimson: "#8B1A1A",
  green:   "#166534",
  teal:    "#0E7490",
  purple:  "#6B21A8",
  bg:      "#F4F0E6",
  card:    "#FFFFFF",
  border:  "#E8E0CC",
  muted:   "#64748B",
};

const PIE_COLORS = [
  "#C8860A","#1A3A5C","#8B1A1A","#166534","#6B21A8",
  "#0E7490","#9D5A00","#1E40AF","#BE123C","#065F46",
  "#92400E","#1D4ED8","#9F1239","#064E3B","#581C87",
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA (from AQAR 2023-24)
// ─────────────────────────────────────────────────────────────────────────────
const SEED = [
  {id:1,faculty:"IQAC Cell",department:"IQAC",type:"Webinar",title:"National Webinar on PO-CO Mapping",date:"2023-10-06",academicYear:"2023-24",level:"National",participants:120,facultyCount:8,description:"National webinar on PO-CO mapping conducted for all departments",outcome:"Faculty awareness on OBE significantly improved across all departments",submittedAt:"2023-10-06T10:00:00"},
  {id:2,faculty:"Chemistry Dept",department:"Chemistry",type:"Webinar",title:"Chemistry in Daily Life – Breakfast to Bed",date:"2023-12-02",academicYear:"2023-24",level:"Institution",participants:85,facultyCount:5,description:"Webinar on Chemistry in daily life applications",outcome:"Student awareness about applied chemistry enhanced",submittedAt:"2023-12-02T10:00:00"},
  {id:3,faculty:"IQAC Cell",department:"IQAC",type:"Workshop / Seminar",title:"Research Management System Workshop",date:"2023-09-29",academicYear:"2023-24",level:"Institution",participants:57,facultyCount:57,description:"Workshop on research management system for all staff",outcome:"Research documentation skills improved across faculty",submittedAt:"2023-09-29T10:00:00"},
  {id:4,faculty:"IQAC Cell",department:"IQAC",type:"Faculty Development Programme",title:"FDP with ACT Academy Kerala – Pedagogical Innovations",date:"2023-12-27",academicYear:"2023-24",level:"National",participants:45,facultyCount:45,description:"One week online FDP on Pedagogical Innovations in Higher Education",outcome:"Teaching pedagogy and learning strategies enhanced",submittedAt:"2023-12-27T10:00:00"},
  {id:5,faculty:"NSS Unit",department:"Physical Education",type:"NSS / NCC Activity",title:"NSS Special Camp – Ramana Palli Village",date:"2024-02-01",academicYear:"2023-24",level:"Institution",participants:120,facultyCount:10,description:"7-day NSS special camp: plantation, health camp, literacy survey, vote enrollment",outcome:"Community sensitization, 120 students developed social responsibility",submittedAt:"2024-02-01T10:00:00"},
  {id:6,faculty:"IQAC Cell",department:"IQAC",type:"Induction Programme",title:"Student Induction Programme 2023",date:"2023-08-16",academicYear:"2023-24",level:"Institution",participants:500,facultyCount:30,description:"Student induction from 16-08-2023 to 07-09-2023",outcome:"500+ students oriented to college culture, programmes and values",submittedAt:"2023-08-16T10:00:00"},
  {id:7,faculty:"NCC Unit",department:"Physical Education",type:"NSS / NCC Activity",title:"Blood Donation Camp",date:"2023-11-29",academicYear:"2023-24",level:"Institution",participants:50,facultyCount:10,description:"NCC-organised blood donation camp on campus",outcome:"Community health supported, students sensitized to service",submittedAt:"2023-11-29T10:00:00"},
  {id:8,faculty:"IQAC Cell",department:"IQAC",type:"Webinar",title:"AI Tools for Research Paper Writing – IETE Hyderabad",date:"2024-01-15",academicYear:"2023-24",level:"National",participants:80,facultyCount:25,description:"Webinar on AI tools for research conducted by IETE Hyderabad",outcome:"Faculty equipped with AI-assisted research writing skills",submittedAt:"2024-01-15T10:00:00"},
  {id:9,faculty:"Placement Cell",department:"Computer Science",type:"Placement Drive",title:"Campus Placement Drives – 11 Companies",date:"2024-01-20",academicYear:"2023-24",level:"Institution",participants:349,facultyCount:5,description:"11 on/off campus drives conducted throughout the year",outcome:"349 students secured employment across 11 companies",submittedAt:"2024-01-20T10:00:00"},
  {id:10,faculty:"Women Empowerment Cell",department:"Political Science",type:"Gender Awareness",title:"Rally on Girl Child Education",date:"2023-12-13",academicYear:"2023-24",level:"Institution",participants:30,facultyCount:15,description:"Rally to raise awareness about girl child education in community",outcome:"Community sensitization; 30+ families reached",submittedAt:"2023-12-13T10:00:00"},
  {id:11,faculty:"Zoology Dept",department:"Zoology",type:"NSS / NCC Activity",title:"World AIDS Day Celebration",date:"2023-12-01",academicYear:"2023-24",level:"Institution",participants:70,facultyCount:20,description:"World AIDS Day awareness programme by Zoology department",outcome:"Students sensitized on HIV/AIDS prevention and awareness",submittedAt:"2023-12-01T10:00:00"},
  {id:12,faculty:"Biotechnology Dept",department:"Biotechnology",type:"Certificate Course",title:"Certificate Course in Biotechnology",date:"2023-08-01",academicYear:"2023-24",level:"Institution",participants:45,facultyCount:4,description:"Semester-long certificate course in Biotechnology for students",outcome:"45 students gained additional skill certification",submittedAt:"2023-08-01T10:00:00"},
  {id:13,faculty:"Mathematics Dept",department:"Mathematics",type:"Certificate Course",title:"Certificate Course in Mathematics",date:"2023-08-01",academicYear:"2023-24",level:"Institution",participants:55,facultyCount:3,description:"Certificate course in advanced Mathematics",outcome:"Mathematical skills and competitive exam readiness improved",submittedAt:"2023-08-01T10:00:00"},
  {id:14,faculty:"Mathematics Dept",department:"Mathematics",type:"Sports / Cultural Event",title:"National Mathematics Day Celebration",date:"2023-12-22",academicYear:"2023-24",level:"Institution",participants:80,facultyCount:30,description:"National Mathematics Day celebration with competitions",outcome:"Math enthusiasm among students significantly increased",submittedAt:"2023-12-22T10:00:00"},
  {id:15,faculty:"Botany Dept",department:"Botany",type:"Environmental Activity",title:"Swachh Bharat Campus Cleanliness Drive",date:"2023-11-18",academicYear:"2023-24",level:"Institution",participants:30,facultyCount:3,description:"Swachh Bharat programme – campus and surrounding area cleanliness",outcome:"Clean and green campus; students developed environmental responsibility",submittedAt:"2023-11-18T10:00:00"},
  {id:16,faculty:"Women Empowerment Cell",department:"Political Science",type:"Gender Awareness",title:"Invited Talk on Women Empowerment",date:"2023-12-08",academicYear:"2023-24",level:"Institution",participants:50,facultyCount:20,description:"Expert talk on women empowerment and legal rights",outcome:"Women students motivated; awareness of rights enhanced",submittedAt:"2023-12-08T10:00:00"},
  {id:17,faculty:"Botany Dept",department:"Botany",type:"Industry / Educational Visit",title:"Educational Visit – Pulivendula Tissue Culture Centre",date:"2023-12-01",academicYear:"2023-24",level:"Institution",participants:50,facultyCount:5,description:"Visit to tissue culture laboratory at Pulivendula",outcome:"Hands-on learning; students exposed to real lab environment",submittedAt:"2023-12-01T10:00:00"},
  {id:18,faculty:"IQAC Cell",department:"IQAC",type:"Career Guidance",title:"PG Coaching & Higher Education Guidance",date:"2024-02-01",academicYear:"2023-24",level:"Institution",participants:118,facultyCount:10,description:"Coaching for PG entrance examinations through JKC",outcome:"118 students successfully admitted to PG programmes",submittedAt:"2024-02-01T10:00:00"},
  {id:19,faculty:"Urdu Dept",department:"Urdu",type:"Workshop / Seminar",title:"National Seminar on Urdu",date:"2024-11-11",academicYear:"2024-25",level:"National",participants:80,facultyCount:20,description:"National level seminar promoting Urdu literature and language",outcome:"Promotion of Urdu; national-level academic exchange",submittedAt:"2024-11-11T10:00:00"},
  {id:20,faculty:"IQAC Cell",department:"IQAC",type:"Faculty Development Programme",title:"SEL and SEEK Programme – NRC Activities",date:"2024-08-09",academicYear:"2024-25",level:"Institution",participants:40,facultyCount:40,description:"Five-day programme on Social Emotional Learning and SEEK",outcome:"Faculty empowered with socio-emotional learning strategies",submittedAt:"2024-08-09T10:00:00"},
  {id:21,faculty:"Red Ribbon Club",department:"Physical Education",type:"Gender Awareness",title:"Awareness on Women Health & Hygiene",date:"2023-11-29",academicYear:"2023-24",level:"Institution",participants:80,facultyCount:10,description:"Red Ribbon Club session on women health and hygiene",outcome:"80 students sensitized on health and hygiene practices",submittedAt:"2023-11-29T10:00:00"},
  {id:22,faculty:"Commerce Dept",department:"Commerce",type:"Certificate Course",title:"Certificate Course in Tally & Accounting",date:"2023-09-01",academicYear:"2023-24",level:"Institution",participants:60,facultyCount:3,description:"Certificate course in Tally ERP and accounting practices",outcome:"60 students gained industry-relevant accounting skills",submittedAt:"2023-09-01T10:00:00"},
  {id:23,faculty:"English Dept",department:"English",type:"Workshop / Seminar",title:"Communication Skills Enhancement Workshop",date:"2023-10-15",academicYear:"2023-24",level:"Institution",participants:100,facultyCount:6,description:"Workshop on professional communication and presentation skills",outcome:"Students' English communication confidence improved",submittedAt:"2023-10-15T10:00:00"},
  {id:24,faculty:"NSS Unit",department:"Physical Education",type:"Environmental Activity",title:"Tree Plantation Drive – Vanam Manam",date:"2023-07-24",academicYear:"2023-24",level:"Institution",participants:150,facultyCount:12,description:"Plantation programme as part of Vanam Manam initiative",outcome:"150+ trees planted; environmental awareness enhanced",submittedAt:"2023-07-24T10:00:00"},
  {id:25,faculty:"Library Dept",department:"Library & Information Science",type:"NAAC / NIRF Activity",title:"National Library Week – Digital Library in Modern Age",date:"2023-11-17",academicYear:"2023-24",level:"Institution",participants:140,facultyCount:50,description:"Three-day National Library Week celebrations including digital library seminar",outcome:"Students and faculty motivated to use library and N-LIST INFLIBNET",submittedAt:"2023-11-17T10:00:00"},
];

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────────────────
async function loadData() {
  try {
    const r = await window.storage.get("iqac_v2_activities");
    if (r) return JSON.parse(r.value);
  } catch {}
  return SEED;
}
async function persist(data) {
  try { await window.storage.set("iqac_v2_activities", JSON.stringify(data)); } catch {}
}
async function loadConfig() {
  try {
    const r = await window.storage.get("iqac_v2_config");
    if (r) return { ...COLLEGE_CONFIG, ...JSON.parse(r.value) };
  } catch {}
  return COLLEGE_CONFIG;
}
async function saveConfig(cfg) {
  try { await window.storage.set("iqac_v2_config", JSON.stringify(cfg)); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt   = (n) => (+n || 0).toLocaleString("en-IN");
const today = () => new Date().toISOString().slice(0,10);
const ago   = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d} days ago`;
};

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE UI
// ─────────────────────────────────────────────────────────────────────────────
const inp = {
  width:"100%", padding:"9px 13px", border:`1.5px solid ${PALETTE.border}`,
  borderRadius:8, fontSize:13.5, outline:"none", boxSizing:"border-box",
  fontFamily:"'Lora', Georgia, serif", background:"#FDFBF7", color:"#1e293b",
};
const sel = { ...inp, cursor:"pointer" };

function Card({ children, style={} }) {
  return (
    <div style={{ background:PALETTE.card, borderRadius:14, padding:22,
      boxShadow:"0 1px 8px rgba(26,58,92,0.08)", border:`1px solid ${PALETTE.border}`,
      ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom:18 }}>
      <h3 style={{ margin:0, fontSize:16, fontFamily:"'Playfair Display',serif",
        color:PALETTE.navy, borderLeft:`4px solid ${PALETTE.gold}`,
        paddingLeft:12, lineHeight:1.3 }}>{children}</h3>
      {sub && <p style={{ margin:"4px 0 0 16px", fontSize:12, color:PALETTE.muted }}>{sub}</p>}
    </div>
  );
}

function Badge({ label, color="#C8860A", bg }) {
  return (
    <span style={{ background: bg || `${color}18`, color, padding:"3px 10px",
      borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

function KPI({ icon, label, value, sub, accent }) {
  return (
    <div style={{ background:"#fff", borderRadius:12, padding:"18px 20px",
      borderLeft:`4px solid ${accent}`, boxShadow:"0 2px 10px rgba(0,0,0,0.06)",
      border:`1px solid ${PALETTE.border}`, borderLeftColor:accent }}>
      <div style={{ fontSize:26, marginBottom:4 }}>{icon}</div>
      <div style={{ fontSize:11, color:PALETTE.muted, letterSpacing:.5, textTransform:"uppercase", marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:30, fontWeight:800, color:PALETTE.navy,
        fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:PALETTE.muted, marginTop:3 }}>{sub}</div>}
    </div>
  );
}

function Overlay({ onClose, children, wide }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,20,40,0.55)",
      zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#fff", borderRadius:18, padding:32,
        width:"100%", maxWidth: wide ? 820 : 640, maxHeight:"92vh",
        overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,0.35)" }}>
        {children}
      </div>
    </div>
  );
}

function ModalTitle({ children, onClose }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      marginBottom:20, paddingBottom:14, borderBottom:`2px solid ${PALETTE.gold}40` }}>
      <h2 style={{ margin:0, fontFamily:"'Playfair Display',serif",
        color:PALETTE.navy, fontSize:19 }}>{children}</h2>
      <button onClick={onClose} style={{ background:"none", border:"none",
        fontSize:20, cursor:"pointer", color:PALETTE.muted, padding:4 }}>✕</button>
    </div>
  );
}

function FF({ label, req, children, hint }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:12.5, fontWeight:700,
        color:"#374151", marginBottom:5 }}>
        {label}{req && <span style={{color:"#ef4444"}}> *</span>}
        {hint && <span style={{ fontWeight:400, color:PALETTE.muted, marginLeft:6 }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id:"overview",    icon:"📊", label:"Overview"        },
  { id:"submit",      icon:"📤", label:"Submit Activity"  },
  { id:"register",    icon:"📋", label:"Activity Register"},
  { id:"analytics",   icon:"📈", label:"Analytics"       },
  { id:"departments", icon:"🏛️", label:"Departments"     },
  { id:"yearwise",    icon:"📅", label:"Year Wise"       },
  { id:"naac",        icon:"🏆", label:"NAAC Snapshot"   },
  { id:"setup",       icon:"⚙️", label:"Setup Guide"     },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function IQACDashboard() {
  const [acts, setActs]       = useState([]);
  const [cfg, setCfg]         = useState(COLLEGE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("overview");

  // filters
  const [fYear, setFYear] = useState("All");
  const [fDept, setFDept] = useState("All");
  const [fType, setFType] = useState("All");
  const [fLvl,  setFLvl]  = useState("All");
  const [fQ,    setFQ]    = useState("");

  // modals
  const [showAdd,    setShowAdd]    = useState(false);
  const [showEdit,   setShowEdit]   = useState(null);
  const [showView,   setShowView]   = useState(null);
  const [showCSV,    setShowCSV]    = useState(false);
  const [showCfg,    setShowCfg]    = useState(false);
  const [csvText,    setCsvText]    = useState("");
  const [csvStatus,  setCsvStatus]  = useState("");

  // quick-add form (for coordinator manual entry)
  const blank = { faculty:"", department:"Chemistry", type:"Workshop / Seminar",
    title:"", date:today(), academicYear:"2023-24", level:"Institution",
    participants:"", facultyCount:"", description:"", outcome:"" };
  const [form, setForm] = useState(blank);
  const [formErr, setFormErr] = useState({});

  useEffect(() => {
    Promise.all([loadData(), loadConfig()]).then(([d, c]) => {
      setActs(d); setCfg(c); setLoading(false);
    });
  }, []);

  const save = useCallback(async (list) => {
    setActs(list);
    await persist(list);
  }, []);

  // ── filtered list ──
  const filtered = acts.filter(a =>
    (fYear === "All" || a.academicYear === fYear) &&
    (fDept === "All" || a.department   === fDept) &&
    (fType === "All" || a.type         === fType) &&
    (fLvl  === "All" || a.level        === fLvl)  &&
    (!fQ || [a.title,a.department,a.faculty,a.type,a.description]
      .join(" ").toLowerCase().includes(fQ.toLowerCase()))
  ).sort((a,b) => (b.date > a.date ? 1 : -1));

  // ── analytics ──
  const totalP  = filtered.reduce((s,a) => s + (+a.participants||0), 0);
  const totalF  = filtered.reduce((s,a) => s + (+a.facultyCount ||0), 0);
  const natIntl = filtered.filter(a => a.level==="National"||a.level==="International").length;

  const byType = Object.entries(
    filtered.reduce((acc,a) => { acc[a.type]=(acc[a.type]||0)+1; return acc; }, {})
  ).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);

  const byDept = Object.entries(
    filtered.reduce((acc,a) => { acc[a.department]=(acc[a.department]||0)+1; return acc; }, {})
  ).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,10);

  const byYear = ACADEMIC_YEARS.map(yr => ({
    year: yr,
    acts: acts.filter(a=>a.academicYear===yr).length,
    participants: acts.filter(a=>a.academicYear===yr).reduce((s,a)=>s+(+a.participants||0),0),
  }));

  const byLevel = Object.entries(
    filtered.reduce((acc,a)=>{ acc[a.level]=(acc[a.level]||0)+1; return acc; },{})
  ).map(([name,value])=>({name,value}));

  const monthly = () => {
    const m={};
    filtered.forEach(a=>{
      if(!a.date) return;
      const k=a.date.slice(0,7);
      if(!m[k]) m[k]={month:k,count:0,participants:0};
      m[k].count++; m[k].participants+=(+a.participants||0);
    });
    return Object.values(m).sort((a,b)=>a.month>b.month?1:-1).slice(-12);
  };

  // ── add / edit ──
  const validate = (f) => {
    const e={};
    if(!f.title.trim()) e.title="Required";
    if(!f.date)         e.date ="Required";
    if(!f.participants) e.participants="Required";
    if(!f.faculty.trim()) e.faculty="Required";
    return e;
  };

  const handleSave = async () => {
    const e = validate(form);
    if(Object.keys(e).length){ setFormErr(e); return; }
    const entry = { ...form, id:showEdit?.id || Date.now(),
      participants:+form.participants, facultyCount:+form.facultyCount,
      submittedAt: showEdit?.submittedAt || new Date().toISOString() };
    const list = showEdit
      ? acts.map(a => a.id===showEdit.id ? entry : a)
      : [entry, ...acts];
    await save(list);
    setShowAdd(false); setShowEdit(null); setForm(blank); setFormErr({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity record?")) return;
    await save(acts.filter(a=>a.id!==id));
  };

  // ── CSV import ──
  const handleCSVImport = async () => {
    setCsvStatus("Parsing…");
    try {
      const lines = csvText.trim().split("\n");
      const headers = lines[0].split(",").map(h=>h.trim().replace(/"/g,""));
      const imported = lines.slice(1).map((line,i)=>{
        const vals = line.match(/(".*?"|[^,]+)/g)?.map(v=>v.replace(/"/g,"").trim()) || [];
        const obj = {};
        headers.forEach((h,j)=>{ obj[h]=vals[j]||""; });
        return {
          id: Date.now()+i,
          faculty:       obj["Faculty Name"]       || obj["faculty"]       || "",
          department:    obj["Department"]          || obj["department"]    || "IQAC",
          type:          obj["Activity Type"]       || obj["type"]          || "Workshop / Seminar",
          title:         obj["Activity Title"]      || obj["title"]         || `Imported Activity ${i+1}`,
          date:          obj["Date"]                || obj["date"]          || today(),
          academicYear:  obj["Academic Year"]       || obj["academicYear"]  || "2023-24",
          level:         obj["Level"]               || obj["level"]         || "Institution",
          participants:  +(obj["No. of Participants"]||obj["participants"]||0),
          facultyCount:  +(obj["No. of Faculty"]    ||obj["facultyCount"] ||0),
          description:   obj["Description"]         || obj["description"]   || "",
          outcome:       obj["Outcome / Impact"]    || obj["outcome"]       || "",
          submittedAt:   new Date().toISOString(),
        };
      }).filter(r=>r.title);
      await save([...imported, ...acts]);
      setCsvStatus(`✅ Successfully imported ${imported.length} activities!`);
      setCsvText("");
      setTimeout(()=>{ setShowCSV(false); setCsvStatus(""); }, 2000);
    } catch(err) {
      setCsvStatus("❌ Error parsing CSV. Check format and try again.");
    }
  };

  // ── config save ──
  const [cfgForm, setCfgForm] = useState(cfg);
  const handleCfgSave = async () => {
    await saveConfig(cfgForm); setCfg(cfgForm); setShowCfg(false);
  };

  if(loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      height:"100vh",background:PALETTE.bg,fontFamily:"'Playfair Display',serif",
      flexDirection:"column",gap:16}}>
      <div style={{fontSize:48}}>🎓</div>
      <div style={{fontSize:20,color:PALETTE.navy,fontWeight:700}}>Loading IQAC Dashboard…</div>
      <div style={{fontSize:13,color:PALETTE.muted}}>SKR & SKR Government College for Women (A), Kadapa</div>
    </div>
  );

  const gold=PALETTE.gold, navy=PALETTE.navy, crimson=PALETTE.crimson;

  return (
    <div style={{fontFamily:"'Lora',Georgia,serif",background:PALETTE.bg,
      minHeight:"100vh",color:"#1e293b"}}>

      {/* ══════════ HEADER ══════════ */}
      <div style={{background:`linear-gradient(160deg,${navy} 0%,#0D2035 70%,#142B47 100%)`,
        color:"#fff",position:"sticky",top:0,zIndex:500,
        boxShadow:"0 4px 24px rgba(0,0,0,0.35)"}}>

        {/* Gold bar */}
        <div style={{background:`linear-gradient(90deg,#B07200,${gold},#E9A820,${gold},#B07200)`,
          padding:"5px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:800,letterSpacing:1.8,
            textTransform:"uppercase",color:navy}}>
            {cfg.name}
          </span>
          <span style={{fontSize:11,color:navy,fontWeight:700}}>
            NAAC {cfg.naacGrade} ({cfg.naacScore}) · Autonomous · Est. {cfg.established}
          </span>
        </div>

        {/* Main header row */}
        <div style={{padding:"14px 24px",display:"flex",alignItems:"center",gap:18}}>
          <div style={{width:52,height:52,borderRadius:"50%",
            background:`linear-gradient(135deg,${gold},#E9A820)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:26,flexShrink:0,boxShadow:`0 0 0 3px ${gold}40`}}>🎓</div>
          <div style={{flex:1}}>
            <div style={{fontSize:19,fontWeight:700,fontFamily:"'Playfair Display',serif",
              letterSpacing:.3,lineHeight:1.2}}>
              IQAC Activity & Quality Management Dashboard
            </div>
            <div style={{fontSize:12.5,marginTop:5,display:"flex",gap:16,flexWrap:"wrap"}}>
              <span>
                <span style={{color:gold,fontWeight:700}}>Principal: </span>
                <span style={{fontWeight:600,color:"#E2C97E",fontSize:13}}>{cfg.principal}</span>
              </span>
              <span style={{color:"rgba(255,255,255,0.4)"}}>|</span>
              <span>
                <span style={{color:gold,fontWeight:700}}>IQAC Coordinator: </span>
                <span style={{fontWeight:600,color:"#E2C97E",fontSize:13}}>{cfg.iqacCoordinator}</span>
              </span>
            </div>
          </div>
          <div style={{display:"flex",gap:10,flexShrink:0}}>
            <button onClick={()=>{setFQ("");setFYear("All");setFDept("All");setFType("All");setFLvl("All");}}
              style={{padding:"8px 14px",border:`1px solid ${gold}50`,borderRadius:8,
                background:"transparent",color:gold,cursor:"pointer",fontSize:12,fontWeight:600}}>
              Clear Filters
            </button>
            <button onClick={()=>setShowCSV(true)}
              style={{padding:"8px 14px",border:`1px solid rgba(255,255,255,0.25)`,borderRadius:8,
                background:"rgba(255,255,255,0.1)",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>
              📥 Import CSV
            </button>
            <button onClick={()=>setCfgForm(cfg)||setShowCfg(true)}
              style={{padding:"8px 14px",border:`1px solid rgba(255,255,255,0.25)`,borderRadius:8,
                background:"rgba(255,255,255,0.1)",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>
              ⚙️ Settings
            </button>
            <button onClick={()=>{setForm(blank);setFormErr({});setShowAdd(true);}}
              style={{padding:"8px 18px",border:"none",borderRadius:8,
                background:`linear-gradient(135deg,${gold},#E9A820)`,
                color:navy,cursor:"pointer",fontSize:12.5,fontWeight:800,
                boxShadow:`0 2px 10px ${gold}50`}}>
              + Add Activity
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:0,paddingLeft:12,paddingRight:12,
          overflowX:"auto",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"10px 16px",border:"none",cursor:"pointer",
                fontSize:12.5,fontWeight:600,borderRadius:"8px 8px 0 0",
                whiteSpace:"nowrap",transition:"all 0.18s",fontFamily:"inherit",
                background: tab===t.id ? PALETTE.bg : "transparent",
                color:       tab===t.id ? navy        : "rgba(255,255,255,0.65)",
                borderBottom: tab===t.id ? `3px solid ${gold}` : "3px solid transparent"}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════ FILTERS BAR ══════════ */}
      <div style={{background:"#fff",borderBottom:`1px solid ${PALETTE.border}`,
        padding:"12px 24px",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",
        position:"sticky",top:130,zIndex:400,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
        <input placeholder="🔍  Search by title, department, faculty…" value={fQ}
          onChange={e=>setFQ(e.target.value)}
          style={{...inp,width:280,flex:"0 0 auto",
            boxShadow:`inset 0 1px 3px rgba(0,0,0,0.06)`}} />
        {[
          [fYear,setFYear,"All Years",    ACADEMIC_YEARS],
          [fDept,setFDept,"All Departments",DEPARTMENTS],
          [fType,setFType,"All Types",    ACTIVITY_TYPES],
          [fLvl, setFLvl, "All Levels",  LEVELS],
        ].map(([val,setter,placeholder,opts],i)=>(
          <select key={i} value={val} onChange={e=>setter(e.target.value)}
            style={{...sel,width:i===1?185:155,flex:"0 0 auto"}}>
            <option value="All">{placeholder}</option>
            {opts.map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
        <span style={{marginLeft:"auto",fontSize:12.5,color:PALETTE.muted,fontWeight:600}}>
          Showing <strong style={{color:navy}}>{filtered.length}</strong> of {acts.length} activities
        </span>
      </div>

      {/* ══════════ BODY ══════════ */}
      <div style={{padding:"24px",maxWidth:1440,margin:"0 auto"}}>

        {/* ─── OVERVIEW ─── */}
        {tab==="overview" && (
          <div>
            {/* KPIs */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",
              gap:14,marginBottom:22}}>
              <KPI icon="🎯" label="Total Activities"    value={fmt(filtered.length)} sub={`${acts.length} all-time`}  accent={navy}    />
              <KPI icon="👩‍🎓" label="Total Participants"  value={fmt(totalP)}          sub="Students & Staff"          accent={gold}    />
              <KPI icon="👩‍🏫" label="Faculty Involved"    value={fmt(totalF)}          sub="Across departments"        accent={crimson} />
              <KPI icon="🏛️" label="Depts Active"        value={new Set(filtered.map(a=>a.department)).size} sub={`of ${DEPARTMENTS.length-1} departments`} accent={PALETTE.green}  />
              <KPI icon="🌐" label="National / Intl"     value={natIntl}              sub="Outreach events"           accent={PALETTE.teal}  />
              <KPI icon="📚" label="Activity Types Used" value={new Set(filtered.map(a=>a.type)).size} sub="Diverse categories" accent={PALETTE.purple} />
            </div>

            {/* Charts row 1 */}
            <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18,marginBottom:18}}>
              <Card>
                <SectionTitle sub="Monthly count of activities across the filtered period">Monthly Activity Trend</SectionTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart data={monthly()}>
                    <defs>
                      <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={gold}  stopOpacity={0.28}/>
                        <stop offset="95%" stopColor={gold}  stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="ang" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={navy}  stopOpacity={0.18}/>
                        <stop offset="95%" stopColor={navy}  stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                    <XAxis dataKey="month" tick={{fontSize:10}} />
                    <YAxis tick={{fontSize:10}} />
                    <Tooltip contentStyle={{borderRadius:8,fontSize:12,border:`1px solid ${PALETTE.border}`}}/>
                    <Legend />
                    <Area type="monotone" dataKey="count"        stroke={gold} strokeWidth={2.5} fill="url(#ag)"  name="Activities"/>
                    <Area type="monotone" dataKey="participants"  stroke={navy} strokeWidth={2}   fill="url(#ang)" name="Participants"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle sub="Distribution by geographic level">Level Distribution</SectionTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={byLevel} cx="50%" cy="50%" outerRadius={90} innerRadius={48}
                      dataKey="value"
                      label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}
                      labelLine fontSize={10}>
                      {byLevel.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Charts row 2 */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
              <Card>
                <SectionTitle sub="Top 8 activity categories">Activities by Type</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={byType.slice(0,8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                    <XAxis type="number" tick={{fontSize:10}}/>
                    <YAxis type="category" dataKey="name" tick={{fontSize:9.5}} width={140}/>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/>
                    <Bar dataKey="count" fill={gold} radius={[0,5,5,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle sub="Yearly growth of activities and student reach">Year-over-Year Growth</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={byYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                    <XAxis dataKey="year" tick={{fontSize:10}}/>
                    <YAxis yAxisId="l" tick={{fontSize:10}}/>
                    <YAxis yAxisId="r" orientation="right" tick={{fontSize:10}}/>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/>
                    <Legend />
                    <Bar yAxisId="l" dataKey="acts"         fill={navy} name="Activities"   radius={[4,4,0,0]}/>
                    <Bar yAxisId="r" dataKey="participants" fill={gold} name="Participants" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent 6 */}
            <Card>
              <SectionTitle sub="Click any row to view full details">Recent Activities</SectionTitle>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead>
                  <tr style={{background:"#F9F5EE"}}>
                    {["Title","Department","Type","Date","Level","Participants"].map(h=>(
                      <th key={h} style={{padding:"10px 14px",textAlign:"left",
                        color:navy,fontWeight:700,borderBottom:`2px solid ${gold}40`,
                        fontSize:12}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0,8).map((a,i)=>(
                    <tr key={a.id}
                      style={{background:i%2===0?"#fff":"#FDFBF7",cursor:"pointer",
                        transition:"background 0.12s"}}
                      onClick={()=>setShowView(a)}
                      onMouseEnter={e=>e.currentTarget.style.background="#FFF8E8"}
                      onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#FDFBF7"}>
                      <td style={{padding:"9px 14px",color:navy,fontWeight:600,maxWidth:240}}>
                        <span style={{color:gold,marginRight:4}}>›</span>{a.title}
                      </td>
                      <td style={{padding:"9px 14px",color:"#374151"}}>{a.department}</td>
                      <td style={{padding:"9px 14px"}}><Badge label={a.type.split("/")[0].trim()} color={gold}/></td>
                      <td style={{padding:"9px 14px",color:PALETTE.muted}}>{a.date}</td>
                      <td style={{padding:"9px 14px"}}>
                        <Badge label={a.level}
                          color={a.level==="National"||a.level==="International"?PALETTE.green:PALETTE.teal}/>
                      </td>
                      <td style={{padding:"9px 14px",fontWeight:800,color:crimson}}>{fmt(a.participants)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ─── SUBMIT ACTIVITY (Google Forms Integration) ─── */}
        {tab==="submit" && (
          <div style={{maxWidth:820,margin:"0 auto"}}>
            {/* Hero */}
            <div style={{background:`linear-gradient(135deg,${navy},#0D2035)`,
              borderRadius:16,padding:32,color:"#fff",marginBottom:24,
              display:"flex",alignItems:"center",gap:24}}>
              <div style={{fontSize:56}}>📤</div>
              <div>
                <h2 style={{margin:"0 0 8px",fontFamily:"'Playfair Display',serif",fontSize:24}}>
                  Submit Activity to IQAC
                </h2>
                <p style={{margin:0,opacity:.85,fontSize:14,lineHeight:1.7}}>
                  Every faculty member submits their activity using the Google Form below.
                  Data is auto-collected in a Google Sheet and imported into this dashboard by the IQAC Coordinator.
                </p>
              </div>
            </div>

            {/* HOW IT WORKS */}
            <Card style={{marginBottom:20}}>
              <SectionTitle>How the Submission System Works</SectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
                {[
                  {step:"1",icon:"👩‍🏫",title:"Faculty fills Form",desc:"Each faculty submits their activity via the Google Form link"},
                  {step:"2",icon:"📊",title:"Auto-saved to Sheet",desc:"All responses land instantly in the college Google Sheet"},
                  {step:"3",icon:"📥",title:"IQAC exports CSV",desc:"Coordinator downloads CSV from Sheet at end of each month"},
                  {step:"4",icon:"📊",title:"Import to Dashboard",desc:"Paste CSV in 'Import CSV' button — data appears instantly"},
                ].map(({step,icon,title,desc})=>(
                  <div key={step} style={{textAlign:"center",padding:16,
                    background:"#F9F5EE",borderRadius:12,border:`1px solid ${PALETTE.border}`}}>
                    <div style={{width:32,height:32,borderRadius:"50%",
                      background:gold,color:navy,fontWeight:800,fontSize:15,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      margin:"0 auto 10px"}}>
                      {step}
                    </div>
                    <div style={{fontSize:24,marginBottom:6}}>{icon}</div>
                    <div style={{fontWeight:700,color:navy,fontSize:13,marginBottom:4}}>{title}</div>
                    <div style={{fontSize:12,color:PALETTE.muted,lineHeight:1.5}}>{desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* GOOGLE FORM BUTTON */}
            <Card style={{marginBottom:20,textAlign:"center",padding:40}}>
              <div style={{fontSize:48,marginBottom:12}}>📋</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",color:navy,
                margin:"0 0 8px",fontSize:20}}>
                Faculty Activity Submission Form
              </h3>
              <p style={{color:PALETTE.muted,fontSize:14,margin:"0 0 24px",lineHeight:1.6}}>
                Click the button below to open the Google Form.<br/>
                Share this link with all faculty members so they can submit their activities anytime.
              </p>
              <a href={cfg.googleFormURL} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",padding:"16px 40px",
                  background:`linear-gradient(135deg,${gold},#E9A820)`,
                  color:navy,borderRadius:12,fontWeight:800,fontSize:16,
                  textDecoration:"none",boxShadow:`0 4px 20px ${gold}40`,
                  fontFamily:"'Playfair Display',serif",letterSpacing:.3}}>
                📋 Open Faculty Submission Form
              </a>
              <p style={{marginTop:16,fontSize:11.5,color:PALETTE.muted}}>
                {cfg.googleFormURL === "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform"
                  ? "⚠️ Google Form URL not configured yet. Go to ⚙️ Settings → paste your form URL."
                  : `Form URL: ${cfg.googleFormURL}`}
              </p>
              <div style={{marginTop:20,padding:"14px 20px",background:"#F0F9FF",
                borderRadius:10,border:"1px solid #BAE6FD",textAlign:"left",fontSize:12.5}}>
                <strong style={{color:"#0369A1"}}>📌 Share this form with faculty:</strong>
                <br/>Copy the form URL from Settings and share via WhatsApp/Email/Notice Board.
                Each submission is automatically saved to your Google Sheet.
              </div>
            </Card>

            {/* GOOGLE SHEET FIELDS */}
            <Card style={{marginBottom:20}}>
              <SectionTitle sub="Create your Google Form with exactly these fields (in this order)">
                Required Google Form Fields
              </SectionTitle>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead>
                  <tr style={{background:"#F9F5EE"}}>
                    <th style={{padding:"9px 14px",textAlign:"left",color:navy,fontWeight:700,fontSize:12}}>#</th>
                    <th style={{padding:"9px 14px",textAlign:"left",color:navy,fontWeight:700,fontSize:12}}>Question Label (exact)</th>
                    <th style={{padding:"9px 14px",textAlign:"left",color:navy,fontWeight:700,fontSize:12}}>Field Type</th>
                    <th style={{padding:"9px 14px",textAlign:"left",color:navy,fontWeight:700,fontSize:12}}>Required?</th>
                    <th style={{padding:"9px 14px",textAlign:"left",color:navy,fontWeight:700,fontSize:12}}>Options / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1","Faculty Name",         "Short answer",  "✅ Yes","Full name of submitting faculty"],
                    ["2","Department",            "Dropdown",      "✅ Yes","All 17 departments pre-filled"],
                    ["3","Activity Title",        "Short answer",  "✅ Yes","Full title of activity"],
                    ["4","Activity Type",         "Dropdown",      "✅ Yes","All 19 types from this dashboard"],
                    ["5","Date",                  "Date",          "✅ Yes","Date of activity"],
                    ["6","Academic Year",         "Dropdown",      "✅ Yes","2023-24, 2024-25, 2025-26"],
                    ["7","Level",                 "Dropdown",      "✅ Yes","Institution / State / National / International"],
                    ["8","No. of Participants",   "Short answer",  "✅ Yes","Number only (students attended)"],
                    ["9","No. of Faculty",        "Short answer",  "✅ Yes","Number of faculty involved"],
                    ["10","Description",          "Paragraph",     "⬜ No", "Brief description of activity"],
                    ["11","Outcome / Impact",     "Paragraph",     "⬜ No", "What was achieved"],
                    ["12","Supporting Document",  "File upload",   "⬜ No", "Photo, report, certificate (optional)"],
                  ].map(([n,label,type,req,note])=>(
                    <tr key={n} style={{background:+n%2===0?"#FDFBF7":"#fff",borderBottom:`1px solid ${PALETTE.border}`}}>
                      <td style={{padding:"8px 14px",color:PALETTE.muted,fontWeight:700}}>{n}</td>
                      <td style={{padding:"8px 14px",fontWeight:700,color:navy,fontFamily:"monospace",fontSize:12.5}}>{label}</td>
                      <td style={{padding:"8px 14px",color:"#374151"}}>{type}</td>
                      <td style={{padding:"8px 14px"}}>{req}</td>
                      <td style={{padding:"8px 14px",color:PALETTE.muted,fontSize:12}}>{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{marginTop:14,padding:"12px 16px",background:"#FEF9EC",
                borderRadius:8,border:`1px solid ${gold}40`,fontSize:12.5,color:"#92400E"}}>
                <strong>⚠️ Important:</strong> The column headers in Google Sheets must exactly match the question labels above
                so that CSV import works correctly in this dashboard.
              </div>
            </Card>

            {/* SHARE TEMPLATE */}
            <Card>
              <SectionTitle sub="Copy and send this to all faculty via WhatsApp / Email">WhatsApp / Email Template for Faculty</SectionTitle>
              <div style={{background:"#F0FDF4",border:`1px solid #86EFAC`,borderRadius:10,
                padding:18,fontSize:13.5,lineHeight:2,fontFamily:"monospace",
                whiteSpace:"pre-wrap",color:"#14532D",position:"relative"}}>
{`📢 IQAC – Activity Submission Request

Dear Faculty,

Please submit your departmental activities using the link below.
Each activity should be submitted separately.

🔗 Activity Form: ${cfg.googleFormURL}

✅ Submit after EVERY activity (don't wait for month-end)
✅ Fill all mandatory fields
✅ Attach photo/report if available

For queries, contact:
IQAC Coordinator – ${cfg.iqacCoordinator}

– ${cfg.principal}
  Principal, ${cfg.name}`}
              </div>
            </Card>
          </div>
        )}

        {/* ─── ACTIVITY REGISTER ─── */}
        {tab==="register" && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <h2 style={{margin:0,fontSize:18,fontFamily:"'Playfair Display',serif",color:navy,flex:1}}>
                📋 Activity Register — {filtered.length} Records
              </h2>
              <button onClick={()=>setShowCSV(true)}
                style={{padding:"8px 16px",border:`1.5px solid ${PALETTE.border}`,borderRadius:8,
                  background:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,color:navy}}>
                📥 Import CSV
              </button>
              <button onClick={()=>{setForm(blank);setFormErr({});setShowAdd(true);}}
                style={{padding:"8px 18px",border:"none",borderRadius:8,
                  background:`linear-gradient(135deg,${gold},#E9A820)`,
                  color:navy,cursor:"pointer",fontSize:13,fontWeight:800}}>
                + Add Manually
              </button>
            </div>
            <Card style={{padding:0,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
                  <thead>
                    <tr style={{background:`linear-gradient(135deg,${navy},#0D2035)`,color:"#fff"}}>
                      {["#","Faculty","Title","Department","Type","Date","Yr","Level","👥","👩‍🏫","Actions"].map(h=>(
                        <th key={h} style={{padding:"11px 13px",textAlign:"left",
                          fontWeight:700,fontSize:11.5,whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a,i)=>(
                      <tr key={a.id}
                        style={{background:i%2===0?"#fff":"#FDFBF7",
                          borderBottom:`1px solid ${PALETTE.border}`,
                          transition:"background .12s",cursor:"pointer"}}
                        onMouseEnter={e=>e.currentTarget.style.background="#FFF8E8"}
                        onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#FDFBF7"}>
                        <td style={{padding:"9px 13px",color:PALETTE.muted,fontWeight:600}}>{i+1}</td>
                        <td style={{padding:"9px 13px",color:"#374151",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.faculty}</td>
                        <td style={{padding:"9px 13px",color:navy,fontWeight:600,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}}
                          onClick={()=>setShowView(a)}>
                          <span style={{color:gold}}>›</span> {a.title}
                        </td>
                        <td style={{padding:"9px 13px",whiteSpace:"nowrap"}}>{a.department}</td>
                        <td style={{padding:"9px 13px"}}>
                          <Badge label={a.type.split("/")[0].trim()} color={gold}/>
                        </td>
                        <td style={{padding:"9px 13px",color:PALETTE.muted,whiteSpace:"nowrap"}}>{a.date}</td>
                        <td style={{padding:"9px 13px",fontWeight:600,whiteSpace:"nowrap"}}>{a.academicYear}</td>
                        <td style={{padding:"9px 13px"}}>
                          <Badge label={a.level}
                            color={a.level==="National"||a.level==="International"?PALETTE.green:PALETTE.teal}/>
                        </td>
                        <td style={{padding:"9px 13px",fontWeight:800,color:crimson,textAlign:"right"}}>{fmt(a.participants)}</td>
                        <td style={{padding:"9px 13px",textAlign:"right",color:"#374151"}}>{fmt(a.facultyCount)}</td>
                        <td style={{padding:"9px 13px"}}>
                          <div style={{display:"flex",gap:5}}>
                            <button onClick={()=>setShowView(a)}
                              style={{padding:"3px 8px",background:"#EFF6FF",color:"#1D4ED8",
                                border:"1px solid #BFDBFE",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600}}>
                              View
                            </button>
                            <button onClick={()=>{setForm({...a,participants:String(a.participants),facultyCount:String(a.facultyCount)});setFormErr({});setShowEdit(a);}}
                              style={{padding:"3px 8px",background:`${gold}18`,color:gold,
                                border:`1px solid ${gold}40`,borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600}}>
                              Edit
                            </button>
                            <button onClick={()=>handleDelete(a.id)}
                              style={{padding:"3px 8px",background:"#FEE2E2",color:"#EF4444",
                                border:"1px solid #FECACA",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600}}>
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length===0 && (
                      <tr><td colSpan={11} style={{padding:40,textAlign:"center",color:PALETTE.muted,fontSize:14}}>
                        No activities match the current filters.
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ─── ANALYTICS ─── */}
        {tab==="analytics" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
              <Card>
                <SectionTitle sub="Year-wise comparison of activities and participants">Year-over-Year Trends</SectionTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={byYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                    <XAxis dataKey="year" tick={{fontSize:11}}/>
                    <YAxis yAxisId="l" tick={{fontSize:10}}/>
                    <YAxis yAxisId="r" orientation="right" tick={{fontSize:10}}/>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/>
                    <Legend/>
                    <Bar yAxisId="l" dataKey="acts"         fill={navy} name="Activities"   radius={[4,4,0,0]}/>
                    <Bar yAxisId="r" dataKey="participants" fill={gold} name="Participants" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle sub="Share of each activity category">Type-wise Breakdown</SectionTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={byType} cx="50%" cy="50%" innerRadius={55} outerRadius={100}
                      dataKey="count"
                      label={({name,count})=>count>1?name.split("/")[0].trim().slice(0,14):""}>
                      {byType.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius:8,fontSize:12}}
                      formatter={(v,n,p)=>[v,p.payload.name]}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card style={{marginBottom:18}}>
              <SectionTitle sub="Top 10 most active departments">Department Activity Count</SectionTitle>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={byDept} margin={{bottom:40}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                  <XAxis dataKey="name" tick={{fontSize:9.5,angle:-28,textAnchor:"end"}} interval={0}/>
                  <YAxis tick={{fontSize:10}}/>
                  <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/>
                  <Bar dataKey="count" radius={[5,5,0,0]}>
                    {byDept.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <SectionTitle sub="Detailed breakdown of each activity type">Activity Type Summary Table</SectionTitle>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead>
                  <tr style={{background:"#F9F5EE"}}>
                    {["Activity Type","Count","Total Participants","Total Faculty","Avg Participants","Nat/Intl"].map(h=>(
                      <th key={h} style={{padding:"10px 14px",textAlign: h==="Activity Type"?"left":"right",
                        color:navy,fontWeight:700,fontSize:12}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ACTIVITY_TYPES.map((type,i)=>{
                    const a=filtered.filter(x=>x.type===type);
                    if(!a.length) return null;
                    const tp=a.reduce((s,x)=>s+(+x.participants||0),0);
                    const tf=a.reduce((s,x)=>s+(+x.facultyCount||0),0);
                    const ni=a.filter(x=>x.level==="National"||x.level==="International").length;
                    return (
                      <tr key={type} style={{background:i%2===0?"#fff":"#FDFBF7",
                        borderBottom:`1px solid ${PALETTE.border}`}}>
                        <td style={{padding:"9px 14px",fontWeight:600}}>{type}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:800,color:navy}}>{a.length}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:700,color:crimson}}>{fmt(tp)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right"}}>{fmt(tf)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:PALETTE.muted}}>{Math.round(tp/a.length)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right"}}>
                          {ni>0 && <Badge label={ni} color={PALETTE.green}/>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ─── DEPARTMENTS ─── */}
        {tab==="departments" && (
          <div>
            <h2 style={{margin:"0 0 20px",fontSize:18,fontFamily:"'Playfair Display',serif",color:navy}}>
              🏛️ Department-wise Activity Summary
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:16}}>
              {DEPARTMENTS.filter(d=>d!=="IQAC").map((dept,idx)=>{
                const da=filtered.filter(a=>a.department===dept);
                if(!da.length) return (
                  <div key={dept} style={{background:"#fff",borderRadius:12,padding:18,
                    border:`1px dashed ${PALETTE.border}`,opacity:.55,
                    borderLeft:`4px solid ${PALETTE.border}`}}>
                    <div style={{fontWeight:700,color:PALETTE.muted,fontSize:14}}>{dept}</div>
                    <div style={{fontSize:12,color:PALETTE.muted,marginTop:4}}>No activities in current filter</div>
                  </div>
                );
                const parts=da.reduce((s,a)=>s+(+a.participants||0),0);
                const ni=da.filter(a=>a.level==="National"||a.level==="International").length;
                const types=[...new Set(da.map(a=>a.type))];
                const acc=PIE_COLORS[idx%PIE_COLORS.length];
                return (
                  <div key={dept} style={{background:"#fff",borderRadius:12,padding:20,
                    boxShadow:"0 2px 10px rgba(0,0,0,0.06)",
                    border:`1px solid ${PALETTE.border}`,borderLeft:`4px solid ${acc}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",
                      alignItems:"flex-start",marginBottom:12}}>
                      <h3 style={{margin:0,fontSize:14.5,fontFamily:"'Playfair Display',serif",
                        color:navy,lineHeight:1.3}}>{dept}</h3>
                      <Badge label={`${da.length} activities`} color={acc}/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                      {[
                        ["Participants",fmt(parts),crimson],
                        ["Nat/Intl",ni,PALETTE.green],
                        ["Types",types.length,PALETTE.teal],
                      ].map(([l,v,c])=>(
                        <div key={l} style={{background:"#F9F5EE",borderRadius:8,padding:"8px 10px"}}>
                          <div style={{fontSize:10.5,color:PALETTE.muted}}>{l}</div>
                          <div style={{fontSize:20,fontWeight:800,color:c,
                            fontFamily:"'Playfair Display',serif"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                      {types.slice(0,3).map(t=>(
                        <Badge key={t} label={t.split("/")[0].trim().slice(0,16)} color={acc}/>
                      ))}
                      {types.length>3 && <span style={{color:PALETTE.muted,fontSize:11,padding:"3px 4px"}}>+{types.length-3} more</span>}
                    </div>
                    <div style={{fontSize:11,color:PALETTE.muted,borderTop:`1px solid ${PALETTE.border}`,
                      paddingTop:8}}>
                      Latest: {da.sort((a,b)=>b.date>a.date?1:-1)[0]?.title?.slice(0,50)}…
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── YEAR WISE ─── */}
        {tab==="yearwise" && (
          <div>
            <h2 style={{margin:"0 0 20px",fontSize:18,fontFamily:"'Playfair Display',serif",color:navy}}>
              📅 Academic Year-wise Activity Report
            </h2>
            {ACADEMIC_YEARS.slice().reverse().map(yr=>{
              const ya=acts.filter(a=>a.academicYear===yr);
              if(!ya.length) return null;
              const yp=ya.reduce((s,a)=>s+(+a.participants||0),0);
              const yn=ya.filter(a=>a.level==="National"||a.level==="International").length;
              const ytypes=Object.entries(ya.reduce((acc,a)=>{acc[a.type]=(acc[a.type]||0)+1;return acc;},{}));
              return (
                <Card key={yr} style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,
                    paddingBottom:14,borderBottom:`2px solid ${gold}30`,flexWrap:"wrap"}}>
                    <h3 style={{margin:0,fontSize:20,fontFamily:"'Playfair Display',serif",color:navy}}>
                      Academic Year {yr}
                    </h3>
                    <Badge label={`${ya.length} Activities`}      color={navy}/>
                    <Badge label={`${fmt(yp)} Participants`}      color={gold}/>
                    <Badge label={`${yn} National/Intl`}          color={PALETTE.green}/>
                    <Badge label={`${new Set(ya.map(a=>a.department)).size} Departments`} color={PALETTE.teal}/>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
                    {ytypes.map(([type,count])=>(
                      <span key={type} style={{background:"#F9F5EE",border:`1px solid ${PALETTE.border}`,
                        padding:"4px 12px",borderRadius:20,fontSize:12,color:"#374151"}}>
                        <strong>{count}</strong> {type}
                      </span>
                    ))}
                  </div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
                      <thead>
                        <tr style={{background:"#F9F5EE"}}>
                          {["Faculty","Title","Dept","Type","Date","Level","👥"].map(h=>(
                            <th key={h} style={{padding:"8px 12px",textAlign:"left",
                              color:navy,fontWeight:700,fontSize:11.5}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ya.sort((a,b)=>b.date>a.date?1:-1).map((a,i)=>(
                          <tr key={a.id}
                            style={{background:i%2===0?"#fff":"#FDFBF7",
                              borderBottom:`1px solid ${PALETTE.border}`,cursor:"pointer"}}
                            onClick={()=>setShowView(a)}>
                            <td style={{padding:"8px 12px",color:"#374151",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.faculty}</td>
                            <td style={{padding:"8px 12px",color:navy,fontWeight:600,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</td>
                            <td style={{padding:"8px 12px",whiteSpace:"nowrap"}}>{a.department}</td>
                            <td style={{padding:"8px 12px"}}><Badge label={a.type.split("/")[0].trim().slice(0,18)} color={gold}/></td>
                            <td style={{padding:"8px 12px",color:PALETTE.muted,whiteSpace:"nowrap"}}>{a.date}</td>
                            <td style={{padding:"8px 12px"}}><Badge label={a.level} color={a.level==="National"||a.level==="International"?PALETTE.green:PALETTE.teal}/></td>
                            <td style={{padding:"8px 12px",fontWeight:800,color:crimson}}>{fmt(a.participants)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ─── NAAC SNAPSHOT ─── */}
        {tab==="naac" && (
          <div>
            <div style={{background:`linear-gradient(135deg,${navy},#0D2035)`,
              color:"#fff",borderRadius:16,padding:28,marginBottom:24,
              display:"flex",alignItems:"center",gap:20}}>
              <div style={{fontSize:52}}>🏆</div>
              <div>
                <h2 style={{margin:0,fontFamily:"'Playfair Display',serif",fontSize:22}}>
                  NAAC Quality Snapshot — 2023-24
                </h2>
                <p style={{margin:"6px 0 0",opacity:.8,fontSize:13.5,lineHeight:1.6}}>
                  {cfg.name}<br/>
                  NAAC Grade <strong style={{color:gold}}>{cfg.naacGrade}</strong> ({cfg.naacScore}) ·
                  Valid till <strong style={{color:gold}}>{cfg.naacValidity}</strong> ·
                  UGC Autonomous since 14/10/2024
                </p>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
              {[
                {v:"1,689",l:"Total Students",     i:"👩‍🎓",a:navy},
                {v:"16",   l:"Programmes",          i:"📚",a:gold},
                {v:"57",   l:"Full-time Teachers",  i:"👩‍🏫",a:crimson},
                {v:"23",   l:"PhD Holders",         i:"🎓",a:PALETTE.green},
                {v:"632",  l:"Final Year Passed",   i:"✅",a:PALETTE.teal},
                {v:"169",  l:"Placements",          i:"💼",a:PALETTE.purple},
                {v:"118",  l:"Higher Education",    i:"🏛️",a:navy},
                {v:"1,363",l:"Scholarship Holders", i:"🎁",a:gold},
                {v:"324",  l:"Total Courses",       i:"📖",a:crimson},
                {v:"99",   l:"New Courses Added",   i:"✨",a:PALETTE.green},
                {v:"8",    l:"Functional MoUs",     i:"🤝",a:PALETTE.teal},
                {v:"61",   l:"Extension Progs",     i:"🌍",a:PALETTE.purple},
              ].map(({v,l,i,a})=>(
                <div key={l} style={{background:"#fff",borderRadius:12,padding:"16px 18px",
                  boxShadow:"0 2px 10px rgba(0,0,0,0.06)",
                  border:`1px solid ${PALETTE.border}`,borderLeft:`4px solid ${a}`,
                  display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:26}}>{i}</span>
                  <div>
                    <div style={{fontSize:24,fontWeight:800,
                      fontFamily:"'Playfair Display',serif",color:navy,lineHeight:1}}>{v}</div>
                    <div style={{fontSize:11.5,color:PALETTE.muted,fontWeight:600}}>{l}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
              <Card>
                <SectionTitle>Accreditation History</SectionTitle>
                <table style={{width:"100%",fontSize:13.5,borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"#F9F5EE"}}>
                      {["Cycle","Grade","CGPA","Year","Validity"].map(h=>(
                        <th key={h} style={{padding:"9px 12px",textAlign:"left",color:navy,fontWeight:700,fontSize:12}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Cycle 1","B+","78.10","2006","2006–2011"],
                      ["Cycle 2","B", "2.33", "2014","2014–2022"],
                      ["Cycle 3","B", "2.46", "2023","2023–2028"],
                    ].map(([c,g,s,y,v],i)=>(
                      <tr key={c} style={{background:i%2===0?"#fff":"#FDFBF7",borderBottom:`1px solid ${PALETTE.border}`}}>
                        <td style={{padding:"9px 12px",fontWeight:600}}>{c}</td>
                        <td style={{padding:"9px 12px"}}><Badge label={g} color={gold}/></td>
                        <td style={{padding:"9px 12px",fontWeight:700,color:crimson}}>{s}</td>
                        <td style={{padding:"9px 12px"}}>{y}</td>
                        <td style={{padding:"9px 12px",color:PALETTE.muted,fontSize:12}}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <Card>
                <SectionTitle>IQAC Key Metrics 2023-24</SectionTitle>
                {[
                  ["IQAC Meetings Held","6"],
                  ["Value-Added Courses","22"],
                  ["Students in VAC","740"],
                  ["All Students on Internships","1,689"],
                  ["Sports & Cultural Events","33"],
                  ["Extension Outreach Progs","61"],
                  ["Awards Received","2"],
                  ["UGC CARE Research Papers","9"],
                  ["Books / Chapters Published","24"],
                  ["Scopus Citations","40"],
                  ["h-Index (Scopus)","5"],
                  ["Days – Exam to Result","22"],
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",
                    padding:"6px 0",borderBottom:`1px solid ${PALETTE.border}`,fontSize:13}}>
                    <span style={{color:"#374151"}}>✅ {k}</span>
                    <span style={{fontWeight:800,color:navy}}>{v}</span>
                  </div>
                ))}
              </Card>
            </div>

            {/* Criteria coverage from live data */}
            <Card>
              <SectionTitle sub="Live count of activities supporting each NAAC criterion">NAAC Criteria Coverage — Live from Activity Register</SectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                {[
                  {crit:"C1 – Curricular",   color:navy,   types:["Workshop / Seminar","Certificate Course","Induction Programme","NAAC / NIRF Activity"]},
                  {crit:"C2 – Teaching",      color:gold,   types:["Guest Lecture","Faculty Development Programme","Skill Development","Career Guidance"]},
                  {crit:"C3 – Research",      color:PALETTE.purple, types:["Research Publication","Webinar","Industry / Educational Visit"]},
                  {crit:"C3 – Extension",     color:PALETTE.green,  types:["NSS / NCC Activity","Community Service Project","Extension Activity"]},
                  {crit:"C5 – Student",       color:PALETTE.teal,   types:["Placement Drive","Alumni Activity","Sports / Cultural Event"]},
                  {crit:"C7 – Values",        color:crimson,        types:["Gender Awareness","Environmental Activity","Sports / Cultural Event"]},
                ].map(({crit,color,types})=>{
                  const cnt=acts.filter(a=>types.includes(a.type)).length;
                  return (
                    <div key={crit} style={{background:`${color}08`,
                      border:`2px solid ${color}25`,borderRadius:12,padding:18}}>
                      <div style={{fontWeight:700,color,fontSize:13.5,marginBottom:6}}>{crit}</div>
                      <div style={{fontSize:32,fontWeight:800,color,
                        fontFamily:"'Playfair Display',serif",lineHeight:1}}>{cnt}</div>
                      <div style={{fontSize:11.5,color:PALETTE.muted,marginTop:4}}>supporting activities</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ─── SETUP GUIDE ─── */}
        {tab==="setup" && (
          <div style={{maxWidth:820,margin:"0 auto"}}>
            <div style={{background:`linear-gradient(135deg,${navy},#0D2035)`,
              borderRadius:16,padding:28,color:"#fff",marginBottom:24,
              display:"flex",alignItems:"center",gap:20}}>
              <div style={{fontSize:48}}>⚙️</div>
              <div>
                <h2 style={{margin:0,fontFamily:"'Playfair Display',serif",fontSize:22}}>
                  Complete Setup Guide
                </h2>
                <p style={{margin:"6px 0 0",opacity:.8,fontSize:14}}>
                  Set up your Google Form → Sheet → Dashboard pipeline in 15 minutes. Completely free.
                </p>
              </div>
            </div>

            {[
              {
                n:"1", icon:"📋", title:"Create Google Form",
                steps:[
                  "Go to forms.google.com → Click '+' to create a new form",
                  "Title: 'IQAC Activity Submission – SKR & SKR GCW Kadapa'",
                  "Add all 12 fields exactly as listed in the 'Submit Activity' tab",
                  "For Department & Activity Type fields: use Dropdown with all options pre-filled",
                  "Enable 'Collect email addresses' (optional – for tracking who submitted)",
                  "Click the settings gear → enable 'Limit to 1 response' if needed",
                ]
              },
              {
                n:"2", icon:"📊", title:"Link to Google Sheet",
                steps:[
                  "In the Google Form, click the 'Responses' tab at the top",
                  "Click the green Sheets icon (Create Spreadsheet)",
                  "Name the sheet: 'IQAC Activities 2024-25'",
                  "All future form submissions will instantly appear as new rows",
                  "Share the Sheet with yourself and principal with 'Editor' access",
                ]
              },
              {
                n:"3", icon:"🔗", title:"Configure Dashboard Settings",
                steps:[
                  "Click ⚙️ Settings button in the top-right of this dashboard",
                  "Paste your Google Form URL (share link) in the 'Google Form URL' field",
                  "Save settings – the Submit Activity tab button will now point to your form",
                  "Share the Dashboard URL with HODs and Principal for viewing",
                ]
              },
              {
                n:"4", icon:"👩‍🏫", title:"Share Form with All Faculty",
                steps:[
                  "In Google Form, click 'Send' → copy the link (shorten it with bit.ly if needed)",
                  "Go to Submit Activity tab → copy the WhatsApp message template",
                  "Send via department WhatsApp groups, email, or display on notice board",
                  "Each faculty submits after every activity – takes only 2 minutes",
                ]
              },
              {
                n:"5", icon:"📥", title:"Monthly CSV Import to Dashboard",
                steps:[
                  "Open the Google Sheet → File → Download → Comma-Separated Values (.csv)",
                  "In this dashboard, click '📥 Import CSV' button (top right)",
                  "Paste the CSV content and click Import – data appears instantly",
                  "Do this once per month or before any NAAC presentation",
                  "All imported data is saved permanently in dashboard storage",
                ]
              },
              {
                n:"6", icon:"🏆", title:"Use for NAAC / IQAC Presentations",
                steps:[
                  "Use the Analytics tab for criterion-wise graphs and infographics",
                  "Use NAAC Snapshot tab for ready-made Quality Snapshot slides",
                  "Use Year Wise tab for academic year reports",
                  "Filter by department for HOD-wise presentations",
                  "All data persists in browser – no server or login needed",
                ]
              },
            ].map(({n,icon,title,steps})=>(
              <Card key={n} style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:18}}>
                  <div style={{width:44,height:44,borderRadius:"50%",
                    background:`linear-gradient(135deg,${gold},#E9A820)`,
                    color:navy,fontWeight:800,fontSize:18,flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    boxShadow:`0 2px 10px ${gold}40`}}>{n}</div>
                  <div style={{flex:1}}>
                    <h3 style={{margin:"0 0 12px",fontFamily:"'Playfair Display',serif",
                      color:navy,fontSize:17}}>
                      {icon} {title}
                    </h3>
                    <ol style={{margin:0,paddingLeft:20,color:"#374151",fontSize:13.5,lineHeight:2}}>
                      {steps.map((s,i)=><li key={i}>{s}</li>)}
                    </ol>
                  </div>
                </div>
              </Card>
            ))}

            <Card style={{background:`${gold}10`,border:`1.5px solid ${gold}40`}}>
              <h3 style={{margin:"0 0 12px",fontFamily:"'Playfair Display',serif",color:navy,fontSize:16}}>
                💡 Pro Tips for NAAC Readiness
              </h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  "Keep form link pinned in all department WhatsApp groups",
                  "Remind faculty to submit within 3 days of each activity",
                  "Import CSV at end of every month – takes 2 minutes",
                  "Screenshot Analytics charts for IQAC meeting presentations",
                  "Use Department View to show HOD-wise contribution in Governing Body",
                  "NAAC Snapshot tab is ready to screen-share in NAAC presentations",
                  "Export Year Wise tab as PDF for AQAR documentation",
                  "Add scanned attendance sheets to Google Drive and link in description field",
                ].map((tip,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",
                    background:"#fff",padding:"10px 14px",borderRadius:8,
                    border:`1px solid ${PALETTE.border}`,fontSize:13}}>
                    <span style={{color:gold,fontWeight:800,flexShrink:0}}>→</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <div style={{background:`linear-gradient(135deg,${navy},#0D2035)`,
        color:"rgba(255,255,255,0.6)",textAlign:"center",
        padding:"18px 24px",marginTop:32,fontSize:12}}>
        <div style={{color:gold,fontWeight:700,fontSize:13,marginBottom:4}}>
          {cfg.name} — IQAC Activity & Quality Dashboard
        </div>
        <div style={{marginBottom:2}}>
          Developed by&nbsp;
          <span style={{color:"#E2C97E",fontWeight:700}}>{cfg.iqacCoordinator}</span>,
          &nbsp;IQAC Coordinator
        </div>
        <div>
          Principal:&nbsp;
          <span style={{color:"#E2C97E",fontWeight:700}}>{cfg.principal}</span>
        </div>
        <div style={{marginTop:6,fontSize:11,color:"rgba(255,255,255,0.35)"}}>
          © {new Date().getFullYear()} {cfg.name}. All rights reserved. | Data stored securely in browser storage.
        </div>
      </div>

      {/* ══════════ ADD / EDIT MODAL ══════════ */}
      {(showAdd||showEdit) && (
        <Overlay onClose={()=>{setShowAdd(false);setShowEdit(null);setForm(blank);setFormErr({});}}>
          <ModalTitle onClose={()=>{setShowAdd(false);setShowEdit(null);setForm(blank);setFormErr({});}}>
            {showEdit ? "✏️ Edit Activity Record" : "➕ Add Activity Manually"}
          </ModalTitle>
          <div style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:8,
            padding:"10px 14px",marginBottom:18,fontSize:12.5,color:"#0369A1"}}>
            💡 For bulk entry, ask faculty to use the Google Form (Submit Activity tab). This form is for IQAC coordinator direct entry.
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
            <div style={{gridColumn:"1/-1"}}>
              <FF label="Faculty / Staff Name" req hint="Who conducted this activity">
                <input value={form.faculty} onChange={e=>setForm({...form,faculty:e.target.value})} style={inp} placeholder="e.g. Dr. A. Padmavathi"/>
                {formErr.faculty && <div style={{color:"#ef4444",fontSize:11,marginTop:3}}>{formErr.faculty}</div>}
              </FF>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <FF label="Activity Title" req>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp} placeholder="Full title of the activity"/>
                {formErr.title && <div style={{color:"#ef4444",fontSize:11,marginTop:3}}>{formErr.title}</div>}
              </FF>
            </div>
            <FF label="Department" req>
              <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})} style={sel}>
                {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </FF>
            <FF label="Activity Type" req>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={sel}>
                {ACTIVITY_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </FF>
            <FF label="Date of Activity" req>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp}/>
              {formErr.date && <div style={{color:"#ef4444",fontSize:11,marginTop:3}}>{formErr.date}</div>}
            </FF>
            <FF label="Academic Year" req>
              <select value={form.academicYear} onChange={e=>setForm({...form,academicYear:e.target.value})} style={sel}>
                {ACADEMIC_YEARS.map(y=><option key={y}>{y}</option>)}
              </select>
            </FF>
            <FF label="Level" req>
              <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})} style={sel}>
                {LEVELS.map(l=><option key={l}>{l}</option>)}
              </select>
            </FF>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <FF label="No. of Participants (Students)" req>
                <input type="number" min="0" value={form.participants}
                  onChange={e=>setForm({...form,participants:e.target.value})} style={inp} placeholder="0"/>
                {formErr.participants && <div style={{color:"#ef4444",fontSize:11,marginTop:3}}>{formErr.participants}</div>}
              </FF>
              <FF label="No. of Faculty Involved" req>
                <input type="number" min="0" value={form.facultyCount}
                  onChange={e=>setForm({...form,facultyCount:e.target.value})} style={inp} placeholder="0"/>
              </FF>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <FF label="Description / Details">
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                  style={{...inp,height:76,resize:"vertical"}} placeholder="Brief description of the activity..."/>
              </FF>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <FF label="Outcomes / Impact Achieved">
                <textarea value={form.outcome} onChange={e=>setForm({...form,outcome:e.target.value})}
                  style={{...inp,height:64,resize:"vertical"}} placeholder="What was achieved or the impact of this activity..."/>
              </FF>
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <button onClick={()=>{setShowAdd(false);setShowEdit(null);setForm(blank);setFormErr({});}}
              style={{padding:"10px 22px",border:`1.5px solid ${PALETTE.border}`,borderRadius:8,
                background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13.5}}>
              Cancel
            </button>
            <button onClick={handleSave}
              style={{padding:"10px 28px",border:"none",borderRadius:8,
                background:`linear-gradient(135deg,${gold},#E9A820)`,
                color:navy,cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:13.5}}>
              {showEdit ? "Update Activity" : "Save Activity"}
            </button>
          </div>
        </Overlay>
      )}

      {/* ══════════ VIEW MODAL ══════════ */}
      {showView && (
        <Overlay onClose={()=>setShowView(null)}>
          <ModalTitle onClose={()=>setShowView(null)}>Activity Details</ModalTitle>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <Badge label={showView.type} color={gold}/>
            <Badge label={showView.level} color={showView.level==="National"||showView.level==="International"?PALETTE.green:PALETTE.teal}/>
            <Badge label={showView.academicYear} color={PALETTE.muted}/>
            <Badge label={ago(showView.submittedAt)} color={navy}/>
          </div>
          <h3 style={{margin:"0 0 16px",fontFamily:"'Playfair Display',serif",
            color:navy,fontSize:19,lineHeight:1.3}}>{showView.title}</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[
              ["Submitted by",showView.faculty],
              ["Department",  showView.department],
              ["Date",        showView.date],
              ["Level",       showView.level],
              ["Participants",fmt(showView.participants)],
              ["Faculty",     fmt(showView.facultyCount)],
            ].map(([k,v])=>(
              <div key={k} style={{background:"#F9F5EE",borderRadius:8,padding:"10px 14px"}}>
                <div style={{fontSize:11,color:PALETTE.muted,marginBottom:2}}>{k}</div>
                <div style={{fontWeight:700,color:navy,fontSize:14}}>{v}</div>
              </div>
            ))}
          </div>
          {showView.description && (
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:5}}>Description</div>
              <div style={{fontSize:13.5,color:"#374151",lineHeight:1.7,
                background:"#F9F5EE",padding:"12px 16px",borderRadius:8}}>{showView.description}</div>
            </div>
          )}
          {showView.outcome && (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:5}}>Outcomes / Impact</div>
              <div style={{fontSize:13.5,color:"#14532D",lineHeight:1.7,
                background:"#F0FDF4",padding:"12px 16px",borderRadius:8,
                borderLeft:`3px solid ${PALETTE.green}`}}>{showView.outcome}</div>
            </div>
          )}
          <div style={{display:"flex",gap:10,paddingTop:14,borderTop:`1px solid ${PALETTE.border}`}}>
            <button onClick={()=>{setShowView(null);setForm({...showView,participants:String(showView.participants),facultyCount:String(showView.facultyCount)});setFormErr({});setShowEdit(showView);}}
              style={{padding:"9px 18px",background:`${gold}18`,color:gold,
                border:`1px solid ${gold}40`,borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>
              Edit
            </button>
            <button onClick={()=>{handleDelete(showView.id);setShowView(null);}}
              style={{padding:"9px 18px",background:"#FEE2E2",color:"#EF4444",
                border:"1px solid #FECACA",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>
              Delete
            </button>
            <button onClick={()=>setShowView(null)}
              style={{padding:"9px 18px",border:`1.5px solid ${PALETTE.border}`,borderRadius:8,
                background:"#fff",cursor:"pointer",fontSize:13,marginLeft:"auto"}}>
              Close
            </button>
          </div>
        </Overlay>
      )}

      {/* ══════════ CSV IMPORT MODAL ══════════ */}
      {showCSV && (
        <Overlay onClose={()=>{setShowCSV(false);setCsvStatus("");}} wide>
          <ModalTitle onClose={()=>{setShowCSV(false);setCsvStatus("");}}>
            📥 Import Activities from Google Sheets CSV
          </ModalTitle>
          <div style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:8,
            padding:"12px 16px",marginBottom:16,fontSize:13,color:"#0369A1",lineHeight:1.7}}>
            <strong>How to get CSV:</strong><br/>
            1. Open your Google Sheet of responses → File → Download → CSV<br/>
            2. Open the downloaded CSV in Notepad / any text editor → Select All → Copy<br/>
            3. Paste the content in the box below → Click Import
          </div>
          <FF label="Paste CSV Content Here" req>
            <textarea value={csvText} onChange={e=>setCsvText(e.target.value)}
              style={{...inp,height:280,resize:"vertical",fontFamily:"monospace",fontSize:12}}
              placeholder={`Faculty Name,Department,Activity Title,Activity Type,Date,Academic Year,Level,No. of Participants,No. of Faculty,Description,Outcome / Impact\nDr. A. Padmavathi,Chemistry,Workshop on Green Chemistry,Workshop / Seminar,2024-08-15,2024-25,Institution,60,5,Workshop on green chemistry principles,Students learned about sustainable chemistry`}/>
          </FF>
          {csvStatus && (
            <div style={{padding:"10px 14px",borderRadius:8,marginBottom:12,fontSize:13,
              background: csvStatus.startsWith("✅") ? "#F0FDF4" : csvStatus.startsWith("❌") ? "#FEF2F2" : "#FFF9EB",
              color:       csvStatus.startsWith("✅") ? "#166534" : csvStatus.startsWith("❌") ? "#991B1B" : "#92400E",
              border:      `1px solid ${csvStatus.startsWith("✅") ? "#86EFAC" : csvStatus.startsWith("❌") ? "#FECACA" : "#FCD34D"}`}}>
              {csvStatus}
            </div>
          )}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button onClick={()=>{setShowCSV(false);setCsvStatus(""); setCsvText("");}}
              style={{padding:"10px 22px",border:`1.5px solid ${PALETTE.border}`,borderRadius:8,
                background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>
              Cancel
            </button>
            <button onClick={handleCSVImport} disabled={!csvText.trim()}
              style={{padding:"10px 28px",border:"none",borderRadius:8,
                background: csvText.trim() ? `linear-gradient(135deg,${gold},#E9A820)` : "#e5e7eb",
                color: csvText.trim() ? navy : "#9ca3af",
                cursor: csvText.trim() ? "pointer" : "not-allowed",
                fontWeight:800,fontFamily:"inherit",fontSize:13}}>
              Import Activities
            </button>
          </div>
        </Overlay>
      )}

      {/* ══════════ SETTINGS MODAL ══════════ */}
      {showCfg && (
        <Overlay onClose={()=>setShowCfg(false)}>
          <ModalTitle onClose={()=>setShowCfg(false)}>⚙️ Dashboard Settings</ModalTitle>
          <FF label="College Name">
            <input value={cfgForm.name} onChange={e=>setCfgForm({...cfgForm,name:e.target.value})} style={inp}/>
          </FF>
          <FF label="Principal's Name">
            <input value={cfgForm.principal} onChange={e=>setCfgForm({...cfgForm,principal:e.target.value})} style={inp}/>
          </FF>
          <FF label="IQAC Coordinator's Name">
            <input value={cfgForm.iqacCoordinator} onChange={e=>setCfgForm({...cfgForm,iqacCoordinator:e.target.value})} style={inp}/>
          </FF>
          <FF label="Google Form URL" hint="(paste the shareable form link)">
            <input value={cfgForm.googleFormURL} onChange={e=>setCfgForm({...cfgForm,googleFormURL:e.target.value})} style={inp} placeholder="https://docs.google.com/forms/d/e/..."/>
          </FF>
          <FF label="NAAC Grade">
            <input value={cfgForm.naacGrade} onChange={e=>setCfgForm({...cfgForm,naacGrade:e.target.value})} style={inp} placeholder="B"/>
          </FF>
          <FF label="NAAC Score / CGPA">
            <input value={cfgForm.naacScore} onChange={e=>setCfgForm({...cfgForm,naacScore:e.target.value})} style={inp} placeholder="2.46"/>
          </FF>
          <FF label="NAAC Validity Till">
            <input value={cfgForm.naacValidity} onChange={e=>setCfgForm({...cfgForm,naacValidity:e.target.value})} style={inp} placeholder="07/07/2028"/>
          </FF>
          <FF label="Year Established">
            <input value={cfgForm.established} onChange={e=>setCfgForm({...cfgForm,established:e.target.value})} style={inp} placeholder="1973"/>
          </FF>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
            <button onClick={()=>setShowCfg(false)}
              style={{padding:"10px 22px",border:`1.5px solid ${PALETTE.border}`,borderRadius:8,
                background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>
              Cancel
            </button>
            <button onClick={handleCfgSave}
              style={{padding:"10px 28px",border:"none",borderRadius:8,
                background:`linear-gradient(135deg,${gold},#E9A820)`,
                color:navy,cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:13}}>
              Save Settings
            </button>
          </div>
        </Overlay>
      )}
    </div>
  );
}
