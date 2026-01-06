import React from 'react'

type CardProps = {
  children: React.ReactNode,
  className?: string
}

function Card({children, className}: CardProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  )
}

export default Card
