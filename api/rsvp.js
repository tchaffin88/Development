// api/rsvp.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, phone } = req.body;
    console.log("RSVP received:", name, phone);

    // You could add logic here to send SMS, store in a database, etc.
    res.status(200).json({ message: "RSVP confirmed" });
}
