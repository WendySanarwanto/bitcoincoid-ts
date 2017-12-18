import { expect } from "chai";
import "mocha";
import { isArray } from "util";
import * as winston from "winston";
import {
  BitcoinCoIdService,
  IGetOrderArgs,
  IOpenOrderArgs,
  IOrderHistoryArgs,
  ITradeHistoryArgs,
  XRP_BTC,
  XRP_IDR,
} from "../";

const BITCOINCOID_API_KEY = process.env.BCI_AK;
const BITCOINCOID_SECRET_KEY = process.env.BCI_SK;

winston.level = "debug";

describe("BitcoinCoIdService", () => {
  let bitcoinCoIdService: BitcoinCoIdService;

  before(() => {
    bitcoinCoIdService =
      new BitcoinCoIdService(BITCOINCOID_API_KEY, BITCOINCOID_SECRET_KEY);
  });

  it("should give user's balances and server's timestamp", async () => {
    // Act
    const response = await bitcoinCoIdService.getInfo();

    // Assert
    expect(response).to.be.not.equal(undefined);
    expect(response).to.be.not.equal(null);
    expect(response.success).to.be.equal(1);
    expect(response.return.balance).to.be.not.equal(undefined);
    expect(response.return.server_time).to.be.not.equal(0);
    // tslint:disable-next-line:quotemark
    winston.debug("response = \n", JSON.stringify(response, '', 2));
  });

  it("get specific order details", async () => {
    // Arrange
    const orderId: number = await getAnyOrderIdFromOrderHistory(XRP_IDR);
    const getOrderArgs: IGetOrderArgs = {
      order_id: orderId,
      pair: XRP_IDR,
    };

    // Act
    const response = await bitcoinCoIdService.getOrder(getOrderArgs);

    // Assert
    expect(response).to.be.not.equal(undefined);
    expect(response).to.be.not.equal(null);
    expect(response.success).to.be.equal(1);
    expect(response.return.order.order_id).to.be.equal(orderId.toString());
    // tslint:disable-next-line:quotemark
    winston.debug("response = \n", JSON.stringify(response, '', 2));

  });

  it("should give gives the list of current open orders (buy and sell).", async () => {
    // Arrange
    // TODO: Open an XRP Order 1st.
    const openOrderArgs: IOpenOrderArgs = {
      pair: XRP_IDR,
    };

    // Act
    const response = await bitcoinCoIdService.openOrders(openOrderArgs);

    // Assert
    expect(response).to.be.not.equal(undefined);
    expect(response).to.be.not.equal(null);
    expect(response.success).to.be.equal(1);
    expect( isArray(response.return.orders)).to.be.equal(true);
    // tslint:disable-next-line:quotemark
    winston.debug("response = \n", JSON.stringify(response, '', 2));

    // Cleanup
    // TODO: Cancel the XRP Order.
  });

  it("gives the list of order history (buy and sell).", async () => {
    // Arrange
    // NOTE: Ensure that your bitcoin.co.id's account has confirmed one or more buy/sell order in past.
    const orderHistoryArgs: IOrderHistoryArgs = {
      pair: XRP_IDR,
    };

    // Act
    const response = await bitcoinCoIdService.orderHistory(orderHistoryArgs);

    // Assert
    expect(response).to.be.not.equal(undefined);
    expect(response).to.be.not.equal(null);
    expect(response.success).to.be.equal(1);
    expect( isArray(response.return.orders) && response.return.orders.length > 0).to.be.equal(true);
    // tslint:disable-next-line:quotemark
    winston.debug("response = \n", JSON.stringify(response, '', 2));

  });

  it("gives list of deposits and withdrawals of all currencies.", async () => {
    // Act
    const response = await bitcoinCoIdService.transHistory();

    // Assert
    expect(response).to.be.not.equal(undefined);
    expect(response).to.be.not.equal(null);
    expect(response.success).to.be.equal(1);
    // tslint:disable-next-line:quotemark
    winston.debug("response = \n", JSON.stringify(response, '', 2));

  });

  it("gives information about transaction in buying and selling history.", async () => {
    // Arrange
    const tradeHistoryArgs: ITradeHistoryArgs = {
      pair: XRP_IDR,
    };

    // Act
    const response = await bitcoinCoIdService.tradeHistory(tradeHistoryArgs);

    // Assert
    expect(response).to.be.not.equal(undefined);
    expect(response).to.be.not.equal(null);
    expect(response.success).to.be.equal(1);
    // tslint:disable-next-line:quotemark
    winston.debug("response = \n", JSON.stringify(response, '', 2));

  });

  async function getAnyOrderIdFromOrderHistory(pair: string): Promise<number> {
    const orderHistoryArgs: IOrderHistoryArgs = {
      pair,
    };
    const response = await bitcoinCoIdService.orderHistory(orderHistoryArgs);
    if (response.success === 1) {
      const orders = response.return.orders;
      if (orders.length > 0) {
        return parseInt(orders[0].order_id, 10);
      }
    }

    return -1;
  }

  it("gives ticker information of a cryptocurrency", async () => {
    // Arrange
    const pair = XRP_IDR;

    // Act
    const response = await bitcoinCoIdService.ticker(pair);

    // Assert
    expect(response).to.be.not.equal(undefined);
    expect(response).to.be.not.equal(null);
    expect(response.ticker).to.be.not.equal(undefined);
    expect(response.ticker).to.be.not.equal(null);
    expect(response.ticker.server_time).to.be.greaterThan(0);

    // tslint:disable-next-line:quotemark
    winston.debug("response = \n", JSON.stringify(response, '', 2));
  });

  it("gives trades information of a cryptocurrency", async () => {
    // Arrange
    const pair = XRP_IDR;

    // Act
    const response = await bitcoinCoIdService.trades(pair);

    // Assert
    expect(response).to.be.not.equal(undefined);
    expect(response).to.be.not.equal(null);
    expect(Array.isArray(response) && response.length > 0).to.be.equal(true);
    // tslint:disable-next-line:quotemark
    winston.debug("response = \n", JSON.stringify(response, '', 2));
  });

  it("gives a list of trading depth info (buy/sell).", async () => {
    // Arrange
    const pair = XRP_IDR;

    // Act
    const response = await bitcoinCoIdService.depth(pair);

    // Assert
    expect(response).to.be.not.equal(undefined);
    expect(response).to.be.not.equal(null);
    expect(Array.isArray(response.buy) && response.buy.length > 0).to.be.equal(true);
    expect(Array.isArray(response.sell) && response.sell.length > 0).to.be.equal(true);
    // tslint:disable-next-line:quotemark
    winston.debug("response.buy = \n", JSON.stringify(response.buy, "", 2));
    // tslint:disable-next-line:quotemark
    winston.debug("response.sell = \n", JSON.stringify(response.sell, "", 2));
    winston.debug("response.buy.length = ", response.buy.length);
    winston.debug("response.sell.length = ", response.sell.length);
  });
});
