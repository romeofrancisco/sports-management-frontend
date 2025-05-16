/**
 * This file re-exports the player progress chart components 
 * to maintain backward compatibility while we transition to proper default exports
 */

import PlayerProgressChart from './PlayerProgressChart';
import PlayerProgressMultiView from './PlayerProgressMultiView';

// Re-export components to maintain backward compatibility
export { PlayerProgressChart, PlayerProgressMultiView };
