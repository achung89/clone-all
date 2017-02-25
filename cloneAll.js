var Git = require('nodegit');
var GitHub = require('github');
var Promise = require('bluebird');
var express = require('express');
var localPath = require("path").join(__dirname, "../");
var app = express();

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
var gitClone = function clone(cloneURL, filename) {
    var path = localPath+filename
    console.log(path);
    return Git.Clone(cloneURL, path );
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

      return data.reduce((promise, repository)=>{
          return promise.then(cloneIt( repository.html_url, repository.name ))
                        .then(()=>{console.log(repository.html_url, 'done');} );
      }, Promise.resolve());
  })
  .catch((err)=> {
      console.log('Error', err);
  });


var cloneIt = (url, filename)=>{ 
  console.log("Cloning: ", url, filename); 
  gitClone(url, filename);
}