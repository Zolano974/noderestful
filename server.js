'use strict';

const Hapi = require('hapi');	//REST API framework
const Joi = require('joi'); 	//inputs validation
const Bcrypt = require('bcrypt'); 	// encryption
const HapiAuthJwt = require('hapi-auth-jwt');

// import routes from './src/routes';
// import Knex from './src/knex';          //QueryBuilder
const Knex = require('knex')({

    client: 'mysql',
    connection: {
        host: '127.0.0.1',

        user: 'root',
        password: '',

        database: 'noderestful',
        charset: 'utf8',
    }

});

const jwt = require('jsonwebtoken');     //JWT

const routes = [
    //HELLO WORLD
    {
        method: 'GET',
        path: '/helloworld',
        handler: function (request, reply) {
            return reply('zob');
        },
        config: {
            auth: {
                strategy: 'token'
            },
        }
    },
    //AUTHENTICATE
    {
        path: '/auth',
        method: 'POST',
        handler: ( request, reply ) => {

            // This is a ES6 standard
            const { username, password } = request.payload;

            Knex( 'users' )
                .where(
                    'username', username
                ).select(
                    'uid', 'password'
                ).then( ( [user] ) => {

                    //absence de l'utilisateur
                    if( !user ) {
                        reply({
                            error: true,
                            errMessage: 'the specified user was not found',
                        });
                        return;
                    }
                    //on compare les hash
                    if(Bcrypt.compareSync(password, user.password)){
                    // if(password === user.password){

                        //on génère le token JWT
                        const token = jwt.sign({
                                username,
                                scope: user.uid,
                            },
                            privateKey,
                            {
                                algorithm: 'HS256',
                                expiresIn: '1h',
                            }
                        );

                        //on renvoie le token JWT
                        reply({
                            token,
                            scope: user.uid,
                        })
                    }
                    else{
                        reply('invalid password, asshole')
                    }
                }
            ).catch( ( err ) => {
                reply( 'server-side error' );
            });
        }
    },
    //GET USERS
    {
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {

            Knex('users')
                .select('uid', 'username', 'password')
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
        },
        config: {
            auth: {
                strategy: 'token'
            },
        }
    },
    // GET USER /ID
    {
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
            auth: {
                strategy: 'token'
            },
            validate: {
                params: {
                    uid: Joi.number().integer()
                }
            }
        }
    },
    //POST / GET MESSAGES /!\ PAS BIEN USAGE DU POST POUR CONSULTER
    {
        method: 'POST',
        path: '/messages',
        handler: function (request, reply) {

            const uid = request.payload.uid;

            var postOperation =
                Knex('messages')
                    .where('uid_fk', uid)
                    .select()
                    .then((results) => {
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
            auth: {
                strategy: 'token'
            },
            validate: {
                payload: {
                    uid: Joi.number().integer()
                }
            }
        }
    },
    //DELETE USER
    {
        method: 'DELETE',
        path: '/user/{uid}',
        handler: function (request, reply) {
            const uid = request.params.uid;
            Knex('users')
                .where('uid', uid)
                .del()
                .then((results) => {
                    reply(true)
                })
                .catch((err) => {
                    reply('server-side error')
                });
        },
        config: {
            auth: {
                strategy: 'token'
            },
            validate: {
                params: {
                    uid: Joi.number().integer(),
                    mid: Joi.number().integer()
                }
            }
        }
    },
    //CREATE USER (POST)
    {
        method: 'POST',
        path: '/user',
        handler: function (request, reply) {

            const user = request.payload;

            //Encryption
            var salt = Bcrypt.genSaltSync();
            var encryptedPassword = Bcrypt.hashSync(user.password, salt);

            //ajout d'un utilisateur
            Knex('users')
                .returning('uid')
                .insert(
                    {
                        username: user.username,
                        email: user.email,
                        password: encryptedPassword,
                    }
                ).then((results) => {
                    reply(results.uid)
                }).catch((err) => {
                    reply(err)
                    // reply('server-side error')
                })
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
    },
    //UPDATE USER (PUT)
    {
        method: 'PUT',
        path: '/user/{uid}',
        handler: function (request, reply) {

            const uid = request.params.uid;
            const user = request.payload;

            //ajout d'un utilisateur
            Knex('users')
                .where('uid', uid)
                .update({
                    username: user.username,
                    email: user.email,
                }).then((results) => {
                    reply(true)
                }).catch((err) => {
                    reply(err)
                    // reply('server-side error')
                })
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
    },

];


const privateKey = 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy';

// Create a server with a host and port
const server = new Hapi.Server();


server.connection({
    host: 'localhost',
    port: 8000
});

// SETUP AUTHENTICATION
server.register(HapiAuthJwt, (err) => {

    //on définit la stratégie d'authent
    server.auth.strategy('token', 'jwt', {
        key: privateKey,
        verifyOptions: {
            algorithms: ['HS256'],
        }
    });

    //on ajoute les routes issues de routes.js
    routes.forEach((route) => {
        console.log( `attaching route ${ route.path }` );
        server.route( route );
    });

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
