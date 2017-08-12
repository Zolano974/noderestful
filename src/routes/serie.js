
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
            }
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
                    picture: Joi.string().max(50).required(),
                    mediatype: Joi.string().min(4).max(5).required(),

                }
            }
        }
    },
    //UPDATE serie (PUT)
    {
        method: 'PUT',
        path: '/serie/{id}',
        handler: serieDao.updateSerie,
        config:{
            validate: {
                payload: {
                    name: Joi.string().max(50).required(),
                    description: Joi.string().max(200).required(),
                    picture: Joi.string().max(50).required(),
                    mediatype: Joi.string().min(4).max(5).required(),
                }
            }
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
            }
        }
    },
]

export default serieRoutes;