'use strict';
var _ = require('lodash');
var util = require(rootdir+'/utils/util.js');
var fileService = require(rootdir+'/services/fileservice.js');
var fbService = require(rootdir+'/services/firebaseservice.js');
var restClientService = require(rootdir+'/services/restclientservice.js');
var dfService = require(rootdir+'/services/dialogflowservice.js');

var responsepay = {
    payload:{
        message: 'I am a bot'
    }
};

var responsedata = {
    data: {
        message: 'I am a bot'
    }
}

module.exports = {
    test: function(req, res, next){        
        res.status(200).json(responsepay);
    },
    testjson: function(req, res, next){
        fileService.getJsonData('dailytime.json', function(jsonResponse){
            responsedata.data = jsonResponse;
            res.status(200).json(responsedata);
        });
    },
	updateData:function(req,res,next){
		var payload = req.body.dialogflow;
		console.log(payload);
		fbService.updateData('/dialogflow',payload,function(jsonResp){
			console.log(jsonResp);
			res.status(200).json(jsonResp);
		});
		
	},
	getdialogflowkey:function(req,res,next){
		fbService.getData('/dialogflow', function(jsonResponse){
	        res.status(200).json(jsonResponse)
				
        });
	},

    login: function(req, res, next){
        var username = req.body.users.username;
       // var studname ='Suresh';
		fbService.getData('/login/users/', function(jsonResponse){
			var result = util.getUserDetails(jsonResponse, username);
				    
            res.status(200).json(result);
				
        });
	   
		
    },
    handleTextRequest: function(req, res, next){
       dfService.dfTextRequest(req.body, function(dfResponse){
            if(dfResponse.success){
                res.status(200).json(dfResponse);
            }else{
                res.status(400).json(dfResponse);
            }
        });
	   
		
    },

    fullfilment: function (req, res, next){
        var action = req.body.queryResult.action || '';
		var queryText = req.body.queryResult.queryText || '';
        console.log(action);
        var actionData = util.getActionConfig(action);
        console.log(actionData);
        if(actionData.length > 0){
            var data = actionData[0];
            if(data.source === 'api'){
                restClientService.getRestApi(data.url, data.options,function(response){
					var responsePayload = util.processApiData(response,queryText,data);
					res.status(200).json(responsePayload);
                })
            }
            else if(data.source === 'local'){
                fileService.getJsonData(data.url, function(jsonResponse){
					var responsePayload = util.processData(jsonResponse,queryText,data);
					res.status(200).json(responsePayload);
                });
            } else if (data.source === 'db'){
                fbService.getData(data.url, function(jsonResponse){
				    var responsePayload = util.processDbData(jsonResponse,queryText,data)
                    res.status(200).json(responsePayload);
				
                });
            } else{
                res.status(200).json(responsepay);
            }
        } else{
            res.status(200).json(responsepay);
        }
    }
};

