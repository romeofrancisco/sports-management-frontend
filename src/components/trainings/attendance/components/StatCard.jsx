import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const StatCard = ({ title, value, subtitle, icon, trend, className }) => (
  <Card className={cn(
    "relative overflow-hidden", 
    "bg-white dark:bg-slate-800",
    "border border-slate-200/60 dark:border-slate-700/60",
    className
  )}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        {title}
      </CardTitle>
      <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
    </CardHeader>
    
    <CardContent>
      <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 dark:text-slate-100">
        {value}
      </div>
      
      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium">
          {subtitle}
        </p>
      )}
      
      {trend !== undefined && (
        <div className="flex items-center mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50">
          <div className={cn(
            "p-1.5 rounded-lg",
            trend > 0 ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"
          )}>
            {trend > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <span className={cn(
              "text-sm font-bold",
              trend > 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"
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

export default StatCard;
