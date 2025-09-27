"use client"
import React from 'react'
import { LightningIcon, CheckCircleIcon, ClockIcon  } from '@phosphor-icons/react'
const Features = () => {
  return (
    <div className="py-20">
    <section className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl mb-4 text-primary">
        Why Choose Horizon?
      </h2>
      <p className="text-xl text-primary/70 max-w-2xl mx-auto">
        Designed with productivity, organization, and simplicity in mind
      </p>
    </section>
    <section>
      <div className="grid md:grid-cols-3 gap-8 px-10">
        <section className="text-center p-8 border border-accent rounded-2xl">
          <div className="space-y-4">
            <div
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
            >
              <LightningIcon size="32" className=" text-primary" />
            </div>
            <h3 className="text-2xl text-primary">Boost Productivity</h3>
            <p className="text-primary/70">
              Streamline your workflow with intuitive task management. Focus on
              what matters most and accomplish more every day.
            </p>
          </div>
        </section>

         {/* Organization  */}
        <section className="text-center p-8 border border-accent rounded-2xl">
          <div className="space-y-4">
            <div
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircleIcon size="32" className=" text-primary" />
            </div>
            <h3 className="text-2xl text-primary">Stay Organized</h3>
            <p className="text-muted-foreground">
              Keep all your tasks in one place with powerful filtering and
              search capabilities. Never lose track of important deadlines
              again.
            </p>
          </div>
        </section>

        {/* Simplicity */}
        <section className="text-center p-8 border border-accent rounded-2xl">
          <div className="space-y-4">
            <div
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
            >
              <ClockIcon size="32" className=" text-primary" />
            </div>
            <h3 className="text-2xl text-primary">Simple & Fast</h3>
            <p className="text-muted-foreground">
              Clean, distraction-free interface that gets out of your way. Add,
              update, and complete tasks in seconds, not minutes.
            </p>
          </div>
        </section>
      </div>
    </section>
  </div>
  )
}

export default Features