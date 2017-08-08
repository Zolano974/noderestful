import Knex from './knex';          //QueryBuilder
import private_key from './privatekey';

const jwt = require('jsonwebtoken')
const Joi = require('joi'); 	//inputs validation
const Bcrypt = require('bcrypt'); 	// encryption

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
                            private_key,
                            {
                                algorithm: 'HS256',
                                expiresIn: '1h',
                            }
                        );
                        // reply({
                        //     debug: true,
                        //     ok: true
                        // });
                        // return;

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
                    if(results.length > 0){
                        reply(true)
                        return;
                    }
                    reply(false);
                    return;
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
]

export default routes;