import { Hono, Context } from "hono";
//import { env } from 'cloudflare:workers';

const app = new Hono<{ Bindings: Env }>();
import onlinePaymentsSdk from 'onlinepayments-sdk-nodejs';

const apiEndpoint = 'payment.preprod.direct.worldline-solutions.com';
const merchantId = 'JMI';
//const wlApiKey = env.WL_API_KEY;         // get it from .env
//console.log(wlApiKey);
// const wlSecret = import.meta.env.WL_SECRET; // this is for build-time
//const wlSecret = env.WL_SECRET;


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
        apiKeyId: c.env.WL_API_KEY,
        secretApiKey: c.env.WL_SECRET
    });

    console.log("directSdk ------------------------------------------");
    console.log(directSdk);

    // use worldline sdk
    const sdkResponse = await directSdk.hostedCheckout.createHostedCheckout(
        merchantId,
        {
            order: {
                amountOfMoney: {
                    currencyCode: "EUR",   // merchant 测试账户 Dashboard 默认使用EUR货币单位
                    amount: 1000,                 // should be from front end form request information
                },

            },
    
            hostedCheckoutSpecificInput: {
                //variant: "100",
                //locale: "en_NZ",
                "paymentProductFilters": {
                    "restrictTo": {
                        "products": [2,5408,130,132,320,809,125,117,3,1,5404] //1 visa, 2 ae 3 master 320 G Pay 5404 WeChat Pay  
                    }
                }
            },
        },
    
        {}
    );

    //if sdkResponse
    console.log("sdkResponse ------------------------------------------");
    console.log(sdkResponse);
    
    
    //const partialRedirectUrl = sdkResponse.partialRedirectUrl;
    // error TS2339: Property 'partialRedirectUrl' does not exist on type 'SdkResponse<CreateHostedCheckoutResponse, ErrorResponse>'.
    
    //const baseUrl = "https://payment.";
    //const reUrl = baseUrl + partialRedirectUrl;
    //console.log("reUrl --------------------------------");
    //console.log(reUrl);
    
    // return reUrl to front end code by the mean of response
    // then front end code parse the response, get the reUrl, then call window.location.href = "https://www.example.com/new-page";
    
    //return c.json({ redirectUrl: reUrl });
    //return c.json({ redirectUrl: "https://www.google.com" }); // test ok

    console.log("redirectUrl ------------------------------------------");
    console.log(sdkResponse.redirectUrl);
    if ('redirectUrl' in sdkResponse) {
          console.log(sdkResponse.redirectUrl);
          return c.json({ redirectUrl: sdkResponse.redirectUrl });
        
    } else{
        return c.json({ redirectUrl: "https://www.google.com" });
    }
    
    
        
};



app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/checkout", (c) => checkout(c));




export default app;
