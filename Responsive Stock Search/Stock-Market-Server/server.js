const cors = require('cors');
const http =  require('http');
const express = require('express');
const autosuggest_router = require('./autosuggest_api');
const watchlist_router = require('./watchlist_api');
const portfolio_router = require('./portfolio_api');
const stock_details_router = require('./stock_api');
const stock_price_router = require('./stockPrice_api');
const stock_chart_router = require('./chart_data_api');
const stock_data_router = require('./historic_data_api');
const stock_news_router = require('./news_api');
const app = express();

const port = process.env.PORT || 3000;

const server =  http.createServer(app);
server.listen(port);

const router = express.Router();

app.use(cors());
app.use("/search", autosuggest_router);
app.use("/watchlist",watchlist_router);
app.use("/portfolio",portfolio_router);
app.use("/details/",stock_details_router);
app.use("/details/price/",stock_price_router);
app.use("/details/chart/",stock_chart_router);
app.use("/details/data/",stock_data_router);
app.use("/details/news/",stock_news_router);

module.exports = app;