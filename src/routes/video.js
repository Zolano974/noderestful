
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
        }
    },
    // GET video /ID
    {
        method: 'GET',
        path: '/videos/{id}',
        handler: videoDao.getVideoById,
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
                    file: Joi.string().max(50).required(),
                }
            }
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
            }
        }
    },
    //DELETE video
    {
        method: 'DELETE',
        path: '/video/{id}',
        handler: videoDao.deleteVideo,
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