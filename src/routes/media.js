import media from '../actions/media'
import optionsquery from '../lib/optionsquery'

const Joi = require('joi'); 	            //inputs validation

const mediaRoutes = [
    //GET mediaS
    {
        method: 'GET',
        path: '/medias',
        handler: media.getAllMedias,
        config: {
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    // GET media /ID
    {
        method: 'GET',
        path: '/media/{id}',
        handler: media.getMediaById,
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
    //CREATE media (POST)
    {
        method: 'POST',
        path: '/media',
        handler: media.createMedia,
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
                    serieId: Joi.number().integer().required(),
                    mediatype: Joi.string().max(5).required(),
                    file: Joi.any().required(),
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true,
        }
    },
    //UPDATE media (PUT)
    {
        method: 'PUT',
        path: '/media/{id}',
        handler: media.updateMedia,
        config: {
            validate: {
                payload: {
                    id: Joi.number(),
                    serieId: Joi.number().integer().required(),
                    title: Joi.string().max(50).required(),
                    description: Joi.string().max(200).required(),
                    mediatype: Joi.any(),
                    file: Joi.any(),
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true,
        }
    },
    //DELETE media
    {
        method: 'DELETE',
        path: '/media/{id}',
        handler: media.deleteMedia,
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
    //OPTIONS mediaS
    {
        method: 'OPTIONS',
        path: '/medias',
        handler: (request, reply) => {
            optionsquery.handle(reply)
        },
        config: {
            cors: true
        }
    },
    //OPTIONS mediaS
    {
        method: 'OPTIONS',
        path: '/media',
        handler: (request, reply) => {
            optionsquery.handle(reply)
        },
        config: {
            cors: true
        }
    },
    //OPTIONS mediaS
    {
        method: 'OPTIONS',
        path: '/media/{id}',
        handler: (request, reply) => {
            optionsquery.handle(reply)
        },
        config: {
            cors: true
        }
    }
]

export default mediaRoutes;
