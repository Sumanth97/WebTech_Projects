const request = require('request');
const express = require('express');
const router = express.Router();

const base_url = 'https://api.tiingo.com/tiingo/daily/';
const api_key = 'token=415a36a900c062a7bf0e75ef1eae7934117cc945';
const error = {
    status: 500,
    message: "Internal server error occoured. Please try later"
}
router.get('/:ticker', function(req, res){
try{
	let ticker = req.params.ticker;
	let url = '';
	url = base_url +  ticker + "?" + api_key; 

	request.get(url, {json: true}, function(err, response, body) {
            try {
                return res.status(200).json(body);
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


module.exports = router;