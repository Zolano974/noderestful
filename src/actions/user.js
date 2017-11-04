import userDao from '../dao/user'
import optionsquery from '../lib/optionsquery'

const user = {
    getAllUsers: async (request, reply) => {

        try{
            var users = await userDao.fetchAll()

            var users2 = []

            for(var i=0; i < users.length; i++){
                var userbis = {
                    name: users[i].name,
                    surname: users[i].surname,
                    mail: users[i].name+'.'+users[i].surname+'@zob.com',
                }

                users2.push(userbis)
            }

            //OU BIEN
            var users3 = users.map((user) => {
                return {
                    name: user.name,
                    surname: user.surname,
                    mail: user.name+'.'+user.surname+'@zob.com',
                }
            })

            var user12 = users.find((user) => {
                return user.id === 12
            })

            if (!users || users.length === 0) {
                users = []
            }

            reply({
                users: users,
                count: users.length,
            })

        }catch(err){
            reply(err)
        }
    },
    getUserById: async (request, reply) => {
        const id = request.params.id;

        try{
            var entity = await userDao.fetchOneById(id)

            if (!entity) {
                reply({
                    error: true,
                    errMessage: 'user #'+id+' not found (dao/user.js l. 33)',
                })
                return
            }

            reply(entity)

        }catch(err){
            reply(err)
        }


    },
    createUser: async (request, reply) => {

        const entity = request.payload;

        try{

            //Encryption
            var salt = Bcrypt.genSaltSync();
            var encryptedPassword = Bcrypt.hashSync(entity.password, salt);

            var insertedUser = await userDao.insert({
                username: entity.username,
                email: entity.email,
                password: encryptedPassword,        //password crypté
            })

            reply(insertedUser)

        }catch(err){
            reply(err)
        }
    },
    updateUser: async (request, reply) => {

        const id = request.params.id;
        const user = request.payload;

        try{
            var entity = await userDao.update(entity, id)

            reply(entity)
        }catch(err){
            reply(err)
        }
    },
    deleteUser: async (request, reply) => {

        const id = request.params.id;

        try{
            var entity = await userDao.delete(id)

            reply(entity)
        }catch(err){
            reply(err)
        }
    },
    authenticate: async (request, reply) => {

        //on gère le cas OPTIONS: on renvoie les bons headers
        if(request.method === 'options'){
            optionsquery.handle(reply)
            return
        }

        // This is a ES6 standard
        const {username, password} = request.payload;

        try{
            var token = await userDao.authenticate(username, password)

            var response = (token) ? {token: token} : {
                error: true,
                errMessage: 'Invalid Password',
            }

            reply(response)

        }catch(err){
            console.log(err)
            reply(err)
        }

    },
}

export default user