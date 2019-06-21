var apiai = require('apiai');



module.exports = {
    dfTextRequest: function(request, callback){
        console.log(dynamicConfig.nlp.dialogflow.client_key);
        var app = apiai(dynamicConfig.nlp.dialogflow.client_key);

        var request = app.textRequest(request.text, {
            sessionId: request.sessionId
        });
        
        request.on('response', function(response) {
            //console.log(response);
            callback({success: true, data: response});
        });
        
        request.on('error', function(error) {
            //console.log(error);
            callback({success: false, data: error});
        });
        
        request.end();
    },
    createintent:function(request,callback){
        
            var app = apiai(dynamicConfig.nlp.dialogflow.client_key);
            var request = app.intentPostRequest(request);
            request.on('response', function(response) {
                //console.log(response);
                callback({success: true, data: response});
            });
            
            request.on('error', function(error) {
                //console.log(error);
                callback({success: false, data: error});
            });
            
            request.end();
        
    }
}