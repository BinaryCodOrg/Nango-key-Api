exports.handler = async function (event) {
  const clientId = event.queryStringParameters.clientId;

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(
        process.env.AIRTABLE_TABLE_NAME
      )}?filterByFormula={client_ID}="${clientId}"`,
      { headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_TOKEN}` } }
    );
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data.records) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
