const express = require('express');
const fetch = require('node-fetch'); // v2 syntax
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for local frontend
app.use(cors());

// API key — use env in production
const API_KEY = 'API_KEY';

app.get('/isVerified/:address', async (req, res) => {
  const address = req.params.address;
  console.log("Reached",address)

  const url = `https://api.withpersona.com/api/v1/inquiries?filter[reference-id]=${address}&filter[status]=approved`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Persona-Version': '2023-01-05',
        authorization: API_KEY
      }
    });
  

    const data = await response.json();
    const isApproved = data.data.length > 0;

    res.status(200).json({
      address,
      verified: isApproved
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch verification' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

