# bitcoincoid-ts
A bitcoin.co.id API's wrapper, written in Typescript language.

## What is this ?

This is a Typescript library, contains a Service class which wrap calls to [Bitcoin.co.id](https://www.bitcoin.co.id/)'s API endpoints, in several methods. [Bitcoin.co.id](https://www.bitcoin.co.id/) is a platform which provides exchange services for Digital Assets such as Bitcoin, Ethereum, Ripple, which accepts Indonesian Rupiah fiat money. [Bitcoin.co.id](https://www.bitcoin.co.id/) also releases Public & Private API to allow 3rd party developers creating applications which access Bitcoin.co.id's services such as getting ticker information to Trading services. This library is intended for wrapping the API so that Javascript or Typescript developers could use this library, in case they want to integrate [Bitcoin.co.id](https://www.bitcoin.co.id/)'s services in their Node.js applications.

The original API documentation can be downloaded from [here](https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf).

## How to use the library in a Node.js application

* Run `npm install bitcoincoid-ts --save` command inside your Node.js project's directory

* In your Javascript's application/library file, import the `BitcoinCoIdService` class
  ```Typescript
  import { BitcoinCoIdService } from 'bitcoincoid-ts';
  ```

* Supposed, we would like to call `orderHistory` API to get a list of our Ripple-IDR (XRP-IDR) Orders history list. Then, we import additional type & constant that will be used for calling this API's method, in  later lines.
  ```Typescript
  import {
    BitcoinCoIdService,
    IOrderHistoryArgs,
    XRP_IDR,
  } from 'bitcoincoid-ts';
  ```
* In your method that need to call the `orderHistory` API, you will add these lines to call the API:
```Typescript

  // Assumed, we have put API KEY & SECRET KEY into environment variables
  const BITCOINCOID_API_KEY = process.env.BCI_AK;
  const BITCOINCOID_SECRET_KEY = process.env.BCI_SK;

  async myAwesomeApi() {
    // ...some code    
    const orderHistoryArgs: IOrderHistoryArgs = {
      pair: XRP_IDR,
    };

    const bitcoinCoIdService = 
      new BitcoinCoIdService(BITCOINCOID_API_KEY, BITCOINCOID_SECRET_KEY);
    const response = await bitcoinCoIdService.orderHistory(orderHistoryArgs);

    // ... some code to proses the response
  }
```

* See the original API documentation from [here](https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf), to get a list of available methods to call.

## The Library's structure

Below is the structure of this Node library:

```
  - index.ts
  - lib
      |- index.ts
      |- contracts
      |         |- api-args.ts
      |         |- index.ts
      |- api-name.constants.ts
      |- bitcoin-co-id.service.ts
      |- pair.consants.ts
      |- index.ts      
```

TODO: Explain details of the structure.


## How to run the system test of this library ?

TBD

## Found bug(s) / got idea to improve this library to be better ?

TBD