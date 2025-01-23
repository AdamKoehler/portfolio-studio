import React from 'react'

const AuthLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <section className='w-full h-screen flex items-center justify-center'>
       <div>
            {children}
        </div> 
    </section>
    
  )
}

export default AuthLayout