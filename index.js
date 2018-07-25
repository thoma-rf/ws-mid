/*
var request = require("request");

request("http://www.sitepoint.com", function(error, response, body) {
  console.log(body);
});
*/

var http = require('http');

var qs = require('querystring');

http.createServer(function (request, res) {

  if (request.method == 'POST') {


    if (request.url == "/charge") {
      var body = '';

      request.on('data', function (data) {
        body += data;
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
          request.connection.destroy();
      });

      request.on('end', function () {
        // var post = qs.parse(body);
        // use post['blah'], etc.
        console.dir(JSON.parse(body));
        execCharge(body, res, function(dataku){
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(dataku);
          res.end();
        });
        return;
      });
    }

  }else{

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('{ "aha": "Hello World!","location":"'+request.url+'" }');
    // res.write('{ "aha": "Hello World!" }');
    //  == '/charge'
    res.end();
  }

}).listen(8080);



function execCharge(bodyku, res, callme) {

  var request = require('request');

  var server_key = Buffer.from('SB-Mid-server-MTd20cl1WzZcEnQjRenBegr4:').toString('base64')

  // Set the headers
  var headers = {
    'User-Agent': 'Secret Agent/0.0.1',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Basic ' + server_key
  }

  // Configure the request
  var options = {
    url: 'https://app.sandbox.midtrans.com/snap/v1/transactions',    // sandbox
    method: 'POST',
    headers: headers,
    body: bodyku

  }

  // console.log('server key : ' + server_key );
  console.log('sent header : ' + JSON.stringify(headers));

  // Start the request
  request(options, function (error, response, body) {
    if (!error) {
      // Print out the response body
      console.log('success');
      console.log(body);
      callme(body);
    } else {
      console.log('response' + response.statusCode);
      console.log('response' + response.body);
    }
  })

}