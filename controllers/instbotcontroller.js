'use strict';
var _ = require('lodash');
var util = require(rootdir+'/utils/util.js');
var fileService = require(rootdir+'/services/fileservice.js');
var fbService = require(rootdir+'/services/firebaseservice.js');
var restClientService = require(rootdir+'/services/restclientservice.js');
var dfService = require(rootdir+'/services/dialogflowservice.js');
var moment = require('moment');

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

 function sendslackmessage(msg){
    //var msg = req.body.slack;
    var result =  util.postDataToSlack(msg,true);
    console.log(result);
    
    if(result)
       return result
    else
        return 'error'
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
    getnlpWords:function(req,res,next){
        var id = req.body.approvalId;
        var msg = '';
        //fbService.searchData('/npwords','id',id, function(jsonResponse){
        fbService.getData('/npwords',function(jsonResponse){
        
            msg = msg+ 'Approval ID : '+id + '\n';
          var npwords = util.getNpWords(jsonResponse,id);
          console.log(npwords);
            _.forEach(npwords[0].words, function(value) {
                msg = msg + value + '\n';
              });
    
              var result =  sendslackmessage(msg)
              res.status(200).json(result);
				
        });

    },
	
    createintent:function(req, res, next){
        var unixdatetime = moment().valueOf();
        var actionData = util.getActionConfig("instbot.createintent");
        var data = actionData[0];
        
        var url = data.url+"?v="+unixdatetime;
        console.log(url);
        restClientService.getRestApi(url, data.options,function(response){
            console.log(response);
            res.status(200).json(response);
        })
    },
    postfromslack:function(req, res, next){
        console.log("req from slack=",req.body)
        var msg = "Thank you for approval.";
        console.log(req.body.text)
        var textArr = req.body.text.split('#');
        var approvalId =  +textArr[1];
        fbService.getData('/npwords',function(jsonResponse){
            if(!jsonResponse)
                return null;
             var npwords = util.getNpWords(jsonResponse,approvalId);
               console.log(npwords)
               fbService.deleteData('/npwords',npwords,function(jsonResp){
                fbService.insertData('/npwords',npwords,function(jsonResp){

                    var result = util.postDataToSlack(msg,false);
                    
                     if(result)
                         res.status(200).json("Posted to Slack"); 
                     else
                         res.status(400).json("Error while Posting to Slack"); 

                });
                
                
                });
            });  
        
    },
	updateData:function(req,res,next){
		var payload = req.body.dialogflow;
		console.log(payload);
		fbService.updateData('/config/nlp/dialogflow',payload,function(jsonResp){
			console.log(jsonResp);
			res.status(200).json(jsonResp);
		});
		
	},
	getdialogflowkey:function(req,res,next){
		fbService.getData('config/nlp/dialogflow', function(jsonResponse){
	        res.status(200).json(jsonResponse)
				
        });
	},

    login: function(req, res, next){
        var username = req.body.users.username;
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

