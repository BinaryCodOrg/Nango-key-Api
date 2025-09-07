
exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const clientId = event.queryStringParameters.clientId;
    if (!clientId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing clientId parameter" }),
      };
    }

    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/NangoHookRes?filterByFormula=Client_ID='${clientId}'`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await airtableRes.json();

    // Return only successful connections
    const connectedTools = (data.records || []).filter(
      (record) => record.fields.Status === "CONNECTED"
    );

    return {
      statusCode: 200,
      body: JSON.stringify(connectedTools),
    };
  } catch (err) {
    console.error("Error fetching integrations:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
