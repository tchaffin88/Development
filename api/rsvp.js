import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    let body = req.body;

    // If body is undefined, parse it manually
    if (!body || typeof body === "string") {
        try {
            body = JSON.parse(req.body);
        } catch (err) {
            return res.status(400).json({ error: "Invalid JSON body" });
        }
    }

    const { name, email } = body;

    if (!name || !email) {
        return res.status(400).json({ error: "Missing name or email" });
    }

    try {
        await resend.emails.send({
            from: 'RSVP Bot <you@resend.dev>', // use resend.dev for now
            to: process.env.HOST_EMAIL,
            subject: 'New RSVP Received',
            html: `<p><strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}</p>`,
        });

        res.status(200).json({ message: "RSVP confirmed" });
    } catch (err) {
        console.error("Email error:", err);
        res.status(500).json({ error: "Email failed" });
    }
}
