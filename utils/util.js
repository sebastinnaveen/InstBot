var _ = require('lodash');
var Slack = require('slack-node');
var responseData= {
	payload : {
		displaytype: '',
		message: '',
		data :{
			
		},
		responsekeys: []
	}
}

module.exports = {
    getActionConfig: function(action){
        var result = _.filter(dynamicConfig.actions, function(data){
            return data.action === action;
        })

        return result;
    },
	postDataToSlack: function(message,isApproval){
        webhookUri = "https://hooks.slack.com/services/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";
        
       slack = new Slack();
       slack.setWebhook(webhookUri);
		
	   if(isApproval){
				slack.webhook({
					channel: "#faqbotapproval",
					username: "faqbot",
					text: message,
					"attachments": [
						{
						"text": "",
						"fallback": "approve_fb",
						"callback_id": "approval_faqwf",
						"color": "#3AA3E3",
						"attachment_type": "default",
						"actions": [
							{
							"name": "approval",
							"text": "Approve",
							"type": "button",
							"value": "approve"
							},
							{
							"name": "approval",
							"text": "Reject",
							"type": "button",
							"value": "reject"
							}
						]
						}
					]
				}, function(err, response) {
					console.log(response);
					return false;
				});
	}else{
		slack.webhook({
			channel: "#faqbotapproval",
			username: "faqbot",
			text: message
		  }, function(err, response) {
			console.log(response);
			return false;
		  });
	}
	   console.log("Posted to slack");
       return true;
       
	},
	getNpWords : function(obj, approvalId){
		
		_.forEach(obj, function(data){
			
            if(data.id === approvalId){
				data.status = 'approved';
			}
		})
		
		return obj;
	},
	getWordsId : function(obj, approvalId){
		
		var r = _.filter(obj, function(data){
			
            return data.id === approvalId
		})
		
		return r;
	},
	getUserDetails : function(users, username){
		var result = _.filter(users, function(data){
            return data.username.toLowerCase() === username.toLowerCase();
        })
		return result;
	},
	processApiData: function(response,queryText,actionData){
		responseData= {
			payload : {
				displaytype: '',
				message: '',
				data :{
					
				},
				responsekeys: []
			}
		}
		/*if(queryText!='' && queryText.toLowerCase()==='project'){
			console.log(response);
			var jsonData = response
			if(jsonData.length > 0){
				var jsonArray =[];
					for(var i=0;i<jsonData.length;i++)
					{
						var tickets={
							"title":jsonData[i].title,
							"issueId":jsonData[i].number
							}
									
						jsonArray.push(tickets);
					}
				
				responseData.payload.data = jsonArray;
				responseData.payload.displaytype = actionData.displaytype;
				responseData.payload.message = actionData.message;
			}*/
			if(queryText!=''){
				var newData = [];
				if(actionData.responsekeys && actionData.responsekeys.length > 0){
					if(_.isArray(response)){
						newData = [];
						_.each(response, function(re){
							var d = _.pick(re, actionData.responsekeys);
							newData.push(d);
						})
	
					}else {
						newData.push(_.pick(response, actionData.responsekeys));
					}
				}else{
					newData.push(response);
				}
				
				responseData.payload.message = actionData.message;
				responseData.payload.responsekeys = actionData.responsekeys;
				responseData.payload.data = newData;
			}
			
			return responseData;
		},
		
		

	processDbData: function(response,queryText,actionData){
		responseData= {
			payload : {
				displaytype: '',
				message: '',
				data :{
					
				},
				responsekeys: []
			}
		}
			var newData;
			if(actionData.responsekeys.length > 0){
				if(_.isArray(response)){
					newData = [];
					_.each(response, function(re){
						var d = _.pick(re, actionData.responsekeys);
						newData.push(d);
					})

				}else {
					newData.push(_.pick(response, actionData.responsekeys));
				}
			}else{
				newData.push(response);
			}
				responseData.payload.data = newData;
				responseData.payload.responsekeys = actionData.responsekeys;
				responseData.payload.message = actionData.message;
		
		return responseData;
	},
	processTextData: function (msg){
		responseData= {
			payload : {
				displaytype: '',
				message: '',
				data :{
					
				},
				responsekeys: []
			}
		}
		responseData.payload.message = msg;

		return responseData;
	},
	processData: function(response,queryText,actionData){
		responseData= {
			payload : {
				displaytype: '',
				message: '',
				data :{
					
				},
				responsekeys: []
			}
		}

		responseData.payload.data = response;
		responseData.payload.displaytype = actionData.displaytype;
		responseData.payload.message = actionData.message;
		
		return responseData;
	}
	
}
