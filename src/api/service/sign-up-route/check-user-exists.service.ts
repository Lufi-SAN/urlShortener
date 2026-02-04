import { checkUserExistsStore } from "../../store/check-user-exists-service/check-user-exists.store.js";

export async function checkUserExistsService(username: string) {
    try {
        const dbResponse = await checkUserExistsStore(username);
        if (dbResponse) {
            return true
        } else return false
    } catch(err) {
        throw err
    }
}

 