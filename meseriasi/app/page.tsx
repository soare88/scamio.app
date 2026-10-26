"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BriefcaseBusiness, CalendarDays,
  Check, ChevronDown, CircleHelp, ClipboardList, Clock3, FileText, Filter,
  LayoutDashboard, Menu, Plus, Search, Settings2, Users, Wallet, X, MapPin,
  Phone, MoreHorizontal, Wrench, HardHat, TrendingUp
} from "lucide-react";

type Client = { id: number; name: string; phone: string; address: string; type: string };
type Job = { id: number; title: string; client: string; address: string; status: "În lucru" | "Programată" | "Finalizată"; date: string; price: number };

const initialClients: Client[] = [
  { id: 1, name: "Andrei Popescu", phone: "0722 123 456", address: "Sector 3, București", type: "Persoană fizică" },
  { id: 2, name: "SC Nord Construct SRL", phone: "0723 456 789", address: "Pipera, București", type: "Firmă" },
  { id: 3, name: "Maria Ionescu", phone: "0744 222 111", address: "Sector 1, București", type: "Persoană fizică" }
];

const initialJobs: Job[] = [
  { id: 1, title: "Înlocuire tablou electric", client: "Andrei Popescu", address: "Sector 3, București", status: "În lucru", date: "Astăzi, 10:00", price: 1250 },
  { id: 2, title: "Instalație iluminat LED", client: "SC Nord Construct SRL", address: "Pipera, București", status: "Programată", date: "Mâine, 09:30", price: 2800 },
  { id: 3, title: "Verificare prize și circuite", client: "Maria Ionescu", address: "Sector 1, București", status: "Finalizată", date: "Ieri, 14:00", price: 450 }
];

const money = (value: number) => new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(value);

