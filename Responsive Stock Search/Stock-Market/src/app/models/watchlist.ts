export class Watchlist {
    ticker: object;

    deserialize(input:any): this{
        return Object.assign(this,input);
    }
}
