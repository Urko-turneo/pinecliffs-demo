import { useState } from "react";

// Pine Cliffs palette — dark luxury, serif, sand/gold tones
const DARK   = "#1A1714";   // near-black background
const WARM   = "#2C2720";   // card dark bg
const GOLD   = "#B8965A";   // accent gold
const SAND   = "#E8DFD0";   // light sand
const CREAM  = "#F4EFE8";   // page bg
const LTXT   = "#6B5F52";   // muted text
const WHITE  = "#FFFFFF";
const BORDER = "#D4C9B8";

const experiences = [
  { id:1, cat:"Golf",           title:"Green Fee — Pine Cliffs Golf",       sub:"9-hole cliff-top course",          price:95,  dur:"4–5h",   cap:"1–4",    desc:"The iconic cliff-top 9-hole course with panoramic Atlantic views. Buggy included, club hire available. Tee times from dawn.",                                       slots:["07:30","09:00","11:00","14:00","16:00"], emoji:"⛳" },
  { id:2, cat:"Tennis & Padel", title:"Annabel Croft Tennis Clinic",         sub:"Academy coaching session",         price:65,  dur:"90 min", cap:"1–4",    desc:"Expert coaching at the Annabel Croft Tennis Academy. Four world-class courts, tailored programmes for all skill levels.",                                          slots:["09:00","11:00","15:00","17:00"],         emoji:"🎾" },
  { id:3, cat:"Spa",            title:"Signature Algarve Ritual",            sub:"Serenity Spa",                     price:120, dur:"90 min", cap:"1–2",    desc:"A sensory journey through the natural elements of the Algarve. Award-winning treatments using local botanicals and sea minerals.",                                  slots:["10:00","12:00","14:00","16:30"],         emoji:"🌿" },
  { id:4, cat:"Watersports",    title:"Kayak & Snorkel — Falésia Beach",    sub:"Praia da Falésia",                 price:55,  dur:"2h",     cap:"2–6",    desc:"Paddle the world's best beach (TripAdvisor 2024) and explore crystal-clear Atlantic coves with a certified guide.",                                             slots:["09:30","11:30","14:30"],                 emoji:"🌊" },
  { id:5, cat:"Family",         title:"Porto Pirata Full Day",               sub:"Algarve's largest children's club",price:45,  dur:"Full day",cap:"Age 1–8",desc:"7,000m² adventure village. Two pirate ships, bouncy castles, 18-hole mini-golf, pools and creative workshops under expert supervision.",                           slots:["09:00","10:00"],                         emoji:"⚓" },
  { id:6, cat:"Golf",           title:"Private Golf Lesson",                 sub:"PGA-certified instructor",         price:80,  dur:"60 min", cap:"1–2",    desc:"One-to-one coaching with a PGA pro. Video swing analysis, personalised drill programme and full post-session report.",                                            slots:["08:00","10:00","14:00","16:00"],         emoji:"🏌️" },
  { id:7, cat:"Experiences",    title:"Private Yacht — Hidden Coves",       sub:"Atlantic charter",                  price:220, dur:"3h",     cap:"2–8",    desc:"Exclusive yacht from the Algarve marina. Sea caves, secret coves, dramatic cliffs inaccessible by land. Wine and local tapas included.",                       slots:["10:00","14:00"],                         emoji:"⛵" },
  { id:8, cat:"Spa",            title:"Couples Wellness Retreat",            sub:"Serenity Spa",                     price:195, dur:"2h",     cap:"2",      desc:"Side-by-side treatments — deep tissue massage, facial, and full use of thermal facilities: sauna, steam room and hydrotherapy pool.",                             slots:["11:00","14:00","16:00"],                 emoji:"✦"  },
];

const cats  = ["All","Golf","Tennis & Padel","Spa","Watersports","Family","Experiences"];
const today = new Date();
const days  = Array.from({length:7},(_,i)=>{ const d=new Date(today); d.setDate(d.getDate()+i); return d; });
const fmtLong  = d => d.toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
const fmtShort = d => d.toLocaleDateString("en-GB",{day:"2-digit",month:"short"});
const fmtWday  = d => d.toLocaleDateString("en-GB",{weekday:"short"}).toUpperCase();
const steps = ["Select experience","Date & time","Your details"];

