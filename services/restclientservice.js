

const axios = require('axios');

module.exports = {
    getApiData: function (url, options, callback){
        axios.get(url, options)
          .then(function (response) {
           // console.log(response);
            callback(response.data.data);
          })
          .catch(function (error) {
            console.log(error)
              error.msg = 'error'
            callback(error);
          });

    }
    

}


