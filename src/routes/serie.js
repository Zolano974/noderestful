import Knex from '../knex';                  //QueryBuilder
import serieDao from '../dao/serie'          //DAO

const jwt = require('jsonwebtoken')         //JWT
const Joi = require('joi') 	                //inputs validation
const Bcrypt = require('bcrypt')            // encryption

const serieRoutes = [
    //GET serieS
    {
        method: 'GET',
        path: '/series',
        handler: serieDao.getAllSeries,
        config: {
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    // GET serie /ID
    {
        method: 'GET',
        path: '/serie/{id}',
        handler: serieDao.getSerieById,
        config: {
            auth: {
                strategy: 'token'
            },
            validate: {
                params: {
                    id: Joi.number().integer()
                }
            },
            cors: true
        }
    },
    //CREATE serie (POST)
    {
        method: 'POST',
        path: '/serie',
        handler: serieDao.createSerie,
        config: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },
            validate: {
                payload: {
                    name: Joi.string().max(50).required(),
                    description: Joi.string().max(200).required(),
                    picture: Joi.any().required(),
                    mediatype: Joi.string().min(4).max(5).required(),

                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    //UPDATE serie (PUT)
    {
        method: 'PUT',
        path: '/serie/{id}',
        handler: serieDao.updateSerie,
        config: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },
            validate: {
                payload: {
                    name: Joi.string().max(50).required(),
                    description: Joi.string().max(200).required(),
                    picture: Joi.any().required(),
                    mediatype: Joi.string().min(4).max(5).required(),
                }
            },
            cors: true,
            auth: {
                strategy: 'token'
            },
        }
    },
    //DELETE serie
    {
        method: 'DELETE',
        path: '/serie/{id}',
        handler: serieDao.deleteSerie,
        config: {
            auth: {
                strategy: 'token'
            },
            validate: {
                params: {
                    id: Joi.number().integer(),
                }
            },
            cors: true
        }
    },
    //OPTIONS serie
    {
        method: 'OPTIONS',
        path: '/series',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization')
        },
        config: {
            cors: true
        }
    },
    //OPTIONS serie
    {
        method: 'OPTIONS',
        path: '/serie',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization')
        },
        config: {
            cors: true
        }
    },
    //OPTIONS serie
    {
        method: 'OPTIONS',
        path: '/serie/{id}',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization')
        },
        config: {
            cors: true
        }
    }
]

export default serieRoutes;
