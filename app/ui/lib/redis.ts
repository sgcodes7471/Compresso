import Redis from 'ioredis' 

const redisClient:Redis = new Redis(`${process.env.REDIS_URL!}`);

export async function RedisGet(key:string):Promise<number|boolean> {
    try {
        const data:string|null = await redisClient.get(key);
        const value:number = !data?0:+data;
        return value;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function RedisSet(key:string, value:number) {
    try {
        await redisClient.set(key,(value+1).toString());
    } catch (error) {
        console.log(error)
    }
}