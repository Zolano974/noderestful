//import resources for each resource
import userRoutes from './routes/user'
import photoRoutes from './routes/photo'
import serieRoutes from './routes/serie'
import videoRoutes from './routes/video'

const routes = userRoutes   .concat(photoRoutes)
                            .concat(serieRoutes)
                            .concat(videoRoutes)

export default routes