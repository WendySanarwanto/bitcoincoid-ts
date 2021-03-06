import { createHmac } from "crypto";
import * as moment from "moment";
import * as queryString from "query-string";
import * as rp from "request-promise-native";
import * as winston from "winston";
import {
  CANCEL_ORDER_API,
  GET_INFO_API,
  GET_ORDER,
  OPEN_ORDERS_API,
  ORDER_HISTORY_API,
  TRADE_API,
  TRADE_HISTORY_API,
  TRANS_HISTORY_API,
  WITHDRAW_COIN_API,
} from ".";
import {
  ICancelOrderArgs,
  IGetOrderArgs,
  IOpenOrderArgs,
  IOrderHistoryArgs,
  ITradeArgs,
  ITradeHistoryArgs,
  IWithdrawCoinArgs,
} from "./contracts/api-args";
import * as Pairs from "./pair.constants";

const PUBLIC_API_PATH = `https://vip.bitcoin.co.id/api/`;
const TRADE_API_PATH = `https://vip.bitcoin.co.id/tapi/`;

export class BitcoinCoIdService {
  constructor(private apiKey: string, private secretKey: string) { }

  // #region Public API methods

  /**
   * Get ticker information of a cryptocurrency by specified pair.
   * @param pair Define the cryptocurrency's pair. E.g. xrp_idr, btc_idr
   */
  public ticker(pair) {
    return this.callPublicApi(pair, "/ticker");
  }

  /**
   * Get a list of buy & sell trades that are still going on Bitcoin.co.id
   * @param pair Define the cryptocurrency's pair. E.g. xrp_idr, btc_idr
   */
  public trades(pair) {
    return this.callPublicApi(pair, "/trades");
  }

  /**
   * Get a list of trading depth info (buy/sell).
   * @param pair Define the cryptocurrency's pair. E.g. xrp_idr, btc_idr
   */
  public depth(pair) {
    return this.callPublicApi(pair, "/depth");
  }

  // #endregion

  // #region Private API methods

  /**
   * Cancel an existing open order.
   * @param {*} cancelOrderArgs:
   *        {
   *          pair: "Required: Yes. Desc: Pair to get the information from. Value: Constant in pair.constant.js.
   *                 Default: btc_idr "
   *          order_id: "Required: Yes. Desc: Order ID. Value: integer"
   *          type: "Required: Yes. Desc: transaction type (buy/sell). Value: buy/sell."
   *        }
   */
  public cancelOrder(cancelOrderArgs: ICancelOrderArgs) {
    return this.callPrivateApi(CANCEL_ORDER_API, cancelOrderArgs);
  }

  /**
   * Gives user's balances and server's timestamp
   */
  public getInfo() {
    return this.callPrivateApi(GET_INFO_API);
  }

  /**
   * Get specific order details.
   * @param {*} getOrderArgs Arguments of getOrder API.
   *        {
   *          pair: "Required: Yes. Desc: Pair to get the information from. Value: Constant in pair.constant.js.
   *                 Default: btc_idr "
   *          order_id: "Required: Yes. Desc: Order ID. Value: integer"
   *        }
   */
  public getOrder(getOrderArgs: IGetOrderArgs) {
    return this.callPrivateApi(GET_ORDER, getOrderArgs);
  }

  /**
   * Gives the list of current open orders (buy and sell).
   * @param {*} openOrdersArg:
   *        {
   *          pair: "Required: No. Desc: Pair to get the information from.
   *                Value: Constant in pair.constant.js. Default: btc_idr"
   *        }
   */
  public openOrders(openOrdersArg?: IOpenOrderArgs) {
    return this.callPrivateApi(OPEN_ORDERS_API, openOrdersArg);
  }

  /**
   * Gives the list of order history (buy and sell).
   * @param {*} orderHistoryArgs :
   *        {
   *          pair: "Required: Yes. Desc: Pair to get the information from. Value: Constant in pair.constant.js.
   *                 Default: btc_idr".
   *          count: "Required: no. Value: integer. Default: 100".
   *          from: "Required: no. Value: integer. Default: 0".
   *        }
   */
  public orderHistory(orderHistoryArgs: IOrderHistoryArgs) {
    return this.callPrivateApi(ORDER_HISTORY_API, orderHistoryArgs);
  }

  /**
   * Opening a new order.
   * @param {*} tradeArgs :
   *         {
   *            pair: "Required: Yes. Desc: Pair to get the information from. Value: Constant in pair.constant.js.
   *                   Default: btc_idr".
   *            type: "Required: Yes. Desc: transaction type (buy or sell). Value: 'buy' or 'sell'."
   *            price: "Required: Yes. Desc: transaction type (buy or sell). Value: 'buy' or 'sell'."
   *            idr: "Required: Only when buying BTC. Desc: Amount in IDR. Value: "
   *            btc: "Required: Only when selling BTC. Desc: Amount in BTC to sell. Value: number."
   *         }
   */
  public trade(tradeArgs: ITradeArgs) {
    return this.callPrivateApi(TRADE_API, tradeArgs);
  }

