
import Knex from '../knex';                  //QueryBuilder
import private_key from '../privatekey';     //PRIVATE KEY

const jwt = require('jsonwebtoken')         //JWT
const Joi = require('joi') 	            //inputs validation
const Bcrypt = require('bcrypt')        // encryption

const serieRoutes = [
    //GET serieS
    {
        method: 'GET',
        path: '/series',
        handler: function (request, reply) {

            console.log(request.auth.credentials.groups)

            Knex('series')
                .select(
                    'id',
                    'name',
                    'description',
                    'picture',
                    'mediatype',
                    'created',
                    'updated'
                )
                .then((results) => {
                    if (!results || results.length === 0) {
                        reply({
                            error: true,
                            errMessage: 'no series found',
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
    // GET serie /ID
    {
        method: 'GET',
        path: '/serie/{id}',
        handler: function (request, reply) {
            const id = request.params.id;

            Knex('series')
                .where('id', id)
                .select(
                    'id',
                    'name',
                    'description',
                    'picture',
                    'mediatype',
                    'created',
                    'updated'
                )
                .then((results) => {
                    //gestion de l'absence de données
                    if (!results || results.length === 0) {
                        reply({
                            error: true,
                            errMessage: 'no series found by id ' + id,
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
    //CREATE serie (POST)
    {
        method: 'POST',
        path: '/serie',
        handler: function (request, reply) {

            const serie = request.payload;

            //ajout d'un utilisateur
            Knex('series')
                .returning('id')
                .insert(
                    {
                        name : serie.name,
                        description : serie.description,
                        picture: serie.picture,
                        mediatype : serie.mediatype
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
                    name: Joi.string().alphanum().max(50).required(),
                    description: Joi.string().alphanum().max(200).required(),
                    picture: Joi.string().alphanum().max(50).required(),
                    mediatype: Joi.string().alphanum().min(4).max(5).required(),

                }
            }
        }
    },
    //UPDATE serie (PUT)
    {
        method: 'PUT',
        path: '/serie/{id}',
        handler: function (request, reply) {

            const id = request.params.id;
            const serie = request.payload;

            //ajout d'un utilisateur
            Knex('series')
                .where('id', id)
                .update({
                    name : serie.name,
                    description : serie.description,
                    picture: serie.picture,
                    mediatype : serie.mediatype
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
                    name: Joi.string().alphanum().max(50).required(),
                    description: Joi.string().alphanum().max(200).required(),
                    picture: Joi.string().alphanum().max(50).required(),
                    mediatype: Joi.string().alphanum().min(4).max(5).required(),
                }
            }
        }
    },
    //DELETE serie
    {
        method: 'DELETE',
        path: '/serie/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            Knex('series')
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

export default serieRoutes;