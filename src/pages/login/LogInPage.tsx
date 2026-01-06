import React from 'react'
import Card from '../../components/atoms/Card'
import logos from "../../assets/logos.png"
function LogInPage() {
  return (
    <div className=' flex items-center justify-center h-screen'>
        <Card className='flex border-gray-300 rounded-md '>
            

            <Card className=''>
                <img src={logos} alt="" className='h-120 w-120 object-contain'/>
            </Card>

            <Card className=' border border-gray-300 rounded-md p-8 w-80'>
                <form className='flex flex-col gap-4'>
                    <input type="text" placeholder='Username' className='border border-gray-300 rounded-md p-2'/>
                    <input type="password" placeholder='Password' className='border border-gray-300 rounded-md p-2'/>
                    <button type="submit" className='bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600'>Log In</button>
                </form>
            </Card>
        </Card>
    </div>
  )
}

export default LogInPage