  /**
   * Gives list of deposits and withdrawals of all currencies.
   */
  public transHistory() {
    return this.callPrivateApi(TRANS_HISTORY_API);
  }

  /**
   * Gives information about transaction in buying and selling history.
   * @param {*} tradeHistoryArgs:
   *        {
   *          pair: "Required: Yes. Desc: Pair to get the information from. Value: Constant in pair.constant.js.
   *                 Default: btc_idr
   *          count: "Required: No. Desc: number of transaction which will be displayed. Value: numerical.
   *                  Default: 1000"
   *          from_id: "Required: No. Desc: first ID. Value: numerical. Default: 0"
   *          end_id: "Required: No. Desc: end ID. Value: numerical. Default: ∞"
   *          order: "Required: No. Desc: sort by. Value: asc / desc. Default: desc"
   *          since: "Required: No. Desc: start time. Default: UNIX time (UTC Milisec)"
   *          end: "Required: No. Desc: end. Default: UNIX time (UTC Milisec)"
   *        }
   */
  public tradeHistory(tradeHistoryArgs: ITradeHistoryArgs) {
    return this.callPrivateApi(TRADE_HISTORY_API, tradeHistoryArgs);
  }

  /**
   * Withdrawing assets (except IDR)
   * @param {*} withdrawCoinArgs:
   *         {
   *           currency: "Required: Yes. Desc: Currency to withdraw. Value: btc, ltc, xrp, doge, eth, etc. "
   *           withdraw_address: "Required: Yes. Desc: Receiver address. Value: a valid address."
   *           withdraw_amount: "Required: Yes. Desc: Amount to send. Value: number."
   *           withdraw_memo: "Rerquired: Yes. Desc: Memo to be sent to the receiver, if supported by
   *                           the asset platform. Exchanges use this memo for accepting deposits for
   *                           certain assets. Example: Destination Tag (for Ripple), Message (for NXT)
   *                           Memo (for BitShares). Value: a valid memo/message/destination tag."
   *           request_id: "Required: Yes. Desc: Custom string you need to provide to  identify
   *                        each withdrawal request. request_id will be passed to callback call
   *                        so your system can identify the request. Value: alphanumeric, max length 255/"
   *         }
   */
  public withdrawCoin(withdrawCoinArgs: IWithdrawCoinArgs) {
    return this.callPrivateApi(WITHDRAW_COIN_API, withdrawCoinArgs);
  }

  // #endregion

  // #region Helper Methods

  /**
   * A helper which wrap the details of calling Bitcoin.co.id's Trading API
   * @param {string} name Name of the API
   * @param {*} args the API's argument.
   */
  private callPrivateApi(name: string, args?: any) {
    const body = this.createPostData(name, args);
    const headers = this.createHeaders(body);
    return this.doPost(body, headers);
  }

  /**
   * A helper which wrap details of calling Bitcoin.co.id's public API
   * @param pair Define the cryptocurrency's pair. E.g. xrp_idr, btc_idr
   * @param path Path of the public API to invoke.
   */
  private callPublicApi(pair: string, path: string) {
    const apiUrl = `${PUBLIC_API_PATH}${pair}${path}`;
    return rp({
      json: true,
      method: "get",
      uri: apiUrl,
    });
  }

  /**
   * A helper method for making a /POST HTTP request by specified payload & headers.
   * @param {*} body Payload to POST.
   * @param {*} headers Request's headers to attach.
   */
  private doPost(body: any, headers: any) {
    const options = {
      body,
      headers,
      json: true,
      method: "POST",
      uri: TRADE_API_PATH,
    };

    return rp(options);
  }

  /**
   * A helper for creating Bitcoin.co.id's Post Data
   * @param {*} args The method's arguments object.
   * @param {string} methodName Name of the Bitcoin.co.id's API.
   */
  private createPostData(methodName: string, args: any) {
    const postData = {
      method: methodName,
      nonce: moment.utc().valueOf(),
    };

    if (args) {
      const argNames = Object.keys(args);
      if (argNames.length > 0) {
        for (const argName of argNames) {
          postData[argName] = args[argName];
        }
      }
    }

    return queryString.stringify(postData);
  }

  /**
   * A helper for creating Request Headers , used for calling Bitcoin.co.id's API
   * @param {*} contentData Stringified query string which may carry the called method's arguments.
   */
  private createHeaders(contentData: string) {
    const signKey =   createHmac("sha512", Buffer.from(this.secretKey, "utf8" ))
    .update(Buffer.from(contentData, "utf8"))
    .digest("hex");

    return {
      "Key": this.apiKey,
      "Sign": signKey,
      "content-length": contentData.length,
      "content-type": "application/x-www-form-urlencoded",
    };
  }
  // #endregion
}
