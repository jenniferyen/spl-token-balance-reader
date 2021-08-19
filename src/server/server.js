const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const config = require('./config');

const app = express();
app.use(cors());
const port = 8000;

const requestOptions = {
  method: 'GET',
  uri: `${config.coinMarketCapEndpointUrl}/v1/cryptocurrency/quotes/latest`,
  qs: {
    symbol: 'SOL',
  },
  headers: {
    "Accept": "application/json",
    "Access-Control-Allow-Origin": `${config.coinMarketCapEndpointUrl}`,
    'X-CMC_PRO_API_KEY': config.coinMarketCapAPIKey,
  },
  json: true,
  gzip: true,
};

app.get('/getSolanaPrice', (req, res) => {
  rp(requestOptions).then(response => {
    const SOL_price = response.data.SOL.quote.USD.price;
    res.send({ SOL_price: SOL_price });
  }).catch((error) => {
    console.log('Error fetching CoinMarketCap data: ', error.message);
  });
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
