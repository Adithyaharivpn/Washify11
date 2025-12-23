import React, { useState, useMemo } from "react";
import "./Home.css";

const SAMPLE_CENTRES = [
    { id: "c1", name: " Wash Hub", address: "Irinjalakuda", rating: 4.6, distanceKm: 1.2, services: ["Self-Service","Drop-Off"], hours: "8:00-20:00", phone: "+1 (555) 111-2222", notes: "Free parking." },
    { id: "c2", name: "Wash Street", address: "Thrissur", rating: 4.2, distanceKm: 3.8, services: ["Self-Service","Wash & Fold"], hours: "7:00-22:00", phone: "+1 (555) 333-4444", notes: "24/7 lockers." },
    { id: "c3", name: "Wash House", address: "Chalakudy", rating: 4.9, distanceKm: 0.6, services: ["Drop-Off","Dry Cleaning"], hours: "9:00-18:00", phone: "+1 (555) 777-8888", notes: "Same-day rush." }
];

const IconSearch = (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function Home() {
    const [q, setQ] = useState("");
    const [svc, setSvc] = useState("All");
    const [sortBy, setSortBy] = useState("recommended");
    const [sel, setSel] = useState(null);
    const [msg, setMsg] = useState("");

    const services = useMemo(() => {
        const s = new Set(); SAMPLE_CENTRES.forEach(c => c.services.forEach(x => s.add(x)));
        return
        
        ["All", ...s];
    }, []);

    const centres = useMemo(() => {
        const qq = q.trim().toLowerCase();
        let list = SAMPLE_CENTRES.filter(c => {
            const matchesQ = !qq || c.name.toLowerCase().includes(qq) || c.address.toLowerCase().includes(qq) || c.services.join(" ").toLowerCase().includes(qq);
            const matchesSvc = svc === "All" || c.services.includes(svc);
            return matchesQ && matchesSvc;
        });
        if (sortBy === "rating") list.sort((a,b)=>b.rating-a.rating);
        else if (sortBy === "distance") list.sort((a,b)=>a.distanceKm-b.distanceKm);
        else list.sort((a,b)=> (b.rating-a.rating) + (a.distanceKm-b.distanceKm)*0.1);
        return list;
    }, [q, svc, sortBy]);

    const handleBook = (id) => {
        const c = SAMPLE_CENTRES.find(x=>x.id===id);
        setMsg(`Booking request sent to "${c.name}". They will contact you at the number on file.`);
        setTimeout(()=>setMsg(""),5000);
        setSel(null);
    };

    return (

        


        
        <div className="home-page">



            <header className="home-header">
                <div className="brand"><div className="logo-box"><div className="gradient-text"><i>W</i></div></div><div className="brand-text"><div className="brand-title">Washify</div><div className="brand-sub">Connect · Book · Track</div></div></div>
                <div className="header-sub">Coordinating washing centres in your region</div>
            </header>

            <section className="hero">
                <div className="hero-left">
                    <h1 className="hero-title">Find and connect with nearby washing centres</h1>
                    <p className="hero-desc">Search by name, service, or address. Compare ratings and distance.</p>

                    <div className="search-box"><IconSearch className="search-icon"/><input aria-label="Search centres" placeholder="Search centres, services or address..." value={q} onChange={e=>setQ(e.target.value)} className="search-input home-search-input"/></div>

                    <div className="controls">
                       

                       <select
  aria-label="Sort by"
  className="select home-select"
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
>
  <option value="recommended">Recommended</option>
  <option value="rating">Highest Rating</option>
  <option value="distance">Nearest</option>
  <option value="name-asc">Name (A–Z)</option>
  <option value="name-desc">Name (Z–A)</option>
  <option value="hours">Opening Hours</option>
</select>

                        <div className="results-count">{centres.length} centre(s) found</div>
                    </div>

                    <div className="list" role="list">
                        {centres.map(c=>(
                            <div key={c.id} className="card home-card" role="listitem">
                                <div className="card-left">
                                    <div className="avatar home-avatar" aria-hidden>{c.name.split(" ").slice(0,2).map(w=>w[0]).join("")}</div>
                                    <div><div className="card-title" style={{ color: '#c8c8c8ff' }}>{c.name}</div><div className="card-sub">{c.address} · {c.hours}</div><div className="card-meta"><div className="tag">{c.services[0]}</div><div className="meta-item">⭐ {c.rating.toFixed(1)}</div><div className="meta-item">{c.distanceKm} km</div></div></div>
                                </div>
                                <div className="card-actions"><button onClick={()=>setSel(c)} className="home-btn">View</button><button onClick={()=>handleBook(c.id)} className="home-btn primary">Book</button></div>
                            </div>
                        ))}
                        {centres.length===0 && <div className="no-results">No centres match your search.</div>}
                    </div>
                </div>

                <aside className="hero-right home-aside">
                    <div className="aside-title">Map preview</div>
                    <div className="map-placeholder">Map integration placeholder.</div>
                    <div className="quick-actions">
                        <div className="aside-title">Quick actions</div>
                        <div className="actions-row"><button onClick={()=>{setQ(""); setSvc("All"); setSortBy("recommended");}} className="action-btn">Reset</button><button onClick={()=>alert("Open signup flow.")} className="action-btn primary">Add centre</button></div>
                    </div>
                </aside>
            </section>

            <div className="footer"><small>Built for coordinating washing centres — sample data only. © Washify</small></div>

            {sel && (
                <div role="dialog" aria-modal="true" className="detail-modal">
                    <div className="detail-card">
                        <div className="detail-header"><div><div className="detail-title">{sel.name}</div><div className="detail-sub">{sel.address}</div></div><div className="detail-stats"><div className="detail-rating">⭐ {sel.rating.toFixed(1)}</div><div className="detail-distance">{sel.distanceKm} km</div></div></div>
                        <div className="detail-body"><div><strong>Hours:</strong> {sel.hours}</div><div><strong>Services:</strong> {sel.services.join(", ")}</div><div><strong>Phone:</strong> {sel.phone}</div>{sel.notes && <div><strong>Note:</strong> {sel.notes}</div>}</div>
                        <div className="detail-actions"><button onClick={()=>handleBook(sel.id)} className="home-btn primary">Request Booking</button><button onClick={()=>{navigator.clipboard?.writeText(sel.address); alert("Address copied.");}} className="home-btn">Copy address</button><div className="detail-close"><button onClick={()=>setSel(null)} className="home-btn">Close</button></div></div>
                    </div>
                </div>
            )}

            {msg && <div className="toast" role="status">{msg}</div>}
        </div>
    );}