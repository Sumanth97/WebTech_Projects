const request = require('request');
const express = require('express');
const router = express.Router();

const base_url = 'https://api.tiingo.com/tiingo/utilities/search?query=';
const api_key = 'token=415a36a900c062a7bf0e75ef1eae7934117cc945';
const error = {
    status: 500,
    message: "Internal server error occoured. Please try later"
}

router.get('/:ticker', function(req, res){
try{
	let ticker = req.params.ticker;
	let url = '';
	url = base_url +  ticker + "&" + api_key; 

	request.get(url, {json: true}, function(err, response, body) {
            try {
                let processed_json = process_response(body);
                return res.status(200).json(processed_json);
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

function isempty(string) {
    return (string === null || string === undefined || string === "");
}

is_valid_result = function(result) {
	return (result !== null && result !== undefined
		&& result.hasOwnProperty('name') && !isempty(result.name)
		&& result.hasOwnProperty('ticker') && !isempty(result.ticker));
}

process_response = function(json) {
    let modified_result = [];
    for(let i = 0; i < json.length; i++) {
        let current_result = json[i];
        if(is_valid_result(current_result) && modified_result.length <=10) {
            modified_result.push(current_result);
        } else {
            console.log("Invalid stock Found");
        }
    }
    json = modified_result;
    return json;
}

module.exports = router;