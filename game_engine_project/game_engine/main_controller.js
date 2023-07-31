const fs = require("fs");
const { createServer } = require("https");
const { Server } = require("socket.io");
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require("crypto");

const bcrypt_saltRounds = 11;

const project_paths = JSON.parse(fs.readFileSync('/opt/miracle_project/paths.json'));

const queryDictionary = JSON.parse(fs.readFileSync(project_paths.queries_folder + 'query_dictionary.json'));

const templatePath = project_paths.templates_folder;

let pgPool = false;
let isPGConnected = false;
let pgCreds = JSON.parse(fs.readFileSync(project_paths.queries_folder + 'db_creds.json'));

const httpServer = createServer({
    key: fs.readFileSync(project_paths.le_pqui),
    cert: fs.readFileSync(project_paths.le_pquishein)
});

const io = new Server(httpServer, { /* options */ });

const aes256gcm = () => {
    const crypto_algorithm = "aes-256-gcm";
    const crypto_key = fs.readFileSync(project_paths.quis_folder + 'sk').toString('utf8');
    const separator = '8===D~~~';

    const encrypt = (str) => {

        const iv = crypto_key.substring(0, 12);
        const cipher = crypto.createCipheriv(crypto_algorithm, crypto_key.substring(0, 32), iv);

        let enc = cipher.update(str, 'utf8', 'base64');
        enc += cipher.final('base64');

        let finalenc = enc + separator + iv + separator + cipher.getAuthTag().toString('base64');

        return finalenc;
    };

    const decrypt = (encIn) => {

        let splitEnc = encIn.split(separator);

        let enc = splitEnc[0];
        let iv = splitEnc[1];
        let authTag = Buffer.from(splitEnc[2], 'base64');

        const decipher = crypto.createDecipheriv(crypto_algorithm, crypto_key.substring(0, 32), iv);
        decipher.setAuthTag(authTag);
        let str = decipher.update(enc, 'base64', 'utf8');
        str += decipher.final('utf8');

        return str;
    };

    return {
        encrypt,
        decrypt,
    };
};

start_server();

//----- START FUNCTIONS -----

async function start_server() {

    console.log('MIRACLE PROJECT v1.0a - SERVER STARTING');    

    io.on("connection", (socket) => {

        console.log("NEW_SOCKET_OPENED", socket.id);

        console.log('SETTING SOCKET EVENTS', socket.id);

        //----- START SET EVENTS -----

        socket.emit("CONNECTION_SUCCESSFUL", "Miracle Project Engine v1.0a");

        socket.on("LOGIN_ATTEMPT", async (message) => {

            let isLoggedIn = await do_login(message, socket.id, pgPool);

            if (isLoggedIn) {

                console.log("LOGIN_ATTEMPT_SUCCESS", isLoggedIn);

                socket.emit("LOGIN_ATTEMPT_SUCCESS", isLoggedIn);

                socket.emit("CONTENT_INPUT", fs.readFileSync(templatePath + "post_login.miracletemplate").toString('utf8'));

            } else {

                socket.emit("LOGIN_ATTEMPT_FAILURE", 'Incorrect credentials');
            }
        });

        socket.on("REGISTER_USER", async (message) => {

            let isRegistered = await do_register(message, socket.id, pgPool);

            if (isRegistered) {

                let isLoggedIn = await do_login(message, socket.id, pgPool);

                if (isLoggedIn) {

                    console.log("LOGIN_ATTEMPT_SUCCESS", isLoggedIn);

                    socket.emit("LOGIN_ATTEMPT_SUCCESS", isLoggedIn);

                    socket.emit("CONTENT_INPUT", fs.readFileSync(templatePath + "post_login.miracletemplate").toString('utf8'));

                } else {

                    socket.emit("LOGIN_ATTEMPT_FAILURE", 'Incorrect credentials');
                }
            }

        });

        //TEST EVENTS

        socket.on("TEST_TOKEN", async (message) => {

            let cipher = aes256gcm();

            let tokenContent = cipher.decrypt(message);

            console.log(tokenContent);

        });

        socket.on("PING", (message) => {

            socket.emit("PONG", { client: message, server: (new Date().getTime()) });
        });

        //GAME RELATED EVENTS

        socket.on("CREATE_ADVENTURER", async (message) => {


        });

        console.log('SOCKET EVENTS SETTED', socket.id);
        //----- END SET EVENTS -----
    });

    //SET LOCAL LISTENING PORT AND START HTTPS SERVER
    console.log('STARTING HTTPS SERVER LISTENING ON PORT 54321');
    httpServer.listen(54321);

    //CONNECT TO DATABASE
    console.log('CONNECTING TO DATABASE');
    try {

        pgPool = new Pool(pgCreds);
        isPGConnected = true;
        console.log('CONNECTED TO DATABASE');

    } catch (err) {

        console.log('ERROR start_server (1) DATABASE CONNECTION', err);
    }

    console.log('SERVER STARTUP COMPLETED - AWAITING CONNECTIONS');

    return true;
}

async function do_login(message, socketID, pgPool) {

    let isLoggedIn = false;

    try {

        let keyHash = await exec_query(queryDictionary.verify_login, [message.user], pgPool);

        if (keyHash.hasOwnProperty('rowCount')) {
            if (keyHash.rowCount > 0) {

                let isValid = await bcrypt.compare(message.pass, keyHash.rows[0].login_key);

                if (isValid) {

                    //CREATE SESSION AND RETURN KEY

                    let session_info = {};
                    session_info.socket_id = socketID;
                    session_info.user = message.user;
                    session_info.meta = message.meta;

                    session_info = JSON.stringify(session_info);

                    let cipher = aes256gcm();

                    let session_key = cipher.encrypt(session_info);

                    let resultCreateSession = await exec_query(queryDictionary.create_player_session, [keyHash.rows[0].id, session_key, socketID, message.meta], pgPool);

                    if (resultCreateSession.hasOwnProperty('rowCount')) {
                        if (resultCreateSession.rowCount > 0) {

                            isLoggedIn = { dname: keyHash.rows[0].display_name, skey: session_key };
                        }
                    }
                } else {

                    //TODO
                }
            }
        }

    } catch (err) {

        console.log("ERROR do_login", err);
    }

    return isLoggedIn;
}

async function do_register(message, socketID, pgPool) {

    let isRegistered = false;

    try {

        let mailFromFront = message.user;

        let pwdFromFront = message.pass;
        let pwdSalt = await bcrypt.genSalt(bcrypt_saltRounds);
        let pwdHash = await bcrypt.hash(pwdFromFront, pwdSalt);
        let isPwdHashCorrect = await bcrypt.compare(pwdFromFront, pwdHash);

        let nameFromFront = message.display_name;

        if (isPwdHashCorrect) {

            let createPlayerUser = await exec_query(queryDictionary.create_player_user, [mailFromFront, pwdHash, nameFromFront], pgPool);

            if (createPlayerUser.hasOwnProperty('rowCount')) {
                if (createPlayerUser.rowCount > 0) {

                    isRegistered = true;
                }
            }
        }

    } catch (err) {

        console.log('ERROR do_register', err);
    }

    return isRegistered;
}

async function exec_query(query, params, pgPool) {

    let result = false;

    try {

        let queryRes = await pgPool.query(query, params);
        result = queryRes;

    } catch (err) {

        console.log("ERROR exec_query", err, query, params, pgPool);
    }

    return result;
}

//----- END FUNCTIONS -----