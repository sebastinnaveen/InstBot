const request = require('request');
const reqp= require('request-promise');
var Client = require('node-rest-client').Client;

var client = new Client();

module.exports = {
    getApiData: function(url, callback) {
        request.get(url,function(error,response,body){
          callback(response);
         
    })
	},
	getApiDataPromise: function(url, callback) {
        reqp.get(url).then(function(response){
       
                callback(response);
        
    })
	.catch(function(err){
		callback(err)
	})
   },
   getRestApi: function(url,args,callback){
		client.get(url, args,function (data, response) {
        callback(data);
    });
   }
}

