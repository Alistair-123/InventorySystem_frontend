import React from 'react'


function Dashboardheader({title}: {title: string}) {
  return (
    <div className="border-0 border-b h-[80px] flex items-center justify-start border-gray-300 w-full px-10 pt-4 pb-2 font-Med-Poppins">
      
      <p className="font-poppins text-3xl">{title}</p>
    </div>
  )
}

export default Dashboardheader
