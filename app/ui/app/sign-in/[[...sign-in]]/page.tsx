import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className='flex w-[100vw] h-[100vh] justify-center items-center'>
    <SignIn />
  </div>
}