exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { connectionId, providerConfigKey } = JSON.parse(event.body);

    if (!connectionId || !providerConfigKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing connectionId or providerConfigKey",
        }),
      };
    }

    const NANGO_SECRET_KEY = process.env.NANGO_SECRET_KEY;

    const res = await fetch(`https://api.nango.dev/records?model=Contact`, {
      method: "GET",
      headers: {
        "provider-config-key": providerConfigKey,
        "connection-id": connectionId,
        Authorization: `Bearer ${NANGO_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, leads: data }),
    };
  } catch (err) {
    console.error("Error fetching leads:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
