let express = require('express');
let router = express.Router();
let btoa = require('btoa')
let request = require('request')

router.post('/', function(req, res, next) {
    var token = btoa(req.body.username + ':' + req.body.password);
    let options = {
        rejectUnauthorized: false,
        url: 'https://constellation.soprasteria.com/jira2/rest/api/2/user?username=' + req.body.username,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token
        }
    };
    function callback(error, response, body) {
        console.log(error)
        if (!error && response.statusCode == 200) {
            return res.json({token: 'Basic ' + token})
        }
            return res.sendStatus(401)
    }

    request(options, callback);
});

module.exports = router;
