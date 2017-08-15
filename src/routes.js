//import resources for each resource
import userRoutes from './routes/user'
import mediaRoutes from './routes/media'
import serieRoutes from './routes/serie'

const routes =  userRoutes              //USERS
                .concat(mediaRoutes)    //MEDIAS
                .concat(serieRoutes)    //SERIES

export default routes