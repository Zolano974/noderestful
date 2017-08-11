
import Knex from '../knex';                  //QueryBuilder
import private_key from '../privatekey';     //PRIVATE KEY

const jwt = require('jsonwebtoken')         //JWT
const Joi = require('joi'); 	            //inputs validation
const Bcrypt = require('bcrypt'); 	        // encryption

const videoRoutes = [
    //GET videoS
    {
        method: 'GET',
        path: '/videos',
        handler: function (request, reply) {

            console.log(request.auth.credentials.groups)

            Knex('videos')
                .select('id','title','description', 'file', 'created')
                .then((results) => {
                    if (!results || results.length === 0) {
                        reply({
                            error: true,
                            errMessage: 'no videos found',
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
    // GET video /ID
    {
        method: 'GET',
        path: '/videos/{id}',
        handler: function (request, reply) {
            const id = request.params.id;

            Knex('videos')
                .where('id', id)
                .select(
                    'id',
                    'title',
                    'desription',
                    'file',
                    'created',
                )
                .then((results) => {
                    //gestion de l'absence de données
                    if (!results || results.length === 0) {
                        reply({
                            error: true,
                            errMessage: 'no videos found by id ' + id,
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
    //CREATE video (POST)
    {
        method: 'POST',
        path: '/video',
        handler: function (request, reply) {

            const video = request.payload;

            //ajout d'un utilisateur
            Knex('videos')
                .returning('id')
                .insert(
                    {
                        title: video.title,
                        description: video.description,
                        file: video.file,
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
                    title: Joi.string().alphanum().max(50).required(),
                    description: Joi.string().alphanum().max(200).required(),
                    file: Joi.string().alphanum().max(50).required(),
                }
            }
        }
    },
    //UPDATE video (PUT)
    {
        method: 'PUT',
        path: '/video/{id}',
        handler: function (request, reply) {

            const id = request.params.id;
            const video = request.payload;

            //ajout d'un utilisateur
            Knex('videos')
                .where('id', id)
                .update({
                    title: video.title,
                    description: video.description,
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
                    title: Joi.string().alphanum().max(50).required(),
                    description: Joi.string().alphanum().max(200).required(),
                }
            }
        }
    },
    //DELETE video
    {
        method: 'DELETE',
        path: '/video/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            Knex('videos')
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
                }
            }
        }
    },
]

export default videoRoutes;