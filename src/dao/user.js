import Knex from '../lib/knex';                     //QueryBuilder
import private_key from '../lib/privatekey';        //PRIVATE KEY
const jwt = require('jsonwebtoken')             //JWT
const Bcrypt = require('bcrypt') 	            // encryption


const userDao = {

        fetchAll: async () => {

            var users = await   Knex('users')
                                .select(
                                    'id',
                                    'username',
                                    'password',
                                    'email'
                                )

            return users
            try{

            }catch(err){
                throw err
            }
        },
        fetchOneById: async (id) => {
            var user = await   Knex('users')
                                .where('id', id)
                                .select(
                                    'id',
                                    'username',
                                    'password',
                                    'email'
                                )

            return (!user || user.length === 0) ? null : user[0]
            try{

            }catch(err){
                throw err
            }
        },

        insert: async (user) => {

            try{

                var insertId = await Knex('users')
                    .returning(
                        'id',
                    )
                    .insert(
                        user
                    )

                var createdUser = await userDao.fetchOneById(insertId)

                return createdUser

            }catch(err){
                throw err
            }

        },
        update: async (user,id) =>{


            try{
                var results = await  Knex('users')
                                    .where('id', id)
                                    .update({
                                        username: user.username,
                                        email: user.email,
                                    })

                try{
                    var updatedUser = await userDao.fetchOneById(id)

                    return updatedUser
                }catch (err2) {
                    throw err2
                }
            }catch(err){
                throw err
            }
        },
        delete: async (id) => {

            try{
                var result = await Knex('users')
                                    .where('id', id)
                                    .del()

                try{
                    var deletedUser = await userDao.fetchOneById(id)

                    return deletedUser

                }catch(err2){
                    throw err2
                }
            }
            catch(err){
                throw err
            }
        },
        authenticate: async (username, password) => {

            try{
                var user = await Knex('users')
                                .where(
                                    'username', username
                                ).select(
                                    'id',
                                    'password'
                                )

                if(!user) return false

                if(Bcrypt.compareSync(password, user.password)){

                    //on génère le token JWT
                    var token = jwt.sign({
                            username,
                            id: user.id,
                            group: "zob",
                        },
                        private_key,
                        {
                            algorithm: 'HS256',
                            expiresIn: '1h',
                        }
                    );

                    return token
                }
                else return false

            }catch(err){
                throw err
            }

        },
    }

export default userDao