export default function Home() {
  const [section, setSection] = useState<"overview" | "clients" | "jobs">("overview");
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobClient, setJobClient] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [jobPrice, setJobPrice] = useState("");
  const [notice, setNotice] = useState("");

  const filteredClients = useMemo(() => clients.filter(c => [c.name, c.phone, c.address].join(" ").toLowerCase().includes(search.toLowerCase())), [clients, search]);
  const filteredJobs = useMemo(() => jobs.filter(j => [j.title, j.client, j.address, j.status].join(" ").toLowerCase().includes(search.toLowerCase())), [jobs, search]);
  const activeJobs = jobs.filter(j => j.status !== "Finalizată").length;
  const revenue = jobs.filter(j => j.status === "Finalizată").reduce((sum, j) => sum + j.price, 0);

  function addClient(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim()) return;
    setClients(prev => [{ id: Date.now(), name: clientName.trim(), phone: clientPhone.trim() || "—", address: clientAddress.trim() || "Adresă necompletată", type: "Client nou" }, ...prev]);
    setClientName(""); setClientPhone(""); setClientAddress(""); setShowClientForm(false);
    setNotice("Client adăugat în prototip."); window.setTimeout(() => setNotice(""), 2800);
  }

  function addJob(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle.trim() || !jobClient.trim()) return;
    setJobs(prev => [{ id: Date.now(), title: jobTitle.trim(), client: jobClient.trim(), address: clients.find(c => c.name === jobClient)?.address || "Adresă de confirmat", status: "Programată", date: jobDate || "Data de stabilit", price: Number(jobPrice) || 0 }, ...prev]);
    setJobTitle(""); setJobClient(""); setJobDate(""); setJobPrice(""); setShowJobForm(false);
    setNotice("Lucrare adăugată în prototip."); window.setTimeout(() => setNotice(""), 2800);
  }

  const navItems = [
    { id: "overview" as const, label: "Panou general", icon: LayoutDashboard },
    { id: "clients" as const, label: "Clienți", icon: Users, count: clients.length },
    { id: "jobs" as const, label: "Lucrări", icon: BriefcaseBusiness, count: activeJobs }
  ];

  return (
    <div className="shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Wrench size={20} /></div><div><strong>scamio</strong><span>WORKSPACE</span></div><button className="icon-btn close-nav" onClick={() => setMobileNav(false)} aria-label="Închide meniul"><X size={18}/></button></div>
        <div className="workspace-switch"><div className="workspace-avatar">E</div><div className="workspace-text"><strong>Firma mea</strong><span>Plan de lucru · Demo</span></div><ChevronDown size={15}/></div>
        <div className="nav-label">MENIU PRINCIPAL</div>
        <nav className="nav-list">{navItems.map(item => <button key={item.id} onClick={() => {setSection(item.id); setSearch(""); setMobileNav(false);}} className={`nav-item ${section === item.id ? "selected" : ""}`}><item.icon size={18}/><span>{item.label}</span>{item.count !== undefined && <em>{item.count}</em>}</button>)}</nav>
        <div className="nav-label secondary-label">GESTIUNE</div>
        <button className="nav-item disabled-item" onClick={() => setNotice("Modulul Devize va fi adăugat în următoarea etapă.")}><FileText size={18}/><span>Devize și oferte</span><span className="soon">URMEAZĂ</span></button>
        <button className="nav-item disabled-item" onClick={() => setNotice("Modulul Încasări va fi adăugat în următoarea etapă.")}><Wallet size={18}/><span>Încasări</span><span className="soon">URMEAZĂ</span></button>
        <button className="nav-item disabled-item" onClick={() => setNotice("Calendarul va fi adăugat în următoarea etapă.")}><CalendarDays size={18}/><span>Calendar</span><span className="soon">URMEAZĂ</span></button>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><div><strong>Ai nevoie de ajutor?</strong><p>Ghid pentru prima configurare.</p><button onClick={() => setNotice("Ghidul va fi disponibil în versiunea următoare.")}>Vezi ghidul <span>↗</span></button></div></div><button className="nav-item settings" onClick={() => setNotice("Setările contului vor fi disponibile după implementarea autentificării.")}><Settings2 size={18}/><span>Setări</span></button><div className="user-card"><div className="user-avatar">M</div><div className="user-text"><strong>Mod demo</strong><span>Cont de prezentare</span></div><MoreHorizontal size={18}/></div></div>
      </aside>
      {mobileNav && <button className="scrim" aria-label="Închide meniul" onClick={() => setMobileNav(false)} />}
      <main className="main-area">
        <header className="topbar"><div className="topbar-left"><button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="Deschide meniul"><Menu size={20}/></button><div className="breadcrumbs">Spațiul meu <span>/</span> <strong>{navItems.find(i => i.id === section)?.label}</strong></div></div><div className="topbar-actions"><div className="status-pill"><span/> Toate sistemele funcționează</div><button className="icon-btn notification" aria-label="Notificări" onClick={() => setNotice("Nu ai notificări noi.")}><Bell size={18}/><i/></button><div className="top-avatar">M</div></div></header>
        <div className="page-content">
          <div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot"/> ORGANIZARE SIMPLĂ. LUCRĂRI SUB CONTROL.</div><h1>{section === "overview" ? "Bun venit în spațiul tău de lucru" : section === "clients" ? "Clienții tăi" : "Lucrările tale"}</h1><p>{section === "overview" ? "Tot ce ai nevoie pentru a-ți organiza activitatea, într-un singur loc." : section === "clients" ? "Gestionează datele clienților și găsește rapid informațiile importante." : "Urmărește programările, lucrările active și ce ai finalizat."}</p></div><div className="welcome-actions"><button className="button button-secondary" onClick={() => {setSection("clients");setShowClientForm(true);}}><Plus size={17}/> Client nou</button><button className="button button-primary" onClick={() => {setSection("jobs");setShowJobForm(true);}}><Plus size={17}/> Lucrare nouă</button></div></div>
          {section === "overview" && <><div className="stats-grid"><Stat icon={<BriefcaseBusiness size={19}/>} label="Lucrări active" value={String(activeJobs)} note="În lucru sau programate" trend="3" tone="blue"/><Stat icon={<Users size={19}/>} label="Total clienți" value={String(clients.length)} note="În baza de date demo" trend={String(clients.length)} tone="violet"/><Stat icon={<Wallet size={19}/>} label="Încasări finalizate" value={money(revenue)} note="Valoare demonstrativă" trend="RON" tone="green"/><Stat icon={<Clock3 size={19}/>} label="De urmărit" value={String(jobs.filter(j => j.status === "Programată").length)} note="Lucrări programate" trend="→" tone="amber"/></div><div className="content-grid"><section className="panel jobs-panel"><div className="panel-heading"><div><h2>Lucrări recente</h2><p>Activitatea ta, dintr-o privire</p></div><button className="text-action" onClick={() => setSection("jobs")}>Toate lucrările <span>→</span></button></div><div className="table-wrap"><table><thead><tr><th>LUCRARE</th><th>CLIENT</th><th>STATUS</th><th>VALOARE</th></tr></thead><tbody>{jobs.slice(0,4).map(job => <tr key={job.id}><td><div className="job-name"><div className="job-icon"><Wrench size={16}/></div><div><strong>{job.title}</strong><small><MapPin size={12}/> {job.address}</small></div></div></td><td className="client-cell">{job.client}</td><td><Status status={job.status}/></td><td className="amount">{money(job.price)}</td></tr>)}</tbody></table></div><button className="mobile-view-all" onClick={() => setSection("jobs")}>Vezi toate lucrările →</button></section><section className="panel schedule-panel"><div className="panel-heading"><div><h2>Următoarele lucrări</h2><p>Ce urmează în program</p></div><CalendarDays size={19} className="muted-icon"/></div><div className="timeline">{jobs.filter(j => j.status !== "Finalizată").slice(0,3).map((job, index) => <div className="timeline-item" key={job.id}><div className={`timeline-dot dot-${index+1}`}/><div className="timeline-body"><span className="timeline-date">{job.date}</span><strong>{job.title}</strong><span>{job.client}</span><small><MapPin size={12}/> {job.address}</small></div><button className="tiny-menu" aria-label="Opțiuni lucrare" onClick={() => setNotice(`Lucrare: ${job.title}`)}><MoreHorizontal size={17}/></button></div>)}</div><button className="schedule-footer" onClick={() => setNotice("Calendarul complet va fi disponibil în următoarea etapă.")}>Deschide calendarul <span>↗</span></button></section></div><div className="bottom-grid"><section className="panel progress-panel"><div className="panel-heading"><div><h2>Rezumatul activității</h2><p>Starea lucrărilor din prototip</p></div><Activity size={18} className="muted-icon"/></div><div className="progress-row"><div className="progress-label"><span>În lucru</span><strong>{jobs.filter(j=>j.status==="În lucru").length}</strong></div><div className="progress-track"><div className="progress-fill blue-fill" style={{width:`${jobs.length ? jobs.filter(j=>j.status==="În lucru").length/jobs.length*100 : 0}%`}}/></div></div><div className="progress-row"><div className="progress-label"><span>Programate</span><strong>{jobs.filter(j=>j.status==="Programată").length}</strong></div><div className="progress-track"><div className="progress-fill amber-fill" style={{width:`${jobs.length ? jobs.filter(j=>j.status==="Programată").length/jobs.length*100 : 0}%`}}/></div></div><div className="progress-row"><div className="progress-label"><span>Finalizate</span><strong>{jobs.filter(j=>j.status==="Finalizată").length}</strong></div><div className="progress-track"><div className="progress-fill green-fill" style={{width:`${jobs.length ? jobs.filter(j=>j.status==="Finalizată").length/jobs.length*100 : 0}%`}}/></div></div></section><section className="panel quick-panel"><div className="panel-heading"><div><h2>Acțiuni rapide</h2><p>Economisește timp cu comenzile uzuale</p></div><TrendingUp size={18} className="muted-icon"/></div><div className="quick-actions"><button onClick={() => {setSection("clients");setShowClientForm(true);}}><span className="quick-icon purple"><Users size={18}/></span><span><strong>Adaugă un client</strong><small>Salvează datele de contact</small></span><span className="quick-arrow">↗</span></button><button onClick={() => {setSection("jobs");setShowJobForm(true);}}><span className="quick-icon blue"><ClipboardList size={18}/></span><span><strong>Înregistrează o lucrare</strong><small>Notează o intervenție nouă</small></span><span className="quick-arrow">↗</span></button><button onClick={() => setNotice("Devizele PDF sunt planificate pentru următoarea etapă.")}><span className="quick-icon green"><FileText size={18}/></span><span><strong>Pregătește un deviz</strong><small>Modul în dezvoltare</small></span><span className="quick-arrow">↗</span></button></div></section></div></>}
          {section !== "overview" && <section className="panel listing-panel"><div className="listing-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={section==="clients"?"Caută după nume, telefon sau adresă...":"Caută după lucrare, client sau status..."}/><kbd>⌘ K</kbd></div><button className="button button-secondary filter-button" onClick={() => setNotice("Filtrele avansate vor fi adăugate în următoarea etapă.")}><Filter size={16}/> Filtre</button><button className="button button-primary" onClick={()=>section==="clients"?setShowClientForm(true):setShowJobForm(true)}><Plus size={17}/>{section==="clients"?"Client nou":"Lucrare nouă"}</button></div>{section==="clients" ? <div className="client-list">{filteredClients.map(c=><div className="client-row" key={c.id}><div className="client-avatar">{c.name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}</div><div className="client-info"><strong>{c.name}</strong><span>{c.type}</span></div><div className="client-contact"><Phone size={14}/>{c.phone}</div><div className="client-contact"><MapPin size={14}/>{c.address}</div><button className="icon-btn" onClick={()=>setNotice(`Fișă client: ${c.name}`)} aria-label="Detalii client"><MoreHorizontal size={18}/></button></div>)}{filteredClients.length===0&&<div className="empty-state">Nu am găsit clienți pentru această căutare.</div>}</div> : <div className="jobs-list">{filteredJobs.map(j=><div className="job-row" key={j.id}><div className="job-icon large"><Wrench size={18}/></div><div className="job-row-main"><strong>{j.title}</strong><span>{j.client} · {j.address}</span><small><CalendarDays size={13}/>{j.date}</small></div><Status status={j.status}/><strong className="amount">{money(j.price)}</strong><button className="icon-btn" aria-label="Detalii lucrare" onClick={()=>setNotice(`Lucrare: ${j.title}`)}><MoreHorizontal size={18}/></button></div>)}{filteredJobs.length===0&&<div className="empty-state">Nu am găsit lucrări pentru această căutare.</div>}</div>}</section>}
          <footer className="page-footer"><span>© 2026 Scamio Workspace</span><span><span className="footer-dot"/> Prototip de produs · Nu folosi încă pentru date reale</span></footer>
        </div>
      </main>
      {(showClientForm || showJobForm) && <div className="modal-backdrop" onClick={()=>{setShowClientForm(false);setShowJobForm(false);}}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="modal-eyebrow">SCAMIO WORKSPACE</span><h2>{showClientForm?"Adaugă un client":"Înregistrează o lucrare"}</h2><p>{showClientForm?"Completează datele de bază ale clientului.":"Adaugă detaliile intervenției sau proiectului."}</p></div><button className="icon-btn" onClick={()=>{setShowClientForm(false);setShowJobForm(false);}} aria-label="Închide"><X size={19}/></button></div>{showClientForm ? <form onSubmit={addClient} className="form-grid"><label>Nume client *<input required value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Ex. Ion Popescu"/></label><label>Telefon<input value={clientPhone} onChange={e=>setClientPhone(e.target.value)} placeholder="07xx xxx xxx"/></label><label className="full-field">Adresă / localitate<input value={clientAddress} onChange={e=>setClientAddress(e.target.value)} placeholder="Ex. Sector 2, București"/></label><div className="form-actions"><button type="button" className="button button-secondary" onClick={()=>setShowClientForm(false)}>Anulează</button><button className="button button-primary" type="submit"><Check size={16}/> Salvează clientul</button></div></form> : <form onSubmit={addJob} className="form-grid"><label>Denumirea lucrării *<input required value={jobTitle} onChange={e=>setJobTitle(e.target.value)} placeholder="Ex. Montaj corpuri iluminat"/></label><label>Client *<input required list="client-options" value={jobClient} onChange={e=>setJobClient(e.target.value)} placeholder="Alege sau scrie numele clientului"/><datalist id="client-options">{clients.map(c=><option key={c.id} value={c.name}/>)}</datalist></label><label>Data / programarea<input value={jobDate} onChange={e=>setJobDate(e.target.value)} placeholder="Ex. 28 octombrie, 09:00"/></label><label>Valoare estimată (RON)<input type="number" min="0" value={jobPrice} onChange={e=>setJobPrice(e.target.value)} placeholder="0"/></label><div className="form-actions"><button type="button" className="button button-secondary" onClick={()=>setShowJobForm(false)}>Anulează</button><button className="button button-primary" type="submit"><Check size={16}/> Salvează lucrarea</button></div></form>}</div></div>}
      {notice && <div className="toast"><Check size={17}/>{notice}<button onClick={()=>setNotice("")} aria-label="Închide notificarea"><X size={15}/></button></div>}
    </div>
  );
}

function Stat({icon,label,value,note,trend,tone}:{icon:React.ReactNode;label:string;value:string;note:string;trend:string;tone:string}) {
  return <div className="stat-card"><div className="stat-top"><span className={`stat-icon ${tone}`}>{icon}</span><span className="stat-trend">{trend}</span></div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-note">{note}</span></div>;
}

function Status({status}:{status:Job["status"]}) {
  const cls = status==="În lucru"?"in-progress":status==="Programată"?"scheduled":"completed";
  return <span className={`status-tag ${cls}`}><span/>{status}</span>;
}
