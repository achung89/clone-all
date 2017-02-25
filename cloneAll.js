var Git = require('nodegit');
var GitHub = require('github');
var Promise = require('bluebird');
var express = require('express');
var localPath = require("path").join(__dirname, "../");
var app = express()

app.use(function(req, res, next) {

    req.socket.on("error", function(err) {
      console.log(err);
    });
    res.socket.on("error", function(err) {
      console.log(err);
    });
    next();
});

app.listen(3000,()=>{console.log('Program running')});




var githubRepos;
var gitClone = function clone(cloneURL) {
  console.log("Cloning: ", cloneURL);
  return Git.Clone(cloneURL, '../repos');
}

var github = new GitHub({
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    headers: {
        "user-agent": "achung89" // GitHub is happy with a unique user agent
    },
    Promise: require('bluebird'),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});
var gitCloneChain;
github.repos.getForUser({ username:'achung89' })
  .then(({data}) =>{
    githubRepos = data;
  }).githubRepos.reduce((promise, repository)=>{
                                  return promise.then(gitClone(repository.html_url));
                                }, Promise.resolve());


