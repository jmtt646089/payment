import { Hono, Context } from "hono";
const app = new Hono<{ Bindings: Env }>();
import onlinePaymentsSdk from 'onlinepayments-sdk-nodejs';

const apiEndpoint = 'payment.preprod.direct.worldline-solutions.com';
const merchantId = 'JMI';
const wlApiKey = import.meta.env.WL_API_KEY;         // get it from .env
//const wlSecret = import.meta.env.WL_SECRET;

const checkout = async function(c: Context) {

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
        secretApiKey: import.meta.env.WL_SECRET
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

    console.log(sdkResponse);
    
    //const partialRedirectUrl = sdkResponse.response.partialRedirectUrl;
    // error TS2339: Property 'partialRedirectUrl' does not exist on type 'SdkResponse<CreateHostedCheckoutResponse, ErrorResponse>'.
    
    //const baseUrl = "https://payment.";
    //const reUrl = baseUrl + partialRedirectUrl;
    console.log("reUrl --------------------------------");
    //console.log(reUrl);
    
    // return reUrl to front end code by the mean of response
    // then front end code parse the response, get the reUrl, then call window.location.href = "https://www.example.com/new-page";
    
    //return c.json({ redirectUrl: reUrl });
    return c.json({ redirectUrl: "hahaha.com" });
        
};



app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/checkout", (c) => checkout(c));




export default app;
