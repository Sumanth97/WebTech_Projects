const request = require('request');
const express = require('express');
const router = express.Router();

const base_url = 'https://api.tiingo.com/iex/';
const api_key = 'token=415a36a900c062a7bf0e75ef1eae7934117cc945';
const error = {
    status: 500,
    message: "Internal server error occoured. Please try later"
}

router.get('/:ticker/:date', function(req, res){
try{
	let ticker = req.params.ticker;
    let date = req.params.date;
	let url = '';
    // let date = new Date();
    // date.setDate(date.getDate()-4);
    // date = formatDate(date);
    //console.log(date);
	url = base_url +  ticker + "/prices?startDate=" + date + "&resampleFreq=4min" + "&" + api_key; 

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

// function formatDate(date) {
//     var d = date,
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();

//     if (month.length < 2) 
//         month = '0' + month;
//     if (day.length < 2) 
//         day = '0' + day;

//     return [year, month, day].join('-');
// }

module.exports = router;