var _ = require('lodash');
var Slack = require('slack-node');
var responseData= {
	payload : {
		displaytype: '',
		message: '',
		data :{
			
		}
	}
}

module.exports = {
    getActionConfig: function(action){
        var result = _.filter(config.orgs.aaa.actions, function(data){
            return data.action === action;
        })

        return result;
    },
	postDataToSlack:function(message,isApproval){
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
						"fallback": "",
						"callback_id": "approval",
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
	getUserDetails : function(users, username){
		var result = _.filter(users, function(data){
            return data.username.toLowerCase() === username.toLowerCase();
        })
		return result;
	},
	processApiData: function(response,queryText,actionData){
	
		if(queryText!='' && queryText.toLowerCase()==='project'){
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
			}
			
			return responseData;
		}
		
		
	},
	processDbData: function(response,queryText,actionData){
		
				responseData.payload.data = response;
				responseData.payload.displaytype = actionData.displaytype;
				responseData.payload.message = actionData.message;
		
		return responseData;
	},
	processData: function(response,queryText,actionData){
		responseData.payload.data = response;
		responseData.payload.displaytype = actionData.displaytype;
		responseData.payload.message = actionData.message;
		
		return responseData;
	}
	
}
