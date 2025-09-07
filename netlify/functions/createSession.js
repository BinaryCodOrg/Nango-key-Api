
exports.handler = async function (event) {
  try {
    // Log body to debug
    console.log("event.body:", event.body);

    // Parse safely
    let parsedBody = {};
    try {
      parsedBody = JSON.parse(event.body || "{}");
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON in request body" }) };
    }

    const { clientId, toolKey } = parsedBody;

    if (!clientId || !toolKey) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing clientId or toolKey" }) };
    }

    const NANGO_SECRET_KEY = process.env.NANGO_SECRET_KEY;

    const response = await fetch("https://api.nango.dev/connect/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NANGO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        end_user: { id: clientId },
        allowed_integrations: [toolKey],
        "success_redirect_url": "https://nango-tools-getter.netlify.app/integrations.html?clientId=123&clientName=John" // chang it according to live link
      }),
    });

    const data = await response.json();

    return { statusCode: response.status, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
