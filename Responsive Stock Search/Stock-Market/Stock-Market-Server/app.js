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
//var path = require('path');


// app.use(express.static(path.join(__dirname, 'dist/Stock-Market')));

// //Any routes will be redirected to the angular app
// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'dist/Stock-Market/index.html'));
// });

// const port = process.env.PORT || 3000;

// const server =  http.createServer(app);
// console.log("port number is "+ port);
// server.listen(port);


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

app.use(express.static('public'));

const bodyParser=require("body-parser");
// const fetch   = require('node-fetch');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(process.cwd()+"/public/Stock-Market/"));
app.get('*', (req,res) => {
    res.sendFile(process.cwd()+"/public/Stock-Market/")
  });

const corsOptions={
    "origin": "*"
}
app.use(cors(corsOptions));
const port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log('Server started!');
    console.log('on port 8081');
});
