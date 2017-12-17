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

export interface ITradeHistoryArgs {
  pair: string;
  count?: number;
  from_id?: number;
  end_id?: number;
  order?: string;
  since?: number;
  end?: number;
}
