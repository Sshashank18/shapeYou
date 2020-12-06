// const https = require('https');
/*
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
// const PaytmChecksum = require('./PaytmChecksum');

// var paytmParams = {};

// paytmParams.body = {
//     "requestType"   : "Payment",
//     "mid"           : "YOUR_MID_HERE",
//     "websiteName"   : "WEBSTAGING",
//     "orderId"       : "ORDERID_98765",
//     "callbackUrl"   : "https://merchant.com/callback",
//     "txnAmount"     : {
//         "value"     : "1.00",
//         "currency"  : "INR",
//     },
//     "userInfo"      : {
//         "custId"    : "CUST_001",
//     },
// };

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
// PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "YOUR_MERCHANT_KEY").then(function(checksum){

//     paytmParams.head = {
//         "signature"    : checksum
//     };

//     var post_data = JSON.stringify(paytmParams);

//     var options = {

//         /* for Staging */
//         hostname: 'securegw-stage.paytm.in',

//         /* for Production */
//         // hostname: 'securegw.paytm.in',

//         port: 443,
//         path: '/theia/api/v1/initiateTransaction?mid=YOUR_MID_HERE&orderId=ORDERID_98765',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Content-Length': post_data.length
//         }
//     };

//     var response = "";
//     var post_req = https.request(options, function(post_res) {
//         post_res.on('data', function (chunk) {
//             response += chunk;
//         });

//         post_res.on('end', function(){
//             console.log('Response: ', response);
//         });
//     });

//     post_req.write(post_data);
//     post_req.end();
// });

const shortid = require('shortid');
const checksum_lib = require('./checksum/checksum');

module.exports = (app) =>{
    console.log('in2');
    app.get('/', (req, res) => {
	
        const orderId = shortid.generate();
        const customerId = shortid.generate();
        
        var paytmParams = {
            "MID" : "cuZBeb01092536643568",
            "WEBSITE" : "WEBSTAGING",
            "INDUSTRY_TYPE_ID" : "Retail",
            "CHANNEL_ID" : "WEB",
            "ORDER_ID" : orderId,
            "CUST_ID" : customerId,
            "MOBILE_NO" : '9315360831',
            "EMAIL" : 'shashankaggarwal13@gmail.com',
            "TXN_AMOUNT" : '40',
            "CALLBACK_URL" :`https://merchant.com/callback`,
            
            // "CALLBACK_URL" :`http://127.0.0.1:3000/success?name=${req.query.name}&email=${req.query.email}&mobile=${req.query.mobile}&branch=${req.query.branch}&year=${req.query.year}&college=${req.query.college}&event=${req.query.event}&amount=${req.query.amount}`,
        };
        
        checksum_lib.genchecksum(paytmParams, "u#R7ezMHf4rNiJ3J", function(err, checksum){
            
            // var url = "https://securegw.paytm.in/order/process";
            var url = "https://securegw-stage.paytm.in/order/process"   //For testing purposes
    
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<html>');
            res.write('<head>');
            res.write('<title>Merchant Checkout Page</title>');
            res.write('</head>');
            res.write('<body>');
            res.write('<center><h1>Please do not refresh this page...</h1></center>');
            res.write('<form method="post" action="' + url + '" name="paytm_form">');
            for(var x in paytmParams){
                res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
            }
            res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
            res.write('</form>');
            res.write('<script type="text/javascript">');
            res.write('document.paytm_form.submit();');
            res.write('</script>');
            res.write('</body>');
            res.write('</html>');
            res.end();
        });
        
    });
      
};