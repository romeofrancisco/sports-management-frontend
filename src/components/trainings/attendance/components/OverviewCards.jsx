import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OverviewCards = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = '',
  color = '',
  bgColor = '',
  borderColor = '',
  iconBg = '',
  textAccent = '',
  description = '',
}) => (
  <Card
    className={cn(
      'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105',
      bgColor,
      borderColor,
      className
    )}
  >
    <div className={cn('absolute inset-0 bg-gradient-to-br', color, 'opacity-5')} />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={cn('p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110', iconBg)}>
        {icon}
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className={cn('text-2xl font-bold mb-1', textAccent)}>{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium">{subtitle}</p>
      )}
      {trend !== undefined && (
        <div className="flex items-center mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50">
          <div className={cn(
            'p-1.5 rounded-lg',
            trend > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-red-100 dark:bg-red-900/30'
          )}>
            {trend > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-red-800 dark:text-red-400" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <span className={cn(
              'text-sm font-bold',
              trend > 0 ? 'text-red-700 dark:text-red-300' : 'text-red-700 dark:text-red-300'
            )}>
              {trend > 0 ? '+' : ''}{Math.abs(trend).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium">vs last period</span>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export default OverviewCards;
