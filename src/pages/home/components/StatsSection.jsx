import React from 'react'
import { Users, Volleyball, Trophy, Calendar } from 'lucide-react'

const stats = [
  { 
    icon: Users, 
    label: 'Active Athletes', 
    value: '100+',
    description: 'Student athletes across all sports programs'
  },
  { 
    icon: Volleyball, 
    label: 'Sports Programs', 
    value: '8+',
    description: 'Varsity and club sports offered'
  },
  { 
    icon: Trophy, 
    label: 'Championships', 
    value: '20+',
    description: 'Titles won in competitions'
  },
  { 
    icon: Calendar, 
    label: 'Annual Events', 
    value: '50+',
    description: 'Games, tournaments, and training sessions'
  },
]

const StatsSection = () => {
  return (
    <section className="lg:py-14 xl:py-16 -mt-16 md:-mt-30 lg:-mt-40 relative z-20">
      <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="relative text-center group bg-card border-primary border rounded-lg py-6 md:py-10"
              >
                {/* Decorative line between items (hidden on mobile for first row) */}
                {index !== 0 && (
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                )}
                {index === 2 && (
                  <div className="block lg:hidden absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                )}
                
                <div className="flex flex-col items-center">
                  {/* Icon with gradient background */}
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-7 h-7 lg:w-8 lg:h-8 text-primary-foreground" />
                  </div>
                  
                  {/* Value with gradient text */}
                  <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </p>
                  
                  {/* Label */}
                  <p className="text-sm lg:text-base font-semibold text-foreground mb-1">
                    {stat.label}
                  </p>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </section>
  )
}

export default StatsSection
