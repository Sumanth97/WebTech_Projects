const request = require('request');
const express = require('express');
const router = express.Router();

const base_url = 'https://newsapi.org/v2/everything?apiKey=';
const api_key = 'f5be45586354438f87b15e025a8d2602';
const error = {
    status: 500,
    message: "Internal server error occoured. Please try later"
}

router.get('/:ticker', function(req, res){
try{
	let ticker = req.params.ticker;
	let url = '';
	url = base_url + api_key +  "&q=" + ticker + "&pageSize=30" ; 

	request.get(url, {json: true}, function(err, response, body) {
            try {
                let processed_articles = process_articles(body);
                return res.status(200).json(processed_articles);
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

function is_empty(string) {
    return (string === null || string === undefined || string === "");
}

function is_article_title_valid(article) {
    return (article.hasOwnProperty("title") && !is_empty(article.title));
}

function is_article_image_path_valid(article) {
    if(article.hasOwnProperty("urlToImage") &&
        !is_empty(article.urlToImage)) {
            return true;
        }
    return false;
}

function is_article_source_valid(article) {
    return (article.hasOwnProperty("source") && !is_empty(article.source));
}

function is_article_date_valid(article) {
    return (article.hasOwnProperty("publishedAt") && !is_empty(article.publishedAt));
}

function is_article_url_valid(article) {
    return (article.hasOwnProperty("url") && !is_empty(article.url));
}

function is_article_description_valid(article) {
    return (
        article.hasOwnProperty("description") &&
        !is_empty(article.description)
    )
}

function is_valid_article(article) {
    return (
        article !== null &&
        article !== undefined &&
        is_article_title_valid(article) &&
        is_article_image_path_valid(article) &&
        is_article_source_valid(article) &&
        is_article_date_valid(article) &&
        is_article_url_valid(article) &&
        is_article_description_valid(article)
    )
}

process_articles = function(json) {
    let modified_results = [];
    for(let i = 0; i < json.articles.length; i++) {
        let current_article = json.articles[i];
        if(is_valid_article(current_article)) {
            //current_article = process_guardian_article_detail_response(current_article);
            modified_results.push(current_article);
        } else {
            console.log("Invalid Article Found");
        }
    }
    json.articles = modified_results;
    return json;
}
module.exports = router;