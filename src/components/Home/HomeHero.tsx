import React from 'react'
import Link from 'next/link'

const HomeHero = () => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/20 py-20">
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl md:text-6xl mb-6 text-primary">
        Stay Organized, Stay Productive
      </h1>
      <p className="text-xl text-primary/70 mb-8 max-w-2xl mx-auto">
        TodoApp helps you manage your tasks efficiently with a clean, intuitive
        interface. Get more done with less effort and never miss an important
        task again.
      </p>
    </section>
    <section
      className="flex flex-col sm:flex-row gap-4 justify-center items-center font-medium"
    >
      <Link
        href="/signup"
        className="text-white bg-primary px-6 py-3 rounded-md w-fit"
        >Get Started</Link>
      <Link
        href="/todos"
        className="bg-white border border-accent px-6 py-3 rounded-md w-fit"
        >View Your Todos</Link>
    </section>
  </div>
  )
}

export default HomeHero