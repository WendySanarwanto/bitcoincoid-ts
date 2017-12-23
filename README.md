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

* `index.ts` - within the library's root folder & subfolders, we placed `index.ts` for exporting any types reside in the folder to up one level above of it. This will allow developers to import any types within the library, regardless of where they are being placed within. Example: As a developer we need to import `IOrderHistoryArgs` interface and `XRP_IDR` constant, to be used for calling the `BitcoinCoIdService`'s `orderHistory` method. The common way to do this is by writing these lines:

```Typescript
  import { BitcoinCoIdService } from 'bitcoincoid-ts';
  import { IOrderHistoryArgs } from 'bitcoincoid-ts/lib/contracts/api-args';
  import { XRP_IDR } from 'bitcoincoid-ts/lib/api-name.constants';
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; However, we can write these lines to import these type & constant too, as shown in this following snippet:

```Typescript
  import {
    BitcoinCoIdService,
    IOrderHistoryArgs,
    XRP_IDR,
  } from 'bitcoincoid-ts';
```

* `lib` folder - This is the folder that contain all of this library's files and a subfolder  which hold method argument types. All of these files will be explained in next points.

* `api-name.constants.ts` - Contains the API Name constants that are internally referenced by `bitcoin-co-id.service.ts`. Therefore, developer should not need to use these constants

* `bitcoin-co-id.service.ts` - The main class that wraps calls to [Bitcoin.co.id](https://www.bitcoin.co.id/)'s API as public methods. The naming of Bitcoin.co.id's API is retained on each of these public methods. For example: A call to `orderHistory` API can be done through invoking `orderHistory` method of `bitcoin-co-id.service.ts`. The original API documentation can be downloaded from [here](https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf).

* `pair.constants.ts` - Contains a list of Constants which define a pair of cryptocurrencies. On several API methods, some of them requires one of these constants to be supplied in as one of their argument. In case you will need to call one of this API Methods (e.g. `getOrder` method), you can refer and use this constant instead of typing them as literal string.

* `contracts\api-args.ts` - Contains a interfaces which represent the API's Request contracts. When calling a `bitcoin-co-id.service.ts`'s method which takes an argument object, the argument should be typed as one of these defined contract. Example: you need to import `IOrderHistoryArgs` interface in order to call `bitcoin-co-id.service.ts`'s `orderHistory` method, because the method accepts argument that is typed as `IOrderHistoryArgs` interface.

## How to run the system test of this library ?

* Get the Bitcoin.co.id's API Key & Secret Key from your Bitcoin.co.id's account page. Then, export them as environment variables in your machine. Example:

```bash
  export BITCOINCOID_API_KEY=yourbitcoincoidApiKey
  export BITCOINCOID_SECRET_KEY=yourbitcoincoidSecretKey
```

* Clone this repository into your machine through running this command on a terminal window: `git clone https://github.com/WendySanarwanto/bitcoincoid-ts.git`

* Change directory to the cloned project's directory. Then run `npm install` to install all required dependencies.

* Run `npm run test` for running the system test.


## Found bug(s) / got idea to improve this library to be better ?

When using this library, you may find something is not working as expected or you have an idea to improve this library to be better. Feel free to report issues that you may find when using this library or you could submit your pull request of your enhancement idea / bug fixes.

## Donations

Do you find this library is useful in your project and would like to appreaciate this work ? You could do it through donating some of your crypto coins /tokens into these wallets here:

* Ripple/XRP: rhwpiuXMfysWRSfJ9KoQaDA4fR7ggYiNXk

* ARK:        Aefy4SSMDa4vidVQdDAU5aMwhUffypCkqB