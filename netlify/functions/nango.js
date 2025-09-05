export async function handler(event, context) {
  try {
    const response = await fetch("https://api.nango.dev/integrations", {
      headers: {
        Authorization: `Bearer ${process.env.NANGO_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();

    const providers = data.integrations.map((p) => ({
      provider: p.provider,
      display_name: p.display_name || p.provider,
    }));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // allow Duda
        "Content-Type": "application/json",
      },
      body: JSON.stringify(providers),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
