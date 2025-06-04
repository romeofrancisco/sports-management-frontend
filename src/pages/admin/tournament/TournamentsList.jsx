import React from 'react'
import UniversityPageHeader from '@/components/common/UniversityPageHeader'
import { Trophy } from 'lucide-react'

const TournamentsList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Tournaments Management"
          subtitle="Administrative Portal"
          description="Create and manage tournaments for your leagues"
          buttonText="Create Tournament"
          buttonIcon={Trophy}
          onButtonClick={() => {/* TODO: Add tournament creation */}}
          showOnlineStatus={true}
          showUniversityColors={true}
        />
        
        <div className="animate-in fade-in-50 duration-500 delay-100">
          {/* TODO: Add tournaments container */}
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No tournaments yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first tournament to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentsList
