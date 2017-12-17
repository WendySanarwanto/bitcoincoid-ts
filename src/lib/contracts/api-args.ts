export interface ICancelOrderArgs {
  order_id: number;
  pair: string;
  type: string;
}

export interface IGetOrderArgs {
  order_id: number;
  pair: string;
}

export interface IOpenOrderArgs {
  pair?: string;
}

export interface IOrderHistoryArgs {
  count?: number;
  from?: number;
  pair: string;
}

export interface ITradeArgs {
  pair: string;
  type: string;
  price: number;
  idr?: number;
  btc?: number;
}

export interface ITradeHistoryArgs {
  pair: string;
  count?: number;
  from_id?: number;
  end_id?: number;
  order?: string;
  since?: number;
  end?: number;
}
