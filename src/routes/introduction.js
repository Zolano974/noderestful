/**
 * Created by zolano on 11/4/17.
 */
import introduction from '../actions/introduction'
import optionsquery from '../lib/optionsquery'

const Joi = require('joi'); 	            //inputs validation

const introRoutes = [
    //GET intro
    {
        method: ['GET'],
        path: '/intro',
        handler: introduction.getIntro,
        config: {
            cors: true
        }
    },
    //SET intro
    {
        method: ['POST'],
        path: '/intro',
        handler: introduction.setIntro,
        config: {
            payload: {
                output: 'stream',
                parse: true,
                allow: [
                    'application/json',
                    'multipart/form-data',
                    'image/jpg',
                    'image/png'
                ],
                maxBytes: 1048576 * 1024    // 1GB
            },
            validate: {
                payload: {
                    title: Joi.string().max(127),
                    body: Joi.string().max(255),
                    picture: Joi.any(),
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    //OPTIONS INTRO
    {
        method: 'OPTIONS',
        path: '/intro',
        handler: (request, reply) => {
            optionsquery.handle(reply)
        },
        config: {
            cors: true
        }
    }

]

export default introRoutes