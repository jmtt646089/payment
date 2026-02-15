import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();
const onlinePaymentsSdk = require('onlinepayments-sdk-nodejs');

const apiEndpoint = 'payment.preprod.direct.worldline-solutions.com';
const merchantId = 'JMI';
const wlApiKey = '';         // get it from .env
const wlSecret = '';

// get order information from front end page Button OnClick event handler function

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




const sdkResponse = await directSdk.hostedCheckout.createHostedCheckout(
    merchantId,
    {
        order: {
            amountOfMoney: {
                currencyCode: "USD",
                amount: 2345, // from front end form information
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


app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/checkout", (c) => c.json({ name: "Cloudflare" }));




export default app;
