import router from './router.js';
import state from './state.js';
import { renderHomePage } from '../routes/home.js';
import { renderAboutPage } from '../routes/about.js';

// Initialize the application
function initApp() {
    // Add routes to the router
    router.addRoute('index.html', renderHomePage);
    router.addRoute('', renderHomePage);
    router.addRoute('about.html', renderAboutPage);
    
    // Add a fallback route
    router.addRoute('*', () => {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="index.html" class="btn">Go Home</a>
            </div>
        `;
    });
    
    // Add state for landing page viewed
    if (!state.get('ui.landingPageViewed')) {
        state.set('ui.landingPageViewed', false);
    }
    
    // Add event listeners for UI state changes
    // Toggle dark mode button if it exists
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentDarkMode = state.get('ui.darkMode');
            state.set('ui.darkMode', !currentDarkMode);
        });
    }
    
    // Mobile menu toggle if it exists
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const menuOpen = state.get('ui.menuOpen');
            state.set('ui.menuOpen', !menuOpen);
            
            // Apply the state change to the UI
            const mobileMenu = document.querySelector('nav ul');
            if (mobileMenu) {
                if (state.get('ui.menuOpen')) {
                    mobileMenu.classList.add('open');
                } else {
                    mobileMenu.classList.remove('open');
                }
            }
        });
    }
    
    // Initialize the router
    router.init();
    
    // Handle dark mode state changes
    state.subscribe((path, value) => {
        if (path === 'ui.darkMode') {
            if (value) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
}

// Export the initApp function
export { initApp }; 