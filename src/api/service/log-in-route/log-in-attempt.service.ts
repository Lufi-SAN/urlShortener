import { nextTick } from "node:process"
import { TooManyAttempts } from "../../../domain/user/user.errors.js"
import { redisClient } from "../../connections/redis.connection.js"

//state & attempt are conditionally permanent stores
const stateKey = `log-in_rate-limit:state:`
const attemptKey = `log-in_rate-limit:attempts:`


export const loginAttemptService = {
    async rateLimit(ip:string, username:string) {
        const state = stateKey + `${ip}:${username}`

        //check expiry time of state key. If more than 0, block req-res cycle
        const ttl = await redisClient.ttl(state)
        if (ttl > 0) {
            throw new TooManyAttempts(`Too many log-in attempts. Retry in ${ttl} seconds`)
        }
    },
    async increment(ip:string, username:string) {//On login, after login rate-limit middleware
        const attempts = attemptKey + `${ip}:${username}`

        //increment attempts key as a conditional permanent storage
        const attemptValue =  await redisClient.incr(attempts)
        if (attemptValue === 1) {
            //attempt TTL added only once at first increment
            //You can always increment the key but the TTL remains & runs down consistently
            //This way user doesn't get permanently punished. Wait a while, come back after 5 minutes
            await redisClient.expire(attempts, 300)
        }
    },
    async success(ip:string, username:string) {
        const attempts = attemptKey + `${ip}:${username}`
        const state = stateKey + `${ip}:${username}`
       
        //delete attempts & state keys
        redisClient.del(attempts)
        redisClient.del(state)
    },
    async failure(ip:string, username:string) {
        const attempts = attemptKey + `${ip}:${username}`
        const state = stateKey + `${ip}:${username}`

        //Only works if attempts more than 4; 2-minute cap
        if(Number(await redisClient.get(attempts)) >= 4) { 
            const att = Number(await redisClient.get(attempts))
            const delay = [5, 15, 30, 60][att - 4] ?? 120  
            await redisClient.set(state, 1, { EX: delay })
        }
    }
}