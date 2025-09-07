exports.handler = async function (event) {
  const { clientId, connectionId } = JSON.parse(event.body);

  try {
    const res = await fetch(
      `${process.env.NANGO_API_URL}/proxy/${connectionId}/crm/leads`,
      { headers: { Authorization: `Bearer ${process.env.NANGO_SECRET_KEY}` } }
    );
    const leads = await res.json();

    for (const lead of leads) {
      await fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(
          process.env.AIRTABLE_TABLE_NAME
        )}`,
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
                  client_ID: clientId,
                  Lead_Name: lead.name,
                  Lead_Email: lead.email,
                },
              },
            ],
          }),
        }
      );
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, leads }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