/* ── Confirmation / email preview ── */
function ConfirmScreen({exp,form,date,slot,persons,total,ref,onReset,emailSent}){
  return(
    <div style={{background:"#f4f4f4",minHeight:"100vh"}}>
      <div style={{background:"#2D2D2D",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:12}}>{["#FF5F57","#FFBD2E","#27C93F"].map(c=><div key={c} style={{width:12,height:12,borderRadius:"50%",background:c}}/>)}</div>
        <div style={{background:"#3D3D3D",borderRadius:6,padding:"4px 80px",fontSize:11,color:"#aaa",fontFamily:"monospace"}}>Inbox</div>
        <div style={{fontSize:11,color:"#666",fontFamily:"Arial,sans-serif"}}>{emailSent?"✅ Email sent":"Email preview"}</div>
      </div>
      <div style={{background:"#fff",borderBottom:"1px solid #e0e0e0",padding:"12px 16px"}}>
        <div style={{fontSize:13,fontWeight:600,color:"#333",fontFamily:"Arial,sans-serif",marginBottom:4}}>
          ✅ Confirmed: {exp.title} · {fmtShort(days[date])} · {ref}
        </div>
        <div style={{fontSize:12,color:"#888",fontFamily:"Arial,sans-serif"}}>
          From: <span style={{color:"#B8965A"}}>Pine Cliffs Resort Experiences &lt;experiences@pinecliffs.com&gt;</span>
          {" · "} To: {form.email}
          {emailSent&&<span style={{marginLeft:8,color:"#2E7D4F",fontWeight:600}}>· Sent ✓</span>}
        </div>
      </div>
      <div style={{padding:"0 0 60px"}}>
        <table role="presentation" border="0" cellPadding="0" cellSpacing="0" width="100%">
          <tr><td bgcolor="#1A1714" align="center" style={{padding:"20px 12px 0"}}>
            <table width="100%" style={{maxWidth:652,margin:"0 auto"}}>
              <tr><td bgcolor="#ffffff" style={{padding:"32px 32px 0",borderRadius:"4px 4px 0 0",fontFamily:"Georgia,serif",textAlign:"center"}}>
                <div style={{marginBottom:24,letterSpacing:4,fontSize:11,color:"#B8965A",fontFamily:"Arial,sans-serif"}}>PINE CLIFFS RESORT</div>
                <div style={{width:40,height:1,background:"#B8965A",margin:"0 auto 24px"}}></div>
                <p style={{fontSize:20,fontWeight:400,margin:"0 0 16px",color:"#1A1714",lineHeight:1.4,textAlign:"left",fontFamily:"Georgia,serif"}}>
                  A new booking has been confirmed for {exp.title} on {fmtShort(days[date])}.
                </p>
                <p style={{fontSize:14,color:"#6B5F52",marginBottom:8,textAlign:"left",fontFamily:"Arial,sans-serif",lineHeight:1.6}}>No further action is required. The guest will receive their own confirmation separately.</p>
                <p style={{fontSize:14,color:"#6B5F52",marginBottom:24,textAlign:"left",fontFamily:"Arial,sans-serif",lineHeight:1.6}}>View full booking details in your Turneo Hub.</p>
                <div style={{textAlign:"center",marginBottom:32}}>
                  <a href="https://app.turneo.co/organizer/bookings" style={{display:"inline-block",padding:"12px 32px",background:"#1A1714",color:"#fff",fontSize:12,letterSpacing:2,textDecoration:"none",fontFamily:"Arial,sans-serif"}}>TURNEO HUB</a>
                </div>
              </td></tr>
            </table>
          </td></tr>
          <tr><td bgcolor="#F3F3F3" align="center" style={{padding:"16px 12px 0"}}>
            <table width="100%" style={{maxWidth:652,margin:"0 auto"}}>
              <tr><td bgcolor="#fff" style={{padding:"24px 32px",borderRadius:4,fontFamily:"Arial,sans-serif",fontSize:14,lineHeight:"24px"}}>
                <div style={{borderBottom:"1px solid #E8DFD0",paddingBottom:16,marginBottom:16}}>
                  <div style={{fontSize:11,color:"#B8965A",letterSpacing:3,marginBottom:8}}>EXPERIENCE</div>
                  <div style={{fontSize:18,color:"#1A1714",fontFamily:"Georgia,serif",fontWeight:400,marginBottom:4}}>{exp.title}</div>
                  <div style={{fontSize:13,color:"#6B5F52"}}>{exp.sub}</div>
                </div>
                {[["Date",fmtLong(days[date])],["Time",slot],["Meeting point","Pine Cliffs Resort, Praia da Falésia, Albufeira"],["Sold by","Pine Cliffs Resort"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F4EFE8",fontSize:13}}>
                    <span style={{color:"#B8965A",letterSpacing:0.5}}>{k}</span>
                    <span style={{color:"#1A1714",fontWeight:500,textAlign:"right",maxWidth:320}}>{v}</span>
                  </div>
                ))}
                <div style={{background:"#F4EFE8",padding:16,margin:"20px 0",borderLeft:"3px solid #B8965A"}}>
                  <div style={{fontSize:11,color:"#B8965A",letterSpacing:3,marginBottom:10}}>PAYMENT</div>
                  {[["Processed by","Turneo"],["Total charged",`€${total}`],["Your earnings",`€${(parseFloat(total)*0.85).toFixed(2)}`]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
                      <span style={{color:"#6B5F52"}}>{k}</span><span style={{color:"#1A1714",fontWeight:500}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:11,color:"#B8965A",letterSpacing:3,marginBottom:10}}>GUEST DETAILS</div>
                {[["Name",form.name.toUpperCase()],form.phone&&["Phone",form.phone],["Booking ID",ref],["Units",`${persons} ${persons===1?"guest":"guests"}`],form.notes&&["Notes",form.notes]].filter(Boolean).map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F4EFE8",fontSize:13}}>
                    <span style={{color:"#6B5F52"}}>{k}</span><span style={{color:"#1A1714",fontWeight:500}}>{v}</span>
                  </div>
                ))}
              </td></tr>
            </table>
          </td></tr>
          <tr><td bgcolor="#F3F3F3" style={{padding:"16px 12px 40px"}}>
            <table width="100%" style={{maxWidth:652,margin:"0 auto"}}>
              <tr><td style={{padding:"16px 12px",textAlign:"center",fontFamily:"Arial,sans-serif"}}>
                <div style={{width:40,height:1,background:"#B8965A",margin:"0 auto 16px"}}></div>
                <p style={{fontSize:11,color:"#999",lineHeight:1.8,letterSpacing:0.5}}>
                  QUESTIONS? <a href="mailto:support@turneo.com" style={{color:"#B8965A"}}>SUPPORT@TURNEO.COM</a><br/>
                  TURNEO LTD · 71-75 SHELTON STREET · LONDON WC2H 9JQ
                </p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </div>
      <div style={{position:"fixed",bottom:20,right:20}}>
        <button onClick={onReset} style={{background:DARK,color:GOLD,border:`1px solid ${GOLD}`,padding:"10px 20px",fontFamily:"Arial,sans-serif",fontSize:11,letterSpacing:2,cursor:"pointer"}}>← BOOK AGAIN</button>
      </div>
    </div>
  );
}

