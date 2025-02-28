import Redis from 'ioredis' 

const redisClient:Redis = new Redis(process.env.REDIS_URL!);

export async function RedisGet(key:string):Promise<number|boolean> {
    try {
        const data:string|null = await redisClient.get(key);
        const value:number|null = !data?0:+data;
        if(value>=20) return false;
        return value;
    } catch (error) {
        return false;
    }
}

export async function RedisSet(key:string, value:number):Promise<boolean> {
    try {
        await redisClient.set(key,value+1);
        return true;
    } catch (error) {
        return false;
    }
}