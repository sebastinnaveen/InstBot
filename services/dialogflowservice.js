var apiai = require('apiai');
let axios = require('axios');

var api_url = 'https://techbot-244314.appspot.com/np'

module.exports = {
    dfTextRequest: function(request, callback){
        console.log(dynamicConfig.nlp.dialogflow.client_key);
        var app = apiai(dynamicConfig.nlp.dialogflow.client_key);

        var request = app.textRequest(request.text, {
            sessionId: request.sessionId
        });
        
        request.on('response', function(response) {
            //console.log(response);
            if(response.result.action === 'input.unknown'){
                axios.post(api_url, {
                    searchStr: response.result.resolvedQuery
                })
                    .then(function (response) {
                        console.log(response);
                        //callback(response);
                    })
                    .catch(function (error) {
                        //error.msg = 'error'
                        //callback(error);
                        console.log(error);
                    });
            }
            callback({success: true, data: response});
        });
        
        request.on('error', function(error) {
            //console.log(error);
            callback({success: false, data: error});
        });
        
        request.end();
    }
    
}