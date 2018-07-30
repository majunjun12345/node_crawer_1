var fs = require('fs')
var path =  require('path')

fs.exists('../server.js', function(exists) {
    if (exists) {
        console.log('true')
    } else {
        console.log('not exists')
    }
})