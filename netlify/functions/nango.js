export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.nango.dev/integrations", {
      headers: {
        "Authorization": `Bearer ${process.env.NANGO_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();

    // Simplify payload before sending to client
    const providers = data.integrations.map(p => ({
      provider: p.provider,
      display_name: p.display_name || p.provider
    }));

    res.setHeader("Access-Control-Allow-Origin", "*"); // allow Duda
    res.status(200).json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
