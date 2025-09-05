export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body); // Parse incoming JSON
    const { name, email, provider } = body;

    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_NAME)}`,
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
                "Client Name": name,
                Email: email,
                Provider: provider,
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
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // allow CORS
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
