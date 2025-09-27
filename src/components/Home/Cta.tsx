import React from 'react'
import Link from 'next/link'

const Cta = () => {
  return (
    <div className="bg-primary/5 py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl mb-6 text-primary">
        Ready to Get Organized?
      </h2>
      <p className="text-xl text-primary/70 mb-8">
        Join thousands of productive people who trust TodoApp to manage their
        daily tasks.
      </p>
      <Link
        href="/add-todo"
        className="text-white bg-primary px-6 py-3 rounded-md font-medium"
      >
        Create Your First Todo
      </Link>
    </div>
  </div>
  )
}

export default Cta