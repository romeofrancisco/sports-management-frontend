import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, Activity, Shield, ChevronRight } from 'lucide-react'

const roles = [
  {
    title: 'Coaches',
    description: 'Manage your team, create training sessions, track player performance, and communicate with your athletes effectively.',
    icon: UserCheck,
    features: ['Team Management', 'Training Management', 'Performance Analytics', 'Player Communication'],
  },
  {
    title: 'Athletes',
    description: 'View schedules, track your progress, access training assignments, and stay connected with your team.',
    icon: Activity,
    features: ['Notifications', 'Schedule Access', 'Progress Tracking', 'Team Updates'],
  },
  {
    title: 'Administrators',
    description: 'Oversee all sports programs, manage facilities, generate reports, and ensure smooth operations.',
    icon: Shield,
    features: ['Sports Management', 'Facility Management', 'League and Tournament Management', 'User Management'],
  },
]

const UserRolesSection = () => {
  return (
    <section className="py-16 lg:py-24" id="roles">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">For Everyone</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Built for <span className="text-primary">Your Role</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're a coach, player, or administrator, our platform provides 
            tailored features to meet your specific needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="card-hover-effect border-primary/10 hover:border-primary/30">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <role.icon className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-foreground">{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed text-center mb-6">
                  {role.description}
                </CardDescription>
                <ul className="space-y-2">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="w-3 h-3 text-secondary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UserRolesSection
