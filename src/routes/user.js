import Knex from '../knex';                  //QueryBuilder


import userDao from '../dao/user'


const Joi = require('joi') 	            //inputs validation


const userRoutes = [
    //AUTHENTICATE
    {
        path: '/auth',
        method: ['POST', 'OPTIONS'],
        handler: userDao.authenticate,
        config:{
            cors: true
        }
    },
    //GET USERS
    {
        method: 'GET',
        path: '/users',
        handler: userDao.getAllUsers,
        config: {
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    // GET USER /ID
    {
        method: 'GET',
        path: '/user/{id}',
        handler: userDao.getUserById,
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
    //CREATE USER (POST)
    {
        method: 'POST',
        path: '/user',
        handler: userDao.createUser,
        config: {

            validate: {
                payload: {
                    username: Joi.string().alphanum().min(3).max(30).required(),
                    email: Joi.string().email(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/).required()
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    //UPDATE USER (PUT)
    {
        method: 'PUT',
        path: '/user/{id}',
        handler: userDao.updateUser,
        config: {

            validate: {
                payload: {
                    username: Joi.string().alphanum().min(3).max(30).required(),
                    email: Joi.string().email(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/)
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true
        }
    },
    //DELETE USER
    {
        method: 'DELETE',
        path: '/user/{id}',
        handler: userDao.deleteUser,
        config: {
            validate: {
                params: {
                    id: Joi.number().integer(),
                    mid: Joi.number().integer()
                }
            },
            auth: {
                strategy: 'token'
            },
            cors: true

        }
    },
    //OPTIONS USER
    {
        method: 'OPTIONS',
        path: '/users',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        },
        config: {
            cors: true
        }
    },
    //OPTIONS USER
    {
        method: 'OPTIONS',
        path: '/user',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        },
        config: {
            cors: true
        }
    },
    //OPTIONS USER
    {
        method: 'OPTIONS',
        path: '/user/{id}',
        handler: (request, reply) => {
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        },
        config: {
            cors: true
        }
    },
]

export default userRoutes;
