import { useState } from "react";

const BLUE = "#185FA5";
const LBLUE = "#E6F1FB";
const TEAL = "#0F6E56";
const LTEAL = "#E1F5EE";
const AMBER = "#854F0B";
const LAMBER = "#FAEEDA";
const CORAL = "#993C1D";
const LCORAL = "#FAECE7";
const GREEN = "#3B6D11";
const LGREEN = "#EAF3DE";
const SAND = "#F1EFE8";
const DARK = "#2C2C2A";

const experiences = [
  { id: 1, cat: "Golf", title: "Pine Cliffs Golf — Green Fee", sub: "Own resort course", price: 95, dur: "4–5h", cap: "1–4 guests", desc: "Play the iconic 9-hole cliff-top course with breathtaking Atlantic views. Includes buggy, clubs available for hire. Tee times from dawn.", slots: ["07:30", "09:00", "11:00", "14:00", "16:00"], icon: "⛳", color: GREEN, bg: LGREEN },
  { id: 2, cat: "Tennis & Padel", title: "Annabel Croft Tennis Clinic", sub: "Academy session", price: 65, dur: "90 min", cap: "1–4 guests", desc: "Professional coaching at the Annabel Croft Tennis Academy. 4 world-class courts, tailored to all skill levels with expert multilingual instructors.", slots: ["09:00", "11:00", "15:00", "17:00"], icon: "🎾", color: BLUE, bg: LBLUE },
  { id: 3, cat: "Spa", title: "Signature Algarve Ritual", sub: "Pine Cliffs Spa", price: 120, dur: "90 min", cap: "1–2 guests", desc: "A sensory journey through the natural elements of the Algarve. Award-winning treatments using local botanicals, sea minerals and Atlantic-inspired therapies.", slots: ["10:00", "12:00", "14:00", "16:30"], icon: "🌿", color: TEAL, bg: LTEAL },
  { id: 4, cat: "Watersports", title: "Kayak & Snorkel — Falésia", sub: "Praia da Falésia", price: 55, dur: "2h", cap: "2–6 guests", desc: "Paddle the golden cliffs of Falésia Beach (TripAdvisor's world #1 beach 2024) and snorkel in crystal-clear Atlantic coves with a certified guide.", slots: ["09:30", "11:30", "14:30"], icon: "🌊", color: BLUE, bg: LBLUE },
  { id: 5, cat: "Family", title: "Porto Pirata Full Day", sub: "Algarve's largest kids club", price: 45, dur: "Full day", cap: "Per child 1–8yrs", desc: "7,000m² adventure village with two pirate ships, bouncy castles, 18-hole mini-golf, pools and creative workshops. Europe's best family resort — year after year.", slots: ["09:00", "10:00"], icon: "🏴‍☠️", color: AMBER, bg: LAMBER },
  { id: 6, cat: "Golf", title: "Golf Academy — Private Lesson", sub: "PGA-certified pro", price: 80, dur: "60 min", cap: "1–2 guests", desc: "One-to-one lesson with a PGA-certified pro. Video swing analysis, personalised drills and a full post-session report. Suitable for beginners to scratch handicap.", slots: ["08:00", "10:00", "14:00", "16:00"], icon: "🏌️", color: GREEN, bg: LGREEN },
  { id: 7, cat: "Experiences", title: "Private Yacht — Hidden Coves", sub: "Atlantic excursion", price: 220, dur: "3h", cap: "2–8 guests", desc: "Exclusive yacht charter from the Algarve marina. Discover sea caves, secret coves and dramatic cliffs inaccessible by land. Includes wine and local tapas on board.", slots: ["10:00", "14:00"], icon: "⛵", color: CORAL, bg: LCORAL },
  { id: 8, cat: "Spa", title: "Couples Wellness Retreat", sub: "Pine Cliffs Spa", price: 195, dur: "2h", cap: "2 guests", desc: "Side-by-side treatments for two — deep tissue massage, facial and use of all thermal facilities including sauna, steam room and hydrotherapy pool.", slots: ["11:00", "14:00", "16:00"], icon: "💆", color: TEAL, bg: LTEAL },
];

