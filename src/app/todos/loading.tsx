import React from 'react'

const Loading = () => {
  return (
    <div className="overlay ">
    <div className="spinner animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
    <p className='mt-[10px] text-lg text-primary'>Loading...</p>
  </div>
  )
}

export default Loading
