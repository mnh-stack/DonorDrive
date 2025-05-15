/**
 * Initialize animations for elements with data-aos attributes
 */
export const initAnimations = () => {
  // Function to check if an element is in viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  };

  // Apply animation to elements that are in viewport
  const handleScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('aos-animate');
      }
    });
  };

  // Initial check for elements in viewport on page load
  setTimeout(() => {
    handleScroll();
  }, 100);

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);

  // Return cleanup function
  return {
    cleanup: () => {
      window.removeEventListener('scroll', handleScroll);
    }
  };
};

export default initAnimations; 