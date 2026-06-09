export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, notes, experience, date, slot, persons, total, bookRef } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  if (!RESEND_API_KEY) return res.status(500).json({ error: 'RESEND_API_KEY not configured' });

  const emailHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><style>body{background-color:#f4f4f4;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;}table{border-collapse:collapse;}p{margin:0;padding:0;}a{color:#185FA5;}</style></head><body style="background-color:#f4f4f4;margin:0;padding:0;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr><td bgcolor="#185FA5" align="center" style="padding:20px 12px 0px 12px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:652px;">
<tr><td bgcolor="#ffffff" align="center" style="padding:24px 24px 0px 24px;border-radius:4px 4px 0px 0px;">
<div style="margin-bottom:20px;display:inline-block;">
  <div style="display:inline-flex;align-items:center;gap:10px;">
    <div style="background:#185FA5;border-radius:6px;padding:5px 14px;"><span style="color:#fff;font-size:15px;font-weight:700;font-family:monospace;">turneo</span></div>
  </div>
</div>
<p style="font-size:18px;font-weight:600;margin:0 0 12px;color:#000;line-height:1.4;text-align:left;">You have a new booking for ${experience.title} on ${date}.</p>
<p style="font-size:14px;color:#333;margin-bottom:8px;text-align:left;">This booking is now confirmed. No further action is required.</p>
<p style="font-size:14px;color:#333;margin-bottom:16px;text-align:left;">Below are the key booking details. You can view all information in your Turneo Hub.</p>
<div style="text-align:center;margin-bottom:24px;"><a href="https://app.turneo.co/organizer/bookings" style="display:inline-block;padding:8px 24px;background-color:#185FA5;border-radius:50px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">Turneo Hub</a></div>
</td></tr></table></td></tr>

<tr><td bgcolor="#F3F3F3" align="center" style="padding:16px 12px 0px 12px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:652px;">
<tr><td bgcolor="#fff" align="left" style="padding:16px 12px 24px 12px;border-radius:4px;font-size:14px;line-height:22px;">

<h2 style="font-size:17px;font-weight:600;margin:0 0 4px;">${experience.icon} ${experience.title}</h2>
<p style="margin:0 0 12px;color:#555;">${experience.sub} · ${experience.cat}</p>

<div style="width:100%;height:72px;background:${experience.bg};border-radius:8px;margin-bottom:14px;display:table;"><div style="display:table-cell;vertical-align:middle;text-align:center;"><span style="font-size:28px;">${experience.icon}</span> <span style="font-size:16px;font-weight:600;color:${experience.color};">${experience.title}</span></div></div>

<p style="margin-bottom:6px;"><span style="color:#185FA5;">Date:</span> ${date}</p>
<p style="margin-bottom:6px;"><span style="color:#185FA5;">Time:</span> ${slot}</p>
<p style="margin-bottom:6px;"><span style="color:#185FA5;">Meeting point:</span> Pine Cliffs Resort, Praia da Falésia, 8200-593 Albufeira</p>
<p style="margin-bottom:6px;"><span style="color:#185FA5;">Sold by:</span> Pine Cliffs Resort</p>

<div style="background-color:#F2F2F2;padding:12px;margin-top:20px;margin-bottom:20px;border-radius:4px;">
<p style="margin:0 0 8px;font-weight:600;">Payment information</p>
<p style="margin-bottom:6px;"><span style="color:#185FA5;">Payment processed by:</span> Turneo</p>
<p style="margin-bottom:6px;"><span style="color:#185FA5;">Total price:</span> €${total}</p>
<p style="margin-bottom:0;"><span style="color:#185FA5;">Your earnings:</span> €${(parseFloat(total)*0.85).toFixed(2)}</p>
</div>

<p style="margin-top:24px;margin-bottom:8px;font-weight:600;">Booking information:</p>
<p style="margin-bottom:6px;"><span style="color:#185FA5;">Guest name:</span> ${name.toUpperCase()}</p>
${phone ? `<p style="margin-bottom:6px;"><span style="color:#185FA5;">Phone:</span> ${phone}</p>` : ''}
<p style="margin-bottom:6px;"><span style="color:#185FA5;">Booking ID:</span> ${bookRef}</p>
<p style="margin-bottom:6px;"><span style="color:#185FA5;">Units:</span> ${persons} ${parseInt(persons)===1?'Guest':'Guests'}</p>
${notes?`<p style="margin-bottom:6px;"><span style="color:#185FA5;">Notes:</span> ${notes}</p>`:''}

</td></tr></table></td></tr>

<tr><td bgcolor="#F3F3F3" align="center" style="padding:16px 12px 40px 12px;">
<table width="100%" style="max-width:652px;margin:0 auto;">
<tr><td align="center" style="padding:16px 12px;font-family:Arial,sans-serif;">
<p style="margin:0;font-size:12px;color:#666;text-align:center;line-height:1.6;">Questions? Email us at <a href="mailto:support@turneo.com" style="color:#185FA5;">support@turneo.com</a>.<br/>Turneo Ltd is registered in the UK at 71-75 Shelton Street, London, WC2H 9JQ, UK</p>
</td></tr></table></td></tr>
</table></body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Pine Cliffs Resort Experiences <${FROM_EMAIL}>`,
        to: [email],
        subject: `Confirmed: New booking for ${experience.title} on ${date} — ${bookRef}`,
        html: emailHtml,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.message || 'Error sending email' });
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
