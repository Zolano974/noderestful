
import Knex from '../knex';                  //QueryBuilder
import private_key from '../privatekey';     //PRIVATE KEY

import photoDao from '../dao/photo'

const jwt = require('jsonwebtoken')         //JWT
const Joi = require('joi'); 	            //inputs validation
const Bcrypt = require('bcrypt'); 	        // encryption

const photoRoutes = [
    //GET PHOTOS
    {
        method: 'GET',
        path: '/photos',
        handler: photoDao.getAllPhotos,
        config: {
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    // GET PHOTO /ID
    {
        method: 'GET',
        path: '/photo/{id}',
        handler: photoDao.getPhotoById,
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
    //CREATE photo (POST)
    {
        method: 'POST',
        path: '/photo',
        handler: photoDao.createPhoto,
        config: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 1048576 * 1024    // 1GB
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
            cors: true,
        }
    },
    //UPDATE photo (PUT)
    {
        method: 'PUT',
        path: '/photo/{id}',
        handler: photoDao.updatePhoto,
        config: {
            validate: {
                payload: {
                    title: Joi.string().max(50).required(),
                    description: Joi.string().max(200).required(),
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true,
        }
    },
    //DELETE photo
    {
        method: 'DELETE',
        path: '/photo/{id}',
        handler: photoDao.deletePhoto,
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
    //OPTIONS PHOTOS
    {
        method: 'OPTIONS',
        path: '/photos',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization')
        },
        config: {
            cors: true
        }
    },
    //OPTIONS PHOTOS
    {
        method: 'OPTIONS',
        path: '/photo',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization')
        },
        config: {
            cors: true
        }
    },
    //OPTIONS PHOTOS
    {
        method: 'OPTIONS',
        path: '/photo/{id}',
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

export default photoRoutes;
