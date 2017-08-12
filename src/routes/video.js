
import Knex from '../knex';                  //QueryBuilder
import videoDao from '../dao/video'

const jwt = require('jsonwebtoken')         //JWT
const Joi = require('joi'); 	            //inputs validation
const Bcrypt = require('bcrypt'); 	        // encryption

const videoRoutes = [

    //GET videoS
    {
        method: 'GET',
        path: '/videos',
        handler: videoDao.getAllVideos,
        config: {
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    // GET video /ID
    {
        method: 'GET',
        path: '/video/{id}',
        handler: videoDao.getVideoById,
        config: {
            auth: {
                strategy: 'token'
            },
            validate: {
                params: {
                    id: Joi.number().integer()
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    //CREATE video (POST)
    {
        method: 'POST',
        path: '/video',
        handler: videoDao.createVideo,
        config: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },
            validate: {
                payload: {
                    title: Joi.string().max(50).required(),
                    description: Joi.string().max(200).required(),
                    file: Joi.any().required(),
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    //UPDATE video (PUT)
    {
        method: 'PUT',
        path: '/video/{id}',
        handler: videoDao.updateVideo,
        config: {

            validate: {
                payload: {
                    title: Joi.string().max(50).required(),
                    description: Joi.string().max(200).required(),
                }
            },
            cors: true
        }
    },
    //DELETE video
    {
        method: 'DELETE',
        path: '/video/{id}',
        handler: videoDao.deleteVideo,
        config: {
            validate: {
                params: {
                    id: Joi.number().integer(),
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    //OPTIONS video
    {
        method: 'OPTIONS',
        path: '/videos',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization')
        },
        config: {
            cors: true
        }
    },
    //OPTIONS video
    {
        method: 'OPTIONS',
        path: '/video',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization')
        },
        config: {
            cors: true
        }
    },
    //OPTIONS video
    {
        method: 'OPTIONS',
        path: '/video/{id}',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization')
        },
        config: {
            cors: true
        }
    },
]

export default videoRoutes;