
import Knex from '../knex';                  //QueryBuilder
import private_key from '../privatekey';     //PRIVATE KEY

const jwt = require('jsonwebtoken')         //JWT
const Joi = require('joi'); 	            //inputs validation
const Bcrypt = require('bcrypt'); 	        // encryption

const userRoutes = [
    //AUTHENTICATE
    {
        path: '/auth',
        method: 'POST',
        handler: userDao.authenticate,
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
            }
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
                    password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/)
                }
            }
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
            }
        }
    },
    //DELETE USER
    {
        method: 'DELETE',
        path: '/user/{id}',
        handler: userDao.deleteUser
        config: {
            auth: {
                strategy: 'token'
            },
            validate: {
                params: {
                    id: Joi.number().integer(),
                    mid: Joi.number().integer()
                }
            }
        }
    },
]

export default userRoutes;