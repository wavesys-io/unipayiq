# Unified payment gateway (unipayiq)

## Summary

unipayiq is a library that unify all the payment methods available in iraq ,to make it easier to developers to use and integrate with less code and complication.

## Get started

### Install

`yarn add unipayiq`

### Set env

`mv .env.example .env`

edit .env file with credintail and parameters for each payment gateway needed

### Example Sinppet

```js
const express = require('express');
const unipayiq = require("unipayiq");
const app = express();

const PORT = process.env.PORT || 3000;

// callback function is optional that will be called when a payment gateway redirect or webhook called by there servers
const callback = ({ orderID, transID, status = String, verified = Boolean, provider = String, providerDara = Object }) => {

    // do your logic

}


app.use(express.json());

// choose whatever path to attach unipayiq
app.use("/unipayiq", unipayiq(callback))


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

```

## usage

### Start a payment session

```sh
curl --request POST \
  --url https://YOUR_DOMAIN/unipay/[provider]/pay \
  --header 'content-type: application/json' \
  --data '{
 "amount" : 25000,
 "orderID" : "UNIQUE_ORDER_ID_FORM_YOUR_SYSTEM",
 "orderDesc" : "ORDER_DESC_ANY_STRING",
 "currency" : "CURRENCY_OF_PAYMENT"  -- IQD || USD || etc...
}'
```

### Chech transaction

```sh
curl --request POST \
  --url https://YOUR_DOMAIN/unipay/[provider]/check \
  --header 'content-type: application/json' \
  --data '{
 "transID" : "TRANSACTION_ID_TO_CHECK",
}'
```

### providers

- zain
- switch
- amwal
- tasdid
- aps

### Use the name of providers in the request url, see the example below

https://YOUR_DOMAIN/unipay/zain/check
## Contribution

pull requests are welcome to integrate more providers bug fixes or to improve documentation
if there is any bug or errors please make new issue in the repo
