import type { Request, Response, NextFunction } from "express"
import { getUserDBURIDataService } from "../api/service/shortURIs-route/get-user-DB-URI-data.service.js"

const shortURIsController = {
    async renderShortURIsPage(req: Request, res: Response, next: NextFunction) {
        try {
            if(req.user) {
                const userDatabaseURIData = await getUserDBURIDataService(req.user.id)
        
                res.status(200).render('index', {
                    title: 'Create your short URIS here',
                    page: 'pages/shortURIs',
                    script: '/ejs-scripts/shortURIs.js',
                    username: userDatabaseURIData?.username,
                    uriArray: userDatabaseURIData?.mappedUserDBURIData
                })
            }
        } catch(err) {
            next(err)
        }
    },
    async validateShortURIData(req: Request, res: Response, next: NextFunction) {
        
    },
    async createNewShortURI(req: Request, res: Response, next: NextFunction) {

    },
    async modifyExistingShortURI(req: Request, res: Response, next: NextFunction) {

    },
    async deleteExistingShortURI(req: Request, res: Response, next: NextFunction) {

    }
}

export default shortURIsController