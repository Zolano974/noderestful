import serie from '../actions/serie'          //DAO
import optionsquery from '../optionsquery'

const Joi = require('joi')                  //inputs validation

const serieRoutes = [
    //GET serieS
    {
        method: 'GET',
        path: '/series',
        handler: serie.getAllSeries,
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
        handler: serie.getSerieById,
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
        handler: serie.createSerie,
        config: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 1048576 * 1024    // 1GB
            },
            validate: {
                payload: {
                    name: Joi.string().max(50).required(),
                    description: Joi.string().max(200).required(),
                    picture: Joi.any().required()
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
        handler: serie.updateSerie,
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
        handler: serie.deleteSerie,
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
            optionsquery.handle(reply)
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
            optionsquery.handle(reply)
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
            optionsquery.handle(reply)
        },
        config: {
            cors: true
        }
    }
]

export default serieRoutes;
