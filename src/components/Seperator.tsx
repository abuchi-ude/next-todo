import React from 'react'

const Seperator = () => {
  return (
     <div className="flex items-center my-4">
    <div className="flex-grow h-px bg-gray-300"></div>
    <span className="mx-2 text-gray-500 font-semibold">OR</span>
    <div className="flex-grow h-px bg-gray-300"></div>
  </div>
  )
}

export default Seperator