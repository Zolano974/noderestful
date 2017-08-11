
import Knex from '../knex';                  //QueryBuilder
import private_key from '../privatekey';     //PRIVATE KEY

const jwt = require('jsonwebtoken')         //JWT
const Joi = require('joi'); 	            //inputs validation
const Bcrypt = require('bcrypt'); 	        // encryption

const photoRoutes = [
    //GET USERS
    {
        method: 'GET',
        path: '/photos',
        handler: function (request, reply) {

            console.log("yolo")
            console.log(request.auth.credentials.groups)

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
]

export default photoRoutes;