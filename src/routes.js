//import resources for each resource
import userRoutes from './routes/user'
import mediaRoutes from './routes/media'
import serieRoutes from './routes/serie'
import introRoutes from './routes/introduction'

const routes =  userRoutes              //USERS
                .concat(mediaRoutes)    //MEDIAS
                .concat(serieRoutes)    //SERIES
                .concat(introRoutes)    //INTRO

export default routes