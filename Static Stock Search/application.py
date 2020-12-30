from flask import Flask, current_app, request
import json
from datetime import *
from dateutil.relativedelta import *

import requests

application = Flask(__name__)
url = "https://api.tiingo.com/"
token = "?token=415a36a900c062a7bf0e75ef1eae7934117cc945"
headers = {
    'Content-Type': 'application/json'
}

@application.route('/')
def index():
    return current_app.send_static_file("index.html")

@application.route('/get-stocks', methods = ['GET'])
def stock_search():
    try:
        stock_name = request.args.get('s_ticker',"")
        company_outlook_url = url+"tiingo/daily/" + stock_name+ token
        requestinfo = requests.get(company_outlook_url, headers=headers)
        return requestinfo.text
    except Exception as exception:
        return {'status': 'error', 'code': 'Internal Server Error.',
                'message': 'There is an internal error. Please try the same query after sometime.'}

@application.route('/get-summary', methods = ['GET'])
def stock_summary():
    try:
        stock_name = request.args.get('s_ticker',"")
        stock_summary_url = url + "iex/" + stock_name + token
        requestinfo = requests.get(stock_summary_url, headers=headers)
        return requestinfo.text
    except Exception as exception:
        return {'status': 'error', 'code': 'Internal Server Error.',
                'message': 'There is an internal error. Please try the same query after sometime.'}

@application.route('/get-charts', methods = ['GET'])
def get_charts():
    try:
        stock_name = request.args.get('s_ticker',"")
        TODAY = date.today()
        start = TODAY+relativedelta(months=-6)
        stock_chart_url = url + "iex/" + stock_name + "/prices?startDate="+ start.strftime("%Y-%m-%d")+\
                          "&resampleFreq=12hour&columns=open,high,low,close,volume&token="+"415a36a900c062a7bf0e75ef1eae7934117cc945"
        requestinfo = requests.get(stock_chart_url, headers=headers)
        return requestinfo.text

    except Exception as exception:
        return {'status': 'error', 'code': 'Internal Server Error.',
                'message': 'There is an internal error. Please try the same query after sometime.'}

@application.route('/get-News', methods = ['GET'])
def get_news():
    try:
        stock_name = request.args.get('s_ticker', "")
        news_url = "https://newsapi.org/v2/everything?apiKey=" + 'f5be45586354438f87b15e025a8d2602' + "&q=" + stock_name\
                   + "&pageSize=30"
        all_articles = json.loads((requests.get(news_url, headers = headers)).text)
        req_articles = []
        for result in all_articles["articles"]:
            temp = validate_article(result)
            if temp:
                req_articles.append(result)
        all_articles["articles"] = req_articles[:5]
        return all_articles
    except Exception as exception:
        return {'status': 'error', 'code': 'Internal Server Error.',
                'message': 'There is an internal error. Please try the same query after sometime.'}

def validate_article(article):
    if not article['title'] or not article["url"] or not article["urlToImage"] or not article["publishedAt"]:
        return False
    return True

if __name__ == "__main__":
    application.run(debug=True)