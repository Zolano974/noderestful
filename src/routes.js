import Knex from './knex';          //QueryBuilder
import jwt from 'jsonwebtoken';     //JWT

const privateKey = 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy';

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
                    'uid', 'passcode'
                ).then( ( [user] ) => {

                        //absence de l'utilisateur
                        if( !user ) {
                            reply( {
                                error: true,
                                errMessage: 'the specified user was not found',
                            } );
                            return;
                        }
                        //on compare les hash
                        if(Bcrypt.compareSync(password, user.passcode)){

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
                } );
        }
    },
    //GET USERS
    {
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {

            Knex('users')
                .select('uid', 'username')
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
    //DELETE MESSAGE
    {
        method: 'DELETE',
        path: '/message/{uid}/{mid}',
        handler: function (request, reply) {
            const uid = request.params.uid;
            const mid = request.params.mid;

            const deleteOperation = Knex('messages').where('uid_fk', uid).andWhere('mid', mid)
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
        path: '/signup',
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
                    passcode: encryptedPassword,
                }
            ).then((results) => {
                reply(results.uid)
            }).catch((err) => {
                reply('server-side error')
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

export default routes;