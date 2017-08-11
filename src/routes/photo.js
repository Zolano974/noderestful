
import Knex from '../knex';                  //QueryBuilder
import private_key from '../privatekey';     //PRIVATE KEY

const jwt = require('jsonwebtoken')         //JWT
const Joi = require('joi'); 	            //inputs validation
const Bcrypt = require('bcrypt'); 	        // encryption

const photoRoutes = [
    //GET PHOTOS
    {
        method: 'GET',
        path: '/photos',
        handler: function (request, reply) {

            console.log(request.auth.credentials.groups)

            Knex('photos')
                .select('id','title','description', 'file', 'created')
                .then((results) => {
                    if (!results || results.length === 0) {
                        reply({
                            error: true,
                            errMessage: 'no photos found',
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
    // GET PHOTO /ID
    {
        method: 'GET',
        path: '/photos/{id}',
        handler: function (request, reply) {
            const id = request.params.id;

            Knex('photos').where('id', id).select(
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
                            errMessage: 'no photos found by id ' + id,
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
    //CREATE photo (POST)
    {
        method: 'POST',
        path: '/photo',
        handler: function (request, reply) {

            const photo = request.payload;

            //ajout d'un utilisateur
            Knex('photos')
                .returning('id')
                .insert(
                    {
                        title: photo.title,
                        description: photo.description,
                        file: photo.file,
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
    //UPDATE photo (PUT)
    {
        method: 'PUT',
        path: '/photo/{id}',
        handler: function (request, reply) {

            const id = request.params.id;
            const photo = request.payload;

            //ajout d'un utilisateur
            Knex('photos')
                .where('id', id)
                .update({
                    title: photo.title,
                    description: photo.description,
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
    //DELETE photo
    {
        method: 'DELETE',
        path: '/photo/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            Knex('photos')
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

export default photoRoutes;