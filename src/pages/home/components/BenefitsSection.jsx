import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Calendar, Trophy, BarChart3 } from 'lucide-react'

const benefits = [
  {
    title: 'Team Management',
    description: 'Organize rosters, track player profiles, and manage teams across all sports programs.',
    icon: Users,
  },
  {
    title: 'Smart Scheduling',
    description: 'Schedule games, training sessions, and reserve facilities with an integrated calendar.',
    icon: Calendar,
  },
  {
    title: 'Tournament System',
    description: 'Create brackets, manage competitions, and track standings for athletic events.',
    icon: Trophy,
  },
  {
    title: 'Performance Tracking',
    description: 'Monitor athlete statistics and analyze team performance with detailed analytics.',
    icon: BarChart3,
  },
]

const BenefitsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30" id='benefits'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Key Benefits</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Streamline Your <span className="text-primary">Athletic Operations</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center card-hover-effect border-primary/10">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
