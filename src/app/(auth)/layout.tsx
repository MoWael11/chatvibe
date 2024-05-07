import { ReactNode } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-r from-[#3b4fce] from-80% to-[#5e6fd8] to-95%'>
      {children}
    </div>
  )
}

export default AuthLayout
