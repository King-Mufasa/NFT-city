import React from 'react'
import Layout from '../../layout/layout'

const RewardsPage = () => {
  return (
    <Layout>
      <div className='py-3 sm:py-8 md:py-10 lg:py-12 xl:py-16 min-h-full flex justify-center'>
        <div className='max-w-7xl mx-auto px-3 sm:px-6 md:px-8 w-full'>
          <div className='bg-ne-deepBlue bg-opacity-75 shadow-inset-card p-3 md:p-4 rounded-md'>
            <div className="flex justify-between space-x-2 mb-4">
              <div className="flex items-center space-x-2">
                <svg viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0">
                  <path d="M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08Z" fill="white">
                  </path>
                </svg>
                <p className="text-lg font-semibold text-white">Social rewards</p>
              </div>
              <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:hidden w-7 h-7 ml-1.5">
                <path d="M18.9232 12L12.9132 18.01L11.4982 16.596L16.0982 11.996L11.4982 7.39601L12.9132 5.99001L18.9232 11.999L18.9232 12ZM13.4992 12L7.48822 18.01L6.07422 16.596L10.6742 11.996L6.07422 7.39601L7.48822 5.99001L13.4982 11.999L13.4992 12Z" fill="white">
                </path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default RewardsPage