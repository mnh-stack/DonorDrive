// Export all utilities from a single file
export * from './CounterAnimation';
export * from './initCounters';

// Default export combines all utilities
import CounterAnimation from './CounterAnimation';
import initCounters from './initCounters';

export default {
  ...CounterAnimation,
  ...initCounters
}; 