
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
        }
    },
    // GET PHOTO /ID
    {
        method: 'GET',
        path: '/photos/{id}',
        handler: photoDao.getPhotoById,
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
        handler: photoDao.createPhoto,
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
            }
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
            }
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
            }
        }
    },
]

export default photoRoutes;