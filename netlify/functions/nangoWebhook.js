// /.netlify/functions/nangoWebhook.js
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const webhookData = JSON.parse(event.body);
    console.log("Nango webhook received:", webhookData);

    // 👉 If this is a forwarded provider webhook (e.g. HubSpot lead)
    if (webhookData.from === "nango" && webhookData.type === "webhook") {
      console.log("✅ Lead or provider data received:", webhookData.data);
      // Not changing any functionality, just logging
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Lead data logged" }),
      };
    }

    // ✅ Existing functionality for auth events
    if (webhookData.from !== "nango" || webhookData.type !== "auth") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid webhook type or source" }),
      };
    }

    // Extract relevant fields
    const connectionId = webhookData.connectionId || "";
    const provider = webhookData.provider || "";
    const clientId = webhookData.endUser?.endUserId || "";
    const success = webhookData.success === true ? "CONNECTED" : "FAILED";
    const environment = webhookData.environment || "";
    const operation = webhookData.operation || "";
    const providerConfigKey = webhookData.providerConfigKey || "";

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
                Provider_Config_Key: providerConfigKey,
                Client_ID: clientId,
                Status: success,
                Environment: environment,
                Operation: operation,
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
}
