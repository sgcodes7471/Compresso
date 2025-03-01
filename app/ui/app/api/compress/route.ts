import prisma from '@/lib/prisma';
import { RedisGet } from '@/lib/redis'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId , redirectToSignIn } = await auth()
  
    //check if the user is signed in or not
    if (!userId) {
      //redirect to sign-in page
      return redirectToSignIn();
    }
  
    //check in redis 
    const value:number|boolean = await RedisGet(userId);
    if(!value && typeof value!=='number') throw new Error('Some Issue in Redis');

    //if free capacity is full, then check for premium membership in postgres
    if(typeof value === 'number' && value>=20) {
      //if premium membership does not exist/expired then redirect to premium pages

      const user = await prisma.user.findFirst({
        where:{userId:userId}
      })
      if(!user || user.validTill>Date.now()) NextResponse.json({ error:true , status:300 })
    }
    
    //else direct to make a request to backend_url/compress 
    return NextResponse.json({ userId:userId,value:value,status:200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error:true,status:500 })
  }
}