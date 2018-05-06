var _ = require('lodash');

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