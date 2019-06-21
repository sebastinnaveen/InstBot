

const axios = require('axios');

module.exports = {
    getApiData: function (url, options, callback){
        axios.get(url, options)
          .then(function (response) {
            //console.log(response);
            callback(response);
          })
          .catch(function (error) {
              error.msg = 'error'
            callback(error);
          });

    }
    

}


