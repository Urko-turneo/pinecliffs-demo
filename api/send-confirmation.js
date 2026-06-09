export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, notes, experience, date, slot, persons, total, bookRef } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  if (!RESEND_API_KEY) return res.status(500).json({ error: 'RESEND_API_KEY not configured' });

  const earnings = (parseFloat(total) * 0.85).toFixed(2);

  const rows = (arr) => arr.filter(Boolean).map(([k,v]) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #F4EFE8;font-size:10px;color:#B8965A;letter-spacing:2px;width:160px;">${k}</td>
     <td style="padding:8px 0;border-bottom:1px solid #F4EFE8;font-size:13px;color:#1A1714;font-weight:500;text-align:right;">${v}</td></tr>`
  ).join('');

  const emailHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<style>body{background:#f4f4f4;margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;}table{border-collapse:collapse;}p{margin:0;padding:0;}</style>
</head><body style="background:#f4f4f4;margin:0;padding:0;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr><td bgcolor="#1A1714" align="center" style="padding:20px 12px 0;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:652px;">
<tr><td bgcolor="#ffffff" style="padding:40px 40px 0;border-radius:4px 4px 0 0;text-align:center;">
  <div style="font-size:10px;color:#B8965A;letter-spacing:5px;margin-bottom:16px;">PINE CLIFFS RESORT</div>
  <div style="width:40px;height:1px;background:#B8965A;margin:0 auto 24px;"></div>
  <p style="font-size:20px;font-weight:400;margin:0 0 16px;color:#1A1714;line-height:1.5;text-align:left;font-family:Georgia,serif;">
    A new booking has been confirmed for ${experience.title} on ${date}.
  </p>
  <p style="font-size:13px;color:#6B5F52;margin-bottom:8px;text-align:left;line-height:1.7;">No further action required. The guest will receive their own confirmation separately.</p>
  <p style="font-size:13px;color:#6B5F52;margin-bottom:24px;text-align:left;line-height:1.7;">View full booking details in your Turneo Hub.</p>
  <div style="text-align:center;margin-bottom:32px;">
    <a href="https://app.turneo.co/organizer/bookings" style="display:inline-block;padding:12px 32px;background:#1A1714;border:1px solid #B8965A;color:#B8965A;font-size:10px;letter-spacing:3px;text-decoration:none;">TURNEO HUB</a>
  </div>
</td></tr></table></td></tr>

<tr><td bgcolor="#F3F3F3" align="center" style="padding:16px 12px 0;">
<table width="100%" style="max-width:652px;margin:0 auto;">
<tr><td bgcolor="#fff" style="padding:32px 40px;border-radius:4px;">

  <div style="border-bottom:1px solid #E8DFD0;padding-bottom:20px;margin-bottom:20px;">
    <div style="font-size:9px;color:#B8965A;letter-spacing:4px;margin-bottom:8px;">EXPERIENCE</div>
    <div style="font-size:20px;color:#1A1714;font-family:Georgia,serif;font-weight:400;margin-bottom:4px;">${experience.title}</div>
    <div style="font-size:12px;color:#6B5F52;">${experience.sub}</div>
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    ${rows([["DATE",date],["TIME",slot],["MEETING POINT","Pine Cliffs Resort, Praia da Falésia, 8200-593 Albufeira"],["SOLD BY","Pine Cliffs Resort"]])}
  </table>

  <div style="background:#F4EFE8;border-left:3px solid #B8965A;padding:20px;margin-bottom:24px;">
    <div style="font-size:9px;color:#B8965A;letter-spacing:4px;margin-bottom:12px;">PAYMENT</div>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${rows([["Processed by","Turneo"],["Total charged","€"+total],["Your earnings","€"+earnings]])}
    </table>
  </div>

  <div style="font-size:9px;color:#B8965A;letter-spacing:4px;margin-bottom:12px;">GUEST DETAILS</div>
  <table width="100%" cellpadding="0" cellspacing="0">
    ${rows([["NAME",name.toUpperCase()],phone?["PHONE",phone]:null,["BOOKING ID",bookRef],["UNITS",persons+" "+(parseInt(persons)===1?"guest":"guests")],notes?["NOTES",notes]:null])}
  </table>

</td></tr></table></td></tr>

<tr><td bgcolor="#F3F3F3" style="padding:16px 12px 40px;">
<table width="100%" style="max-width:652px;margin:0 auto;">
<tr><td style="padding:24px 12px;text-align:center;">
  <div style="width:40px;height:1px;background:#B8965A;margin:0 auto 16px;"></div>
  <p style="font-size:10px;color:#999;line-height:2;letter-spacing:1px;">
    QUESTIONS? <a href="mailto:support@turneo.com" style="color:#B8965A;">SUPPORT@TURNEO.COM</a><br/>
    TURNEO LTD · 71-75 SHELTON STREET · LONDON WC2H 9JQ
  </p>
</td></tr></table></td></tr>
</table></body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Pine Cliffs Resort Experiences <${FROM_EMAIL}>`,
        to: [email],
        subject: `Confirmed — ${experience.title} · ${date} · ${bookRef}`,
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