const cats = ["All", "Golf", "Tennis & Padel", "Spa", "Watersports", "Family", "Experiences"];
const today = new Date();
const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return d; });
const fmtLong = d => d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
const fmtShort = d => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
const fmtWday = d => d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
const steps = ["Choose experience", "Date & time", "Your details"];

// ── Email confirmation screen ──
function ConfirmationScreen({ exp, form, date, slot, persons, total, bookRef, onReset, emailSent }) {
  return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh", padding: 0 }}>
      {/* Fake email client bar */}
      <div style={{ background: "#2D2D2D", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12 }}>
          {["#FF5F57","#FFBD2E","#27C93F"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ background: "#3D3D3D", borderRadius: 6, padding: "4px 80px", fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>Inbox</div>
        <div style={{ fontSize: 11, color: "#666", fontFamily: "Arial,sans-serif" }}>{emailSent ? "✅ Email sent" : "Email preview"}</div>
      </div>

      {/* Subject bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "12px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333", fontFamily: "Arial,sans-serif", marginBottom: 4 }}>
          ✅ Confirmed: New booking for {exp.title} on {fmtShort(days[date])} — {bookRef}
        </div>
        <div style={{ fontSize: 12, color: "#888", fontFamily: "Arial,sans-serif" }}>
          From: <span style={{ color: "#185FA5" }}>Pine Cliffs Resort Experiences &lt;experiences@pinecliffs.com&gt;</span>
          {" · "} To: <span style={{ color: "#333" }}>{form.email}</span>
          {emailSent && <span style={{ marginLeft: 8, color: "#2E7D4F", fontWeight: 600 }}>· Sent ✓</span>}
        </div>
      </div>

      {/* Email body */}
      <div style={{ padding: "0 0 60px" }}>
        <table role="presentation" border="0" cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td style={{ backgroundColor: BLUE, padding: "20px 12px 0" }}>
              <table role="presentation" width="100%" style={{ maxWidth: 652, margin: "0 auto" }}>
                <tr>
                  <td style={{ backgroundColor: "#fff", padding: "24px 24px 0", borderRadius: "4px 4px 0 0", fontFamily: "Arial,sans-serif", textAlign: "center" }}>
                    <div style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <div style={{ background: BLUE, borderRadius: 6, padding: "5px 16px" }}>
                        <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "monospace" }}>turneo</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px", color: "#000", lineHeight: 1.4, textAlign: "left" }}>
                      You have a new booking for {exp.title} on {fmtShort(days[date])}.
                    </p>
                    <p style={{ fontSize: 14, color: "#333", marginBottom: 8, textAlign: "left" }}>This booking is now confirmed. No further action is required.</p>
                    <p style={{ fontSize: 14, color: "#333", marginBottom: 16, textAlign: "left" }}>Below are the key details. You can view all information in your Turneo Hub.</p>
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <span style={{ display: "inline-block", padding: "8px 24px", backgroundColor: BLUE, borderRadius: 50, color: "#fff", fontSize: 14, fontWeight: 600 }}>Turneo Hub</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style={{ backgroundColor: "#f4f4f4", padding: "0 12px" }}>
            <table width="100%" style={{ maxWidth: 652, margin: "0 auto" }}>
              <tr><td style={{ backgroundColor: "#fff", padding: 12, borderRadius: "0 0 4px 4px" }}></td></tr>
            </table>
          </td></tr>

          <tr>
            <td style={{ backgroundColor: "#F3F3F3", padding: "16px 12px 0" }}>
              <table role="presentation" width="100%" style={{ maxWidth: 652, margin: "0 auto" }}>
                <tr>
                  <td style={{ backgroundColor: "#fff", padding: "16px 12px 24px", borderRadius: 4, fontFamily: "Arial,sans-serif", fontSize: 14, lineHeight: "22px" }}>
                    <h2 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>{exp.icon} {exp.title}</h2>
                    <p style={{ margin: "0 0 12px", color: "#555" }}>{exp.sub} · {exp.cat}</p>

                    <div style={{ width: "100%", height: 72, background: exp.bg, borderRadius: 8, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 36 }}>{exp.icon}</span>
                      <span style={{ fontSize: 18, fontWeight: 600, color: exp.color, marginLeft: 12 }}>{exp.title}</span>
                    </div>

                    <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Date:</span> {fmtLong(days[date])}</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Time:</span> {slot}</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Meeting point:</span> Pine Cliffs Resort, Praia da Falésia, Albufeira</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Sold by:</span> Pine Cliffs Resort</p>

                    <div style={{ backgroundColor: "#F2F2F2", padding: 12, marginTop: 20, marginBottom: 20, borderRadius: 4 }}>
                      <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Payment information</p>
                      <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Payment processed by:</span> Turneo</p>
                      <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Total price:</span> €{total.toFixed(2)}</p>
                      <p style={{ marginBottom: 0 }}><span style={{ color: BLUE }}>Your earnings:</span> €{(total * 0.85).toFixed(2)}</p>
                    </div>

                    <p style={{ marginTop: 24, marginBottom: 8, fontWeight: 600 }}>Booking information:</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Guest name:</span> {form.name.toUpperCase()}</p>
                    {form.phone && <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Phone:</span> {form.phone}</p>}
                    <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Booking ID:</span> {bookRef}</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Units:</span> {persons} {persons === 1 ? "Guest" : "Guests"}</p>
                    {form.notes && <p style={{ marginBottom: 6 }}><span style={{ color: BLUE }}>Notes:</span> {form.notes}</p>}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style={{ backgroundColor: "#F3F3F3", padding: "16px 12px 40px" }}>
              <table width="100%" style={{ maxWidth: 652, margin: "0 auto" }}>
                <tr>
                  <td style={{ padding: "16px 12px", textAlign: "center", fontFamily: "Arial,sans-serif" }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#666", lineHeight: 1.6 }}>
                      Questions? Email us at <a href="mailto:support@turneo.com" style={{ color: BLUE }}>support@turneo.com</a>.<br />
                      Turneo Ltd is registered in the UK at 71-75 Shelton Street, London, WC2H 9JQ, UK
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>

      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <button onClick={onReset} style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontFamily: "Arial,sans-serif", fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(24,95,165,0.3)" }}>
          ← Book another experience
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [persons, setPersons] = useState(2);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [confirmed, setConfirmed] = useState(false);
  const [filter, setFilter] = useState("All");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [bookRef] = useState("PC-" + Math.floor(Math.random() * 9000 + 1000));

  const filtered = filter === "All" ? experiences : experiences.filter(e => e.cat === filter);
  const exp = experiences.find(e => e.id === selected);
  const total = exp ? exp.price * persons : 0;
  const canProceed = (step === 0 && selected) || (step === 1 && date !== null && slot) || step === 2;

  async function handleSubmit() {
    if (!form.name || !form.email) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone, notes: form.notes,
          experience: { id: exp.id, title: exp.title, sub: exp.sub, cat: exp.cat, icon: exp.icon, color: exp.color, bg: exp.bg },
          date: fmtLong(days[date]), slot, persons, total: total.toFixed(2), bookRef,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) setEmailSent(true);
      else setSendError(data.error || "Email could not be sent. Your booking is confirmed.");
    } catch {
      setSendError("Could not reach the email server. Your booking is confirmed.");
    } finally {
      setSending(false);
      setConfirmed(true);
    }
  }

  function handleReset() {
    setConfirmed(false); setStep(0); setSelected(null);
    setDate(null); setSlot(null); setPersons(2);
    setForm({ name: "", email: "", phone: "", notes: "" });
    setEmailSent(false); setSendError(null);
  }

  if (confirmed) return (
    <ConfirmationScreen exp={exp} form={form} date={date} slot={slot} persons={persons}
      total={total} bookRef={bookRef} onReset={handleReset} emailSent={emailSent} />
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: SAND, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: BLUE, padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🌲</span>
          <div>
            <div style={{ color: "#B5D4F4", fontWeight: 700, fontSize: 14, letterSpacing: 1.5 }}>PINE CLIFFS RESORT</div>
            <div style={{ color: "#85B7EB", fontSize: 10 }}>Praia da Falésia · Albufeira · Algarve, Portugal</div>
          </div>
        </div>
        <div style={{ color: "#85B7EB", fontSize: 11, display: "flex", gap: 14 }}>
          {["Accommodation", "Golf & Sports", "Spa & Wellness", "Family"].map(n => <span key={n}>{n}</span>)}
          <span style={{ color: "#fff", fontWeight: 600 }}>Experiences</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${BLUE}, #0C447C)`, padding: "2rem 1.5rem 1.75rem", color: "#fff" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ fontSize: 10, color: "#B5D4F4", letterSpacing: 3, marginBottom: 6 }}>BOOK AN EXPERIENCE</div>
          <h1 style={{ fontSize: 26, fontWeight: 400, margin: "0 0 0.4rem", lineHeight: 1.2 }}>Discover Pine Cliffs</h1>
          <p style={{ color: "#85B7EB", fontSize: 13, margin: 0 }}>Golf · Tennis · Spa · Watersports · Family adventures · Private yacht excursions</p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ background: "#fff", borderBottom: `1px solid #e0e0e0`, padding: "0 1.5rem" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, padding: "0.875rem 0", textAlign: "center", borderBottom: `3px solid ${i === step ? BLUE : i < step ? TEAL : "transparent"}`, cursor: i < step ? "pointer" : "default" }} onClick={() => i < step && setStep(i)}>
              <div style={{ fontSize: 11, color: i === step ? BLUE : i < step ? TEAL : "#aaa", fontWeight: i <= step ? 600 : 400 }}>{i + 1}. {s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "1.25rem 1.5rem 3rem" }}>

        {/* STEP 0 */}
        {step === 0 && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem", flexWrap: "wrap" }}>
              {cats.map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${filter === c ? BLUE : "#ddd"}`, background: filter === c ? BLUE : "#fff", color: filter === c ? "#fff" : DARK, fontSize: 12, cursor: "pointer" }}>{c}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "0.875rem" }}>
              {filtered.map(ex => (
                <div key={ex.id} onClick={() => setSelected(ex.id)} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `${selected === ex.id ? `2px solid ${ex.color}` : "1px solid #e0e0e0"}`, cursor: "pointer", boxShadow: selected === ex.id ? `0 4px 20px rgba(24,95,165,0.15)` : "0 1px 4px rgba(0,0,0,0.05)", transform: selected === ex.id ? "translateY(-2px)" : "none", transition: "all 0.15s" }}>
                  <div style={{ background: ex.bg, padding: "1rem 1.125rem", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 26 }}>{ex.icon}</span>
                    <div>
                      <div style={{ color: ex.color, fontSize: 9, letterSpacing: 2, fontWeight: 600 }}>{ex.cat.toUpperCase()}</div>
                      <div style={{ color: DARK, fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{ex.title}</div>
                    </div>
                  </div>
                  <div style={{ padding: "0.875rem 1.125rem" }}>
                    <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6, margin: "0 0 0.625rem" }}>{ex.desc}</p>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: "0.625rem" }}>⏱ {ex.dur} · {ex.cap}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "0.625rem" }}>
                      <span style={{ fontSize: 11, color: "#888" }}>{ex.sub}</span>
                      <div><span style={{ fontSize: 20, fontWeight: 700, color: ex.color }}>€{ex.price}</span><span style={{ fontSize: 10, color: "#888" }}>/person</span></div>
                    </div>
                  </div>
                  {selected === ex.id && <div style={{ background: ex.color, padding: "0.4rem", textAlign: "center", color: "#fff", fontSize: 11, fontWeight: 600 }}>✓ Selected</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && exp && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.25rem" }}>
            <div>
              <div style={{ background: exp.bg, borderRadius: 12, padding: "0.875rem 1.125rem", display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
                <span style={{ fontSize: 24 }}>{exp.icon}</span>
                <div>
                  <div style={{ color: exp.color, fontSize: 9, fontWeight: 600, letterSpacing: 2 }}>{exp.cat.toUpperCase()}</div>
                  <div style={{ color: DARK, fontWeight: 600, fontSize: 15 }}>{exp.title}</div>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0", padding: "1.125rem", marginBottom: "1.125rem" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.875rem" }}>Number of guests</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button onClick={() => setPersons(Math.max(1, persons - 1))} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", fontSize: 18, cursor: "pointer", color: DARK }}>−</button>
                  <span style={{ fontSize: 22, fontWeight: 700, color: DARK, minWidth: 24, textAlign: "center" }}>{persons}</span>
                  <button onClick={() => setPersons(Math.min(12, persons + 1))} style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${BLUE}`, background: BLUE, fontSize: 18, cursor: "pointer", color: "#fff" }}>+</button>
                  <span style={{ color: "#888", fontSize: 12 }}>× €{exp.price}/person</span>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0", padding: "1.125rem", marginBottom: "1.125rem" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.875rem" }}>Select date</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {days.map((d, i) => (
                    <button key={i} onClick={() => { setDate(i); setSlot(null); }} style={{ padding: "7px 12px", borderRadius: 10, border: `${date === i ? `1.5px solid ${BLUE}` : "1px solid #ddd"}`, background: date === i ? BLUE : "#fff", color: date === i ? "#fff" : DARK, fontSize: 12, cursor: "pointer", textAlign: "center", minWidth: 60 }}>
                      <div style={{ fontSize: 9, opacity: 0.8 }}>{fmtWday(d)}</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{d.getDate()}</div>
                      <div style={{ fontSize: 9, opacity: 0.8 }}>{fmtShort(d).split(" ")[1]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {date !== null && (
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0", padding: "1.125rem" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.875rem" }}>Available times</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {exp.slots.map(s => (
                      <button key={s} onClick={() => setSlot(s)} style={{ padding: "9px 18px", borderRadius: 8, border: `${slot === s ? `1.5px solid ${BLUE}` : "1px solid #ddd"}`, background: slot === s ? BLUE : "#fff", color: slot === s ? "#fff" : DARK, fontSize: 15, cursor: "pointer", fontWeight: slot === s ? 700 : 400 }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0", padding: "1.125rem", position: "sticky", top: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.875rem" }}>Your booking</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: "0.875rem" }}>
                  {[["Experience", exp.title], ["Guests", `${persons}`], date !== null && ["Date", fmtLong(days[date])], slot && ["Time", slot]].filter(Boolean).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "#888" }}>{k}</span><span style={{ color: DARK, fontWeight: 500, maxWidth: 140, textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: BLUE }}>€{total}</span>
                </div>
                {date !== null && slot && <div style={{ marginTop: "0.625rem", background: LTEAL, borderRadius: 8, padding: "0.625rem", fontSize: 11, color: TEAL }}>✓ Availability confirmed for {fmtShort(days[date])} at {slot}</div>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && exp && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.25rem" }}>
            <div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0", padding: "1.375rem" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: "1.125rem" }}>Your details</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: "#888", marginBottom: 4 }}>Full name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={{ width: "100%", padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: "#888", marginBottom: 4 }}>Email address *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" style={{ width: "100%", padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#888", marginBottom: 4 }}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+351 ..." style={{ width: "100%", padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#888", marginBottom: 4 }}>Special requests</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Allergies, anniversaries, accessibility needs..." rows={3} style={{ width: "100%", padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
                </div>
                <div style={{ background: SAND, borderRadius: 10, padding: "0.875rem 1rem", marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 7 }}>🔒 Secure payment</div>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 7 }}>
                    <div><label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 3 }}>Card number</label><input type="text" placeholder="•••• •••• •••• ••••" style={{ width: "100%", padding: "7px 9px", border: "1px solid #ddd", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }} /></div>
                    <div><label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 3 }}>Expiry</label><input type="text" placeholder="MM/YY" style={{ width: "100%", padding: "7px 9px", border: "1px solid #ddd", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }} /></div>
                    <div><label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 3 }}>CVV</label><input type="text" placeholder="•••" style={{ width: "100%", padding: "7px 9px", border: "1px solid #ddd", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }} /></div>
                  </div>
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 7 }}>Demo only — no charge will be made</div>
                </div>
                {sendError && <div style={{ background: "#FFF3CD", border: "1px solid #FFDA6A", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#856404" }}>⚠️ {sendError}</div>}
                <button onClick={handleSubmit} disabled={!form.name || !form.email || sending} style={{ width: "100%", padding: "0.875rem", background: form.name && form.email && !sending ? BLUE : "#ddd", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, cursor: form.name && form.email && !sending ? "pointer" : "not-allowed", fontWeight: 600 }}>
                  {sending ? "Sending confirmation..." : `Confirm booking · €${total}`}
                </button>
              </div>
            </div>
            <div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0", padding: "1.125rem", position: "sticky", top: 12 }}>
                <div style={{ background: exp.bg, borderRadius: 8, padding: "0.875rem", marginBottom: "0.875rem", display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>{exp.icon}</span>
                  <div style={{ color: DARK, fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{exp.title}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[["Guests", `${persons}`], ["Date", fmtLong(days[date])], ["Time", slot], ["Price/person", `€${exp.price}`]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "#888" }}>{k}</span><span style={{ color: DARK, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "0.875rem", marginTop: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>Total to pay</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: BLUE }}>€{total}</span>
                </div>
                <div style={{ marginTop: "0.625rem", fontSize: 10, color: "#aaa", lineHeight: 1.5 }}>Free cancellation up to 48h before · Instant confirmation by email</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid #e0e0e0" }}>
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} style={{ padding: "9px 22px", border: "1px solid #ddd", borderRadius: 8, background: "#fff", color: step === 0 ? "#ccc" : DARK, fontSize: 13, cursor: step === 0 ? "default" : "pointer" }}>← Back</button>
          <div style={{ display: "flex", gap: 7 }}>{steps.map((_, i) => <div key={i} style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 4, background: i === step ? BLUE : i < step ? TEAL : "#ddd", transition: "all 0.2s" }} />)}</div>
          {step < 2 ? <button onClick={() => canProceed && setStep(step + 1)} disabled={!canProceed} style={{ padding: "9px 26px", border: "none", borderRadius: 8, background: canProceed ? BLUE : "#ddd", color: "#fff", fontSize: 13, cursor: canProceed ? "pointer" : "not-allowed" }}>Continue →</button> : <div style={{ width: 90 }} />}
        </div>
      </div>

      <div style={{ background: "#1a1a1a", color: "#555", padding: "1.25rem 1.5rem", textAlign: "center", fontSize: 10 }}>
        Pine Cliffs Resort · Praia da Falésia · 8200-593 Albufeira · Algarve, Portugal
        <span style={{ margin: "0 10px", color: "#333" }}>·</span>
        <span style={{ color: "#85B7EB" }}>Experiences booking powered by Turneo</span>
      </div>
    </div>
  );
}
