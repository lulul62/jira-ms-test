let express = require('express');
let router = express.Router();
let request = require('request');
var mLab = require('mongolab-data-api')('mqZL_DwTTvjcbABJ-OmwUx2wfRKxoUbc')
var convert = require('xml-js')
var apicache = require('apicache')

let cache = apicache.middleware


router.post('/rest/api/run', cache('5 minutes'), (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://constellation.soprasteria.com/jira2/rest/api/latest/search?jql=project=' + req.body.applicationId + ' AND issuetype=incident AND status in (New, Rejected, Doing, Validated) and Reference is not null&fields=components,status,customfield_10014,status,summary,customfield_10582, customfield_10555, customfield_10545, aggregatetimespent, customfield_10010, duedate, assignee\n' +
            ' &maxResults=-1',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
});


router.post('/rest/api/build', cache('5 minutes'), (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://constellation.soprasteria.com/jira2/rest/api/latest/search?jql=project=' + req.body.applicationId + ' AND issuetype = Change AND status in (DELIVERED, NEW, STARTED, TESTED, ACCEPTED, DEVELOPED, QUALIFIED, QUOTED, STUDIED, "TAKEN INTO ACCOUNT", VALIDATED)&fields=components ,customfield_10582,versions, summary, status, customfield_10525, customfield_10010, customfield_10542,  customfield_10501, customfield_10525, customfield_10520, customfield_10578, customfield_10559, customfield_10608,customfield_10577,customfield_10545, customfield_10600, tpsEstimeIssue, customfield_10544, aggregatetimespent, aggregatetimeestimate, aggregatetimeoriginalestimate, issuetype, customfield_10580, customfield_10587, customfield_10578, customfield_10570, customfield_10571, customfield_10593, customfield_10603, customfield_10507, customfield_10607, customfield_10538, duedate,  name_u155, assignee,  status, &maxResults=-1',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
});

router.post('/rest/api/deleteEvents',  (req, res, next) => {
    mLab.deleteDocuments({
        database: 'alm-breaking-news',
        collectionName: 'manualevents',
        query: JSON.stringify(req.body)
    }, (err, next) => {
        console.log(err, res)
        return res.sendStatus(200)
    }, function(err) {
        console.log(err)
    })
});

router.post('/rest/api/getCurrentUser', (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://constellation.soprasteria.com/jira2/rest/api/2/user?username=' + req.body.username,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
})

router.post('/rest/api/worklog', cache('5 minutes'), (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://constellation.soprasteria.com/jira2/activity?maxResults=100&os_authType=basic&title=undefined',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = convert.xml2json(body , {compact: true, space: 4});
            res.send(info);
        }
    }

    request(options, callback);
})

router.post('/rest/api/r7', cache('5 minutes'), (req, res, next) => {
    let options = {
        rejectUnauthorized: false,
        url: 'https://constellation.soprasteria.com/jira2/rest/api/latest/search?jql=project=' + req.body.applicationId + ' AND issuetype = Bug&fields=customfield_10551, status, aggregatetimespent, aggregatetimeoriginalestimate, aggregateprogress, aggregatetimeestimate, summary, customfield_10608, customfield_10578, customfield_10582, customfield_10545, customfield_10509, customfield_10579, components, duedate, assignee &maxResults=-1',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.token
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
});
module.exports = router;
