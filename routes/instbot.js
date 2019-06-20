'use strict';

var express = require('express');
var router = express.Router();
var controller = require(rootdir+'/controllers/instbotcontroller');

//initlize firebase
/*firebase.initializeApp({
  databaseURL: config.firebase.databaseURL,
  serviceAccount: config.firebase.serviceAccount
});*/

router.get('/test', function(req, res, next){
    controller.test(req, res, next);
});
router.get('/testjson', function(req, res, next){
  controller.testjson(req, res, next);
})
router.get('/getdialogflowkey', function(req, res, next){
  controller.getdialogflowkey(req, res, next);
})
router.post('/sendslackmessage', function(req, res, next){
  controller.sendslackmessage(req, res, next);
})
router.post('/postfromslack', function(req, res, next){
  controller.postfromslack(req, res, next);
})

router.post('/login', function(req, res, next){
  controller.login(req, res, next);
});
router.post('/nlp', function(req, res, next){
  controller.handleTextRequest(req, res, next);
});
router.post('/fullfilment', function(req, res, next){
  controller.fullfilment(req, res, next);
});
router.post('/updatedata', function(req, res, next){
  controller.updateData(req, res, next);
});

module.exports = router;