export default function App(){
  const [step,setStep]   = useState(0);
  const [sel,setSel]     = useState(null);
  const [date,setDate]   = useState(null);
  const [slot,setSlot]   = useState(null);
  const [persons,setPersons] = useState(2);
  const [form,setForm]   = useState({name:"",email:"",phone:"",notes:""});
  const [confirmed,setConfirmed] = useState(false);
  const [filter,setFilter] = useState("All");
  const [sending,setSending] = useState(false);
  const [emailSent,setEmailSent] = useState(false);
  const [sendError,setSendError] = useState(null);
  const [bookRef] = useState("PC-"+Math.floor(Math.random()*9000+1000));

  const filtered = filter==="All"?experiences:experiences.filter(e=>e.cat===filter);
  const exp      = experiences.find(e=>e.id===sel);
  const total    = exp?exp.price*persons:0;
  const canNext  = (step===0&&sel)||(step===1&&date!==null&&slot)||step===2;

  async function submit(){
    if(!form.name||!form.email) return;
    setSending(true); setSendError(null);
    try{
      const r = await fetch("/api/send-confirmation",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:form.name,email:form.email,phone:form.phone,notes:form.notes,
          experience:{id:exp.id,title:exp.title,sub:exp.sub,cat:exp.cat,emoji:exp.emoji},
          date:fmtLong(days[date]),slot,persons,total:total.toFixed(2),bookRef})});
      const d=await r.json();
      if(r.ok&&d.success) setEmailSent(true);
      else setSendError(d.error||"Email could not be sent. Booking confirmed.");
    }catch{ setSendError("Server unreachable. Booking confirmed."); }
    finally{ setSending(false); setConfirmed(true); }
  }

  function reset(){setConfirmed(false);setStep(0);setSel(null);setDate(null);setSlot(null);setPersons(2);setForm({name:"",email:"",phone:"",notes:""});setEmailSent(false);setSendError(null);}

  if(confirmed) return <ConfirmScreen exp={exp} form={form} date={date} slot={slot} persons={persons} total={total.toFixed(2)} ref={bookRef} onReset={reset} emailSent={emailSent}/>;

  // ── shared styles ──
  const inputSt = {width:"100%",padding:"10px 14px",border:`1px solid ${BORDER}`,background:"#fff",fontSize:13,fontFamily:"Arial,sans-serif",color:DARK,outline:"none",boxSizing:"border-box"};
  const labelSt = {display:"block",fontSize:10,letterSpacing:2,color:LTXT,marginBottom:6};

  return(
    <div style={{fontFamily:"Arial,sans-serif",background:CREAM,minHeight:"100vh"}}>

      {/* ── HEADER ── */}
      <div style={{background:DARK,padding:"0 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:1,height:32,background:GOLD}}></div>
          <div>
            <div style={{color:GOLD,fontSize:10,letterSpacing:4,fontWeight:400}}>PINE CLIFFS RESORT</div>
            <div style={{color:"#888",fontSize:9,letterSpacing:2,marginTop:2}}>ALGARVE · PORTUGAL</div>
          </div>
        </div>
        <div style={{display:"flex",gap:24,color:"#888",fontSize:10,letterSpacing:2}}>
          {["ACCOMMODATION","DINING","WELLBEING","GOLF & SPORTS","FAMILY"].map(n=><span key={n}>{n}</span>)}
          <span style={{color:GOLD,borderBottom:`1px solid ${GOLD}`,paddingBottom:2}}>EXPERIENCES</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{background:DARK,padding:"3rem 2rem 2.5rem",textAlign:"center",borderBottom:`1px solid #2C2720`}}>
        <div style={{fontSize:10,color:GOLD,letterSpacing:5,marginBottom:16}}>BOOK AN EXPERIENCE</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:34,fontWeight:400,color:WHITE,margin:"0 0 12px",letterSpacing:1}}>Discover Pine Cliffs</h1>
        <div style={{width:48,height:1,background:GOLD,margin:"0 auto 16px"}}></div>
        <p style={{color:"#888",fontSize:13,letterSpacing:1,margin:0}}>Golf · Tennis · Spa · Watersports · Family · Private Yacht</p>
      </div>

      {/* ── STEPPER ── */}
      <div style={{background:WARM,borderBottom:`1px solid #3A3028`,display:"flex"}}>
        {steps.map((s,i)=>(
          <div key={s} style={{flex:1,padding:"1rem 0",textAlign:"center",borderBottom:`2px solid ${i===step?GOLD:i<step?"#6B5F52":"transparent"}`,cursor:i<step?"pointer":"default"}} onClick={()=>i<step&&setStep(i)}>
            <div style={{fontSize:10,letterSpacing:2,color:i===step?GOLD:i<step?"#888":"#4A4030"}}>{i+1} · {s.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"2rem 1.5rem 4rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:"1.5rem",alignItems:"start"}}>

          {/* ── LEFT ── */}
          <div>

            {/* STEP 0 */}
            {step===0&&(
              <div>
                <div style={{display:"flex",gap:8,marginBottom:"1.5rem",flexWrap:"wrap"}}>
                  {cats.map(c=>(
                    <button key={c} onClick={()=>setFilter(c)} style={{padding:"6px 16px",border:`1px solid ${filter===c?GOLD:BORDER}`,background:filter===c?DARK:"transparent",color:filter===c?GOLD:LTXT,fontSize:10,letterSpacing:1.5,cursor:"pointer"}}>{c.toUpperCase()}</button>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:"1px",background:BORDER}}>
                  {filtered.map(ex=>{
                    const isSel=sel===ex.id;
                    return(
                      <div key={ex.id} onClick={()=>setSel(ex.id)} style={{background:isSel?WARM:"#fff",cursor:"pointer",padding:"1.5rem",outline:isSel?`2px solid ${GOLD}`:"none",outlineOffset:-1,transition:"all 0.15s"}}>
                        <div style={{fontSize:22,marginBottom:10}}>{ex.emoji}</div>
                        <div style={{fontSize:9,color:GOLD,letterSpacing:3,marginBottom:6}}>{ex.cat.toUpperCase()}</div>
                        <div style={{fontFamily:"Georgia,serif",fontSize:15,color:isSel?WHITE:DARK,marginBottom:6,lineHeight:1.3,fontWeight:400}}>{ex.title}</div>
                        <div style={{fontSize:11,color:isSel?"#888":LTXT,marginBottom:10,lineHeight:1.5}}>{ex.desc}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${isSel?"#3A3028":BORDER}`,paddingTop:10}}>
                          <span style={{fontSize:10,color:isSel?"#888":LTXT,letterSpacing:1}}>{ex.dur} · {ex.cap} guests</span>
                          <span style={{fontFamily:"Georgia,serif",fontSize:20,color:GOLD}}>€{ex.price}</span>
                        </div>
                        {isSel&&<div style={{marginTop:10,fontSize:10,color:GOLD,letterSpacing:2}}>✓ SELECTED</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 1 */}
            {step===1&&exp&&(
              <div>
                <div style={{background:WARM,padding:"1.25rem 1.5rem",marginBottom:"1.5rem",borderLeft:`3px solid ${GOLD}`}}>
                  <div style={{fontSize:9,color:GOLD,letterSpacing:3,marginBottom:6}}>{exp.cat.toUpperCase()}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:17,color:WHITE,fontWeight:400}}>{exp.title}</div>
                </div>

                {/* Persons */}
                <div style={{background:"#fff",border:`1px solid ${BORDER}`,padding:"1.25rem",marginBottom:"1rem"}}>
                  <div style={{fontSize:10,letterSpacing:2,color:LTXT,marginBottom:"0.875rem"}}>NUMBER OF GUESTS</div>
                  <div style={{display:"flex",alignItems:"center",gap:16}}>
                    <button onClick={()=>setPersons(Math.max(1,persons-1))} style={{width:36,height:36,border:`1px solid ${BORDER}`,background:"#fff",fontSize:18,cursor:"pointer",color:DARK}}>−</button>
                    <span style={{fontFamily:"Georgia,serif",fontSize:24,color:DARK,minWidth:24,textAlign:"center"}}>{persons}</span>
                    <button onClick={()=>setPersons(Math.min(12,persons+1))} style={{width:36,height:36,border:`1px solid ${GOLD}`,background:DARK,fontSize:18,cursor:"pointer",color:GOLD}}>+</button>
                    <span style={{fontSize:12,color:LTXT}}>× €{exp.price} per person</span>
                  </div>
                </div>

                {/* Dates */}
                <div style={{background:"#fff",border:`1px solid ${BORDER}`,padding:"1.25rem",marginBottom:"1rem"}}>
                  <div style={{fontSize:10,letterSpacing:2,color:LTXT,marginBottom:"0.875rem"}}>SELECT DATE</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {days.map((d,i)=>{
                      const isSel=date===i;
                      return(
                        <button key={i} onClick={()=>{setDate(i);setSlot(null);}} style={{padding:"8px 10px",border:`1px solid ${isSel?GOLD:BORDER}`,background:isSel?DARK:"#fff",color:isSel?GOLD:DARK,cursor:"pointer",textAlign:"center",minWidth:58,transition:"all 0.15s"}}>
                          <div style={{fontSize:9,opacity:0.7,letterSpacing:1}}>{fmtWday(d)}</div>
                          <div style={{fontFamily:"Georgia,serif",fontSize:16,margin:"2px 0"}}>{d.getDate()}</div>
                          <div style={{fontSize:9,opacity:0.7}}>{fmtShort(d).split(" ")[1]}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots */}
                {date!==null&&(
                  <div style={{background:"#fff",border:`1px solid ${BORDER}`,padding:"1.25rem"}}>
                    <div style={{fontSize:10,letterSpacing:2,color:LTXT,marginBottom:"0.875rem"}}>AVAILABLE TIMES</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {exp.slots.map(s=>{
                        const isSel=slot===s;
                        return(
                          <button key={s} onClick={()=>setSlot(s)} style={{padding:"10px 20px",border:`1px solid ${isSel?GOLD:BORDER}`,background:isSel?DARK:"#fff",color:isSel?GOLD:DARK,fontFamily:"Georgia,serif",fontSize:15,cursor:"pointer",transition:"all 0.15s"}}>{s}</button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {step===2&&exp&&(
              <div style={{background:"#fff",border:`1px solid ${BORDER}`,padding:"1.75rem"}}>
                <div style={{fontSize:10,letterSpacing:2,color:LTXT,marginBottom:"1.25rem"}}>YOUR DETAILS</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div><label style={labelSt}>FULL NAME *</label><input style={inputSt} type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></div>
                  <div><label style={labelSt}>EMAIL ADDRESS *</label><input style={inputSt} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com"/></div>
                </div>
                <div style={{marginBottom:12}}><label style={labelSt}>PHONE</label><input style={inputSt} type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+351 ..."/></div>
                <div style={{marginBottom:"1.5rem"}}><label style={labelSt}>SPECIAL REQUESTS</label><textarea style={{...inputSt,resize:"vertical"}} rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Allergies, anniversaries, accessibility needs..."/></div>

                <div style={{background:CREAM,border:`1px solid ${BORDER}`,padding:"1.25rem",marginBottom:"1.5rem"}}>
                  <div style={{fontSize:10,letterSpacing:2,color:LTXT,marginBottom:"0.875rem"}}>SECURE PAYMENT</div>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,marginBottom:10}}>
                    <div><label style={labelSt}>CARD NUMBER</label><input style={inputSt} type="text" placeholder="•••• •••• •••• ••••"/></div>
                    <div><label style={labelSt}>EXPIRY</label><input style={inputSt} type="text" placeholder="MM/YY"/></div>
                    <div><label style={labelSt}>CVV</label><input style={inputSt} type="text" placeholder="•••"/></div>
                  </div>
                  <div style={{fontSize:10,color:LTXT,letterSpacing:1}}>DEMO ONLY — NO CHARGE WILL BE MADE</div>
                </div>

                {sendError&&<div style={{background:"#FFF3CD",border:"1px solid #FFDA6A",padding:"10px 14px",marginBottom:12,fontSize:12,color:"#856404"}}>⚠️ {sendError}</div>}
                <button onClick={submit} disabled={!form.name||!form.email||sending} style={{width:"100%",padding:"1rem",background:form.name&&form.email&&!sending?DARK:"#ccc",color:form.name&&form.email&&!sending?GOLD:"#fff",border:`1px solid ${form.name&&form.email&&!sending?GOLD:"#ccc"}`,fontSize:11,letterSpacing:3,cursor:form.name&&form.email&&!sending?"pointer":"not-allowed"}}>
                  {sending?"PROCESSING...":(`CONFIRM BOOKING · €${total}`)}
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT — summary ── */}
          <div>
            <div style={{background:WARM,border:`1px solid #3A3028`,padding:"1.25rem",position:"sticky",top:12}}>
              <div style={{fontSize:10,letterSpacing:3,color:GOLD,marginBottom:"1rem",borderBottom:`1px solid #3A3028`,paddingBottom:"0.875rem"}}>BOOKING SUMMARY</div>
              {exp?(
                <>
                  <div style={{borderLeft:`2px solid ${GOLD}`,paddingLeft:12,marginBottom:"1rem"}}>
                    <div style={{fontSize:9,color:GOLD,letterSpacing:2,marginBottom:4}}>{exp.cat.toUpperCase()}</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:14,color:WHITE,fontWeight:400,lineHeight:1.3}}>{exp.title}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:"1rem"}}>
                    {[["Guests",`${persons}`],date!==null&&["Date",fmtLong(days[date])],slot&&["Time",slot]].filter(Boolean).map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                        <span style={{color:"#666",letterSpacing:0.5}}>{k}</span>
                        <span style={{color:WHITE,fontWeight:400,maxWidth:150,textAlign:"right"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{borderTop:`1px solid #3A3028`,paddingTop:"0.875rem",display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                    <span style={{fontSize:10,color:"#666",letterSpacing:1}}>TOTAL</span>
                    <span style={{fontFamily:"Georgia,serif",fontSize:26,color:GOLD}}>€{total}</span>
                  </div>
                  {date!==null&&slot&&<div style={{marginTop:"0.875rem",padding:"0.625rem",background:"#1E2E1E",fontSize:11,color:"#6BCB77",letterSpacing:1}}>✓ AVAILABILITY CONFIRMED</div>}
                </>
              ):(
                <div style={{fontSize:11,color:"#4A4030",letterSpacing:1,lineHeight:1.8}}>SELECT AN EXPERIENCE<br/>TO SEE YOUR TOTAL</div>
              )}
              <div style={{marginTop:"1rem",paddingTop:"0.875rem",borderTop:`1px solid #3A3028`,fontSize:10,color:"#4A4030",lineHeight:1.8,letterSpacing:0.5}}>
                FREE CANCELLATION UP TO 48H BEFORE<br/>INSTANT EMAIL CONFIRMATION
              </div>
            </div>
          </div>
        </div>

        {/* ── NAV ── */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"2rem",paddingTop:"1.5rem",borderTop:`1px solid ${BORDER}`}}>
          <button onClick={()=>step>0&&setStep(step-1)} disabled={step===0} style={{padding:"10px 24px",border:`1px solid ${step===0?"#ddd":DARK}`,background:"transparent",color:step===0?"#ccc":DARK,fontSize:10,letterSpacing:2,cursor:step===0?"default":"pointer"}}>← BACK</button>
          <div style={{display:"flex",gap:8}}>{steps.map((_,i)=><div key={i} style={{width:i===step?24:8,height:2,background:i===step?GOLD:i<step?"#888":BORDER,transition:"all 0.2s"}}/>)}</div>
          {step<2?<button onClick={()=>canNext&&setStep(step+1)} disabled={!canNext} style={{padding:"10px 28px",border:`1px solid ${canNext?GOLD:"#ddd"}`,background:canNext?DARK:"transparent",color:canNext?GOLD:"#ccc",fontSize:10,letterSpacing:2,cursor:canNext?"pointer":"not-allowed"}}>CONTINUE →</button>:<div style={{width:100}}/>}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{background:DARK,borderTop:`1px solid #2C2720`,padding:"1.5rem 2rem",textAlign:"center"}}>
        <div style={{width:40,height:1,background:GOLD,margin:"0 auto 12px"}}></div>
        <div style={{fontSize:10,color:"#4A4030",letterSpacing:2,lineHeight:2}}>
          PINE CLIFFS RESORT · PRAIA DA FALÉSIA · 8200-593 ALBUFEIRA · ALGARVE, PORTUGAL<br/>
          <span style={{color:"#6B5F52"}}>EXPERIENCES BOOKING POWERED BY </span><span style={{color:GOLD}}>TURNEO</span>
        </div>
      </div>
    </div>
  );
}
