import { createCounter, initCounterObserver } from './CounterAnimation';

/**
 * Initializes counters on the page using data attributes 
 * Usage:
 * <div class="counter" data-count-to="500" data-count-suffix="+" data-count-duration="2000"></div>
 */
export const initDataAttributeCounters = () => {
  // Find all elements with the counter class
  const counterElements = document.querySelectorAll('.counter');
  
  // Exit if no counter elements found
  if (!counterElements.length) return null;
  
  // Initialize counters when they enter viewport
  return initCounterObserver(counterElements);
};

/**
 * Manually initializes a counter for a specific element
 * @param {Element} element DOM element for the counter
 * @param {Object} options Counter options
 * @returns {Object} Counter control object
 */
export const initElementCounter = (element, options) => {
  if (!element) return null;
  
  const counter = createCounter({
    element,
    startValue: options.startValue || 0,
    endValue: options.endValue,
    duration: options.duration || 2000,
    easing: options.easing || 'easeOutCubic',
    format: {
      prefix: options.prefix || '',
      suffix: options.suffix || '',
      decimals: options.decimals || 0,
      useGrouping: options.useGrouping !== false
    },
    delay: options.delay || 0
  });
  
  if (options.autoStart !== false) {
    counter.start();
  }
  
  return counter;
};

/**
 * Initializes multiple counters for stat cards with advanced features
 * @param {Element[]} statCards Array of stat card DOM elements
 * @param {Object} options Global options for all counters
 * @returns {Object} Object containing all counter instances
 */
export const initStatCounters = (statCards, options = {}) => {
  const counters = {};
  
  if (!statCards || !statCards.length) return counters;
  
  statCards.forEach((card, index) => {
    // Find counter element inside the card
    const counterElement = card.querySelector('.stat-number');
    if (!counterElement) return;
    
    // Get counter data from the card or element
    const getValue = (attr, defaultValue) => {
      return card.getAttribute(`data-${attr}`) || 
             counterElement.getAttribute(`data-${attr}`) || 
             defaultValue;
    };
    
    // Extract counter configuration
    const endValue = parseFloat(getValue('value', counterElement.textContent));
    const prefix = getValue('prefix', options.prefix || '');
    const suffix = getValue('suffix', options.suffix || '');
    const duration = parseInt(getValue('duration', options.duration || 2000), 10);
    const decimals = parseInt(getValue('decimals', options.decimals || 0), 10);
    const delay = parseInt(getValue('delay', options.delay || index * 100), 10);
    const easing = getValue('easing', options.easing || 'easeOutCubic');
    
    // Create counter with extracted configuration
    const counter = createCounter({
      element: counterElement,
      startValue: 0,
      endValue,
      duration,
      easing,
      format: {
        prefix,
        suffix,
        decimals,
        useGrouping: true
      },
      delay
    });
    
    // Store counter reference
    const id = card.id || `stat-counter-${index}`;
    counters[id] = counter;
    
    // Handle progress bar if it exists
    const progressBar = card.querySelector('.stat-progress-bar');
    if (progressBar) {
      progressBar.style.width = '0%';
      setTimeout(() => {
        progressBar.style.width = '100%';
      }, delay);
    }
  });
  
  return counters;
};

/**
 * Initialize all counters with IntersectionObserver and auto-start
 */
export const initAllCounters = () => {
  // Get all stat card sections
  const statsSections = document.querySelectorAll('.stats-section');
  if (!statsSections.length) return {};
  
  const allCounters = {};
  
  statsSections.forEach((section, sectionIndex) => {
    // Create observer for the section
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Section is visible, initialize all counters in this section
          const statCards = section.querySelectorAll('.stat-card');
          const counters = initStatCounters(statCards, {
            delay: sectionIndex * 100, // Stagger between sections
            duration: 2000
          });
          
          // Start all counters in this section
          Object.values(counters).forEach(counter => counter.start());
          
          // Store counters in global object
          Object.assign(allCounters, counters);
          
          // Unobserve section after triggering
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.2 });
    
    // Start observing the section
    observer.observe(section);
  });
  
  return {
    counters: allCounters,
    // Reset all counters (useful for page transitions)
    reset: () => {
      Object.values(allCounters).forEach(counter => {
        counter.stop();
        counter.set(0);
      });
    }
  };
};

// Create an export object to fix ESLint warning
const countersExport = {
  initDataAttributeCounters,
  initElementCounter,
  initStatCounters,
  initAllCounters
};

export default countersExport; 