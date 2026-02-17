import { Router } from "express";
import shortURIsController from "../controllers/shortURIs.controllers.js";

const shortURIsRoute = Router();

shortURIsRoute.get('/', shortURIsController.renderShortURIsPage)

//No need for :id request params since id already exists in jwt 
shortURIsRoute.post('/', shortURIsController.createNewShortURI)

shortURIsRoute.patch('/', shortURIsController.modifyExistingShortURI)

shortURIsRoute.delete('/', shortURIsController.deleteExistingShortURI)

export default shortURIsRoute;


