import React from 'react';
import OverviewCards from '@/components/common/OverviewCards';
import { Users, Gamepad2, UserCheck, Target } from 'lucide-react';

const SystemOverviewCards = ({ overview }) => {
  const systemStats = [
    {
      title: 'Total Teams',
      value: overview?.system_overview?.total_teams || 0,
      icon: Users,
      description: 'Active teams',

      color: 'from-primary via-primary/90 to-primary/80',
      iconBg: 'bg-primary',
      iconColor: 'text-primary',
      link: '/teams',
    },
    {
      title: 'Active Players',
      value: overview?.system_overview?.total_players || 0,
      icon: UserCheck,
      description: 'Players with teams',
      color: 'from-primary via-primary/90 to-primary/80',
      iconBg: 'bg-primary',
      iconColor: 'text-primary',
      link: '/players',
    },
    {
      title: 'Total Coaches',
      value: overview?.system_overview?.total_coaches || 0,
      icon: Target,
      description: 'Active coaches',
      color: 'from-primary/80 via-primary/70 to-primary/60',
      iconBg: 'bg-gradient-to-br from-primary to-primary/80',
      iconColor: 'text-primary',
      link: '/coaches',
    },
    {
      title: 'Games Played',
      value: overview?.system_overview?.total_games || 0,
      icon: Gamepad2,
      description: 'All-time games',
      color: 'from-primary/80 via-primary/70 to-primary/60',
      iconBg: 'bg-gradient-to-br from-primary to-primary/80',
      iconColor: 'text-primary',
      link: '/games',
    },
  ];

  return <OverviewCards stats={systemStats} />;
};

export default SystemOverviewCards;
