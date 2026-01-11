import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='flex h-dvh overflow-hidden'>
      <Sidebar />

      <main className='flex-1 bg-white overflow-y-auto min-w-0'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
