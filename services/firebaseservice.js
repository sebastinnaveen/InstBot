var admin = require('firebase-admin');
var firebaseNodejs = require('firebase-nodejs')
var serviceAccount = require(rootdir+'/config/awscaas-firebase-adminsdk-58pyh-5e323ef242.json');
var fbConnection =  admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://awscaas.firebaseio.com"
		});


module.exports = {
	 getFBData: function(url, callback){
        var fbresponse = {
            message:"Data from firebase"
        }
        callback(fbresponse);
    },
	
	getData: function(url,callback){
	firebaseNodejs.selectData(fbConnection, url, 'value', response => {
			callback(response);
		});
	}


}