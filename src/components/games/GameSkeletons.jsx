import GameCardSkeleton from './GameCardSkeleton';
export { default as GameCardSkeleton } from './GameCardSkeleton';
export { default as GameTableSkeleton } from './GameTableSkeleton';

// Convenience component for multiple card skeletons
export const GameCardsSkeletons = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <GameCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Convenience component for status sections with skeleton cards
export const StatusSectionSkeleton = ({ title, count = 3 }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-accent animate-pulse rounded" />
        <div className="h-5 w-24 bg-accent animate-pulse rounded" />
        <div className="h-5 w-8 bg-accent animate-pulse rounded-full" />
      </div>
      <GameCardsSkeletons count={count} />
    </div>
  );
};
