/**
 * CounterAnimation.js
 * A utility for creating animated number counters
 */

// Easing functions for smoother animations
const easings = {
  // Linear animation
  linear: t => t,
  
  // Ease out - starts fast, slows down
  easeOutQuad: t => t * (2 - t),
  
  // Ease out cubic - smoother slow down
  easeOutCubic: t => 1 + (--t) * t * t,
  
  // Ease in out - slow start and end, fast middle
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Bounce effect at the end
  easeOutBounce: t => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
};

/**
 * Animates a value from start to end
 * @param {Object} options The configuration options
 * @param {number} options.start The starting value (default: 0)
 * @param {number} options.end The ending value
 * @param {number} options.duration Duration in milliseconds (default: 2000)
 * @param {string} options.easing Easing function name (default: 'easeOutCubic')
 * @param {Function} options.onUpdate Callback for each animation frame with current value
 * @param {Function} options.onComplete Callback when animation completes
 * @param {number} options.delay Delay before starting animation in ms (default: 0)
 * @param {number} options.decimals Number of decimal places (default: 0)
 */
export const animateValue = (options) => {
  const {
    start = 0,
    end,
    duration = 2000,
    easing = 'easeOutCubic',
    onUpdate,
    onComplete,
    delay = 0,
    decimals = 0
  } = options;
  
  // Handle invalid values
  if (typeof end !== 'number' || typeof onUpdate !== 'function') {
    console.error('Invalid parameters for animateValue');
    return;
  }
  
  // Get easing function or fallback to linear
  const easingFn = easings[easing] || easings.linear;
  
  // Variables for animation
  let startTime = null;
  let animationFrame = null;
  
  // Delayed start
  setTimeout(() => {
    // Animation function
    const animate = (timestamp) => {
      // Set start time on first animation frame
      if (!startTime) startTime = timestamp;
      
      // Calculate progress (0 to 1)
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Apply easing function
      const easedProgress = easingFn(progress);
      
      // Calculate current value
      const currentValue = start + (end - start) * easedProgress;
      
      // Round to specified decimal places
      const roundedValue = Number(currentValue.toFixed(decimals));
      
      // Call update callback with current value
      onUpdate(roundedValue);
      
      // Continue animation if not complete
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Ensure final value is exactly the end value
        onUpdate(Number(end.toFixed(decimals)));
        
        // Call complete callback if provided
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    };
    
    // Start animation
    animationFrame = requestAnimationFrame(animate);
  }, delay);
  
  // Return function to cancel animation
  return {
    cancel: () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    }
  };
};

/**
 * Formats a number with appropriate prefix, suffix and formatting
 * @param {number} value The number to format
 * @param {Object} options Formatting options
 * @param {string} options.prefix Text to add before the number (default: '')
 * @param {string} options.suffix Text to add after the number (default: '')
 * @param {boolean} options.useGrouping Whether to use thousand separators (default: true)
 * @param {string} options.separator Character for thousands separator (default: ',')
 * @param {number} options.decimals Number of decimal places (default: 0)
 * @param {string} options.decimal Character for decimal point (default: '.')
 * @returns {string} Formatted number as string
 */
export const formatNumber = (value, options = {}) => {
  const {
    prefix = '',
    suffix = '',
    useGrouping = true,
    separator = ',',
    decimals = 0,
    decimal = '.'
  } = options;
  
  // Convert to string with fixed decimal places
  let numberString = value.toFixed(decimals);
  
  // Split into integer and decimal parts
  const parts = numberString.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Apply thousand separators to integer part if needed
  let formattedIntegerPart = integerPart;
  if (useGrouping) {
    formattedIntegerPart = '';
    for (let i = 0; i < integerPart.length; i++) {
      if (i > 0 && (integerPart.length - i) % 3 === 0) {
        formattedIntegerPart += separator;
      }
      formattedIntegerPart += integerPart[i];
    }
  }
  
  // Combine parts
  let formattedNumber = formattedIntegerPart;
  if (decimals > 0) {
    formattedNumber += decimal + decimalPart;
  }
  
  // Add prefix and suffix
  return prefix + formattedNumber + suffix;
};

