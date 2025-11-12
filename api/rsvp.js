// File: /api/rsvp.js

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Reject anything that's not POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers for actual POST response
  res.setHeader('Access-Control-Allow-Origin', '*');

  let body = req.body;

  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { name, email, experience, attendance, gear } = body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  try {
    console.log('Sending email to:', process.env.HOST_EMAIL);
    console.log('Payload:', { name, email, experience, attendance, gear });

    await resend.emails.send({
      from: 'RSVP Bot <noreply@resend.dev>',
      to: [process.env.HOST_EMAIL],
      subject: 'New RSVP Received',
      html: `
        <h2>New RSVP Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Experience:</strong> ${experience || 'N/A'}</p>
        <p><strong>Attendance:</strong> ${attendance || 'N/A'}</p>
        <p><strong>Gear:</strong> ${gear || 'N/A'}</p>
      `,
    });

    res.status(200).json({ message: 'RSVP confirmed' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Email failed' });
  }
};