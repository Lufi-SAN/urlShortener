import { getUserDBURIDataStore } from "../../store/get-user-DB-URI-data-service/get-user-DB-URI-data.store.js"

export async function getUserDBURIDataService(id: string) {
    try {
        const userDBURIData = await getUserDBURIDataStore(id)
        if (!userDBURIData) {
            return null
        }
        const username = userDBURIData[0].username
        const mappedUserDBURIData = userDBURIData.filter(({is_deleted}) => !is_deleted).map((item) => {
            const {username, ...restObj} = item
            return restObj
        })
        return {username, mappedUserDBURIData}
    } catch(err) {
        throw err
    }
}