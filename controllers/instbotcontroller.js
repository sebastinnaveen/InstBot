'use strict';
var _ = require('lodash');
var util = require(rootdir+'/utils/util.js');
var fileService = require(rootdir+'/services/fileservice.js');
var fbService = require(rootdir+'/services/firebaseservice.js');
var restClientService = require(rootdir+'/services/restclientservice.js');
var dfService = require(rootdir+'/services/dialogflowservice.js');
var crawlService = require(rootdir+'/services/crawlservice.js');
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
    getCrawl: function(req, res, next){
        var actionData = {
            url:' https://markets.businessinsider.com/stocks/credit_suisse-stock',
            parsing: [
                {
                    parsetxt:'Current',
                    selector:'.push-data.aktien-big-font.text-nowrap'
                },
                {
                    parsetxt:'Prev. Close',
                    selector:'.price-row-price'
                }

            ],
            message:'hi'
        }
        var queryText = ''

        crawlService.crawlData(actionData, function(result){
            var responsePayload = util.processData(result,queryText,actionData);
            res.status(200).json(responsePayload);
        })
    },
    getnlpWords:function(req,res,next){
        var id = req.body.approvalId;
        var msg = '';
        //fbService.searchData('/npwords','id',id, function(jsonResponse){
        fbService.getData('/npwords',function(jsonResponse){
        
            msg = msg+ 'Approval ID : '+id + '\n';
          var npwords = util.getWordsId(jsonResponse,id);
          console.log(npwords);
            _.forEach(npwords[0].words, function(value) {
                msg = msg + value + '\n';
              });
    
              var result =  sendslackmessage(msg)
              res.status(200).json(result);
				
        });

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

    
    handleTextRequest: function(req, res, next){
       dfService.dfTextRequest(req.body, function(dfResponse){
          // console.log(dfResponse.data);
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
        var params = req.body.queryResult.parameters || {};
        var actionData = util.getActionConfig(action);
        if(actionData.length > 0){
            var data = actionData[0];
            //console.log(data)
            if(data.source === 'api'){
                var url = _.template(data.url);
                restClientService.getApiData(url(params), data.options,function(response){
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
            } else if(data.source === 'crawl'){


                crawlService.crawlData(data, function(result){
                    console.log(result);
                    var responsePayload = util.processData(result,queryText,data);
					res.status(200).json(responsePayload);
                })
                
            } else if(data.source === 'text'){
               // processTextData
                var responsePayload = util.processTextData(data.message);
					res.status(200).json(responsePayload);
               // res.status(200).json(data.message);
            }            
            else{
                res.status(200).json(responsepay);
            }
        } else{
            res.status(200).json(responsepay);
        }
    }
};

