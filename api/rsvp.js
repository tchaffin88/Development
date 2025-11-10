import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, phone } = req.body;
    console.log("RSVP received:", name, phone);

    try {
        await client.messages.create({
            body: `Mission confirmed, ${name}. Directions inbound.`,
            from: process.env.TWILIO_PHONE,
            to: phone,
        });
        res.status(200).json({ message: "RSVP confirmed and SMS sent" });
    } catch (err) {
        console.error("Twilio error:", err);
        res.status(500).json({ error: "SMS failed" });
    }
}