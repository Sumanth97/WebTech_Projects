const request = require('request');
const express = require('express');
const router = express.Router();

const base_url = 'https://api.tiingo.com/iex/?tickers=';
const api_key = 'token=415a36a900c062a7bf0e75ef1eae7934117cc945';
const error = {
    status: 500,
    message: "Internal server error occoured. Please try later"
}

router.get('/:tickers', function(req, res){
try{
	let ticker = req.params.tickers;
	let url = '';
	url = base_url +  ticker + "&" + api_key; 

	request.get(url, {json: true}, function(err, response, body) {
            try {
                return res.status(200).json(processResponse(body));
            } catch (e) {
                console.log(e);
                return res.status(500).json(error);
            }
        }); 
}catch (e) {
        console.log(e);
        return res.status(500).json(error);
    }

});

function processResponse(json){
	var given = json
	
	var res = {};
	for(var i = 0; i < given.length;i+=1){
		console.log(given[i])
		var ticker_val = {};
		var ticker = given[i].ticker;
		var last = given[i].last;
		var prevClose = given[i].prevClose;
		var change = (last-prevClose).toFixed(2);
		var changePercent = ((change/prevClose)*100).toFixed(2);
		var changeColor = "";
		if(change > 0 ){
			changeColor = "#2a7f00";
		}
		else if(change < 0){
			changeColor = "#f31100";
		}
		else{
			changeColor = '#000';
		}
		ticker_val['last'] = last;
		ticker_val['change'] = change;
		ticker_val['changePercent'] = changePercent;
		ticker_val['changeColor'] = changeColor;
		console.log(ticker_val);
		res[ticker] = ticker_val;
	}
	console.log(res);
	return res;
}

module.exports = router;