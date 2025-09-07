exports.handler = async function (event, context) {
  try {
    const response = await fetch("https://api.nango.dev/integrations", {
      headers: {
        Authorization: `Bearer ${process.env.NANGO_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const raw = await response.text();
    if (!response.ok) throw new Error(raw);

    const data = JSON.parse(raw);

    const integrations = data.data.map((i) => ({
      key: i.unique_key,
      provider: i.provider,
      name: i.display_name || i.provider,
      logo: i.logo,
    }));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(integrations),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
