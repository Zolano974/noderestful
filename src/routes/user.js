
import Knex from '../knex';                  //QueryBuilder
import private_key from '../privatekey';     //PRIVATE KEY

const jwt = require('jsonwebtoken')         //JWT
const Joi = require('joi'); 	            //inputs validation
const Bcrypt = require('bcrypt'); 	        // encryption

const userRoutes = [
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
                'id', 'password'
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
                                scope: user.id,
                                group: "zob",
                            },
                            private_key,
                            {
                                algorithm: 'HS256',
                                expiresIn: '1h',
                            }
                        );

                        //on renvoie le token JWT
                        reply({
                            token,
                            scope: user.id,
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

            console.log(request.auth.credentials.groups)

            Knex('users')
                .select('id', 'username', 'password')
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
        path: '/user/{id}',
        handler: function (request, reply) {
            const id = request.params.id;

            const getOperation = Knex('users').where('id', id).select(
                'id',
                'username',
                'email'
            )
                .then((results) => {
                    //gestion de l'absence de données
                    if (!results || results.length === 0) {
                        reply({
                            error: true,
                            errMessage: 'no users found by id ' + id,
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
                    id: Joi.number().integer()
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
                .returning('id')
                .insert(
                    {
                        username: user.username,
                        email: user.email,
                        password: encryptedPassword,
                    }
                ).then((results) => {
                reply(results.id)
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
        path: '/user/{id}',
        handler: function (request, reply) {

            const id = request.params.id;
            const user = request.payload;

            //ajout d'un utilisateur
            Knex('users')
                .where('id', id)
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
        path: '/user/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            Knex('users')
                .where('id', id)
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
                    id: Joi.number().integer(),
                    mid: Joi.number().integer()
                }
            }
        }
    },
]

export default userRoutes;