import {utilService} from '../services/utilService.js'
// import { getFullName, getSortFunc, verifyBeforeExit, secondsToTime, makeId, getUrlParamsFromObj, paginate, isMobileDevice ,isTabletScreen,isEmailValid} from "../services/utilService"




export const utilServicePlugin = {
    install: (app) => {
        app.config.globalProperties.$utilService = utilService

    }
}