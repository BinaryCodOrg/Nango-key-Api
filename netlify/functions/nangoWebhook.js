// /.netlify/functions/nangoWebhook.js
exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const webhookData = JSON.parse(event.body);
    console.log("Nango webhook received:", webhookData);

    // Extract relevant fields from the webhook
    const connectionId = webhookData.connection_id || "";
    const provider = webhookData.provider || "";
    const clientId = webhookData.end_user?.id || "";
    const status = webhookData.status || "";

    // Post to Airtable NangoHookRes table
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/NangoHookRes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Connection_ID: connectionId,
                Provider: provider,
                Client_ID: clientId,
                Status: status,
              },
            },
          ],
        }),
      }
    );

    const data = await airtableRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (err) {
    console.error("Error handling Nango webhook:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
