import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }

  try {
    await resend.emails.send({
      from: 'RSVP Bot <rsvp@lan-party.com>',
      to: process.env.HOST_EMAIL,
      subject: 'New RSVP Received',
      html: `
        <h2>New RSVP</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    res.status(200).json({ message: "Mission confirmed. Directions inbound." });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Email failed" });
  }
}