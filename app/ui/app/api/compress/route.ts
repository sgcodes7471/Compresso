import prisma from '@/lib/prisma';
import { RedisGet } from '@/lib/redis'
import { auth , currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId , redirectToSignIn } = await auth()
  
    //check if the user is signed in or not
    if (!userId) {
      //redirect to sign-in page
      return redirectToSignIn();
    }
    const user = await currentUser()
    console.log(user);
    console.log(userId);
  
    //check in redis 
    const value:number|boolean = await RedisGet(userId);
  
    //if free capacity is full, then check for premium membership in postgres
    if(!value) {
      //if premium membership does not exist/expired then redirect to premium pages
      const user = await prisma.User.findFirst({
        where:{userId:userId}
      })
      if(!user || user.validTill>Date.now()) NextResponse.json({ error:true , status:300 })
    }
    
    //else direct to make a request to backend_url/compress 
    return NextResponse.json({ value:value,status:200 });
  } catch (error) {
    return NextResponse.json({ error:true,status:500 })
  }
}