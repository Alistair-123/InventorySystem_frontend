import React from 'react'

type CardProps = {
  children: React.ReactNode,
  className?: string
}

export default function Buttons({children, className}: CardProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}


