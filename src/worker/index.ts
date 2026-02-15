import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();
const onlinePaymentsSdk = require('onlinepayments-sdk-nodejs');

const apiEndpoint = 'payment.preprod.direct.worldline-solutions.com';
const merchantId = 'JMI';
const wlApiKey = '';         // get it from .env
const wlSecret = '';

const checkout = function(name) {

    // get order information from front end page Button OnClick event handler function

    // init worldline sdk
    const directSdk = onlinePaymentsSdk.init({
        integrator: merchantId,
        host: apiEndpoint, 
        scheme: 'https', 
        port: 443, 
        enableLogging: true, 
        //logger: logger, 
        apiKeyId: wlApiKey,
        secretApiKey: wlSecret
    });

    // use worldline sdk
    const sdkResponse = await directSdk.hostedCheckout.createHostedCheckout(
        merchantId,
        {
            order: {
                amountOfMoney: {
                    currencyCode: "USD",
                    amount: 2345,                 // should be from front end form request information
                },
                customer: {
                    merchantCustomerId: "1234",
                    billingAddress: {
                        countryCode: "US",
                    },
                },
            },
    
            hostedCheckoutSpecificInput: {
                variant: "testVariant",
                locale: "en_GB",
            },
        },
    
        {}
    );
    
    const partialRedirectUrl = sdkResponse.partialRedirectUrl;
    const baseUrl = "https://payment.";
    reUrl = baseUrl + partialRedirectUrl;
    
    // return reUrl to front end code by the mean of response
    // then front end code parse the response, get the reUrl, then call window.location.href = "https://www.example.com/new-page";
    
    return reUrl;
        
};



app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/checkout", (c) => checkout);




export default app;
