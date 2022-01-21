const { Pool } = require('pg');
const fs = require('fs');
const bcrypt = require('bcrypt');

const bcrypt_saltRounds = 11;

let pgCreds = JSON.parse(fs.readFileSync('./db_creds.json'));
pgCreds.max = 1;

const queryDictionary = {
    insert_player_user:"INSERT INTO player_user (login_email, login_key, display_name) VALUES ($1, $2, $3);",
    insert_major_god:"INSERT INTO major_god (name) VALUES ($1);",
    insert_god_type:"INSERT INTO god_type (name, gerund) VALUES ($1, $2);"
};

run();

async function run(){

    let pgPool = false;

    try{

        pgPool = new Pool(pgCreds);

    }catch(err){

        console.log("ERROR run", err);
    }

    if(pgPool){

        //insert new user
        let mailFromFront = 'diegoa.vergarag@gmail.com';
        let mailSalt = await bcrypt.genSalt(bcrypt_saltRounds);
        let mailHash = await bcrypt.hash(mailFromFront, mailSalt);
        let isMailHashCorrect = await bcrypt.compare(mailFromFront, mailHash);

        let pwdFromFront = 'miracle123321';
        let pwdSalt = await bcrypt.genSalt(bcrypt_saltRounds);
        let pwdHash = await bcrypt.hash(pwdFromFront, pwdSalt);
        let isPwdHashCorrect = await bcrypt.compare(pwdFromFront, pwdHash);

        let nameFromFront = 'Halian';
        let nameSalt = await bcrypt.genSalt(bcrypt_saltRounds);
        let nameHash = await bcrypt.hash(nameFromFront, nameSalt);
        let isNameHashCorrect = await bcrypt.compare(nameFromFront, nameHash);

        if(isMailHashCorrect && isPwdHashCorrect && isNameHashCorrect){

            await exec_query(queryDictionary.insert_player_user, [mailHash, pwdHash, nameHash], true, pgPool);
        }

    }
}

async function exec_query(query, params, isReturning, pgPool){

    if(isReturning){

        query.replace(';', 'RETURNING *;');
    }

    try{

        let queryRes = await pgPool.query(query, params);

        console.log(queryRes);

    }catch(err){

        console.log("ERROR exec_query", err);
    }
}