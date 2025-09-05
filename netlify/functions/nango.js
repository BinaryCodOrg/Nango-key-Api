export async function handler(event, context) {
  try {
    const response = await fetch("https://api.nango.dev/providers", {
      headers: {
        Authorization: `Bearer ${process.env.NANGO_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const raw = await response.text();
    if (!response.ok) throw new Error(raw);

    const data = JSON.parse(raw);

    // Nango returns { data: [ ...providers ] }
    const providers = data.data.map((p) => ({
      provider: p.provider,
      display_name: p.display_name || p.provider,
      logo: p.logo,
      categories: p.categories || [],
    }));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
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
