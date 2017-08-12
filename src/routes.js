//import resources for each resource
import userRoutes from './routes/user'
import photoRoutes from './routes/photo'
import serieRoutes from './routes/serie'
import videoRoutes from './routes/video'

const routes =  userRoutes              //USERS
                .concat(photoRoutes)    //PHOTOS
                .concat(serieRoutes)    //SERIES
                .concat(videoRoutes)    //VIDEO

export default routes