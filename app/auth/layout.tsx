import React from 'react'

const AuthLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <section>
        {children}
      </section>
    </div>
    
  )
}

export default AuthLayout