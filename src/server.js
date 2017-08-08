'use strict';
const Hapi = require('hapi');	//REST API framework
const Joi = require('joi'); 	//inputs validation
const Bcrypt = require('bcrypt'); 	// encryption
const HapiAuthJwt = require('hapi-auth-jwt');

import Knex from './knex';                      //QueryBuilder

const MySQL = require('mysql');	//DB manager
// const Knex = require('knex')({
//     client: 'mysql',
//     // connection: {
//     //     host : '127.0.0.1',
//     //     user : 'root',
//     //     password : '',
//     //     database : 'noderestful'
//     // }
// });


// Create a server with a host and port
const server = new Hapi.Server();

// //Create connection
// const connection = MySQL.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'noderestful'
// });

server.connection({
    host: 'localhost',
    port: 8000
});

// connection.connect();

// AUTHENT
server.register(HapiAuthJwt, (err) => {
    server.auth.strategy('token', 'jwt', {

        key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',

        verifyOptions: {
            algorithms: ['HS256'],
        }

    });

});

//ROUTES
server.route({
    method: 'GET',
    path: '/helloworld',
    handler: function (request, reply) {
        return reply('zob');
    }
});

//GET USERS (MySQL READ)
server.route({
    method: 'GET',
    path: '/users',
    handler: function (request, reply) {

        const getOperation = Knex('users').select('uid', 'username')
        .then((results) => {

            if (!results || results.length === 0) {
                reply({
                    error: true,
                    errMessage: 'no users found',
                });
            }
            //response
            reply({
                data: results,
                count: results.length,
            });

        }).catch((err) => {
            reply('server-side error');
        });
    }
});

//GET USER / ID  (VALIDATION)
server.route({
    method: 'GET',
    path: '/user/{uid}',
    handler: function (request, reply) {
        const uid = request.params.uid;

        const getOperation = Knex('users').where('uid', uid).select(
            'uid',
            'username',
            'email'
        )
        .then((results) => {
            //gestion de l'absence de données
            if (!results || results.length === 0) {
                reply({
                    error: true,
                    errMessage: 'no users found by id ' + uid,
                });
            }

            //response
            reply({
                data: results,
            });
        })
        .catch((err) => {
            reply( 'server-side error' );
        });

    },
    config: {
        validate: {
            params: {
                uid: Joi.number().integer()
            }
        }
    }
});

//POST /!\ mauvais usage du verbe, a changer dès que 5 min
//payload = body
server.route({
    method: 'POST',
    path: '/messages',
    handler: function (request, reply) {

        const uid = request.payload.uid;

        var postOperation = Knex('messages').where('uid_fk', uid).select().then((results) => {

            //gestion de l'absence de données
            if (!results || results.length === 0) {
                reply({
                    error: true,
                    errMessage: 'no messages found by uid ' + uid,
                });
            }

            //response
            reply({
                data: results,
                count: results.length,
            });
        })
        .catch((err) => {
            reply('server-side error')
        })

    },
    config: {
        validate: {
            payload: {
                uid: Joi.number().integer()
            }
        }

    }
});

//DELETE
server.route({
    method: 'DELETE',
    path: '/message/{uid}/{mid}',
    handler: function (request, reply) {
        const uid = request.params.uid;
        const mid = request.params.mid;
        connection.query(
            // 'DELETE FROM messages WHERE uid_fk = "' + uid + '"AND mid = "' + mid + '"',
            Knex('messages').where('uid_fk', uid).andWhere('mid', mid).del().toString(),
            function (error, result, fields) {
                if (error) throw error;

                if (result.affectedRows) {
                    reply(true);
                } else {
                    reply(false);
                }
            });
    },
    config: {
        validate: {
            params: {
                uid: Joi.number().integer(),
                mid: Joi.number().integer()
            }
        }
    }
});

//POST USER SIGNUP
// Encryption with bcrypt
server.route({
    method: 'POST',
    path: '/signup',
    handler: function (request, reply) {
        const username = request.payload.username;
        const email = request.payload.email;
        const password = request.payload.password;

        //Encryption
        var salt = Bcrypt.genSaltSync();
        var encryptedPassword = Bcrypt.hashSync(password, salt);

        //Decrypt
        var orgPassword = Bcrypt.compareSync(password, encryptedPassword);

        //UPDATE KNEX
        // knex('books')
        //     .where('published_date', '<', 2000)
        //     .update({
        //         status: 'archived',
        //         thisKeyIsSkipped: undefined
        //     })

        connection.query(
            // 'INSERT INTO users (username,email,passcode) VALUES ("' + username + '", "' + email + '", "' + encryptedPassword + '") ',
            Knex('users').returning('uid').insert(
                {
                    username: username,
                    email: email,
                    passcode: encryptedPassword,
                }
            ).toString(),
            function (error, results, fields) {
                if (error) throw error;

                reply(results);
            }
        );
    },
    config: {
        validate: {
            payload: {
                username: Joi.string().alphanum().min(3).max(30).required(),
                email: Joi.string().email(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/)
            }
        }
    }
});

//POST USER LOGIN
// Encryption with bcrypt
server.route({
    method: 'POST',
    path: '/login',
    handler: function (request, reply) {
        const username = request.payload.username;
        const password = request.payload.password;

        connection.query(
            // 'SELECT passcode FROM users WHERE username LIKE "' + username + '"',
            Knex('users').where('username', 'LIKE', username).select('passcode').toString(),
            function (error, results, fields) {
                if (error) throw error;

                //on récupère le passw stocké hashé
                var storedEncryptedPassword = results[0].passcode;

                //si le mdp est correct
                if (Bcrypt.compareSync(password, storedEncryptedPassword)) {

                    //on renvoie le jeton jwt
                    var jwt_token = "abcdefghijklmno123456789";
                    reply({token: jwt_token});
                }
                //sinon on renvoie null
                else {
                    reply({token: null});
                }
            }
        );
    },
    config: {
        validate: {
            payload: {
                username: Joi.string().alphanum().min(3).max(30).required(),
                email: Joi.string().email(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/)
            }
        }
    }
});

//Launch
server.start((err) => {
    if (err) {
        console.error('error handled');
        console.error(err);
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
