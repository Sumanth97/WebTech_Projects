export class StockPrice {
    ticker : string;
    timestamp : string;
    //lastSaleTimestamp : string;
    last: number;
    prevClose : number;
    open : number;
    high : number;
    low : number;
    mid : number;
    volume : number;
    bidSize : number;
    bidPrice : number;
    askSize : number;
    askPrice : number;
    change? : number;
    currentTimestamp? : string;
    changePercent? : number;
    color? : string;
}