/**
 * Creates a counter with all necessary functionality
 * @param {Object} options Configuration options
 * @param {Element} options.element The DOM element to update
 * @param {number} options.startValue Initial value (default: 0)
 * @param {number} options.endValue Target value
 * @param {number} options.duration Animation duration in ms (default: 2000)
 * @param {string} options.easing Easing function name (default: 'easeOutCubic')
 * @param {Object} options.format Formatting options for the number
 * @param {number} options.delay Delay before starting in ms (default: 0)
 * @returns {Object} Counter control object
 */
export const createCounter = (options) => {
  const {
    element,
    startValue = 0,
    endValue,
    duration = 2000,
    easing = 'easeOutCubic',
    format = {},
    delay = 0
  } = options;
  
  if (!element || typeof endValue !== 'number') {
    console.error('Invalid parameters for createCounter');
    return { start: () => {} };
  }
  
  let animation = null;
  
  // Update the element with formatted value
  const updateElement = (value) => {
    if (element) {
      element.textContent = formatNumber(value, format);
    }
  };
  
  // Initialize with start value
  updateElement(startValue);
  
  return {
    // Start the counter animation
    start: () => {
      animation = animateValue({
        start: startValue,
        end: endValue,
        duration,
        easing,
        decimals: format.decimals || 0,
        delay,
        onUpdate: updateElement
      });
      return animation;
    },
    
    // Update counter to a new value (without animation)
    set: (newValue) => {
      updateElement(newValue);
    },
    
    // Stop animation if running
    stop: () => {
      if (animation) {
        animation.cancel();
      }
    }
  };
};

/**
 * Observer utility to automatically start counters when they enter the viewport
 * @param {NodeList|Array} elements Elements containing counters
 * @param {Object} options Observer options
 * @param {number} options.threshold Visibility threshold (0-1) (default: 0.2)
 * @param {string} options.dataAttribute Data attribute for counter value (default: 'data-count-to')
 * @param {Function} options.callback Optional callback when element becomes visible
 * @returns {IntersectionObserver} The observer instance
 */
export const initCounterObserver = (elements, options = {}) => {
  const {
    threshold = 0.2,
    dataAttribute = 'data-count-to',
    callback
  } = options;

  const counters = {};
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      const id = el.id || `counter-${Object.keys(counters).length}`;
      
      if (entry.isIntersecting) {
        // Element is visible, start counter if not already started
        if (!counters[id] || !counters[id].started) {
          // Get counter parameters from data attributes
          const endValue = parseFloat(el.getAttribute(dataAttribute) || el.textContent);
          const duration = parseInt(el.getAttribute('data-count-duration') || 2000, 10);
          const prefix = el.getAttribute('data-count-prefix') || '';
          const suffix = el.getAttribute('data-count-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-count-decimals') || 0, 10);
          const delay = parseInt(el.getAttribute('data-count-delay') || 0, 10);
          const easing = el.getAttribute('data-count-easing') || 'easeOutCubic';
          
          // Create and start counter
          const counter = createCounter({
            element: el,
            startValue: 0,
            endValue,
            duration,
            easing,
            format: {
              prefix,
              suffix,
              decimals
            },
            delay
          });
          
          counter.start();
          counters[id] = { counter, started: true };
          
          // Call callback if provided
          if (typeof callback === 'function') {
            callback(el, counter);
          }
        }
        
        // Unobserve element after it has started counting
        observer.unobserve(el);
      }
    });
  }, { threshold });
  
  // Start observing elements
  if (elements) {
    Array.from(elements).forEach(el => observer.observe(el));
  }
  
  return {
    observer,
    counters,
    
    // Add more elements to observe
    observe: (newElements) => {
      Array.from(newElements).forEach(el => observer.observe(el));
    },
    
    // Stop observing all elements
    disconnect: () => {
      observer.disconnect();
    }
  };
};

// Create an export object to fix ESLint warning
const counterAnimationExport = {
  animateValue,
  formatNumber,
  createCounter,
  initCounterObserver
};

export default counterAnimationExport; 