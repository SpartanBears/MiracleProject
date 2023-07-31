const fs = require('fs');

async function sleep(milliseconds){

    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

exports.sleep = sleep;

let env = JSON.parse(fs.readFileSync('../.env.json'));

exports.envvars = function(envName){
    
    return env[envName];
}